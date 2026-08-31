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

**COMPLETE WITH DOCUMENTED EXCEPTIONS AND TWO TECHNICAL BLOCKERS**

M6.5 implementation and production identity cutover are complete. The governance baseline has been verified against repository evidence and a completed read-only inspection of the live n8n Milo Story Studio project and Milo Story Vault.

The completed Pre-M7 Exception Disposition assessment identified two governance decisions and two technical M7 blockers. Decisions D-011 and D-012 now close the governance questions concerning the shared Failure Handler publication state and pre-canon legacy records. The remaining technical blockers are recorded in Section 8 and do not authorise remediation or M7 implementation.

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
- Decision D-012 classifies blank-lineage records created before formal canon provenance as PRE-CANON LEGACY and makes them ineligible for M7 or later production unless a separately authorised complete-lineage migration establishes valid provenance.
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
- The shared Failure Handler is Published. Decision D-011 accepts this as an explicit handler-specific operational exception; publication is not technically required and does not authorise publication of any other Milo production workflow.
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
- Preserve decision D-011 and its handler-specific limitation; any future Failure Handler publication-state change requires separate production authority.
- Preserve decision D-012: blank lineage must not be interpreted as any canon release, and PRE-CANON LEGACY lineages must not progress into M7 or later production without a separately authorised provenance-valid migration.

---

## 8. Governance Dispositions and Remaining Exceptions

The Pre-M7 Exception Disposition assessment is complete. Governance decisions D-011 and D-012 resolve items 1 and 2 below. Items 3 and 6 are the only current technical M7 blockers. No repair, migration, cleanup, or M7 implementation is authorised by this state record.

1. **Governed — not an M7 blocker:** `Milo Failure Handler v0.1` is currently **Published**. Decision D-011 accepts this as an explicitly approved handler-specific operational exception. Publication is not technically required, does not create general permission to publish other Milo workflows, and may be changed only through a separately authorised production action.
2. **Governed — not an M7 blocker:** Five Stories (`MILO-002` through `MILO-006`), fourteen Concepts, and two Outlines (`MILO-002-O01` and `MILO-003-O01`) have blank `canonVersion` and `canonRef`. Decision D-012 classifies them as PRE-CANON LEGACY records. Blank lineage is not any canon release, and these lineages are ineligible for M7 or later production unless a separately authorised migration establishes valid provenance for the complete Story lineage without fabrication.
3. **Technical M7 blocker — remediation required:** The live `Continuity Reviews` tab does not contain `canonVersion` or `canonRef` columns, despite D-009, D-010, and the stable canon-lineage rule requiring Continuity Reviews to inherit and match the Story's canon identity.
4. **Later cleanup — not an M7 blocker:** Two non-canonical test/legacy workflows remain:
   - `Milo Concept Generator v0.1 - M6.5 TEST OLD` — `AKKJLo6NoCOxbHD8`
   - `Milo Outline Approval v0.1 - M6.5 TEST OLD` — `UdeGbGGWIS7nR4Kk`

   Their later retirement or cleanup requires separate production authority.
5. **Accepted as designed — not an M7 blocker:** Existing M6.5 evidence and current resolved credential references are sufficient for pre-M7 assessment. No additional live execution is required before M7; future M7 credential paths remain subject to separately authorised implementation testing.
6. **Technical M7 blocker — remediation required:** Live and repository workflow configuration shows runtime GitHub canon retrieval has no `Reference` parameter and therefore uses the moving default branch rather than the Story's stored immutable `canonRef`. This conflicts with D-008, D-009, and D-010.

---

## 9. Next Authorised Action

Create and authorise a separate pre-M7 technical-remediation work package for:

1. Continuity Review canon lineage; and
2. immutable runtime GitHub canon retrieval using the stored Story `canonRef`.

M7 remains NOT STARTED and unauthorised until both technical blockers are remediated and verified or explicitly superseded by an authorised governance decision.

---

**End of Current Operational State**
