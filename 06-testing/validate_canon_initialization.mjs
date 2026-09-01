import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const conceptPath = path.join(root, '04-n8n-workflows', 'development', 'Milo Concept Generator v0.1.json');
const intakePath = path.join(root, '04-n8n-workflows', 'tested', 'Milo Story Intake v0.1.json');
const decisionPath = path.join(root, 'DECISION_LOG.md');
const errorPath = path.join(root, '02-story-system', 'ERROR_CODE_REGISTER.md');

const concept = JSON.parse(fs.readFileSync(conceptPath, 'utf8'));
const intake = JSON.parse(fs.readFileSync(intakePath, 'utf8'));
const decisions = fs.readFileSync(decisionPath, 'utf8');
const errors = fs.readFileSync(errorPath, 'utf8');

const expectedVersion = 'canon-v1.0';
const expectedRef = '977755913d9ad41e4f16392d01ea993507af4102';
const handlerId = '3an2myLOF7o4STK8';

const node = (wf, name) => {
  const found = wf.nodes.find((n) => n.name === name);
  assert.ok(found, `${wf.name}: missing node ${name}`);
  return found;
};
const targets = (wf, name, output = 0) => (wf.connections[name]?.main?.[output] ?? []).map((c) => c.node);

assert.equal(concept.id, 'B48dAWnGixCxW2Bp');
assert.equal(concept.active, false);
assert.equal(concept.settings.errorWorkflow, handlerId);
assert.equal(node(concept, 'Call Failure Handler').parameters.workflowId.value, handlerId);
assert.deepEqual(concept.pinData, {});

const intakeAssignments = node(intake, 'Standardise Story Data').parameters.assignments.assignments;
assert.ok(intakeAssignments.some((a) => a.name === 'canonInitializationState' && a.value === 'PENDING'));
assert.ok(intakeAssignments.some((a) => a.name === 'canonVersion' && a.value === ''));
assert.ok(intakeAssignments.some((a) => a.name === 'canonRef' && a.value === ''));
const intakeSchema = node(intake, 'Save Story to Vault').parameters.columns.schema.map((c) => c.id);
assert.ok(intakeSchema.includes('canonInitializationState'));
assert.ok(intakeSchema.includes('canonVersion'));
assert.ok(intakeSchema.includes('canonRef'));

const classifier = node(concept, 'Classify Canon Initialization');
const runClassifier = new Function('$json', classifier.parameters.jsCode);
const base = { storyId: 'MILO-999', status: 'IDEA', canonInitializationState: '', canonVersion: '', canonRef: '' };
const classify = (overrides) => runClassifier({ ...base, ...overrides }).json;

let r = classify({});
assert.equal(r.canonInitializationValid, false);
assert.equal(r.errorCode, 'CANON_LINEAGE_INVALID');
assert.match(r.message, /PRE-CANON LEGACY/);

r = classify({ canonInitializationState: 'PENDING' });
assert.equal(r.canonInitializationValid, true);
assert.equal(r.needsCanonWrite, true);
assert.equal(r.canonInitializationAction, 'ASSIGN');
assert.equal(r.targetCanonVersion, expectedVersion);
assert.equal(r.targetCanonRef, expectedRef);

r = classify({ canonInitializationState: 'PENDING', canonVersion: expectedVersion, canonRef: expectedRef });
assert.equal(r.canonInitializationValid, true);
assert.equal(r.needsCanonWrite, true);
assert.equal(r.canonInitializationAction, 'RECOVER_MARKER');
assert.equal(r.targetCanonVersion, expectedVersion);
assert.equal(r.targetCanonRef, expectedRef);

for (const bad of [
  { canonInitializationState: 'PENDING', canonVersion: expectedVersion, canonRef: 'a'.repeat(40) },
  { canonInitializationState: 'PENDING', canonVersion: 'broken', canonRef: expectedRef },
]) {
  r = classify(bad);
  assert.equal(r.canonInitializationValid, false);
  assert.equal(r.errorCode, 'CANON_INITIALIZATION_INTEGRITY_FAILED');
}

r = classify({ canonInitializationState: 'ASSIGNED', canonVersion: expectedVersion, canonRef: expectedRef });
assert.equal(r.canonInitializationValid, true);
assert.equal(r.needsCanonWrite, false);
assert.equal(r.canonInitializationAction, 'USE_EXISTING');

for (const bad of [
  { canonInitializationState: 'ASSIGNED' },
  { canonInitializationState: 'ASSIGNED', canonVersion: 'broken', canonRef: 'broken' },
]) {
  r = classify(bad);
  assert.equal(r.canonInitializationValid, false);
  assert.equal(r.errorCode, 'CANON_INITIALIZATION_INTEGRITY_FAILED');
}

r = classify({ canonVersion: expectedVersion, canonRef: expectedRef });
assert.equal(r.canonInitializationValid, true);
assert.equal(r.needsCanonWrite, false);
assert.equal(r.canonInitializationAction, 'USE_EXISTING_LEGACY_MARKER');

