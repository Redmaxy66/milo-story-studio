export const OPENART_ADAPTER_VERSION = 'openart-adapter-v0.1';
export const OPENART_OPERATIONS = Object.freeze([
  'discoverCapabilities','validateRequest','estimateCost','submitGeneration','getGenerationStatus',
  'listGenerationOutputs','retrieveResourceMetadata','retrieveResource','reconcileCost','classifyProviderFailure',
]);

const statusMap = new Map([
  ['CREATED','CREATED'], ['QUEUED','SUBMITTED'], ['SUBMITTED','SUBMITTED'], ['PENDING','SUBMITTED'],
  ['RUNNING','RUNNING'], ['PROCESSING','RUNNING'], ['COMPLETED','COMPLETED'], ['SUCCEEDED','COMPLETED'],
  ['FAILED','FAILED'], ['ERROR','FAILED'], ['CANCELLED','CANCELLED'], ['CANCELED','CANCELLED'],
  ['TIMED_OUT','TIMED_OUT'], ['TIMEOUT','TIMED_OUT'],
]);

export function liveOperationNotImplemented(operation) {
  if (!OPENART_OPERATIONS.includes(operation)) throw new TypeError(`Unknown adapter operation: ${operation}`);
  return {ok:false, code:'OPENART_LIVE_OPERATION_NOT_IMPLEMENTED', adapterVersion:OPENART_ADAPTER_VERSION, operation};
}

export function normalizeProviderStatus(rawStatus, {expectedOutputs = 1, observedOutputs = 0, resourceAvailable = false} = {}) {
  const raw = String(rawStatus ?? '').trim();
  const mapped = statusMap.get(raw.toUpperCase());
  if (!mapped) return {normalizedStatus:'RECONCILIATION_REQUIRED', failureCode:'OPENART_MODE_METADATA_MISMATCH', providerStatusRaw:raw || null};
  if (mapped === 'COMPLETED' && observedOutputs === 0 && !resourceAvailable) return {normalizedStatus:'RECONCILIATION_REQUIRED', failureCode:'OPENART_COMPLETED_WITHOUT_ASSET', providerStatusRaw:raw};
  if (mapped === 'COMPLETED' && observedOutputs < expectedOutputs) return {normalizedStatus:'COMPLETED_PARTIAL', failureCode:'OPENART_PARTIAL_RESULT', providerStatusRaw:raw};
  return {normalizedStatus:mapped, failureCode:mapped === 'FAILED' ? 'OPENART_GENERATION_FAILED' : mapped === 'TIMED_OUT' ? 'OPENART_GENERATION_TIMED_OUT' : null, providerStatusRaw:raw};
}

export function reconcileCost({estimateCost, actualCost, cap}) {
  const values = [estimateCost, actualCost, cap].map(value => value === null ? null : Number(value));
  if (values.some(value => value !== null && (!Number.isFinite(value) || value < 0))) return {ok:false, code:'OPENART_COST_RECONCILIATION_FAILED'};
  const [estimate, actual, limit] = values;
  if (estimate === null) return {ok:false, code:'OPENART_COST_ESTIMATE_FAILED'};
  if (limit === null || estimate > limit || (actual !== null && actual > limit)) return {ok:false, code:'OPENART_COST_CAP_EXCEEDED'};
  if (actual === null) return {ok:false, code:'OPENART_COST_RECONCILIATION_FAILED'};
  const variance = estimate === 0 ? (actual === 0 ? 0 : Infinity) : Math.abs(actual - estimate) / estimate;
  return {ok:variance <= 0.1, code:variance <= 0.1 ? null : 'OPENART_COST_RECONCILIATION_FAILED', variance};
}

export function classifyProviderFailure({kind, providerIdObserved = false, chargeObserved = false} = {}) {
  const map = {
    authentication:'OPENART_AUTHENTICATION_FAILED', capability:'OPENART_CAPABILITY_UNAVAILABLE',
    invalid_request:'OPENART_REQUEST_INVALID', estimate:'OPENART_COST_ESTIMATE_FAILED',
    submission:'OPENART_SUBMISSION_FAILED', poll:'OPENART_STATUS_POLL_FAILED', generation:'OPENART_GENERATION_FAILED',
    timeout:'OPENART_GENERATION_TIMED_OUT', missing_asset:'OPENART_COMPLETED_WITHOUT_ASSET', partial:'OPENART_PARTIAL_RESULT',
    retrieval:'OPENART_RESOURCE_RETRIEVAL_FAILED', cost:'OPENART_COST_RECONCILIATION_FAILED', mode:'OPENART_MODE_METADATA_MISMATCH',
  };
  if (kind === 'submission' && (providerIdObserved || chargeObserved)) return {code:'M8_MANUAL_RECOVERY_REQUIRED', reconciliationRequired:true};
  return {code:map[kind] ?? 'M8_MANUAL_RECOVERY_REQUIRED', reconciliationRequired:['submission','timeout','missing_asset','partial','cost'].includes(kind)};
}

export function validateFixtureShape(fixture) {
  const errors = [];
  const metadata = fixture?.fixtureMetadata;
  if (!metadata || !['recorded','synthetic'].includes(metadata.fixtureType)) errors.push('fixtureMetadata.fixtureType');
  if (metadata?.nonCallable !== true || metadata?.sanitized !== true) errors.push('fixtureMetadata safety flags');
  if (fixture?.adapterVersion !== OPENART_ADAPTER_VERSION || fixture?.provider !== 'OpenArt') errors.push('adapter identity');
  if (metadata?.fixtureType === 'recorded' && metadata.historical !== true) errors.push('recorded fixture must be historical');
  if (metadata?.fixtureType === 'synthetic' && metadata.historical !== false) errors.push('synthetic fixture must not be historical');
  const text = JSON.stringify(fixture ?? {});
  for (const prohibited of ['workspaceId','projectId','endpoint','apiKey','accessToken','refreshToken','authorization','cookie']) if (new RegExp(`"${prohibited}"`, 'i').test(text)) errors.push(`prohibited ${prohibited}`);
  if (metadata?.fixtureType === 'synthetic') for (const value of [fixture.historyId, fixture.resourceId].filter(Boolean)) if (!String(value).startsWith('SYNTHETIC-')) errors.push('synthetic identifier must be inert');
  return {valid:errors.length === 0, errors};
}
