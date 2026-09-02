# WORK_ORDER.md
## Milo Story Studio — M7 Production Package

**Status:** Complete — Phase 7 repository/state reconciliation completed after successful canonical verification; D-015 remains a non-blocking post-M7 note
**Project:** `Redmaxy66/milo-story-studio`  
**Milestone:** M7 — Production Package  
**Baseline repository HEAD:** `ee12b3ae0fbe568ee9d25b773681582ac81734fd`  
**Activation:** Approved and completed. Phase 1 design approval, Phase 2–3 repository implementation/validation, isolated Phase 5 acceptance, canonical installation, Phase 6 verification, and Phase 7 reconciliation all passed under their respective authorities. M8 remains separately gated and unauthorised.

---

## 1. Objective

Design, implement, validate, and reconcile M7 — Production Package.

M7 must convert an eligible, continuity-approved Milo script into a controlled, versioned Production Package containing the production-preparation information required by the approved repository roadmap:

- structured scene breakdown;
- scene descriptions;
- visual-production prompts;
- voice-performance guidance;
- animation / motion guidance;
- required production metadata;
- canon and upstream-artifact provenance;
- asset-provenance / external-asset-link structure where applicable; and
- persistent, versioned Production Package records.

M7 must preserve the approved Story canon lineage and human approval architecture.

M7 does not itself authorise publishing, M8 implementation, canon changes, PRE-CANON LEGACY migration, unrelated remediation, or unspecified external media-generation integrations.

Because no approved dedicated M7 Production Package specification or schema exists at the M7 entry baseline, the first implementation phase must define and approve those contracts before workflow implementation proceeds.

---

## 2. Governing Sources

Apply the operating hierarchy established by `AGENTS.md` and the Milo governance mapping.

For this work package, governing sources include:

1. this approved `WORK_ORDER.md`;
2. active decisions in `DECISION_LOG.md`;
3. `PROJECT_STATE.md`;
4. `MILO_PROJECT.md`;
5. `SOFTWARE_PROJECT.md`;
6. `AGENTS.md`;
7. approved repository specifications and lifecycle contracts;
8. `MILESTONES.md`;
9. `PROJECT_ROADMAP.md`;
10. `README.md`;
11. relevant workflow exports, schemas, prompts, tests, production-preparation material, and repository evidence.

Specifications and active decisions win over inferred implementation preference.

If authoritative sources materially conflict, stop the affected branch and report the conflict rather than choosing silently.

---

## 3. Authority

M7 uses staged authority.

### Phase A — A2: Controlled Execute

A2 is sufficient for:

- M7 specification design;
- schema design;
- lifecycle-model design;
- prompt and structured-output contract development;
- repository code or validation tooling required by M7;
- preparation and modification of M7 workflow exports;
- offline and non-production deterministic testing;
- repository documentation updates; and
- other reversible repository-scoped M7 implementation.

A2 implementation authority does not remove the M7 Design Approval Gate defined in Section 8. Approval of this work order authorises Phase 1 design work only. It does not constitute approval of the Production Package product, schema, lifecycle, workflow, or versioning design produced during Phase 1.

Phase 2 repository/specification implementation may begin only after the user explicitly approves the Phase 1 M7 Production Package design.

A2 does **not** authorise:

- live n8n production mutation;
- Story Vault production schema mutation;
- production workflow execution;
- production data-path testing;
- workflow activation/publication changes; or
- other live-system mutation.

### Phase B — A3: Production Execute

A separate explicit A3 authority gate is required before any M7 action that:

- creates or changes live n8n workflows;
- creates or changes Story Vault tabs, fields, or live schema;
- configures production credentials or production targets;
- executes a controlled production test;
- writes M7 records into the live Story Vault; or
- otherwise changes production state.

A3 authority is limited to the M7 changes explicitly approved by this work order.

It does not authorise unrelated production changes.

If the entire M7 package is authorised in one instruction, the minimum authority ceiling is **A3**, but production authority must not be exercised until the A2 design, implementation, and non-production validation phases have passed.

---

## 4. Entry Conditions

Before M7 implementation begins, verify that all of the following remain true:

