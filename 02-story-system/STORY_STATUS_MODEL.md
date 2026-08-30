# Story Status Model

- **Scope:** Story lifecycle only
- **Implementation baseline:** M6

Operational error codes and FailureLog triage values are deliberately excluded. See `ERROR_CODE_REGISTER.md` and `FAILURE_INSTRUMENTATION.md`.

## Implemented lifecycle states

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
| `CONTINUITY_APPROVED` | Continuity review has been approved. | M7 entry only after M6.5 closes. |
| `SCRIPT_REVISION_REQUIRED` | Continuity review requires script regeneration or correction. | Controlled script revision path. |

## Transition rules

- Only the workflow responsible for a completed stage may advance the Story.
- A failure event never changes Story lifecycle status by itself.
- A partial two-write transition must use an explicit repair path; it must not invent a new lifecycle state.
- Approval and continuity outcomes remain separate from operational failure logging.
- M7 states are not added until Production Package + Asset Provenance is designed and implemented.

## Separate operational concepts

`FailureLog.status` is limited to `OPEN`, `RESOLVED`, and `IGNORED`. Those values describe operator triage, not story progress.

Operational codes such as `SCRIPT_SAVE_FAILED` describe why an execution failed. They are registered in `ERROR_CODE_REGISTER.md` and never become Story lifecycle values.
