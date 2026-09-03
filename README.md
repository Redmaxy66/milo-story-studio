# Milo Story Studio

An n8n learning project that will turn a raw Milo story idea into a reviewed,
production-ready children's content package.

## Current position

- Phase: 4 — Publishing and Hardening
- Current milestone: M8 — Complete Studio
- Overall progress: M8 in progress
- Current week: Week 13 of 16
- Status: Phase 2 repository contracts complete; all live and later phases remain separately gated

## Current M8 objective

- [x] Install the approved M8 design governance baseline.
- [x] Define provider-neutral M8 contracts, lifecycle values, error codes, hashing, and idempotency.
- [x] Define the OpenArt adapter interface and sanitized offline fixtures.
- [x] Specify the proposed Story Vault schema without creating live tabs.
- [x] Add inert workflow skeleton exports and deterministic offline validators.
- [x] Pass the M8 Phase 2 suite and complete applicable M3–M7 regression protection.
- [ ] Obtain a separate instruction before any later repository or A3 phase.

## Current build

Ten canonical stage workflows now cover Story Intake through Production Package:

- `Milo Story Intake v0.1`
- `Milo Concept Generator v0.1`
- `Milo Concept Approval v0.1`
- `Milo Outline Generator v0.1`
- `Milo Outline Approval v0.1`
- `Milo Script Generator v0.1`
- `Milo Script Approval v0.1`
- `Milo Continuity Reviewer v0.1`
- `Milo Continuity Approval v0.1`
- `Milo Production Package Generator v0.1`

The shared `Milo Failure Handler v0.1` remains the governed handled/unhandled failure sink. The canonical Production Package workflow is `SNnLunczq5mxrXLn`; it remains inactive/unpublished and its repository export matches the verified live definition after normalization of volatile n8n metadata.

M8 Phase 2 adds repository-only provider-neutral schemas, validators, hashing/idempotency modules, an offline OpenArt adapter boundary, proposed Story Vault schemas, sanitized fixtures, and 13 empty-node workflow skeleton exports. These artifacts contain no live configuration and authorize no external execution.

## Latest achievement

Completed the M8 Phase 2 repository contract gate. All seven M8 validators pass, including the `9 / 9` aggregate, and the full applicable M3–M7 regression collection remains green, including M7 at `63 / 63`.

## Current blocker

No Phase 2 acceptance blocker remains. The A3 n8n/OpenArt connectivity proof and every later M8 phase still require separate explicit authority. D-015 remains parked as post-M7 hardening debt.

## Main links

- [Project roadmap](PROJECT_ROADMAP.md)
- [Milestone tracker](MILESTONES.md)
- [Learning log](LEARNING_LOG.md)
- [Decision log](DECISION_LOG.md)
- [M7 canonical verification](06-testing/M7_CANONICAL_VERIFICATION.md)
- [M8 Phase 2 validation](06-testing/M8_PHASE2_VALIDATION.md)
- [Claude Code instructions](CLAUDE.md)
