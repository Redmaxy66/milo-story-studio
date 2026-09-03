# Supporting Code

This folder stores:

- JavaScript used in n8n Code nodes
- JSON examples and schemas
- API request examples

Native n8n nodes should be preferred where practical.

## M8 repository-only modules

`m8/` contains pure offline foundations:

- `canonical-json.mjs` — strict `MILO_CANONICAL_JSON_V1` serialization
- `hashing.mjs` — domain-separated SHA-256 content hashes and idempotency keys
- `contracts.mjs` — provider-neutral contract, controlled-value, lifecycle, and boundary validation
- `openart-adapter-interface.mjs` — offline OpenArt normalization and fail-closed live-operation interface

These modules contain no HTTP client, provider SDK, credential lookup, endpoint, live target, media retrieval, or workflow execution capability.
