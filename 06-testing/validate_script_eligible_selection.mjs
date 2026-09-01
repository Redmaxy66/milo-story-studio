import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowPath = path.join(root, '04-n8n-workflows', 'development', 'Milo Script Generator v0.1.json');
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

assert.equal(workflow.id, 'cfRT2oHADjTQi6I6');
assert.equal(workflow.name, 'Milo Script Generator v0.1');
assert.equal(workflow.active, false);
assert.equal(workflow.settings.errorWorkflow, '3an2myLOF7o4STK8');
assert.equal(node('Call Failure Handler').parameters.workflowId.value, '3an2myLOF7o4STK8');
assert.deepEqual(workflow.pinData, {});
assert.equal(workflow.nodes.length, 34);
assert.equal(Object.keys(workflow.connections).length, 33);
assert.equal(edgeCount, 41);

const reader = node('Read Candidate Stories');
assert.equal(reader.executeOnce, true);
assert.equal(reader.parameters.options.returnFirstMatch, false);
assert.equal(reader.parameters.sheetName.cachedResultName, 'Stories');
assert.equal(reader.credentials.googleSheetsOAuth2Api.id, 'QG2OeymCBBUfhfMJ');

const selector = node('Select Eligible Script Outline');
assert.equal(selector.parameters.mode, 'runOnceForAllItems');
const runSelector = new Function('$input', '$', selector.parameters.jsCode);
const select = (stories, outlines) => runSelector(
  { all: () => stories.map((json) => ({ json: structuredClone(json) })) },
  (name) => ({
    all: () => {
      assert.equal(name, 'Validate Approved Outline Batch');
      return outlines.map((json) => ({ json: structuredClone(json) }));
    },
  }),
).map((item) => item.json);

const governedStory = (storyId, rowNumber, status = 'OUTLINE_APPROVED') => ({
  storyId,
  row_number: rowNumber,
  status,
  canonInitializationState: 'ASSIGNED',
  canonVersion: expectedVersion,
  canonRef: expectedRef,
});
const legacyStory = (storyId, rowNumber, status = 'SCRIPT_GENERATED') => ({
  storyId,
  row_number: rowNumber,
  status,
  canonInitializationState: '',
  canonVersion: '',
  canonRef: '',
});
const governedOutline = (storyId, rowNumber, canonRef = expectedRef) => ({
  valid: true,
  storyId,
  row_number: rowNumber,
  outlineId: `${storyId}-O01`,
  conceptId: `${storyId}-C01`,
  approvalStatus: 'APPROVED',
  approvalProcessedAt: '2026-09-01T00:00:00.000Z',
  canonVersion: expectedVersion,
  canonRef,
});
const legacyOutline = (storyId, rowNumber) => ({
  valid: true,
  storyId,
  row_number: rowNumber,
  outlineId: `${storyId}-O01`,
  conceptId: `${storyId}-C01`,
  approvalStatus: 'APPROVED',
  approvalProcessedAt: '2026-01-01T00:00:00.000Z',
  canonVersion: '',
  canonRef: '',
});

let result = select(
  [legacyStory('MILO-001', 2), governedStory('MILO-007', 8)],
  [legacyOutline('MILO-001', 2), governedOutline('MILO-007', 8)],
);
assert.equal(result.length, 1);
assert.equal(result[0].storyId, 'MILO-007');
assert.equal(result[0].selectedOutline.outlineId, 'MILO-007-O01');
assert.equal(result[0].scriptOutlineEligible, true);

result = select(
  [legacyStory('MILO-001', 2), governedStory('MILO-002', 3, 'SCRIPT_GENERATED'), governedStory('MILO-007', 8)],
  [legacyOutline('MILO-001', 2), governedOutline('MILO-002', 3), governedOutline('MILO-007', 8)],
);
assert.equal(result[0].storyId, 'MILO-007');

const historicalStories = [legacyStory('MILO-001', 2), governedStory('MILO-002', 3, 'SCRIPT_GENERATED')];
const historicalOutlines = [legacyOutline('MILO-001', 2), governedOutline('MILO-002', 3)];
const historicalSnapshot = structuredClone([historicalStories, historicalOutlines]);
assert.deepEqual(select(historicalStories, historicalOutlines), []);
assert.deepEqual([historicalStories, historicalOutlines], historicalSnapshot, 'Historical candidates must remain untouched');

