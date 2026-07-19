# Milo Story Vault v1 Specification

**Status:** Approved for Version 1 build  
**Milestone:** M3 — Story Vault  
**Initial data store:** Google Sheets

## 1. Purpose

The Milo Story Vault is the structured record of every Milo story idea.

It will receive ideas from an n8n form, standardise the submitted information,
assign a unique story ID, store the record, and confirm that the idea has been
captured successfully.

## 2. Learning objectives

This build will teach:

- n8n form triggers
- input and output data
- basic JSON structure
- field mapping
- expressions
- validation
- Google Sheets integration
- unique identifier generation
- workflow testing
- workflow export and version control

## 3. Version 1 scope

Version 1 will:

1. Accept a Milo story idea through an n8n form.
2. Check that required information is present.
3. Standardise the submitted fields.
4. Generate a unique sequential story ID.
5. Add system timestamps and status.
6. Save the record to Google Sheets.
7. Display or send a successful-capture confirmation.
8. Record invalid submissions as failed tests rather than storing them.

## 4. Outside Version 1 scope

Version 1 will not:

- generate story concepts
- write outlines or scripts
- use an AI agent
- approve or reject creative content
- generate images, video, or voice
- publish content
- manage multiple simultaneous users
- replace Google Sheets with a production database

These capabilities belong to later milestones.

## 5. Story ID format

The Story Vault will use:

MILO-001  
MILO-002  
MILO-003

The workflow will identify the highest existing number and add one.

This is acceptable for a single-user, low-volume learning project.

It is not intended as a concurrency-safe production identifier.

## 6. Story intake fields

### User-entered fields

| Field | Required | Description |
|---|---|---|
| rawIdea | Yes | The original story idea in the user's own words |
| workingTitle | No | An optional early title |
| theme | Yes | The main theme or value explored by the story |
| lesson | No | The possible lesson or emotional takeaway |
| setting | No | The proposed story location |
| supportingCharacters | No | Proposed characters other than Milo |
| targetLengthMinutes | Yes | Approximate intended story length |
| notes | No | Additional creative notes |

### System-generated fields

| Field | Description |
|---|---|
| storyId | Unique sequential Milo identifier |
| createdAt | Date and time the record was created |
| updatedAt | Date and time the record was last updated |
| status | Initial story status, set to IDEA |
| ageRange | Initial audience range, set to 5-10 |
| version | Initial record version, set to 1 |

## 7. Google Sheet column order

1. storyId
2. createdAt
3. updatedAt
4. status
5. workingTitle
6. rawIdea
7. ageRange
8. theme
9. lesson
10. setting
11. supportingCharacters
12. targetLengthMinutes
13. notes
14. version

## 8. Initial theme options

The form may offer these approved Milo themes:

- Kindness
- Courage
- Friendship
- Curiosity
- Patience
- Creativity
- Confidence
- Honesty
- Understanding and managing emotions
- Other

## 9. Validation rules

A submission is valid when:

- rawIdea is present and not blank
- theme is present
- targetLengthMinutes is a positive number
- no system-generated field has been entered manually
- the generated story ID does not already exist

Invalid submissions must not be written to the main Story Vault table.

## 10. Workflow sequence

1. Story Intake Form trigger
2. Validate required fields
3. Standardise the input
4. Read existing Story Vault records
5. Calculate the next story ID
6. Add timestamps, status, age range, and version
7. Write the record to Google Sheets
8. Return a confirmation
9. Record the execution result

## 11. Minimum test cases

### Valid tests

1. Complete submission with every optional field.
2. Submission containing only required fields.
3. Submission with multiple supporting characters.

### Invalid tests

4. Missing raw idea.
5. Missing theme.
6. Zero or negative target length.
7. Non-numeric target length.
8. Duplicate story ID simulation.
9. Google Sheets connection failure.

## 12. Definition of done

M3 is complete when:

- the Story Vault specification is approved
- the Google Sheet exists with the correct columns
- the n8n form captures the required data
- the workflow generates unique sequential story IDs
- valid submissions are stored correctly
- invalid submissions are handled safely
- at least three valid and four invalid tests are documented
- the workflow is clearly named
- the workflow JSON is exported to the repository
- the learning log is updated
- Alex can explain the workflow from trigger to storage

## 13. Future upgrades

Later versions may add:

- a relational database
- automated concept generation
- semantic search
- character and continuity retrieval
- attachments and creative assets
- story version history
- approval workflows
- user roles
- dashboards and production reporting

## 14. Approved Version 1 decisions

### Google Sheet name

The initial spreadsheet will be named:

Milo Story Vault

### Submission confirmation

Successful submissions will initially display an on-screen confirmation.

Email or messaging confirmations may be added in a later version.

### Supporting-character input

Supporting characters will be entered in the form as comma-separated text.

The n8n workflow will:

1. split the text at each comma
2. remove unnecessary surrounding spaces
3. remove blank entries
4. store the result as a structured array

Example form input:

Pip, Granny Bramble, Luma

Expected structured result:

[
  "Pip",
  "Granny Bramble",
  "Luma"
]

The example names do not establish new Milo canon. They demonstrate only the
planned data format.

### Invalid-submission logging

Version 1 will not create a separate error-log spreadsheet tab.

Invalid test submissions will be reviewed through n8n execution history and
documented in the repository test records.

A dedicated error log may be added after the main intake workflow is stable.

### Story ID scheme

Version 1 will retain sequential identifiers:

MILO-001
MILO-002
MILO-003

This approach is approved only for the single-user learning prototype.

The identifier method must be reviewed before the system supports multiple
simultaneous users or higher-volume production.
