# Changelog

## 0.7.0 — Production Package repository implementation (in progress)

- Recorded D-013 for immutable, append-versioned Production Package blueprints with child scene rows and separate realised-asset provenance.
- Added the M7 Production Package specification, structured-output schema, generator prompt, workflow export, lifecycle transition, operational error codes, and deterministic validation suite.
- Reconciled the M7 offline suite at `27 / 27` without changing the approved prompt or immutable `promptRef`.
- Reconciled shared failure instrumentation with the governed D-014 Concept Generator topology of 44 nodes / 55 connections.
- Completed the governed `MILO-007` acceptance lineage through Continuity Review execution `#404` and Continuity Approval execution `#405`; the Story is now `CONTINUITY_APPROVED` with matching immutable canon lineage.
- Left M7 live Story Vault schema creation, workflow configuration, and controlled Production Package execution pending separate A3 authority.

## 0.6.5 — Failure instrumentation repository implementation

- Added the shared `Milo Failure Handler v0.1` contract for handled and unhandled failures.
- Wired all 35 existing local `Prepare ... Failure` nodes to per-workflow handler calls.
- Added deterministic failure IDs and an 18-column append-only `FailureLog` schema.
- Added Error Trigger normalization without inventing live workflow IDs or Sheet schema metadata.
- Added the operational error-code register and separated it from lifecycle states.
- Documented the retry policy prohibiting automatic Google Sheets append retries.
- Added deterministic transformation and validation scripts.
- Left live n8n workflow references, Error Workflow selection, and `FailureLog` tab creation as explicit activation actions.
- Added the Outline Approval idempotent repair branch for the case where the Story is already `OUTLINE_APPROVED` but the Outline stamp is still blank.
- Corrected the Script Approval handled-failure payload field from `stroyId` to `storyId`.
- Verified Script Generator, Outline Generator, and Concept Approval exports contain no retained `TEST-INVALID` pin data.
- Made the Outline Approval validation IF explicitly normalize its inline predicate to a Boolean, preventing trailing expression whitespace from becoming a strict-type string error.
- Corrected the identical Boolean-expression suffix defect in Outline Generator and added repository-wide Boolean IF suffix checks.
- Connected Concept Generator's invalid-batch FALSE output to its existing validation-failure payload and shared failure handler.

## 0.6.0 — Continuity Agent complete

- Approved Continuity Rules v1.0 and the Continuity Agent specification.
- Completed Milo Continuity Reviewer v0.1.
- Completed Milo Continuity Approval v0.1.
- Added deterministic eligibility validation and version-based duplicate protection.
- Added structured canon and internal-story assessment with PASS, REVIEW_REQUIRED, and FAIL outcomes.
- Added open-canon warning handling and evidence-backed findings.
- Added human approval, revision routing, and approval repair handling.
- Added structured failure payloads and controlled status progression through CONTINUITY_REVIEWED, CONTINUITY_APPROVED, and SCRIPT_REVISION_REQUIRED.
- Completed M6: Continuity Agent.

## 0.5.0 — Script Pipeline complete

- Completed Milo Outline Generator v0.1.
- Completed Milo Outline Approval v0.1.
- Completed Milo Script Generator v0.1.
- Completed Milo Script Approval v0.1.
- Added deterministic ID and schema validation across the Script Pipeline.
- Added approved-record uniqueness and duplicate protection.
- Added Story readiness checks and explicit failure routing.
- Added approval repair paths for incomplete approval processing.
- Added canon-grounded script generation using MILO_CANON_CONTEXT.md.
- Proven status progression through OUTLINE_GENERATED, OUTLINE_APPROVED, SCRIPT_GENERATED, and SCRIPT_APPROVED.
- Completed M5: Script Pipeline.

## 0.4.0 — Concept Generator complete

- Completed Milo Concept Generator v0.1.
- Completed Milo Concept Approval v0.1.
- Added structured concept generation and validation.
- Added deterministic approval handling.
- Added duplicate protection and repeat-processing protection.
- Added approval repair handling.
- Completed M4: Concept Generator.

## 0.3.0 — Story Vault complete

- Completed Story Vault v1 specification.
- Created Google Sheets Story Vault.
- Completed Milo Story Intake workflow.
- Added sequential Story IDs, validation, status tracking, and safe-failure handling.
- Completed valid and invalid workflow testing.
- Completed M3: Story Vault.

## 0.2.0 — Milo Character Bible v1.0

- Designated the five Character Bible documents as approved initial canon.
- Distinguished approved canon, derived production guidance, and open decisions.
- Established change-control rules for future canonical changes.
- Completed M2: Milo Character Bible.

## 0.1.0 — Project foundation

- Defined the Milo Story Studio capstone.
- Created the initial repository structure.
- Added the roadmap, milestones, learning log, decision log, and Claude instructions.
- Completed M1: Project Foundation.
