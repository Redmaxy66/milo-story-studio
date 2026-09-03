import {createHash} from 'node:crypto';
import {canonicalJson} from './canonical-json.mjs';

const CONTENT_DOMAIN = 'MILO_M8_CONTENT_V1\n';
const IDEMPOTENCY_DOMAIN = 'MILO_M8_IDEMPOTENCY_V1\n';
const MATERIAL_KEYS = [
  'schemaVersion', 'packageId', 'packageVersion', 'sceneId', 'shotId', 'plannedAssetId',
  'requestRevision', 'promptHash', 'referenceHashes', 'canonicalCapability', 'normalizedSettings',
  'adapterPolicyVersion', 'provider', 'model',
];

export function sha256Hex(bytesOrString) {
  const input = typeof bytesOrString === 'string' || bytesOrString instanceof Uint8Array
    ? bytesOrString
    : (() => { throw new TypeError('sha256Hex accepts a string or Uint8Array'); })();
  return createHash('sha256').update(input).digest('hex');
}

export function contentHash(value) {
  return sha256Hex(CONTENT_DOMAIN + canonicalJson(value));
}

export function normalizeIdempotencyMaterial(material) {
  if (!material || typeof material !== 'object' || Array.isArray(material)) throw new TypeError('idempotency material must be an object');
  const keys = Object.keys(material).sort();
  const expected = [...MATERIAL_KEYS].sort();
  if (keys.length !== expected.length || keys.some((key, i) => key !== expected[i])) {
    throw new TypeError(`idempotency material must contain exactly: ${MATERIAL_KEYS.join(', ')}`);
  }
  if (!Array.isArray(material.referenceHashes) || material.referenceHashes.some(hash => !/^[a-f0-9]{64}$/.test(hash))) {
    throw new TypeError('referenceHashes must contain lowercase SHA-256 strings');
  }
  if (!/^[a-f0-9]{64}$/.test(material.promptHash)) throw new TypeError('promptHash must be lowercase SHA-256');
  return {...material, referenceHashes:[...material.referenceHashes].sort()};
}

export function idempotencyKey(material) {
  return sha256Hex(IDEMPOTENCY_DOMAIN + canonicalJson(normalizeIdempotencyMaterial(material)));
}

export function verifyHash(value, expectedHash) {
  return /^[a-f0-9]{64}$/.test(expectedHash) && contentHash(value) === expectedHash;
}

export {CONTENT_DOMAIN, IDEMPOTENCY_DOMAIN, MATERIAL_KEYS};
