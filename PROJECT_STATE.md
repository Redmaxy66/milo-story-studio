# PROJECT_STATE.md
## Milo Story Studio — Current Operational State

**Status date:** 2026-09-04
**State basis:** Repository evidence, complete applicable M7 validation and acceptance evidence, approved external `MILO_M8_DESIGN_APPROVAL_PACKAGE.md` revision 1.1, completed M8 Phase 1 governance installation, passing M8 Phase 2 contracts, completed M8 Phase 3 preparation and approvals, reconciled isolated OpenArt A3 proof evidence, reconciled `REFSHEET01` V01/V02 route evidence, and reconciled OpenArt Character Library Stage A deferral
**Authority for this baseline:** A2 — M8 Character Library Preflight Reconciliation and Deferral

---

## 1. Current Milestone

**M8 — Complete Studio — PHASE 3 COMPLETE; REFSHEET01 ROUTE EVIDENCE RECONCILED; CHARACTER LIBRARY DEFERRED WITHOUT BLOCK**

---

## 2. Current Status

**M8 DESIGN REVISION 1.1 APPROVED; PHASE 3 COMPLETE; CHECKSUM-BOUND IMAGE CONDITIONING RETAINED; CHARACTER LIBRARY DEFERRED WITHOUT BLOCK**

The approved M8 design baseline is `MILO_M8_DESIGN_APPROVAL_PACKAGE.md` revision 1.1, SHA-256 `6934b997f79e3d5aa7ff5b9405926abb8c9e401a1a539a31e16b1c32dac0d8a2`. Decision D-016 records M8-D01 through M8-D13 and the four incorporated amendments.

Installation of the M8 work order remains governance-only. M8 Phase 2 was executed under its own explicit A2 instruction and authorises no later phase or A3 activity. Every later phase requires a separate explicit instruction.

M6.5 implementation, production identity cutover, and pre-M7 technical remediation are complete. The M7 Production Package design passed its approval gate, decision D-013 records the resulting immutable blueprint / child-scene / separate realised-provenance architecture, and the Phase 2 repository implementation is present.

The consolidated M7 offline suite passes `63 / 63`. The shared failure-instrumentation suite also passes. The approved M7 prompt, authoritative schema, immutable prompt/canon references, 47-node / 57-edge topology, failure architecture and append retry prohibition remain intact.

Controlled executions through `#411` created and repaired exactly one immutable package `MILO-007-S01-P01` with eight scenes, then advanced `MILO-007` to `PRODUCTION_PACKAGE_GENERATED`. Executions `#412`, `#414`, and `#430` exposed repeat/no-op and live Switch serialization defects without generation, package persistence, Story rewrite, or unsafe failure handling. Those defects were remediated through the certified repository implementation and the narrowly scoped canonical rule correction.

The certified repository export was first proven in temporary workflow `xuzK7QTsVvVLPkQ0` against isolated Story Vault `1Vi9ZESiJUAFLaLjHMQRtcaugMRAH2mpfHlj2DWOneDI`. Executions `#416`–`#419` passed `GENERATE`, `NOOP_COMPLETE`, `HEADER_REPAIR`, and `STATUS_REPAIR`; executions `#420`, `#422`, `#424`, `#426`, and `#428` proved deterministic safe handling of duplicate scenes, missing scenes, duplicate headers, canon mismatch, and malformed header state. Canonical workflow `SNnLunczq5mxrXLn` was then reconciled without identity or topology replacement. Execution `#432` passed terminal `NOOP_COMPLETE` on Switch output 3 with zero writes, zero FailureLog events, and no M8 action. Decision D-015 remains non-blocking post-M7 hardening debt.

---

## 3. Current M8 Phase

**PHASE 3 — COMPLETE; AP01–AP06 APPROVED WITH CONDITIONS; REFSHEET01 V01/V02 EVIDENCE RECONCILED**

