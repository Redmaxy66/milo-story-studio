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
| M8 | Complete Studio | Week 16 | In progress | Design revision 1.1, D-016 and D-017 govern the milestone. Phases 1–3 are complete and AP01–AP06 are approved with explicit conditions. The isolated OpenArt A3 connectivity/capability/cost proof passed with notes and its sanitized evidence is reconciled. Governance ceilings are 15 credits per initial sheet, 75 credits for five initial sheets, one separately approved revision per sheet at up to 15 credits, and 150 credits absolute for five initial sheets plus five revisions; they confer no spend authority. `REFSHEET01`, Phase 4 and production activity remain unauthorised and unstarted. |

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

Current milestone: **M8 — Complete Studio (Phase 3 complete; OpenArt A3 proof reconciled; `REFSHEET01` not authorised)**

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

M8 Phase 3 evidence:

- The approved M7 snapshot is preserved byte-identically at SHA-256 `c1221fe13d7278912b73572658dc569756de4baa98679b7e3567bd3768d98233`.
- Derived non-canon reference governance, eight Film Director briefs, 24 shots, 32 text panels, renderer-neutral animation direction and 24 provider-neutral prompts are approved with explicit conditions.
- AP01–AP06 record controlled `APPROVED` decisions with explicit conditions; AP05/AP06 approvals remain bound to the final deterministic artifact hashes.
- The five-sheet proposal permits only finite candidate counts and records unknown costs/null caps as blocking; it grants no generation or spending authority.
- Phase 3 validation passes `120 / 120`; Phase 2 and M3–M7 regressions pass; no media, live approval, provider call, assembly or publication exists.

M8 isolated OpenArt A3 proof evidence:

- Status: `PASS WITH NOTES`; isolated workflow `EL5LzYxiIUeOK2nf` remained inactive, unpublished and unpinned.
- Read-only execution `#434` and paid execution `#435` succeeded. One neutral non-Milo Seedream 5 Lite `text2image` request returned one 2848×1600 PNG after an initial `PENDING` response and read-only retrieval.
- Credits reconciled exactly from 3,463 to 3,448: 15 credits, zero retries.
- D-017 accepts the route as technically proven, requires governed read-only status retrieval, and records planning ceilings that do not grant spend authority.
- The proof does not establish Milo fidelity, multiview or character consistency, or production suitability.

M7 closure evidence:

- Canonical workflow: `SNnLunczq5mxrXLn`, inactive/unpublished, 47 nodes, 57 edges, zero pins.
- Canonical verification: execution `#432`, `NOOP_COMPLETE`, Switch output 3, zero writes and no FailureLog event.
- Persistent result: one `MILO-007-S01-P01` header, package version 1, generation mode `INITIAL`, and eight unique scenes `SC01`–`SC08`.
- Repository/live parity: passed against the certified workflow export, excluding only volatile n8n metadata.
- Residual note: D-015 remains non-blocking post-M7 hardening debt.

Next gate: **SEPARATELY AUTHORISED, NARROWLY SCOPED A3 INSTRUCTION FOR `REFSHEET01`.** Fresh pricing and all D-017 unit/stage controls remain mandatory. The approved ceilings do not constitute spend authority. Reference generation and Phase 4 remain unauthorised and unstarted.

## Status values

- Not started
- In progress
- Blocked
- Complete
