# M8 Phase 3 Reference and Production Intent Validation

**Result:** PASS
**Validation date:** 2026-09-03
**Authority:** A2 — M8 Phase 3 Final AP05/AP06 Determinism Correction
**Entry remote `main`:** `73fc348fae9798bf172a891ee20051956ba82971`
**Rollback position:** `73fc348fae9798bf172a891ee20051956ba82971`
**Entry parent:** `59e479e37ba9306732f423a1136ebe67beb280bb`
**Entry tree:** `e513a24b3571437310336b818352d2e7d63d21ab`

## Source verification

- Approved external design artifact revision 1.1 was verified read-only at SHA-256 `6934b997f79e3d5aa7ff5b9405926abb8c9e401a1a539a31e16b1c32dac0d8a2` and was not added to the repository.
- The supplied snapshot and repository source copy are byte-identical at SHA-256 `c1221fe13d7278912b73572658dc569756de4baa98679b7e3567bd3768d98233`.
- Validation found one package header, package version 1, generation mode `INITIAL`, and eight unique contiguous scenes `SC01`–`SC08`.
- Story `MILO-007`, Script `MILO-007-S01`, `canon-v1.0` and `977755913d9ad41e4f16392d01ea993507af4102` are preserved exactly.
- Source text, dialogue and production guidance were copied without normalization, reconstruction, repair, rewriting or enrichment.

## Phase 3 result

| Suite | Result |
|---|---:|
| `node --check 05-code/m8/phase3-validation.mjs` | PASS |
| `validate_m8_phase3.mjs` | PASS — 120 / 120 |
| JSON parse gate | PASS |
| `git diff --check` | PASS |

The dedicated suite proves eight-scene lineage, exact source hashes, all reference classifications and categories, rights/provenance/checksum gates, all three specialist boundaries, 24 stable shots, 32 stable panels, a contiguous 24 fps timeline of 5,760 frames / 240 seconds, one authoritative narration binding, complete non-overlapping narration allocation, non-overlapping dialogue windows, no spoken or heard claims in no-playback shots, SC04 count and SC08 closing-cue isolation, SC05 clap isolation, complete voice dependencies, corrected action order, separated audio/production-note semantics, top-level and prompt-level animation-manifest hash synchronization, future reference-specification bindings without asset claims, null live configuration, AP01–AP04 conditional approval evidence, pending AP05/AP06 review, a finite cost-blocked reference proposal, and absence of generated-media claims.

## M8 Phase 2 regression

| Suite | Result |
|---|---:|
| M8 contracts | PASS — 36 / 36 |
| M8 lifecycle | PASS — 93 / 93 |
| M8 hashing | PASS — 19 / 19 |
| M8 OpenArt adapter | PASS — 29 / 29 |
| M8 Story Vault schema | PASS — 33 / 33 |
| M8 workflow skeletons | PASS — 14 / 14 |
| M8 Phase 2 aggregate | PASS — 9 / 9 |

## M3–M7 regression

All applicable suites pass: canon initialization, canon lineage, continuity eligible selection, failure instrumentation, outline eligible selection, production package, and script eligible selection. M7 remains `63 / 63`.

## Conditional approvals and remediation

- AP01–AP04 record controlled `APPROVED` decisions by `Alex` at `2026-09-03T06:28:06.000Z`, with every approval condition preserved in the existing `notes` field.
- AP05 and AP06 remain `PENDING_REVIEW` with null decision, reviewer and timestamp.
- AP05 retains exact shot-level narration ranges or no-playback states, keeps the SC04 `"One,"` cue only in SH02, makes SC04-SH03 a silent patient hold, confines the SC05 soft muted clap to SH03 after the returning glow, keeps the SC08 closing cue in SH02, and makes SC08-SH03 a silent left-to-right departure and final visual fade.
- AP06 synchronizes only the affected shot prompts to AP05, binds its top-level and every prompt-level animation-manifest reference to the corrected AP05 content hash, retains future reference specification IDs without asset claims, leaves all provider/configuration fields null and non-callable, and keeps duration mapping unresolved pending A3 evidence.
- The Animation Production Director instructions were read in full and used only to validate the narrowly scoped audio, action and handoff synchronization. No creative package was broadly regenerated.

## Reference-generation proposal

- Exactly five reference sheets are specified.
- Each sheet proposes one initial generation operation and at most one separately approved bounded revision operation: five initial, five maximum revisions, ten maximum operations.
- Proposed route is OpenArt `TEXT_TO_IMAGE`, explicitly unverified; model remains null.
- Per-operation estimates, hard per-sheet caps and total cap remain null and `UNSET_BLOCKING_GENERATION` because the approved spike does not prove current reference-image unit cost.
- The proposal is unexecuted and states exactly: `PROPOSAL ONLY — NO OPENART ACCESS, GENERATION OR CREDIT SPEND AUTHORISED`.

## Issues and decisions

- Critical now: none.
- Material before next relevant gate: AP05/AP06 require final human review; actual reference bytes do not exist; provider/model/capability, current unit costs and hard reference caps remain unverified or unset; final shot timing still requires a scratch or approved voice performance.
- Parkable: D-015 and unrelated legacy/test workflow cleanup remain unchanged.
- No new material governance decision was required; `DECISION_LOG.md` remains unchanged.

## Systems and side effects

No external operational system other than the authorised GitHub repository was accessed. No n8n, Story Vault, Google Sheets, Google Drive, OpenArt, credential, canon, media or publishing system was accessed or modified.

No media was generated or retrieved; no credits were spent; no live approval record was created; no workflow was imported, executed, activated or published; no assembly or publication occurred. Phase 4 and the A3 n8n/OpenArt connectivity proof were not begun.

## Disposition

AP01–AP04 conditional approvals are recorded. The final AP05/AP06 determinism correction and the unchanged cost-blocked reference proposal satisfy their offline acceptance criteria and await human review. They grant no later-phase, provider, generation, assembly or publication authority.
