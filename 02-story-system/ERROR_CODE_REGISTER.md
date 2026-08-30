# Operational Error Code Register

- **Scope:** Implemented M3-M6.5 workflow exports
- **Separation rule:** These are operational failure codes, not Story lifecycle states.

## Audit baseline

At commit `e74ef9b`, the nine exported workflows contained 35 unique explicit error codes across 40 Set/Code definitions or emissions. The previously cited count of 55 is not reproducible from the repository exports. Thirty-four of the 35 local `Prepare ... Failure` nodes emitted `errorCode`; Story Intake emitted only `success` and `message`.

M6.5 adds `STORY_SUBMISSION_VALIDATION_FAILED` to that Story Intake payload and two defensive handler fallbacks: `HANDLED_FAILURE` and `UNHANDLED_WORKFLOW_ERROR`. No baseline code was removed or renamed.

## Registered codes

| Code | Primary producer or condition |
|---|---|
| `APPROVAL_VALIDATION_FAILED` | Concept Approval fallback when approved-concept validation fails without a more specific code. |
| `APPROVED_CONCEPT_COUNT_INVALID` | Concept Approval or Outline Generator finds other than one eligible approved concept. |
| `APPROVED_OUTLINE_COUNT_INVALID` | Outline Approval or Script Generator finds other than one eligible approved outline. |
| `APPROVED_OUTLINE_INVALID` | Approved outline identifiers or structure are invalid. |
| `APPROVED_OUTLINE_VALIDATION_FAILED` | Script Generator fallback for approved-outline validation. |
| `APPROVED_SCRIPT_INVALID` | Script Approval or Continuity Reviewer rejects an approved script deterministically. |
| `CONCEPTS_ALREADY_EXIST` | Concept Generator duplicate guard. |
| `CONCEPT_STORY_ID_MISMATCH` | Concept Approval finds a concept that does not belong to its Story. |
| `CONCEPT_VALIDATION_FAILED` | Generated concept batch fails deterministic validation. |
| `CONTINUITY_AI_OUTPUT_INVALID` | Continuity Reviewer output fails deterministic validation. |
| `CONTINUITY_APPROVAL_INVALID` | Continuity approval input fails deterministic validation. |
| `CONTINUITY_REVIEW_ALREADY_EXISTS` | Continuity Reviewer duplicate guard. |
| `CONTINUITY_REVIEW_PROCESSING_FAILED` | Continuity Approval cannot stamp the review as processed. |
| `CONTINUITY_REVIEW_SAVE_FAILED` | Continuity Reviewer cannot append the review record. |
| `DUPLICATE_OUTLINE` | Outline Generator duplicate guard. |
| `HANDLED_FAILURE` | Defensive handler fallback when a handled caller supplies no code. |
| `OUTLINE_APPROVAL_STAMP_FAILED` | Outline Approval changes the Story but cannot stamp the outline. |
| `OUTLINE_GENERATION_FAILED` | Outline generation exhausts its allowed attempts. |
| `OUTLINE_SAVE_FAILED` | Outline Generator cannot append the outline record. |
| `OUTLINE_VALIDATION_FAILED` | Generated outline fails deterministic validation. |
| `SCRIPT_ALREADY_EXISTS` | Script Generator duplicate guard. |
| `SCRIPT_NOT_READY_FOR_CONTINUITY_REVIEW` | Story or script is not eligible for continuity review. |
| `SCRIPT_SAVE_FAILED` | Script Generator cannot append the script record. |
| `SCRIPT_VALIDATION_FAILED` | Generated script fails deterministic validation. |
| `STORY_CONTINUITY_APPROVED_UPDATE_FAILED` | Continuity Approval cannot set `CONTINUITY_APPROVED`. |
| `STORY_CONTINUITY_STATUS_UPDATE_FAILED` | Continuity Reviewer saves a review but cannot set `CONTINUITY_REVIEWED`. |
| `STORY_ID_MISSING` | Approval validation input has no Story ID. |
| `STORY_NOT_READY_FOR_CONCEPT_APPROVAL` | Story is not eligible for concept approval. |
| `STORY_NOT_READY_FOR_CONTINUITY_APPROVAL` | Story is not eligible for continuity approval. |
| `STORY_NOT_READY_FOR_OUTLINE_APPROVAL` | Story is not eligible for outline approval. |
| `STORY_NOT_READY_FOR_SCRIPT_APPROVAL` | Story is not eligible for script approval. |
| `STORY_NOT_READY_FOR_SCRIPT_GENERATION` | Story is not eligible for script generation. |
| `STORY_OUTLINE_APPROVAL_UPDATE_FAILED` | Outline Approval cannot set `OUTLINE_APPROVED`. |
| `STORY_OUTLINE_STATUS_UPDATE_FAILED` | Outline Generator saves an outline but cannot set `OUTLINE_GENERATED`. |
| `STORY_SCRIPT_REVISION_UPDATE_FAILED` | Continuity Approval cannot set `SCRIPT_REVISION_REQUIRED`. |
| `STORY_SCRIPT_STATUS_UPDATE_FAILED` | Script Generator saves a script but cannot set `SCRIPT_GENERATED`. |
| `STORY_SUBMISSION_VALIDATION_FAILED` | Story Intake rejects required or invalid submission data. |
| `UNHANDLED_WORKFLOW_ERROR` | Error Trigger receives an unhandled n8n execution or trigger failure. |

## Governance

- Preserve the most specific existing code at the local failure source.
- Add a code here when a new operational failure condition is implemented.
- Do not add operational codes to `STORY_STATUS_MODEL.md`.
- Do not use `FailureLog.status` values as error codes.
