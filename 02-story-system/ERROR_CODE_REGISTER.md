# Operational Error Code Register

- **Scope:** Implemented M3-M6.5 workflow exports, M7 implementation, and M8 Phase 2 repository definitions
- **Separation rule:** These are operational failure codes, not Story lifecycle states.

## Audit baseline

At commit `e74ef9b`, the nine exported workflows contained 35 unique explicit error codes across 40 Set/Code definitions or emissions. The previously cited count of 55 is not reproducible from the repository exports. Thirty-four of the 35 local `Prepare ... Failure` nodes emitted `errorCode`; Story Intake emitted only `success` and `message`.

M6.5 adds `STORY_SUBMISSION_VALIDATION_FAILED` to that Story Intake payload and two defensive handler fallbacks: `HANDLED_FAILURE` and `UNHANDLED_WORKFLOW_ERROR`. No baseline code was removed or renamed.

M7 repository implementation adds Production Package-specific codes without renaming or removing earlier codes. M7 live behaviour remains unproven until separately authorised Phase 4+ configuration and testing.

M8 Phase 2 defines future repository error contracts but does not implement or emit them from a live workflow. Future M8 failures remain assigned to the existing shared Failure Handler and existing 18-column `FailureLog`. Phase 2 creates no `M8Errors` tab or separate error store and does not change the `FailureLog` schema.

D-014 repository remediation adds canon-initialisation-specific failures to the Concept Generator while retaining `CANON_LINEAGE_INVALID` for the D-012 blank-marker + blank-lineage PRE-CANON LEGACY rejection.

The D-014 eligible-selection remediation introduces no new operational error code. An all-PRE-CANON LEGACY `IDEA` candidate set is a controlled zero-item no-op, not a failure. A malformed/conflicting candidate remains governed by `CANON_INITIALIZATION_INTEGRITY_FAILED`; PRE-CANON LEGACY rows are excluded before candidate selection and are not logged or modified.

The Outline eligible-selection remediation introduces no new operational error code. An all-PRE-CANON LEGACY `CONCEPT_APPROVED` candidate set is a controlled zero-item no-op. A malformed, partial, or marker-conflicting governed candidate routes through the existing `CANON_LINEAGE_INVALID` handling before approved-Concept lookup, duplicate protection, canon retrieval, AI generation, or persistence. PRE-CANON LEGACY rows are excluded and never modified.

The Script eligible-Outline remediation introduces no new operational error code. Historical, ineligible, and PRE-CANON LEGACY-only candidate sets produce a controlled zero-item no-op. Missing or duplicate Story resolution uses `APPROVED_OUTLINE_VALIDATION_FAILED`; malformed or conflicting governed lineage uses `CANON_LINEAGE_INVALID` or `CANON_LINEAGE_MISMATCH`. The handled `STORY_NOT_READY_FOR_SCRIPT_GENERATION` payload now emits a literal `storyId` value rather than a misspelled spreadsheet-formula field.

The Continuity eligible-Script remediation introduces no new operational error code. Historical, lifecycle-ineligible, and PRE-CANON LEGACY-only candidate sets produce a controlled zero-item no-op. Missing or duplicate authoritative Story resolution uses `APPROVED_SCRIPT_INVALID`; malformed or conflicting governed lineage uses `CANON_LINEAGE_INVALID` or `CANON_LINEAGE_MISMATCH`. These checks occur before duplicate Review lookup, canon retrieval, AI review, or persistence.

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

## M8 Phase 2 repository definitions

These definitions are not counted as implemented workflow emissions until a later authorised workflow phase. `Retry` means policy eligibility after reconciliation and a new record; it never means blind repeat of an append or ambiguous provider submission.

