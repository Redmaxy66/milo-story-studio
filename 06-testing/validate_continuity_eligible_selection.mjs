import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowPath = path.join(root, '04-n8n-workflows', 'development', 'Milo Continuity Reviewer v0.1.json');
const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
const expectedVersion = 'canon-v1.0';
const expectedRef = '977755913d9ad41e4f16392d01ea993507af4102';

const node = (name) => {
  const found = workflow.nodes.find((candidate) => candidate.name === name);
  assert.ok(found, `Missing node ${name}`);
  return found;
};
const targets = (name, output = 0) =>
  (workflow.connections[name]?.main?.[output] ?? []).map((connection) => connection.node);
const edgeCount = Object.values(workflow.connections)
  .flatMap((connection) => Object.values(connection))
  .flat(2).length;

assert.equal(workflow.id, 'K4HP95loWJiNwjlP');
assert.equal(workflow.name, 'Milo Continuity Reviewer v0.1');
assert.equal(workflow.active, false);
assert.equal(workflow.settings.errorWorkflow, '3an2myLOF7o4STK8');
assert.equal(node('Call Failure Handler').parameters.workflowId.value, '3an2myLOF7o4STK8');
assert.deepEqual(workflow.pinData, {});
assert.equal(workflow.nodes.length, 35);
assert.equal(Object.keys(workflow.connections).length, 34);
assert.equal(edgeCount, 43);

const reader = node('Read Candidate Stories');
assert.equal(reader.executeOnce, true);
assert.equal(reader.parameters.options.returnFirstMatch, false);
assert.equal(reader.parameters.sheetName.cachedResultName, 'Stories');
assert.equal(reader.credentials.googleSheetsOAuth2Api.id, 'QG2OeymCBBUfhfMJ');

const selector = node('Select Eligible Continuity Script');
assert.equal(selector.parameters.mode, 'runOnceForAllItems');
const runSelector = new Function('$input', '$', selector.parameters.jsCode);
const select = (stories, scripts) => runSelector(
  { all: () => stories.map((json) => ({ json: structuredClone(json) })) },
  (name) => ({
    all: () => {
      assert.equal(name, 'Validate Approved Script');
      return scripts.map((json) => ({ json: structuredClone(json) }));
    },
  }),
).map((item) => item.json);

const governedStory = (storyId, rowNumber, status = 'SCRIPT_APPROVED') => ({
  storyId,
  row_number: rowNumber,
  status,
  canonInitializationState: 'ASSIGNED',
  canonVersion: expectedVersion,
  canonRef: expectedRef,
});
const legacyStory = (storyId, rowNumber, status = 'SCRIPT_REVISION_REQUIRED') => ({
  storyId,
  row_number: rowNumber,
  status,
  canonInitializationState: '',
  canonVersion: '',
  canonRef: '',
});
const governedScript = (storyId, rowNumber, canonRef = expectedRef) => ({
  valid: true,
  storyId,
  row_number: rowNumber,
  scriptId: `${storyId}-S01`,
  outlineId: `${storyId}-O01`,
  conceptId: `${storyId}-C01`,
  approvalStatus: 'APPROVED',
  approvalProcessedAt: '2026-09-01T00:00:00.000Z',
  version: 1,
  scriptText: 'A governed test script.',
  canonVersion: expectedVersion,
  canonRef,
});
const legacyScript = (storyId, rowNumber) => ({
  valid: true,
  storyId,
  row_number: rowNumber,
  scriptId: `${storyId}-S01`,
  outlineId: `${storyId}-O01`,
  conceptId: `${storyId}-C01`,
  approvalStatus: 'APPROVED',
  approvalProcessedAt: '2026-01-01T00:00:00.000Z',
  version: 1,
  scriptText: 'A historical test script.',
  canonVersion: '',
  canonRef: '',
});

let result = select(
  [governedStory('MILO-001', 2, 'SCRIPT_REVISION_REQUIRED'), governedStory('MILO-007', 8)],
  [governedScript('MILO-001', 2), governedScript('MILO-007', 3)],
);
assert.equal(result.length, 1);
assert.equal(result[0].storyId, 'MILO-007');
assert.equal(result[0].selectedScript.scriptId, 'MILO-007-S01');
assert.equal(result[0].continuityScriptEligible, true);

result = select(
  [
    governedStory('MILO-001', 2, 'SCRIPT_REVISION_REQUIRED'),
    legacyStory('MILO-002', 3),
    governedStory('MILO-003', 4, 'CONTINUITY_REVIEWED'),
    governedStory('MILO-007', 8),
  ],
  [
    governedScript('MILO-001', 2),
    legacyScript('MILO-002', 3),
    governedScript('MILO-003', 4),
    governedScript('MILO-007', 5),
  ],
);
assert.equal(result[0].storyId, 'MILO-007');

const historicalStories = [
  governedStory('MILO-001', 2, 'SCRIPT_REVISION_REQUIRED'),
  governedStory('MILO-003', 4, 'CONTINUITY_REVIEWED'),
];
const historicalScripts = [governedScript('MILO-001', 2), governedScript('MILO-003', 4)];
assert.deepEqual(select(historicalStories, historicalScripts), []);