- repository is `Redmaxy66/milo-story-studio`;
- target branch is `main`;
- repository baseline is known and inspected;
- M6 is complete;
- M6.5 and pre-M7 technical remediation are complete;
- no recorded technical M7 blocker remains;
- M7 is not already partially implemented outside the repository baseline without being reconciled;
- the canonical production workflow identities remain as recorded in `PROJECT_STATE.md`;
- the existing `- PRE-M6.5 ROLLBACK` workflows remain available;
- `Milo Failure Handler v0.1` and the 18-column `FailureLog` architecture remain intact;
- Story canon lineage remains authoritative through `Stories.canonVersion` and `Stories.canonRef`;
- `canon-v1.0` still resolves to the approved immutable commit;
- runtime canon retrieval remains controlled by the stored authoritative Story `canonRef`;
- Continuity Reviews persist `canonVersion` and `canonRef`;
- M7 eligibility can be based on a Story in `CONTINUITY_APPROVED`;
- the corresponding Script is approved and processed;
- the applicable Continuity Review is valid and human-approved;
- PRE-CANON LEGACY records remain excluded;
- required credentials and targets can be identified before live mutation; and
- no unexpected repository or live-state condition invalidates the baseline.

If any required entry condition fails materially, stop the affected M7 branch.

---

## 5. In Scope

### 5.1 M7 Production Package specification

Create an approved M7 specification defining at minimum:

- Production Package purpose;
- eligibility;
- identifiers;
- package versioning;
- scene structure;
- required scene fields;
- visual-production guidance fields;
- voice-performance guidance fields;
- animation / motion guidance fields;
- production metadata;
- upstream artifact references;
- canon lineage fields;
- asset-provenance / external-asset-link model;
- deterministic validation rules;
- duplicate protection;
- regeneration/versioning behaviour;
- Story lifecycle transitions;
- persistent-storage contract;
- error conditions;
- failure-routing requirements;
- retry rules;
- completion criteria.

The specification must distinguish deterministic workflow responsibility from AI creative responsibility.

### 5.2 Production Package structured-output contract

Define the AI/output schema required to produce a deterministic Production Package.

The contract must be sufficiently strict for n8n to validate:

- identifiers;
- package version;
- ordered scenes;
- required scene content;
- required visual guidance;
- required voice guidance;
- required animation/motion guidance;
- required metadata;
- lineage/provenance;
- arrays and object structures;
- allowed values where controlled vocabularies are appropriate.

Malformed or incomplete AI output must not be persisted or advance Story lifecycle state.

### 5.3 Story Vault Production Package storage

Design and, once separately authorised for production, implement the minimum persistent M7 storage required for versioned Production Packages.

The design must:

- preserve existing Story Vault tabs and fields;
- use additive schema change where required;
- retain upstream Story, Concept, Outline, Script, and Continuity Review identity;
- persist authoritative `canonVersion` and `canonRef`;
- support package versioning;
- support deterministic duplicate protection;
- preserve `createdAt` / `updatedAt` semantics;
- store asset provenance or external asset references without storing credentials or confidential tokens.

### 5.4 M7 lifecycle states

Design the smallest required M7 Story lifecycle extension.

M7 states must not be added merely for convenience.

Lifecycle design must define:

- M7 entry state;
- state after successful Production Package creation;
- any human-review or approval state genuinely required by the approved M7 design;
- any regeneration/revision route required by the package contract; and
- the boundary into M8.

Operational error codes must remain separate from Story lifecycle states.

### 5.5 Production Package workflow

Implement the minimum n8n workflow architecture required to create the M7 Production Package.

At minimum, the workflow must:

- select an eligible Story;
- require `CONTINUITY_APPROVED`;
- read the authoritative Story record;
- read the approved Script;
- read the applicable approved Continuity Review where required by the M7 contract;
- validate identifiers and cross-artifact relationships;
- validate canon lineage before canon retrieval;
- reject PRE-CANON LEGACY records;
- prevent duplicate package creation for the same eligible package/version condition;
- load required canon or visual/voice reference material using the authoritative Story `canonRef`;
- prepare structured AI input;
- generate the package;
- validate structured output deterministically;
- persist the package;
- update Story lifecycle state only after the package write succeeds;
- use an explicit repair path if a multi-write transition partially succeeds;
- route handled failures through the shared Failure Handler; and
- preserve unhandled Error Workflow routing.

Whether M7 requires one workflow or separate generation/approval workflows must be decided in the approved M7 specification based on actual human-approval requirements. Workflow separation must follow the established principle that generation, approval, review, and lifecycle mutation responsibilities should not be silently conflated.