The approved replacement `WORK_ORDER.md`, decisions D-016 through D-019, and Phase 2 repository foundations remain installed. The project owner approved AP01–AP06 with explicit conditions, closing the repository-only Phase 3 package. The isolated OpenArt A3 proof passed with notes and established OAuth authentication, MCP capability discovery, read-only account access, bounded generation, asynchronous `PENDING` handling and exact cost reconciliation. Subsequent separately authorised operations produced `REFSHEET01` V01 and V02: V01 was rejected for wrong character identity, while image-conditioned V02 preserved Milo's broad non-human identity and proves the route only, with material specification limitations.

D-017's governance ceilings remain limits rather than spend authority. D-018 records the V01 rejection, approves the checksum-bound non-generative crop at SHA-256 `3d9e94da9114d9b907216a1e1d63ac1c1b19757ab8c2865678c0b64809c12fe2` as the authoritative non-canon episode identity input, and accepts V02 only as image-conditioning route evidence. D-019 defers the Character Library route without a current M8 block because non-human support, bounded cost, private visibility, automatic outputs and stable automation were not sufficiently demonstrated; the proven checksum-bound `visualReferences` route remains the current approved integration direction. `REFSHEET01` expenditure totals 30 credits with zero automatic retries and a current known balance of 3,418 credits. No further `REFSHEET01` revision, `REFSHEET02`–`REFSHEET05`, Character Library creation or Phase 4 work is authorised.

---

## 4. Completed

### Repository-verified

- Sanitized OpenArt A3 evidence is installed under `06-testing/evidence/m8/openart/`. The evidence report SHA-256 is `2e27bbf769ded0c16bfe1e554e4659d9257d4390b06f1a70ab70e503e4774254`; the sanitized JSON SHA-256 is `053b99185265149ce3a4f3807bfbafd5f219c4e90e3bf4206b6f29a632a737b4`.
- Decision D-017 accepts the OpenArt MCP route as technically proven for M8, records mandatory read-only status retrieval for initial `PENDING` responses, retains earlier OAuth/browser failures as non-blocking evidence, and establishes conditional reference-generation planning ceilings without granting spend authority.
- `REFSHEET01` V01/V02 evidence is installed under `06-testing/evidence/m8/openart/`. V01 is rejected at SHA-256 `8463309495991a2f6b9cec76a922a5e526f6a504b83c92e12497420bbb778e37`; V02 is route-evidence-only at SHA-256 `5663bd8fc42fca2a3cd4ddeef88565063a087b63edb93638d913766dbfc46d83`.
- Decision D-018 approves the exact 1056×408 identity-anchor bytes at SHA-256 `3d9e94da9114d9b907216a1e1d63ac1c1b19757ab8c2865678c0b64809c12fe2` as the authoritative non-canon episode identity input and records the limited V02 disposition.
- Decision D-019 records Character Library as `DEFERRED_WITHOUT_CURRENT_M8_BLOCK`, preserves checksum-bound image conditioning as the current direction and grants no upload, creation or spend authority. The prepared 220×282 pilot crop at SHA-256 `cdb0b32371b4848eb7ec076b72b83f4e9bfaf0eaca3f86e1b9a3293eb4f5d049` remains non-uploaded evidence only; its binary is not stored in Git.

