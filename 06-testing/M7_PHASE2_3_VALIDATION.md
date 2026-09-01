# M7 Phase 2–3 Validation Evidence

**Date:** 2026-09-01  
**Authority:** A2 — Controlled Execute  
**Scope:** Repository implementation and non-production validation only  
**Live n8n mutation/execution:** None  
**Live Google Sheets mutation:** None

## Result

M7 repository implementation passed the non-production validation gate required before Phase 4.

The executable offline M7 validation harness completed:

`27 / 27 PASS`

The final committed workflow hardening deltas were then re-inspected directly from the repository after remediation.

### Reconciliation note — 2026-09-01

A later full-suite rerun exposed a brittle M7-008 harness assertion: the approved prompt prohibits human-readable “package IDs” and “package versions”, while the test incorrectly required the camelCase implementation tokens `packageId` and `packageVersion`. The approved prompt, schema, workflow, and immutable `promptRef` were unchanged. The harness now proves the boundary directly by requiring that the schema expose only `scenes` and `productionNotes` and that the prompt explicitly prohibit package IDs/versions, canon lineage, and publishing schedules. The reconciled suite remains `27 / 27 PASS`.

## Validated areas

- workflow identity, inactive repository state and empty pin data
- graph integrity
- shared Failure Handler and Error Workflow references
- approved two-tab M7 storage contract
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
- nested visual/voice/motion/asset validation
- dialogue cues constrained to source scene text
- deterministic package, scene and planned-asset IDs
- contiguous package version history and supersession
- normal duplicate rejection
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

## Live acceptance still required

This evidence does not prove live n8n import/configuration or Story Vault persistence. Phase 4 requires separate A3 authority and must verify:

1. creation of `Production Packages` and `Production Package Scenes` with the approved exact headers;
2. import/configuration of `Milo Production Package Generator v0.1` as a new workflow;
3. credential and target resolution;
4. Error Workflow and shared Failure Handler binding;
5. immutable promptRef and Story-canonRef runtime configuration;
6. controlled live happy-path, duplicate, failure and repair behaviour using an eligible post-remediation Story/Script/Continuity lineage;
7. live persistence ordering and lifecycle isolation;
8. re-export and repository/live parity.

Do not activate or publish the M7 workflow unless separately explicitly authorised.
