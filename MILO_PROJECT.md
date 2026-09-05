# MILO_PROJECT.md
## Milo Story Studio — Stable Project Overlay

**Status:** Draft for review  
**Parent frameworks:** `AGENTS.md`, `SOFTWARE_PROJECT.md`

---

## Active replacement overlay — D-024

For the streamlined replacement approved 2026-09-05, WORK_ORDER.md and 02-story-system/STREAMLINED_PRODUCTION.md supersede the original topology and mandatory separate approval-workflow implementation below. These sections continue to document the original system. Canon, provenance, approved references, protected originals and final human release approval remain binding.

## 1. Purpose

Milo Story Studio is an n8n-based learning and production system that turns a raw Milo story idea into a controlled, canon-grounded children's content package.

The system is designed to support structured generation, deterministic validation, human approval, continuity review, production preparation, publishing preparation, and an auditable operational record.

This file contains stable Milo-specific architecture, system boundaries, invariants, and working conventions. Changing milestone status and current work authority do not belong here.

---

## 2. Systems

### Repository

- Canonical technical repository: `Redmaxy66/milo-story-studio`
- Primary branch: `main`
- The repository is the source of truth for versioned specifications, workflow exports, prompts, schemas, tests, technical documentation, and canon release references.

### n8n

- n8n is the workflow automation and orchestration platform.
- Milo workflows implement intake, generation, approval, continuity, operational failure handling, and later production and publishing preparation.
- Saved workflow state and active workflow state are distinct.

### Milo Story Vault

- The initial persistent data store is the Google Sheets workbook named `Milo Story Vault`.
- The Story Vault stores Story and downstream artifact records and their controlled lifecycle state.
- `FailureLog` is the separate operational failure store.

### Canon sources

- The five approved Character Bible files in `01-character-bible/` are authoritative source documents.
- `03-prompts/MILO_CANON_CONTEXT.md` and `02-story-system/CONTINUITY_RULES.md` are derived runtime canon artifacts included in a canon release.

---

## 3. Architecture

The controlled pipeline separates responsibilities across stages:

1. Story intake creates and validates the initial Story record.
2. Concept generation produces structured options.
3. Concept approval processes the single human-approved concept.
4. Outline generation produces a structured outline.
5. Outline approval processes the single human-approved outline.
6. Script generation produces the children's story script.
7. Script approval processes the human-approved script.
8. Continuity review assesses the approved script against canon and internal story consistency.
9. Continuity approval provides the human decision gate and revision route.
10. Later production and publishing stages may consume only eligible, approved upstream artifacts.

Generation, approval, review, and lifecycle mutation are separate responsibilities. A later stage must not silently repair, reinterpret, or bypass an upstream approval contract.

Deterministic logic is used for identifiers, validation, eligibility, status transitions, duplicate protection, and approval controls. AI is used for creative generation, unstructured assessment, classification, and review where appropriate.

---

## 4. Canon

### Canon identity

- `canonVersion` is the human-readable approved release tag.
- `canonRef` is the immutable full Git commit SHA resolved from that tag.
- The current approved release is `canon-v1.0`.
- `canon-v1.0` resolves to `977755913d9ad41e4f16392d01ea993507af4102`.

### Canon release contents

A canon release comprises:

- the five authoritative Character Bible files in `01-character-bible/`;
- `03-prompts/MILO_CANON_CONTEXT.md`; and
- `02-story-system/CONTINUITY_RULES.md`.

### Canon rules

- Repository HEAD is not a canon identity.
- `canon-v1.0` must not be moved, recreated, or silently replaced.
- Canon tags are created only for meaningful approved canon changes after derived runtime files have been reconciled with the authoritative source files.
- Concept Generation assigns the Story's `canonVersion` and `canonRef`.
- The Story record is the authoritative canon-lineage record.
- Concepts, Outlines, Scripts, Continuity Reviews, and later Production Packages must inherit and match the Story's canon identity.
- Canon must remain frozen across one Story lineage unless an explicit authorised migration is performed.
- A canon mismatch is a deterministic validation failure.

These rules reflect decisions D-008, D-009, and D-010 in `DECISION_LOG.md`.

---

## 5. Workflow Architecture

