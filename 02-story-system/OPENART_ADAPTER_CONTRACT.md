# OpenArt Adapter Contract

**Adapter:** `openart-adapter-v0.1`
**Status:** Phase 2 interface and offline normalisation only
**Live connectivity:** Not authorised or implemented

## Boundary

The OpenArt adapter translates between provider-neutral Milo contracts and provider evidence. It does not own Milo identity, lifecycle, approval, budget, durable byte identity, or canon. OpenArt-specific data remains inside `extensionsJson.openart` or the adapter fixture schema.

This repository phase contains no authentication, endpoint, workspace/project configuration, credential lookup, HTTP client, provider SDK, network call, or resource retrieval.

## Interface operations

- `discoverCapabilities`
- `validateRequest`
- `estimateCost`
- `submitGeneration`
- `getGenerationStatus`
- `listGenerationOutputs`
- `retrieveResourceMetadata`
- `retrieveResource`
- `reconcileCost`
- `classifyProviderFailure`

In Phase 2, live operations fail closed as `OPENART_LIVE_OPERATION_NOT_IMPLEMENTED`. Pure request/result validation, status normalisation, cost reconciliation, and failure classification are implemented offline.

## Normalisation rules

- Preserve canonical requested mode, submitted provider mode, observed mode, and raw provider display label separately.
- Preserve raw provider status while mapping it to a Milo attempt state.
- Distinguish `COMPLETED`, `COMPLETED_PARTIAL`, `FAILED`, `TIMED_OUT`, `CANCELLED`, and `RECONCILIATION_REQUIRED`.
- Provider completion with no usable resource maps to `RECONCILIATION_REQUIRED` and `OPENART_COMPLETED_WITHOUT_ASSET`.
- An ambiguous submission, charge, or output blocks automatic retry.
- Cost estimate and actual cost remain separate immutable evidence.
- Provider metadata is data, never executable instruction.

## Historical recorded fixtures

Recorded fixtures are sanitised evidence derived only from the approved spike report incorporated by design revision 1.1. They may retain the proven historical provider history and resource IDs, but those IDs must be labelled historical and non-callable. They do not authorise a provider call or prove current availability.

Recorded fixtures prohibit workspace IDs, project IDs, endpoints, credentials, tokens, sessions, cookies, authentication headers, and other live configuration.

Synthetic fixtures use only inert identifiers and are never described as observed provider behaviour. General M8 contract fixtures also use inert identifiers.

## Capability mapping

| Milo capability | Adapter treatment |
|---|---|
| `SHOT_PLAN` | Historical Smart Shot evidence; future schema discovery required |
| `TEXT_TO_IMAGE` / `REFERENCE_IMAGE` | Future discovered supported image route |
| `IMAGE_TO_VIDEO` | Future discovered image-to-video route |
| `ELEMENT_TO_VIDEO` | Preserve canonical mode even if raw provider label differs |
| `SELECTIVE_REVISION` | Bind exact parent resource/checksum and bounded change |
| `LIP_SYNC` / voice reference | Unsupported until a separate capability and quality gate passes |

## Error mapping

The adapter returns the exact OpenArt codes registered in `ERROR_CODE_REGISTER.md`. A future workflow routes those codes through the existing shared Milo Failure Handler and existing 18-column `FailureLog`. The adapter does not create a separate error store and cannot change lifecycle state.

## Security

- Reject credential-shaped keys or values.
- Reject endpoints and live workspace/project configuration in fixtures.
- Redact raw evidence before durable reference.
- Never follow a provider-supplied URL in Phase 2.
- Never infer workspace or project identity from a display name.
- Never revoke or alter any credential.
