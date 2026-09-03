#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {OPENART_OPERATIONS, liveOperationNotImplemented, normalizeProviderStatus, reconcileCost, classifyProviderFailure, validateFixtureShape} from '../05-code/m8/openart-adapter-interface.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, '06-testing/fixtures/m8/openart');
const files = fs.readdirSync(dir).filter(name => name.endsWith('.json')).sort();
const fixtures = files.map(name => [name, JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'))]);
const recordedIds = new Map([
  ['smart-shot-completed.recorded.json',['dxNGUtti3ePraCWMHf5a','D9KWR5b5u1IIsVg3ai5D','60']],
  ['element-to-video-completed.recorded.json',['oSrAijOEm1lDkmdgFANk','H2bBnWfHpz1sl7sqfm6A','175']],
  ['selective-revision-completed.recorded.json',['6X4ZYr3WZBezgWvT3iBN','WwWUJpYkR3LLtMJcc2gj','202']],
]);
let passed = 0;
const test = (name, fn) => { fn(); passed += 1; };

test('exact operation inventory', () => assert.equal(OPENART_OPERATIONS.length, 10));
for (const operation of OPENART_OPERATIONS) test(`${operation} fails closed`, () => assert.equal(liveOperationNotImplemented(operation).ok, false));
for (const [name, fixture] of fixtures) test(`${name} safety shape`, () => assert.deepEqual(validateFixtureShape(fixture), {valid:true, errors:[]}));
for (const [name, expected] of recordedIds) test(`${name} approved historical evidence`, () => {
  const fixture = fixtures.find(([file]) => file === name)[1];
  assert.equal(fixture.historyId, expected[0]); assert.equal(fixture.resourceId, expected[1]); assert.equal(fixture.actualCost, expected[2]);
  assert.equal(fixture.fixtureMetadata.historical, true); assert.equal(fixture.fixtureMetadata.nonCallable, true);
});
test('all synthetic identifiers are inert', () => {
  for (const [, fixture] of fixtures.filter(([, f]) => f.fixtureMetadata.fixtureType === 'synthetic')) for (const value of [fixture.historyId, fixture.resourceId].filter(Boolean)) assert(value.startsWith('SYNTHETIC-'));
});
test('completed without resource reconciles', () => assert.deepEqual(normalizeProviderStatus('completed', {expectedOutputs:1, observedOutputs:0}), {normalizedStatus:'RECONCILIATION_REQUIRED', failureCode:'OPENART_COMPLETED_WITHOUT_ASSET', providerStatusRaw:'completed'}));
test('partial output is classified', () => assert.equal(normalizeProviderStatus('completed', {expectedOutputs:2, observedOutputs:1, resourceAvailable:true}).normalizedStatus, 'COMPLETED_PARTIAL'));
test('cost within cap reconciles', () => assert.equal(reconcileCost({estimateCost:'10',actualCost:'10',cap:'75'}).ok, true));
test('cost above cap stops', () => assert.equal(reconcileCost({estimateCost:'80',actualCost:null,cap:'75'}).code, 'OPENART_COST_CAP_EXCEEDED'));
test('ambiguous submission requires manual recovery', () => assert.equal(classifyProviderFailure({kind:'submission',chargeObserved:true}).code, 'M8_MANUAL_RECOVERY_REQUIRED'));

console.log(`M8 OPENART ADAPTER VALIDATION: PASS (${passed}/${passed})`);