| Class | Code | Meaning | Detection point | Retry | Record impact | Required evidence | Operator response |
|---|---|---|---|---|---|---|---|
| Core | `M8_CONTRACT_INVALID` | An M8 record fails its strict contract. | Contract validator | No | No dependent mutation | Validation paths/messages | Correct input or create a new record version. |
| Core | `M8_CONTROLLED_VALUE_INVALID` | A value or lifecycle transition is outside the controlled register. | Enum/transition validator | No | No state change | Value, source/target state | Correct through an authorised record/version. |
| Core | `M8_LINEAGE_INVALID` | Required Story/package/asset lineage is missing or malformed. | Pre-mutation lineage check | No | No provider/build action | Record IDs and lineage fields | Repair provenance under separate authority. |
| Core | `M8_LINEAGE_MISMATCH` | Related records do not share exact governed lineage. | Cross-contract validator | No | No dependent mutation | Compared record IDs/fields | Reconcile the conflicting record set. |
| Core | `M8_IDEMPOTENCY_KEY_INVALID` | The stored key differs from deterministic request material. | Request validation | No | Request blocked | Canonical material and recomputed key | Create a corrected request revision. |
| Core | `M8_DUPLICATE_SUBMISSION_RISK` | A matching non-terminal or ambiguous attempt may already exist. | Pre-submission guard | Only after reconciliation | No new attempt submitted | Key, attempts, costs, provider evidence | Reconcile before authorising a new attempt. |
| Core | `M8_APPROVAL_REQUIRED` | An exact required human approval is absent or does not bind the current hash/version. | Approval gate | No | Requested action blocked | Target hash/version and approvals | Obtain a new explicit approval record. |
| Core | `M8_STAGE_BUDGET_NOT_APPROVED` | The applicable stage cap is absent. | Budget gate | No | Submission/build blocked | Stage and current approval record | Approve the stage cap at its separate gate. |
| Core | `M8_CROSS_STAGE_BUDGET_TRANSFER_PROHIBITED` | Allowance from another stage is being applied. | Budget gate | No | Submission blocked | Source/target stage and totals | Use only the separately approved target-stage cap. |
| Core | `M8_COST_CAP_EXCEEDED` | Estimated or actual cost exceeds an applicable approved cap. | Estimate/reconciliation gate | No automatic retry | Further spend blocked | Estimate, actuals, cap, ledger | Reduce scope or obtain separate budget approval. |
| Core | `M8_RIGHTS_PROVENANCE_INVALID` | Rights, licence, consent, or provenance is missing/invalid. | Reference/asset/package validation | No | Approval/use blocked | Rights source and restrictions | Resolve rights and append corrected evidence. |
| Core | `M8_DURABLE_COPY_REQUIRED` | A selected provider result lacks a verified durable copy. | Asset readiness check | Retrieval may be retried if safe | Assembly eligibility blocked | Provider result and durable-copy fields | Retrieve under later authority and verify bytes. |
| Core | `M8_DURABLE_CHECKSUM_MISMATCH` | Recomputed bytes differ from the approved SHA-256. | Retrieval or immediate pre-assembly check | No | Asset quarantined; assembly blocked | Expected/actual SHA-256 and file locator | Preserve evidence and reconcile; never overwrite. |
| Core | `M8_DURABLE_FILE_NOT_WRITE_RESTRICTED` | Approved bytes remain modifiable by an unauthorised identity. | Approval/assembly readiness check | No | Approval/use blocked | File ACL/readback evidence | Apply approved write restriction under A3. |
| Core | `M8_IN_PLACE_REPLACEMENT_PROHIBITED` | New bytes are proposed for an approved durable file ID. | Storage/lineage validation | No | Write blocked | Existing/new hashes and file ID | Create a new file and new asset record. |
| Core | `M8_ASSET_NOT_APPROVED` | An asset lacks an exact-checksum approval. | Assembly/package input check | No | Input rejected | Asset/checksum/approval records | Obtain approval or select an approved asset. |
| Core | `M8_REVISION_SCOPE_INVALID` | A revision exceeds its bounded approved changes or omits invariants. | Revision validator | No | New request blocked | Parent checksum and revision scope | Submit a corrected revision for approval. |
| Core | `M8_ASSEMBLY_INPUT_INVALID` | An assembly input fails lineage, approval, rights, hash, or readiness checks. | Assembly preflight | No | Build blocked | Input manifest and failed rule | Correct the input selection or evidence. |
| Core | `M8_ASSEMBLY_BUILD_FAILED` | The deterministic worker reports a classified build failure. | Build reconciliation | New version only | Assembly version terminal failed/QA state | Tool version, manifest, logs, hashes | Diagnose and create a new build version. |
| Core | `M8_ASSEMBLY_NONDETERMINISTIC` | Rebuild differences exceed the approved normalisation rule. | Rebuild validation | No automatic retry | Assembly approval blocked | Both builds and comparison evidence | Reconcile tool/input/config variance. |
| Core | `M8_PUBLISHING_PACKAGE_INVALID` | A package/profile/metadata/hash requirement fails. | Package validator | New version only | Approval blocked | Profile version and validation output | Correct through a new package version. |
| Core | `M8_AUDIENCE_SAFETY_DECISION_REQUIRED` | Human audience or safety decision is missing. | Publishing approval gate | No | Approval blocked | Package and decision fields | Obtain the named human decision. |
| Core | `M8_MANUAL_RECOVERY_REQUIRED` | Safe deterministic recovery cannot continue automatically. | Reconciler/validator | No | Record held for operator review | Full correlation, lineage, cost, provider evidence | Record operator reason and perform separately authorised recovery. |
| OpenArt | `OPENART_AUTHENTICATION_FAILED` | Provider authentication is rejected. | Future adapter boundary | After credential review only | Attempt not submitted or held | Redacted error and execution context | Stop; verify managed credential under A3. |
| OpenArt | `OPENART_CAPABILITY_UNAVAILABLE` | Required discovered capability/schema is unavailable. | Future discovery/validation | No | Request blocked | Discovery response reference | Select an approved supported route or stop. |
| OpenArt | `OPENART_REQUEST_INVALID` | Adapter projection is rejected before/at submission. | Adapter/provider validation | Corrected request only | Attempt failed before safe completion | Payload hash and redacted response | Correct request via new revision/attempt. |
| OpenArt | `OPENART_COST_ESTIMATE_FAILED` | Exact current estimate cannot be obtained. | Estimate gate | Safe read may retry | No submission | Estimate request/result evidence | Stop spend until an estimate exists. |
| OpenArt | `OPENART_COST_CAP_EXCEEDED` | Provider estimate exceeds the approved request/stage cap. | Estimate gate | No | No submission | Estimate, cap, stage | Reduce scope or obtain new approval. |
| OpenArt | `OPENART_SUBMISSION_FAILED` | Submission failed with no provider ID and no observed charge. | Submit boundary | Only after evidence proves no charge/job | Attempt failed/held | Redacted response, history/cost check | Reconcile before a new attempt. |
| OpenArt | `OPENART_STATUS_POLL_FAILED` | A read-only status poll fails. | Poller | Safe bounded poll retry | Attempt remains non-terminal | Poll number/time/error | Retry within policy or enter reconciliation. |
| OpenArt | `OPENART_GENERATION_FAILED` | Provider reports terminal failure. | Status normaliser | New approved attempt only | Attempt terminal failed | Raw/normalised status and cost | Reconcile cost; decide on new attempt. |
| OpenArt | `OPENART_GENERATION_TIMED_OUT` | Local timeout occurs before reconciled terminal state. | Poll timeout | No resubmit | Attempt timed out then reconciliation required | Poll history and timeout | Reconcile provider history/cost. |
| OpenArt | `OPENART_COMPLETED_WITHOUT_ASSET` | Provider reports success but no usable resource exists. | Output reconciliation | No resubmit | Reconciliation required | Status, output list, cost | Inspect history/resource evidence. |
| OpenArt | `OPENART_PARTIAL_RESULT` | Fewer usable outputs exist than promised. | Output reconciliation | No blind retry | Actual assets recorded; attempt partial | Expected/observed counts and IDs | Preserve outputs and decide bounded recovery. |
| OpenArt | `OPENART_RESOURCE_RETRIEVAL_FAILED` | Resource metadata or bytes cannot be retrieved. | Retrieval boundary | Safe read may retry | Asset remains provider-only/retrieval-failed | History/resource IDs and redacted failure | Retry retrieval within policy; do not regenerate. |
| OpenArt | `OPENART_COST_RECONCILIATION_FAILED` | Estimate, returned charge, and balance evidence cannot be reconciled. | Cost reconciler | No new spend | Attempt held; further spend blocked | Complete cost ledger/evidence | Manually reconcile before continuing. |
| OpenArt | `OPENART_MODE_METADATA_MISMATCH` | Provider raw display mode differs from requested/submitted/observed semantics. | Adapter normaliser | No | Attempt held or completed with note | All four mode fields | Preserve raw label and reconcile capability mapping. |

## Governance

- Preserve the most specific existing code at the local failure source.
- Add a code here when a new operational failure condition is implemented.
- Do not add operational codes to `STORY_STATUS_MODEL.md`.
- Do not use `FailureLog.status` values as error codes.
- M7 package identifiers may remain in the handled raw payload; the protected 18-column FailureLog schema is not expanded for M7.
- Future M8 identifiers remain in redacted `rawError` until a separately approved FailureLog schema change; Phase 2 does not change the protected 18 columns.
- M8 defines no `M8Errors` store. `StudioControl` may later derive failure counts but never stores failure events.
