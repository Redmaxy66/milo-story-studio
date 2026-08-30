# Test Cases

## M3 — Story Vault

### Valid tests

#### V-001 — Complete valid submission

- Input: all required fields completed, with optional fields included
- Expected result: submission passes validation, receives the next sequential Milo ID, and is stored in Google Sheets
- Actual result: passed
- Evidence: MILO-006 stored with supportingCharacters as ["Pip", "Luma", "Granny Bramble"]

#### V-002 — Required fields only

- Input: rawIdea, theme, and targetLengthMinutes completed; optional fields left blank
- Expected result: submission passes validation and is stored with the system-generated default fields
- Actual result: passed
- Evidence: MILO-002 stored with status IDEA, ageRange 5-10, version 1, and blank optional fields

#### V-003 — Multiple supporting characters

- Input: valid submission with multiple supporting characters entered as comma-separated text
- Expected result: names are split, trimmed, blank entries removed, and the structured result is stored
- Actual result: passed
- Evidence: MILO-006 stored with supportingCharacters as ["Pip", "Luma", "Granny Bramble"]

### Invalid tests

#### I-001 — Missing raw idea

- Input: rawIdea left blank
- Expected result: submission is rejected and no Story Vault row is created
- Actual result: blocked by the n8n form before workflow execution
- Evidence: Story Idea is configured as a required form field

#### I-002 — Missing theme

- Input: theme left blank
- Expected result: submission is rejected and no Story Vault row is created
- Actual result: blocked by the n8n form before workflow execution
- Evidence: Main theme is configured as a required form field

#### I-003 — Zero target length

- Input: otherwise valid submission with targetLengthMinutes set to 0
- Expected result: submission is rejected and no Story Vault row is created
- Actual result: passed
- Evidence: Validate Story Submission routed the item through the false branch to Prepare Validation Failure; Story Vault nodes did not execute

#### I-004 — Non-numeric target length

- Input: targetLengthMinutes supplied as non-numeric text
- Expected result: submission is rejected and no Story Vault row is created
- Actual result: passed
- Evidence: Standardise Story Data rejected NaN with a number-type error before validation or any Story Vault read/write node executed

## M6.5 Phase 1 — Failure Instrumentation

### Offline validation

Run `node 06-testing/validate_failure_instrumentation.mjs`.

| Test | Expected result | Repository result |
|---|---|---|
| FI-001 — Handled validation failure | Normalizes to all 18 columns with `sourceType=HANDLED`, `status=OPEN`, and the original code. | Passed with `APPROVED_SCRIPT_INVALID`. |
| FI-002 — Handled Sheets write failure payload | Preserves the save-failure code and produces a stable `failureId` for the same source event. | Passed with `SCRIPT_SAVE_FAILED`. |
| FI-003 — Unhandled crash payload | Captures workflow, execution, failing node, node type, and message with `sourceType=UNHANDLED`. | Passed with a synthetic Error Trigger payload. |
| FI-004 — Row completeness | Emits exactly the documented 18 columns in order. | Passed. |
| FI-005 — No duplicate append retry | No Google Sheets append node has `retryOnFail=true`; repeated normalization yields the same `failureId`. | Passed. |
| FI-006 — Local code retention | Every baseline code remains in the exports and the handler preserves the supplied code. | Passed, 35 of 35 baseline codes. |
| FI-007 — Lifecycle isolation | Handler targets only `FailureLog`; local Story/artifact statuses are not emitted or updated. | Passed. |

### Live acceptance required

After the live configuration checklist in `02-story-system/FAILURE_INSTRUMENTATION.md` is complete:

1. Trigger a safe handled validation failure and verify one complete `FailureLog` row.
2. In a disposable test execution, route a synthetic Sheets error payload through `Prepare Script Save Failure`; do not disconnect or corrupt production credentials.
3. Trigger a controlled unhandled crash in a disposable source-workflow copy and verify the Error Workflow path.
4. Confirm the stored local `errorCode` is unchanged.
5. Confirm the Story and artifact lifecycle cells did not change.
6. Confirm the append node made one attempt and has no automatic retry setting.
