#!/usr/bin/env node

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflows = [
  ['04-n8n-workflows/development/Milo Concept Approval v0.1.json', 'Milo Concept Approval v0.1', 2],
  ['04-n8n-workflows/development/Milo Concept Generator v0.1.json', 'Milo Concept Generator v0.1', 2],
  ['04-n8n-workflows/development/Milo Continuity Approval v0.1.json', 'Milo Continuity Approval v0.1', 5],
  ['04-n8n-workflows/development/Milo Continuity Reviewer v0.1.json', 'Milo Continuity Reviewer v0.1', 6],
  ['04-n8n-workflows/development/Milo Outline Approval v0.1.json', 'Milo Outline Approval v0.1', 5],
  ['04-n8n-workflows/development/Milo Outline Generator v0.1.json', 'Milo Outline Generator v0.1', 6],
  ['04-n8n-workflows/development/Milo Script Approval v0.1.json', 'Milo Script Approval v0.1', 2],
  ['04-n8n-workflows/development/Milo Script Generator v0.1.json', 'Milo Script Generator v0.1', 6],
  ['04-n8n-workflows/tested/Milo Story Intake v0.1.json', 'Milo Story Intake v0.1', 1],
];

const handlerRelativePath = '04-n8n-workflows/development/Milo Failure Handler v0.1.json';
const callNodeName = 'Call Failure Handler';
const existingErrorCodes = [
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
].sort();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  assert(fs.existsSync(absolutePath), `Expected workflow file: ${relativePath}`);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

function writeJson(relativePath, value) {
  fs.writeFileSync(path.join(repoRoot, relativePath), `${JSON.stringify(value, null, 2)}\n`);
}