- Each workflow has one clear stage responsibility.
- Human approval remains required before publishing or other consequential actions.
- Every n8n node should have a descriptive operational name.
- Local `Prepare ... Failure` nodes remain the source of truth for handled failure payloads and specific error codes.
- Each source workflow routes handled failures to one terminal `Call Failure Handler` node.
- The shared `Milo Failure Handler v0.1` accepts both handled sub-workflow calls and unhandled Error Trigger events.
- Handled and unhandled paths normalize into the same failure-event contract.
- The shared Failure Handler writes only to `FailureLog`; it must not mutate Stories, Concepts, Outlines, Scripts, or Continuity Reviews.
- The shared Failure Handler must not use itself as its Error Workflow.
- Operational error codes are separate from Story lifecycle states.
- Failure paths must preserve diagnostic context, identifiers, and the most specific available error code.
- Automatic retry must not be enabled on Google Sheets append operations. An append timeout may occur after a row has already landed and can otherwise create duplicates.
- Repeatable operations must be assessed for idempotency and duplicate protection.

---

## 6. Data / Story Vault

- The Story Vault is persistent project state and must not be treated as disposable test data.
- The Story lifecycle is governed by the approved status model and stage eligibility rules.
- Status transitions must be deterministic and must occur only in the workflow responsible for that transition.
- Approval processing must protect against duplicate approved records and repeat processing.
- Partial prior writes should use explicit, idempotent repair paths where approved.
- Schema changes must preserve downstream compatibility unless a breaking change is explicitly authorised.
- Targeted remediation must not modify unrelated rows or tabs.
- `FailureLog` is append-only for new events. Later human triage may update only its operational status through a separately authorised action.
- `FailureLog.status` values are operational triage states, not Story lifecycle states.
- Failure instrumentation must not cause lifecycle mutation.

---

## 7. Naming and Identity

- Human-readable workflow names and immutable workflow IDs are distinct and both may be operationally significant.
- Canonical production workflow names identify the current intended production implementations.
- Workflow IDs, spreadsheet IDs, document IDs, deployment IDs, and integration references must not be replaced merely for cleanliness.
- Identity migrations must record old and new identities, preserve rollback mapping, verify downstream references, and verify final human-readable names.
- Replacement and retirement are separate actions.
- Where risk warrants replacement, prepare and validate the replacement independently before controlled cutover.
- Existing production implementations should remain available as rollback copies until retirement is separately authorised.
- Dependency-aware cutovers should normally proceed downstream to upstream unless the architecture requires another sequence.

---

## 8. Production Defaults

- Production workflows remain inactive and unpublished unless explicit authority states otherwise.
- Do not activate or publish a workflow merely because configuration has been saved or validated.
- Do not execute production data paths for configuration verification without explicit live-test authority.
- A live test is a production mutation and requires an identified test case, expected side effects, test-record identity, downstream-impact review, and post-test verification.
- Production changes require target, environment, dependency, credential, rollback, activation, and data-impact checks.
- Production cutover must preserve an understood rollback path where practical.
- Deployment or cutover is not complete until the resulting live state has been independently verified.

---

## 9. Protected Milo Invariants

Unless an explicit current instruction authorises otherwise:

- do not move, recreate, or retarget `canon-v1.0`;
- do not substitute repository HEAD for an artifact's stored `canonRef`;
- do not change canon identity mid-lineage automatically;
- do not bypass human approval gates;
- do not activate or publish production workflows;
- do not execute production data paths;
- do not overwrite canonical production workflow identities without a controlled migration and rollback mapping;
- do not retire rollback workflows without separate authority;
- do not remove or bypass the shared Failure Handler architecture;
- do not allow failure handling to mutate Story or artifact lifecycle state;
- do not enable automatic retry on Google Sheets append nodes;
- do not delete or repurpose Story Vault fields or lifecycle states without explicit authority;
- do not expose credentials or secrets; and
- do not begin a new milestone merely because preparatory or governance work is complete.

---

## 10. Governance Mapping

- `AGENTS.md` = universal operating framework.
- `SOFTWARE_PROJECT.md` = software-project operating overlay.
- `MILO_PROJECT.md` = Milo-specific stable project overlay.
- `PROJECT_STATE.md` = concise current operational snapshot.
- `DECISION_LOG.md` = authoritative decision history.
- `MILESTONES.md` = milestone evidence and history.
- `PROJECT_ROADMAP.md` = forward plan.
- `README.md` = human-readable project entry point.
- `CLAUDE.md` = Claude-specific teaching and interaction guidance; it does not override the operating hierarchy.
- `WORK_ORDER.md` = current authorised work package when present.

For Milo Story Studio, `DECISION_LOG.md` is the project-specific equivalent of `DECISIONS.md` referenced by `AGENTS.md`. `DECISION_LOG.md` remains the single authoritative decision record. Do not create a parallel `DECISIONS.md`.

---

**End of Milo Story Studio Stable Project Overlay**
