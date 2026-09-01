# M7 Phase 2–3 Validation Evidence

**Date:** 2026-09-01  
**Authority:** A2 — Controlled Execute  
**Scope:** Repository implementation and non-production validation only  
**Live n8n mutation/execution:** None  
**Live Google Sheets mutation:** None

## Result

M7 repository implementation passed the non-production validation gate required before Phase 4.

The executable offline M7 validation harness completed after the consolidated preflight remediation:

`63 / 63 PASS`

The final committed workflow hardening deltas were then re-inspected directly from the repository after remediation.

### Reconciliation note — 2026-09-01

A later full-suite rerun exposed a brittle M7-008 harness assertion: the approved prompt prohibits human-readable “package IDs” and “package versions”, while the test incorrectly required the camelCase implementation tokens `packageId` and `packageVersion`. The approved prompt, schema, workflow, and immutable `promptRef` were unchanged. The harness now proves the boundary directly by requiring that the schema expose only `scenes` and `productionNotes` and that the prompt explicitly prohibit package IDs/versions, canon lineage, and publishing schedules. The reconciled suite remains `27 / 27 PASS`.

Controlled live execution `#406` later exposed two narrow runtime defects before AI generation or persistence: chained global Google Sheets reads multiplied downstream candidate rows because they were not configured to execute once, and the Code-node handled-failure envelope used expression-only `$exec.id`. The repository export now marks all five global table reads `executeOnce=true` and uses `$execution.id` inside `Prepare M7 Failure`. M7-003 and M7-004 include executable regression proof for both corrections. At that remediation point, the approved prompt, schema, identifiers, persistence ordering, lifecycle model, Error Workflow, shared Failure Handler, and immutable prompt/canon references were unchanged.

### Structured-output remediation note — execution `#407`

The next single controlled INITIAL execution proved exact normalized Script coverage (`2761 / 2761`) but correctly routed to `PRODUCTION_PACKAGE_AI_OUTPUT_INVALID` before persistence. The n8n `Production Package Output Parser` embedded only the top-level shape and did not enforce the authoritative nested schema. It therefore allowed string values for required guidance arrays and incomplete dialogue-cue objects to reach `Build And Validate Complete Package`, where deterministic validation rejected them. No package header, scene row, or Story lifecycle write occurred.

The runtime parser now embeds the complete authoritative `PRODUCTION_PACKAGE_AI_OUTPUT_SCHEMA.json` contract without weakening it. The prompt explicitly requires the affected fields to remain JSON arrays, requires every dialogue cue to contain `speaker`, `text`, and `deliveryNote`, and requires cue `text` to be an exact same-scene `sourceText` substring with punctuation and casing preserved. The immutable prompt reference is updated to `7947021016f14c84c71421aeb225b80cad990c9d`. M7-028 through M7-038 prove parser/schema identity, rejected invalid shapes, accepted valid shapes, semantic cue validation, complete ordered coverage, zero-write failure routing, valid-path continuity, and unchanged manifest/provenance behaviour.

### Completed-package repeat no-op remediation note — execution `#412`

The Phase 5 repeat check proved the persistence safety controls—no model call, scene append, header append, duplicate package, Story rewrite, or M8 action—but exposed an action-resolution semantics defect. INITIAL candidate selection considered only `CONTINUITY_APPROVED`, so the correctly completed `PRODUCTION_PACKAGE_GENERATED` Story was excluded before its coherent existing package could be evaluated. The execution therefore emitted `STORY_NOT_READY_FOR_PRODUCTION_PACKAGE` and created handled FailureLog event `FL-H-73bba6b595e99701` instead of terminating as an expected no-op.

The repository workflow now selects a completed Story only when no clean `CONTINUITY_APPROVED` INITIAL candidate is available, validates the matching latest header and complete unique ordered scene set against Story/Script/Review/package/canon lineage, and emits explicit `NOOP_COMPLETE`. `Route M7 Action` has a dedicated unconnected `NOOP_COMPLETE` output, so the action cannot reach generation, either append, lifecycle mutation, or Failure Handler. Missing, duplicate, partial, conflicting, or lineage-invalid completed state remains a deterministic failure. The complete M7 suite now passes `53 / 53`; the shared failure-instrumentation suite also remains green.

### Full preflight certification note — executions through `#414`

The fresh live export proved that the canonical 47-node / 57-edge graph and repository connections are structurally aligned, but the live fourth Switch rule was not equivalent to the repository: its left operand was persisted as the literal `=` instead of `={{ $json.action }}`. Consequently `NOOP_COMPLETE` fell through to the otherwise correctly connected fallback in execution `#414`. This is a live configuration mismatch, not a repository routing-index defect.

