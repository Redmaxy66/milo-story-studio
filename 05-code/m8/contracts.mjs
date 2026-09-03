import fs from 'node:fs';

const controlled = JSON.parse(fs.readFileSync(new URL('../../02-story-system/M8_CONTROLLED_VALUES.json', import.meta.url), 'utf8'));

const commonFields = [
  'schemaVersion','recordType','recordId','storyId','packageId','packageVersion','sceneId','shotId','plannedAssetId',
  'canonVersion','canonRef','createdAt','createdBy','updatedAt','workflowExecutionId','recordVersion','supersedesId',
  'validationStatus','validationErrors','extensionsJson',
];

const specificFields = {
  ProductionIntentArtifact:['artifactType','artifactVersion','contentHash','sourceRefs','productionIntent','status','approvalRefs'],
  ProductionAssetRequest:['requestRevision','requestType','purpose','acceptanceCriteria','requiredOutputs','sourceProductionIntentArtifactIds','promptVersion','promptRef','promptTextHash','promptTextRef','referenceIds','canonicalCapability','requestedSettingsJson','budgetStage','maximumCost','costUnit','idempotencyKey','idempotencyScope','status','approvalRequired','approvedBy','approvedAt','retryPolicyId','failurePolicyId'],
  GenerationAttempt:['productionAssetRequestId','attemptNumber','idempotencyKey','provider','adapterName','adapterVersion','providerModel','requestedMode','submittedMode','observedMode','providerDisplayModeRaw','providerPayloadHash','providerRequestRef','providerRequestRefClass','requestedSettingsJson','actualSettingsJson','status','providerStatusRaw','pollCount','submittedAt','lastPolledAt','nextPollAt','timeoutAt','outputCountExpected','outputCountObserved','estimateCostRecordId','actualCostRecordId','retryOfAttemptId','retryReason','failureCode','failureMessage','rawEvidenceRef','rawEvidenceHash','completedAt','reconciledAt'],
  GeneratedAsset:['generationAttemptId','outputIndex','outputRole','mediaType','mimeType','durationSeconds','frameRate','width','height','audioPresent','providerResourceRef','providerHistoryRef','providerReferenceClass','providerRetrievalObservedAt','durableStorageProvider','durableFileId','durablePath','byteSize','sha256','writeRestricted','sourceReferenceIds','parentGeneratedAssetId','status','rightsStatus','safetyReviewStatus','approvalSummary','retrievedAt'],
  AssetReference:['referencePackId','referencePackVersion','referenceType','subjectId','classification','sourceCanonPaths','sourceAssetId','storageId','sha256','usePermissions','licenceSource','expiresAt','territory','restrictions','approvedUses','disallowedUses','approvalDecision','approvedBy','approvedAt','activeFrom','retiredAt','supersededByReferenceId'],
  RevisionRequest:['parentGeneratedAssetId','parentChecksum','revisionNumber','revisionType','allowedChanges','preservedInvariants','expectedObservableResult','maximumNewAttempts','budgetStage','revisionCostCap','costUnit','reusePriorInputs','status','approvedBy','approvedAt','newProductionAssetRequestId'],
  AssetApproval:['decision','approvedBy','approvedAt','reviewNotes','generatedAssetId','assetRecordVersion','reviewedChecksum','rightsConfirmed','safetyConfirmed','supersedesApprovalId'],
  CostRecord:['requestId','attemptId','budgetStage','eventType','unit','quantity','unitPrice','total','providerBalanceBefore','providerBalanceAfter','costSource','providerCostRef','occurredAt','recordedAt','varianceAgainstEstimate','reason','evidenceRef','adjustsCostRecordId'],
  EpisodeAssembly:['assemblyVersion','assemblyProfile','inputAssets','timelineManifest','timelineManifestHash','audioManifest','captionRefs','creditsRef','provenanceManifestRef','rendererName','rendererVersion','buildImageVersion','commandConfigHash','outputFileId','outputChecksum','status','technicalQa','creativeQaStatus','rebuildOfAssemblyId'],
  AssemblyApproval:['decision','approvedBy','approvedAt','reviewNotes','episodeAssemblyId','assemblyVersion','reviewedChecksum','qaEvidenceRefs','supersedesApprovalId'],
  PublishingPackage:['platform','profileId','profileVersion','sourceAssemblyId','sourceAssemblyChecksum','mediaFileId','mediaChecksum','coverFileId','coverChecksum','captionFileIds','title','description','tags','creditsRef','provenanceRefs','audienceSetting','safetySetting','releaseIntent','requestedSchedule','status','validationEvidenceRefs','manifestHash'],
  PublishingApproval:['decision','approvedBy','approvedAt','reviewNotes','publishingPackageId','publishingPackageVersion','reviewedManifestHash','audienceDecision','safetyDecision','releaseIntent','releaseConstraints','supersedesApprovalId'],
};

