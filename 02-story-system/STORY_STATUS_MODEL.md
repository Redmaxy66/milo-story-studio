# Story Status Model

- **Scope:** Story lifecycle only
- **Implementation baseline:** M7 repository design; live M7 state not yet configured

Operational error codes and FailureLog triage values are deliberately excluded. See `ERROR_CODE_REGISTER.md` and `FAILURE_INSTRUMENTATION.md`.

## Implemented lifecycle states through M6

| State | Meaning | Normal next state or route |
|---|---|---|
| `IDEA` | Story Intake has stored a new idea. | `CONCEPT_GENERATED` |
| `CONCEPT_GENERATED` | Candidate concepts have been generated and await approval. | `CONCEPT_APPROVED` |
| `CONCEPT_APPROVED` | One concept is approved for outlining. | `OUTLINE_GENERATED` |
| `OUTLINE_GENERATED` | An outline has been generated and awaits approval. | `OUTLINE_APPROVED` |
| `OUTLINE_APPROVED` | The outline is approved for scripting. | `SCRIPT_GENERATED` |
| `SCRIPT_GENERATED` | A script has been generated and awaits approval. | `SCRIPT_APPROVED` |
| `SCRIPT_APPROVED` | The script is approved for continuity review. | `CONTINUITY_REVIEWED` |
| `CONTINUITY_REVIEWED` | Continuity review is complete and awaits human disposition. | `CONTINUITY_APPROVED` or `SCRIPT_REVISION_REQUIRED` |
| `CONTINUITY_APPROVED` | Continuity review has been approved. | M7 Production Package generation. |
| `SCRIPT_REVISION_REQUIRED` | Continuity review requires script regeneration or correction. | Controlled script revision path. |

## Canon initialization is not lifecycle

`canonInitializationState` is a Story-level provenance control field governed by D-014. It is not a Story lifecycle state.

- Story Intake creates a new post-D-014 Story as `status=IDEA` with `canonInitializationState=PENDING` and blank canon lineage.
- Concept Generator may perform the governed `PENDING -> ASSIGNED` first-canon transition while the Story remains `IDEA`.
- Only successful Concept persistence advances the Story from `IDEA` to `CONCEPT_GENERATED`.
- Canon-initialization failure or repair does not invent or change a lifecycle state.
- Historical blank-marker / blank-lineage records remain governed by D-012 and are not progressed by canon initialization.

## Outline Generator eligible-Story selection contract

Outline Generator evaluates the complete `CONCEPT_APPROVED` Story candidate set before selecting one Story. It must not rely on Story Vault row order or take the first matching row.

Candidates are ordered deterministically by numeric `row_number`, then `storyId`, then stable input order and classified as follows:

- blank `canonInitializationState` plus blank `canonVersion`/`canonRef` is PRE-CANON LEGACY under D-012 and is excluded without mutation;
- `ASSIGNED` plus valid Story canon lineage is eligible;
- blank marker plus valid Story canon lineage remains eligible because marker absence alone does not invalidate existing governed lineage;
- `PENDING`, unexpected marker values, partial lineage, or malformed lineage on a `CONCEPT_APPROVED` Story is a controlled `CANON_LINEAGE_INVALID` integrity failure and is never repaired by Outline Generator.

The first legitimate governed candidate is selected. If no legitimate candidate exists, the first deterministic malformed/conflicting candidate routes to the existing controlled canon-lineage failure path. If every candidate is PRE-CANON LEGACY, the selector emits no item and Outline generation ends as a controlled no-eligible-story no-op.

Approved Concept lookup, duplicate protection, runtime canon retrieval, Outline persistence, and the `CONCEPT_APPROVED -> OUTLINE_GENERATED` transition operate only on the selected governed Story. Outline Generator never assigns, replaces, or repairs Story canon.

## M7 lifecycle extension

| State | Meaning | Normal next state or route |
|---|---|---|
| `PRODUCTION_PACKAGE_GENERATED` | A complete immutable Production Package header and its scene child records have been persisted and verified. | M8 entry under separate authority. |

Approved M7 transition:

`CONTINUITY_APPROVED -> PRODUCTION_PACKAGE_GENERATED`

The M7 transition is permitted only after:

1. complete package generation and deterministic validation;
2. immutable scene-row persistence;
3. complete scene-set verification;
4. immutable Production Package header persistence;
5. complete package verification.

Controlled package regeneration may operate on an already `PRODUCTION_PACKAGE_GENERATED` Story when explicitly invoked, but successful regeneration does not invent a second lifecycle state and leaves the Story at `PRODUCTION_PACKAGE_GENERATED`.

## Transition rules

- Only the workflow responsible for a completed stage may advance the Story.
- A failure event never changes Story lifecycle status by itself.
- A partial multi-write transition must use an explicit repair path; it must not invent a new lifecycle state.
- Approval and continuity outcomes remain separate from operational failure logging.
- M7 adds only `PRODUCTION_PACKAGE_GENERATED`.
- M8 states are not added under M7 authority.

## Separate operational concepts

`FailureLog.status` is limited to `OPEN`, `RESOLVED`, and `IGNORED`. Those values describe operator triage, not story progress.

Operational codes describe why an execution failed. They are registered in `ERROR_CODE_REGISTER.md` and never become Story lifecycle values.