- The approved M7 snapshot is copied byte-identically at SHA-256 `c1221fe13d7278912b73572658dc569756de4baa98679b7e3567bd3768d98233` with one header and eight exact ordered scenes.
- The Phase 3 package contains reference governance, eight Film Director briefs, 24 stable shots, 32 text storyboard panels, a renderer-neutral 5,760-frame plan and 24 provider-neutral prompts.
- All three required specialist instruction sets were read in full and used without changing protected M7 story meaning, dialogue, scene order, characterisation, identity or canon lineage.
- AP01–AP06 record schema-valid `APPROVED` decisions by Alex with explicit conditions; the records remain repository evidence rather than live Story Vault approvals.
- AP05 has one authoritative narration binding, non-overlapping shot allocation and cue windows, complete voice dependencies, deterministic action order, separated audio/production-note semantics, and approval bound to content hash `61738427c0f063c29f84595578e8e09006a49677ae0d30e43689581a06bf234c`.
- AP06 binds future reference specification IDs, separates episode-reference matching from canon, preserves null provider configuration and non-callable `DRAFT_NOT_AUTHORIZED` prompts, marks duration mapping unresolved pending A3 evidence, and has approval bound to content hash `39aad2f785cd8a90e6f45f5c7e5a34b9f5b2d8333dcfc3046df099d613016dba`.
- The reference proposal specifies five sheets, five initial operations and at most five separately approved revisions. All estimates and caps are null, `UNSET_BLOCKING_GENERATION`, because current `TEXT_TO_IMAGE` unit-cost evidence is insufficient.
- Phase 3 itself created no reference image, storyboard image, production media, renderer adapter, live approval or provider configuration. Later A3 reference candidates remain external, checksum-bound evidence and have not been promoted to the approved reference pack or durable production storage.
- Final Phase 3 validation passes `120 / 120`; all Phase 2 and applicable M3–M7 regressions pass, and M7 remains `63 / 63`.

- The M8 replacement `WORK_ORDER.md` is installed as governance-only and explicitly grants no implementation authority.
- Decision D-016 records approval of M8-D01 through M8-D13 and all four amendments.
- The approved M8 design baseline is revision 1.1 with SHA-256 `6934b997f79e3d5aa7ff5b9405926abb8c9e401a1a539a31e16b1c32dac0d8a2`.
- The approved design artifact was verified read-only outside the repository and was not added to the repository.
- All 12 provider-neutral M8 contract schemas and validators are present with separate requested/actual settings, exact M7/Story/canon lineage, immutable approval binding, and provider-neutral core fields.
- Lifecycle, controlled-value, M8 error-code, canonical JSON, content-hash, and deterministic idempotency definitions are present.
- The OpenArt adapter interface contains no network, credential, endpoint, or live-target implementation. Recorded fixtures are sanitized and labelled historical/non-callable; synthetic and general fixtures use inert identifiers.
- The proposed Story Vault specification defines 12 authoritative contract tabs plus derived, read-only, non-authoritative `StudioControl`. It creates no `M8Errors` store and preserves the existing shared 18-column `FailureLog` unchanged.
- Thirteen workflow skeleton exports are inactive, empty-node, and contain no credentials, active triggers, live targets, endpoints, pins, or executable configuration.
- The M8 Phase 2 validators pass at `36 / 36`, `93 / 93`, `19 / 19`, `29 / 29`, `33 / 33`, `14 / 14`, and `9 / 9` aggregate. The complete applicable M3–M7 regression collection remains green, including M7 at `63 / 63`.
- M6 Continuity Agent is recorded complete.
- M6.5 failure-instrumentation contracts and implementation artifacts are committed.
- `Milo Failure Handler v0.1` exists as a repository workflow export.
- Nine source workflow exports contain a terminal `Call Failure Handler` node.
- The handler export contains handled and unhandled entry paths, normalization, and `FailureLog` append architecture.
- The handler targets the `FailureLog` tab in the Milo Story Vault and is designed not to mutate Story or artifact lifecycle state.
- The 18-column `FailureLog` contract, deterministic failure IDs, handled/unhandled classification, retry policy, and operational error-code register are documented.
- Offline repository tests record passing failure-contract, routing, lifecycle-isolation, repair-path, Boolean-normalization, and pin-hygiene checks.
- Repository workflow exports and specifications now encode deterministic Story canon-lineage gates, Story `canonRef` GitHub References, downstream canon-lineage persistence, and the additive Continuity Review fields.
- `06-testing/validate_canon_lineage.mjs` proves valid lineage acceptance, blank/malformed lineage rejection, downstream mismatch rejection, immutable GitHub Reference expressions, Continuity dual-read coherence, and Continuity Review persistence mappings without executing production data paths.
- The approved M7 Production Package specification, structured-output schema, prompt, workflow export, lifecycle extension, error codes, test cases, and validation evidence are present.
- `06-testing/validate_production_package.mjs` passes `63 / 63`, including full execution-mode/reference/router/persistence/recovery/failure lint and ten-state deterministic route simulation.
- `06-testing/validate_failure_instrumentation.mjs` passes against the governed 44-node / 55-connection Concept Generator topology introduced by D-014.
- `06-testing/M7_ISOLATED_ACCEPTANCE.md` records successful isolated execution of every major M7 action and five representative controlled-failure states.
- `06-testing/M7_CANONICAL_INSTALLATION_A3.md` contains the exact separately gated surgical canonical installation and final zero-write verification package.
- `06-testing/M7_CANONICAL_VERIFICATION.md` records execution `#432`, exact terminal Switch output, zero-write proof, persistent before/after invariants, repository/live parity, and final M7 completion evidence.
- The complete applicable offline validation collection passes after Phase 7 reconciliation; `validate_production_package.mjs` remains `63 / 63` and shared failure instrumentation remains green.
- Relevant M6.5 repository commits include `628d57daf64e993dc15e441cb973065133d76d9a`, `102ff8f6ba512b96f9e99362ad1a613297c1854f`, `2719ef8dd48b994ae2bcb2575a30cf07942672f9`, and `08ce6104e550df83867270f69726383d19671c3f`.

