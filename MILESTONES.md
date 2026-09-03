# Milestone Tracker

| ID | Milestone | Target | Status | Completion evidence |
|---|---|---:|---|---|
| M1 | Project Foundation | Week 1 | Complete | Repository, nine-folder structure, live project board, dated roadmap, Claude Code environment, Git workflow, and Week 1 learning log completed. |
| M2 | Milo Character Bible | Week 2 | Complete | Milo Character Bible v1.0 approved, including character, backstory, voice, personality, visual reference, open decisions, and change-control rules. |
| M3 | Story Vault | Week 4 | Complete | Story Vault v1 specification approved; Google Sheet and n8n intake workflow completed; sequential IDs, validation, safe failure handling, three valid and four invalid tests, workflow export, learning log update, and workflow explanation completed. |
| M4 | Concept Generator | Week 6 | Complete | Milo Concept Generator v0.1 generates, validates, and stores three structured concepts; Milo Concept Approval v0.1 processes human-approved concepts separately; deterministic validation, duplicate protection, approval repair handling, and repeat-processing protection proven. |
| M5 | Script Pipeline | Week 8 | Complete | Outline Generator, Outline Approval, Script Generator, and Script Approval v0.1 completed, tested, exported, committed, and pushed. End-to-end status progression proven from CONCEPT_APPROVED through OUTLINE_GENERATED, OUTLINE_APPROVED, SCRIPT_GENERATED, and SCRIPT_APPROVED. Deterministic validation, duplicate protection, approval repair paths, Story readiness checks, structured failure payloads, and canon-grounded script generation are working. |
| M6 | Continuity Agent | Week 10 | Complete | Continuity Reviewer and Continuity Approval v0.1 completed, tested, exported, committed, and pushed. Deterministic validation, version-based duplicate protection, PASS / REVIEW_REQUIRED / FAIL routing, open-canon handling, human approval, approval repair, structured failures, and status progression through CONTINUITY_REVIEWED, CONTINUITY_APPROVED, and SCRIPT_REVISION_REQUIRED are proven. |
| M7 | Production Package | Week 12 | Complete | Approved design and D-013 recorded; specification, schema, prompt, lifecycle/error contracts, two-tab persistence, workflow export, repair/no-op controls, and `63 / 63` offline validation complete. Canonical workflow `SNnLunczq5mxrXLn` passed terminal zero-write verification in execution `#432`; one version-1 `INITIAL` header and eight scenes remain intact with matching canon and prompt provenance. |
| M8 | Complete Studio | Week 16 | In progress | Design revision 1.1 and D-016 govern the milestone. Phase 1 governance and Phase 2 repository contracts are complete: schemas, lifecycle/error controls, OpenArt adapter boundary, proposed Story Vault schema, inert skeleton exports, offline fixtures/validators, and M3–M7 regressions pass. No live/A3 phase has begun. |

## M5 closure

Completed workflows:

- Milo Outline Generator v0.1
- Milo Outline Approval v0.1
- Milo Script Generator v0.1
- Milo Script Approval v0.1

Proven status flow:

`CONCEPT_APPROVED -> OUTLINE_GENERATED -> OUTLINE_APPROVED -> SCRIPT_GENERATED -> SCRIPT_APPROVED`

Key M5 hardening and closure commits:

- `8f51aa1` Fix outline generator live record mapping
- `62977a7` Harden concept generator schema and batch validation
- `414f343` Add concept generator duplicate protection
- `6b65fb3` Harden concept approval validation and repair flow
- `33518eb` Clean outline approval failure payloads
- `382a330` Build script generator pipeline
- `0d26095` Build script approval workflow

## M6 closure

Completed workflows:

- Milo Continuity Reviewer v0.1
- Milo Continuity Approval v0.1

Proven status flow:

`SCRIPT_APPROVED -> CONTINUITY_REVIEWED -> CONTINUITY_APPROVED`

Revision route:

`CONTINUITY_REVIEWED -> SCRIPT_REVISION_REQUIRED`

Key M6 implementation commits:

- `8c19268` Define M6 continuity rules and agent specification
- `f0e017c` Build continuity reviewer workflow
- `5b5a9e2` Build continuity approval workflow

## Current focus

Current milestone: **M8 — Complete Studio (Phase 2 repository contracts complete)**

M8 governance evidence:

- Approved design baseline: `MILO_M8_DESIGN_APPROVAL_PACKAGE.md` revision 1.1.
- Approved design SHA-256: `6934b997f79e3d5aa7ff5b9405926abb8c9e401a1a539a31e16b1c32dac0d8a2`.
- Decision D-016 records M8-D01 through M8-D13 and all four amendments.
- Replacement `WORK_ORDER.md` is installed for governance only; it grants no implementation or A3 authority.

M8 Phase 2 evidence:

- All 12 provider-neutral contracts, lifecycle/controlled values, error codes, hashing, and idempotency foundations are defined.
- The OpenArt adapter boundary and sanitized offline fixtures contain no live target/configuration data.
- The proposed Story Vault schema specifies 12 authoritative contract tabs plus derived read-only `StudioControl`; M8 failures continue to use the unchanged shared `FailureLog`.
- Thirteen workflow skeleton exports are inactive, empty-node, and free of credentials, triggers, live targets, and executable configuration.
- `06-testing/M8_PHASE2_VALIDATION.md` records all M8 suites passing, the aggregate at `9 / 9`, and complete applicable M3–M7 regression protection.

M7 closure evidence:

- Canonical workflow: `SNnLunczq5mxrXLn`, inactive/unpublished, 47 nodes, 57 edges, zero pins.
- Canonical verification: execution `#432`, `NOOP_COMPLETE`, Switch output 3, zero writes and no FailureLog event.
- Persistent result: one `MILO-007-S01-P01` header, package version 1, generation mode `INITIAL`, and eight unique scenes `SC01`–`SC08`.
- Repository/live parity: passed against the certified workflow export, excluding only volatile n8n metadata.
- Residual note: D-015 remains non-blocking post-M7 hardening debt.

Next phase readiness: **PHASE 2 COMPLETE; AWAITING THE NEXT SEPARATELY AUTHORISED PHASE.** The A3 n8n/OpenArt connectivity proof remains unauthorised and has not begun.

## Status values

- Not started
- In progress
- Blocked
- Complete
