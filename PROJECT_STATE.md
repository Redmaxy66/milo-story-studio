# PROJECT_STATE.md
## Milo Story Studio — Current Operational State

**Status date:** 2026-08-31  
**State basis:** Repository evidence plus completed read-only live-state verification  
**Authority for this baseline:** A2 — Controlled Execute

---

## 1. Current Milestone

**M6.5 — Hardening / Production Cutover — COMPLETE WITH LIVE-STATE EXCEPTIONS**

---

## 2. Current Status

**COMPLETE WITH LIVE-STATE EXCEPTIONS**

M6.5 implementation and production identity cutover are complete. The governance baseline has been verified against repository evidence and a completed read-only inspection of the live n8n Milo Story Studio project and Milo Story Vault.

The live-state exceptions recorded in Section 8 require explicit future assessment and disposition. They do not authorise corrective action or M7 implementation.

M7 has not started.

---

## 3. Next Milestone

**M7 — Production Package — NOT STARTED**

M7 implementation remains unauthorised.

---

## 4. Completed

### Repository-verified

- M6 Continuity Agent is recorded complete.
- M6.5 failure-instrumentation contracts and implementation artifacts are committed.
- `Milo Failure Handler v0.1` exists as a repository workflow export.
- Nine source workflow exports contain a terminal `Call Failure Handler` node.
- The handler export contains handled and unhandled entry paths, normalization, and `FailureLog` append architecture.
- The handler targets the `FailureLog` tab in the Milo Story Vault and is designed not to mutate Story or artifact lifecycle state.
- The 18-column `FailureLog` contract, deterministic failure IDs, handled/unhandled classification, retry policy, and operational error-code register are documented.
- Offline repository tests record passing failure-contract, routing, lifecycle-isolation, repair-path, Boolean-normalization, and pin-hygiene checks.
- Relevant M6.5 repository commits include `628d57daf64e993dc15e441cb973065133d76d9a`, `102ff8f6ba512b96f9e99362ad1a613297c1854f`, `2719ef8dd48b994ae2bcb2575a30cf07942672f9`, and `08ce6104e550df83867270f69726383d19671c3f`.

### Live-state verified

- `FailureLog` exists in the Milo Story Vault with exactly this 18-column schema, in order: `failureId`, `occurredAt`, `workflowName`, `workflowId`, `executionId`, `sourceType`, `storyId`, `conceptId`, `outlineId`, `scriptId`, `reviewId`, `errorCode`, `message`, `nodeName`, `nodeType`, `attempt`, `rawError`, `status`.
- The shared workflow is `Milo Failure Handler v0.1`, workflow ID `3an2myLOF7o4STK8`.
- The shared Failure Handler contains handled and unhandled entry paths, normalization, and `FailureLog` append architecture.
- Its Google Sheets credential and `Milo Story Vault` → `FailureLog` target resolve.
- No unexpected pins or visible warnings were observed on the shared Failure Handler.
- The shared Failure Handler's current live state is **Published**.
- All nine canonical hardened workflows exist with the verified identities listed below.
- Every canonical workflow has a matching `- PRE-M6.5 ROLLBACK` workflow.
- All nine canonical workflows are **Unpublished**.
- All nine reference the shared Failure Handler through both their terminal `Call Failure Handler` node and Error Workflow setting.
- Relevant Google Sheets, OpenAI, and GitHub credential references resolve.
- Story Vault targets resolve to the correct workbook and relevant tabs.
- No unexpected pins, visible warnings, workflow-ID collision, or canonical-name collision was observed on the nine canonical workflows.

