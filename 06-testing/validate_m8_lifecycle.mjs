#!/usr/bin/env node
import assert from 'node:assert/strict';
import {controlled, validateTransition} from '../05-code/m8/contracts.mjs';
import fs from 'node:fs';

let passed = 0;
const test = (name, fn) => { fn(); passed += 1; };

for (const [type, states] of Object.entries(controlled.transitions)) for (const [from, targets] of Object.entries(states)) for (const to of targets) {
  test(`${type} ${from} -> ${to}`, () => assert.equal(validateTransition(type, from, to).valid, true));
}
for (const [type, from, to] of [
  ['ProductionAssetRequest','SATISFIED','DRAFT'], ['GenerationAttempt','COMPLETED','CREATED'],
  ['GeneratedAsset','APPROVED','AVAILABLE'], ['RevisionRequest','SATISFIED','DRAFT'],
  ['EpisodeAssembly','APPROVED','BUILDING'], ['PublishingPackage','APPROVED','DRAFT'],
]) test(`reject ${type} ${from} -> ${to}`, () => assert.equal(validateTransition(type, from, to).valid, false));

test('only connectivity has a defined cap', () => {
  assert.deepEqual(controlled.budgetPolicy.CONNECTIVITY, {approvedCap:'75', unit:'PROVIDER_CREDIT'});
  for (const stage of ['ONE_SCENE_PILOT','EPISODE_PREVIEW','FINAL_RESOLUTION']) assert.equal(controlled.budgetPolicy[stage].approvedCap, null);
});
test('cross-stage transfers prohibited', () => assert.equal(controlled.budgetPolicy.crossStageTransferAllowed, false));
test('no published lifecycle value', () => assert(!JSON.stringify(controlled).includes('"PUBLISHED"')));
test('story status contains exact M8 roll-up', () => {
  const text = fs.readFileSync(new URL('../02-story-system/STORY_STATUS_MODEL.md', import.meta.url), 'utf8');
  assert(text.includes('PRODUCTION_PACKAGE_GENERATED -> EPISODE_ASSEMBLED -> PUBLISHING_PACKAGE_READY'));
  assert(text.includes('do not change live Story Vault validation'));
});

console.log(`M8 LIFECYCLE VALIDATION: PASS (${passed}/${passed})`);