### 5.6 M7 prompts and production guidance

Create only the prompts necessary for M7 Production Package generation.

Prompts must be grounded in:

- the approved Script;
- approved Continuity disposition;
- Story metadata where relevant;
- Milo canon;
- voice guidance;
- visual reference material;
- applicable continuity rules; and
- the Story's immutable canon lineage.

Prompts must not silently add new canon.

### 5.7 M7 operational error codes

Define only M7-specific error codes actually required by implemented failure conditions.

New operational error codes must be added to the operational error-code register.

They must remain separate from Story lifecycle states.

### 5.8 M7 tests and validation tooling

Add M7-specific repository tests and deterministic validation tooling sufficient to prove the required contracts before live execution.

### 5.9 Repository and project-state reconciliation

After successful M7 implementation and verification:

- export final M7 workflow definitions;
- reconcile repository exports against live configuration;
- update applicable specifications;
- update tests and test evidence;
- update `STORY_STATUS_MODEL.md`;
- update the operational error-code register where applicable;
- update `MILESTONES.md`;
- update `PROJECT_ROADMAP.md` only where actual resulting state requires it;
- update `README.md`;
- update `PROJECT_STATE.md`;
- update `CHANGELOG.md` or other established evidence files where required; and
- add a decision record only if M7 introduces a genuinely material governance or architectural decision not already governed by existing documents.

Documentation must describe verified resulting state, not intended state.

---

## 6. Out of Scope

The following are explicitly outside M7 unless a new authorised work order changes scope:

- M8 implementation;
- YouTube publishing package;
- Instagram publishing package;
- public publishing;
- publishing approval-state implementation belonging to M8;
- final end-to-end studio hardening belonging to M8;
- PRE-CANON LEGACY migration, backfill, archival, or deletion;
- cleanup, retirement, deletion, archival, or renaming of old M6.5 test workflows;
- retirement of `- PRE-M6.5 ROLLBACK` workflows;
- changing the publication state of `Milo Failure Handler v0.1`;
- changing publication or activation state of existing production workflows unless a separate explicit instruction requires it;
- canon release creation;
- moving, recreating, retargeting, or replacing `canon-v1.0`;
- changing canon merely to support M7;
- unrelated workflow refactoring;
- unrelated Story Vault/schema changes;
- redesign of M3–M6 workflows except where a demonstrated M7 integration defect requires separately authorised remediation;
- speculative database migration;
- unrelated credential changes;
- actual external image, audio, voice, animation, or video rendering integrations unless an approved M7 specification and explicit authority subsequently establishes them as required M7 scope;
- storage of large media binaries in GitHub; and
- any automatic public publishing.

Unexpected defects outside M7 must be recorded separately and must not silently expand this work package.

---

## 7. Architecture and Dependencies

### 7.1 Upstream Story state

M7 begins from an eligible Story with:

`status = CONTINUITY_APPROVED`

The Story is the authoritative lifecycle and canon-lineage record.

### 7.2 Script dependency

M7 depends on the approved Script associated with the Story.

The Script must:

- have valid identifiers;
- belong to the same Story;
- be the applicable approved version;
- have `approvalStatus = APPROVED`;
- have `approvalProcessedAt` populated;
- contain non-empty valid `scriptText`; and
- carry `canonVersion` and `canonRef` matching the authoritative Story.

### 7.3 Continuity dependency

M7 may proceed only after the continuity process has resulted in approved progression.

The applicable Continuity Review must:

- belong to the same Story and Script;
- have valid identifiers;
- represent the applicable Script version;
- contain a disposition compatible with Story `CONTINUITY_APPROVED`;
- be human-processed where the continuity architecture requires it; and
- carry canon lineage matching the Story.

A FAIL/revision-required lineage must not enter M7.

### 7.4 Canon dependency

The Story remains authoritative for:

- `canonVersion`;
- `canonRef`.

All M7 persisted artifacts must inherit and match those values.

Any runtime GitHub canon, voice, visual, continuity, or other canon-release retrieval required by M7 must use the validated Story `canonRef`, never repository HEAD or another moving branch reference.

### 7.5 Story Vault

M7 depends on:

- `Stories`;
- `Scripts`;
- `Continuity Reviews`;
- the new M7 Production Package storage defined by the approved M7 specification; and
- `FailureLog` for operational failure events.

M7 must not modify unrelated tabs or rows.

