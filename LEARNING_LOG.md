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