const hashFields = new Set(['contentHash','promptTextHash','idempotencyKey','providerPayloadHash','rawEvidenceHash','sha256','parentChecksum','reviewedChecksum','timelineManifestHash','commandConfigHash','outputChecksum','sourceAssemblyChecksum','mediaChecksum','coverChecksum','manifestHash','reviewedManifestHash']);
const enumChecks = {
  validationStatus:'validationStatuses', artifactType:'artifactTypes', requestType:'requestTypes', canonicalCapability:'canonicalCapabilities',
  budgetStage:'budgetStages', costUnit:'costUnits', providerReferenceClass:'providerReferenceClasses', outputRole:'outputRoles',
  rightsStatus:'rightsStatuses', safetyReviewStatus:'safetyStatuses', classification:'referenceClassifications', decision:'approvalDecisions',
  approvalDecision:'approvalDecisions', eventType:'costEventTypes', unit:'costUnits', costSource:'costSources', releaseIntent:'releaseIntents',
};

const issue = (code, path, message) => ({code, path, message});
const isTimestamp = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
const nullable = new Set(['sceneId','shotId','plannedAssetId','workflowExecutionId','supersedesId','approvedBy','approvedAt','submittedMode','observedMode','providerDisplayModeRaw','providerRequestRef','providerStatusRaw','submittedAt','lastPolledAt','nextPollAt','timeoutAt','estimateCostRecordId','actualCostRecordId','retryOfAttemptId','retryReason','failureCode','failureMessage','rawEvidenceRef','rawEvidenceHash','completedAt','reconciledAt','durationSeconds','frameRate','width','height','audioPresent','parentGeneratedAssetId','expiresAt','retiredAt','supersededByReferenceId','newProductionAssetRequestId','attemptId','unitPrice','providerBalanceBefore','providerBalanceAfter','varianceAgainstEstimate','providerCostRef','evidenceRef','adjustsCostRecordId','outputFileId','outputChecksum','rebuildOfAssemblyId','requestedSchedule','supersedesApprovalId','sourceAssetId']);

function validateEnvelope(record, errors) {
  for (const field of commonFields) if (!Object.hasOwn(record, field)) errors.push(issue('M8_CONTRACT_INVALID', `$.${field}`, 'required property missing'));
  if (record.schemaVersion !== 'm8-contracts-v1.0') errors.push(issue('M8_CONTRACT_INVALID', '$.schemaVersion', 'unsupported schema version'));
  if (!controlled.recordTypes.includes(record.recordType)) errors.push(issue('M8_CONTROLLED_VALUE_INVALID', '$.recordType', 'unknown record type'));
  if (!/^MILO-[0-9]{3}$/.test(record.storyId ?? '')) errors.push(issue('M8_LINEAGE_INVALID', '$.storyId', 'invalid Story ID'));
  if (!/^MILO-[0-9]{3}-S[0-9]{2}-P[0-9]{2}$/.test(record.packageId ?? '')) errors.push(issue('M8_LINEAGE_INVALID', '$.packageId', 'invalid package ID'));
  if (!Number.isInteger(record.packageVersion) || record.packageVersion < 1) errors.push(issue('M8_LINEAGE_INVALID', '$.packageVersion', 'invalid package version'));
  if (!/^canon-v[0-9]+\.[0-9]+(?:-fixture)?$/.test(record.canonVersion ?? '')) errors.push(issue('M8_LINEAGE_INVALID', '$.canonVersion', 'invalid canon version'));
  if (!/^[a-f0-9]{40}$/.test(record.canonRef ?? '')) errors.push(issue('M8_LINEAGE_INVALID', '$.canonRef', 'canonRef must be a full lowercase Git commit SHA'));
  for (const field of ['createdAt','updatedAt']) if (!isTimestamp(record[field])) errors.push(issue('M8_CONTRACT_INVALID', `$.${field}`, 'invalid timestamp'));
  if (!Number.isInteger(record.recordVersion) || record.recordVersion < 1) errors.push(issue('M8_CONTRACT_INVALID', '$.recordVersion', 'recordVersion must be a positive integer'));
  if (!Array.isArray(record.validationErrors)) errors.push(issue('M8_CONTRACT_INVALID', '$.validationErrors', 'must be an array'));
  if (!record.extensionsJson || typeof record.extensionsJson !== 'object' || Array.isArray(record.extensionsJson)) errors.push(issue('M8_CONTRACT_INVALID', '$.extensionsJson', 'must be an object'));
  for (const field of ['sceneId','shotId','plannedAssetId','workflowExecutionId','supersedesId']) if (!Object.hasOwn(record, field)) errors.push(issue('M8_CONTRACT_INVALID', `$.${field}`, 'explicit null required when inapplicable'));
}

