import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowDir = path.join(repoRoot, '04-n8n-workflows', 'development');
const failureHandlerId = '3an2myLOF7o4STK8';

const workflows = [
  ['Milo Concept Generator v0.1.json', 'B48dAWnGixCxW2Bp', ['Get a file']],
  ['Milo Outline Generator v0.1.json', 'SCTO6xUfrlKczeP5', ['Get Outline Canon Context']],
  ['Milo Script Generator v0.1.json', 'cfRT2oHADjTQi6I6', ['Get Script Canon Context']],
  ['Milo Continuity Reviewer v0.1.json', 'K4HP95loWJiNwjlP', ['Get Milo Canon Context', 'Get Continuity Rules']],
];

const getNode = (workflow, name) => {
  const found = workflow.nodes.find((node) => node.name === name);
  assert.ok(found, `${workflow.name}: missing ${name}`);
  return found;
};

const outgoing = (workflow, name, output = 0) =>
  (workflow.connections[name]?.main?.[output] ?? []).map((connection) => connection.node);

const canonVersion = 'canon-v1.0';
const canonRef = '977755913d9ad41e4f16392d01ea993507af4102';
const story = { storyId: 'MILO-001', canonVersion, canonRef };
const runValidator = (workflow, input, referencedRecords = {}) => {
  const code = getNode(workflow, 'Validate Canon Lineage').parameters.jsCode;
  const selectNode = (name) => ({ first: () => ({ json: referencedRecords[name] }) });
  return new Function('$json', '$', code)(input, selectNode).json;
};

for (const [fileName, expectedId, githubNodes] of workflows) {
  const workflow = JSON.parse(fs.readFileSync(path.join(workflowDir, fileName), 'utf8'));

  assert.equal(workflow.id, expectedId, `${workflow.name}: canonical workflow ID drift`);
  assert.equal(workflow.active, false, `${workflow.name}: workflow must remain inactive`);
  assert.equal(workflow.settings.errorWorkflow, failureHandlerId, `${workflow.name}: Error Workflow drift`);
  assert.equal(getNode(workflow, 'Call Failure Handler').parameters.workflowId.value, failureHandlerId, `${workflow.name}: shared handler drift`);
  assert.deepEqual(workflow.nodes.filter((node) => node.name === 'Validate Canon Lineage').length, 1, `${workflow.name}: canon validator count`);
  assert.deepEqual(workflow.nodes.filter((node) => node.name === 'Canon Lineage Is Valid').length, 1, `${workflow.name}: canon gate count`);
  assert.deepEqual(workflow.nodes.filter((node) => node.name === 'Prepare Canon Lineage Failure').length, 1, `${workflow.name}: canon failure count`);
  assert.ok(outgoing(workflow, 'Validate Canon Lineage').includes('Canon Lineage Is Valid'), `${workflow.name}: validator must feed gate`);
  assert.ok(outgoing(workflow, 'Canon Lineage Is Valid', 1).includes('Prepare Canon Lineage Failure'), `${workflow.name}: invalid lineage must feed failure payload`);
  assert.ok(outgoing(workflow, 'Prepare Canon Lineage Failure').includes('Call Failure Handler'), `${workflow.name}: failure payload must feed shared handler`);

  const validatorCode = getNode(workflow, 'Validate Canon Lineage').parameters.jsCode;
  assert.match(validatorCode, /CANON_LINEAGE_INVALID/, `${workflow.name}: missing invalid-lineage code`);
  if (!workflow.name.includes('Concept Generator')) assert.match(validatorCode, /CANON_LINEAGE_MISMATCH/, `${workflow.name}: missing mismatch code`);
  assert.match(validatorCode, /\^\[0-9a-f\]\{40\}\$/i, `${workflow.name}: canonRef must be a full SHA`);

  for (const githubName of githubNodes) {
    const github = getNode(workflow, githubName);
    assert.equal(github.type, 'n8n-nodes-base.github');
    const reference = github.parameters.additionalParameters?.reference ?? '';
    assert.match(reference, /canonRef/, `${workflow.name}/${githubName}: missing canonRef Reference`);
    assert.doesNotMatch(reference, /HEAD|main|master|canon-v1\.0/, `${workflow.name}/${githubName}: Reference must not be a moving or hard-coded ref`);
    assert.ok(github.credentials?.githubApi?.id || github.credentials?.githubOAuth2Api?.id, `${workflow.name}/${githubName}: GitHub credential missing`);
  }

  const blankStory = { ...story, canonRef: '' };
  const invalidInput = workflow.name.includes('Outline Generator') ? story : blankStory;
  const invalid = runValidator(workflow, invalidInput, {
    'Select Eligible Outline Story': blankStory,
    'Validate Approved Outline Batch': { ...blankStory, outlineId: 'MILO-001-O01' },
    'Validate Approved Script': { ...blankStory, scriptId: 'MILO-001-S01' },
  });
  assert.equal(invalid.canonLineageValid, false, `${workflow.name}: blank canonRef was accepted`);
  assert.equal(invalid.errorCode, 'CANON_LINEAGE_INVALID', `${workflow.name}: wrong blank-lineage error code`);
}

