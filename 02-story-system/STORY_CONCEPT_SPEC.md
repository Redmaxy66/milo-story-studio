# Milo Story Concept Generator v1 Specification

**Status:** Draft for review  
**Milestone:** M4 — Concept Generator  
**Initial workflow platform:** n8n

## 1. Purpose

The Story Concept Generator will take an approved Story Vault idea and turn it into structured Milo story concept options for human review and approval.

## 2. Version 1 scope

Version 1 will:

1. Read one eligible Story Vault record.
2. Establish first governed Story canon lineage only when D-014 permits it.
3. Use the approved Milo canon as reference.
4. Generate structured story concept options.
5. Keep the original storyId attached to every concept option.
6. Present the options for human review.
7. Record which concept was approved, rejected, or left undecided.
8. Prevent any concept from moving to M5 without human approval.

## 3. Outside Version 1 scope

Version 1 will not:

- write a full outline
- write a full script
- approve its own concepts
- change Milo canon
- publish content
- move a story into M5 automatically
- migrate PRE-CANON LEGACY records
- replace an already assigned Story canon lineage

## 4. Structured concept output

Each stored concept option uses a fixed structure so n8n can validate, compare, store, and route it deterministically.

### AI-generated creative fields

The Concept Generator AI returns exactly three concept options containing only:

- title
- premise
- centralProblem
- emotionalArc
- lesson
- setting
- supportingCharacters

The authoritative AI output schema is:

`STORY_CONCEPT_AI_OUTPUT_SCHEMA.json`

### Deterministic n8n control fields

After AI generation, n8n attaches these fields deterministically:

- storyId
- conceptId
- theme
- targetLengthMinutes
- canonReferences
- canonVersion
- canonRef
- approvalStatus

The AI must not generate or choose these control fields.

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
- canonVersion: the authoritative Story canon release identifier
- canonRef: the authoritative Story immutable Git commit reference used for runtime canon retrieval
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

## 9. Workflow sequence

1. Select one eligible Story Vault record in `IDEA`.
2. Classify its canon-initialisation state under D-014.
3. If and only if the Story is `PENDING` with blank lineage, prepare the explicitly governed approved canon release for first assignment.
4. If the Story is `PENDING` with the already valid expected governed lineage, treat it as recoverable partial initialization and complete only the marker transition.
5. Reject PRE-CANON LEGACY, malformed, conflicting, or impossible marker/lineage states deterministically without overwriting canon.
6. Persist any permitted first-assignment/recovery Story update and verify the resulting Story record.
7. Validate the Story `canonVersion` and immutable `canonRef` normally.
8. Load approved `MILO_CANON_CONTEXT.md` using exactly the validated Story `canonRef`; never use HEAD, the default branch, newest tag, or latest commit.
9. Pass the Story input, optional creative context, and approved canon context to the Concept Generator.
10. Require AI output containing exactly three creative concept options matching `STORY_CONCEPT_AI_OUTPUT_SCHEMA.json`.
11. Split the three concept options into individual items.
12. Attach storyId, conceptId, theme, targetLengthMinutes, canonReferences, canonVersion, canonRef, and approvalStatus deterministically in n8n.
13. Validate every complete concept option deterministically.
14. Store valid concept options in the Concepts tab.
15. Update the source Story status to CONCEPT_GENERATED once.
16. Present the stored concept options for human review through the separate approval workflow.
17. Allow only an APPROVED concept to proceed to M5.

## 10. Open decisions

The following decisions are not yet approved:

- which AI provider and model will generate the concepts

## 11. Approved status decisions

- M4 entry status: IDEA
- Status after concept generation: CONCEPT_GENERATED
- Status after human approval: CONCEPT_APPROVED
- Canon initialization does not introduce a Story lifecycle state.
- Only Alex may approve a concept and trigger the transition to CONCEPT_APPROVED.

## 12. Approved storage decision

- Concept options will be stored in a separate Google Sheets tab named Concepts.
- The Stories tab remains authoritative for Story canon identity.
- Concept Generator may write `Stories.canonVersion`, `Stories.canonRef`, and `Stories.canonInitializationState` only for the D-014 first-assignment/recovery transition.
- Concept Generator never automatically replaces an already valid Story canon lineage.
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

n8n Cloud loads the reviewed `03-prompts/MILO_CANON_CONTEXT.md` from the GitHub repository at the Story's validated immutable `canonRef`, extracts it into `canonContext`, and supplies it to the Concept Generator as a system message.

## 15. Approved canon delivery decision

- A curated file named MILO_CANON_CONTEXT.md will be stored in 03-prompts.
- The file will be compiled only from the five approved Milo Character Bible v1.0 sources.
- The original files in 01-character-bible remain authoritative.
- MILO_CANON_CONTEXT.md is a delivery artifact, not a replacement for canon.
- Alex must review and approve the compiled context before n8n uses it.
- n8n will receive one reviewed canon context file rather than loading five separate files dynamically.

## 16. D-014 canon-initialisation contract

The controlled Story field is `canonInitializationState`.

Persisted values:

- `PENDING`
- `ASSIGNED`
- blank only for historical/governed pre-contract records.

Only Story Intake normally creates `PENDING`. Only Concept Generator normally performs `PENDING -> ASSIGNED`.

The current explicitly governed approved release is:

- `canonVersion = canon-v1.0`
- `canonRef = 977755913d9ad41e4f16392d01ea993507af4102`

This release mapping is a governed workflow configuration under D-008/D-014. It is not inferred from repository HEAD, the default branch, newest tag, or latest commit. Changing the approved release requires a separately governed repository change.

### Deterministic state matrix

| Marker | Stored lineage | Behaviour |
|---|---|---|
| blank | blank | PRE-CANON LEGACY; reject; never initialise |
| `PENDING` | blank | eligible `IDEA` Story: assign current governed release once, then mark `ASSIGNED` |
| `PENDING` | exact expected governed lineage | recover partial initialization; preserve canon values and complete marker to `ASSIGNED` |
| `PENDING` | malformed or conflicting | integrity failure; do not overwrite |
| `ASSIGNED` | valid expected governed lineage | accept unchanged |
| `ASSIGNED` | blank, malformed, or conflicting | integrity failure |
| blank | valid expected governed lineage | accept unchanged; marker absence alone does not make it legacy |

A Story with a valid but different lineage is not silently migrated to the current release. Under the current single approved release configuration, it fails the first-assignment integrity check rather than being overwritten.

First assignment is allowed only when Story status is `IDEA` and no Concepts already exist for that Story.

## 17. Failure and recovery contract

The Concept Generator must fail before creative generation when:

- the governed release configuration is missing or invalid;
- a `PENDING` or `ASSIGNED` marker conflicts with Story lineage;
- an eligible first-assignment Story cannot be persisted safely;
- post-write verification does not produce the exact intended canon/marker state.

A recoverable partial state is only:

`PENDING + exact expected canonVersion/canonRef`

In that case Concept Generator must not replace either canon field. It completes only the marker transition to `ASSIGNED`, re-reads/verifies the Story, then proceeds through ordinary canon-lineage validation.

An ambiguous state is never repaired by overwriting existing canon.
