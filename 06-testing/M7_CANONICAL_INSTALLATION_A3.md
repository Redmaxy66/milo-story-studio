# Milo Story Studio — Install Certified M7 Graph and Perform Final Canonical Verification

**Authority required:** A3 — Production Execute  
**Canonical workflow:** `SNnLunczq5mxrXLn`  
**Certified implementation:** `da976ed5e686335ee7d3962f4763fcd1e707476a`  
**Import prohibited:** Yes  
**M8 prohibited:** Yes
**Execution status:** Completed successfully on 2026-09-02; see `M7_CANONICAL_VERIFICATION.md`

This document records the completed A3 package. Its presence in the repository does not authorise any further live mutation or execution.

## Objective

Surgically bring the canonical Production Package Generator into exact functional parity with the isolated-acceptance-certified repository export, then execute one controlled INITIAL invocation against the already-completed governed `MILO-007` package. The invocation must terminate through `NOOP_COMPLETE` with zero writes.

## Entry verification

Before mutation, export/download the current canonical workflow and confirm:

- workflow ID `SNnLunczq5mxrXLn`;
- 47 nodes, 57 edges, zero pins;
- inactive/unpublished;
- credentials and Google Sheets/GitHub/OpenAI targets intact;
- Error Workflow and `Call Failure Handler` still target `3an2myLOF7o4STK8`;
- no unexpected active execution;
- canonical live connections retain the governed output mapping;
- `MILO-007 = PRODUCTION_PACKAGE_GENERATED` with `updatedAt=2026-09-01T20:54:55.052+08:00`;
- exactly one header `MILO-007-S01-P01`, version 1, generation mode `INITIAL`, scene count 8;
- exactly eight unique ordered scene rows `SC01`–`SC08`;
- header/scenes retain `canon-v1.0` / `977755913d9ad41e4f16392d01ea993507af4102`;
- prompt reference remains `7947021016f14c84c71421aeb225b80cad990c9d`;
- production FailureLog remains at 18 events, with execution `#414` the latest M7 event; and
- temporary isolated workflows/data remain separate and are not retargeted.

Stop on any material mismatch.

## Surgical canonical patch

Do not import the workflow. Preserve workflow identity, connections, node IDs, positions, credentials, targets, settings, publication state, pins, and rollback history except for the exact properties below.

### 1. Explicit Code execution modes

Set `parameters.mode = runOnceForAllItems` to the exact repository value on these 15 Code nodes:

1. `Normalize Generation Request`
2. `Resolve M7 Action`
3. `Build And Validate Complete Package`
4. `Expand Scene Rows`
5. `Verify Complete Scene Set`
6. `Prepare Package Header`
7. `Verify Complete Package`
8. `Validate Status Repair`
9. `Reconstruct Header From Verified Scenes`
10. `Prepare Repaired Header`
11. `Prepare Generation Failure`
12. `Prepare Scene Save Failure`
13. `Prepare Header Save Failure`
14. `Prepare Story Status Failure`
15. `Prepare M7 Failure`

### 2. Seventh governed Execute Once read

Set `Read Persisted Package Header.executeOnce = true`.

Confirm the complete seven-read set remains:

- `Read Stories`
- `Read Scripts`
- `Read Continuity Reviews`
- `Read Existing Production Packages`
- `Read Existing Production Package Scenes`
- `Read Persisted Scene Set`
- `Read Persisted Package Header`

### 3. Certified Code bodies

Replace these `parameters.jsCode` values with their exact values from commit `da976ed5e686335ee7d3962f4763fcd1e707476a`:

- `Resolve M7 Action`
- `Verify Complete Scene Set`
- `Validate Status Repair`
- `Reconstruct Header From Verified Scenes`
- `Verify Complete Package`

### 4. Certified action router rules

Replace the complete `Route M7 Action.parameters.rules.values` array with the exact repository value. Confirm:

| Output | Action | Connection |
|---:|---|---|
| 0 | `GENERATE` | `Get M7 Prompt` |
| 1 | `STATUS_REPAIR` | `Validate Status Repair` |
| 2 | `HEADER_REPAIR` | `Reconstruct Header From Verified Scenes` |
| 3 | `NOOP_COMPLETE` | terminal/unconnected |
| 4 | fallback | `Prepare M7 Failure` |

Every rule left operand must be `={{ $json.action }}`. Preserve the existing live connections because the governed connection mapping is already correct.

## Save/reload/parity verification

Save once, reload, and export the resulting live JSON before execution. Confirm:

- workflow identity unchanged;
- 47 nodes / 57 edges / zero pins;
- inactive/unpublished;
- all 15 Code modes explicit;
- all seven global reads use Execute Once;
- `Prepare M7 Failure` still uses `$execution.id`;
- parser schema still equals `02-story-system/PRODUCTION_PACKAGE_AI_OUTPUT_SCHEMA.json`;
- all three prompt references remain `7947021016f14c84c71421aeb225b80cad990c9d`;
- Switch rules and output mapping match the table above;
- append retry remains disabled;
- credentials, targets, Error Workflow, and shared Failure Handler unchanged; and
- normalized live export is equivalent to the certified repository export, excluding only normal volatile n8n metadata.

Stop before execution on any mismatch.

## One controlled canonical verification

Reconfirm the entry Story/package/scene/FailureLog counts, then execute exactly one normal INITIAL invocation.

Expected action: `NOOP_COMPLETE` on output 3.

Prove:

- `Generate Production Package` does not execute;
- `Append Production Package Scenes` does not execute;
- `Append Production Package Header` does not execute;
- no Story update executes;
- no Failure Handler executes;
- no new FailureLog event is created;
- header count remains 1;
- scene count remains 8;
- package version remains 1;
- generation mode remains `INITIAL`;
- Story remains `PRODUCTION_PACKAGE_GENERATED`;
- Story `updatedAt` remains unchanged;
- canon and prompt provenance remain unchanged;
- no retry occurs; and
- no M8 action occurs.

Stop immediately on any mismatch. Do not retry.

## Successful handoff

If parity and the canonical no-op check pass, report the live export comparison, execution ID, actual Switch output, forbidden-node proof, before/after row counts, Story timestamp, FailureLog count, workflow state, and rollback position. Then stop for A2 Phase 7 repository/state reconciliation.

`M7 CANONICAL VERIFICATION: PASS`

## Recorded result

The canonical package was executed under separate A3 authority. Execution `#432` resolved `NOOP_COMPLETE`, emitted one item on terminal Switch output 3, and produced zero package, scene, Story, FailureLog, retry, or M8 writes/actions. Phase 7 reconciliation is recorded in `M7_CANONICAL_VERIFICATION.md`.