### Live-state verified

- `FailureLog` exists in the Milo Story Vault with exactly this 18-column schema, in order: `failureId`, `occurredAt`, `workflowName`, `workflowId`, `executionId`, `sourceType`, `storyId`, `conceptId`, `outlineId`, `scriptId`, `reviewId`, `errorCode`, `message`, `nodeName`, `nodeType`, `attempt`, `rawError`, `status`.
- The shared workflow is `Milo Failure Handler v0.1`, workflow ID `3an2myLOF7o4STK8`.
- The shared Failure Handler contains handled and unhandled entry paths, normalization, and `FailureLog` append architecture.
- Its Google Sheets credential and `Milo Story Vault` → `FailureLog` target resolve.
- No unexpected pins or visible warnings were observed on the shared Failure Handler.
- The shared Failure Handler's current live state is **Published**.
- All ten canonical stage workflows exist with the verified identities listed below.
- Each of the nine pre-M7 canonical workflows has a matching `- PRE-M6.5 ROLLBACK` workflow; the additive M7 workflow retains its repository/installation rollback position.
- All ten canonical stage workflows are **Unpublished**.
- All ten reference the shared Failure Handler through both their terminal `Call Failure Handler` node and Error Workflow setting.
- Relevant Google Sheets, OpenAI, and GitHub credential references resolve.
- Story Vault targets resolve to the correct workbook and relevant tabs.
- No unexpected pins, visible warnings, workflow-ID collision, or canonical-name collision was observed on the ten canonical stage workflows.
- The live `Continuity Reviews` schema now appends `canonVersion` and `canonRef` after the original 15 fields. Existing fields, records, and field order were preserved; the historical `MILO-001-S01-R01` row was not backfilled or rewritten.
- The canonical Concept Generator, Outline Generator, Script Generator, and Continuity Reviewer now reject blank or malformed authoritative Story lineage before any GitHub canon/rules read.
- Outline, Script, and Continuity workflows reject downstream/Story canon-lineage mismatches through controlled `CANON_LINEAGE_MISMATCH` handling.
- All five affected live GitHub file nodes now set `Reference` from the authoritative Story `canonRef`; both Continuity Reviewer reads use the same Story reference.
- New Concept, Outline, Script, and Continuity Review records are configured to persist the authoritative Story `canonVersion` and `canonRef`.
- Re-exported live workflow definitions match the repository exports, excluding only volatile workflow revision metadata.
- Continuity Reviewer execution `#404` created exactly one Review, `MILO-007-S01-R01`, with assessment `PASS`, no findings, and matching Story canon lineage; the Story advanced to `CONTINUITY_REVIEWED` and stopped at the human gate.
- After explicit human approval, Continuity Approval execution `#405` processed exactly that Review, stamped `reviewProcessedAt=2026-09-01T18:11:09.021+08:00`, and advanced `MILO-007` to `CONTINUITY_APPROVED`.
- `MILO-007`, `MILO-007-S01`, and `MILO-007-S01-R01` all retain `canonVersion=canon-v1.0` and `canonRef=977755913d9ad41e4f16392d01ea993507af4102`.
- No duplicate Review, FailureLog event, Production Package record, Production Package tab, unrelated lifecycle write, or PRE-CANON LEGACY mutation resulted from executions `#404` or `#405`.
- The canonical M7 workflow is `SNnLunczq5mxrXLn`; its saved live definition remains inactive/unpublished with 47 nodes, 57 edges, zero pins, the governed shared Error Workflow, preserved credentials/targets, all 15 governed Code modes, seven Execute Once reads, authoritative parser schema, and disabled append retry.
- All four saved `Route M7 Action` left operands equal `={{ $json.action }}`. Outputs remain 0 `GENERATE`, 1 `STATUS_REPAIR`, 2 `HEADER_REPAIR`, 3 terminal `NOOP_COMPLETE`, and 4 governed fallback to `Prepare M7 Failure`.
- The normalized verified live definition is equivalent to `04-n8n-workflows/development/Milo Production Package Generator v0.1.json`, excluding only legitimate volatile n8n metadata. The repository export required no content change during Phase 7.
- Story Vault contains exactly one header `MILO-007-S01-P01` and exactly eight uniquely numbered scene rows with package version 1, INITIAL generation mode, complete provenance and matching canon lineage.
- `MILO-007` is `PRODUCTION_PACKAGE_GENERATED`; its lifecycle timestamp was not rewritten by repeat checks.
- Execution `#430` safely exposed malformed serialization across the live Switch operands after the broader certified installation. The four operands were corrected without changing any connection, Code body, execution mode, credential, target, retry control, workflow identity, or publication state.
- Execution `#431` was a harmless partial node-execution snapshot that stopped at `Resolve M7 Action`, did not reach the Switch, and caused no governed mutation.
- Controlled canonical execution `#432` returned `NOOP_COMPLETE`, emitted one item on Switch output 3, terminated successfully, and did not execute generation, either append, Story update, failure preparation, or the shared Failure Handler.
- Before and after execution `#432`, the package remained one header and eight scenes, Story status/timestamp and canon/prompt provenance were unchanged, and FailureLog remained at 18 rows with execution `#414` latest.
- Temporary workflow `xuzK7QTsVvVLPkQ0` and temporary Failure Handler `dOf14ytcmYkIa5rj` remain inactive/unpublished and quarantined against isolated Story Vault `1Vi9ZESiJUAFLaLjHMQRtcaugMRAH2mpfHlj2DWOneDI` as audit evidence.
- Isolated executions `#416`–`#419` passed the `GENERATE`, `NOOP_COMPLETE`, `HEADER_REPAIR`, and `STATUS_REPAIR` routes with exact expected persistence and lifecycle effects.
- Isolated executions `#420`, `#422`, `#424`, `#426`, and `#428` each produced one correct handled error code/message/execution context and zero unsafe package, scene, or lifecycle writes.
- The optional-identifier `"undefined"` normalization observation is classified by D-015 as non-blocking post-M7 hardening debt.
- No M8 live-system action has occurred; Phase 2 implementation is repository-only.

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
| `Milo Production Package Generator v0.1` | `SNnLunczq5mxrXLn` |

