import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowPath = path.join(root, '04-n8n-workflows', 'development', 'Milo Outline Generator v0.1.json');
const statusPath = path.join(root, '02-story-system', 'STORY_STATUS_MODEL.md');
const errorPath = path.join(root, '02-story-system', 'ERROR_CODE_REGISTER.md');

const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
const statusModel = fs.readFileSync(statusPath, 'utf8');
const errorRegister = fs.readFileSync(errorPath, 'utf8');

const expectedVersion = 'canon-v1.0';
const expectedRef = '977755913d9ad41e4f16392d01ea993507af4102';
const handlerId = '3an2myLOF7o4STK8';

const node = (name) => {
  const found = workflow.nodes.find((candidate) => candidate.name === name);
  assert.ok(found, `Missing node ${name}`);
  return found;
};
const targets = (name, output = 0) => (workflow.connections[name]?.main?.[output] ?? []).map((connection) => connection.node);

assert.equal(workflow.id, 'SCTO6xUfrlKczeP5');
assert.equal(workflow.name, 'Milo Outline Generator v0.1');
assert.equal(workflow.active, false);
assert.equal(workflow.settings.errorWorkflow, handlerId);
assert.equal(node('Call Failure Handler').parameters.workflowId.value, handlerId);
assert.deepEqual(workflow.pinData, {});
assert.equal(workflow.nodes.length, 30);
assert.equal(Object.keys(workflow.connections).length, 29);

const reader = node('Read Eligible Stories');
assert.equal(reader.parameters.options.returnFirstMatch, false);
assert.equal(reader.parameters.filtersUI.values[0].lookupColumn, 'status');
assert.equal(reader.parameters.filtersUI.values[0].lookupValue, 'CONCEPT_APPROVED');
assert.equal(reader.credentials.googleSheetsOAuth2Api.id, 'QG2OeymCBBUfhfMJ');

const selector = node('Select Eligible Outline Story');
assert.equal(selector.parameters.mode, 'runOnceForAllItems');
const runSelector = new Function('$input', selector.parameters.jsCode);
const selectCandidates = (stories) =>
  runSelector({ all: () => stories.map((json) => ({ json: structuredClone(json) })) }).map((item) => item.json);

const legacy = (storyId, rowNumber) => ({
  storyId,
  row_number: rowNumber,
  status: 'CONCEPT_APPROVED',
  canonInitializationState: '',
  canonVersion: '',
  canonRef: '',
});
const governed = (storyId, rowNumber, marker = 'ASSIGNED') => ({
  storyId,
  row_number: rowNumber,
  status: 'CONCEPT_APPROVED',
  canonInitializationState: marker,
  canonVersion: expectedVersion,
  canonRef: expectedRef,
});

let selected = selectCandidates([legacy('MILO-004', 5), governed('MILO-007', 8)]);
assert.equal(selected.length, 1);
assert.equal(selected[0].storyId, 'MILO-007');
assert.equal(selected[0].outlineCandidateOutcome, 'ELIGIBLE');

selected = selectCandidates([
  legacy('MILO-002', 3),
  legacy('MILO-004', 5),
  legacy('MILO-006', 7),
  governed('MILO-007', 8),
]);
assert.equal(selected.length, 1);
assert.equal(selected[0].storyId, 'MILO-007');

const legacyOnly = [legacy('MILO-002', 3), legacy('MILO-004', 5)];
const legacySnapshot = structuredClone(legacyOnly);
selected = selectCandidates(legacyOnly);
assert.deepEqual(selected, []);
assert.deepEqual(legacyOnly, legacySnapshot, 'PRE-CANON LEGACY inputs must remain untouched');

for (const valid of [governed('MILO-007', 8), governed('MILO-008', 9, '')]) {
  selected = selectCandidates([legacy('MILO-004', 5), valid]);
  assert.equal(selected.length, 1);
  assert.equal(selected[0].storyId, valid.storyId);
  assert.equal(selected[0].outlineCandidateEligible, true);
}

selected = selectCandidates([{
  storyId: 'MILO-009',
  row_number: 10,
  status: 'CONCEPT_APPROVED',
  canonInitializationState: 'ASSIGNED',
  canonVersion: 'broken',
  canonRef: expectedRef,
}]);
assert.equal(selected.length, 1);
assert.equal(selected[0].outlineCandidateEligible, false);
assert.equal(selected[0].outlineCandidateOutcome, 'INTEGRITY_FAILURE');
assert.equal(selected[0].errorCode, 'CANON_LINEAGE_INVALID');
assert.match(selected[0].message, /malformed or conflicting/i);

