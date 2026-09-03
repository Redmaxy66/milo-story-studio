# M8 Idempotency and Hashing Specification

**Version:** 1.0
**Canonicalisation:** `MILO_CANONICAL_JSON_V1`

## Canonical JSON

1. Encode as UTF-8.
2. Sort object keys recursively by Unicode code point.
3. Preserve array order unless a governing contract explicitly requires a pre-hash sort.
4. Emit no insignificant whitespace.
5. Preserve explicit `null`.
6. Use JSON string and Boolean encoding.
7. Reject `undefined`, functions, symbols, bigint, non-finite numbers, sparse arrays, cycles, and unsupported values.
8. Use integers or canonical non-negative decimal strings for cost values; do not hash ambiguous floating-point cost values.
9. Validate timestamps and identifiers before canonicalisation; do not silently normalise them.

## Content hash

`SHA-256(UTF-8("MILO_M8_CONTENT_V1\n" + canonicalJSON(value)))`

Output is lowercase 64-character hexadecimal.

## Idempotency key

`SHA-256(UTF-8("MILO_M8_IDEMPOTENCY_V1\n" + canonicalJSON(material)))`

The material contains exactly:

1. `schemaVersion`
2. `packageId`
3. `packageVersion`
4. `sceneId`
5. `shotId`
6. `plannedAssetId`
7. `requestRevision`
8. `promptHash`
9. `referenceHashes`, sorted lexically before hashing
10. `canonicalCapability`
11. `normalizedSettings`
12. `adapterPolicyVersion`
13. `provider`
14. `model`

`provider` and `model` must be explicit `null` for a portable request. No extra property is accepted.

Timestamps, workflow execution IDs, approver identities, estimates, and actual costs do not participate.

## Scope and duplicate rule

Only one non-terminal attempt may exist for one idempotency key. An uncertain charge or submission blocks a new attempt until reconciliation. A retry creates a new attempt record but retains the request idempotency key and links to the earlier attempt.

## Durable media

- SHA-256 is the authoritative identity of durable bytes.
- Storage IDs and paths are locators only.
- Approval binds the exact SHA-256 and record version.
- Approved files are write-restricted.
- Corrected, regenerated, or re-encoded bytes create a new file and record.
- Approved content is never replaced in place.
- Assembly re-fetches each exact durable input and recomputes SHA-256 immediately before dispatch.
- A mismatch produces `M8_DURABLE_CHECKSUM_MISMATCH`, blocks assembly, and quarantines the asset for reconciliation.

## Implementations

`05-code/m8/canonical-json.mjs` and `05-code/m8/hashing.mjs` are pure offline implementations of this specification.
