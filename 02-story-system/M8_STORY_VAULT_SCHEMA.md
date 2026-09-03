# M8 Proposed Story Vault Schema

**Version:** 1.0
**Status:** Repository proposal only; no live tab creation or migration
**Authority boundary:** Phase 2 A2 defines this schema but does not access or modify Google Sheets

## 1. Proposed M8 tab inventory

1. `ProductionIntentArtifacts`
2. `ProductionAssetRequests`
3. `GenerationAttempts`
4. `GeneratedAssets`
5. `AssetReferences`
6. `RevisionRequests`
7. `AssetApprovals`
8. `CostRecords`
9. `EpisodeAssemblies`
10. `AssemblyApprovals`
11. `PublishingPackages`
12. `PublishingApprovals`
13. `StudioControl`

There is no `M8Errors` tab or separate M8 error store. Future M8 failures must route through the existing shared Milo Failure Handler to the existing `FailureLog`.

## 2. Common contract columns

The 12 authoritative contract-backed tabs begin with these exact columns:

1. `schemaVersion`
2. `recordType`
3. `recordId`
4. `storyId`
5. `packageId`
6. `packageVersion`
7. `sceneId`
8. `shotId`
9. `plannedAssetId`
10. `canonVersion`
11. `canonRef`
12. `createdAt`
13. `createdBy`
14. `updatedAt`
15. `workflowExecutionId`
16. `recordVersion`
17. `supersedesId`
18. `validationStatus`
19. `validationErrorsJson`
20. `extensionsJson`

Identifiers, statuses, timestamps, scalar costs, and hashes use scalar columns. Arrays and objects use deterministic JSON in columns ending `Json`. Empty nullable scalar fields are stored blank only when the contract value is explicit `null`; the validator reconstructs that null deliberately.

## 3. Contract-specific ordered columns

The following columns appear after the common columns in exact order.

### `ProductionIntentArtifacts`

`artifactType`, `artifactVersion`, `contentHash`, `sourceRefsJson`, `productionIntentJson`, `status`, `approvalRefsJson`

- Unique key: `recordId`
- Lineage: `storyId`, `packageId`, `packageVersion`
- Write model: append-versioned; approved rows immutable
- Future writer: Production Intent Builder only

### `ProductionAssetRequests`

`requestRevision`, `requestType`, `purpose`, `acceptanceCriteriaJson`, `requiredOutputs`, `sourceProductionIntentArtifactIdsJson`, `promptVersion`, `promptRef`, `promptTextHash`, `promptTextRef`, `referenceIdsJson`, `canonicalCapability`, `requestedSettingsJson`, `budgetStage`, `maximumCost`, `costUnit`, `idempotencyKey`, `idempotencyScope`, `status`, `approvalRequired`, `approvedBy`, `approvedAt`, `retryPolicyId`, `failurePolicyId`

- Unique key: `recordId`
- Lineage: package, scene, shot, planned asset, intent artifacts, references
- Write model: one row per request revision; only declared status fields may change before terminal state
- Future writers: Asset Request Approval and Generation Orchestrator

### `GenerationAttempts`

`productionAssetRequestId`, `attemptNumber`, `idempotencyKey`, `provider`, `adapterName`, `adapterVersion`, `providerModel`, `requestedMode`, `submittedMode`, `observedMode`, `providerDisplayModeRaw`, `providerPayloadHash`, `providerRequestRef`, `providerRequestRefClass`, `requestedSettingsJson`, `actualSettingsJson`, `status`, `providerStatusRaw`, `pollCount`, `submittedAt`, `lastPolledAt`, `nextPollAt`, `timeoutAt`, `outputCountExpected`, `outputCountObserved`, `estimateCostRecordId`, `actualCostRecordId`, `retryOfAttemptId`, `retryReason`, `failureCode`, `failureMessage`, `rawEvidenceRef`, `rawEvidenceHash`, `completedAt`, `reconciledAt`

- Unique key: `recordId`
- Lineage: request plus Milo common lineage
- Write model: one row per attempt; only polling/status/completion fields may update before terminal state
- Future writers: Generation Orchestrator and Generation Reconciler

### `GeneratedAssets`

`generationAttemptId`, `outputIndex`, `outputRole`, `mediaType`, `mimeType`, `durationSeconds`, `frameRate`, `width`, `height`, `audioPresent`, `providerResourceRef`, `providerHistoryRef`, `providerReferenceClass`, `providerRetrievalObservedAt`, `durableStorageProvider`, `durableFileId`, `durablePath`, `byteSize`, `sha256`, `writeRestricted`, `sourceReferenceIdsJson`, `parentGeneratedAssetId`, `status`, `rightsStatus`, `safetyReviewStatus`, `approvalSummaryJson`, `retrievedAt`

- Unique key: `recordId`
- Byte identity: `sha256`; storage ID/path are locators only
- Write model: one row per output/version; approved byte identity immutable
- Future writer: Generation Reconciler; approvals are separate records

### `AssetReferences`

`referencePackId`, `referencePackVersion`, `referenceType`, `subjectId`, `classification`, `sourceCanonPathsJson`, `sourceAssetId`, `storageId`, `sha256`, `usePermissions`, `licenceSource`, `expiresAt`, `territory`, `restrictionsJson`, `approvedUsesJson`, `disallowedUsesJson`, `approvalDecision`, `approvedBy`, `approvedAt`, `activeFrom`, `retiredAt`, `supersededByReferenceId`

- Unique key: `recordId`
- Write model: append-versioned; retirement/supersession preserves history
- Future writer: Reference Approval

### `RevisionRequests`

