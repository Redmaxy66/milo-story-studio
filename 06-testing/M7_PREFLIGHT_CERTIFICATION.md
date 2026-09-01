# M7 Full Preflight Certification Audit

**Date:** 2026-09-01  
**Authority:** A2 — Controlled Execute  
**Canonical workflow:** `SNnLunczq5mxrXLn`  
**Repository baseline:** `1fee45fc3c019b5ecfd9d34b0c88f8dcce04e233`  
**Live mutation/execution:** None  
**Story Vault mutation:** None

## Result

The repository implementation is certified for a separately authorised surgical live installation followed by isolated acceptance testing. The live workflow is not yet equivalent to this certified export and must not be executed until the A3 patch and post-save export comparison pass.

## Preserved diagnostic baseline

- Fresh live export SHA-256: `e989f7fc046d71f9d55f091e7193183654b851094e83dc19577bc4e8c6ba9ad1`
- Live identity/state: `SNnLunczq5mxrXLn`, inactive/unpublished, zero pins
- Live graph: 47 nodes, 46 connection sources, 57 edges
- Repository baseline graph: 47 nodes, 46 connection sources, 57 edges, zero pins
- Error Workflow/shared handler: `3an2myLOF7o4STK8` in live and repository
- Credentials and Google Sheets/GitHub/OpenAI targets: present in the live export; no credential or target changes are part of this remediation

After removal of volatile node positions/IDs, generated GitHub webhook IDs, Switch/IF editor metadata and cached UI URLs, the only material pre-remediation live/repository difference was the fourth `Route M7 Action` rule:

| Property | Live | Repository baseline |
|---|---|---|
| Rule 4 left operand | literal `=` | `={{ $json.action }}` |
| Rule 4 right operand | `NOOP_COMPLETE` | `NOOP_COMPLETE` |
| Output 3 connection | terminal/unconnected | terminal/unconnected |
| Fallback output 4 | `Prepare M7 Failure` | `Prepare M7 Failure` |

Therefore execution `#414` was not caused by reversed connection indexes. The malformed live rule did not match `NOOP_COMPLETE`, so the item used the correctly connected fallback.

## Story Vault baseline

Fresh bounded reads proved:

- `MILO-007 = PRODUCTION_PACKAGE_GENERATED`
- one header `MILO-007-S01-P01`
- `packageVersion = 1`, `generationMode = INITIAL`, `sceneCount = 8`
- exactly eight child rows, `SC01` through `SC08`
- canon lineage `canon-v1.0` / `977755913d9ad41e4f16392d01ea993507af4102`
- prompt provenance `m7-production-package-v1.0` / `03-prompts/m7-production-package-generator.md` / `7947021016f14c84c71421aeb225b80cad990c9d`
- generator provenance `OpenAI` / `gpt-5-mini`
- handled M7 FailureLog rows remain the expected events for executions `#407`, `#409`, `#412` and `#414`; no `#406` FailureLog row exists

No current row was written or altered during this audit.

## Execution evidence reconciliation

| Execution | Evidence retained | Governing conclusion |
|---|---|---|
| `#406` — Error, 53.579s | Global read multiplication and invalid `$exec.id` handling were exposed before generation/persistence. | Previously remediated; now statically linted. |
| `#407` — Succeeded, 1m 43.735s | Authoritative nested output validation rejected invalid AI output; zero package/scene/lifecycle writes; handled event persisted. | Parser/schema/prompt remediation remains intact. |
| `#409` — Succeeded, 2m 29.463s | Eight appended scene items multiplied into 64 readback items; eight real scene rows remained as an orphan set; handled verify event persisted. | Scene readback Execute Once remediation remains intact. |
| `#411` — Succeeded, 14.637s | `HEADER_REPAIR` created one header without regenerating/re-appending scenes and advanced the Story once. | Recovery path is valid, but its offline payload validation required strengthening. |
| `#412` — Succeeded, 10.549s | Duplicate writes were prevented; completed Story was incorrectly failed before coherent package evaluation. | Completed repeat semantics were previously remediated. |
| `#414` — Succeeded, 12.792s | Resolver emitted `NOOP_COMPLETE`; malformed live Switch rule fell through to Failure Handler; zero production writes. | Exact live rule operand—not connection order—is the remaining known live mismatch. |

## Full node and connection audit

All 47 nodes and all 57 edges are covered by graph/reference/routing/persistence lint. The execution assumptions are:

| Nodes | Certified execution/configuration assumption |
|---|---|
| 1–2: both triggers | Single request enters the shared normalizer; neither trigger is published/active. |
| 3: `Normalize Generation Request` | Explicit Run Once for All Items; emits one validated request. |
| 4–8: five baseline Sheet reads | Execute Once; each returns its complete authoritative table without upstream multiplication. |
| 9: `Resolve M7 Action` | Explicit Run Once for All Items; consumes all five tables and all scene rows; validates history, lineage and recovery state. |
| 10: `Route M7 Action` | Four exact ordered rules plus fallback; output 3 is terminal `NOOP_COMPLETE`; output 4 is governed failure. |
| 11–20: five immutable GitHub reads/extracts | Reachable only from `GENERATE`; prompt uses immutable prompt ref and all canon material uses selected Story `canonRef`. |
| 21–23: AI/model/parser | Only AI node may retry, maximum two attempts; embedded parser equals authoritative schema. |
| 24–26: build/gate/expand | Build and expand explicitly run once for all items; invalid output cannot reach scene append. |
| 27–30: scene append/readback/verify/gate | Append has no retry; readback Execute Once; verifier compares every persisted scene field and nested JSON value. |
| 31–35: header prepare/append/readback/verify/gate | Code nodes explicit; append has no retry; header readback Execute Once; all 25 fields are verified before lifecycle mutation. |
| 36: Story update | Reachable only from a verified complete package or verified status repair; error output is handled. |
| 37–41: status/header repair | Explicit modes; complete recovery payload, asset identity, lineage and Script coverage are revalidated; no repair path enters generation or scene append. |
| 42–46: handled-failure preparation | Explicit modes; converge once; runtime uses `$execution.id`; no failure route can re-enter a write. |
| 47: shared Failure Handler | Sole handled-failure terminal; canonical workflow Error Workflow remains the same shared handler. |

