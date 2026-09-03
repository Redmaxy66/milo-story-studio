#!/usr/bin/env node
import assert from 'node:assert/strict';
import {canonicalJson} from '../05-code/m8/canonical-json.mjs';
import {sha256Hex, contentHash, idempotencyKey} from '../05-code/m8/hashing.mjs';

let passed = 0;
const test = (name, fn) => { fn(); passed += 1; };
const h = char => char.repeat(64);
const material = {
  schemaVersion:'m8-contracts-v1.0', packageId:'MILO-999-S01-P01', packageVersion:1,
  sceneId:'MILO-999-S01-P01-SC01', shotId:'MILO-999-S01-P01-SC01-SH01', plannedAssetId:'MILO-999-S01-P01-A001',
  requestRevision:1, promptHash:h('a'), referenceHashes:[h('c'),h('b')], canonicalCapability:'TEXT_TO_IMAGE',
  normalizedSettings:{quality:'preview'}, adapterPolicyVersion:'openart-adapter-v0.1', provider:null, model:null,
};

test('standard SHA-256 vector', () => assert.equal(sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'));
test('object keys canonicalize recursively', () => assert.equal(canonicalJson({z:1,a:{y:2,b:3}}), '{"a":{"b":3,"y":2},"z":1}'));
test('object insertion order is irrelevant', () => assert.equal(contentHash({a:1,b:2}), contentHash({b:2,a:1})));
test('array order is preserved', () => assert.notEqual(contentHash([1,2]), contentHash([2,1])));
test('explicit null affects content hash', () => assert.notEqual(contentHash({a:null}), contentHash({})));
test('reference hashes sort before idempotency hashing', () => assert.equal(idempotencyKey(material), idempotencyKey({...material, referenceHashes:[h('b'),h('c')]})));
for (const field of ['requestRevision','promptHash','canonicalCapability','adapterPolicyVersion']) test(`${field} affects key`, () => {
  const changed = structuredClone(material);
  changed[field] = field === 'requestRevision' ? 2 : field === 'promptHash' ? h('d') : `${material[field]}-changed`;
  assert.notEqual(idempotencyKey(material), idempotencyKey(changed));
});
test('settings affect key', () => assert.notEqual(idempotencyKey(material), idempotencyKey({...material, normalizedSettings:{quality:'final'}})));
test('provider affects non-portable key', () => assert.notEqual(idempotencyKey(material), idempotencyKey({...material, provider:'OpenArt'})));
test('extra material is rejected', () => assert.throws(() => idempotencyKey({...material, createdAt:'2026-01-01T00:00:00Z'})));
test('undefined rejected', () => assert.throws(() => canonicalJson({a:undefined})));
test('non-finite rejected', () => assert.throws(() => canonicalJson({a:Infinity})));
test('fractional number rejected', () => assert.throws(() => canonicalJson({cost:1.5})));
test('sparse array rejected', () => { const value = []; value[1] = 1; assert.throws(() => canonicalJson(value)); });
test('cyclic input rejected', () => { const value = {}; value.self = value; assert.throws(() => canonicalJson(value)); });
test('same input is stable', () => assert.equal(idempotencyKey(material), idempotencyKey(structuredClone(material))));

console.log(`M8 HASHING VALIDATION: PASS (${passed}/${passed})`);
