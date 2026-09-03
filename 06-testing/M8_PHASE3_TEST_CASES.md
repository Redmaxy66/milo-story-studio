# M8 Phase 3 Reference and Production Intent Test Cases

**Version:** 1.0
**Scope:** repository-only, offline validation
**Authority:** A2 — M8 Phase 3 Reference and Production Intent Preparation

## Acceptance matrix

| Area | Required evidence |
|---|---|
| Entry source | Byte-identical approved snapshot at SHA-256 `c1221fe13d7278912b73572658dc569756de4baa98679b7e3567bd3768d98233`; one header; package version 1; `INITIAL`; eight unique contiguous scenes; exact Story, Script and canon lineage. |
| Source completeness | Every scene retains non-empty source text, description, setting, parsed characters, visual, voice, motion, asset and production-note structures; no reconstruction or normalization. |
| Reference governance | Derived/non-canon status, all three classifications, character/environment/prop/scale/palette/lighting coverage, rights and provenance gates, versioning/retirement, write restriction, new-file revision and checksum controls. |
| Film Director | Eight scene briefs, exact source binding, three stable setups per scene and all five specialist sections; no protected-story change. |
| Storyboard | Eight scenes, 24 unique ordered shots, 32 unique ordered panels, geography/screen direction, dialogue locators, prompts, continuity checks and human approval criteria; no images. |
| Animation | Renderer-neutral authority, 24 fps rationale, contiguous in/out frames, 5,760 frames / 240 seconds, exact shot and dialogue coverage, honest missing-asset states, lip-sync fallback, acceptance/revision/assembly boundaries and no renderer adapter. |
| Prompt bundle | 24 unique prompt IDs, exact source hashes, positive/negative requirements, reference roles, continuity locks, permitted/prohibited changes, capability and purpose, requested/observed separation, null live configuration and no provider authority. |
| Approval package | Six repository-only `PENDING_REVIEW` templates with null decision/reviewer/time; all review sections, unresolved choices, zero M7 deviation and protected-meaning confirmation. |
| Generation gate | Exact `NOT REQUESTED — SPECIFICATION REVIEW FIRST` gate; no image/media generation, provider call, upload, spend or asset approval. |
| Boundary | No credential values, live target, generated-media claim, live approval, provider execution, canon change, M7 mutation or decision-log requirement. |
| Regression | M8 Phase 2 and every applicable M3–M7 suite remain green; M7 remains 63/63. |

## Fixture cases

The inert valid fixture proves the minimum package contract. Eight negative mutations prove rejection of duplicate/non-contiguous scenes, source hash drift, missing source text, duplicate shots, approval claims, generated-media claims and live targets.

## Commands

```bash
node --check 05-code/m8/phase3-validation.mjs
node 06-testing/validate_m8_phase3.mjs
node 06-testing/validate_m8_phase2.mjs
node 06-testing/validate_canon_initialization.mjs
node 06-testing/validate_canon_lineage.mjs
node 06-testing/validate_continuity_eligible_selection.mjs
node 06-testing/validate_failure_instrumentation.mjs
node 06-testing/validate_outline_eligible_selection.mjs
node 06-testing/validate_production_package.mjs
node 06-testing/validate_script_eligible_selection.mjs
git diff --check
```

All tests are offline. They must not access n8n, Story Vault, Google Sheets, Google Drive, OpenArt, credentials, canon services, media services or publishing platforms; generate or retrieve media; spend credits; execute/import/activate/publish workflows; assemble an episode; or create live approvals.
