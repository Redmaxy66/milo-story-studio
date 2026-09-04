# M8 REFSHEET01 V01/V02 Evidence Reconciliation

**Result:** COMPLETE WITH NOTES
**Validation date:** 2026-09-03
**Authority:** A2 — M8 REFSHEET01 V01/V02 Evidence Reconciliation
**Entry remote `main`:** `8bab1643675293fecf82f9b35400230a47293e26`
**Entry parent:** `20a7ece80e7126c6d35eae7e8aec3dce47b46e84`
**Entry tree:** `5006874b897fb58d5fb7641efe9f8b78dd73350a`
**Entry subject:** `Record M8 OpenArt A3 proof evidence`

## Governed lineage

- Story: `MILO-007`.
- Script: `MILO-007-S01`.
- Package: `MILO-007-S01-P01`, version 1.
- Reference pack: `MILO-007-S01-P01-REFPACK-V001`.
- Canon: `canon-v1.0` at immutable ref `977755913d9ad41e4f16392d01ea993507af4102`.
- The approved Phase 3 story meaning, script, storyboard, animation manifest, prompt bundle and canon lineage were not changed.

## V01 disposition

| Field | Value |
|---|---|
| Candidate | `MILO-007-S01-P01-REFSHEET01-V01` |
| SHA-256 | `8463309495991a2f6b9cec76a922a5e526f6a504b83c92e12497420bbb778e37` |
| History ID | `x6q6A3FQPT5Y3mpl4YTE` |
| Resource ID | `RGg7R5t90FGvWeSWSZHV` |
| Cost | 15 OpenArt credits |
| Decision | `REJECTED` |
| Primary reason | `WRONG_CHARACTER_IDENTITY` |
| Classification | `CANDIDATE GENERATED WITH MATERIAL DEFECTS` |

V01 depicts a human child rather than Milo. Its historical evidence is preserved by identifier and checksum, but the candidate must not be promoted, reused or treated as an approved reference.

## Authoritative episode identity anchor

The project owner approved the exact bytes of `MILO-007-S01-P01-MILO-IDENTITY-ANCHOR-CANDIDATE-V01.png` as the authoritative episode identity input for subsequent controlled testing.

| Field | Value |
|---|---|
| Format and dimensions | PNG, 1056×408 |
| SHA-256 | `3d9e94da9114d9b907216a1e1d63ac1c1b19757ab8c2865678c0b64809c12fe2` |
| Source | Non-generative crop from the 1536×1024 historical OpenArt spike composite at SHA-256 `3712a69aa6d6875d72203aa5f48f5cbfb9e6ec18cc387c60cac3ac7bba3ab6f4` |
| Crop operation | `1056×408+0+45` |
| Pixel changes inside source rectangle | Zero |

The anchor is non-canon, episode-scoped and checksum-bound. It remains subject to durable-storage and provenance reconciliation and does not authorise unrestricted generation, moving-image use or publication. The earlier reduced-thumbnail crop remains `NOT APPROVED — THUMBNAIL SOURCE` and is not an identity input.

## V02 execution and disposition

| Field | Value |
|---|---|
| Candidate | `MILO-007-S01-P01-REFSHEET01-V02` |
| Decision | `ACCEPTED_WITH_LIMITATIONS_FOR_IMAGE_CONDITIONING_ROUTE_EVIDENCE_ONLY` |
| Model / mode | `byte-plus-seedream-4-5` / `image2image` |
| Prompt SHA-256 | `33026145f0a105cadefb0c9cad00a65dde78b989b5d24e05acf0917312eb3351` |
| Anchor SHA-256 | `3d9e94da9114d9b907216a1e1d63ac1c1b19757ab8c2865678c0b64809c12fe2` |
| Upload ID | `jUX4awRS6468gTgNOZvo` |
| History ID | `clmIXuZAvzYDo7A8H0QM` |
| Resource ID | `HJc5v7ubm6ATmUhRyeV6` |
| Creation timestamp | `2026-09-03T23:30:58.438Z` |
| Result | JPEG, 2848×1600, 710,302 bytes |
| Candidate SHA-256 | `5663bd8fc42fca2a3cd4ddeef88565063a087b63edb93638d913766dbfc46d83` |
| Cost and balance | 15 credits; 3,433 → 3,418 |
| Generation attempts / retries | 1 / 0 |

V02 proves only that the image-conditioned OpenArt route can preserve Milo's broad non-human visual identity. It is a secondary visual candidate for human comparison. It is not the completed `REFSHEET01`, a production reference, a canon asset or an unrestricted provider input.

### Successful findings

- Milo remained a non-human turquoise-furred creature.
- The face, cream muzzle and belly, amber eyes, pink nose, golden belly star and mustard backpack were substantially preserved.
- Front, profile and back coverage was generated.
- Character scale was broadly consistent.
- The relative-height marker used no absolute units.
- No human reinterpretation, clothing, active star power or unsafe treatment was introduced.
- Image conditioning solved the primary V01 identity failure.

### Remaining limitations

- No clearly distinct three-quarter neutral view.
- The front pose is not fully neutral.
- The two middle views are effectively profiles.
- Generated headings and labels are malformed.
- Additional heading text appears beyond the requested neutral view labels.
- JPEG was returned where PNG was preferred, and the live schema exposed no output-format control.
- Possible anatomical or proportional drift, including tail and ear proportions, remains subject to human comparison against the authoritative anchor.

V02 therefore does not fully satisfy the approved `REFSHEET01` specification.

## Cost and authority reconciliation

- Total `REFSHEET01` expenditure: 30 credits — V01 15 and V02 15.
- Current known OpenArt balance: 3,418 credits.
- Automatic retries: zero across both generation attempts.
- This repository reconciliation spent zero additional credits and performed no OpenArt, n8n, MCP, credential or media operation.
- No further `REFSHEET01` revision, `REFSHEET02`–`REFSHEET05`, OpenArt Character Library pilot, durable asset promotion, production workflow activity or M8 Phase 4 work is approved.

## Issue disposition

### CRITICAL NOW

- None.

### MATERIAL BEFORE THE NEXT RELEVANT PRODUCTION GATE

- Complete or otherwise resolve distinct three-quarter identity coverage.
- Confirm anatomical and proportional drift against the authoritative identity anchor.
- Establish durable checksum-bound storage and provenance.
- Separately approve any provider-side Character Library asset or production reference.
- Retain the authoritative anchor as the identity source of truth.

### PARKABLE AT NO CURRENT RISK

- Malformed generated labels.
- JPEG rather than PNG.
- Cosmetic reference-sheet layout.
- Deterministic replacement of generated typography.

Another paid generation is not authorised merely to correct typography or formatting. Future reference-sheet generation should preferably produce clean, unlabeled views; accurate headings, labels and measurement markers should be added later through deterministic non-generative composition.

## Validation

- Sanitized evidence JSON parsed successfully.
- Decision sequence and uniqueness were checked; D-018 follows D-017.
- M8 Phase 2 aggregate and M8 Phase 3 validation passed.
- All applicable M3–M7 regressions passed, including M7 Production Package at 63 / 63.
- Changed machine-readable files passed JSON and module syntax checks.
- Secret/credential scan, formatting checks, `git diff --check` and changed-path scope checks passed.

## Disposition

M8 Phase 3 remains complete. `REFSHEET01` V01 is rejected; V02 is accepted with limitations for image-conditioning route evidence only. The authoritative checksum-bound anchor remains the episode identity source of truth. Final `REFSHEET01` approval, Character Library testing, further generation and Phase 4 remain unauthorised.
