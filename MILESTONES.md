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
| M8 | Complete Studio | Week 16 | In progress | Design revision 1.1 and D-016 through D-023 govern the milestone. Phases 1–3 remain complete. The five-sheet reference-development stage has reached final readiness assessment. D-023 approves the deterministic REFSHEET05 PNG/SVG/JSON controls, verifies restricted Drive byte parity, and classifies the reference package as `READY WITH CONDITIONS FOR 30-SECOND SPIKE PREPARATION`. Total reference spend remains 105 credits with zero automatic retries and a last-known balance of 3,343. The spike requires separate preparation, live video cost validation, a hard ceiling and A3 authority; Phase 4 remains not started. |

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

Current milestone: **M8 — Complete Studio (Phase 3 complete; five-sheet reference-development stage assessed as READY WITH CONDITIONS for 30-second spike preparation)**

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

M8 `REFSHEET01` route evidence:

- V01 cost 15 credits and is rejected for `WRONG_CHARACTER_IDENTITY`; its SHA-256 and provider identifiers remain historical evidence only.
- The project-owner-approved 1056×408 non-generative crop at SHA-256 `3d9e94da9114d9b907216a1e1d63ac1c1b19757ab8c2865678c0b64809c12fe2` is the authoritative non-canon episode identity input; D-020 records its later restricted durable storage and exact Drive-download checksum parity.
- V02 used one 15-credit Seedream 4.5 `image2image` operation with zero retries and preserved Milo's broad non-human identity. It is accepted with limitations for route evidence only, not as the completed sheet or a production/canon asset.
- Total `REFSHEET01` spend is 30 credits; the balance after V02 was 3,418 credits. Another `REFSHEET01` revision, Character Library testing and Phase 4 remain unauthorised.

M8 `REFSHEET02` approval and durable evidence:

- D-020 approves exact candidate `MILO-007-S01-P01-REFSHEET02-V01` at SHA-256 `915e077c8338802a584b66c799b4c718c94c24242d694a60b02c718fb3524035` with recorded limitations.
- The candidate and authoritative anchor are stored under the restricted `Milo Story Studio/Production Assets/MILO-007/MILO-007-S01-P01/Approved References` hierarchy; Drive-download hashes match both approved sources.
- `REFSHEET02` V01 used one 15-credit operation and zero retries, moving the known balance from 3,418 to 3,403. Durable promotion and reconciliation spent zero additional credits.
- Kneeling and one-finger count remain material before affected moving-image shots. Commercial-publication rights remain pending final confirmation; owner-level technical mutability requires the no-overwrite policy and pre-use checksum revalidation.
- D-020 granted no `REFSHEET02-V02` or later activity; subsequent `REFSHEET03` work is governed separately by D-021.

M8 `REFSHEET03` curated firefly evidence:

- D-021 rejects V01 and the complete V02 sheet, while approving V02 only as a component source with exclusions.
- The approved 184×356 firefly anchor at SHA-256 `085e063ded663042e0708cbe629db2e1dc8ad6899d4bed6bc3e32e6dd7375e24` and the 2088×1788 curated PNG at SHA-256 `08b96e60525eba09ff500162f58b9953ec63e81dfb508b5c9d5693ced3a1dd6d` are stored owner-only under Approved References with exact Drive-download parity.
- The curated reference contains neutral identity, exactly four glow examples, shelter and flight with anonymous distant lights. The Milo-hand/human-fingertip panel, fern-perching panel and second glow row are excluded.
- `REFSHEET03` used two 15-credit attempts with zero retries, moving the known balance from 3,403 to 3,373. Curation, promotion and reconciliation spent zero credits.
- Scale, fern-hover, distinct peeking and exact glow-transition coverage remain material before affected moving-image shots. No further `REFSHEET03` generation, next reference sheet, Character Library, moving-image or Phase 4 authority exists.

M8 `REFSHEET04` deterministic geography evidence:

- D-022 rejects V01 for disconnected geography and a water hazard and rejects V02 for branched/looping geography and an invented gate; each cost 15 credits with zero retries.
- The 2848×1600 RGB PNG at SHA-256 `2951f25d59e9b87df9576a463390573906f4dc93ef925c6c4ead9fca794a1dd4` is approved as the authoritative episode-scoped topology and zone-order guide, not finished artwork or permanent world canon.
- Drive file `1PKxd40UOEftwQd3LoWvoS3rbTdXgoCIc` is owner-only and non-public under Approved References; its downloaded bytes match the approved checksum exactly.
- `REFSHEET04` is closed without V03. Total reference spend is 105 credits and the last-known balance is 3,343; this reconciliation spent zero credits.
- Every later shot background must preserve the unbranched left-to-right route and use the existing style anchor separately for atmosphere. `REFSHEET05` and Phase 4 require separate authority.

M8 `REFSHEET05` deterministic controls and reference-pack readiness:

- The exact PNG, reproducible SVG and machine-readable JSON specification are owner-approved, restricted, and download-verified at SHA-256 `a4f651101c25f80734e7d26fd0cf1e02a2a71b5dd4a6c4fb22ac9ff9455ac0f6`, `8ffb7675f709af51773449d96a574efbe51b6b52e91fd95195d87f4ee719ac51`, and `c033ac8c7acb146a835cedac49cbcf425b26cf2c0f2d01554b2294f1058c8c9e`.
- D-023 approves the episode palette, SC01–SC08 lighting progression, four glow stages and relative scale values Milo 1.00, fern 0.46, firefly 0.035, treat 0.055 and Moonberry lantern 0.24. The controls are renderer-neutral, relative, episode-only and non-canon.
- The complete reference position is `READY WITH CONDITIONS FOR 30-SECOND SPIKE PREPARATION`. A bounded SC06 multi-shot excerpt can avoid unsupported kneeling, one-finger count, fingertip interaction, fern hover/perching and peeking.
- REFSHEET05 used no provider generation and spent zero credits. Its unused generation allowance is not automatically transferable. The last-known balance remains 3,343.

M7 closure evidence:

- Canonical workflow: `SNnLunczq5mxrXLn`, inactive/unpublished, 47 nodes, 57 edges, zero pins.
- Canonical verification: execution `#432`, `NOOP_COMPLETE`, Switch output 3, zero writes and no FailureLog event.
- Persistent result: one `MILO-007-S01-P01` header, package version 1, generation mode `INITIAL`, and eight unique scenes `SC01`–`SC08`.
- Repository/live parity: passed against the certified workflow export, excluding only volatile n8n metadata.
- Residual note: D-015 remains non-blocking post-M7 hardening debt.

Next gate: **SEPARATELY AUTHORISE 30-SECOND SPIKE PREPARATION.** It must define exact shot trims and reference mapping, confirm current video capability and cost, establish a hard overall credit ceiling and zero-retry policy, and preserve identity, scale, glow, non-contact and unbranched-geography controls. Final commercial-publication rights require confirmation before public release. No spike execution or Phase 4 work is authorised.

## Status values

- Not started
- In progress
- Blocked
- Complete
