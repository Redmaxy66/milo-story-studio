# M8 Phase 2 Repository Contract Test Cases

**Version:** 1.0
**Scope:** Repository-only, offline validation
**Authority:** A2 — M8 Phase 2 Repository Contracts
**Design basis:** External `MILO_M8_DESIGN_APPROVAL_PACKAGE.md` revision 1.1, SHA-256 `6934b997f79e3d5aa7ff5b9405926abb8c9e401a1a539a31e16b1c32dac0d8a2`

## Acceptance matrix

| Test IDs | Area | Required evidence |
|---|---|---|
| M8-P2-001–036 | Provider-neutral contracts | All 12 contracts accept valid inert examples; missing, malformed, additional, secret-shaped, endpoint-shaped, lineage, hash, cost, approval, and controlled-value defects fail deterministically. |
| M8-P2-037–129 | Lifecycle | Every allowed transition in `M8_CONTROLLED_VALUES.json` passes; every tested unlisted, terminal-reset, retry-overwrite, revision-overwrite, and failure-driven transition fails. |
| M8-P2-130–148 | Canonical JSON, hashing, and idempotency | Recursive key order is deterministic; arrays and explicit null are preserved; unsupported values fail; domain-separated hashes are stable; reference hashes sort before idempotency hashing; extra or missing material fails. |
| M8-P2-149–177 | OpenArt adapter | Recorded fixtures normalize as historical/non-callable evidence; synthetic fixtures remain inert; live operations fail closed; ambiguous, partial, failed, timeout, missing-output, and cost-cap cases map deterministically. |
| M8-P2-178–210 | Proposed Story Vault schema | Exactly 12 authoritative contract tabs plus derived `StudioControl`; no `M8Errors`; `StudioControl` is read-only/non-authoritative; shared `FailureLog` schema is unchanged; durable-file and approval controls are present. |
| M8-P2-211–224 | Workflow skeleton exports | Exactly 13 expected exports; every export is inactive, contains no nodes, credentials, targets, triggers, endpoints, IDs, pins, or executable configuration. |
| M8-P2-225–233 | Aggregate and repository boundary | Required artifacts exist and parse, modules pass syntax checks, the external design artifact is absent from the repository, and the offline aggregate passes. |

## Contract cases

- Validate `ProductionIntentArtifact`, `ProductionAssetRequest`, `GenerationAttempt`, `GeneratedAsset`, `AssetReference`, `RevisionRequest`, `AssetApproval`, `CostRecord`, `EpisodeAssembly`, `AssemblyApproval`, `PublishingPackage`, and `PublishingApproval` against `M8_CONTRACTS_SCHEMA.json`.
- Require stable Milo identity, exact Story/M7 lineage, frozen canon lineage, source references, immutable approval binding, explicit nullable fields, schema version, and namespaced extensions.
- Reject provider identity as a Milo primary key, unregistered controlled values, credential-shaped material, tokens, endpoints, signed URLs, live workspace/project configuration, non-canonical cost values, malformed SHA-256, and undeclared properties.
- Require budget stages to remain distinct: `CONNECTIVITY`, `ONE_SCENE_PILOT`, `EPISODE_PREVIEW`, and `FINAL_RESOLUTION`. Only the 75-credit connectivity ceiling is defined; it conveys no spending authority.

## Lifecycle and failure cases

- Accept only transitions explicitly declared in `M8_CONTROLLED_VALUES.json`.
- Reject resetting terminal records or rewriting attempts, revisions, approvals, costs, assets, assembly outputs, and publishing packages in place.
- Require ambiguous submission, provider charge, timeout, or missing resource to enter reconciliation and prohibit blind resubmission.
- Confirm operational failures use codes in `ERROR_CODE_REGISTER.md` and are specified to route to the existing shared `FailureLog`, never to lifecycle mutation or a separate M8 error store.

## Durable-storage and assembly cases

- Treat SHA-256 as authoritative byte identity and storage ID/path only as locators.
- Require approved durable files to be write-restricted.
- Require each revision or corrected byte stream to create a new file and record.
- Reject in-place replacement of approved bytes.
- Require a fresh SHA-256 comparison immediately before assembly and block on mismatch.

## Fixture identifier cases

- Recorded OpenArt fixtures may retain only historical provider history/resource IDs proven by the approved spike evidence, and must label them `historical` and `nonCallable`.
- Recorded fixtures must not contain current endpoints, workspace IDs, project IDs, credentials, tokens, cookies, sessions, authentication headers, or live configuration.
- Synthetic OpenArt and general contract fixtures must use inert identifiers.
- No fixture may be used as a call target or evidence of current provider availability.

## M3–M7 regression cases

The complete applicable regression collection must remain green:

```bash
node 06-testing/validate_canon_initialization.mjs
node 06-testing/validate_canon_lineage.mjs
node 06-testing/validate_continuity_eligible_selection.mjs
node 06-testing/validate_failure_instrumentation.mjs
node 06-testing/validate_outline_eligible_selection.mjs
node 06-testing/validate_production_package.mjs
node 06-testing/validate_script_eligible_selection.mjs
```

The M7 lifecycle compatibility assertion remains explicit: M8 states are not added under M7 authority. Their separate Phase 2 repository definitions do not install a live Story status or mutate an M7 artifact.

## Prohibited test activity

No Phase 2 test may contact or modify n8n, Story Vault, Google Sheets, Google Drive, OpenArt, credentials, canon services, media services, or publishing platforms. Tests must not generate media, spend credits, execute or activate workflows, assemble an episode, or publish anything.