`parentGeneratedAssetId`, `parentChecksum`, `revisionNumber`, `revisionType`, `allowedChangesJson`, `preservedInvariantsJson`, `expectedObservableResult`, `maximumNewAttempts`, `budgetStage`, `revisionCostCap`, `costUnit`, `reusePriorInputs`, `status`, `approvedBy`, `approvedAt`, `newProductionAssetRequestId`

- Unique key: `recordId`
- Write model: append-versioned; parent immutable
- Future writer: Revision Processor

### `AssetApprovals`

`decision`, `approvedBy`, `approvedAt`, `reviewNotes`, `generatedAssetId`, `assetRecordVersion`, `reviewedChecksum`, `rightsConfirmed`, `safetyConfirmed`, `supersedesApprovalId`

- Unique key: `recordId`
- Write model: append-only human decision bound to exact checksum
- Future writer: Asset Approval

### `CostRecords`

`requestId`, `attemptId`, `budgetStage`, `eventType`, `unit`, `quantity`, `unitPrice`, `total`, `providerBalanceBefore`, `providerBalanceAfter`, `costSource`, `providerCostRef`, `occurredAt`, `recordedAt`, `varianceAgainstEstimate`, `reason`, `evidenceRef`, `adjustsCostRecordId`

- Unique key: `recordId`
- Write model: append-only ledger; corrections use `ADJUSTMENT`
- Future writers: Generation Orchestrator and Generation Reconciler

### `EpisodeAssemblies`

`assemblyVersion`, `assemblyProfile`, `inputAssetsJson`, `timelineManifestJson`, `timelineManifestHash`, `audioManifestJson`, `captionRefsJson`, `creditsRef`, `provenanceManifestRef`, `rendererName`, `rendererVersion`, `buildImageVersion`, `commandConfigHash`, `outputFileId`, `outputChecksum`, `status`, `technicalQaJson`, `creativeQaStatus`, `rebuildOfAssemblyId`

- Unique key: `recordId`
- Write model: append-versioned; terminal assembly inputs and output identity immutable
- Future writer: Assembly Builder

### `AssemblyApprovals`

`decision`, `approvedBy`, `approvedAt`, `reviewNotes`, `episodeAssemblyId`, `assemblyVersion`, `reviewedChecksum`, `qaEvidenceRefsJson`, `supersedesApprovalId`

- Unique key: `recordId`
- Write model: append-only decision bound to exact master checksum
- Future writer: Assembly Approval

### `PublishingPackages`

`platform`, `profileId`, `profileVersion`, `sourceAssemblyId`, `sourceAssemblyChecksum`, `mediaFileId`, `mediaChecksum`, `coverFileId`, `coverChecksum`, `captionFileIdsJson`, `title`, `description`, `tagsJson`, `creditsRef`, `provenanceRefsJson`, `audienceSetting`, `safetySetting`, `releaseIntent`, `requestedSchedule`, `status`, `validationEvidenceRefsJson`, `manifestHash`

- Unique key: `recordId`
- Write model: append-versioned; approved package immutable
- Future writer: Publishing Package Builder

### `PublishingApprovals`

`decision`, `approvedBy`, `approvedAt`, `reviewNotes`, `publishingPackageId`, `publishingPackageVersion`, `reviewedManifestHash`, `audienceDecision`, `safetyDecision`, `releaseIntent`, `releaseConstraintsJson`, `supersedesApprovalId`

- Unique key: `recordId`
- Write model: append-only human decision; no publication action or receipt
- Future writer: Publishing Approval

## 4. `StudioControl`

`StudioControl` is not a contract or operational source of truth. It is a derived, reproducible projection for operators and is read-only to consumers and operators.

Exact proposed columns:

1. `controlKey`
2. `scopeType`
3. `storyId`
4. `packageId`
5. `currentStage`
6. `readinessState`
7. `blockingReasonCodesJson`
8. `pendingApprovalTypesJson`
9. `openFailureCount`
10. `budgetStageStatusJson`
11. `sourceRecordRefsJson`
12. `derivationVersion`
13. `lastDerivedAt`

Rules:

- It is derived, read-only, non-authoritative, and replaceable in full.
- It does not use the common contract envelope and is not a thirteenth contract.
- No lifecycle transition, approval, cost, asset identity, or publication decision may use it as the source of truth.
- Future authorised implementation regenerates it from authoritative records.
- `openFailureCount` may be derived from the existing `FailureLog`; no failure event is copied into `StudioControl`.
- Blocking reason codes are derived references, not operational error events.
- Manual edits have no authority.

## 5. Existing shared `FailureLog`

The existing `FailureLog` remains the sole approved operational failure store. Its exact 18-column schema is governed by `FAILURE_INSTRUMENTATION.md` and is unchanged by M8 Phase 2.

Future M8 workflows must send their registered error codes through the existing shared Failure Handler. This specification does not create, migrate, write, or modify `FailureLog` and does not create an `M8Errors` substitute.

## 6. Validation and write controls

- Validate schema, IDs, lineage, JSON, controlled values, cross-tab references, hashes, approvals, budget, and transitions before write.
- Disable automatic retry on every append.
- Read back and compare field-for-field before a dependent lifecycle transition.
- Store no binary media, secret, credential, token, signed URL, endpoint, or live configuration.
- Provider-specific values remain in namespaced adapter data.
- Approved files are write-restricted; every corrected byte stream receives a new file and record.
- Immediately before assembly, recompute each exact durable input SHA-256 and require equality with its approval.

## 7. Phase boundary

No tab is created or changed under Phase 2. Live schema installation requires a separate A3 instruction.
