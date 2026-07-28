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