function validateSpecific(record, errors) {
  const fields = specificFields[record.recordType];
  if (!fields) return;
  for (const field of fields) if (!Object.hasOwn(record, field)) errors.push(issue('M8_CONTRACT_INVALID', `$.${field}`, 'required property missing'));
  const allowed = new Set([...commonFields, ...fields]);
  for (const field of Object.keys(record)) if (!allowed.has(field)) errors.push(issue('M8_CONTRACT_INVALID', `$.${field}`, 'additional property prohibited'));
  for (const field of hashFields) if (Object.hasOwn(record, field) && record[field] !== null && !/^[a-f0-9]{64}$/.test(record[field])) errors.push(issue('M8_CONTRACT_INVALID', `$.${field}`, 'must be lowercase SHA-256'));
  if (Object.hasOwn(record, 'promptRef') && !/^[a-f0-9]{40}$/.test(record.promptRef ?? '')) errors.push(issue('M8_CONTRACT_INVALID', '$.promptRef', 'must be a full lowercase Git commit SHA'));
  for (const [field, source] of Object.entries(enumChecks)) if (Object.hasOwn(record, field) && record[field] !== null && !controlled[source].includes(record[field])) errors.push(issue('M8_CONTROLLED_VALUE_INVALID', `$.${field}`, `value not in ${source}`));
  for (const field of Object.keys(record)) if (record[field] === undefined) errors.push(issue('M8_CONTRACT_INVALID', `$.${field}`, 'undefined is prohibited; use explicit null'));
  if (record.recordType === 'ProductionAssetRequest' && !controlled[`${'productionRequest'}States`]?.includes(record.status)) errors.push(issue('M8_CONTROLLED_VALUE_INVALID', '$.status', 'invalid request state'));
  if (record.recordType === 'GenerationAttempt' && !controlled.generationAttemptStates.includes(record.status)) errors.push(issue('M8_CONTROLLED_VALUE_INVALID', '$.status', 'invalid attempt state'));
  if (record.recordType === 'GeneratedAsset' && !controlled.generatedAssetStates.includes(record.status)) errors.push(issue('M8_CONTROLLED_VALUE_INVALID', '$.status', 'invalid asset state'));
  if (record.recordType === 'RevisionRequest' && !controlled.revisionRequestStates.includes(record.status)) errors.push(issue('M8_CONTROLLED_VALUE_INVALID', '$.status', 'invalid revision state'));
  if (record.recordType === 'EpisodeAssembly' && !controlled.assemblyStates.includes(record.status)) errors.push(issue('M8_CONTROLLED_VALUE_INVALID', '$.status', 'invalid assembly state'));
  if (record.recordType === 'PublishingPackage' && !controlled.publishingPackageStates.includes(record.status)) errors.push(issue('M8_CONTROLLED_VALUE_INVALID', '$.status', 'invalid package state'));
  if (record.recordType === 'GeneratedAsset' && record.status === 'APPROVED' && record.writeRestricted !== true) errors.push(issue('M8_DURABLE_FILE_NOT_WRITE_RESTRICTED', '$.writeRestricted', 'approved asset must be write-restricted'));
  if (record.recordType === 'EpisodeAssembly') for (const [index, input] of (record.inputAssets ?? []).entries()) {
    if (input.writeRestricted !== true) errors.push(issue('M8_DURABLE_FILE_NOT_WRITE_RESTRICTED', `$.inputAssets[${index}].writeRestricted`, 'assembly input must be write-restricted'));
    if (input.preAssemblyHashVerified !== true) errors.push(issue('M8_DURABLE_CHECKSUM_MISMATCH', `$.inputAssets[${index}].preAssemblyHashVerified`, 'fresh pre-assembly checksum required'));
  }
  if (record.recordType === 'CostRecord' && record.budgetStage !== 'CONNECTIVITY' && controlled.budgetPolicy[record.budgetStage]?.approvedCap !== null) errors.push(issue('M8_CROSS_STAGE_BUDGET_TRANSFER_PROHIBITED', '$.budgetStage', 'stage policy conflict'));
  void nullable;
}

