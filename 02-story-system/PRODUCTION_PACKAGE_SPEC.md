# Milo Production Package Specification

**Version:** 1.0
**Milestone:** M7 — Production Package
**Status:** Approved design; repository implementation
**Initial orchestration:** n8n
**Initial data store:** Google Sheets

## 1. Purpose

M7 converts one eligible, continuity-approved Script into an immutable, append-versioned Production Package. The package is a production blueprint: it preserves the approved story text while adding scene decomposition, visual-production guidance, voice-performance guidance, animation/motion guidance, generic production metadata, planned asset requirements, upstream provenance, generation provenance, and immutable canon lineage.

M7 does not render external media, generate platform-specific publishing packages, publish content, or mutate realised-asset provenance into an immutable Production Package.

## 2. Eligibility

Normal initial generation requires:

- `storyId` matches `^MILO-[0-9]{3}$`
- Story `status = CONTINUITY_APPROVED`
- Story `canonVersion` matches `^canon-v[0-9]+\.[0-9]+$`
- Story `canonRef` is a full 40-character Git commit SHA
- Story is not PRE-CANON LEGACY
- exactly one applicable Script exists
- `scriptId = ${storyId}-S01`
- Script belongs to the same Story, Outline and Concept lineage
- Script `approvalStatus = APPROVED`
- Script `approvalProcessedAt` is populated
- Script text is non-empty
- Script `version >= 1`
- Script canon lineage exactly matches Story canon lineage
- exactly one applicable processed Continuity Review exists for the Script version
- Review belongs to the same Story and Script
- Review `reviewStatus = APPROVED`
- Review `reviewProcessedAt` is populated
- Review `assessmentResult` is `PASS` or human-approved `REVIEW_REQUIRED`
- Review `assessmentResult` is never `FAIL`
- Review canon lineage exactly matches Story canon lineage
- no existing Production Package exists for the same Script/Review version unless the controlled-regeneration path is explicitly requested

Invalid eligibility must fail before AI generation.

## 3. Package identity

Package IDs are version-specific:

`MILO-###-S01-P##`

Regex:

`^MILO-[0-9]{3}-S01-P[0-9]{2}$`

Rules:

- package version begins at 1
- `P01` corresponds to `packageVersion = 1`
- package numbers are sequential and contiguous
- a new package never overwrites an earlier package
- version gaps or duplicate package IDs are integrity failures
- M7 v1 supports package versions 1–99; reaching 99 is a stop condition requiring a later design decision

Scene IDs are:

`<packageId>-SC##`

Planned asset IDs are:

`<packageId>-A###`

Asset IDs are deterministic within a package and are never recycled.

## 4. Generation provenance

Every package persists:

- `generationMode`
- `supersedesPackageId`
- `packageFormatVersion`
- `promptVersion`
- `promptPath`
- `promptRef`
- `generatorProvider`
- `generatorModel`

Allowed `generationMode` values:

- `INITIAL`
- `UPSTREAM_REVISION`
- `CONTROLLED_REGENERATION`

`INITIAL` requires no prior package for the Story/Script/Review lineage and blank `supersedesPackageId`.

`UPSTREAM_REVISION` requires an approved newer upstream Script version and a valid immediately preceding package.

`CONTROLLED_REGENERATION` requires an explicit controlled request while retaining the same upstream Script and Review provenance. Merely finding an existing package never authorises regeneration.

`supersedesPackageId` is blank only for the first package. Every later package must identify the immediately preceding package.

`packageFormatVersion` is `1.0` for this contract. It is separate from `packageVersion`.

Prompt provenance for v1:

- `promptVersion = m7-production-package-v1.0`
- `promptPath = 03-prompts/m7-production-package-generator.md`
- `promptRef` = immutable full commit SHA containing the approved prompt used at runtime

Prompt provenance is generation provenance and does not replace `canonVersion` or `canonRef`.