| Canonical workflow | Verified current workflow ID |
|---|---|
| `Milo Story Intake v0.1` | `rRuD8by4YXBQD9aw` |
| `Milo Concept Generator v0.1` | `B48dAWnGixCxW2Bp` |
| `Milo Concept Approval v0.1` | `T4ARMdE87kxV565O` |
| `Milo Outline Generator v0.1` | `SCTO6xUfrlKczeP5` |
| `Milo Outline Approval v0.1` | `ZW0yOJkde2fRahqL` |
| `Milo Script Generator v0.1` | `cfRT2oHADjTQi6I6` |
| `Milo Script Approval v0.1` | `fSqJ32jzE2TkEU3X` |
| `Milo Continuity Reviewer v0.1` | `K4HP95loWJiNwjlP` |
| `Milo Continuity Approval v0.1` | `rpINONxNwUIBBec2` |

---

## 5. Canon State

### Repository-verified

- Current canon version: `canon-v1.0`
- Immutable canon reference: `977755913d9ad41e4f16392d01ea993507af4102`
- The annotated Git tag `canon-v1.0` resolves to that commit.
- Decisions D-008, D-009, and D-010 are present in `DECISION_LOG.md`.
- The Story record is the authoritative canon-lineage record.
- Downstream artifacts must inherit matching `canonVersion` and `canonRef` values.

### Live-state verified

The live `MILO-001` lineage contains:

- `canonVersion`: `canon-v1.0`
- `canonRef`: `977755913d9ad41e4f16392d01ea993507af4102`

---

## 6. Production State

- Production identity cutover is complete for all nine canonical workflows.
- Canonical production names identify the hardened implementations.
- The nine pre-M6.5 implementations remain available as named rollback copies.
- The nine canonical workflows are Unpublished.
- The shared Failure Handler is Published; this is recorded as a live-state exception pending operational assessment.
- The shared Failure Handler and `FailureLog` architecture are live and resolved.
- No workflow or production data path was executed during governance verification.

---

## 7. Protected State

- Do not move, recreate, or retarget `canon-v1.0`.
- Do not begin M7 without a current authorised work order or equivalent explicit current instruction.
- Do not activate or publish production workflows without explicit authority.
- Do not execute production data paths without explicit authority.
- Preserve canonical workflow identity mappings.
- Preserve the `- PRE-M6.5 ROLLBACK` copies until retirement is separately authorised.
- Preserve the shared `Milo Failure Handler v0.1` and `FailureLog` architecture.
- Preserve failure-handler lifecycle isolation.
- Preserve the 18-column FailureLog contract and append retry prohibition.
- Preserve Story and downstream artifact canon-lineage integrity.
- Preserve decisions D-008, D-009, and D-010.

---

## 8. Live-State Exceptions / Unresolved Items

These items are recorded for explicit future assessment. No repair or disposition is authorised by this baseline.

1. `Milo Failure Handler v0.1` is currently **Published**. This differs from the previously expected unpublished state. Do not classify this automatically as a defect until its operational requirement is assessed.
2. Several older Story, Concept, and Outline records have blank `canonVersion` and `canonRef` fields. Their intended legacy treatment is not yet documented.
3. The live `Continuity Reviews` tab does not currently contain `canonVersion` or `canonRef` columns, despite the stable canon-lineage rule stating that Continuity Reviews inherit canon identity.
4. Two non-canonical test/legacy workflows remain:
   - `Milo Concept Generator v0.1 - M6.5 TEST OLD` — `AKKJLo6NoCOxbHD8`
   - `Milo Outline Approval v0.1 - M6.5 TEST OLD` — `UdeGbGGWIS7nR4Kk`

   Their retention or retirement status is unresolved.
5. Functional credential execution was not tested because live workflow execution was prohibited.
6. GitHub workflow runtime canon fetching is not proven to be pinned to `canon-v1.0` or its immutable SHA from visible configuration alone.

---

## 9. Next Authorised Action

Complete governance baseline review and commit. After governance is committed, create a separate pre-M7 work order to assess and disposition the recorded live-state exceptions. M7 implementation remains unauthorised until that work order is completed or the exceptions are explicitly accepted.

---

**End of Current Operational State**
