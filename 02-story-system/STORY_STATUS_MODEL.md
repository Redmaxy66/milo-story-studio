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