The configured generator provider/model are persisted exactly from workflow configuration. The repository v1 implementation uses `OpenAI` and `gpt-5-mini`; a model change requires deliberate validation and documentation.

## 5. Persistent Story Vault contract

M7 adds two tabs during separately authorised Phase 4 live configuration.

### 5.1 `Production Packages`

Exact column order:

1. `storyId`
2. `packageId`
3. `packageVersion`
4. `generationMode`
5. `supersedesPackageId`
6. `packageFormatVersion`
7. `conceptId`
8. `outlineId`
9. `scriptId`
10. `scriptVersion`
11. `reviewId`
12. `reviewVersion`
13. `title`
14. `sceneCount`
15. `productionMetadataJson`
16. `assetManifestJson`
17. `promptVersion`
18. `promptPath`
19. `promptRef`
20. `generatorProvider`
21. `generatorModel`
22. `canonVersion`
23. `canonRef`
24. `createdAt`
25. `updatedAt`

One row represents one immutable package version.

### 5.2 `Production Package Scenes`

Exact column order:

1. `packageId`
2. `packageVersion`
3. `sceneId`
4. `sceneNumber`
5. `storyId`
6. `scriptId`
7. `sourceText`
8. `sceneDescription`
9. `setting`
10. `charactersJson`
11. `visualGuidanceJson`
12. `voiceGuidanceJson`
13. `motionGuidanceJson`
14. `assetRequirementsJson`
15. `productionNotesJson`
16. `canonVersion`
17. `canonRef`
18. `createdAt`

One row represents one immutable scene within one package version.

The package header is the durable completion marker for package persistence: it must not be appended until the complete scene set has been persisted and verified.

## 6. Scene contract

The AI returns ordered scene objects. Deterministic code assigns IDs and validates them.

Each final scene contains:

- `sceneId`
- `sceneNumber`
- `sourceText`
- `sceneDescription`
- `setting`
- `characters`
- `visualGuidance`
- `voiceGuidance`
- `motionGuidance`
- `assetRequirements`
- `productionNotes`

Rules:

- at least one scene
- scene numbers start at 1 and are contiguous
- scene IDs exactly match `<packageId>-SC##`
- `sourceText` is non-empty
- concatenated scene `sourceText`, after controlled whitespace normalization, must equal the complete approved Script after the same normalization
- AI may choose scene boundaries but may not rewrite, omit or add approved Script text
- scene guidance may not establish unsupported canon

## 7. Visual guidance

Each scene contains:

- `visualPrompt`
- `charactersPresent`
- `environment`
- `moodLighting`
- `mustInclude`
- `mustAvoid`
- `continuityRequirements`
- `canonReferences`
- `openCanonConstraints`

The guidance must preserve approved Milo appearance and environment constraints. Open visual decisions remain open; the package must not silently establish permanent visual style, body proportions, exact height, exact colour hex values, backpack geometry, or other unresolved canon.

## 8. Voice guidance

Each scene contains:

- `overallTone`
- `pacingNote`
- `emotion`
- `emphasisNotes`
- `pauseGuidance`
- `dialogueCues`

A dialogue cue contains:

- `speaker`
- `text`
- `deliveryNote`

Milo guidance must remain compatible with the approved Voice Guide. Numeric words-per-minute or pause durations are not canon and are not required in v1.

## 9. Motion guidance

Each scene contains:

- `motionPrompt`
- `characterActions`
- `environmentMotion`
- `cameraGuidance`
- `transitionGuidance`
- `timingNote`
- `continuityConstraints`

Motion guidance may describe production treatment but must not add story events or alter approved character/story facts.

## 10. Planned asset manifest

M7 stores planned assets only.

Each planned asset contains:

- `assetId`
- `sceneId`
- `assetType`
- `role`
- `status`
- `requirements`

Allowed `assetType` values:

- `VISUAL`
- `VOICE`
- `ANIMATION`

M7 v1 status is always:

`PLANNED`

The M7 package does not store realised fields such as `externalUrl`, `provider`, `externalAssetId`, selected-render state, or rendered-asset provenance.

