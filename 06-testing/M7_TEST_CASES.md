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

## Phase 4 live acceptance still required

These offline tests do not prove live n8n import/configuration or Story Vault persistence. Under separate A3 authority, live acceptance must verify the two new tabs, credential/target binding, real append/verification behaviour, controlled repair, duplicate protection, FailureLog behaviour, and final live/repository parity.
