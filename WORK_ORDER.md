# WORK_ORDER.md
## Milo Story Studio — Pre-M7 Exception Disposition

**Status:** Draft for review  
**Authority:** A1 — Prepare  
**Project:** `Redmaxy66/milo-story-studio`  
**Target milestone:** Pre-M7 assessment; M7 remains not started  
**Activation:** This work order becomes active only after approval and repository installation.

---

## 1. Objective

Assess and determine the correct disposition of the six live-state exceptions recorded in `PROJECT_STATE.md` before M7 implementation is authorised.

This work package is assessment and decision preparation only. It must produce evidence-based findings, risk classifications, disposition recommendations, required future authority, and any recommended decision records. It does not authorise remediation.

---

## 2. Governing Sources

Apply the following sources in the operating hierarchy established by `AGENTS.md` and the Milo governance mapping:

1. this approved `WORK_ORDER.md`;
2. active decisions in `DECISION_LOG.md`, which is Milo's project-specific equivalent of `DECISIONS.md`;
3. `PROJECT_STATE.md`;
4. `MILO_PROJECT.md`;
5. `SOFTWARE_PROJECT.md`;
6. `AGENTS.md`;
7. relevant repository specifications, workflow exports, tests, milestone evidence, and roadmap material.

Distinguish repository-verified fact, live-observed fact, documented intent, inference, and unresolved uncertainty. Do not report intended state as actual state.

---

## 3. Authority

### A1 — Prepare

Permitted:

- read repository files;
- inspect relevant live systems in read-only mode where required;
- research and document n8n behaviour where necessary;
- analyse each exception;
- recommend disposition;
- identify whether a technical change, governance decision, accepted exception, or later migration is required; and
- prepare assessment and decision artifacts without applying them.

Not permitted:

- modify live systems;
- modify Google Sheets;
- modify n8n workflows;
- activate, publish, or unpublish workflows;
- execute production data paths;
- modify canon or canon tags;
- delete, rename, archive, or otherwise alter legacy/test workflows;
- migrate or alter legacy records;
- change schemas;
- modify application code, workflow exports, or existing governance files;
- perform any recommended remediation; or
- begin M7 implementation.

---

## 4. In Scope

Assess only the following six exceptions.

### Exception 1 — Shared Failure Handler publication state

Workflow:

- Name: `Milo Failure Handler v0.1`
- ID: `3an2myLOF7o4STK8`
- Observed state: **Published**

Determine whether the Published state is:

- operationally required by n8n for its Error Workflow or sub-workflow role;
- optional but acceptable;
- unnecessary and should later be changed; or
- a genuine configuration defect.

Use authoritative n8n documentation and read-only inspection where necessary. Distinguish the requirements for Error Trigger/Error Workflow use from the requirements for Execute Sub-workflow use. Do not change the workflow's state.

### Exception 2 — Legacy records with blank canon lineage

Several older Story, Concept, and Outline records have blank:

- `canonVersion`; and
- `canonRef`.

Determine whether these records should be:

- explicitly grandfathered as pre-canon legacy records;
- migrated;
- archived; or
- handled another documented way.

Assess lifecycle status, downstream dependencies, reproducibility, auditability, migration risk, and the binding effect of D-008, D-009, and D-010. Do not modify any record.

### Exception 3 — Continuity Reviews canon schema

The live `Continuity Reviews` tab currently does not contain:

- `canonVersion`; or
- `canonRef`.

Milo's stable architecture states that Continuity Reviews inherit the Story's canon identity.

Determine whether:

- the schema should be extended before M7;
- lineage can be safely and reproducibly derived without stored fields;
- the stable rule should be revised; or
- another design is preferable.

Assess the Story row as the authoritative lineage record, downstream M7 consumption, deterministic mismatch detection, historical reproducibility, and compatibility with existing records and workflows. Do not change the Sheet, schema, or workflows.

### Exception 4 — Old M6.5 test workflows

Assess:

- `Milo Concept Generator v0.1 - M6.5 TEST OLD` — ID `AKKJLo6NoCOxbHD8`;
- `Milo Outline Approval v0.1 - M6.5 TEST OLD` — ID `UdeGbGGWIS7nR4Kk`.

Determine whether they should:

