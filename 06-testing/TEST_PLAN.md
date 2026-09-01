# Test Plan

Every workflow should be tested for:

- correct input
- missing required input
- malformed input
- duplicate input
- external service failure
- invalid AI output
- safe human review where the stage contains a human-review gate
- idempotent repair after a partial prior write
- correct final status
- immutable runtime canon retrieval from the Story's stored `canonRef`
- deterministic blank/malformed canon-lineage rejection before GitHub retrieval
- deterministic downstream/Story canon-lineage mismatch rejection
- required downstream canonVersion/canonRef persistence
- deterministic Outline Generator selection across all `CONCEPT_APPROVED` candidates, excluding PRE-CANON LEGACY rows before one governed Story is taken
- deterministic Script Generator selection across processed approved Outlines after authoritative Story resolution, excluding historical, ineligible, and PRE-CANON LEGACY candidates
- deterministic Continuity Reviewer selection across processed approved Scripts after authoritative Story resolution, excluding historical, lifecycle-ineligible, and PRE-CANON LEGACY candidates
- explicit per-item Continuity Script validation so every approved Script candidate reaches eligible-selection classification
- Continuity Reviewer duplicate protection and both runtime canon reads bound to the selected Story/Script pair and the Story's immutable `canonRef`
- literal handled-failure `storyId` values that cannot be interpreted as spreadsheet formulas

## M7 — Production Package non-production validation

Run:

```bash
node 06-testing/validate_production_package.mjs
```

The M7 offline suite must verify at minimum:

- workflow identity, inactive/unpublished repository state, and pin hygiene
- graph integrity and shared Failure Handler / Error Workflow routing
- approved `Production Packages` and `Production Package Scenes` storage targets
- Google Sheets append retry prohibition
- immutable M7 prompt provenance
- runtime canon/visual/voice/rules reads from Story `canonRef`
- generator provider/model provenance and maximum AI-attempt policy
- structured-output and prompt boundary
- happy-path eligibility structure
- invalid state/input rejection
- PRE-CANON LEGACY / blank-lineage exclusion
- downstream/Story canon-lineage mismatch rejection
- exact approved Script coverage across scenes
- deterministic package, scene, and planned-asset IDs
- contiguous package versions and supersession
- coherent completed-package INITIAL repeat as a terminal zero-write `NOOP_COMPLETE`, with malformed/partial/conflicting completed state still rejected
- controlled regeneration and upstream-revision provenance
- `packageFormatVersion` validation
- status-repair and header-repair paths
- save/verify ordering before Story lifecycle mutation
- lifecycle isolation on failure
- M7 operational error-code registration
- `PRODUCTION_PACKAGE_GENERATED` lifecycle definition
- D-013 architecture recording
- no temporary/test configuration in the production export
- absence of the rejected single-cell `scenesJson` design
- planned-asset / realised-provenance separation
- realistic Google Sheets child-row JSON payload sizing below the 50,000-character design boundary per cell

Phase 3 is repository/offline validation only. It does not create Story Vault tabs, import the workflow into n8n, bind live schemas, or execute any production data path.