result = select(
  [{ ...governedStory('MILO-009', 9), canonRef: 'broken' }],
  [governedOutline('MILO-009', 9)],
);
assert.equal(result.length, 1);
assert.equal(result[0].scriptOutlineEligible, false);
assert.equal(result[0].scriptOutlineCandidateOutcome, 'INTEGRITY_FAILURE');
assert.equal(result[0].errorCode, 'CANON_LINEAGE_INVALID');

result = select(
  [governedStory('MILO-010', 10)],
  [governedOutline('MILO-010', 10, 'a'.repeat(40))],
);
assert.equal(result[0].errorCode, 'CANON_LINEAGE_MISMATCH');

result = select(
  [governedStory('MILO-012', 12), governedStory('MILO-011', 11), governedStory('MILO-013', 11)],
  [governedOutline('MILO-012', 12), governedOutline('MILO-013', 11), governedOutline('MILO-011', 11)],
);
assert.equal(result[0].storyId, 'MILO-011', 'numeric row_number then storyId must select deterministically');
assert.equal(result[0].selectedOutline.storyId, result[0].storyId, 'selected Outline must remain bound to its Story');

assert.deepEqual(targets('Approved Outline Batch Is Valid', 0), ['Read Candidate Stories']);
assert.deepEqual(targets('Read Candidate Stories'), ['Select Eligible Script Outline']);
assert.deepEqual(targets('Select Eligible Script Outline'), ['Script Eligible Outline Selected']);
assert.deepEqual(targets('Script Eligible Outline Selected', 0), ['Validate Canon Lineage']);
assert.deepEqual(targets('Script Eligible Outline Selected', 1), ['Prepare Canon Lineage Failure']);

assert.deepEqual(targets('Canon Lineage Is Valid', 0), ['Story Is Ready For Script Generation']);
assert.deepEqual(targets('Story Is Ready For Script Generation', 0), ['Read Existing Script']);
assert.deepEqual(targets('Read Existing Script'), ['Script Does Not Exist']);
assert.deepEqual(targets('Script Does Not Exist', 0), ['Restore Approved Outline']);
assert.deepEqual(targets('Script Does Not Exist', 1), ['Prepare Script Already Exists Failure']);
assert.equal(node('Prepare Script Already Exists Failure').parameters.assignments.assignments.find((a) => a.name === 'errorCode').value, 'SCRIPT_ALREADY_EXISTS');

const canonReference = node('Get Script Canon Context').parameters.additionalParameters.reference;
assert.equal(canonReference, "={{ $('Select Eligible Script Outline').first().json.canonRef }}");
assert.doesNotMatch(canonReference, /HEAD|main|master|latest|newest/);
assert.match(node('Validate Canon Lineage').parameters.jsCode, /selectedOutline/);
assert.match(node('Restore Approved Outline').parameters.jsCode, /selectedOutline/);

const failureAssignments = node('Prepare Story Not Ready Failure').parameters.assignments.assignments;
const storyId = failureAssignments.find((assignment) => assignment.name === 'storyId');
const storyStatus = failureAssignments.find((assignment) => assignment.name === 'StoryStatus');
assert.ok(storyId);
assert.ok(!failureAssignments.some((assignment) => assignment.name === 'stroyId'));
assert.equal(storyId.value, "={{ $json.storyId ?? '' }}");
assert.equal(storyStatus.value, "={{ $json.status ?? '' }}");
const literalStoryId = new Function('$json', `return (${storyId.value.slice(3, -2)});`)({ storyId: 'MILO-007' });
assert.equal(literalStoryId, 'MILO-007');
assert.doesNotMatch(literalStoryId, /^=/);
assert.notEqual(literalStoryId, '#NAME?');

for (const candidate of workflow.nodes.filter(
  (item) => item.type === 'n8n-nodes-base.googleSheets' && item.parameters?.operation === 'append',
)) {
  assert.notEqual(candidate.retryOnFail, true, `${candidate.name}: Sheets append must not retry`);
}

console.log('PASS Script Generator selects governed eligible Outline over historical candidates');
console.log('PASS ineligible-only no-op, integrity failure routing, and deterministic selection');
console.log('PASS Story binding, duplicate guard ordering, and immutable Story canonRef retrieval');
console.log('PASS literal handled-failure storyId and Sheets append retry prohibition');