---

## 5. Canon State

### Repository-verified

- Current canon version: `canon-v1.0`
- Immutable canon reference: `977755913d9ad41e4f16392d01ea993507af4102`
- The annotated Git tag `canon-v1.0` resolves to that commit.
- Post-remediation GitHub verification confirms the annotated tag still resolves to that commit, and both runtime canon files remain retrievable directly at that immutable SHA.
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

- Production identity cutover is complete for the nine pre-M7 canonical workflows, and the additive canonical M7 workflow is installed and verified.
- Canonical production names identify the hardened implementations.
- The nine pre-M6.5 implementations remain available as named rollback copies.
- All ten canonical stage workflows are Unpublished.
- The shared Failure Handler is Published. Decision D-011 accepts this as an explicit handler-specific operational exception; publication is not technically required and does not authorise publication of any other Milo production workflow.
- The shared Failure Handler and `FailureLog` architecture are live and resolved.
- No workflow or production data path was executed during governance verification.
- Controlled M7 executions `#406`, `#407`, `#409`, `#411`, `#412`, `#414`, `#430`, and `#432` occurred only under separate A3 packages. The final durable result is one coherent package and eight scenes; failed/repeat executions did not duplicate production data. Execution `#431` was a non-mutating partial resolver snapshot.
- The A2 Phase 7 package used repository, saved-definition, Story Vault, FailureLog, and execution evidence plus deterministic offline validation. It made no n8n, Story Vault, FailureLog, canon, publication, activation, or workflow-execution change.
- The A2 M8 Phase 1 package changed governance documentation only. It made no n8n, Story Vault, FailureLog, canon, credential, OpenArt, Google Drive durable-store, generation, assembly, activation, execution, deployment, or publication change.
- The A2 M8 Phase 2 package changed only authorised repository files and accessed no external operational system other than the authorised GitHub repository. It made no n8n, Story Vault, Google Sheets, Google Drive, FailureLog, canon, credential, OpenArt, media, assembly, activation, execution, deployment, or publication change.
- The A2 M8 Phase 3 packages changed only authorised repository artifacts and approval/governance evidence. Phase 3 is closed with AP01–AP06 approved with conditions; no n8n, Story Vault, Google Sheets, Google Drive, FailureLog, canon, credential, OpenArt, media, assembly, activation, execution, deployment, or publication change occurred, and zero credits were spent.
- The later isolated OpenArt A3 proof used workflow `EL5LzYxiIUeOK2nf`. Read-only execution `#434` and paid execution `#435` succeeded; the latter submitted exactly one neutral non-Milo Seedream 5 Lite `text2image` request, returned one 2848×1600 PNG after an initial `PENDING` state, and charged exactly 15 credits (`3,463 -> 3,448`) with zero retries. The workflow remained inactive, unpublished and unpinned. No production workflow, Story Vault, Google Drive, canon, approved reference pack, or repository mutation occurred during the proof.
- Separately authorised `REFSHEET01` V01 used one 15-credit generation and was rejected for `WRONG_CHARACTER_IDENTITY`. V02 used the approved identity anchor with `byte-plus-seedream-4-5` / `image2image`, one 15-credit generation, and zero retries; it returned one 2848×1600 JPEG at SHA-256 `5663bd8fc42fca2a3cd4ddeef88565063a087b63edb93638d913766dbfc46d83`. The current known balance is 3,418 credits. No candidate was promoted, no other sheet was generated, and no Story Vault, Google Drive, canon or production workflow mutation occurred.