### 7.6 Failure handling

All handled M7 failures must use the established local failure-payload architecture and terminal shared Failure Handler call.

Unhandled workflow errors must use the shared Error Workflow architecture.

The shared Failure Handler writes only to `FailureLog`.

### 7.7 Credentials

Potential M7 credential dependencies include only credentials required by the approved implementation, expected to include as applicable:

- Google Sheets;
- OpenAI;
- GitHub.

Credential references must resolve before live testing.

No secret may be copied into repository content.

### 7.8 External creative assets

Large external creative assets, if later attached to Production Packages, must be represented through governed references/links and provenance metadata.

Credentials or confidential access tokens must never be stored with asset links.

---

## 8. Required Sequence

### Phase 1 — Inspect and design

Authority: A2.

1. Reconfirm repository HEAD and project baseline.
2. Re-read governing sources.
3. Inspect relevant upstream workflow exports and live-independent contracts.
4. Define the M7 Production Package specification.
5. Define Production Package identifier/version rules.
6. Define scene and production-guidance schema.
7. Define asset-provenance/link model.
8. Define M7 Story lifecycle states.
9. Define deterministic vs AI responsibilities.
10. Define package duplicate/regeneration behaviour.
11. Define M7 error codes and retry rules.
12. Define M7 storage schema.
13. Check the proposed architecture against D-003 and D-008 through D-012.
14. Prepare the complete proposed M7 Production Package design for user review.
15. Identify within the proposal:
    - decisions already determined by existing governance;
    - genuinely new product or architecture decisions;
    - material alternatives considered;
    - the recommended option for each new material decision; and
    - the rationale for each recommendation.
16. Stop if any material product or architecture decision cannot be resolved sufficiently to present a coherent design proposal.

No live mutation occurs in this phase.

### Mandatory M7 Design Approval Gate

Phase 2 must not begin until the user explicitly approves the M7 Production Package design produced by Phase 1.

Approval of this `WORK_ORDER.md` authorises **Phase 1 design work only**. It does not constitute approval of the resulting M7 product, schema, lifecycle, workflow, storage, or versioning design.

At the end of Phase 1, Work must present the proposed M7 design for explicit user approval before performing any Phase 2 implementation.

The design review must include at minimum:

1. Production Package purpose and boundary.
2. Production Package identifier format.
3. Package versioning model.
4. Persistent Story Vault schema.
5. Scene object/schema.
6. Visual-production guidance structure.
7. Voice-performance guidance structure.
8. Animation/motion guidance structure.
9. Production metadata.
10. Asset provenance / external asset-link model.
11. Story lifecycle states and transitions introduced by M7.
12. Whether M7 requires a human Production Package approval gate.
13. Generation/regeneration/versioning behaviour.
14. Duplicate-protection rules.
15. Deterministic versus AI responsibilities.
16. Upstream eligibility rules.
17. Canon-lineage behaviour.
18. Operational error codes and failure routes.
19. Repair/recovery model for partial writes.
20. Boundary between M7 and M8.

For each material design area, the review must distinguish:

- requirements already fixed by existing governance or approved specifications;
- genuinely new product or architecture decisions;
- material alternatives considered where relevant;
- the recommended option; and
- the rationale for that recommendation.

The user must provide explicit approval of the proposed Phase 1 design. Silence, approval of this work order, completion of Phase 1 analysis, or Work's own recommendation must not be treated as design approval.

If the user requests revisions, remain in Phase 1 / Design Approval Gate until the revised design is explicitly approved.

After explicit design approval, the existing staged authority model applies:

- A2 for Phase 2 repository/specification implementation and Phase 3 non-production validation;
- A3 only for Phase 4 or later live-system mutation and controlled live testing.

### Phase 2 — Repository/specification implementation

Authority: A2.

Entry condition: the Mandatory M7 Design Approval Gate has passed through explicit user approval of the Phase 1 Production Package design.

1. Create approved M7 specification artifacts.
2. Create structured-output schema.
3. Create required M7 prompt material.
4. Implement M7 workflow export(s).
5. Add M7 validation code/tests.
6. Add required lifecycle and error-code definitions.
7. Preserve existing unrelated repository files and architecture.

No production mutation occurs in this phase.

### Phase 3 — Non-production validation

Authority: A2.

Validate repository implementation using deterministic/offline tests before live configuration.

At minimum prove applicable:

