# Milo Script Pipeline v1 Specification

**Status:** Approved v1.0
**Milestone:** M5 — Script Pipeline  
**Initial orchestration:** n8n  
**Initial data store:** Google Sheets

## Purpose

Define the controlled M5 pipeline that converts one approved concept into:

1. a structured story outline
2. a reviewed and approved outline
3. a complete script
4. a reviewed and approved script

AI may generate creative outline and script content. n8n and deterministic rules must control eligibility, validation, routing, status changes, retries, approvals, storage, and logging. Alex retains final approval authority.

## Proposed status flow

```text
CONCEPT_APPROVED
→ OUTLINE_GENERATED
→ OUTLINE_APPROVED
→ SCRIPT_GENERATED
→ SCRIPT_APPROVED
```
## Stage 1 — Outline generation

### Eligibility

A Story is eligible only when:

- `status = CONCEPT_APPROVED`
- one approved concept exists for the Story
- the approved concept has already been processed
- no outline record already exists for the same `storyId`

### AI responsibility

Generate one structured story outline from the approved concept and approved Milo canon.

### Deterministic responsibility

n8n must:

- read the eligible Story
- read the approved concept
- prepare the outline input
- call the AI model
- validate the returned outline structure
- save one outline record
- update the Story status to `OUTLINE_GENERATED`
- route invalid output to safe failure handling

## Approved Outlines sheet

The Story Vault will use a new Google Sheets tab named:

```text
Outlines
storyId
outlineId
conceptId
title
opening
setup
incitingIncident
risingAction
climax
resolution
emotionalArc
lesson
targetLengthMinutes
canonReferences
canonVersion
canonRef
approvalStatus
approvalProcessedAt
createdAt
updatedAt
version
```
### Proposed deterministic rules

- outlineId format: MILO-###-O01
- one outline record per storyId in v1
- new outlines start with approvalStatus = PENDING_REVIEW
- approvalProcessedAt stays blank until approval is successfully processed
- version starts at 1
- createdAt and updatedAt use ISO 8601 timestamps
- canonVersion and canonRef must match the authoritative Story lineage
- runtime canon context is loaded at the Story's validated immutable canonRef, never the moving default branch
## Stage 2 — Outline approval

### Human responsibility

Alex reviews the generated outline and sets:

- `approvalStatus = APPROVED`
- `approvalStatus = REJECTED`
- `approvalStatus = UNDECIDED`

### Deterministic responsibility

n8n must:

- read one outline where `approvalStatus = APPROVED`
- require `approvalProcessedAt` to be blank
- validate `storyId`, `outlineId`, and `conceptId`
- confirm the source Story currently has `status = OUTLINE_GENERATED`
- update the Story status to `OUTLINE_APPROVED`
- stamp `approvalProcessedAt` only after the Story update succeeds
- route invalid approval data to safe failure handling
## Stage 3 — Script generation

### Eligibility

A Story is eligible only when:

- `status = OUTLINE_APPROVED`
- one approved outline exists for the Story
- the approved outline has already been processed
- no script record already exists for the same `storyId`

### AI responsibility

Generate one complete children’s story script from the approved outline and approved Milo canon.

### Deterministic responsibility

n8n must:

- read the eligible Story
- read the approved outline
- prepare the script input
- call the AI model
- validate the returned script structure
- save one script record
- update the Story status to `SCRIPT_GENERATED`
- route invalid output to safe failure handling
## Approved Scripts sheet

The Story Vault will use a new Google Sheets tab named:

Scripts

### Approved fields

storyId
scriptId
outlineId
conceptId
title
scriptText
wordCount
estimatedLengthMinutes
theme
lesson
canonReferences
canonVersion
canonRef
approvalStatus
approvalProcessedAt
createdAt
updatedAt
version

### Approved deterministic rules

