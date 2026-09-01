# D-014 Canon Initialisation — Repository Validation Evidence

**Date:** 2026-09-01  
**Authority:** A2 — CONTROLLED EXECUTE  
**Scope:** Repository implementation and offline/non-production validation only  
**Live n8n mutation/execution:** None  
**Live Google Sheets mutation:** None

## Result

The D-014 repository implementation is ready for separately authorised A3 live installation and verification.

## Governed release verified

The approved release remains:

- `canonVersion = canon-v1.0`
- `canonRef = 977755913d9ad41e4f16392d01ea993507af4102`

A read-only GitHub tag inspection confirmed that `canon-v1.0` remains an annotated tag whose target commit is exactly the approved immutable SHA above.

The Concept Generator stores this approved release mapping explicitly as governed configuration for first assignment. It does not infer the release from HEAD, the default branch, the newest tag, or the latest commit.

Before a first assignment or `PENDING` recovery write, `Verify Governed Canon Release` retrieves `03-prompts/MILO_CANON_CONTEXT.md` using the intended immutable `targetCanonRef`. Normal runtime canon retrieval then continues through the existing `Validate Canon Lineage` path and reads using the Story's stored `canonRef`.

## D-014 deterministic state matrix

Offline deterministic simulation and committed-workflow inspection produced the required outcomes:

| Case | Input state | Expected/verified result |
|---:|---|---|
| 1 | blank marker + blank lineage | Reject as PRE-CANON LEGACY using `CANON_LINEAGE_INVALID`; no initialization. |
| 2 | `PENDING` + blank lineage + `IDEA` | Eligible for first assignment of the explicit governed release. |
| 3 | `PENDING` + exact governed lineage + `IDEA` | Recoverable partial initialization; preserve both canon fields and complete only the marker transition to `ASSIGNED`. |
| 4 | `PENDING` + malformed/conflicting lineage | Reject with `CANON_INITIALIZATION_INTEGRITY_FAILED`; never overwrite. |
| 5 | `ASSIGNED` + exact governed lineage | Accept existing lineage unchanged; no canon write. |
| 6 | `ASSIGNED` + blank/malformed/conflicting lineage | Reject with `CANON_INITIALIZATION_INTEGRITY_FAILED`. |
| 7 | blank marker + exact governed lineage | Accept existing lineage unchanged; marker absence alone does not make the Story PRE-CANON LEGACY. |

Additional state validation rejects `PENDING` initialization/recovery outside `IDEA`.

## Exactly-once / duplicate protection

Concept Generator now performs a Concepts lookup before any D-014 Story canon mutation. If Concepts already exist for the selected Story, the existing `CONCEPTS_ALREADY_EXIST` handled failure is used and canon initialization does not occur.

The original post-canon duplicate lookup remains in place before AI generation, providing a second guard against repeat/race execution.

After a successful first assignment, the Story is `ASSIGNED` with valid immutable lineage. A repeat execution therefore takes the existing-lineage path and does not rewrite canon.

## Persistence and recovery

Permitted D-014 Story updates contain only:

- `storyId` as the matching key;
- `canonVersion`;
- `canonRef`;
- `canonInitializationState = ASSIGNED`;
- `updatedAt`.

They do not change Story lifecycle status.

After the update, Concept Generator rereads the Story and requires exact verification of:

- Story identity;
- `status = IDEA`;
- `canonInitializationState = ASSIGNED`;
- expected `canonVersion`;
- expected immutable `canonRef`.

Only then does it enter the existing canon-lineage validator.

The only automatic partial-write recovery is `PENDING` plus the exact expected governed canon lineage. That path preserves the existing canon fields and completes only the marker transition. Ambiguous or conflicting lineage is never overwritten.

## Failure routing

New/reused handled codes are:

- reused `CANON_LINEAGE_INVALID` — blank marker + blank lineage / D-012 PRE-CANON LEGACY;
- `GOVERNED_CANON_RELEASE_INVALID`;
- `GOVERNED_CANON_RELEASE_RESOLUTION_FAILED`;
- `CANON_INITIALIZATION_INTEGRITY_FAILED`;
- `CANON_INITIALIZATION_SAVE_FAILED`;
- `CANON_INITIALIZATION_VERIFY_FAILED`.

Every new local D-014 `Prepare ... Failure` node routes to the existing terminal `Call Failure Handler`. The Concept Generator retains Error Workflow `3an2myLOF7o4STK8`.

No Failure Handler lifecycle mutation was introduced.

## Story Intake contract

The repository Story Intake export now creates new Stories with:

- `status = IDEA`;
- blank `canonVersion`;
- blank `canonRef`;
- `canonInitializationState = PENDING`.

Historical records are not represented as backfilled fixtures and no existing Story is assumed to carry the new marker.

## Retry / append safety

No automatic retry was added to a Google Sheets append operation. Canon initialization itself is a keyed Story update followed by a reread/verification. Existing append retry prohibitions remain binding.

## Validation performed

1. D-014 state-classifier deterministic simulation: all seven required matrix cases passed, plus an invalid non-`IDEA` recovery case.
2. Committed workflow static/graph inspection: first-assignment duplicate guard, governed-release verification, Story update, reread/verification, existing canon validator, existing runtime GitHub read, downstream duplicate guard, handler routes and lifecycle update separation were verified.
3. Read-only GitHub tag verification: annotated `canon-v1.0` still resolves to commit `977755913d9ad41e4f16392d01ea993507af4102`.
4. Story Intake committed-export inspection: new Stories carry blank lineage plus `PENDING`; the append schema contains all three governed fields.
5. Failure instrumentation regression contract updated to include the D-014 failure nodes/codes and both duplicate guards.
6. Dedicated executable repository validator added at `06-testing/validate_canon_initialization.mjs` for repeatable local/CI execution when a repository checkout is available.

The current execution environment did not provide a mounted repository checkout and has no outbound network access, so the committed Node validators could not be launched directly from the container in this session. The repository validator source and committed exports were independently re-read through GitHub, and the D-014 classifier was executed in an isolated deterministic simulation. This limitation does not substitute for the separately required A3 live verification.

## A3 boundary

No Story Vault schema, n8n workflow, credential, workflow state, Story row, Concept row, or FailureLog row was changed during this Phase A work.
