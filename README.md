# Milo Story Studio

An n8n learning project that will turn a raw Milo story idea into a reviewed,
production-ready children's content package.

## Current position

- Phase: 3 — Continuity and Production
- Current milestone: M7 — Production Package
- Overall progress: 87.5%
- Current week: Week 12 of 16
- Status: Complete — canonical verification passed; M8 remains separately gated and has not started

## This week's objective

- [x] Define the Production Package contract and storage schema.
- [x] Confirm required scene, visual, voice, animation, and metadata fields.
- [x] Define deterministic validation, versioning, and approval controls.
- [x] Build and validate the repository M7 workflow export.
- [x] Configure and verify canonical M7 under separate A3 authority.
- [x] Reconcile the verified workflow, evidence, and governance state.

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

## Latest achievement

Completed M7 canonical verification through execution `#432`. The resolver returned `NOOP_COMPLETE`, `Route M7 Action` emitted one item on terminal output 3, and no generation, append, Story update, failure preparation, Failure Handler, retry, or M8 action occurred. The governed package remains one header plus eight scenes, and the complete M7 offline suite passes `63 / 63`.

## Current blocker

No M7 completion blocker remains. The D-015 optional-identifier `"undefined"` issue remains parked as post-M7 hardening debt. The project is `READY FOR M8`, but M8 requires a new, separately authorised work order and has not started.

## Main links

- [Project roadmap](PROJECT_ROADMAP.md)
- [Milestone tracker](MILESTONES.md)
- [Learning log](LEARNING_LOG.md)
- [Decision log](DECISION_LOG.md)
- [M7 canonical verification](06-testing/M7_CANONICAL_VERIFICATION.md)
- [Claude Code instructions](CLAUDE.md)
