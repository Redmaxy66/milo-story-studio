# WORK_ORDER.md
## Milo Story Studio — M8 Complete Studio

**Status:** Active — Phase 3 complete; OpenArt proof and `REFSHEET01` V01/V02 route evidence reconciled; Character Library deferred without a current M8 block; final `REFSHEET01`, Phase 4 and all further A3 activity remain separately gated
**Project:** Redmaxy66/milo-story-studio  
**Milestone:** M8 — Complete Studio  
**Design basis:** MILO_M8_DESIGN_APPROVAL_PACKAGE.md revision 1.1  
**Design package SHA-256:** 6934b997f79e3d5aa7ff5b9405926abb8c9e401a1a539a31e16b1c32dac0d8a2  
**Entry repository HEAD:** 0bd7c7ef64f3d582df2a239409e5c62ce5c83eca

## 1. Objective

Implement and validate an approval-controlled complete studio that consumes immutable M7 Production Packages, creates approved production intent and references, generates and approves realised media, assembles an approved episode, and prepares approved platform publishing packages without public publication.

## 2. Authority

Authority is staged.

Approval or installation of this work order is a governance action only. It does not itself authorise A2 implementation or any A3 activity. Every implementation phase requires a separate explicit user instruction that names its scope and completion contract; no phase inherits authority.

- A2 is the authority ceiling for repository specifications, schemas, prompts, validators, workflow exports, offline fixtures/tests, documentation, and approved non-production artifacts, but each A2 phase still requires its own explicit instruction.
- A3 is the authority ceiling for Story Vault schema changes, n8n/credential configuration, OpenArt or other provider execution, paid generation, durable-media writes, assembly execution, and controlled live acceptance, and each A3 phase requires its own explicit instruction.

Every A3 phase requires a new explicit instruction naming targets, caps, side effects, tests, rollback, and stop conditions. This work order never authorises automatic public publication.

## 3. Governing sources

Apply AGENTS.md, SOFTWARE_PROJECT.md, MILO_PROJECT.md, DECISION_LOG.md, PROJECT_STATE.md, the approved M8 design, M7 specifications/evidence, the OpenArt spike report, and this work order in the governed hierarchy.

## 4. Entry conditions

- main remains at the explicitly authorised baseline or a reviewed M8 governance commit;
- M7 remains COMPLETE WITH NOTES and READY FOR M8;
- canonical M7 workflow SNnLunczq5mxrXLn remains protected;
- M7 package and scene records remain coherent;
- canon-v1.0 still resolves to 977755913d9ad41e4f16392d01ea993507af4102;
- D-003 and D-008 through D-015 remain respected;
- no PRE-CANON LEGACY record enters M8;
- no unreviewed parallel M8 implementation exists.

Stop on material mismatch.

## 5. In scope

- provider-neutral M8 contracts and validators;
- additive Story Vault schemas;
- approved visual-reference governance;
- specialist production-intent artifacts;
- OpenArt adapter and isolated connectivity proof;
- generation, polling, retrieval, revision, approval, cost, and recovery workflows;
- provider-neutral voice/audio/lip-sync route and fallback;
- durable media storage;
- deterministic episode assembly;
- YouTube episode and Instagram Reels promo packages;
- operator controls, security, failure handling, regression tests, capstone, and handoff.

## 6. Out of scope

- automatic or public publication;
- canon changes or movement of canon-v1.0;
- mutation of M7 package content or prior milestone records;
- PRE-CANON LEGACY migration;
- D-015 remediation unless separately authorised;
- legacy/test workflow cleanup;
- substantial dedicated UI unless separately approved;
- unapproved cross-provider fallback;
- deletion of approved originals or audit evidence.

## 7. Required design

Implement the approved contracts for ProductionIntentArtifact, ProductionAssetRequest, GenerationAttempt, GeneratedAsset, AssetReference, RevisionRequest, AssetApproval, CostRecord, EpisodeAssembly, AssemblyApproval, PublishingPackage, and PublishingApproval. OpenArt-specific fields remain inside a versioned adapter.

The approved visual-reference pack is a derived canon-controlled production artifact, not canon. Specialist outputs may enrich but never rewrite approved story meaning, dialogue, canon, or M7 intent.

## 8. Required sequence and gates

