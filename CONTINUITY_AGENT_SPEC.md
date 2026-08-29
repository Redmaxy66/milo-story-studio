# Milo Continuity Agent Specification

**Version:** 1.0
**Milestone:** M6 — Continuity Agent
**Status:** Approved and implemented

## 1. Purpose

The Milo Continuity Agent reviews an approved script against approved Milo canon and continuity rules before the script proceeds to production preparation.

The agent acts as a quality-control gate.

It identifies continuity problems but does not rewrite the script.

## 2. Input eligibility

A script is eligible for continuity review only when:

- `storyId` matches `^MILO-[0-9]{3}$`
- `scriptId` equals `${storyId}-S01`
- `outlineId` equals `${storyId}-O01`
- `conceptId` matches `^MILO-[0-9]{3}-C0[1-3]$`
- `conceptId` belongs to the same `storyId`
- `approvalStatus = APPROVED`
- `approvalProcessedAt` is populated
- Story status is `SCRIPT_APPROVED`
- script text is non-empty
- version is valid

Invalid input must not reach AI review.

## 3. Authoritative sources

Primary approved sources:

- `01-character-bible/MILO_CHARACTER.md`
- `01-character-bible/MILO_BACKSTORY.md`
- `01-character-bible/PERSONALITY_RULES.md`
- `01-character-bible/VOICE_GUIDE.md`
- `01-character-bible/VISUAL_REFERENCE.md`

Derived continuity source:

- `02-story-system/CONTINUITY_RULES.md`

Runtime canon context:

- `03-prompts/MILO_CANON_CONTEXT.md`

Approved source files always override derived files.

## 4. Deterministic checks

Before AI review, n8n / Code nodes must validate:

- valid Story ID
- valid Script ID
- valid Outline ID
- valid Concept ID
- cross-ID consistency
- script approval status
- script approval timestamp
- Story readiness
- non-empty script text
- valid version
- no duplicate continuity assessment for the same script version

Deterministic failures must return structured failure payloads and stop processing.

## 5. AI continuity checks

The AI review must assess:

### Character identity
Does Milo remain consistent with approved identity and role?

### Personality
Does Milo remain cheerful, curious, kind, brave, compassionate, optimistic, playful, encouraging, and emotionally safe?

### Behaviour
Does Milo respond appropriately to fear, mistakes, sadness, conflict, uncertainty, and curiosity?

### Voice
Is Milo's dialogue child-friendly, warm, clear, playful, comforting, and appropriate for ages 5–10?

### Backstory
Does the script contradict Milo's approved origin, Granny Bramble relationship, glowing-star purpose, or core purpose?

### Appearance
Where physical descriptions appear, do they remain consistent with approved visual canon?

### Moonberry Wood
Where the setting appears, does it remain compatible with its warm, safe, playful, magical identity?

### Theme and lesson
Does the script remain compatible with Milo's approved values and intended child-facing purpose?

### Open canon
Does the script assert unresolved canon as if it were established fact?

### Internal story continuity
Does the script contradict itself regarding events, objects, characters, locations, motivations, or sequence?

## 6. Finding severity

Each finding must have one of three severity levels:

### BLOCKER
A direct contradiction of approved canon, serious emotional-safety problem, or major internal contradiction.

A BLOCKER prevents progression.

### WARNING
A probable continuity concern, ambiguity, or open-canon assertion requiring human review.

A WARNING requires review but does not automatically mean the script is unusable.

### INFO
A minor observation or possible improvement that does not materially threaten continuity.

INFO does not block progression.

## 7. Overall result

The continuity assessment returns one of:

### PASS
No BLOCKER findings and no WARNING findings.

### REVIEW_REQUIRED
No BLOCKER findings, but one or more WARNING findings exist.

### FAIL
One or more BLOCKER findings exist.

INFO findings do not affect the overall result.

The reported `blockerCount`, `warningCount`, and `infoCount` must exactly match the severities present in the `findings` array.

## 8. Evidence requirement

Every AI-generated finding must contain:

- finding ID
- category
- severity
- short title
- explanation
- exact or concise script evidence
- canon rule or source reference
- recommended human action

The agent must not generate unsupported findings.

If the issue cannot be tied to approved canon or internal script consistency, it should not be classified as a continuity violation.

## 9. Structured output

The AI must return:

```json
{
  "storyId": "MILO-001",
  "scriptId": "MILO-001-S01",
  "assessmentResult": "PASS",
  "summary": "No continuity issues found.",
  "blockerCount": 0,
  "warningCount": 0,
  "infoCount": 0,
  "findings": [
    {
      "findingId": "F01",
      "category": "VOICE",
      "severity": "WARNING",
      "title": "Possible tone inconsistency",
      "explanation": "Explanation of the issue.",
      "scriptEvidence": "Relevant script evidence.",
      "canonReference": "VOICE_GUIDE.md",
      "recommendedAction": "Human review recommended."
    }
  ]
}
```

Allowed `assessmentResult` values:

- `PASS`
- `REVIEW_REQUIRED`
- `FAIL`

Allowed severity values:

- `BLOCKER`
- `WARNING`
- `INFO`

## 10. Storage

Create a `Continuity Reviews` Story Vault tab.

Minimum fields:

