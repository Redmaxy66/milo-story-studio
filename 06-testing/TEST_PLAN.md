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
- explicit Code-node and global-read execution modes, including both persistence readbacks
- node-reference dominance and branch-specific execution guards
- exact Switch rule operands/order/output cardinality, terminal no-op and fallback connectivity
- complete persisted-scene and 25-field header readback equivalence
- malformed history, conflicting orphan, generation-mode and recovery-payload rejection
- deterministic simulation of all ten governed INITIAL/repeat/repair/failure/persistence states
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

## M8 Phase 2 — Repository contract validation

Run the aggregate suite:

```bash
node 06-testing/validate_m8_phase2.mjs
```

Run individual suites when changing their covered artifacts:

```bash
node 06-testing/validate_m8_contracts.mjs
node 06-testing/validate_m8_lifecycle.mjs
node 06-testing/validate_m8_hashing.mjs
node 06-testing/validate_m8_openart_adapter.mjs
node 06-testing/validate_m8_story_vault_schema.mjs
node 06-testing/validate_m8_workflow_skeletons.mjs
```

The gate covers all 12 provider-neutral contracts, lifecycle transitions, controlled values, M8 error-code registration, canonical JSON, deterministic hashing/idempotency, OpenArt normalization and fixture sanitation, the proposed Story Vault schema, `StudioControl` derivation boundaries, continued shared `FailureLog` routing, and inert workflow skeletons.

Phase 2 also requires the complete applicable M3–M7 regression commands listed in `M8_PHASE2_TEST_CASES.md`. No M8 change may weaken a prior milestone assertion. In particular, M8 lifecycle states are not additions made under M7 authority.

All Phase 2 tests are offline. They must not access n8n, Story Vault, Google Sheets, Google Drive, OpenArt, credentials, canon services, media services, or publishing platforms; spend credits; generate media; execute/import/activate workflows; assemble an episode; or publish anything.

## M8 Phase 3 — Reference and production intent validation

Run:

```bash
node --check 05-code/m8/phase3-validation.mjs
node 06-testing/validate_m8_phase3.mjs
```

The Phase 3 gate verifies the byte-identical approved M7 snapshot, exact lineage and source coverage, visual-reference governance, all three specialist boundaries, stable scene/shot/panel/prompt IDs, storyboard and animation timing, dialogue preservation, source hashes, provider neutrality, pending-only repository approval templates, the closed visual-generation gate, and absence of media or live-system claims. Run the complete Phase 2 and M3–M7 suites in `M8_PHASE3_TEST_CASES.md` before commit.

Phase 3 is offline and text/specification-only. It grants no provider, generation, live approval, workflow, assembly, publication, Phase 4 or A3 authority.