selected = selectCandidates([{
  ...governed('MILO-010', 11),
  canonInitializationState: 'PENDING',
}]);
assert.equal(selected.length, 1);
assert.equal(selected[0].outlineCandidateOutcome, 'INTEGRITY_FAILURE');
assert.equal(selected[0].errorCode, 'CANON_LINEAGE_INVALID');

selected = selectCandidates([
  governed('MILO-012', 13),
  governed('MILO-011', 12),
  governed('MILO-013', 12),
]);
assert.equal(selected.length, 1);
assert.equal(selected[0].storyId, 'MILO-011', 'lowest row_number then storyId must win deterministically');

assert.deepEqual(targets('Read Eligible Stories'), ['Select Eligible Outline Story']);
assert.deepEqual(targets('Select Eligible Outline Story'), ['Outline Eligible Story Selected']);
assert.deepEqual(targets('Outline Eligible Story Selected', 0), ['Read Approved Concept']);
assert.deepEqual(targets('Outline Eligible Story Selected', 1), ['Prepare Canon Lineage Failure']);

const conceptRead = node('Read Approved Concept');
const conceptFilters = Object.fromEntries(
  conceptRead.parameters.filtersUI.values.map((filter) => [filter.lookupColumn, filter.lookupValue]),
);
assert.equal(conceptFilters.storyId, '={{$json.storyId}}');
assert.equal(conceptFilters.approvalStatus, 'APPROVED');
const conceptFixture = [
  { storyId: 'MILO-004', conceptId: 'MILO-004-C01', approvalStatus: 'APPROVED' },
  { storyId: 'MILO-007', conceptId: 'MILO-007-C01', approvalStatus: 'APPROVED' },
];
const milo007 = selectCandidates([legacy('MILO-004', 5), governed('MILO-007', 8)])[0];
const milo007Concepts = conceptFixture.filter(
  (concept) => concept.storyId === milo007.storyId && concept.approvalStatus === 'APPROVED',
);
assert.deepEqual(milo007Concepts.map((concept) => concept.conceptId), ['MILO-007-C01']);

assert.deepEqual(targets('Canon Lineage Is Valid', 0), ['Check Existing Outline']);
assert.deepEqual(targets('Outline Does Not Exist', 0).sort(), ['Get Outline Canon Context', 'Prepare Outline Input'].sort());
assert.deepEqual(targets('Outline Does Not Exist', 1), ['Prepare Duplicate Outline Failure']);
assert.equal(node('Prepare Duplicate Outline Failure').parameters.assignments.assignments.find((a) => a.name === 'errorCode').value, 'DUPLICATE_OUTLINE');

const runtimeRead = node('Get Outline Canon Context');
assert.equal(runtimeRead.parameters.additionalParameters.reference, "={{ $('Select Eligible Outline Story').first().json.canonRef }}");
assert.doesNotMatch(runtimeRead.parameters.additionalParameters.reference, /HEAD|main|master|latest|newest/);

for (const candidate of workflow.nodes) {
  assert.doesNotMatch(
    JSON.stringify(candidate.parameters),
    /\$\('Read Eligible Stories'\)/,
    `${candidate.name}: downstream expressions must use the selected governed Story`,
  );
}

const failureAssignments = node('Prepare Canon Lineage Failure').parameters.assignments.assignments;
assert.match(failureAssignments.find((a) => a.name === 'nodeName').value, /selectionFailureNode/);
assert.deepEqual(targets('Prepare Canon Lineage Failure'), ['Call Failure Handler']);

for (const candidate of workflow.nodes.filter(
  (item) => item.type === 'n8n-nodes-base.googleSheets' && item.parameters?.operation === 'append',
)) {
  assert.notEqual(candidate.retryOnFail, true, `${candidate.name}: Sheets append must not retry`);
}

assert.match(statusModel, /Outline Generator eligible-Story selection contract/);
assert.match(errorRegister, /Outline eligible-selection remediation/);
assert.match(errorRegister, /CANON_LINEAGE_INVALID/);

console.log('PASS Outline Generator excludes earlier PRE-CANON LEGACY Stories and selects governed Stories');
console.log('PASS legacy-only no-op, malformed integrity routing, and deterministic multi-candidate ordering');
console.log('PASS approved Concept lookup is scoped to the selected governed Story');
console.log('PASS duplicate protection, selected Story canonRef retrieval, and lineage persistence wiring');
console.log('PASS PRE-CANON LEGACY immutability and Google Sheets append retry prohibition');