- `storyId`
- `scriptId`
- `reviewId`
- `scriptVersion`
- `assessmentResult`
- `summary`
- `blockerCount`
- `warningCount`
- `infoCount`
- `findingsJson`
- `reviewStatus`
- `reviewProcessedAt`
- `createdAt`
- `updatedAt`
- `version`

Recommended review ID:

`MILO-001-S01-R01`

## 11. Review status

Initial generated review:

`PENDING_REVIEW`

Human review may set:

- `APPROVED`
- `REVISION_REQUIRED`

A generated `FAIL` assessment cannot be approved for production progression. Human review may acknowledge the result, but the Story must route to `SCRIPT_REVISION_REQUIRED`.

## 12. Story status model

Recommended new Story statuses:

- `CONTINUITY_REVIEWED`
- `CONTINUITY_APPROVED`
- `SCRIPT_REVISION_REQUIRED`

Flow:

`SCRIPT_APPROVED`
→ continuity assessment generated
→ `CONTINUITY_REVIEWED`

Then:

PASS + human approval
→ `CONTINUITY_APPROVED`

REVIEW_REQUIRED
→ human decision
→ `CONTINUITY_APPROVED` or `SCRIPT_REVISION_REQUIRED`

FAIL
→ `SCRIPT_REVISION_REQUIRED`

No automatic script rewriting occurs.

## 13. Workflow architecture

M6 should use two workflows.

### Milo Continuity Reviewer v0.1

Responsibilities:

- read eligible approved Script
- validate deterministic requirements
- prevent duplicate review generation
- load canon context and continuity rules
- perform structured AI review
- validate AI output
- store Continuity Review
- mark Story `CONTINUITY_REVIEWED`
- provide structured failures

### Milo Continuity Approval v0.1

Responsibilities:

- read one human-reviewed continuity record
- validate review decision
- prevent repeat processing
- update Story to:
  - `CONTINUITY_APPROVED`, or
  - `SCRIPT_REVISION_REQUIRED`
- stamp `reviewProcessedAt`
- support repair path where Story status changed but review stamp failed
- provide structured failures

## 14. Failure handling

Recommended deterministic error codes:

- `SCRIPT_NOT_READY_FOR_CONTINUITY_REVIEW`
- `APPROVED_SCRIPT_INVALID`
- `CONTINUITY_REVIEW_ALREADY_EXISTS`
- `CONTINUITY_AI_OUTPUT_INVALID`
- `CONTINUITY_REVIEW_SAVE_FAILED`
- `STORY_CONTINUITY_STATUS_UPDATE_FAILED`
- `CONTINUITY_APPROVAL_INVALID`
- `STORY_NOT_READY_FOR_CONTINUITY_APPROVAL`
- `CONTINUITY_APPROVAL_STAMP_FAILED`

All failures should include, where available:

- `success`
- `errorCode`
- `message`
- `workflow`
- `storyId`
- `scriptId`
- `reviewId`
- `attempt`
- `failedAt`

## 15. Retry rules

AI generation may be retried only when:

- the AI call fails technically
- structured output is malformed
- required fields are missing

A retry must not occur merely because the assessment result is FAIL or REVIEW_REQUIRED.

Continuity findings are review outcomes, not workflow failures.

## 16. Open-canon handling

Open canon must not automatically be classified as contradiction.

If the script asserts an unresolved detail as fact:

- category: `OPEN_CANON`
- default severity: `WARNING`
- result: at least `REVIEW_REQUIRED`

Human review decides whether to:

- accept temporarily
- revise the script
- formally update canon through change control

## 17. Human-review principle

AI does not make final canon decisions.

Human approval is required before a continuity-reviewed script proceeds to production.

## 18. Test plan

Minimum tests:

### Happy path
Approved script fully consistent with canon.
Expected: `PASS`.

### Personality violation
Milo behaves harshly or sarcastically.
Expected: BLOCKER and `FAIL`.

### Backstory contradiction
Script gives Milo a conflicting origin.
Expected: BLOCKER and `FAIL`.

### Open-canon assertion
Script states Granny Bramble's species as established fact.
Expected: WARNING and `REVIEW_REQUIRED`.

### Voice issue
Dialogue becomes clearly babyish or frightening.
Expected: appropriate continuity finding.

### Internal contradiction
Script contradicts an earlier event in the same script.
Expected: BLOCKER or WARNING depending on materiality.

### Duplicate review
Same script version submitted twice.
Expected: deterministic rejection before AI call.

### Story not ready
Story status is not `SCRIPT_APPROVED`.
Expected: deterministic failure.

### Malformed AI output
Required structured field missing.
Expected: validation failure / controlled retry.

### Approval repair
Story already updated but `reviewProcessedAt` blank.
Expected: stamp-only repair path.

## 19. Completion criteria

M6 is complete when:

- Continuity Rules v1.0 are approved
- Continuity Reviewer v0.1 is built
- Continuity Approval v0.1 is built
- Continuity Reviews tab exists
- deterministic validation is proven
- duplicate protection is proven
- PASS test is proven
- REVIEW_REQUIRED test is proven
- FAIL test is proven
- open-canon handling is proven
- approval repair path is proven
- structured failure handling is proven
- workflows are exported
- repository documentation is updated
- workflows and documentation are committed and pushed
