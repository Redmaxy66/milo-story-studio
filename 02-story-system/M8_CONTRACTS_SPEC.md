# Milo M8 Provider-Neutral Contract Specification

**Version:** 1.0
**Milestone:** M8 — Complete Studio
**Status:** Phase 2 repository contract; no live installation
**Design basis:** Approved external `MILO_M8_DESIGN_APPROVAL_PACKAGE.md` revision 1.1, SHA-256 `6934b997f79e3d5aa7ff5b9405926abb8c9e401a1a539a31e16b1c32dac0d8a2`

## 1. Boundary

These contracts describe Milo-owned production records. They do not install Story Vault tabs, configure n8n, contact a provider, copy media, assemble an episode, or publish content. OpenArt-specific data is confined to the versioned adapter extension.

The approved design package is a supplied project artifact outside the repository. Its digest is evidence; the artifact itself is not a repository deliverable.

## 2. Common envelope

Every authoritative M8 record carries the common envelope in `M8_CONTRACTS_SCHEMA.json`, including stable identity, Story/package lineage, explicit nullable scene/shot/planned-asset lineage, frozen canon identity, creation/update metadata, record version, supersession, validation state, and namespaced extensions.

Rules:

- `storyId`, `packageId`, `packageVersion`, `canonVersion`, and `canonRef` are mandatory.
- Inapplicable `sceneId`, `shotId`, `plannedAssetId`, `workflowExecutionId`, and `supersedesId` are explicit `null`.
- `recordId`, lineage, source hashes, approvals, cost events, provider references, and checksums are immutable after terminal persistence.
- `extensionsJson` may add adapter data but cannot redefine a core field.
- Provider identifiers never replace Milo identifiers.
- A retry creates a new attempt; a revision creates a new request, asset, and durable-file identity.

## 3. Stable identities

| Contract | Stable identity pattern |
|---|---|
| ProductionIntentArtifact | `<packageId>-PIA-<TYPE>-V###` |
| ProductionAssetRequest | `<plannedAssetId>-RQ###` |
| GenerationAttempt | `<requestId>-AT##` |
| GeneratedAsset | `<attemptId>-GA###` |
| AssetReference | `<packageId>-REF###-V##` |
| RevisionRequest | `<generatedAssetId>-RV###` |
| AssetApproval | `<generatedAssetId>-AP##` |
| CostRecord | `<attemptId>-COST-###` |
| EpisodeAssembly | `<storyId>-E01-ASM###` |
| AssemblyApproval | `<assemblyId>-AP##` |
| PublishingPackage | `<assemblyId>-PUB-<PROFILE>-V##` |
| PublishingApproval | `<publishingPackageId>-AP##` |

Versions and attempt numbers begin at one and are contiguous within their parent scope. IDs are never recycled.

## 4. Contract responsibilities

### ProductionIntentArtifact

Stores approved derived production intent, including director briefs, storyboards, animation manifests, prompt bundles, and visual-reference packs. It binds exact source references and content hash. It may enrich production treatment but cannot rewrite M7 story meaning, dialogue, canon, or approved intent.

### ProductionAssetRequest

Stores one provider-neutral request revision, prompt provenance, approved references, canonical capability, requested settings, exact budget stage, maximum cost, approval state, retry/failure policy, and Milo idempotency key. A provider call is never authorised by repository presence alone.

### GenerationAttempt

Stores one submission attempt and its immutable link to a request. Requested, submitted, observed, and raw provider display modes remain distinct. A timed-out or ambiguous attempt must be reconciled before another attempt can be authorised.

### GeneratedAsset

Stores one realised output, provider evidence references, durable locator, returned media facts, and authoritative SHA-256. An asset is assembly-eligible only when its exact bytes are durable, write-restricted, rights/safety cleared, checksum-approved, and freshly revalidated before assembly.

### AssetReference

Stores an approved, versioned production reference classified as `CANON_FACT_DERIVATION`, `APPROVED_PRODUCTION_CHOICE`, or `APPROVED_NON_CANON_REFERENCE`. Approval never turns a production choice into canon.

### RevisionRequest

Names an exact parent asset checksum, bounded permitted change, preserved invariants, result expectation, attempt limit, and separate cost cap. Fulfilment creates a new request and never mutates the parent.

### Approvals

`AssetApproval`, `AssemblyApproval`, and `PublishingApproval` are immutable human decisions bound to exact record versions and hashes. A later decision supersedes rather than edits the earlier decision. Provider completion, workflow success, and earlier approval cannot be inferred as a new approval.

### CostRecord

Is an append-only ledger of estimate, reservation, actual, refund, and adjustment events. Current spend is derived. Corrections append adjustments rather than rewriting history. Budget stages are independent and non-transferable.

### EpisodeAssembly

Stores ordered approved input IDs and checksums, deterministic timeline/audio/caption manifests, renderer/tool versions, command/config hash, output identity, and QA status. Every input declares write restriction and a successful immediate pre-assembly hash check.

### PublishingPackage

Stores a versioned, validated platform package derived from an approved assembly. It contains media/cover/caption identities, metadata, audience and safety decisions, release intent, and manifest hash. It contains no credential or publication receipt and cannot publish.

## 5. Immutability and approval

- Approved records are immutable.
- `REJECTED`, `CHANGES_REQUESTED`, and `VOIDED` decisions remain in history.
- Approved content is never uploaded as replacement bytes to an approved durable file ID.
- Every revision creates new durable bytes, a new SHA-256, and new records linked through parent/supersession fields.
- SHA-256, not a storage file ID or path, is authoritative byte identity.
- Assembly must re-read the exact durable file and recompute SHA-256 immediately before use.

## 6. Budget separation

The stages are `CONNECTIVITY`, `ONE_SCENE_PILOT`, `EPISODE_PREVIEW`, and `FINAL_RESOLUTION`. Only the connectivity design ceiling of 75 provider credits is defined. It is not authority to spend and cannot transfer to another stage. The other caps remain null until separately approved at their evidence gates.

## 7. Failure routing

M8 operational codes are registered in `ERROR_CODE_REGISTER.md`. A future authorised workflow must route them through the shared Milo Failure Handler into the existing 18-column `FailureLog`. No `M8Errors` store exists. Failure events never mutate Story or artifact lifecycle state.

## 8. Story and canon boundaries

- The Story remains authoritative for frozen canon lineage.
- M7 Production Packages and scenes remain immutable.
- M8 contracts inherit exact M7/Story lineage.
- Generated content and derived visual references are non-canon unless a separate canon process approves a canon change.
- No Phase 2 validator contacts a canon service or reads canon content.

## 9. Validation order

Before a dependent mutation in any later phase, validate schema, identifiers, controlled values, lineage, source references, hashes, approvals, budget, and lifecycle transition in that order. A failure stops the mutation and produces the most specific registered error code.

## 10. Repository implementation

`05-code/m8/contracts.mjs` provides deterministic offline validation. Fixtures under `06-testing/fixtures/m8` are inert or explicitly historical/non-callable. Repository workflow exports are empty-node skeletons and confer no execution authority.