- valid eligibility;
- invalid eligibility;
- identifier consistency;
- canon-lineage validation;
- immutable GitHub reference expressions;
- output schema validation;
- duplicate protection;
- failure routing;
- lifecycle isolation;
- write ordering;
- repair-path behaviour;
- no prohibited retry on append operations;
- absence of test pins or temporary fixtures in production exports.

Do not progress to live configuration while required offline tests fail.

### Phase 4 — Controlled live configuration

Authority: A3 required.

Before mutation:

1. inspect current live n8n and Story Vault state;
2. verify canonical workflow identities;
3. verify rollback position;
4. verify target workbook/tabs;
5. verify credentials;
6. verify no conflicting active/published state;
7. verify required schema does not already exist in an incompatible form.

Then perform only the minimum authorised M7 live changes, which may include:

- creation of the M7 Story Vault tab/schema;
- import/configuration of new M7 workflow(s);
- credential binding;
- target binding;
- Error Workflow binding;
- shared Failure Handler binding; and
- other configuration explicitly required by the approved M7 design.

Do not activate or publish unless separately and explicitly authorised.

### Phase 5 — Controlled M7 testing

Authority: A3 required for any production-data-path execution.

Before each live test:

- define the exact test record;
- define expected writes;
- define expected Story-state changes;
- define expected FailureLog effect, if any;
- define duplicate/repeat-execution expectation;
- define cleanup or restoration requirements;
- confirm that the test record is valid for canon lineage and is not PRE-CANON LEGACY.

Execute only the smallest test set necessary to prove M7.

### Phase 6 — Post-change verification

Authority: matching the environment being verified.

After live implementation/testing:

- re-read M7 workflow configuration;
- re-read Production Package records;
- re-read affected Story state;
- verify no duplicate package records;
- verify canon lineage;
- verify failure handling;
- verify credentials and targets;
- verify workflow publication/activation state;
- verify rollback copies remain untouched;
- verify unrelated Story Vault data remains unchanged;
- verify repository/live-state parity.

### Phase 7 — Repository/state reconciliation

Authority: A2 for repository changes.

1. re-export verified M7 workflows;
2. compare live definitions with repository versions;
3. commit only final intended M7 artifacts and documentation when separately authorised;
4. update project-state documentation to actual verified state;
5. record milestone evidence;
6. report completion only if the completion contract passes.

Completion of M7 does not itself authorise M8.

---

## 9. Validation

Tests must be limited to behaviour relevant to M7.

### 9.1 Happy path

Input:

- valid Story;
- `status = CONTINUITY_APPROVED`;
- valid approved Script;
- valid approved Continuity Review;
- valid matching canon lineage;
- no existing conflicting Production Package.

Expected:

- one valid versioned Production Package is produced;
- required scene/visual/voice/animation/metadata fields validate;
- authoritative canon lineage is persisted;
- Story status advances only after successful package persistence;
- no unexpected FailureLog event is created.

### 9.2 Invalid input/state

Test applicable conditions such as:

- Story status not eligible;
- missing Script;
- invalid Script identifiers;
- Script not approved;
- Script approval not processed;
- missing applicable Continuity Review;
- continuity disposition incompatible with progression;
- malformed required package input.

Expected:

- deterministic rejection before AI generation or persistence where applicable;
- no M7 lifecycle advancement;
- structured handled failure.

### 9.3 Canon lineage

Test:

- valid Story lineage;
- blank lineage;
- malformed `canonVersion`;
- malformed `canonRef`;
- Script/Story mismatch;
- Continuity Review/Story mismatch.

Expected:

- valid lineage proceeds;
- blank or malformed lineage is rejected before runtime canon retrieval;
- mismatches produce deterministic controlled failure;
- all runtime canon/reference reads use Story `canonRef`;
- persisted Production Package lineage exactly matches Story lineage.

### 9.4 PRE-CANON LEGACY exclusion

Attempt M7 eligibility with a D-012 PRE-CANON LEGACY lineage.

Expected:

- deterministic rejection;
- no lineage inference or backfill;
- no Production Package created;
- no Story advancement.

### 9.5 Duplicate protection

Test repeated execution for the same eligible Story/package version.

Expected:

- no unintended duplicate package;
- no duplicate lifecycle advancement;
- no second creative generation when the package already exists unless an explicitly designed regeneration/version path permits it.

### 9.6 Invalid AI output

