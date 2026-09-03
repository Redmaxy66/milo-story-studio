#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, '04-n8n-workflows/development');
const names = ['Milo M8 Production Intent Builder v0.1','Milo M8 Reference Approval v0.1','Milo M8 Asset Request Approval v0.1','Milo M8 Generation Orchestrator v0.1','Milo OpenArt Adapter v0.1','Milo M8 Generation Reconciler v0.1','Milo M8 Asset Approval v0.1','Milo M8 Revision Processor v0.1','Milo M8 Assembly Builder v0.1','Milo M8 Assembly Approval v0.1','Milo M8 Publishing Package Builder v0.1','Milo M8 Publishing Approval v0.1','Milo M8 Studio Reconciler v0.1'];
let passed = 0;
const test = (name, fn) => { fn(); passed += 1; };

test('exact skeleton file inventory exists', () => {
  const actual = fs.readdirSync(dir).filter(name => (name.startsWith('Milo M8 ') || name === 'Milo OpenArt Adapter v0.1.json') && name.endsWith('.json')).sort();
  assert.deepEqual(actual, names.map(name => `${name}.json`).sort());
});
for (const name of names) test(`${name} inert`, () => {
  const workflow = JSON.parse(fs.readFileSync(path.join(dir, `${name}.json`), 'utf8'));
  assert.equal(workflow.name, name); assert.equal(workflow.active, false); assert.deepEqual(workflow.nodes, []);
  assert.deepEqual(workflow.connections, {}); assert.deepEqual(workflow.pinData, {}); assert.equal(workflow.settings.availableInMCP, false);
  assert.deepEqual(workflow.meta, {miloSkeleton:true,phase:'M8_PHASE_2',liveExecutionProhibited:true});
  const text = JSON.stringify(workflow);
  for (const prohibited of ['credentials','webhook','workflowId','versionId','workspaceId','projectId','endpoint','workbookId','folderId']) assert(!new RegExp(`"${prohibited}"`, 'i').test(text));
});

console.log(`M8 WORKFLOW SKELETON VALIDATION: PASS (${passed}/${passed})`);
