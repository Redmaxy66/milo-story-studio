# M8 Phase 2 Repository Contract Validation

**Result:** PASS
**Validation date:** 2026-09-03
**Authority:** A2 — M8 Phase 2 Repository Contracts
**Entry remote `main`:** `d323ef4a3a25bae37eeba88f0f54ad443ab2ac31`
**Rollback position:** `d323ef4a3a25bae37eeba88f0f54ad443ab2ac31`
**External design artifact:** revision 1.1, SHA-256 `6934b997f79e3d5aa7ff5b9405926abb8c9e401a1a539a31e16b1c32dac0d8a2`

## Entry verification

- The authorized GitHub connection resolved remote `main` to the required entry commit.
- The supplied design artifact was verified read-only outside the repository at the approved SHA-256.
- The design artifact was not added to the repository.
- Work remained within the paths authorized for M8 Phase 2.

## M8 validation results

| Suite | Result |
|---|---:|
| `validate_m8_contracts.mjs` | PASS — 36 / 36 |
| `validate_m8_lifecycle.mjs` | PASS — 93 / 93 |
| `validate_m8_hashing.mjs` | PASS — 19 / 19 |
| `validate_m8_openart_adapter.mjs` | PASS — 29 / 29 |
| `validate_m8_story_vault_schema.mjs` | PASS — 33 / 33 |
| `validate_m8_workflow_skeletons.mjs` | PASS — 14 / 14 |
| `validate_m8_phase2.mjs` | PASS — 9 / 9 aggregate |

The four implementation modules also pass `node --check`, and all JSON specifications, fixtures, and skeleton exports parse successfully.

## M3–M7 regression results

| Suite | Result |
|---|---:|
| `validate_canon_initialization.mjs` | PASS |
| `validate_canon_lineage.mjs` | PASS |
| `validate_continuity_eligible_selection.mjs` | PASS |
| `validate_failure_instrumentation.mjs` | PASS — 57 / 57 operational codes registered; 18 / 18 `FailureLog` columns preserved |
| `validate_outline_eligible_selection.mjs` | PASS |
| `validate_production_package.mjs` | PASS — 63 / 63 |
| `validate_script_eligible_selection.mjs` | PASS |

The M7 compatibility wording remains explicit in `STORY_STATUS_MODEL.md`: M8 states are not added under M7 authority. The M8 extension is a separately authorized repository-only definition.

## Boundary and safety evidence

- `StudioControl` is specified only as a derived, read-only, non-authoritative projection.
- M8 failures remain specified to route through the existing shared Failure Handler to the unchanged 18-column `FailureLog`; no `M8Errors` store exists.
- Recorded OpenArt fixtures retain only approved historical history/resource identifiers and label them historical and non-callable. Synthetic and general fixtures use inert identifiers.
- No live target, endpoint, workspace/project ID, credential, token, signed URL, trigger, or active workflow is present.
- SHA-256 is authoritative durable-byte identity; approved files are write-restricted; revisions require new files and records; in-place replacement is prohibited; pre-assembly checksum revalidation is mandatory.
- The 75-credit connectivity ceiling remains a future A3 guardrail, not spending authority. Pilot, preview, and final-resolution caps remain unset pending their evidence gates.

## Systems and side effects

No external operational system other than the authorized GitHub repository was accessed. In particular, no n8n, Story Vault, Google Sheets, Google Drive, OpenArt, credential, canon, media, or publishing system was accessed or modified.

No media was generated; no credits were spent; no workflow was executed, imported, activated, or published; no Story Vault tab was created or modified; no credential was read, changed, or revoked; no canon content was changed; no assembly or publication action occurred.

## Phase disposition

M8 Phase 2 repository contracts satisfy the offline acceptance gate. This evidence does not authorize Phase 3, the A3 n8n/OpenArt connectivity proof, live schema installation, paid generation, durable-media writes, assembly, activation, or publication. Every later phase remains separately gated.
