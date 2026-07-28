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
- how approved canon files will be supplied to the generator
- where concept options will be stored
- how Alex will review and select an option
- which Story Vault status makes a record eligible for M4
- which Story Vault status is written after concept approval