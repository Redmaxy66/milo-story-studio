# Milo Story Studio

An n8n learning project that will turn a raw Milo story idea into a reviewed,
production-ready children's content package.

## Current position

- Phase: 2 — Story Development
- Current milestone: M4 — Concept Generator
- Overall progress: 50%
- Current week: Week 6 of 16
- Status: In progress

## This week's objective

- [x] Build `Milo Concept Generator v0.1`.
- [x] Generate exactly three structured concepts from one eligible story.
- [x] Validate and store concept options in the Concepts sheet.
- [x] Update Story status to `CONCEPT_GENERATED`.
- [x] Build separate `Milo Concept Approval v0.1`.
- [x] Process human-approved concepts deterministically.
- [x] Prevent repeat approval processing with `approvalProcessedAt`.
- [x] Complete controlled end-to-end testing with `MILO-002`.
- [ ] Complete final M4 closeout and mark the milestone complete.

## Current build

Two controlled n8n workflows:

- `Milo Concept Generator v0.1`
- `Milo Concept Approval v0.1`


## Latest achievement

Completed a controlled end-to-end M4 test using `MILO-002`. Three structured concepts were generated, validated, and stored. Human approval was separated into its own workflow, and `approvalProcessedAt` now prevents approved concepts from being processed repeatedly.

## Current blocker

None

## Main links

- [Project roadmap](PROJECT_ROADMAP.md)
- [Milestone tracker](MILESTONES.md)
- [Learning log](LEARNING_LOG.md)
- [Decision log](DECISION_LOG.md)
- [Claude Code instructions](CLAUDE.md)