function stableUuid(seed) {
  const hex = crypto.createHash('sha256').update(seed).digest('hex').slice(0, 32).split('');
  hex[12] = '4';
  hex[16] = ((Number.parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
  return `${hex.slice(0, 8).join('')}-${hex.slice(8, 12).join('')}-${hex.slice(12, 16).join('')}-${hex.slice(16, 20).join('')}-${hex.slice(20).join('')}`;
}

function isFailureNode(node) {
  return /^Prepare .*Failure$/.test(node.name);
}

function isTerminalConnection(connection) {
  if (!connection) return true;
  return (connection.main ?? []).every((branch) => branch.length === 0);
}

function collectErrorCodes(workflow) {
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

function addAssignment(workflowName, node, name, value, type = 'string') {
  const assignments = node.parameters.assignments.assignments;
  assert(!assignments.some((assignment) => assignment.name === name), `${workflowName} / ${node.name}: ${name} already exists`);
  assignments.push({
    id: stableUuid(`${workflowName}|${node.name}|${name}`),
    name,
    value,
    type,
  });
}

function callNode(workflow) {
  const xs = workflow.nodes.map((node) => node.position?.[0] ?? 0);
  const failureYs = workflow.nodes.filter(isFailureNode).map((node) => node.position?.[1] ?? 0).sort((a, b) => a - b);
  const middleY = failureYs[Math.floor(failureYs.length / 2)] ?? 0;
  return {
    parameters: {
      source: 'database',
      workflowId: {
        __rl: true,
        value: '',
        mode: 'list',
        cachedResultName: 'Milo Failure Handler v0.1',
      },
      options: {
        waitForSubWorkflow: true,
      },
    },
    type: 'n8n-nodes-base.executeWorkflow',
    typeVersion: 1.2,
    position: [Math.max(...xs) + 320, middleY],
    id: stableUuid(`${workflow.name}|${callNodeName}`),
    name: callNodeName,
  };
}

const normalizeCode = `const FAILURE_LOG_COLUMNS = [
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

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function safeJson(value) {
  const seen = new WeakSet();
  let serialized;
  try {
    serialized = JSON.stringify(value, (key, current) => {
      if (typeof current === 'bigint') return current.toString();
      if (current && typeof current === 'object') {
        if (seen.has(current)) return '[Circular]';
        seen.add(current);
      }
      return current;
    });
  } catch (error) {
    serialized = JSON.stringify({ serializationError: error.message });
  }
  return (serialized ?? '').slice(0, 45000);
}

function fnv1a64(value) {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  for (const byte of new TextEncoder().encode(value)) {
    hash ^= BigInt(byte);
    hash = BigInt.asUintN(64, hash * prime);
  }
  return hash.toString(16).padStart(16, '0');
}

return $input.all().map((item) => {
  const raw = item.json ?? {};
  const error = raw.execution?.error ?? raw.trigger?.error ?? raw.error ?? {};
  const isUnhandled = raw.sourceType === 'UNHANDLED' || (
    raw.sourceType !== 'HANDLED' &&
    typeof raw.workflow === 'object' &&
    (raw.execution || raw.trigger)
  );
  const sourceType = isUnhandled ? 'UNHANDLED' : 'HANDLED';
  const occurredAt = String(firstValue(
    raw.occurredAt,
    raw.failedAt,
    raw['=failedAt'],
    raw.ailedAt,
    raw.execution?.stoppedAt,
    new Date().toISOString(),
  ));
  const workflowName = String(firstValue(
    isUnhandled ? raw.workflow?.name : raw.workflowName,
    typeof raw.workflow === 'string' ? raw.workflow : undefined,
    'Unknown Workflow',
  ));
  const workflowId = String(firstValue(
    isUnhandled ? raw.workflow?.id : raw.workflowId,
    '',
  ));
  const executionId = String(firstValue(
    isUnhandled ? raw.execution?.id : raw.executionId,
    $execution.id,
    '',
  ));
  const storyId = String(firstValue(raw.storyId, raw.stroyId, raw['=storyId'], ''));
  const conceptId = String(firstValue(raw.conceptId, ''));
  const outlineId = String(firstValue(raw.outlineId, ''));
  const scriptId = String(firstValue(raw.scriptId, raw.criptId, ''));
  const reviewId = String(firstValue(raw.reviewId, ''));
  const errorCode = String(firstValue(
    raw.errorCode,
    isUnhandled ? 'UNHANDLED_WORKFLOW_ERROR' : 'HANDLED_FAILURE',
  ));
  const message = String(firstValue(raw.message, error.message, 'Workflow failure'));
  const nodeName = String(firstValue(
    raw.nodeName,
    raw.execution?.lastNodeExecuted,
    error.node?.name,
    '',
  ));
  const nodeType = String(firstValue(raw.nodeType, error.node?.type, error.nodeType, ''));
  const parsedAttempt = Number(firstValue(raw.attempt, raw.attempts, 0));
  const attempt = Number.isFinite(parsedAttempt) ? parsedAttempt : 0;
  const rawError = safeJson(isUnhandled ? error : raw);
  const identity = [
    sourceType,
    workflowId || workflowName,
    executionId || occurredAt,
    nodeName,
    errorCode,
    storyId,
    conceptId,
    outlineId,
    scriptId,
    reviewId,
  ].join('|');
  const failureId = 'FL-' + (sourceType === 'HANDLED' ? 'H' : 'U') + '-' + fnv1a64(identity);
  const event = {
    failureId,
    occurredAt,
    workflowName,
    workflowId,
    executionId,
    sourceType,
    storyId,
    conceptId,
    outlineId,
    scriptId,
    reviewId,
    errorCode,
    message,
    nodeName,
    nodeType,
    attempt,
    rawError,
    status: 'OPEN',
  };
  if (Object.keys(event).join('|') !== FAILURE_LOG_COLUMNS.join('|')) {
    throw new Error('FailureLog column contract drift detected');
  }
  return { json: event };
});`;

function buildHandler() {
  const executeTrigger = 'When Called by Another Workflow';
  const errorTrigger = 'On Workflow Error';
  const normalizeNode = 'Normalize Failure Event';
  const appendNode = 'Append FailureLog';
  return {
    name: 'Milo Failure Handler v0.1',
    nodes: [
      {
        parameters: { inputSource: 'passthrough' },
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        typeVersion: 1.1,
        position: [-480, -80],
        id: stableUuid('Milo Failure Handler v0.1|execute-trigger'),
        name: executeTrigger,
      },
      {
        parameters: {},
        type: 'n8n-nodes-base.errorTrigger',
        typeVersion: 1,
        position: [-480, 160],
        id: stableUuid('Milo Failure Handler v0.1|error-trigger'),
        name: errorTrigger,
      },
      {
        parameters: { jsCode: normalizeCode },
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [-160, 40],
        id: stableUuid('Milo Failure Handler v0.1|normalize'),
        name: normalizeNode,
      },
      {
        parameters: {
          operation: 'append',
          documentId: {
            __rl: true,
            value: '1pDIH1NBjyuKsbjNu0oMTlVjbI7m2w5SVPIgJzDUtc_Y',
            mode: 'list',
            cachedResultName: 'Milo Story Vault',
            cachedResultUrl: 'https://docs.google.com/spreadsheets/d/1pDIH1NBjyuKsbjNu0oMTlVjbI7m2w5SVPIgJzDUtc_Y/edit?usp=drivesdk',
          },
          sheetName: {
            __rl: true,
            value: 'FailureLog',
            mode: 'name',
            cachedResultName: 'FailureLog',
          },
          columns: {
            mappingMode: 'autoMapInputData',
            value: {},
            matchingColumns: [],
            schema: [],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
          },
          options: {},
        },
        type: 'n8n-nodes-base.googleSheets',
        typeVersion: 4.7,
        position: [160, 40],
        id: stableUuid('Milo Failure Handler v0.1|append'),
        name: appendNode,
        credentials: {
          googleSheetsOAuth2Api: {
            id: 'QG2OeymCBBUfhfMJ',
            name: 'Google Sheets account 2',
          },
        },
      },
    ],
    pinData: {},
    connections: {
      [executeTrigger]: { main: [[{ node: normalizeNode, type: 'main', index: 0 }]] },
      [errorTrigger]: { main: [[{ node: normalizeNode, type: 'main', index: 0 }]] },
      [normalizeNode]: { main: [[{ node: appendNode, type: 'main', index: 0 }]] },
    },
    active: false,
    settings: {
      executionOrder: 'v1',
      binaryMode: 'separate',
      availableInMCP: false,
    },
    meta: {},
    tags: [],
  };
}

const loaded = workflows.map(([relativePath, expectedName, expectedFailureCount]) => {
  const workflow = readJson(relativePath);
  assert(workflow.name === expectedName, `${relativePath}: expected workflow name ${expectedName}`);
  const failures = workflow.nodes.filter(isFailureNode);
  assert(failures.length === expectedFailureCount, `${relativePath}: expected ${expectedFailureCount} failure nodes, found ${failures.length}`);
  for (const node of failures) {
    assert(node.type === 'n8n-nodes-base.set', `${expectedName} / ${node.name}: expected Set node`);
    assert(Array.isArray(node.parameters?.assignments?.assignments), `${expectedName} / ${node.name}: expected Set assignments`);
  }
  return { relativePath, workflow, failures };
});

assert(loaded.reduce((sum, item) => sum + item.failures.length, 0) === 35, 'Expected exactly 35 local failure nodes');

const observedCodes = new Set(loaded.flatMap(({ workflow }) => [...collectErrorCodes(workflow)]));
for (const code of existingErrorCodes) assert(observedCodes.has(code), `Missing existing error code before edit: ${code}`);

const alreadyInstrumented = loaded.every(({ workflow, failures }) =>
  workflow.nodes.some((node) => node.name === callNodeName) &&
  failures.every((node) => workflow.connections[node.name]?.main?.[0]?.some((target) => target.node === callNodeName)),
);

if (!alreadyInstrumented) {
  assert(!loaded.some(({ workflow }) => workflow.nodes.some((node) => node.name === callNodeName)), 'Partial instrumentation detected; refusing to edit');
  for (const { relativePath, workflow, failures } of loaded) {
    for (const node of failures) {
      assert(isTerminalConnection(workflow.connections[node.name]), `${workflow.name} / ${node.name}: expected terminal current connection`);
      const assignments = node.parameters.assignments.assignments;
      if (workflow.name === 'Milo Story Intake v0.1') {
        assert(!assignments.some((assignment) => assignment.name === 'errorCode'), 'Story Intake failure unexpectedly already has errorCode');
        addAssignment(workflow.name, node, 'errorCode', 'STORY_SUBMISSION_VALIDATION_FAILED');
      }
      addAssignment(workflow.name, node, 'workflowName', '={{ $workflow.name }}');
      addAssignment(workflow.name, node, 'workflowId', '={{ $workflow.id }}');
      addAssignment(workflow.name, node, 'executionId', '={{ $exec.id }}');
      addAssignment(workflow.name, node, 'sourceType', 'HANDLED');
      addAssignment(workflow.name, node, 'nodeName', node.name);
      addAssignment(workflow.name, node, 'nodeType', node.type);
    }

    workflow.nodes.push(callNode(workflow));
    for (const node of failures) {
      workflow.connections[node.name] = {
        main: [[{ node: callNodeName, type: 'main', index: 0 }]],
      };
    }
    writeJson(relativePath, workflow);
  }
} else {
  for (const { relativePath, workflow, failures } of loaded) {
    let changed = false;
    for (const node of failures) {
      const executionId = node.parameters.assignments.assignments.find((assignment) => assignment.name === 'executionId');
      assert(executionId, `${workflow.name} / ${node.name}: missing executionId metadata`);
      assert(['={{ $execution.id }}', '={{ $exec.id }}'].includes(executionId.value), `${workflow.name} / ${node.name}: unexpected executionId expression`);
      if (executionId.value === '={{ $execution.id }}') {
        executionId.value = '={{ $exec.id }}';
        changed = true;
      }
    }
    if (changed) writeJson(relativePath, workflow);
  }
}

const handlerPath = path.join(repoRoot, handlerRelativePath);
if (!fs.existsSync(handlerPath)) writeJson(handlerRelativePath, buildHandler());

console.log(alreadyInstrumented ? 'Failure instrumentation already present; assertions passed.' : 'Instrumented 35 failure nodes across 9 workflows.');
console.log(`Handler: ${handlerRelativePath}`);
