# n8n Workflows

This folder stores exported Milo Story Studio n8n workflows.

## Structure

- development — workflows currently being built
- tested — workflows that have passed testing
- archived — previous or discontinued versions

## M7 Production Package

`development/Milo Production Package Generator v0.1.json` is the final verified repository definition for M7.

It is intentionally inactive/unpublished in repository form and has no live workflow ID. After normalization of legitimate volatile n8n metadata, it matches canonical workflow `SNnLunczq5mxrXLn`, verified by terminal zero-write execution `#432`. Future live mutation, execution, or activation/publication still requires separate A3 authority.

Repository responsibilities include:

- `CONTINUITY_APPROVED` eligibility and approved Script/Continuity Review validation
- PRE-CANON LEGACY exclusion
- Story-authoritative canon-lineage checks
- immutable M7 prompt provenance
- runtime canon/visual/voice/rules reads at Story `canonRef`
- deterministic package IDs and versions
- normal duplicate rejection
- explicit controlled regeneration / upstream revision handling
- exact approved Script coverage across ordered scene rows
- planned-asset IDs and manifests only
- scene append → scene verification → package-header append → package verification → Story-state update ordering
- status-only and header-only repair paths after partial writes
- shared Failure Handler and Error Workflow routing
- no automatic retry on Google Sheets append operations

Run after any change to the export and before any future live configuration:

```bash
node 06-testing/validate_production_package.mjs
```

The complete M7 suite passes `63 / 63`. Canonical installation, save/reload parity, and terminal `NOOP_COMPLETE` verification are recorded in `06-testing/M7_CANONICAL_VERIFICATION.md`.

See `02-story-system/PRODUCTION_PACKAGE_SPEC.md` for the M7 contract.

## M6.5 failure instrumentation

`development/Milo Failure Handler v0.1.json` is the shared durable failure workflow. It accepts both explicit sub-workflow calls and n8n Error Trigger payloads, normalizes them, and appends to the Story Vault `FailureLog` tab.

All nine source exports route their existing local `Prepare ... Failure` nodes to one `Call Failure Handler` node per workflow. The call-node workflow selectors and source-workflow `errorWorkflow` settings require the imported handler's real live ID and are intentionally not fabricated in repository JSON.

See `02-story-system/FAILURE_INSTRUMENTATION.md` for the schema, contract, retry policy, and live activation checklist.

### M6.5 Phase 1D remediation

`Milo Outline Approval v0.1` includes an idempotent `Story Already Outline Approved` repair branch. A rerun with one valid, unprocessed approved Outline now:

- follows the normal path from `OUTLINE_GENERATED` through the Story update and then the Outline stamp;
- skips the Story rewrite when the Story is already `OUTLINE_APPROVED` and proceeds directly to the Outline stamp; and
- routes every other Story state through `Prepare Story Not Ready Failure` to the shared failure handler.

The same remediation corrects the Script Approval failure payload field to `storyId`. Repository exports must keep `pinData` empty and must not retain isolated `TEST-INVALID` test records.

`Milo Concept Generator v0.1` routes the FALSE output of `Concept Batch Is Valid` through `Prepare Concept Validation Failure` to the shared failure handler. The TRUE batch path and the separate duplicate-concept protection branch remain unchanged.

Run `node 06-testing/validate_failure_instrumentation.mjs` after changing an instrumented M3–M6 workflow export.
