# Streamlined Milo build — 2026-09-05

**Non-paid build: COMPLETE WITH NOTES. Overall production replacement: PARTIAL pending paid integration, real-media validation and hosting.**

The reconciled handoff and approved replacement direction were recorded in governance commit `9eb375f72780ecf7aa75466ecd7b92774693af24`, parent `c601e85d256c21075e3fad18880e7895fb704dc4`. D-024 explicitly supersedes the old mandatory build topology and routine stage confirmations for this replacement. Former state/work order are archived. This chat owns the build; other chats are advisory. This GitHub record is durable coordination; no claim is made that a message was automatically delivered to other ChatGPT chats.

The build uses four operator stages and shared deterministic logic: week preparation, media request preparation/reconciliation, daily/weekly timeline assembly, and release packaging. Exports contain 20 nodes total, including four notes and eight triggers. This count describes the present non-paid foundation, not a like-for-like estimate of the eventual connected production service. The full old workflows remain preserved.

The weekly model retains the owner's fields and adds structured runtime operations and computed timing. The fixture demonstrates reordered episodes, four correct next-story bridges, six-second cold open/outro, 36 seconds of authorised hold removals, a selected thumbnail and chapter starts at 6, 124, 242, 360 and 478 seconds. No narration speed-up. Production edits still require actual editorial review.

## Verification

- Four saved inactive workflows passed n8n executions 513–516. Exact workflow IDs are in `n8n-installation.json`.
- 24 shared-logic/export test groups passed, including unsafe trims, incorrect hooks, stale approvals, paid lock, duplicate requests and ambiguous provider outcomes.
- SQLite tests cover stale revisions, competing connections, budget reservation and production lock.
- Real FFmpeg/ffprobe tests produced five 120-second/2,880-frame masters and one 600-second/14,400-frame compilation at 1280×720, 24fps with an audio stream. Independently read master hashes and measured durations passed release checks. These are neutral cards and silent audio, not approved Milo stories.
- A deliberately incorrect source hash was rejected against actual bytes before encoding. Wrong measured duration and changed final master hash were rejected.
- All 15 original repository validation scripts passed. Original tracked files outside the six explicitly authorised governance documents match the materialised baseline. Approved canon/reference files and original workflow exports are unchanged.

## Limits

No paid generation, uploads, production Sheet writes, original workflow mutations, workflow activation, cutover or public publication occurred. The earlier OpenArt spike remains ungenerated. Candidate nested `params` JSON passed local/n8n preparation; actual provider acceptance is not established.

The new stages accept explicit operator jobs and use fixtures for manual tests. Writing and media generation, durable retrieval, authenticated hosting, remote ledger integration and scheduling are remaining connections. The runner and ledger exist and work locally. Input approvals are content-bound records from a trusted operator; they are not authenticated signatures. Production setup must protect the operator/runner boundary and use the frozen canon file and approved reference pack. This is not yet an unattended five-day service.

## Next and rollback

Review `PAID_PILOT_PROPOSAL.md`: up to 750 existing OpenArt credits and US$5 writing/narration, no top-up, no automatic retry, maximum three ten-second video submissions, current quote verified before spend. Budget is requested, not approved. The eventual complete-week production validation and final cutover remain separate gates; publication remains separately approved.

Rollback requires leaving these four replacements inactive and unpublished. Original workflow IDs, exports and c601e85d remain available. Use normal revert commits for repository rollback; do not rewrite history, delete original data or automatically reactivate workflows.
