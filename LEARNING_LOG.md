# Learning Log

Create one entry at the end of each week.

---

## Week 1 — Foundation

### What I built

- A private GitHub repository for Milo Story Studio
- A nine-folder learning repository
- A live GitHub task board
- A dated 16-week roadmap
- A local clone of the repository
- A working Claude Code project environment

### What I learned

- The difference between GitHub and a local repository
- What cloning, staging, committing, and pushing mean
- How Claude Code reads CLAUDE.md project instructions
- How to inspect an AI-generated file edit using git status and git diff
- Why file changes should be reviewed before committing
- Basic Windows PATH troubleshooting

### What Claude helped with

- Reading the project documentation
- Confirming the project milestones and teaching method
- Updating README.md under supervision

### What I completed without assistance

- Created the GitHub repository
- Created the project board and roadmap
- Entered milestone dates
- Installed Git and Claude Code
- Ran Git commands using the supplied instructions

### Problems encountered

- Windows could not initially recognise the claude command
- Git could not initially create a commit because my author identity was missing

### How I fixed them

- Confirmed claude.exe existed and added its folder to the Windows PATH
- Configured my Git author name and email
- Retried the commit successfully

### Confidence scores

- GitHub: 2/5
- n8n: 1/5
- JSON: 1/5
- JavaScript: 1/5
- APIs: 1/5
- Claude Code: 2/5
- Debugging: 2/5

### Evidence

- GitHub repository created
- GitHub Project board and roadmap created
- Commit: Record Claude Code project setup
- Repository successfully pushed and working tree confirmed clean

### Next week's focus

- Complete the Milo Character Bible
- Prepare the source material needed for the first n8n workflow

---

## Week 3 — Story Vault

### What I built

- The Milo Story Vault Google Sheet
- The n8n workflow named “Milo Story Intake v0.1”
- Sequential Milo story ID generation
- Validation for rawIdea, theme, and targetLengthMinutes
- A safe failure branch that prevents invalid submissions from reaching Google Sheets
- A tested workflow export stored in 04-n8n-workflows/tested

### What I learned

- How n8n routes items through true and false branches
- Why front-end form validation does not replace workflow validation
- How to test invalid data safely without writing it to Google Sheets
- How to export an n8n workflow as JSON
- How to stage, commit, and push a tested workflow to GitHub

### Evidence

- Valid submission created MILO-005
- Invalid targetLengthMinutes value was routed to Prepare Validation Failure
- Invalid submission did not reach the Story Vault
- Workflow export committed as d28937c

---

## Week 6 — Concept Generator

### What I built

- The n8n workflow `Milo Concept Generator v0.1`
- Structured generation of three concept options from one eligible Story Vault idea
- Validation and safe-failure routing for generated concepts
- Storage of approved concept fields in the Concepts sheet
- Automatic Story status updates to `CONCEPT_GENERATED`
- A separate n8n workflow named `Milo Concept Approval v0.1`
- Human approval processing that updates a Story to `CONCEPT_APPROVED`
- An `approvalProcessedAt` safeguard that prevents repeat processing

### What I learned

- Why generation and approval should use separate workflows
- How shared triggers can cause unintended branches to execute
- How to filter Google Sheets rows using multiple AND conditions
- How n8n distinguishes fixed values from expressions
- How to validate IDs using Boolean expressions
- How to update related rows across two Google Sheets tabs
- Why processed records need a deterministic timestamp or status marker
- How Git can restore an accidentally overwritten exported workflow

### Problems encountered

- The original workflow ran generation and approval from the same Manual Trigger
- `Read Approved Concept` repeatedly selected an older approved concept
- The IF node treated some field names as fixed text instead of expressions
- The regex operator did not validate the concept ID as expected
- The approval workflow export accidentally overwrote the generator export

### How I fixed them

- Split approval into `Milo Concept Approval v0.1`
- Added `approvalProcessedAt` to the Concepts sheet
- Filtered for `approvalStatus = APPROVED` and a blank `approvalProcessedAt`
- Changed IF condition inputs to n8n expressions
- Used a Boolean JavaScript regex test for `conceptId`
- Restored the generator export with `git restore`
- Re-exported the approval workflow under its correct filename

### Evidence

- `MILO-002` generated exactly three concept options
- All three concepts passed validation and were stored
- `MILO-002` advanced to `CONCEPT_GENERATED`
- `MILO-002-C01` passed the original human approval test
- `MILO-002-C02` passed the separate approval workflow test
- `MILO-002-C02` received `approvalProcessedAt: 2026-07-31T20:55:07.271+08:00`
- Commit `88f65b3` — Complete M4 end-to-end concept test
- Commit `7a27653` — Add separate M4 concept approval workflow
- Repository pushed and working tree confirmed clean

### Next focus

- Complete the remaining M4 documentation
- Perform the final M4 closeout check
- Confirm whether M4 is ready to mark complete