- remain temporarily;
- be renamed or archived later;
- be deleted later; or
- be retained as explicit rollback/test evidence.

Assess dependency references, rollback value, audit value, naming clarity, accidental-use risk, and whether repository evidence already preserves their useful history. Do not alter either workflow.

### Exception 5 — Functional credential verification

Credential references resolve, but no workflow execution was performed during governance verification.

Determine whether additional live execution is actually required before M7, given that relevant credential paths were proven during prior M6.5 testing.

Assess the freshness and coverage of existing M6.5 evidence, current credential resolution, target resolution, credential types used by M7 dependencies, and whether any material path remains unproven. Do not execute any workflow or production data path.

### Exception 6 — GitHub runtime canon pinning

Visible workflow configuration does not prove that runtime GitHub canon fetches are pinned to:

- `canon-v1.0`; or
- `977755913d9ad41e4f16392d01ea993507af4102`.

Assess the current implementation and determine:

- whether runtime canon retrieval is genuinely immutable;
- whether repository HEAD or another moving reference is being used;
- whether stored Story `canonRef` values control retrieval;
- whether the current implementation conflicts with D-008, D-009, or D-010; and
- whether remediation is required before M7.

Inspect repository workflow exports, expressions, GitHub node configuration, relevant specifications, and read-only live configuration where necessary. Do not modify workflows or canon, and do not move or recreate `canon-v1.0`.

---

## 5. Out of Scope

- M7 design or implementation;
- correction of any exception;
- creation or modification of Story Vault fields;
- record migration, backfill, deletion, or archival;
- workflow execution or live testing;
- workflow publication-state changes;
- workflow deletion, renaming, archival, or replacement;
- canon release creation, movement, recreation, or retargeting;
- application-code, workflow-export, schema, or prompt changes;
- modification of `AGENTS.md`, `SOFTWARE_PROJECT.md`, `MILO_PROJECT.md`, `PROJECT_STATE.md`, `DECISION_LOG.md`, `MILESTONES.md`, `PROJECT_ROADMAP.md`, or `README.md`; and
- implementation of any proposed governance decision.

Unexpected issues outside these six exceptions must be recorded separately and must not broaden this work package.

---

## 6. Required Sequence

1. Confirm the repository, branch, current HEAD, and governing-file versions.
2. Re-read this work order and the governing sources listed in Section 2.
3. Establish an evidence register for the six exceptions, identifying repository, live-system, documentation, and prior-test evidence separately.
4. Assess each exception independently and stop only the affected branch if a stop condition is reached.
5. For n8n behaviour, prefer authoritative n8n documentation and direct read-only observation over assumption.
6. For canon questions, test conclusions against D-008, D-009, D-010, `MILO_PROJECT.md`, stored lineage fields, and actual workflow retrieval configuration.
7. Assign each exception one severity and one recommended disposition using the controlled values in Section 7.
8. Identify any M7 blocker, required decision, required technical remediation, accepted exception, deferred item, or further-verification need.
9. Produce the final assessment and M7 Readiness Recommendation without performing remediation.
10. Verify that no repository or live-system mutation occurred and that M7 remains not started.

---

## 7. Required Output Per Exception

For each exception, provide every subsection below.

### Finding

State what is actually true, the evidence supporting it, and any remaining limitation. Separate observed fact from inference.

### Risk

State what could go wrong if the current state is left unchanged.

### Severity

Choose exactly one:

- `BLOCKER`
- `HIGH`
- `MEDIUM`
- `LOW`
- `INFORMATIONAL`

### Recommended Disposition

Choose exactly one:

- `ACCEPT AS DESIGNED`
- `DOCUMENT / GOVERNANCE DECISION`
- `REMEDIATE BEFORE M7`
- `DEFER TO LATER MILESTONE`
- `RETIRE / CLEAN UP LATER`
- `FURTHER VERIFICATION REQUIRED`

### Rationale

Explain why the selected severity and disposition follow from the evidence, architecture, decisions, and protected invariants.

### Required Future Authority

State the minimum authority level required for the recommended next action. If no action is required, state `None beyond acceptance of this assessment`.

### Required Decision Record

State whether a new entry in `DECISION_LOG.md` is recommended and what decision it must capture. Do not write the decision entry during this work package.