Test malformed or incomplete Production Package output.

Expected:

- deterministic validation failure;
- no package persistence;
- no Story status advance;
- retry only within the approved M7 AI retry contract.

### 9.7 Failure handling

Test a safe handled M7 failure.

Expected:

- local M7-specific error code preserved;
- one normalized FailureLog event under the established failure contract;
- no lifecycle mutation caused by Failure Handler;
- no duplicate append retry.

Where separately justified, test unhandled failure routing using a safe disposable or controlled method.

### 9.8 Lifecycle isolation

Verify:

- generation failure does not change Story lifecycle state;
- Failure Handler does not change Story or artifact state;
- Story advances only in the workflow responsible for successful M7 transition;
- partial two-write state uses the approved repair path.

### 9.9 Data persistence

Verify persisted Production Package fields exactly match the approved schema.

Verify as applicable:

- identifiers;
- package version;
- ordered scene data;
- prompts/guidance;
- metadata;
- provenance;
- canonVersion;
- canonRef;
- timestamps;
- version values;
- approval/review fields if the approved M7 architecture contains them.

### 9.10 Credentials and targets

Verify all live M7 nodes resolve:

- correct credentials;
- correct Story Vault workbook;
- correct tabs;
- correct GitHub repository/files;
- correct immutable reference expressions;
- correct shared Failure Handler;
- correct Error Workflow.

### 9.11 Rollback/recovery

Prove that:

- failed M7 configuration can be removed or reverted without changing M3–M6 canonical workflow identities;
- pre-M7 rollback copies remain untouched;
- partial Story/package writes have a defined recovery path;
- no cleanup procedure requires deleting unrelated production data.

### 9.12 Repository/live-state parity

After final live configuration:

- export the M7 workflow(s);
- compare them with repository exports;
- explain only known volatile metadata differences;
- verify no temporary pins, test IDs, mocked targets, or stale credentials remain.

---

## 10. Protected Invariants

Throughout M7:

- the Story row remains the authoritative canon-lineage record;
- canon lineage must remain frozen across the Story lineage;
- `canon-v1.0` must not be moved, recreated, retargeted, or silently replaced;
- runtime canon retrieval must use the validated Story `canonRef`;
- repository HEAD must not substitute for stored `canonRef`;
- all new M7 artifacts must persist matching `canonVersion` and `canonRef`;
- PRE-CANON LEGACY records cannot enter M7;
- human approval gates remain intact;
- M7 must not bypass Continuity Approval;
- generation, approval, review, and lifecycle responsibilities must remain controlled;
- the shared `Milo Failure Handler v0.1` architecture remains intact;
- Failure Handler publication state remains governed by D-011 and must not be changed under M7;
- Failure Handler must not mutate Story or artifact lifecycle state;
- the exact 18-column FailureLog contract remains intact;
- Google Sheets append operations must not use automatic retry;
- canonical M3–M6 workflow identities must be preserved;
- existing `- PRE-M6.5 ROLLBACK` copies remain untouched;
- old M6.5 test workflows remain untouched;
- existing records must not be silently backfilled or rewritten;
- unrelated Story Vault tabs, schemas, rows, and fields remain unchanged;
- credentials and secrets must not be exposed;
- no public publishing occurs;
- no M8 implementation occurs;
- repository history must not be rewritten;
- only minimum effective M7 mutations are permitted.

---

## 11. Stop Conditions

Stop the affected M7 branch if:

- repository HEAD or live baseline differs materially from the verified entry state;
- a required governing source materially conflicts with another authoritative source;
- the M7 Production Package contract cannot be defined without an unresolved product decision;
- Phase 1 design review has not been presented to the user before Phase 2;
- the user has not explicitly approved the Phase 1 M7 Production Package design;
- the user requests revision of the Phase 1 design and the revised design has not yet been explicitly approved;
- implementation would require materially departing from the explicitly approved Phase 1 design without returning to the user for renewed design approval;
- exact storage fields or lifecycle transitions cannot be determined safely;
- M7 would require changing canon or moving `canon-v1.0`;
- a Story has blank, malformed, or mismatched canon lineage;
- a PRE-CANON LEGACY record would need migration to continue;
- the upstream Script or Continuity Review cannot be confidently identified;
- upstream approval state is inconsistent;
- production target identity is ambiguous;
- required credentials do not resolve;
- the live Story Vault schema conflicts materially with the approved M7 schema;
- an existing Production Package or M7 implementation is discovered that conflicts with the new design;
- required rollback capability is unavailable;
- a live test would create uncontrolled downstream effects;
- successful implementation would require activating or publishing a workflow without explicit authority;
- a destructive operation becomes necessary but was not authorised;
- failure handling would require bypassing the shared Failure Handler architecture;
- an append path would require unsafe automatic retry;
- test execution causes unexpected lifecycle or persistent-data mutation;
- repository/live-state parity cannot be established;
- an M8 requirement becomes necessary to claim M7 complete; or
- continuing would violate any protected invariant.

