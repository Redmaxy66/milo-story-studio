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