The full preflight audit also exposed three repository verification gaps that earlier happy-path tests did not exercise: persisted scenes were accepted from IDs and Script coverage without full field/JSON/lineage equivalence; persisted headers were accepted from only scene count, canon reference and prompt reference; and header/status repair did not revalidate the complete persisted scene payload and asset identity. The remediation now performs full readback equivalence, validates complete recovery payloads, rejects conflicting orphan/history state, declares all 15 Code-node modes explicitly, and enables Execute Once on the persisted-header global read.

Static lint now certifies execution modes, invalid runtime tokens, node-reference dominance/branch guards, Switch rule operands/order/output cardinality, terminal/fallback connectivity, append/readback multiplicity, parser-schema parity, append retry prohibition and zero-write failure routing. Ten deterministic route states are simulated offline. The complete suite passes `63 / 63`; shared failure instrumentation remains green.

## Validated areas

- workflow identity, inactive repository state and empty pin data
- graph integrity
- shared Failure Handler and Error Workflow references
- runtime-supported handled-failure execution identity in the M7 Code node
- approved two-tab M7 storage contract
- execute-once global table reads that preserve authoritative candidate counts
- no automatic retry on Google Sheets append nodes
- immutable prompt provenance
- canon/visual/voice/continuity runtime reads using authoritative Story `canonRef`
- prompt/canon material extraction into the AI generation context
- explicit OpenAI provider/model generation provenance
- maximum two AI attempts
- happy-path eligibility structure
- invalid Story/input rejection
- PRE-CANON LEGACY / blank-lineage exclusion
- downstream/Story canon-lineage mismatch rejection
- exact approved Script coverage across scenes
- exact parser/authoritative-schema identity
- nested visual/voice/motion/asset validation, including string rejection for required arrays
- complete dialogue-cue object validation
- dialogue cues constrained to exact same-scene source-text substrings with punctuation/casing preserved
- deterministic package, scene and planned-asset IDs
- contiguous package version history and supersession
- coherent completed-package repeat no-op with malformed/partial/conflicting completed-state rejection
- explicit controlled regeneration
- automatic `UPSTREAM_REVISION` classification when a newer approved Script follows an earlier package
- `packageFormatVersion` separation from creative package version
- generation provenance fields
- status-only repair after complete package persistence
- header-only repair after complete scene persistence
- failure on ambiguous/invalid repair state rather than fresh creative regeneration
- save/verify ordering before Story lifecycle mutation
- explicit scene-save, header-save, generation and Story-update failure routing
- lifecycle isolation
- M7 operational error-code registration
- `PRODUCTION_PACKAGE_GENERATED` lifecycle definition
- D-013 architecture decision
- no live workflow ID/version ID, pins, activation or test fixtures in the export
- no rejected single-cell `scenesJson` design
- planned assets separated from realised asset provenance
- realistic rich child-row JSON payload sizing with individual tested child-cell values below the 50,000-character design boundary

## Deterministic sizing evidence

A 900-word upper-bound Script was modelled across 14 rich scenes. The child-row design kept the largest tested individual JSON/text cell at approximately 4.7k characters in the validation fixture, leaving substantial margin below the 50k design boundary. This validates the approved child-row storage approach rather than the rejected single-cell `scenesJson` approach.

## Repository scope verification

Compared with the installed M7 work-order baseline `3a0a8eae12ea988c8b2bc9d12ef1d02640d6d261`, the final Phase 2–3 diff is limited to M7 specification/schema/prompt/workflow/test artifacts plus the required lifecycle, error-code, decision, and documentation updates.

No M3–M6 workflow export, canon file, shared Failure Handler export, rollback workflow, or unrelated application artifact is changed in the net diff.

## Isolated acceptance still required

This evidence does not authorise or perform live mutation. A separate A3 package must:

1. surgically align the canonical workflow with the certified Code-node modes, seven Execute Once global reads, strengthened resolver/readback/repair code, and exact four-rule Switch contract;
2. preserve identity, credentials, targets, Error Workflow, shared Failure Handler, inactive/unpublished state, zero pins and 47-node / 57-edge topology;
3. save, reload and re-export the canonical workflow, then compare it with the certified repository export while ignoring only normal volatile n8n metadata;
4. re-confirm that `MILO-007`, its single package header and eight scene rows remain unchanged; and
5. perform only a separately authorised isolated acceptance sequence, beginning with the zero-write completed-package repeat case.

Do not activate or publish the M7 workflow unless separately explicitly authorised.