---

## 7. Protected State

- Do not move, recreate, or retarget `canon-v1.0`.
- Do not execute the canonical M7 workflow again without separate explicit production authority.
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
- Preserve decision D-016 and the approved M8 revision 1.1 design baseline.
- Preserve decision D-017 and its distinction between governance ceilings and spend authority.
- Preserve decision D-018, the V01 rejection, V02's route-evidence-only limitation and the authoritative anchor checksum.
- Preserve decision D-019, the Character Library deferral and the authoritative role of Milo Story Studio's checksum-bound reference records.
- Do not begin M8 Phase 4 or any later phase without a separate explicit instruction.
- Do not execute another `REFSHEET01` revision, `REFSHEET02`–`REFSHEET05`, a Character Library pilot or any other provider operation without separate explicit authority and fresh bounded-cost preflight.

---

## 8. Governance Dispositions and Residual Non-Blocking Notes

The governed upstream lineage and M7 completion evidence remain unchanged. M8 design revision 1.1 and its Phase 1 governance baseline are installed. Phase 2 repository contracts and Phase 3 reference/production-intent preparation are complete. The isolated OpenArt A3 proof and `REFSHEET01` V01/V02 evidence are reconciled. V02 proves image-conditioned identity preservation only. Character Library creation is deferred without blocking M8, and checksum-bound direct image conditioning remains the current approved integration direction; the final sheet, all further generation and Phase 4 remain separately gated and unauthorised.