const legacyStories = [legacyStory('MILO-002', 3)];
const legacyScripts = [legacyScript('MILO-002', 3)];
const legacySnapshot = structuredClone([legacyStories, legacyScripts]);
assert.deepEqual(select(legacyStories, legacyScripts), []);
assert.deepEqual([legacyStories, legacyScripts], legacySnapshot, 'PRE-CANON LEGACY candidates must remain untouched');

result = select(
  [{ ...governedStory('MILO-009', 9), canonRef: 'broken' }],
  [governedScript('MILO-009', 9)],
);
assert.equal(result.length, 1);
assert.equal(result[0].continuityScriptEligible, false);
assert.equal(result[0].continuityScriptCandidateOutcome, 'INTEGRITY_FAILURE');
assert.equal(result[0].errorCode, 'CANON_LINEAGE_INVALID');

result = select(
  [governedStory('MILO-010', 10)],
  [governedScript('MILO-010', 10, 'a'.repeat(40))],
);
assert.equal(result[0].errorCode, 'CANON_LINEAGE_MISMATCH');

result = select([], [governedScript('MILO-014', 14)]);
assert.equal(result[0].errorCode, 'APPROVED_SCRIPT_INVALID');
assert.match(result[0].message, /does not resolve/);

result = select(
  [governedStory('MILO-015', 15), governedStory('MILO-015', 16)],
  [governedScript('MILO-015', 15)],
);
assert.equal(result[0].errorCode, 'APPROVED_SCRIPT_INVALID');
assert.match(result[0].message, /multiple Story rows/);

result = select(
  [governedStory('MILO-012', 12), governedStory('MILO-011', 11), governedStory('MILO-013', 11)],
  [governedScript('MILO-012', 12), governedScript('MILO-013', 11), governedScript('MILO-011', 11)],
);
assert.equal(result[0].storyId, 'MILO-011', 'numeric row_number then storyId must select deterministically');
assert.equal(result[0].selectedScript.storyId, result[0].storyId, 'selected Script must remain bound to its Story');

assert.deepEqual(targets('Approved Script Is Valid', 0), ['Read Candidate Stories']);
assert.deepEqual(targets('Read Candidate Stories'), ['Select Eligible Continuity Script']);
assert.deepEqual(targets('Select Eligible Continuity Script'), ['Continuity Eligible Script Selected']);
assert.deepEqual(targets('Continuity Eligible Script Selected', 0), ['Validate Canon Lineage']);
assert.deepEqual(targets('Continuity Eligible Script Selected', 1), ['Prepare Canon Lineage Failure']);
assert.deepEqual(targets('Prepare Canon Lineage Failure'), ['Call Failure Handler']);

assert.deepEqual(targets('Canon Lineage Is Valid', 0), ['Story Is Ready For Continuity Review']);
assert.deepEqual(targets('Story Is Ready For Continuity Review', 0), ['Read Existing Continuity Review']);
assert.deepEqual(targets('Read Existing Continuity Review'), ['Continuity Review Does Not Exist']);
assert.deepEqual(targets('Continuity Review Does Not Exist', 0), ['Prepare Continuity Input']);
assert.deepEqual(targets('Continuity Review Does Not Exist', 1), ['Prepare Duplicate Continuity Review Failure']);
assert.deepEqual(targets('Prepare Continuity Review Record'), ['Save Continuity Review']);

const canonReferences = ['Get Milo Canon Context', 'Get Continuity Rules']
  .map((name) => node(name).parameters.additionalParameters.reference);
assert.deepEqual(canonReferences, [
  "={{ $('Select Eligible Continuity Script').first().json.canonRef }}",
  "={{ $('Select Eligible Continuity Script').first().json.canonRef }}",
]);
for (const reference of canonReferences) assert.doesNotMatch(reference, /HEAD|main|master|latest|newest/);
assert.match(node('Validate Canon Lineage').parameters.jsCode, /selectedScript/);

const selectionFailureAssignments = node('Prepare Canon Lineage Failure').parameters.assignments.assignments;
assert.equal(
  selectionFailureAssignments.find((assignment) => assignment.name === 'nodeName').value,
  "={{ $json.selectionFailureNode ?? 'Validate Canon Lineage' }}",
);

const assessmentContract = JSON.stringify({
  parser: node('Continuity Output Parser').parameters,
  validator: node('Validate Continuity Review').parameters,
});
for (const resultName of ['PASS', 'REVIEW_REQUIRED', 'FAIL']) {
  assert.match(assessmentContract, new RegExp(resultName), `Continuity result ${resultName} was lost`);
}

for (const candidate of workflow.nodes.filter(
  (item) => item.type === 'n8n-nodes-base.googleSheets' && item.parameters?.operation === 'append',
)) {
  assert.notEqual(candidate.retryOnFail, true, `${candidate.name}: Sheets append must not retry`);
}

console.log('PASS Continuity Reviewer selects governed eligible Script over historical candidates');
console.log('PASS ineligible-only no-op, PRE-CANON exclusion, and controlled integrity failures');
console.log('PASS deterministic Story binding and duplicate Review guard ordering');
console.log('PASS immutable Story canonRef retrieval and continuity assessment semantics');
console.log('PASS workflow controls, zero pins, and Sheets append retry prohibition');
