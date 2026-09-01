# M7 Production Package — Offline Test Cases

**Scope:** Phase 3 non-production validation only  
**Live n8n execution:** Not authorised  
**Live Google Sheets mutation:** Not authorised

Run:

```bash
node 06-testing/validate_production_package.mjs
```

| ID | Test | Expected result |
|---|---|---|
| M7-001 | Workflow identity / inactive state / pins | Correct workflow name, `active=false`, empty `pinData`, no temporary test records. |
| M7-002 | Graph integrity | Node names are unique and every connection source/target exists. |
| M7-003 | Failure routing | Shared Failure Handler ID and Error Workflow are preserved; the Code-node handled-failure envelope uses runtime-supported `$execution.id`. |
| M7-004 | Storage targets and global-read execution | Export references `Stories`, `Scripts`, `Continuity Reviews`, `Production Packages`, and `Production Package Scenes`; every global table read executes once per workflow run so upstream item counts cannot multiply candidate rows. |
| M7-005 | Append retry prohibition | No Google Sheets append node enables automatic retry. |
| M7-006 | Immutable references | M7 prompt uses immutable `promptRef`; canon/visual/voice/rules reads use authoritative Story `canonRef`. |
| M7-007 | Generator provenance | Provider/model and maximum two AI attempts are explicit. |
| M7-008 | AI/deterministic boundary | Schema exposes only `scenes` and `productionNotes`; the prompt explicitly prohibits package IDs/versions, canon lineage, and publishing schedules from AI output. |
| M7-009 | Happy-path IDs | Package, scene, and asset IDs are deterministic and correctly formatted. |
| M7-010 | Invalid input/state and legacy lineage | Invalid Story state/input and blank/malformed authoritative canon lineage fail before generation. |
| M7-011 | Canon mismatch | Script/Review lineage mismatch fails deterministically. |
| M7-012 | Exact Script coverage | Concatenated scene source text must reproduce the complete approved Script after controlled whitespace normalization. |
| M7-013 | Scene numbering | Scene numbers and IDs start at 1 and remain contiguous. |
| M7-014 | Package history | Package versions are contiguous and each non-first version supersedes the immediately prior package. |
| M7-015 | Duplicate protection | Normal duplicate execution cannot silently become controlled regeneration. |
| M7-016 | Regeneration provenance | Controlled regeneration / upstream revision carry mode, supersession, package format, prompt, provider, and model provenance. |
| M7-017 | Package format | `packageFormatVersion=1.0` is distinct from creative `packageVersion`. |
| M7-018 | Partial-write repair | Status repair and header repair exist and do not invoke fresh AI generation. |
| M7-019 | Save/verify ordering | Validation gates protect scene append, header append, and Story mutation in the approved sequence. |
| M7-020 | Lifecycle isolation | Failure routes cannot advance the Story; only verified package/status-repair routes can update Story state. |
| M7-021 | Error registry | Required M7 operational codes are registered. |
| M7-022 | Lifecycle model | Only `PRODUCTION_PACKAGE_GENERATED` is added by M7. |
| M7-023 | D-013 | Immutable blueprint / child-scene / separate realised-provenance architecture is recorded. |
| M7-024 | Export hygiene | No live workflow ID/version ID, pins, activation, or `TEST-INVALID` fixtures. |
| M7-025 | Storage safety | Rejected `scenesJson` single-cell design is absent. |
| M7-026 | Asset boundary | M7 asset manifest remains planned-only; realised external-asset fields are absent from generated package construction. |
| M7-027 | Sheets payload sizing | Realistic rich per-scene JSON child fields remain below the 50,000-character design boundary per cell. |
| M7-028 | Runtime/authoritative schema parity | The parser's embedded runtime schema is deeply identical to `PRODUCTION_PACKAGE_AI_OUTPUT_SCHEMA.json`. |
| M7-029 | Nested array rejection | Required visual, voice, and motion guidance arrays reject string values. |
| M7-030 | Nested array acceptance | Correctly typed required guidance arrays pass the authoritative schema. |
| M7-031 | Dialogue speaker requirement | A dialogue cue without `speaker` is rejected. |
| M7-032 | Dialogue delivery requirement | A dialogue cue without `deliveryNote` is rejected. |
| M7-033 | Exact dialogue substring | Cue text with altered punctuation/casing or other non-exact text is rejected; an exact scene-source substring passes. |
| M7-034 | Complete ordered Script coverage | Complete ordered normalized coverage passes; reordered or incomplete coverage fails. |
| M7-035 | Invalid-output isolation | Invalid nested output produces `PRODUCTION_PACKAGE_AI_OUTPUT_INVALID` and reaches Failure Handler without a package, scene, or lifecycle write. |
| M7-036 | Valid-output persistence entry | Valid output reaches the existing scene-expansion and persistence path. |
| M7-037 | Manifest/provenance preservation | Planned asset manifest and prompt/provider/model provenance remain populated and unchanged in meaning. |
| M7-038 | Prompt contract clarity | The immutable runtime prompt explicitly requires JSON arrays, complete dialogue-cue objects, and exact same-scene source substrings with preserved punctuation/casing. |
| M7-039 | Persisted-scene read execution count | Eight appended scene items trigger exactly one `Read Persisted Scene Set` execution. |
| M7-040 | Persisted-scene readback count | The single read returns exactly the eight stored scene rows. |
| M7-041 | Complete scene verification | `Verify Complete Scene Set` receives exactly eight valid rows and accepts the complete set. |
| M7-042 | Scene integrity rejection | Missing or duplicate scene rows still fail deterministic verification. |
| M7-043 | Header write gate | The package header append remains unreachable until scene verification succeeds. |
| M7-044 | Orphan-scene recovery selection | Eight valid orphan scene rows with no header and a `CONTINUITY_APPROVED` Story resolve to `HEADER_REPAIR`. |
| M7-045 | Recovery scene-write isolation | `HEADER_REPAIR` reconstructs and appends only the missing header; it does not append the eight scene rows again. |
| M7-046 | Header-repair completion | A valid repair creates exactly one header, verifies it, and reaches the intended `PRODUCTION_PACKAGE_GENERATED` transition. |
| M7-047 | Recovery retry safety | Scene/header append nodes remain non-retrying and failure routing cannot re-enter either append. |

## Phase 4 live acceptance still required

These offline tests do not prove live n8n import/configuration or Story Vault persistence. Under separate A3 authority, live acceptance must verify the two new tabs, credential/target binding, real append/verification behaviour, controlled repair, duplicate protection, FailureLog behaviour, and final live/repository parity.