const concept = JSON.parse(fs.readFileSync(path.join(workflowDir, 'Milo Concept Generator v0.1.json'), 'utf8'));
assert.equal(runValidator(concept, story).canonLineageValid, true, 'Concept Generator rejected valid Story lineage');

const outline = JSON.parse(fs.readFileSync(path.join(workflowDir, 'Milo Outline Generator v0.1.json'), 'utf8'));
assert.equal(runValidator(outline, { ...story, conceptId: 'MILO-001-C01' }, { 'Select Eligible Outline Story': story }).canonLineageValid, true, 'Outline Generator rejected matching lineage');
assert.equal(runValidator(outline, { ...story, canonRef: 'a'.repeat(40) }, { 'Select Eligible Outline Story': story }).errorCode, 'CANON_LINEAGE_MISMATCH', 'Outline Generator did not reject mismatched lineage');

const script = JSON.parse(fs.readFileSync(path.join(workflowDir, 'Milo Script Generator v0.1.json'), 'utf8'));
assert.equal(runValidator(script, story, { 'Validate Approved Outline Batch': { ...story, outlineId: 'MILO-001-O01' } }).canonLineageValid, true, 'Script Generator rejected matching lineage');
assert.equal(runValidator(script, story, { 'Validate Approved Outline Batch': { ...story, canonRef: 'b'.repeat(40) } }).errorCode, 'CANON_LINEAGE_MISMATCH', 'Script Generator did not reject mismatched lineage');

const continuity = JSON.parse(fs.readFileSync(path.join(workflowDir, 'Milo Continuity Reviewer v0.1.json'), 'utf8'));
assert.equal(runValidator(continuity, story, { 'Validate Approved Script': { ...story, scriptId: 'MILO-001-S01' } }).canonLineageValid, true, 'Continuity Reviewer rejected matching lineage');
assert.equal(runValidator(continuity, story, { 'Validate Approved Script': { ...story, canonVersion: 'canon-v9.9' } }).errorCode, 'CANON_LINEAGE_MISMATCH', 'Continuity Reviewer did not reject mismatched lineage');
const continuityRefs = ['Get Milo Canon Context', 'Get Continuity Rules'].map((name) => getNode(continuity, name).parameters.additionalParameters.reference);
assert.equal(continuityRefs[0], continuityRefs[1], 'Continuity Reviewer canon and rules reads must use the same Story canonRef');

const reviewRecordAssignments = getNode(continuity, 'Prepare Continuity Review Record').parameters.assignments.assignments;
assert.ok(reviewRecordAssignments.some((field) => field.name === 'canonVersion'));
assert.ok(reviewRecordAssignments.some((field) => field.name === 'canonRef'));
const reviewColumns = getNode(continuity, 'Save Continuity Review').parameters.columns.value;
assert.ok(reviewColumns.canonVersion, 'Continuity Review save mapping missing canonVersion');
assert.ok(reviewColumns.canonRef, 'Continuity Review save mapping missing canonRef');

console.log('Canon-lineage workflow validation passed.');