---

## 8. Evidence and Assessment Standards

- Cite exact repository paths, workflow IDs, node names, field names, record identities, decision IDs, documentation links, or prior test evidence where material.
- Prefer primary documentation for n8n technical behaviour.
- Do not infer successful runtime behaviour solely from a resolved selector or absence of a warning.
- Do not require live execution if existing evidence is sufficient; explain why the evidence is sufficient.
- Do not accept repository HEAD as immutable canon identity.
- Do not recommend migration without defining its objective, affected record classes, compatibility implications, rollback requirements, and minimum future authority.
- Do not recommend deletion where rename, archive, retention, or repository evidence would better preserve rollback or audit value.
- Treat the published Failure Handler as observed state, not automatically as a defect.
- Treat M7 readiness as a conclusion of this assessment, not as authority to start M7.

---

## 9. Stop Conditions

Stop the affected assessment branch if:

- assessment would require production mutation;
- current system behaviour cannot be determined safely without execution;
- a repository specification materially conflicts with live architecture;
- resolving the issue would require moving, recreating, or retargeting `canon-v1.0`;
- the correct disposition cannot be determined without a user or product decision;
- the target workflow, record class, repository path, or environment cannot be identified confidently;
- required access or authoritative evidence is unavailable; or
- continuing would violate a protected invariant.

Do not resolve such issues by improvisation. Record:

- what was discovered;
- why that branch stopped;
- what remains unchanged;
- what evidence or decision is required to proceed; and
- whether the unresolved branch blocks M7 readiness.

A stop condition affecting one exception does not automatically stop safe assessment of the other exceptions.

---

## 10. Validation

Before reporting this work package complete:

1. confirm all six exceptions have an assessment or a documented branch-specific stop result;
2. confirm every completed assessment contains all seven required subsections from Section 7;
3. confirm each severity and disposition uses an allowed value;
4. reconcile conclusions against `DECISION_LOG.md`, `MILO_PROJECT.md`, and `PROJECT_STATE.md`;
5. identify all M7 blockers explicitly;
6. separate required governance decisions, technical remediation, accepted exceptions, deferred items, cleanup, and further verification;
7. confirm no repository file, n8n workflow, Google Sheet, canon artifact, record, schema, or connected system changed;
8. confirm no workflow or production data path was executed;
9. confirm no workflow was activated, published, or unpublished; and
10. confirm M7 was not started.

---

## 11. Completion Contract

This work order is complete only when:

- all six exceptions have been assessed;
- each has a severity;
- each has a recommended disposition;
- any M7 blockers are clearly identified;
- required governance decisions are identified;
- required technical remediation is clearly separated from accepted or deferred items;
- unresolved branches and their evidence requirements are explicit;
- no live system was changed;
- no prohibited repository change occurred; and
- M7 was not started.

If these conditions are not met, report the package as `PARTIAL`, `BLOCKED`, or `FAILED VALIDATION` as applicable. Do not report it complete merely because all assessment steps were attempted.

---

## 12. Final Summary

Conclude the assessment with:

### M7 Readiness Recommendation

Choose exactly one:

- `READY FOR M7`
- `READY FOR M7 AFTER GOVERNANCE UPDATE`
- `NOT READY — REMEDIATION REQUIRED`
- `NOT READY — FURTHER VERIFICATION REQUIRED`

List:

- M7 blockers;
- required governance decisions;
- required pre-M7 technical remediation;
- accepted or deferred exceptions;
- later cleanup items; and
- the minimum authority required for each next action.

The recommendation does not authorise remediation or M7 implementation.

---

## 13. Final Report Format

Report:

### Status

Use `COMPLETE`, `COMPLETE WITH NOTES`, `PARTIAL`, `BLOCKED`, or `FAILED VALIDATION`.

### Assessed

Summarise the six completed exception assessments.

### Verified

Identify repository, documentation, and read-only live evidence used.

### Preserved

Confirm protected state and prohibited systems remained unchanged.

### Exceptions

List branch-specific stop results, evidence limits, or unresolved product decisions.

### Next

State only the next separately authorised governance, verification, cleanup, or remediation package. Do not begin it.

---

**End of Pre-M7 Exception Disposition Work Order**
