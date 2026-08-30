#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowFiles = [
  '04-n8n-workflows/development/Milo Concept Approval v0.1.json',
  '04-n8n-workflows/development/Milo Concept Generator v0.1.json',
  '04-n8n-workflows/development/Milo Continuity Approval v0.1.json',
  '04-n8n-workflows/development/Milo Continuity Reviewer v0.1.json',
  '04-n8n-workflows/development/Milo Outline Approval v0.1.json',
  '04-n8n-workflows/development/Milo Outline Generator v0.1.json',
  '04-n8n-workflows/development/Milo Script Approval v0.1.json',
  '04-n8n-workflows/development/Milo Script Generator v0.1.json',
  '04-n8n-workflows/tested/Milo Story Intake v0.1.json',
];
const handlerFile = '04-n8n-workflows/development/Milo Failure Handler v0.1.json';
const expectedColumns = [
  'failureId',
  'occurredAt',
  'workflowName',
  'workflowId',
  'executionId',
  'sourceType',
  'storyId',
  'conceptId',
  'outlineId',
  'scriptId',
  'reviewId',
  'errorCode',
  'message',
  'nodeName',
  'nodeType',
  'attempt',
  'rawError',
  'status',
];
const preInstrumentationCodes = [
  'APPROVAL_VALIDATION_FAILED',
  'APPROVED_CONCEPT_COUNT_INVALID',
  'APPROVED_OUTLINE_COUNT_INVALID',
  'APPROVED_OUTLINE_INVALID',
  'APPROVED_OUTLINE_VALIDATION_FAILED',
  'APPROVED_SCRIPT_INVALID',
  'CONCEPTS_ALREADY_EXIST',
  'CONCEPT_STORY_ID_MISMATCH',
  'CONCEPT_VALIDATION_FAILED',
  'CONTINUITY_AI_OUTPUT_INVALID',
  'CONTINUITY_APPROVAL_INVALID',
  'CONTINUITY_REVIEW_ALREADY_EXISTS',
  'CONTINUITY_REVIEW_PROCESSING_FAILED',
  'CONTINUITY_REVIEW_SAVE_FAILED',
  'DUPLICATE_OUTLINE',
  'OUTLINE_APPROVAL_STAMP_FAILED',
  'OUTLINE_GENERATION_FAILED',
  'OUTLINE_SAVE_FAILED',
  'OUTLINE_VALIDATION_FAILED',
  'SCRIPT_ALREADY_EXISTS',
  'SCRIPT_NOT_READY_FOR_CONTINUITY_REVIEW',
  'SCRIPT_SAVE_FAILED',
  'SCRIPT_VALIDATION_FAILED',
  'STORY_CONTINUITY_APPROVED_UPDATE_FAILED',
  'STORY_CONTINUITY_STATUS_UPDATE_FAILED',
  'STORY_ID_MISSING',
  'STORY_NOT_READY_FOR_CONCEPT_APPROVAL',
  'STORY_NOT_READY_FOR_CONTINUITY_APPROVAL',
  'STORY_NOT_READY_FOR_OUTLINE_APPROVAL',
  'STORY_NOT_READY_FOR_SCRIPT_APPROVAL',
  'STORY_NOT_READY_FOR_SCRIPT_GENERATION',
  'STORY_OUTLINE_APPROVAL_UPDATE_FAILED',
  'STORY_OUTLINE_STATUS_UPDATE_FAILED',
  'STORY_SCRIPT_REVISION_UPDATE_FAILED',
  'STORY_SCRIPT_STATUS_UPDATE_FAILED',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function validateConnections(workflow) {
  const names = new Set(workflow.nodes.map((node) => node.name));
  assert(names.size === workflow.nodes.length, `${workflow.name}: duplicate node names`);
  for (const [source, connection] of Object.entries(workflow.connections ?? {})) {
    assert(names.has(source), `${workflow.name}: connection source does not exist: ${source}`);
    for (const branches of Object.values(connection)) {
      for (const branch of branches) {
        for (const target of branch) assert(names.has(target.node), `${workflow.name}: connection target does not exist: ${target.node}`);
      }
    }
  }
}

function collectCodes(workflow) {
  const codes = new Set();
  for (const node of workflow.nodes) {
    for (const assignment of node.parameters?.assignments?.assignments ?? []) {
      if (assignment.name !== 'errorCode') continue;
      for (const match of String(assignment.value).matchAll(/([A-Z][A-Z0-9_]{2,})/g)) {
        if (match[1].includes('_')) codes.add(match[1]);
      }
    }
    for (const match of String(node.parameters?.jsCode ?? '').matchAll(/errorCode\s*:\s*['"`]([A-Z][A-Z0-9_]+)['"`]/g)) {
      codes.add(match[1]);
    }
  }
  return codes;
}

const workflows = workflowFiles.map(readJson);
const handler = readJson(handlerFile);
const allWorkflows = [...workflows, handler];
for (const workflow of allWorkflows) validateConnections(workflow);

const localFailures = workflows.flatMap((workflow) =>
  workflow.nodes.filter((node) => /^Prepare .*Failure$/.test(node.name)).map((node) => ({ workflow, node })),
);
assert(localFailures.length === 35, `Expected 35 local failure nodes, found ${localFailures.length}`);

const metadataFields = ['workflowName', 'workflowId', 'executionId', 'sourceType', 'nodeName', 'nodeType'];
for (const { workflow, node } of localFailures) {
  assert(node.type === 'n8n-nodes-base.set', `${workflow.name} / ${node.name}: expected Set node`);
  const assignments = node.parameters.assignments.assignments;
  for (const field of metadataFields) {
    assert(assignments.some((assignment) => assignment.name === field), `${workflow.name} / ${node.name}: missing ${field}`);
  }
  assert(assignments.find((assignment) => assignment.name === 'executionId').value === '={{ $exec.id }}', `${workflow.name} / ${node.name}: wrong executionId expression`);
  assert(assignments.some((assignment) => assignment.name === 'errorCode'), `${workflow.name} / ${node.name}: missing errorCode`);
  const targets = workflow.connections[node.name]?.main?.[0] ?? [];
  assert(targets.length === 1 && targets[0].node === 'Call Failure Handler', `${workflow.name} / ${node.name}: not durably routed`);
}

for (const workflow of workflows) {
  const calls = workflow.nodes.filter((node) => node.name === 'Call Failure Handler');
  assert(calls.length === 1, `${workflow.name}: expected one handler call node`);
  assert(calls[0].type === 'n8n-nodes-base.executeWorkflow', `${workflow.name}: wrong handler call node type`);
  assert(calls[0].parameters.workflowId.value === '', `${workflow.name}: live handler ID must not be invented offline`);
  assert(calls[0].parameters.workflowId.cachedResultName === 'Milo Failure Handler v0.1', `${workflow.name}: wrong handler target name`);
}

const handlerTypes = new Set(handler.nodes.map((node) => node.type));
assert(handlerTypes.has('n8n-nodes-base.executeWorkflowTrigger'), 'Handler missing Execute Sub-workflow Trigger');
assert(handlerTypes.has('n8n-nodes-base.errorTrigger'), 'Handler missing Error Trigger');
assert(!Object.hasOwn(handler.settings, 'errorWorkflow'), 'Handler must not recursively target itself as an Error Workflow');

for (const workflow of allWorkflows) {
  for (const node of workflow.nodes.filter((node) => node.type === 'n8n-nodes-base.googleSheets' && node.parameters.operation === 'append')) {
    assert(node.retryOnFail !== true, `${workflow.name} / ${node.name}: Sheets append must not retry`);
  }
}

const handlerSheets = handler.nodes.filter((node) => node.type === 'n8n-nodes-base.googleSheets');
assert(handlerSheets.length === 1, 'Handler must have exactly one Sheets node');
assert(handlerSheets[0].parameters.operation === 'append', 'FailureLog must be append-only for new events');
assert(handlerSheets[0].parameters.sheetName.value === 'FailureLog', 'Handler must target FailureLog only');

const observedCodes = new Set(workflows.flatMap((workflow) => [...collectCodes(workflow)]));
for (const code of preInstrumentationCodes) assert(observedCodes.has(code), `Existing error code was lost: ${code}`);
for (const code of collectCodes(handler)) observedCodes.add(code);
observedCodes.add('HANDLED_FAILURE');
observedCodes.add('UNHANDLED_WORKFLOW_ERROR');
const registerText = fs.readFileSync(path.join(repoRoot, '02-story-system/ERROR_CODE_REGISTER.md'), 'utf8');
const registeredCodes = new Set([...registerText.matchAll(/^\| `([A-Z0-9_]+)` \|/gm)].map((match) => match[1]));
assert(registeredCodes.size === observedCodes.size, `Error-code register count ${registeredCodes.size} does not match implementation count ${observedCodes.size}`);
for (const code of observedCodes) assert(registeredCodes.has(code), `Implemented error code is not registered: ${code}`);

const normalizeNode = handler.nodes.find((node) => node.name === 'Normalize Failure Event');
assert(normalizeNode?.type === 'n8n-nodes-base.code', 'Handler normalizer is missing');
const runNormalizer = new Function('$input', '$workflow', '$execution', normalizeNode.parameters.jsCode);
const normalize = (payload) => runNormalizer(
  { all: () => [{ json: structuredClone(payload) }] },
  { id: 'handler-workflow-id', name: handler.name },
  { id: 'handler-execution-id' },
)[0].json;

const handledValidation = normalize({
  success: false,
  errorCode: 'APPROVED_SCRIPT_INVALID',
  message: 'Approved script failed deterministic validation.',
  workflowName: 'Milo Continuity Reviewer v0.1',
  workflowId: 'continuity-reviewer-id',
  executionId: 'exec-handled-1',
  sourceType: 'HANDLED',
  nodeName: 'Prepare Invalid Approved Script Failure',
  nodeType: 'n8n-nodes-base.set',
  storyId: 'MILO-001',
  scriptId: 'MILO-001-S01',
  storyStatus: 'SCRIPT_APPROVED',
  attempt: 0,
  failedAt: '2026-08-30T12:00:00.123Z',
});
assert(Object.keys(handledValidation).join('|') === expectedColumns.join('|'), 'Handled row does not match FailureLog column order');
assert(handledValidation.sourceType === 'HANDLED', 'Handled sourceType was not retained');
assert(handledValidation.errorCode === 'APPROVED_SCRIPT_INVALID', 'Local errorCode was not retained');
assert(handledValidation.status === 'OPEN', 'New failure status must be OPEN');
assert(!Object.hasOwn(handledValidation, 'storyStatus'), 'Failure Handler must not emit lifecycle status fields');
assert(JSON.parse(handledValidation.rawError).storyStatus === 'SCRIPT_APPROVED', 'Local payload meaning was not retained in rawError');

const handledSheetsFailurePayload = {
  success: false,
  errorCode: 'SCRIPT_SAVE_FAILED',
  message: 'Script could not be saved to the Story Vault.',
  workflowName: 'Milo Script Generator v0.1',
  workflowId: 'script-generator-id',
  executionId: 'exec-sheets-1',
  sourceType: 'HANDLED',
  nodeName: 'Prepare Script Save Failure',
  nodeType: 'n8n-nodes-base.set',
  storyId: 'MILO-002',
  scriptId: 'MILO-002-S01',
  attempt: 0,
  failedAt: '2026-08-30T12:01:00.456Z',
};
const handledSheetsFailure = normalize(handledSheetsFailurePayload);
const handledSheetsFailureRepeat = normalize(handledSheetsFailurePayload);
assert(handledSheetsFailure.errorCode === 'SCRIPT_SAVE_FAILED', 'Sheets failure errorCode was not retained');
assert(handledSheetsFailure.failureId === handledSheetsFailureRepeat.failureId, 'Same event must produce the same failureId');
const scriptGenerator = workflows.find((workflow) => workflow.name === 'Milo Script Generator v0.1');
const scriptSaveNode = scriptGenerator.nodes.find((node) => node.name === 'Save Script Record');
assert(scriptSaveNode?.type === 'n8n-nodes-base.googleSheets', 'Script save test source is not a Sheets node');
assert(scriptSaveNode.onError === 'continueErrorOutput', 'Script save node must expose its handled error output');
assert(
  scriptGenerator.connections['Save Script Record']?.main?.[1]?.some((target) => target.node === 'Prepare Script Save Failure'),
  'Script save error output is not routed through its local failure payload',
);
assert(
  scriptGenerator.connections['Prepare Script Save Failure']?.main?.[0]?.some((target) => target.node === 'Call Failure Handler'),
  'Script save failure payload is not routed to the shared handler',
);

const unhandled = normalize({
  execution: {
    id: 'exec-unhandled-1',
    stoppedAt: '2026-08-30T12:02:00.789Z',
    lastNodeExecuted: 'Read Source Story',
    error: {
      message: 'Synthetic unhandled crash',
      node: { name: 'Read Source Story', type: 'n8n-nodes-base.googleSheets' },
    },
  },
  workflow: { id: 'outline-approval-id', name: 'Milo Outline Approval v0.1' },
});
assert(Object.keys(unhandled).join('|') === expectedColumns.join('|'), 'Unhandled row does not match FailureLog column order');
assert(unhandled.sourceType === 'UNHANDLED', 'Unhandled Error Trigger payload was not detected');
assert(unhandled.errorCode === 'UNHANDLED_WORKFLOW_ERROR', 'Unhandled error code is wrong');
assert(unhandled.executionId === 'exec-unhandled-1', 'Unhandled execution ID was not captured');
assert(unhandled.nodeName === 'Read Source Story', 'Unhandled failing node was not captured');
assert(unhandled.message === 'Synthetic unhandled crash', 'Unhandled message was not captured');

console.log('PASS JSON parsing and connection integrity: 10 workflows');
console.log('PASS local handler routing: 35/35 Prepare Failure nodes');
console.log('PASS existing error-code preservation: 35/35 baseline codes');
console.log(`PASS operational error-code register: ${registeredCodes.size}/${observedCodes.size} codes`);
console.log('PASS handled validation normalization and lifecycle isolation');
console.log('PASS handled Sheets failure branch, normalization, and deterministic failureId');
console.log('PASS unhandled Error Trigger normalization');
console.log('PASS FailureLog row contract: 18/18 columns');
console.log('PASS Sheets append retry policy: retryOnFail disabled on every append');
