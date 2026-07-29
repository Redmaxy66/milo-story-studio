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

## 4. Structured concept output
Each generated concept option must use the same fixed structure so n8n can validate, compare, store, and route it deterministically.
Each concept option will contain:

- storyId
- conceptId
- title
- premise
- centralProblem
- emotionalArc
- theme
- lesson
- setting
- supportingCharacters
- targetLengthMinutes
- canonReferences
- approvalStatus
## 5. Field definitions

- storyId: the original Story Vault identifier
- conceptId: a deterministic identifier for one concept option
- title: a short working title for the concept
- premise: a concise summary of the story idea
- centralProblem: the main problem Milo must help address
- emotionalArc: the intended emotional journey
- theme: the main approved Milo value explored
- lesson: the possible child-friendly takeaway
- setting: the proposed story location
- supportingCharacters: proposed characters other than Milo
- targetLengthMinutes: the intended story duration
- canonReferences: approved Milo canon files used by the generator
- approvalStatus: the current human-review state

## 6. Approval states

The allowed approvalStatus values are:

- PENDING_REVIEW
- APPROVED
- REJECTED
- UNDECIDED

Only Alex may change a concept from PENDING_REVIEW or UNDECIDED to APPROVED or REJECTED.

No concept may proceed to M5 unless approvalStatus is APPROVED.

## 7. Concept identifiers

Each generated concept option will use:

- the original storyId from the Story Vault
- a conceptId in the format STORYID-C01, STORYID-C02, STORYID-C03

Example:

- MILO-006-C01
- MILO-006-C02
- MILO-006-C03

Version 1 will generate three concept options per eligible story.

## 8. Required validation rules

A generated concept option is valid only when:

- storyId is present
- conceptId matches the approved identifier format
- title is present
- premise is present
- centralProblem is present
- emotionalArc is present
- theme is present
- targetLengthMinutes is a positive number
- canonReferences contains at least one approved canon file
- approvalStatus is one of the allowed values

## 9. Initial workflow sequence

1. Select one eligible Story Vault record.
2. Confirm the record is allowed to enter M4.
3. Load the approved Milo canon references.
4. Send the story record and canon context to the Concept Generator.
5. Require structured output containing exactly three concept options.
6. Validate every concept option deterministically.
7. Attach conceptId and set approvalStatus to PENDING_REVIEW.
8. Present the three options for human review.
9. Record Alex's decision.
10. Allow only an APPROVED concept to proceed to M5.

## 10. Open decisions

The following decisions are not yet approved:

- which AI provider and model will generate the concepts

## 11. Approved status decisions

- M4 entry status: IDEA
- Status after concept generation: CONCEPT_GENERATED
- Status after human approval: CONCEPT_APPROVED
- Only Alex may approve a concept and trigger the transition to CONCEPT_APPROVED

## 12. Approved storage decision

- Concept options will be stored in a separate Google Sheets tab named Concepts.
- The existing Stories tab and its authoritative 14-column schema will not be changed.
- Each concept row will retain the original storyId.
- Each concept option will occupy one row in the Concepts tab.

## 13. Approved human-review decision

- Alex will review concept options in the Concepts tab.
- Each generated concept starts with approvalStatus set to PENDING_REVIEW.
- Alex may change one option to APPROVED.
- Alex may change unwanted options to REJECTED.
- If no decision has been made, the option remains PENDING_REVIEW or may be set to UNDECIDED.
- n8n must not change approvalStatus to APPROVED or REJECTED automatically.

## 14. Approved canon source set

The Concept Generator may use only these approved Milo Character Bible v1.0 files:

- MILO_CHARACTER.md
- MILO_BACKSTORY.md
- VOICE_GUIDE.md
- PERSONALITY_RULES.md
- VISUAL_REFERENCE.md

README.md is project documentation and is not part of the generator's canon context.

The delivery method for supplying these files to n8n remains an open decision.

## 15. Approved canon delivery decision

- A curated file named MILO_CANON_CONTEXT.md will be stored in 03-prompts.
- The file will be compiled only from the five approved Milo Character Bible v1.0 sources.
- The original files in 01-character-bible remain authoritative.
- MILO_CANON_CONTEXT.md is a delivery artifact, not a replacement for canon.
- Alex must review and approve the compiled context before n8n uses it.
- n8n will receive one reviewed canon context file rather than loading five separate files dynamically.