export function validateContract(record) {
  const errors = [];
  if (!record || typeof record !== 'object' || Array.isArray(record)) return {valid:false, errors:[issue('M8_CONTRACT_INVALID', '$', 'record must be an object')]};
  validateEnvelope(record, errors);
  validateSpecific(record, errors);
  return {valid:errors.length === 0, errors};
}

export function validateTransition(recordType, from, to) {
  const allowed = controlled.transitions[recordType]?.[from];
  const valid = Array.isArray(allowed) && allowed.includes(to);
  return valid ? {valid:true, errors:[]} : {valid:false, errors:[issue('M8_CONTROLLED_VALUE_INVALID', '$.status', `${recordType} transition ${from} -> ${to} is not allowed`)]};
}

export function validateCrossContractLineage(records) {
  const errors = [];
  if (!Array.isArray(records)) return {valid:false, errors:[issue('M8_CONTRACT_INVALID', '$', 'records must be an array')]};
  const ids = new Set();
  const baseline = records[0];
  for (const [index, record] of records.entries()) {
    if (ids.has(record.recordId)) errors.push(issue('M8_LINEAGE_MISMATCH', `$[${index}].recordId`, 'duplicate record ID'));
    ids.add(record.recordId);
    if (baseline && ['storyId','packageId','packageVersion','canonVersion','canonRef'].some(field => record[field] !== baseline[field])) errors.push(issue('M8_LINEAGE_MISMATCH', `$[${index}]`, 'common lineage differs'));
  }
  const byType = type => records.filter(record => record.recordType === type);
  for (const attempt of byType('GenerationAttempt')) if (!ids.has(attempt.productionAssetRequestId)) errors.push(issue('M8_LINEAGE_MISMATCH', '$.productionAssetRequestId', 'request not found'));
  for (const asset of byType('GeneratedAsset')) if (!ids.has(asset.generationAttemptId)) errors.push(issue('M8_LINEAGE_MISMATCH', '$.generationAttemptId', 'attempt not found'));
  for (const approval of byType('AssetApproval')) {
    const asset = records.find(record => record.recordId === approval.generatedAssetId);
    if (!asset || asset.sha256 !== approval.reviewedChecksum) errors.push(issue('M8_LINEAGE_MISMATCH', '$.reviewedChecksum', 'asset approval does not bind the asset checksum'));
  }
  return {valid:errors.length === 0, errors};
}

export function validateContractCollection(records) {
  const errors = [];
  for (const [index, record] of (Array.isArray(records) ? records : []).entries()) for (const error of validateContract(record).errors) errors.push({...error, path:`$[${index}]${error.path.slice(1)}`});
  errors.push(...validateCrossContractLineage(records).errors);
  return {valid:errors.length === 0, errors};
}

export function assertValidContract(record) {
  const result = validateContract(record);
  if (!result.valid) throw new TypeError(result.errors.map(error => `${error.code} ${error.path}: ${error.message}`).join('; '));
  return record;
}

export {commonFields, specificFields, controlled};