1. Verify entry state.
2. Obtain a separate explicit A2 instruction, then install repository contracts, schemas, error/lifecycle definitions, and deterministic tests.
3. Pass offline validation and M3–M7 regression.
4. Obtain separate A3 authority and pass the isolated n8n/OpenArt connectivity proof. **Completed with notes; repository evidence reconciled under A2.**
5. Obtain separate A3 authority for additive Story Vault and inactive workflow installation.
6. Obtain separate A3 authority with a distinct evidence-based pilot cap, then prove one-scene generation, durable retrieval, cost, revision, and approval.
7. Prove voice/audio/lip-sync capability or approve the fallback.
8. Obtain the separate A2 or A3 instruction applicable to the named environment, then implement and prove deterministic assembly and platform profiles.
9. Obtain separate A3 authority with a distinct episode-preview cap derived from pilot evidence, then run the full-episode preview capstone.
10. Obtain separate A3 authority with a distinct final-resolution cap derived from preview and benchmark evidence, then build the final master and packages without public publication.
11. Obtain a separate A2 instruction to reconcile repository/live state and close M8.

No phase inherits authority from a prior phase.

`REFSHEET01` V01 and its one authorised V02 revision have been executed and reconciled under D-018. V01 is rejected; V02 proves the image-conditioned identity route only and is not an approved final sheet or production reference. The authoritative episode identity input is the checksum-bound non-canon anchor at SHA-256 `3d9e94da9114d9b907216a1e1d63ac1c1b19757ab8c2865678c0b64809c12fe2`. D-019 defers Character Library creation without blocking M8 and retains direct checksum-bound `visualReferences` as the current approved provider-integration direction. No additional `REFSHEET01` revision, `REFSHEET02`–`REFSHEET05`, Character Library creation or other provider operation is authorised. D-017 ceilings remain governance limits, not spend authority; every future paid operation requires a new explicit instruction, fresh pricing, unit-cap and remaining-stage-cap confirmation, sequential human review, no automatic retry, and immediate stop when cost cannot be bounded.

## 9. Protected invariants

- Story is authoritative for frozen canon lineage.
- M7 packages and scenes are immutable.
- Generated content never silently becomes canon.
- Human approval is required before spend where configured, asset use, assembly acceptance, publishing-package acceptance, and all public release.
- Milo owns idempotency and duplicate-spend prevention.
- No automatic retry on appends or ambiguous provider submissions.
- Requested and actual settings remain distinct.
- Original assets remain immutable and independently retrievable.
- SHA-256 is the authoritative identity of Google Drive bytes; Drive IDs and paths are locators.
- Approved Google Drive files are write-restricted, approved content is never replaced in place, and every revision creates a new file and record.
- Assembly requires a fresh SHA-256 match against each approved durable input.
- Credentials and secrets remain outside repository, Sheets, prompts, packages, and logs.
- Shared Failure Handler retains lifecycle isolation.
- Existing M3–M7 workflow identities, rollback artifacts, and data remain protected.

## 10. Validation

Pass contract, adapter, idempotency, duplicate, polling, timeout, partial-result, selective-revision, lineage, approval, stage-specific budget, canon-separation, durable-file write-restriction, revision-file immutability, pre-assembly checksum revalidation, retrieval, voice/audio, assembly, publishing-profile, failure, manual-recovery, rollback, and M3–M7 regression tests defined by the approved M8 design.

## 11. Stop conditions

Stop the affected branch on repository/governance drift, target or credential ambiguity, unapproved spend, a missing stage-specific cap, attempted cross-stage budget transfer, missing/stale estimate, duplicate risk, uncertain provider charge, unsafe retry, missing provenance/rights/approval, canon mismatch, provider success without retrievable output, cost variance outside policy, missing durable copy, an approved Drive file that is not write-restricted, any attempted in-place replacement, a pre-assembly checksum mismatch, unresolved audience/safety decision, assembly nondeterminism, unexpected prior-milestone mutation, or any need for public publication.

## 12. Rollback

Use additive workflows/tabs, inactive installation, versioned records, durable hashes, and the pre-M8 repository anchor. Disable/unpublish M8 components independently. Preserve all prior milestone state, approved originals, attempt history, and audit evidence. No rollback may overwrite approved Drive content, reuse an approved Drive file ID for different bytes, delete unrelated production data, or rewrite history.

## 13. Completion contract

M8 is COMPLETE only when one approved M7 package has produced:

- approved references and production intent;
- approved durable media with complete lineage, rights, costs, authoritative SHA-256 hashes, write restrictions, append-only revision files, and successful pre-assembly checksum revalidation;
- one approved reproducibly built episode master;
- approved YT_EPISODE_16X9_V1 and IG_REEL_PROMO_9X16_V1 packages;
- enforced human approvals and no automatic public publication;
- passing failure/recovery, budget, duplicate, rollback, and M3–M7 regression evidence;
- final repository/live parity and operational handoff.

If these do not all pass, report COMPLETE WITH NOTES, PARTIAL, BLOCKED, or FAILED VALIDATION accurately.

## 14. Final reporting

Report status, implemented artifacts, tests, live systems touched, costs, generated resources, approvals, protected state, exceptions, rollback position, and whether public publication occurred. Completion does not authorise publication or later hardening.

**End of proposed M8 work order**
