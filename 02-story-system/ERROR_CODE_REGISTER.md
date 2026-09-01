# Operational Error Code Register

- **Scope:** Implemented M3-M6.5 workflow exports plus M7 repository implementation
- **Separation rule:** These are operational failure codes, not Story lifecycle states.

## Audit baseline

At commit `e74ef9b`, the nine exported workflows contained 35 unique explicit error codes across 40 Set/Code definitions or emissions. The previously cited count of 55 is not reproducible from the repository exports. Thirty-four of the 35 local `Prepare ... Failure` nodes emitted `errorCode`; Story Intake emitted only `success` and `message`.

M6.5 adds `STORY_SUBMISSION_VALIDATION_FAILED` to that Story Intake payload and two defensive handler fallbacks: `HANDLED_FAILURE` and `UNHANDLED_WORKFLOW_ERROR`. No baseline code was removed or renamed.

M7 repository implementation adds Production Package-specific codes without renaming or removing earlier codes. M7 live behaviour remains unproven until separately authorised Phase 4+ configuration and testing.

D-014 repository remediation adds canon-initialisation-specific failures to the Concept Generator while retaining `CANON_LINEAGE_INVALID` for the D-012 blank-marker + blank-lineage PRE-CANON LEGACY rejection.

## Registered codes

| Code | Primary producer or condition |
|---|---|
| `APPROVAL_VALIDATION_FAILED` | Concept Approval fallback when approved-concept validation fails without a more specific code. |
| `APPROVED_CONCEPT_COUNT_INVALID` | Concept Approval or Outline Generator finds other than one eligible approved concept. |
| `APPROVED_OUTLINE_COUNT_INVALID` | Outline Approval or Script Generator finds other than one eligible approved outline. |
| `APPROVED_OUTLINE_INVALID` | Approved outline identifiers or structure are invalid. |
| `APPROVED_OUTLINE_VALIDATION_FAILED` | Script Generator fallback for approved-outline validation. |
| `APPROVED_SCRIPT_INVALID` | Script Approval or Continuity Reviewer rejects an approved script deterministically. |
| `CANON_LINEAGE_INVALID` | An affected generator/reviewer rejects blank or malformed authoritative Story canonVersion/canonRef before GitHub retrieval. Concept Generator also uses it when blank marker + blank lineage is classified PRE-CANON LEGACY under D-012. |
| `CANON_LINEAGE_MISMATCH` | An affected downstream artifact's stored canon lineage does not match the authoritative Story. |
| `CANON_INITIALIZATION_INTEGRITY_FAILED` | Concept Generator finds a D-014 marker/canon conflict, malformed partial lineage, unexpected governed lineage, or another state that must not be repaired by overwriting canon. |
| `CANON_INITIALIZATION_SAVE_FAILED` | Concept Generator cannot safely persist the permitted first assignment or `PENDING -> ASSIGNED` recovery update. |
| `CANON_INITIALIZATION_VERIFY_FAILED` | Post-write Story reread does not exactly verify the intended immutable canon lineage, `ASSIGNED` marker, Story identity and `IDEA` lifecycle state. |
| `GOVERNED_CANON_RELEASE_INVALID` | The explicitly configured approved canonVersion/canonRef mapping is missing or malformed before first assignment. |
| `GOVERNED_CANON_RELEASE_RESOLUTION_FAILED` | The configured immutable approved canonRef cannot retrieve the governed runtime canon file before first assignment/recovery persistence. |
| `CONCEPTS_ALREADY_EXIST` | Concept Generator duplicate guard, including the pre-canon mutation guard that prevents first assignment when Concepts already exist. |
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
| `STORY_NOT_READY_FOR_PRODUCTION_PACKAGE` | Story lifecycle state is not eligible for the requested Production Package action. |
| `PRODUCTION_PACKAGE_INPUT_INVALID` | Script, Continuity Review, identifiers, approvals, or another required M7 input fails deterministic validation. |
| `PRODUCTION_PACKAGE_ALREADY_EXISTS` | Normal M7 execution finds an existing package and is not authorised to regenerate. |
| `PRODUCTION_PACKAGE_REGENERATION_INVALID` | Controlled regeneration or upstream-revision request fails package-history, mode, version, or supersession rules. |
| `PRODUCTION_PACKAGE_GENERATION_FAILED` | M7 AI generation fails technically after the allowed attempts. |
| `PRODUCTION_PACKAGE_AI_OUTPUT_INVALID` | Generated M7 output fails structured or deterministic package validation, including exact Script coverage. |
| `PRODUCTION_PACKAGE_SCENE_SAVE_FAILED` | One or more immutable Production Package scene rows cannot be safely persisted. |
| `PRODUCTION_PACKAGE_SCENE_VERIFY_FAILED` | Persisted Production Package scene rows do not form the exact complete expected scene set. |
| `PRODUCTION_PACKAGE_SAVE_FAILED` | The immutable Production Package header cannot be safely persisted. |
| `PRODUCTION_PACKAGE_VERIFY_FAILED` | Persisted Production Package header or package-level provenance fails verification. |
| `PRODUCTION_PACKAGE_REPAIR_REQUIRED` | Partial or conflicting M7 persistence cannot be safely completed by the deterministic repair path. |
| `STORY_PRODUCTION_PACKAGE_STATUS_UPDATE_FAILED` | Package persistence is complete but the Story cannot be updated to `PRODUCTION_PACKAGE_GENERATED`. |

## Governance

- Preserve the most specific existing code at the local failure source.
- Add a code here when a new operational failure condition is implemented.
- Do not add operational codes to `STORY_STATUS_MODEL.md`.
- Do not use `FailureLog.status` values as error codes.
- M7 package identifiers may remain in the handled raw payload; the protected 18-column FailureLog schema is not expanded for M7.