For a stopped branch, report:

- what was discovered;
- why execution stopped;
- what remains unchanged;
- whether any partial mutation occurred;
- rollback position;
- required evidence or decision;
- whether the condition blocks M7 completion.

Do not improvise around a stop condition.

---

## 12. Rollback

Before any live M7 mutation, establish and record the rollback position.

The expected baseline rollback position is:

- M3–M6 canonical hardened workflows unchanged;
- canonical workflow IDs preserved;
- existing `- PRE-M6.5 ROLLBACK` workflows preserved;
- shared Failure Handler preserved;
- existing Story Vault tabs and records preserved;
- pre-M7 repository baseline identifiable by commit;
- M7 changes isolated to newly created M7 artifacts and explicitly authorised additive schema/configuration.

Where practical, M7 should be implemented as additive new workflow(s), schema, and repository artifacts rather than replacing stable M3–M6 implementations.

Rollback must be able to restore the pre-M7 operational position without:

- moving canon;
- altering PRE-CANON LEGACY records;
- deleting unrelated Story Vault data;
- retiring existing rollback workflows;
- rewriting repository history; or
- changing Failure Handler publication state.

Any live test record or package requiring cleanup must have its cleanup path defined before execution.

Rollback readiness is required before live mutation but does not substitute for validation.

---

## 13. Completion Contract

M7 may be reported `COMPLETE` only when every applicable condition below is satisfied.

### Design approval and phase transition

- Phase 1 produced a complete M7 Production Package design covering all mandatory Design Approval Gate topics;
- existing governed decisions were distinguished from genuinely new product/architecture decisions;
- material alternatives and recommendations were presented where applicable;
- the user explicitly approved the Phase 1 design before Phase 2 began;
- any material post-approval design change was returned through the Design Approval Gate before implementation; and
- repository implementation conforms to the explicitly approved design.

### Specification

- approved M7 Production Package specification exists;
- approved structured-output schema exists;
- Production Package identifier/version contract is defined;
- asset provenance/link contract is defined;
- M7 lifecycle transitions are defined;
- deterministic vs AI responsibilities are explicit.

### Implementation

- required M7 workflow(s) are implemented;
- required prompts are implemented;
- required Story Vault Production Package storage exists;
- required operational error codes are registered;
- required failure routes use the shared Failure Handler;
- canon-lineage controls are implemented;
- duplicate protection is implemented;
- repair/recovery behaviour is implemented where required.

### Validation

- happy path passes;
- invalid state/input tests pass;
- canon-lineage tests pass;
- PRE-CANON LEGACY exclusion passes;
- duplicate protection passes;
- malformed-output handling passes;
- failure handling passes;
- lifecycle isolation passes;
- persistence checks pass;
- credentials and targets resolve;
- rollback/recovery checks pass;
- repository/live-state parity passes.

### Production state

- only authorised M7 production changes occurred;
- no unrelated production workflow changed;
- no prohibited activation/publication change occurred;
- rollback copies remain intact;
- Failure Handler architecture remains intact;
- FailureLog contract remains intact;
- no unexpected material warnings remain;
- no unintended duplicate Production Package records exist;
- no unintended lifecycle changes occurred.

### Repository

- final verified M7 workflow exports are present;
- tests and validation evidence are present;
- specifications match actual implementation;
- documentation reflects actual resulting state;
- `PROJECT_STATE.md` accurately records M7 completion only after all completion requirements pass;
- `MILESTONES.md` records M7 complete only after verification;
- any required material architectural decision is recorded in `DECISION_LOG.md`.

### Scope

- M8 has not started;
- PRE-CANON LEGACY migration has not occurred;
- old M6.5 workflow cleanup has not occurred;
- Failure Handler publication state has not changed;
- canon has not been changed unless a separately authorised canon work package superseded this invariant;
- unrelated remediation has not been bundled into M7.

