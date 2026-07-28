# Milo Story Concept Generator v1 Specification

**Status:** Draft for review  
**Milestone:** M4 — Concept Generator  
**Initial workflow platform:** n8n

## 1. Purpose

The Story Concept Generator will take an approved Story Vault idea and turn it into structured Milo story concept options for human review and approval.

## 2. Version 1 scope

Version 1 will:

1. Read one eligible Story Vault record.
2. Use the approved Milo canon as reference.
3. Generate structured story concept options.
4. Keep the original storyId attached to every concept option.
5. Present the options for human review.
6. Record which concept was approved, rejected, or left undecided.
7. Prevent any concept from moving to M5 without human approval.

## 3. Outside Version 1 scope

Version 1 will not:

- write a full outline
- write a full script
- approve its own concepts
- change Milo canon
- publish content
- move a story into M5 automatically
- replace the Story Vault schema