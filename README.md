# Milo Story Studio

An n8n learning project that will turn a raw Milo story idea into a reviewed,
production-ready children's content package.

## Current position

- Phase: 2 — Concepts and Scripts
- Current milestone: M4 — Concept Generator
- Overall progress: 40%
- Current week: Week 5 of 16
- Status: In progress

## This week's objective

- [x] Draft the M4 Story Concept Generator specification.
- [x] Build the initial n8n concept-generation workflow.
- [x] Generate exactly three structured concept options.
- [x] Store valid concept options in the Concepts tab.
- [x] Update the source story to CONCEPT_GENERATED.
- [x] Add deterministic validation and safe failure routing.
- [ ] Add and test human concept approval.
- [ ] Complete M4 test documentation.
- [ ] Export the tested workflow and complete M4 documentation.

## Current build

Milo Concept Generator v0.1 — Development checkpoint

## Latest achievement

Built and tested the first M4 concept-generation path. The workflow reads one eligible IDEA record, generates exactly three structured concept options, validates each option, blocks invalid output from storage, saves valid concepts to the Concepts tab, and updates the source story to CONCEPT_GENERATED.

## Current blocker

Human concept approval and remaining M4 test documentation are not yet complete.

## Main links

- [Project roadmap](PROJECT_ROADMAP.md)
- [Milestone tracker](MILESTONES.md)
- [Learning log](LEARNING_LOG.md)
- [Decision log](DECISION_LOG.md)
- [Claude Code instructions](CLAUDE.md)
