# M8 Visual Reference Pack Specification

**Version:** 1.0
**Status:** Phase 3 repository specification; no image generation

A Visual Reference Pack is a derived, canon-controlled production artifact and explicitly is not canon. It binds exact M7 and canon sources while separating `CANON_FACT_DERIVATION`, `APPROVED_PRODUCTION_CHOICE`, and `APPROVED_NON_CANON_REFERENCE`. Approval of a production choice never changes canon.

Every pack must cover character, environment, prop, scale, palette, and lighting requirements; cite source facts; list open-canon boundaries and disallowed deviations; and record approval state. Every later asset must carry rights, provenance, licence, territory, expiry/restrictions, and approved/disallowed use evidence before approval. Spike media is historical capability evidence only.

Stable IDs are `<packageId>-REFPACK-V###` and `<packageId>-REF###-V##`. Approved reference bytes use SHA-256 as authority; storage identifiers are locators. Approved files must be write-restricted. A revision or replacement creates new bytes, file, checksum, reference ID/version, and record; approved bytes are never replaced in place. Retirement preserves history and names a successor. Checksums must be revalidated before assembly.

Phase 3 may prepare specifications, text prompts, and approval templates only. Actual reference generation requires a separate explicit proposal and authority.
