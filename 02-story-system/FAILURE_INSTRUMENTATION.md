# Failure Instrumentation

- **Status:** M6.5 Phase 1 repository implementation complete; live n8n and Sheet binding required
- **Workflow:** `Milo Failure Handler v0.1`
- **Store:** `FailureLog` tab in the Milo Story Vault

## Purpose

Failure instrumentation is an operational layer. It records failures without changing Story or artifact lifecycle state.

The shared handler accepts:

1. `HANDLED` events from the existing local `Prepare ... Failure` nodes.
2. `UNHANDLED` events from n8n's Error Trigger after a source workflow crashes.

The existing local failure nodes and their error-code vocabulary remain the source of truth for handled failures.

## Architecture

Each source workflow has one terminal `Call Failure Handler` node. Every local `Prepare ... Failure` node connects to it and supplies caller metadata. The shared handler has two entry nodes:

- `When Called by Another Workflow` for handled events.
- `On Workflow Error` for Error Workflow events.

Both paths converge on `Normalize Failure Event` and then `Append FailureLog`.

`Milo Failure Handler v0.1` must not use itself as its own Error Workflow. If its only durable append fails, n8n execution history is the fallback diagnostic source.

## FailureLog schema

Create the tab with this exact header order:

| # | Column | Meaning |
|---:|---|---|
| 1 | `failureId` | Deterministic event identifier. |
| 2 | `occurredAt` | ISO 8601 event time. Existing `failedAt` values map here. |
| 3 | `workflowName` | Source workflow name. |
| 4 | `workflowId` | Source n8n workflow ID when available. |
| 5 | `executionId` | Source n8n execution ID when available. |
| 6 | `sourceType` | `HANDLED` or `UNHANDLED`. |
| 7 | `storyId` | Story identifier when available. |
| 8 | `conceptId` | Concept identifier when available. |
| 9 | `outlineId` | Outline identifier when available. |
| 10 | `scriptId` | Script identifier when available. |
| 11 | `reviewId` | Continuity-review identifier when available. |
| 12 | `errorCode` | Existing local code or the unhandled fallback code. |
| 13 | `message` | Operator-readable failure message. |
| 14 | `nodeName` | Local failure emitter or unhandled failing node. |
| 15 | `nodeType` | n8n type of that node when available. |
| 16 | `attempt` | Attempt number; defaults to `0`. |
| 17 | `rawError` | Serialized local payload or n8n error object, capped at 45,000 characters. |
| 18 | `status` | Operational triage status. New events are `OPEN`. |

New failure events are append-only. Updating `status` during later human triage is separate from event creation.

## Contract values

### sourceType

- `HANDLED` — an expected failure branch produced a structured local payload.
- `UNHANDLED` — n8n stopped a workflow because an execution or trigger error was not handled locally.

### status

- `OPEN` — requires review or action.
- `RESOLVED` — corrective action is complete.
- `IGNORED` — reviewed and intentionally dismissed.

These values apply only to `FailureLog`. They are not Story lifecycle states.

## Caller envelope

Every local `Prepare ... Failure` node retains its existing fields and also emits:

- `workflowName = $workflow.name`
- `workflowId = $workflow.id`
- `executionId = $exec.id`
- `sourceType = HANDLED`
- `nodeName = <local Prepare Failure node name>`
- `nodeType = n8n-nodes-base.set`

The handler accepts existing inconsistencies such as `stroyId`, `criptId`, `attempts`, `ailedAt`, `=storyId`, and `=failedAt`. Their original meaning remains available in `rawError`; the normalized columns use the corrected contract names.

## failureId

The handler builds an identity seed from:

- source type
- workflow ID, falling back to workflow name
- execution ID, falling back to event time
- node name
- error code
- available Story and artifact IDs

It stores `FL-H-<64-bit FNV-1a>` for handled events and `FL-U-<64-bit FNV-1a>` for unhandled events. The same source event therefore produces the same `failureId`; distinct executions or artifacts produce different IDs.

The Phase 1 append path does not perform a pre-read deduplication query. Operators can detect duplicate rows by `failureId`. Any future duplicate suppression must use `failureId`; it must not retry the append.

## Retry policy

- Retry only operations proven idempotent, such as LLM calls and immutable GitHub file reads.
- Never enable `retryOnFail` on Google Sheets append nodes, including `Append FailureLog`.
- A Sheets append timeout may occur after the row landed; retrying can create duplicate rows.
- Sheets updates require an explicit, case-by-case idempotency review before any retry is added.
- Human approval failures and deterministic validation failures are not retry conditions.

## Lifecycle boundary

The Failure Handler writes only to `FailureLog`. It does not update Stories, Concepts, Outlines, Scripts, or Continuity Reviews. Story lifecycle states are defined in `STORY_STATUS_MODEL.md`; operational codes are defined in `ERROR_CODE_REGISTER.md`.

## Live activation checklist

Repository exports cannot safely invent the new workflow ID or refreshed Sheet metadata. Complete these actions in live n8n and Google Sheets:

1. Create a `FailureLog` tab and add the 18 headers above in the exact order shown.
2. Import `Milo Failure Handler v0.1`, select the existing Milo Story Vault credential, select the `FailureLog` tab, and refresh the append node's column schema.
3. In each of the nine source workflows, select the imported handler in `Call Failure Handler`.
4. In each source workflow's settings, select `Milo Failure Handler v0.1` as its Error Workflow.
5. Do not set an Error Workflow on the handler itself.
6. Activate the handler and re-export all ten workflows so real workflow references and refreshed Sheet metadata are committed.

## Validation

Run:

```bash
node 06-testing/validate_failure_instrumentation.mjs
```

The offline suite covers graph integrity, all 35 local routes, error-code preservation, handled and unhandled normalization, deterministic IDs, lifecycle isolation, exact columns, and the no-append-retry rule. Live acceptance tests are listed in `06-testing/TEST_CASES.md`.