r = classify({ canonInitializationState: 'PENDING', canonVersion: expectedVersion, canonRef: expectedRef, status: 'CONCEPT_GENERATED' });
assert.equal(r.canonInitializationValid, false);
assert.equal(r.errorCode, 'CANON_INITIALIZATION_INTEGRITY_FAILED');

assert.deepEqual(targets(concept, 'Read Eligible Story Ideas'), ['Check Existing Concepts Before Canon']);
assert.deepEqual(targets(concept, 'No Existing Concepts Before Canon', 0), ['Restore Eligible Story']);
assert.deepEqual(targets(concept, 'No Existing Concepts Before Canon', 1), ['Prepare Concepts Already Exist Failure']);
assert.deepEqual(targets(concept, 'Canon Write Required', 0), ['Verify Governed Canon Release']);
assert.deepEqual(targets(concept, 'Canon Write Required', 1), ['Validate Canon Lineage']);
assert.deepEqual(targets(concept, 'Verify Governed Canon Release', 0), ['Persist Canon Initialization']);
assert.deepEqual(targets(concept, 'Verify Governed Canon Release', 1), ['Prepare Governed Canon Release Failure']);
assert.deepEqual(targets(concept, 'Persist Canon Initialization', 0), ['Read Initialized Story']);
assert.deepEqual(targets(concept, 'Persist Canon Initialization', 1), ['Prepare Canon Initialization Save Failure']);
assert.deepEqual(targets(concept, 'Canon Initialization Verified', 0), ['Validate Canon Lineage']);
assert.deepEqual(targets(concept, 'Canon Initialization Verified', 1), ['Prepare Canon Initialization Verify Failure']);

const persist = node(concept, 'Persist Canon Initialization');
assert.equal(persist.parameters.operation, 'update');
assert.equal(persist.parameters.columns.value.canonInitializationState, 'ASSIGNED');
assert.equal(persist.parameters.columns.value.status, undefined, 'canon initialization must not mutate lifecycle status');
assert.equal(persist.parameters.columns.value.canonVersion, "={{ $('Classify Canon Initialization').first().json.targetCanonVersion }}");
assert.equal(persist.parameters.columns.value.canonRef, "={{ $('Classify Canon Initialization').first().json.targetCanonRef }}");

const probe = node(concept, 'Verify Governed Canon Release');
assert.equal(probe.parameters.additionalParameters.reference, "={{ $('Classify Canon Initialization').first().json.targetCanonRef }}");
assert.equal(probe.parameters.filePath, '03-prompts/MILO_CANON_CONTEXT.md');
assert.doesNotMatch(probe.parameters.additionalParameters.reference, /HEAD|main|master|newest|latest/);

const runtimeRead = node(concept, 'Get a file');
assert.equal(runtimeRead.parameters.additionalParameters.reference, "={{ $('Validate Canon Lineage').first().json.canonRef }}");
assert.doesNotMatch(runtimeRead.parameters.additionalParameters.reference, /HEAD|main|master|canon-v1\.0/);

const writeFailureCodes = ['GOVERNED_CANON_RELEASE_INVALID','GOVERNED_CANON_RELEASE_RESOLUTION_FAILED','CANON_INITIALIZATION_INTEGRITY_FAILED','CANON_INITIALIZATION_SAVE_FAILED','CANON_INITIALIZATION_VERIFY_FAILED'];
for (const code of writeFailureCodes) assert.match(errors, new RegExp(`\\b${code}\\b`));
for (const name of ['Prepare Canon Initialization Failure','Prepare Governed Canon Release Failure','Prepare Canon Initialization Save Failure','Prepare Canon Initialization Verify Failure']) {
  assert.deepEqual(targets(concept, name), ['Call Failure Handler']);
}

for (const wf of [concept, intake]) {
  for (const n of wf.nodes.filter((candidate) => candidate.type === 'n8n-nodes-base.googleSheets' && candidate.parameters?.operation === 'append')) {
    assert.notEqual(n.retryOnFail, true, `${wf.name}/${n.name}: append retryOnFail must not be enabled`);
  }
}

assert.match(decisions, /D-014/);
assert.match(decisions, /PENDING/);
assert.match(decisions, /ASSIGNED/);
assert.match(decisions, /absence of the marker does not invalidate/i);

const duplicateFailure = node(concept, 'Prepare Concepts Already Exist Failure');
const duplicateCode = duplicateFailure.parameters.assignments.assignments.find((a) => a.name === 'errorCode');
assert.equal(duplicateCode.value, 'CONCEPTS_ALREADY_EXIST');
assert.ok(targets(concept, 'Merge').includes('Check Existing Concepts'), 'post-canon duplicate guard must remain');

console.log('PASS D-014 seven-state canon initialization matrix');
console.log('PASS Story Intake creates PENDING with blank lineage only for new repository contract');
console.log('PASS Concept Generator first assignment/recovery preserves lifecycle and never overwrites conflicting canon');
console.log('PASS pre-canon and post-canon duplicate protection');
console.log('PASS immutable governed-release probe and runtime Story canonRef retrieval');
console.log('PASS Failure Handler routing and no Google Sheets append retry');
console.log(`PASS governed release configuration ${expectedVersion} -> ${expectedRef}`);
