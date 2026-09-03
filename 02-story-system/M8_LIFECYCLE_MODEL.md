# M8 Lifecycle Model

**Version:** 1.0
**Status:** Phase 2 repository definition only; no live Story Vault or n8n change

## Principles

- Lifecycle states are distinct from operational error codes and `FailureLog.status`.
- Only transitions listed in `M8_CONTROLLED_VALUES.json` are permitted.
- A terminal record never resets.
- Retry creates a new `GenerationAttempt`.
- Revision creates a new `RevisionRequest`, `ProductionAssetRequest`, attempt lineage, asset, and durable file.
- Human approvals are immutable append-only decisions, not mutable lifecycle rows.
- Failure logging never advances or repairs lifecycle state.

## ProductionAssetRequest

`DRAFT -> AWAITING_APPROVAL -> APPROVED -> SUBMISSION_PENDING -> SATISFIED`

Alternate terminal outcomes are `REJECTED`, `FAILED`, and `CANCELLED`. Approval binds the exact request hash and stage-specific cost cap. `SATISFIED` requires an approved generated asset.

## GenerationAttempt

`CREATED -> SUBMITTING -> SUBMITTED -> RUNNING -> COMPLETED`

`COMPLETED_PARTIAL`, `FAILED`, `CANCELLED`, and `ABANDONED` are terminal. `TIMED_OUT` must move only to `RECONCILIATION_REQUIRED`. Ambiguous submission, charge, completion, or resource availability enters `RECONCILIATION_REQUIRED`; no blind resubmission is permitted.

## GeneratedAsset

`PROVIDER_ONLY -> RETRIEVING -> AVAILABLE -> AWAITING_REVIEW -> APPROVED`

Alternate outcomes are `RETRIEVAL_FAILED`, `VALIDATION_FAILED`, `REJECTED`, `QUARANTINED`, `SUPERSEDED`, and `RETIRED`. `SUPERSEDED` changes selection preference but does not remove history. An approved asset may be quarantined if a later checksum or rights problem is detected.

## RevisionRequest

`DRAFT -> AWAITING_APPROVAL -> APPROVED -> REQUEST_CREATED -> SATISFIED`

Alternate terminal outcomes are `REJECTED`, `CANCELLED`, and `FAILED`. A revision is bounded to its approved change and cannot broaden silently.

## EpisodeAssembly

`DRAFT -> BUILD_QUEUED -> BUILDING -> BUILT -> AWAITING_APPROVAL -> APPROVED`

Alternate outcomes are `QA_FAILED`, `REJECTED`, `SUPERSEDED`, and `CANCELLED`. Build inputs must be exact approved checksums, write-restricted, and revalidated immediately before assembly.

## PublishingPackage

`DRAFT -> VALIDATING -> READY_FOR_REVIEW -> APPROVED`

Alternate outcomes are `REJECTED`, `SUPERSEDED`, and `HOLD`. No `PUBLISHED` state exists in M8.

## Story roll-up

The approved repository-only progression is:

`PRODUCTION_PACKAGE_GENERATED -> EPISODE_ASSEMBLED -> PUBLISHING_PACKAGE_READY`

`EPISODE_ASSEMBLED` requires one exact approved assembly. `PUBLISHING_PACKAGE_READY` requires the approved M8 publishing profiles and explicit human audience/safety decisions. Asset progress and failures are derived and do not create a `PRODUCTION_IN_PROGRESS` Story state.

## Derived readiness

Publication readiness is one of `NOT_READY`, `ASSETS_PENDING`, `ASSEMBLY_PENDING`, `PUBLISHING_REVIEW_PENDING`, `READY`, or `BLOCKED`. It is a derived operator view, not an authoritative Story state.

## Transition validation

`05-code/m8/contracts.mjs` validates transitions from the exact machine-readable table in `M8_CONTROLLED_VALUES.json`. Any unlisted transition returns `M8_CONTROLLED_VALUE_INVALID` and causes no mutation.