A later M8-or-beyond realised-asset store must reference both `packageId` and `assetId`. It may support multiple realisations for one planned asset without changing the M7 package.

## 11. Production metadata

`productionMetadataJson` contains:

- `packageFormatVersion`
- `contentType = STORY_PRODUCTION_PACKAGE`
- `targetAgeRange`
- `sourceWordCount`
- `sourceEstimatedLengthMinutes`
- `theme`
- `lesson`
- `sceneCount`
- `continuityAssessmentResult`
- `productionNotes`

Platform-specific publishing metadata is prohibited from the M7 package.

## 12. Deterministic versus AI responsibility

### Deterministic/n8n responsibility

- global Story, Script, Continuity Review, Production Package, and scene-table reads execute once per workflow run so upstream item counts cannot multiply authoritative candidate rows
- Story selection and state eligibility
- PRE-CANON LEGACY exclusion
- identifier validation
- cross-artifact relationship validation
- Script approval validation
- Continuity Review approval validation
- canon-lineage validation
- immutable GitHub references
- duplicate detection
- generation-mode validation
- package version calculation
- `supersedesPackageId`
- package/scene/asset ID assignment
- structured-output validation
- exact Script coverage validation
- controlled values
- timestamps
- persistence order and verification
- lifecycle update
- retry policy
- repair/recovery routing
- failure routing

### AI responsibility

- scene-boundary proposal
- scene descriptions
- visual production wording
- qualitative voice-performance guidance
- motion/animation suggestions
- generic production notes
- planned asset requirements

AI must not decide eligibility, canon lineage, package identity/version, lifecycle state, approval state, duplicate overwrite, or whether regeneration is authorised.

## 13. Canon lineage

The Story row remains authoritative.

Before any runtime canon retrieval:

- validate Story `canonVersion` and `canonRef`
- reject blank/malformed lineage with `CANON_LINEAGE_INVALID`
- reject Script/Story or Review/Story mismatch with `CANON_LINEAGE_MISMATCH`

Every runtime canon/voice/visual/rules GitHub read uses the same Story `canonRef`, never HEAD.

Every package header and scene row persists the Story `canonVersion` and `canonRef` unchanged.

## 14. Duplicate and regeneration rules

A subsequent `INITIAL` invocation for a Story already at `PRODUCTION_PACKAGE_GENERATED` resolves to `NOOP_COMPLETE` only when the matching package header is the coherent latest version and its complete, unique, ordered scene set matches the Story, Script, Review, package version, and authoritative canon lineage. `NOOP_COMPLETE` is an expected terminal no-op: it does not invoke AI, append scenes or a header, update the Story, or call Failure Handler.

Missing, duplicate, partial, malformed, lineage-mismatched, or conflicting completed-package state is not a no-op. It continues through deterministic governed failure/recovery semantics. A normal existing-package condition that is not the coherent completed-repeat case remains protected by `PRODUCTION_PACKAGE_ALREADY_EXISTS` or the more specific regeneration/integrity failure.

A controlled regeneration requires:

- explicit `CONTROLLED_REGENERATION`
- current upstream eligibility
- coherent package history
- exactly one highest package version
- no version gap
- `supersedesPackageId` = immediately preceding package
- same upstream Script and Review provenance as the package being regenerated

An upstream revision requires:

- explicit `UPSTREAM_REVISION`
- a newer approved Script version and applicable approved Review
- coherent prior package history
- `supersedesPackageId` = immediately preceding package

No normal duplicate execution may be reclassified as regeneration. A coherent completed repeat is classified only as `NOOP_COMPLETE`.

## 15. Persistence and verification order

Required order:

1. generate and validate the complete package in memory
2. persist immutable scene rows
3. verify the exact complete scene set
4. persist the immutable package header
5. verify the package header and complete scene set
6. update Story status to `PRODUCTION_PACKAGE_GENERATED`

Google Sheets append nodes must never enable automatic retry.

