#!/usr/bin/env node
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const read = relative => fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');
const spec = read('02-story-system/M8_STORY_VAULT_SCHEMA.md');
const failure = read('02-story-system/FAILURE_INSTRUMENTATION.md');
const tabs = ['ProductionIntentArtifacts','ProductionAssetRequests','GenerationAttempts','GeneratedAssets','AssetReferences','RevisionRequests','AssetApprovals','CostRecords','EpisodeAssemblies','AssemblyApprovals','PublishingPackages','PublishingApprovals','StudioControl'];
const studioColumns = ['controlKey','scopeType','storyId','packageId','currentStage','readinessState','blockingReasonCodesJson','pendingApprovalTypesJson','openFailureCount','budgetStageStatusJson','sourceRecordRefsJson','derivationVersion','lastDerivedAt'];
let passed = 0;
const test = (name, fn) => { fn(); passed += 1; };

for (const tab of tabs) test(`tab ${tab} specified`, () => assert(spec.includes(`\`${tab}\``)));
test('exact thirteen-tab numbered inventory', () => {
  const inventory = [...spec.matchAll(/^\d+\. `([^`]+)`$/gm)].slice(0, 13).map(match => match[1]);
  assert.deepEqual(inventory, tabs);
});
test('M8Errors is explicitly prohibited, not proposed', () => { assert(!/^\d+\. `M8Errors`$/m.test(spec)); assert(spec.includes('There is no `M8Errors` tab')); });
test('StudioControl is derived/read-only/non-authoritative', () => { for (const phrase of ['derived, read-only, non-authoritative','not a thirteenth contract','Manual edits have no authority']) assert(spec.includes(phrase)); });
for (const column of studioColumns) test(`StudioControl column ${column}`, () => assert(spec.includes(`\`${column}\``)));
test('FailureLog remains the sole failure store', () => assert(spec.includes('sole approved operational failure store')));
test('FailureLog schema stays at eighteen columns', () => assert.equal((failure.match(/^\| \d+ \|/gm) ?? []).length, 18));
test('FailureLog schema source remains unchanged from governed baseline', () => assert.equal(createHash('sha256').update(failure).digest('hex'), 'fc8e75d201f5721467d38df84ec7126fb4ebb17f37fa6d3d54c2fc9fa6c4e092'));
test('no live installation claim', () => assert(spec.includes('No tab is created or changed under Phase 2')));

console.log(`M8 STORY VAULT SCHEMA VALIDATION: PASS (${passed}/${passed})`);
