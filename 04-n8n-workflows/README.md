# n8n Workflows

This folder stores exported Milo Story Studio n8n workflows.

## Structure

- development — workflows currently being built
- tested — workflows that have passed testing
- archived — previous or discontinued versions

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

Run `node 06-testing/validate_failure_instrumentation.mjs` after changing an instrumented workflow export.
