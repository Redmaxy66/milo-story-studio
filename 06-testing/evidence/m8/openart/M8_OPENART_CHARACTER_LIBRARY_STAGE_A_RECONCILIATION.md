# M8 OpenArt Character Library Stage A Reconciliation

**Result:** DEFERRED WITHOUT CURRENT M8 BLOCK
**Validation date:** 2026-09-04
**Authority:** A2 — M8 Character Library Preflight Reconciliation and Deferral
**Entry remote `main`:** `c288bf9f1138d50e07787985783a7f86e88103bc`
**Entry parent:** `8bab1643675293fecf82f9b35400230a47293e26`
**Entry tree:** `c10c60acbc2d911c5980e668d3eb5f5924aca03f`
**Entry subject:** `Reconcile M8 REFSHEET01 route evidence`

## Stage A outcome

Disposition: `DEFERRED_WITHOUT_CURRENT_M8_BLOCK`.

The project owner deferred OpenArt Character Library creation without creating a current M8 blocker. No upload or character creation is justified while non-human fantasy-character support, exact bounded cost, private/unpublished storage, automatic-preview behaviour and stable provider integration remain unresolved.

| Field | Recorded result |
|---|---|
| Known OpenArt balance | 3,418 credits |
| Credit movement | 3,418 → 3,418 |
| Uploads | 0 |
| Character records created | 0 |
| Generated media | 0 |
| Repository mutations during Stage A | 0 |
| n8n executions | 0 |

## Prepared pilot-source evidence

| Field | Value |
|---|---|
| File | `MILO-007-S01-P01-MILO-CHARACTER-PILOT-SOURCE-V01.png` |
| Source anchor dimensions | 1056×408 |
| Source anchor SHA-256 | `3d9e94da9114d9b907216a1e1d63ac1c1b19757ab8c2865678c0b64809c12fe2` |
| Crop rectangle | `220×282+8+76` |
| Crop dimensions | 220×282 |
| Format | PNG, RGBA |
| File size | 113,297 bytes |
| Crop SHA-256 | `cdb0b32371b4848eb7ec076b72b83f4e9bfaf0eaca3f86e1b9a3293eb4f5d049` |
| Decoded pixel hash | `aaa6b76a281cf0115e350aa279c4a5a1ceee5419ac0c8f41b469082231b58a1a` |
| Pixel changes | 0 |
| Resizing, enhancement, reconstruction or generation | None |

Disposition: `PREPARED PILOT INPUT — NOT UPLOADED — NOT A SEPARATELY APPROVED PRODUCTION REFERENCE`.

The PNG binary is not stored in Git. Its exact derivation and checksum are retained as evidence without promoting it to a production reference.

## Capability findings

- The inspected route accepted exactly one front-facing image. Multiple-image input was not enabled.
- Accepted formats included JPG, JPEG, PNG, WebP, HEIC and HEIF. No dimension limit was exposed before upload.
- The route performed character creation or processing rather than simple file registration.
- Exact cost was not exposed before upload, and automatic preview creation was not disclosed.
- The inspected form exposed no explicit private-visibility control.
- Stable character ID, rename/archive/delete controls and lifecycle behaviour could not be verified without creation.
- The connected MCP surface exposed no Character Library create/get/update/delete operation, so deterministic n8n selection by a Character Library ID is not currently available. The apparent integration route would require manual OpenArt UI selection.
- No profile export or backup mechanism or Starter-plan stored-character limit was exposed.
- Non-human fantasy-character support was not confirmed. Official OpenArt information reviewed during Stage A described the initial Character Builder as photorealistic-human-focused with fantasy support planned, while newer guidance recommends saved-character reuse and image-led animation without establishing live non-human support for this specific route.

Reviewed official sources:

- <https://openart.ai/blog/character-builder-pr/>
- <https://openart.ai/blog/consistent-characters-in-ai-video/>
- <https://openart.ai/help>

These findings do not establish that non-human support is permanently unavailable; they establish only that it was not sufficiently demonstrated for a governed Milo pilot.

## Current approved integration direction

Milo Story Studio remains authoritative for identity, approved bytes, SHA-256 checksums, provenance, lifecycle, human approval and durable references. OpenArt receives only explicitly authorised checksum-bound visual references for individual governed operations.

The proven current route is:

`approved Milo reference bytes → OpenArt visualReferences → bounded image/video operation → read-only status retrieval → checksum and human review`

A provider-side Character Library entry must never silently replace, update or override the Milo Story Studio identity source. Character Library may be reconsidered only after live evidence establishes non-human support, exact bounded cost, private/unpublished storage, disclosed automatic-output behaviour, a stable provider identifier, acceptable lifecycle controls, safe reference quality and a governed manual or automated selection method.

## Issue disposition

### CRITICAL NOW

- None.

### MATERIAL BEFORE ANY FUTURE CHARACTER LIBRARY PILOT

- Confirmed live non-human support.
- Exact bounded cost.
- Guaranteed private/unpublished status.
- Automatic-preview behaviour.
- Stable identity and lifecycle controls.
- Acceptable provider integration route.

### PARKABLE AT NO CURRENT RISK

- Character Library stable-ID automation.
- Profile export and backup.
- Starter-plan character limits.
- The prepared 220×282 pilot crop.
- Character Library creation itself.

These items are parkable because the direct checksum-bound image-conditioning route is already proven and remains available.

## Authority boundary

Decision D-019 records the deferral without blocking subsequent M8 work. It grants no Character Library upload, creation, provider execution, credit spend, downstream generation, durable-reference promotion or Phase 4 authority. This A2 reconciliation accessed no OpenArt, MCP, n8n, Story Vault, Google Drive, canon or production-media system and spent zero credits.