If any required condition does not pass, use:

- `COMPLETE WITH NOTES` only for genuinely non-blocking observations where the M7 completion contract itself has passed;
- `PARTIAL` where authorised M7 work has been completed but the full contract has not;
- `BLOCKED` where a dependency or stop condition prevents safe continuation;
- `FAILED VALIDATION` where implementation occurred but required validation failed.

Do not report M7 complete merely because commands succeeded, files were saved, workflows imported, or tests were attempted.

---

## 14. Final Reporting

The final M7 report must contain:

### Status

One of:

- `COMPLETE`
- `COMPLETE WITH NOTES`
- `PARTIAL`
- `BLOCKED`
- `FAILED VALIDATION`

### Changed

Describe exactly what M7 changed.

### Validation

List tests and verification performed, including results and key evidence.

### Live Systems Touched

Identify every live system changed or executed, including:

- n8n;
- Milo Story Vault;
- external systems if applicable.

State explicitly if none were touched in a phase.

### Repository Changes

List:

- specifications;
- schemas;
- prompts;
- workflow exports;
- code;
- tests;
- documentation;
- commit IDs where applicable.

### Protected State Confirmed

Confirm applicable protected invariants remained intact.

### Residual Exceptions

List any non-blocking residual issue, deferred item, or separately governed cleanup item.

### Rollback Position

State the verified rollback position after M7.

### Next Milestone Readiness

State exactly one:

- `READY FOR M8`
- `NOT READY FOR M8 — REMEDIATION REQUIRED`
- `NOT READY FOR M8 — FURTHER VERIFICATION REQUIRED`

M7 completion or M8 readiness does not authorise M8 implementation.

---

## 15. M7 Completion Boundary

M7 ends when a continuity-approved Script can be reproducibly converted into a validated, versioned, canon-lineage-preserving Production Package with the approved scene, visual, voice, animation/motion, metadata, and asset-provenance structure, persisted safely and verified against repository and live-system state.

The Production Package design used for implementation must have passed the Mandatory M7 Design Approval Gate. Completion of Phase 1 or approval of this work order alone is not sufficient authority to implement that design.

M7 does not end merely when an AI-generated production response exists.

The persistent package, deterministic controls, lineage integrity, failure behaviour, rollback position, test evidence, and project-state reconciliation must all be proven.

M8 begins only under a new separately authorised work order.

---

## 16. Closure Record

**Closure date:** 2026-09-02

**Final status:** `COMPLETE WITH NOTES`

**Next milestone readiness:** `READY FOR M8`

- Canonical workflow `SNnLunczq5mxrXLn` was verified inactive/unpublished with 47 nodes, 57 edges, zero pins, preserved identity, credentials, targets, Error Workflow, shared Failure Handler, parser schema, execution modes, Execute Once reads, and append retry controls.
- The repository Production Package export is normalized-equivalent to the verified live definition. All four `Route M7 Action` left operands are exactly `={{ $json.action }}` and the governed output mapping is unchanged.
- Controlled execution `#432` resolved `NOOP_COMPLETE`, emitted one item on terminal Switch output 3, and executed no generation, append, Story update, failure preparation, Failure Handler, retry, or M8 action.
- The governed state remained one `MILO-007-S01-P01` header and eight unique `SC01`–`SC08` scene rows; package version remained 1, generation mode remained `INITIAL`, Story remained `PRODUCTION_PACKAGE_GENERATED`, its timestamp remained unchanged, and FailureLog remained 18 rows with execution `#414` latest.
- Canon provenance remained `canon-v1.0` / `977755913d9ad41e4f16392d01ea993507af4102`; prompt provenance remained `m7-production-package-v1.0` / `03-prompts/m7-production-package-generator.md` / `7947021016f14c84c71421aeb225b80cad990c9d`.
- Execution `#431` was a harmless partial node-execution snapshot that stopped at the resolver, did not reach the Switch, and caused no governed mutation.
- The complete applicable offline validation set passes, including the M7 suite at `63 / 63` and the shared failure-instrumentation suite.
- D-015 remains explicit non-blocking post-M7 hardening debt. No new decision was required for the router serialization correction.
- M8 has not started. `READY FOR M8` records technical readiness only and does not authorise M8 implementation.

---

**End of M7 Production Package Work Order**