1. **Governed — not an M7 blocker:** `Milo Failure Handler v0.1` is currently **Published**. Decision D-011 accepts this as an explicitly approved handler-specific operational exception. Publication is not technically required, does not create general permission to publish other Milo workflows, and may be changed only through a separately authorised production action.
2. **Governed — not an M7 blocker:** Five Stories (`MILO-002` through `MILO-006`), fourteen Concepts, and two Outlines (`MILO-002-O01` and `MILO-003-O01`) have blank `canonVersion` and `canonRef`. Decision D-012 classifies them as PRE-CANON LEGACY records. Blank lineage is not any canon release, and these lineages are ineligible for M7 or later production unless a separately authorised migration establishes valid provenance for the complete Story lineage without fabrication.
3. **Remediated and verified — not an M7 blocker:** The live `Continuity Reviews` schema appends `canonVersion` and `canonRef`. The canonical Continuity Reviewer validates authoritative Story lineage, rejects Script/Story mismatch deterministically, and persists matching lineage for new review records. The existing historical review row remains unchanged and unbackfilled.
4. **Later cleanup — not an M7 blocker:** Two non-canonical test/legacy workflows remain:
   - `Milo Concept Generator v0.1 - M6.5 TEST OLD` — `AKKJLo6NoCOxbHD8`
   - `Milo Outline Approval v0.1 - M6.5 TEST OLD` — `UdeGbGGWIS7nR4Kk`

   Their later retirement or cleanup requires separate production authority.
5. **Accepted as designed — not an M7 blocker:** Existing M6.5 evidence and current resolved credential references are sufficient for pre-M7 assessment. No additional live execution is required before M7; future M7 credential paths remain subject to separately authorised implementation testing.
6. **Remediated and verified — not an M7 blocker:** All affected live and repository GitHub canon/rules nodes use the validated authoritative Story `canonRef` as `Reference`. Blank/malformed Story lineage and downstream mismatch fail deterministically before retrieval. The moving default branch no longer controls these runtime reads.
7. **Accepted technical debt — not an M7 blocker:** The shared Failure Handler may render absent optional identifiers such as `conceptId`, `outlineId`, `scriptId`, and `reviewId` as the literal string `"undefined"` instead of blank. Decision D-015 records this as post-M7 hardening. Isolated acceptance proved correct single-event recording, error code/message/execution context, zero-write safety, and lifecycle isolation in every tested failure state.

---

## 9. Next Required Gate

**M8 PHASE 3 COMPLETE; REFSHEET01 ROUTE EVIDENCE RECONCILED; CHARACTER LIBRARY DEFERRED WITHOUT BLOCK; FINAL REFSHEET NOT AUTHORISED.**

Before the next relevant production gate, distinct three-quarter identity coverage and any anatomical or proportional drift must be resolved against the authoritative anchor, and durable checksum-bound storage and provenance must be established. Direct checksum-bound `visualReferences` remain the current approved provider-integration direction. Character Library may be reconsidered only after live evidence demonstrates non-human support, exact bounded cost, private/unpublished storage, automatic-output behaviour, stable identity/lifecycle controls and an acceptable selection route. Cosmetic typography and layout defects are parkable and do not justify another paid request; future sheets should preferably use clean unlabeled views with deterministic non-generative labels and markers added later.

The approved planning ceilings do not constitute spend authority. Phase 4 has not begun. This state record does not authorise n8n modification or execution, Story Vault changes, OpenArt access, credential changes, paid generation, Character Library creation, durable-media writes, assembly execution, activation, publication, canon changes, D-015 remediation, or legacy/test-workflow cleanup.

---

**End of Current Operational State**
