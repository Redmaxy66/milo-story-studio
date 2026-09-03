# M8 Phase 3 Approval Package — MILO-007-S01-P01

**Review package ID:** `MILO-007-S01-P01-P3REVIEW-V001`
**Status:** CONDITIONAL APPROVALS RECORDED — AP05/AP06 PENDING REVIEW
**M7 source snapshot SHA-256:** `c1221fe13d7278912b73572658dc569756de4baa98679b7e3567bd3768d98233`
**Design baseline:** revision 1.1, SHA-256 `6934b997f79e3d5aa7ff5b9405926abb8c9e401a1a539a31e16b1c32dac0d8a2`

This repository package records the project owner's repository-only conditional approvals. It is not a live Story Vault record and grants no generation, provider, workflow, assembly, publication, Phase 4, or A3 authority.

## Reference-governance approval

**AP01: APPROVED with conditions by Alex at `2026-09-03T06:28:06.000Z`.** The classification model, source derivation, rights/provenance gate, checksum binding, versioning/retirement, and disallowed deviations are approved. `APPROVED_PRODUCTION_CHOICE` remains a classification rather than proof that an image exists or is approved. Actual assets require separate human approval, complete rights/provenance, authoritative SHA-256, write-restricted durable storage, and new files/records/checksums/versions for revisions. Spike media remains historical evidence only.

## Production-intent and Film Director approval

**AP02 and AP03: APPROVED with conditions by Alex at `2026-09-03T06:28:06.000Z`.** The soft layered 2D/2.5D storybook treatment, restrained parallax/selective motion, warm amber and restrained cool-lantern lighting, child-safe contrast, stable camera, and 16:9 centre-safe framing are approved as episode-scoped non-canon choices. Milo is upright, hand-capable, uses a gentle small-step bipedal gait, and carries a rounded compact mustard-yellow two-strap backpack without visible invented inventory. The firefly uses a tiny simple insect-like silhouette, restrained wings, one glow source, four controlled glow stages, and unnamed restrained family lights. Protected M7 meaning, dialogue, scene order, and agency remain unchanged. The 24-fps and 240-second plan remains provisional until voice timing; later gates remain separate.

## Storyboard approval

**AP04: APPROVED with conditions by Alex at `2026-09-03T06:28:06.000Z`.** Approval covers the governed 24-shot / 32-panel text storyboard only. It does not approve generated storyboard images, final reference artwork, final timing, provider calls, motion generation, assembly, or publication. Downstream corrections preserve the approved shot and panel identities.

## Animation-manifest approval

**AP05 remains PENDING_REVIEW.** Targeted remediation now provides one authoritative narration binding, explicit non-overlapping shot ranges or no-playback states, non-overlapping dialogue windows, complete voice dependencies, corrected SC02/SC03/SC05/SC07/SC08 actions, and separated ambience/dialogue/SFX/music/production-note semantics. The revised artifact requires fresh human review and is not approved for rendering or assembly.

## Prompt-bundle approval

**AP06 remains PENDING_REVIEW.** Targeted remediation binds all prompts to future reference specification IDs, requires exact approved episode-reference matching without canonising production choices, preserves null provider configuration and non-callable status, and marks duration mapping unresolved pending A3 evidence. The revised bundle requires fresh human review and does not authorise a provider call.

## Unresolved creative choices

- Exact final reference artwork and the exact bytes that will implement the approved episode-scoped style, Milo model, firefly model, geography, palette, lighting, and relative scale.
- Final 24-fps and 240-second timing after a scratch or approved voice performance.
- Voice asset, music/SFX approach, and whether a later lip-sync capability gate is pursued or the voice-first fallback is approved.
- Provider route, current unit cost, hard reference-generation caps, and every later stage-specific cap.

## Deviations from M7

None. Camera, staging, timing, and prompt details are derived production choices pending review; they do not mutate the M7 package.

## Protected-meaning confirmation

Film Director, Storyboard Creator, and Animation Production Director were all used within their text-specification boundaries. None changed protected story meaning, dialogue, scene order, characterisation, canon, or M7 identities.

## Decision template

The repository-only JSON evidence is in `phase3-approval-record-templates-v1.json`. AP01–AP04 use the schema-valid `APPROVED` decision with their conditions in `notes`; AP05–AP06 remain `PENDING_REVIEW`. The five-sheet generation proposal is `reference-generation-proposal-v1.json` and remains unexecuted.
