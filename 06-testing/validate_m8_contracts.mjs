#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {validateContract, validateContractCollection, controlled} from '../05-code/m8/contracts.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const schema = readJson('02-story-system/M8_CONTRACTS_SCHEMA.json');
const valid = readJson('06-testing/fixtures/m8/contracts/valid-contracts.json');
const invalid = readJson('06-testing/fixtures/m8/contracts/invalid-contracts.json');
let passed = 0;
const test = (name, fn) => { fn(); passed += 1; };

test('schema declares draft 2020-12', () => assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema'));
test('schema dispatches twelve contracts', () => assert.equal(schema.oneOf.length, 12));
for (const type of controlled.recordTypes) test(`schema defines ${type}`, () => {
  assert(schema.$defs[type]);
  assert.equal(schema.$defs[type].unevaluatedProperties, false);
});
test('fixture has exactly one of every contract', () => assert.deepEqual(valid.map(x => x.recordType).sort(), [...controlled.recordTypes].sort()));
for (const record of valid) test(`${record.recordType} fixture validates`, () => assert.deepEqual(validateContract(record), {valid:true, errors:[]}));
test('complete fixture lineage validates', () => assert.deepEqual(validateContractCollection(valid), {valid:true, errors:[]}));
test('general fixtures use only inert provider references', () => {
  const text = JSON.stringify(valid);
  assert(!text.includes('dxNGUtti3ePraCWMHf5a'));
  assert(!text.includes('oSrAijOEm1lDkmdgFANk'));
  assert(!text.includes('6X4ZYr3WZBezgWvT3iBN'));
  for (const record of valid.filter(x => ['GenerationAttempt','GeneratedAsset'].includes(x.recordType))) assert.equal(record.providerReferenceClass ?? record.providerRequestRefClass, 'SYNTHETIC');
});
for (const item of invalid) test(item.caseId, () => {
  const source = valid.find(record => record.recordType === (item.targetType ?? 'ProductionIntentArtifact'));
  const record = structuredClone(source);
  if (item.mutation.remove) delete record[item.mutation.remove];
  Object.assign(record, item.mutation.set ?? {});
  const result = validateContract(record);
  assert.equal(result.valid, false);
  assert(result.errors.some(error => error.code === item.expectedCode), `${item.caseId} did not emit ${item.expectedCode}`);
});
test('cross-lineage mismatch is rejected', () => {
  const records = structuredClone(valid);
  records[1].canonRef = 'b'.repeat(40);
  assert(validateContractCollection(records).errors.some(error => error.code === 'M8_LINEAGE_MISMATCH'));
});

console.log(`M8 CONTRACT VALIDATION: PASS (${passed}/${passed})`);