Named-node reference analysis covers `.first()`/`.all()` references, proves that each referenced node is upstream on every executable route, and permits only the explicitly action-guarded mutually exclusive header references inside `Verify Complete Package`. No `$exec.`, `$items()` or implicit `$item` reference remains. `$json` is used only where the certified input cardinality is one or the Code node deliberately owns the full item set.

## Defects found and consolidated remediation

### Live configuration

1. `Route M7 Action` rule 4 contains literal `=` instead of the action expression. Connections are correct.

### Execution-mode hardening

2. Fifteen Code nodes relied on n8n's default Run Once for All Items mode. The export now declares that mode explicitly on every Code node.
3. `Read Persisted Package Header` was a global read without Execute Once. It is now the seventh certified Execute Once read.

### Persistence/readback integrity

4. `Verify Complete Scene Set` previously compared count, IDs and normalised Script coverage only. It now compares identity, numbering, Story/Script/package/canon lineage, source/guidance fields, parsed nested JSON and creation timestamp against every validated in-memory row.
5. `Verify Complete Package` previously compared only row count, scene count, `canonRef` and `promptRef`. It now compares the complete 25-field header contract, with numeric and parsed-JSON equivalence for normal Sheet representation changes.

### Recovery/integrity semantics

6. `Reconstruct Header From Verified Scenes` previously did not fully validate duplicate scene numbers, full row lineage/payload JSON, dialogue cues, planned-asset identity or common creation provenance. All are now required before header repair.
7. `Validate Status Repair` now rechecks unique contiguous child identity and full lineage/coverage before lifecycle repair.
8. `Resolve M7 Action` now rejects incomplete/malformed historical child sets, invalid historical generation modes, `UPSTREAM_REVISION` without a preceding package, and conflicting orphan package rows before generation; it requires complete metadata/manifest/payload/timestamp coherence before `STATUS_REPAIR` or `NOOP_COMPLETE`.

No new architecture or governance decision was required. Topology, storage contract, prompt, schema, canon rules, failure architecture and retry policy are unchanged.

## Static lint coverage

The M7 validator now automatically rejects:

- missing required `executeOnce` on any of the seven global reads;
- any Code node without explicit Run Once for All Items;
- `$exec.`, `$items()` or implicit `$item` usage;
- missing, downstream-only or unguarded branch-specific node references;
- Switch operand/order drift, rule/output cardinality mismatch, connected no-op terminal, or unconnected fallback;
- disconnected IF success/failure outputs;
- parser drift from the authoritative schema;
- append-to-readback paths without Execute Once;
- append auto-retry or failure-route append re-entry; and
- multiple handled-failure entry points or any handled-failure path to a write.

## Deterministic route simulation

| State | Expected result | Forbidden behavior | Result |
|---|---|---|---|
| Clean INITIAL | `GENERATE` | repair/failure before validated generation | PASS |
| Completed INITIAL repeat | `NOOP_COMPLETE` | model, append, lifecycle, failure | PASS |
| Scene-only coherent orphan | `HEADER_REPAIR` | model or scene append | PASS |
| Complete package, stale Story | `STATUS_REPAIR` | model or either append | PASS |
| Partial/missing completed scenes | `FAIL` | no-op, append or lifecycle | PASS |
| Duplicate scenes | `FAIL` | no-op, repair promotion or lifecycle | PASS |
| Duplicate headers | `FAIL` | generation, no-op or lifecycle | PASS |
| Script/Story lineage mismatch | `FAIL` / `CANON_LINEAGE_MISMATCH` | GitHub/AI/persistence | PASS |
| Malformed AI output | `PRODUCTION_PACKAGE_AI_OUTPUT_INVALID` | any persistence/lifecycle write | PASS |
| Happy-path persistence | build → exact scene verify → exact header verify | lifecycle before both verification gates | PASS |

## Exact A3 live patch required

Do not import the workflow. Under separate A3 authority, surgically apply only the certified repository values for:

1. `parameters.mode = runOnceForAllItems` on all 15 Code nodes;
2. `Read Persisted Package Header.executeOnce = true`;
3. `Resolve M7 Action.parameters.jsCode`;
4. `Verify Complete Scene Set.parameters.jsCode`;
5. `Validate Status Repair.parameters.jsCode`;
6. `Reconstruct Header From Verified Scenes.parameters.jsCode`;
7. `Verify Complete Package.parameters.jsCode`;
8. the complete `Route M7 Action.parameters.rules.values` array, ensuring all four left operands equal `={{ $json.action }}` and rule 4 equals `NOOP_COMPLETE`.

Preserve the existing live connections, because the fresh export proves they already match the certified output mapping. Preserve all other properties, credentials, targets and settings. Save, reload and re-export before any execution; require 47 nodes, 57 edges, zero pins, inactive/unpublished state, seven Execute Once reads and repository equivalence excluding only volatile n8n metadata.

The first later acceptance invocation must be separately authorised and isolated. No M8 action is permitted.

`M7 PREFLIGHT CERTIFICATION: READY FOR ISOLATED ACCEPTANCE`