- scriptId format: MILO-###-S01
- one script record per storyId in v1
- new scripts start with approvalStatus = PENDING_REVIEW
- approvalProcessedAt stays blank until approval is successfully processed
- version starts at 1
- createdAt and updatedAt use ISO 8601 timestamps
- canonVersion and canonRef must match the authoritative Story lineage
- an Outline/Story lineage mismatch fails before runtime canon retrieval
- runtime canon context is loaded at the Story's validated immutable canonRef, never the moving default branch
## Stage 4 — Script approval

### Human responsibility

Alex reviews the generated script and sets:

- `approvalStatus = APPROVED`
- `approvalStatus = REJECTED`
- `approvalStatus = UNDECIDED`

### Deterministic responsibility

n8n must:

- read one script where `approvalStatus = APPROVED`
- require `approvalProcessedAt` to be blank
- validate `storyId`, `scriptId`, `outlineId`, and `conceptId`
- confirm the source Story currently has `status = SCRIPT_GENERATED`
- update the Story status to `SCRIPT_APPROVED`
- stamp `approvalProcessedAt` only after the Story update succeeds
- route invalid approval data to safe failure handling
## Proposed n8n workflows

M5 will use four separate workflows:

1. `Milo Outline Generator v0.1`
2. `Milo Outline Approval v0.1`
3. `Milo Script Generator v0.1`
4. `Milo Script Approval v0.1`

Generation and approval must remain separate so that:

- creative generation cannot trigger approval processing
- approval processing cannot create duplicate creative records
- each workflow has one clear deterministic responsibility
- failures can be isolated and tested independently
## Shared validation rules

All M5 workflows must validate required identifiers and status transitions before writing data.

### Identifier formats

- `storyId`: `MILO-###`
- `conceptId`: `MILO-###-C0[1-3]`
- `outlineId`: `MILO-###-O01`
- `scriptId`: `MILO-###-S01`

### Required transition checks

- outline generation requires `CONCEPT_APPROVED`
- outline approval requires `OUTLINE_GENERATED`
- script generation requires `OUTLINE_APPROVED`
- script approval requires `SCRIPT_GENERATED`

### Safe-write rules

- do not create duplicate outline or script records
- do not advance a Story status when validation fails
- do not stamp `approvalProcessedAt` until the related Story update succeeds
- preserve the Story’s original `createdAt`
- refresh `updatedAt` only after a successful status change
- route invalid data to a structured failure payload
## Approved script length rules

- target script length: 650–800 words
- valid script range: 550–900 words
- scripts outside the valid range must fail validation
## Approved estimated-length rule

- calculate `estimatedLengthMinutes` as `wordCount ÷ 135`
- round the result to one decimal place
- store the calculated value in the Scripts sheet
## Approved AI configuration

- model: `gpt-5-mini`
- outline generation uses a dedicated prompt and Structured Output Parser
- script generation uses a separate dedicated prompt and Structured Output Parser
- both prompts must use approved Milo canon context
- model-setting changes require deliberate testing and documentation
## Approved retry rules

- maximum AI generation attempts per workflow run: 2
- retry only after AI-call failure or structured-output validation failure
- do not retry human approval failures
- after the second failed attempt, route to structured failure handling
- do not advance the Story status after a failed attempt
## Approved failure payload

All M5 safe-failure branches must return:

- `success`
- `errorCode`
- `message`
- `workflow`
- `storyId`
- `conceptId`
- `outlineId`
- `scriptId`
- `attempt`
- `failedAt`

Rules:

- `success` must be Boolean `false`
- identifiers not relevant to that workflow may be blank
- `attempt` records the failed generation attempt number
- `failedAt` uses an ISO 8601 timestamp
- failure payloads must not change Story status
## Approved rejection and regeneration rules

- rejected outlines and scripts are regenerated rather than manually revised in place
- regeneration updates the existing record for the same `storyId`
- increment `version` by 1
- preserve `createdAt`
- refresh `updatedAt`
- reset `approvalStatus` to `PENDING_REVIEW`
- clear `approvalProcessedAt`
- do not create `O02` or `S02` records in v1
