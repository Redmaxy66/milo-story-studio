# MILO M8 OpenArt A3 Connectivity, Capability and Cost Proof

## Outcome

The isolated A3 proof passed with notes. OpenArt MCP authentication in n8n was proven, one read-only account call succeeded, and exactly one authorised non-Milo paid generation completed. The observed charge was exactly 15 credits.

## Governed entry state

- Repository: `Redmaxy66/milo-story-studio`
- Branch: `main`
- Entry and post-proof HEAD: `20a7ece80e7126c6d35eae7e8aec3dce47b46e84`
- Parent: `432136deda6707f8c7ece8cc77cd0cc46dbe0c6e`
- Tree: `48e39d4cdd0864ace4db58f9a9ef2c7c043c5514`
- Subject: `Approve M8 Phase 3 production intent package`
- Repository mutation: none

## Connection and authentication evidence

- Provider route: OpenArt MCP over HTTP Streamable at `https://mcp.openart.ai/mcp`
- n8n authentication: OAuth2 using existing credential shell `M8 OpenArt Proof OAuth - ISOLATED`
- Credential request-domain restriction: `mcp.openart.ai`
- ChatGPT/OpenArt boundary: ChatGPT's OpenArt OAuth connection and n8n's OAuth credential are separate clients. The n8n proof used the n8n-held credential; no ChatGPT credential or secret was copied into n8n.
- Authenticated n8n tool discovery returned `openart_account_get`, `openart_model_list`, `openart_model_cost`, `openart_model_form_get`, `openart_generate_image`, creation-status tools, upload tools and related OpenArt MCP operations.
- No credential value, token, authorization header or cookie is included in this evidence.

## Isolated workflow

- Name: `Milo M8 OpenArt Connectivity Proof - ISOLATED TEST`
- Workflow ID: `EL5LzYxiIUeOK2nf`
- State: inactive and unpublished
- Trigger: manual only
- Nodes: 5
- Sequential connections: 4
- Pins: 0
- Automatic retries: disabled
- Error behavior: stop workflow

Topology:

1. `When clicking ‘Execute workflow’`
2. `Prepare Non-Milo Test Request`
3. `OpenArt Text-to-Image via MCP`
4. `Normalize Response and Cost`
5. `Terminal Proof Result`

## Read-only authentication check

- n8n execution: `#434`
- Result: succeeded in 1.86 seconds
- Operation: `openart_account_get`
- Account plan: Starter
- Balance observed: 3,463 credits
- Paid operation: none

## Paid execution

- n8n execution: `#435`
- Result: succeeded in 4.35 seconds
- Submission count: exactly 1
- Automatic retries: 0
- Provider operation: `openart_generate_image`
- Model: `byte-plus-seedream-5-lite` (Seedream 5 Lite)
- Mode: `text2image`
- Resolution: `2K`
- Aspect ratio: `16:9`
- Requested output count: 1
- Prompt enhancement: disabled
- References: none
- Prompt classification: `NON_MILO_DISPOSABLE_MULTI_VIEW_REFERENCE_SHEET`
- Initial provider status returned to n8n: `PENDING`
- OpenArt history ID: `QwRJzFT9RJNUMxtSMhFe`
- Final provider status: `COMPLETED`
- Resource ID: `NDWfnk61R0ZYkn68XCJv`
- Resource: [Open generated PNG](https://cdn.openart.ai/openart-ai/production/2026-09/create-image/BQYIt8w3thhcvrHNHqYm/02178843545712430d072d337ea6fcc7bbfbe2f0c485be2f9bbb1_0_1788435510423_c8bc4811.png)
- Returned media: PNG, 2848 × 1600
- Output count observed: 1

The disposable prompt described an original wooden lighthouse toy shown in front, three-quarter, side and back views on a neutral studio background. It contained no Milo, Moonberry, firefly, M7, Phase 3 or existing-franchise content.

## Cost evidence

- Live preflight quote: 15 credits
- Quote configuration: Seedream 5 Lite, `text2image`, 2K, 16:9, one image
- Balance before: 3,463 credits
- Balance after: 3,448 credits
- Observed spend: 15 credits
- Proof ceiling: 15 credits preflight / 75 credits absolute
- Ceiling result: passed

The 15-credit observation applies only to the exact tested configuration. It is not evidence for other models, resolutions, output counts, reference inputs or future provider pricing.

## Reference-sheet practicality

The route is technically practical for producing a single reference-sheet candidate: the provider accepted a multi-view layout prompt and returned one retrievable 16:9 image at useful resolution. This test does not certify Milo character fidelity, cross-sheet consistency, view accuracy or production suitability because all Milo content and reference promotion were intentionally excluded.

Recommended governed caps for a later reference-generation work order:

- Initial operation cap per sheet: 15 credits, one output, no retry.
- Separately approved revision cap per sheet: 15 credits, one output, no retry.
- Five initial sheets: hard ceiling of 75 credits.
- Five initial sheets plus at most one separately approved revision each: hard ceiling of 150 credits.
- Continue sequential human approval after every initial sheet and before each revision.
- Treat all figures as proposed caps requiring separate approval, not as budget granted by this proof.
- `REFSHEET01` is technically ready for a separately authorised generation gate after A2 evidence reconciliation and explicit approval of its production prompt, references and cap.

## Issue disposition

### CRITICAL NOW

- None.

### MATERIAL BEFORE REFERENCE GENERATION

- A production adapter must handle the asynchronous `PENDING` response and perform governed read-only status retrieval before treating a resource as complete.
- Milo fidelity, multiview consistency and reference suitability remain unproven.
- Provider pricing must be quoted again immediately before every separately authorised paid operation.

### PARKABLE AT NO CURRENT RISK

- Earlier cloud-browser OAuth attempts failed before authentication; the credential was subsequently connected manually and the authenticated n8n account call passed.
- Execution `#433` was a 63 ms pre-proof configuration error. Balance evidence confirms it did not create the paid resource or consume the 15-credit charge attributed to execution `#435`.

## Protected invariants

- No production workflow was opened for modification, executed, activated or published.
- No Story Vault, Google Sheets, Drive or canon path was accessed or mutated.
- No repository file, branch, tag or commit was changed; remote `main` remained at the governed entry SHA.
- No Milo content was submitted to OpenArt.
- No generated asset was promoted into a Milo reference pack or production location.
- The isolated workflow remains inactive and unpublished.
- Exactly one paid generation operation was submitted and no retry was performed.

## Recommended next gate

Use a separate A2 repository-reconciliation instruction to review and record this evidence without generating media. After that, issue a new, narrowly scoped A3 gate only if `REFSHEET01` generation is approved. Retain the isolated workflow and restricted credential only until the evidence is reconciled; then either revoke/delete them under explicit authority or keep them disabled and clearly marked as test-only.

M8 OPENART A3 PROOF: PASS WITH NOTES — COST/CAP EVIDENCE READY FOR REVIEW