## 16. Repair/recovery

### Scene rows exist, header absent

- do not call AI automatically
- re-read the expected package scene rows
- require the complete expected deterministic scene set
- validate all scene IDs, numbers, provenance and Script coverage
- if complete and coherent, append the missing package header
- otherwise stop with a controlled repair failure; do not generate a second creative package

### Header and scenes exist, Story not advanced

- validate complete package
- do not regenerate
- update Story only

### Partial or conflicting scene set

- inspect persisted rows
- do not blindly retry appends
- do not append a second package
- stop with a controlled repair/integrity failure unless the exact missing rows can be deterministically restored from the already-validated in-execution payload

A later execution must never reconstruct creative scene payload from memory or a fresh AI response and present it as the original package.

## 17. Retry policy

Maximum AI generation attempts per workflow execution: 2.

Retry only:

- technical AI-call failure
- malformed structured output
- missing required generated fields

Immutable GitHub reads may use safe retry.

Do not automatically retry:

- deterministic validation
- human/eligibility failures
- duplicate failures
- Google Sheets appends

## 18. Operational error codes

Reuse:

- `CANON_LINEAGE_INVALID`
- `CANON_LINEAGE_MISMATCH`

Add:

- `STORY_NOT_READY_FOR_PRODUCTION_PACKAGE`
- `PRODUCTION_PACKAGE_INPUT_INVALID`
- `PRODUCTION_PACKAGE_ALREADY_EXISTS`
- `PRODUCTION_PACKAGE_REGENERATION_INVALID`
- `PRODUCTION_PACKAGE_GENERATION_FAILED`
- `PRODUCTION_PACKAGE_AI_OUTPUT_INVALID`
- `PRODUCTION_PACKAGE_SCENE_SAVE_FAILED`
- `PRODUCTION_PACKAGE_SCENE_VERIFY_FAILED`
- `PRODUCTION_PACKAGE_SAVE_FAILED`
- `PRODUCTION_PACKAGE_VERIFY_FAILED`
- `PRODUCTION_PACKAGE_REPAIR_REQUIRED`
- `STORY_PRODUCTION_PACKAGE_STATUS_UPDATE_FAILED`

Operational codes are not Story lifecycle values.

## 19. Failure handling

Every handled failure produces the existing structured local failure envelope and terminates at `Call Failure Handler`.

Include where available:

- `success = false`
- `errorCode`
- `message`
- `workflow`
- `storyId`
- `conceptId`
- `outlineId`
- `scriptId`
- `reviewId`
- `packageId`
- `attempt`
- `failedAt`
- shared caller metadata

`packageId` is retained in `rawError`; the protected 18-column FailureLog schema is unchanged.

Unhandled failures use the shared Error Workflow.

Failure Handler never mutates Story or artifact lifecycle state.

## 20. Story lifecycle

M7 adds exactly one Story lifecycle state:

`PRODUCTION_PACKAGE_GENERATED`

Transition:

`CONTINUITY_APPROVED -> PRODUCTION_PACKAGE_GENERATED`

The transition occurs only after package scenes and package header are persisted and verified.

M7 has no Production Package approval workflow.

A failure leaves the Story at its prior valid state.

## 21. M7/M8 boundary

M7 owns structured production preparation and planned assets.

M7 does not own:

- realised media production
- realised asset provenance storage
- YouTube/Instagram packaging
- platform metadata
- publishing approval
- publishing
- complete-studio hardening

M8 or later may consume a verified package and separately persist realised asset provenance keyed by `packageId` / `assetId`.

## 22. Completion evidence for repository phases

Phase 2 repository implementation requires:

- this specification
- structured-output schema
- approved prompt material
- one production-package workflow export
- lifecycle/error-code definitions
- deterministic validation tooling/tests
- D-013 if implementation does not materially depart from the approved architecture

Phase 3 passes only when offline tests prove the contracts required by the current `WORK_ORDER.md`. Live configuration and testing remain Phase 4+ and require A3.
