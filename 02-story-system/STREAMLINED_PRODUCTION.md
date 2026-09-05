# Streamlined Milo production

Approved scope: five 120-second weekday episodes and one 600-second weekly compilation. This supersedes implementation topology, not approved canon/history.

## Four operator stages

1. Week preparation: one explicit week ID and five briefs; batch script/continuity review; narration timing before footage.
2. Media queue: exact approved requests, bounded spend, one record per attempt, reconciliation and durable approved output.
3. Assembly: daily or compilation timeline, exact sources, external FFmpeg runner and measured duration.
4. Release package: title, kid-safe 2–3-sentence description without links, tags, thumbnail and computed chapters; human release approval.

Shared deterministic code is embedded into n8n exports from one source. There is no new live Story Vault migration. Original stages remain recoverable; old rows are not scanned for eligibility.

## Compact job

A week contains five episode IDs (ep_mon through ep_fri), fixed canon, script version, hook sentence, timed shots and exact human review. A media request carries source version, references, settings, estimate and operational cap. Attempts/costs/assets remain traceable without requiring 12 spreadsheet tabs.

Retain owner compilation fields: week_id, title, description, tags, target_runtime_sec, order, cold_open, bridges, outro, thumbnail_shot, chapters, estimated_runtime_sec, runtime_adjustment. Add runtime_adjustments for explicit operations and actual_runtime_sec after measurement. Four bridges introduce the next episode in compilation order. A null motion_asset_id uses an approved background hold, not new generation.

Five 120-second masters already equal 600 seconds. Compile from source timelines and remove only authorised wrappers/holds to make room for cold open, bridges and outro. Example: 564 seconds story edits + 6 cold open + four 6-second bridges + 6 outro = 600. Accepted range 590–610. No silent story cuts, accelerated narration or trims beyond approved handles. Chapters are computed after edits.

## Implementation boundary

Synthetic fixtures prove controls/assembly, never media quality, provider charges or human approvals. Build workflows remain inactive and non-paid. Actual provider/narration generation is checked in a budgeted pilot. n8n Cloud cannot execute FFmpeg; the local external runner is a real finishing implementation, with unattended hosting a later cutover dependency.

Normal review: batch scripts/budget, rough cut, final package. Material continuity, reference, rights and spending exceptions still escalate. Metadata preparation does not authorise publication.
