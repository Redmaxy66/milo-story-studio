import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {contentHash, sha256Hex} from './hashing.mjs';

export const PHASE3 = Object.freeze({
  snapshotSha256: 'c1221fe13d7278912b73572658dc569756de4baa98679b7e3567bd3768d98233',
  designSha256: '6934b997f79e3d5aa7ff5b9405926abb8c9e401a1a539a31e16b1c32dac0d8a2',
  packageId: 'MILO-007-S01-P01',
  storyId: 'MILO-007',
  scriptId: 'MILO-007-S01',
  canonVersion: 'canon-v1.0',
  canonRef: '977755913d9ad41e4f16392d01ea993507af4102',
  sceneIds: Array.from({length: 8}, (_, i) => `MILO-007-S01-P01-SC${String(i + 1).padStart(2, '0')}`),
  base: '08-production/MILO-007-S01-P01/phase3',
});

export const PATHS = Object.freeze({
  snapshot: `${PHASE3.base}/source/M7_PRODUCTION_PACKAGE_SNAPSHOT.json`,
  manifest: `${PHASE3.base}/source/SOURCE_MANIFEST.json`,
  reference: `${PHASE3.base}/reference/visual-reference-pack-v1.json`,
  director: `${PHASE3.base}/intent/film-director-briefs-v1.json`,
  visualLanguage: `${PHASE3.base}/intent/episode-visual-language-v1.md`,
  storyboard: `${PHASE3.base}/storyboard/storyboard-v1.json`,
  storyboardReview: `${PHASE3.base}/storyboard/storyboard-review-v1.md`,
  animation: `${PHASE3.base}/animation/animation-production-manifest-v1.json`,
  prompt: '03-prompts/m8/MILO-007-S01-P01/provider-neutral-prompt-bundle-v1.json',
  approvalPackage: `${PHASE3.base}/approval/phase3-approval-package-v1.md`,
  approvalTemplates: `${PHASE3.base}/approval/phase3-approval-record-templates-v1.json`,
  generationGate: `${PHASE3.base}/approval/reference-generation-gate-v1.md`,
  specialistLog: `${PHASE3.base}/SPECIALIST_USAGE_LOG.md`,
});

const JSON_PATHS = ['snapshot', 'manifest', 'reference', 'director', 'storyboard', 'animation', 'prompt', 'approvalTemplates'];
const json = (root, key) => JSON.parse(fs.readFileSync(path.join(root, PATHS[key]), 'utf8'));
const text = (root, key) => fs.readFileSync(path.join(root, PATHS[key]), 'utf8');
const unique = values => new Set(values).size === values.length;
const allStrings = value => JSON.stringify(value);

function parsedScene(scene) {
  return {
    ...scene,
    characters: JSON.parse(scene.charactersJson),
    visual: JSON.parse(scene.visualGuidanceJson),
    voice: JSON.parse(scene.voiceGuidanceJson),
    motion: JSON.parse(scene.motionGuidanceJson),
    assets: JSON.parse(scene.assetRequirementsJson),
    notes: JSON.parse(scene.productionNotesJson),
  };
}

function assertLineage(lineage) {
  assert.equal(lineage.storyId, PHASE3.storyId);
  assert.equal(lineage.packageId, PHASE3.packageId);
  assert.equal(lineage.packageVersion, 1);
  assert.equal(lineage.scriptId, PHASE3.scriptId);
  assert.equal(lineage.canonVersion, PHASE3.canonVersion);
  assert.equal(lineage.canonRef, PHASE3.canonRef);
}

function assertEnvelope(artifact, type, id) {
  assert.equal(artifact.schemaVersion, 'm8-phase3-artifact-v1.0');
  assert.equal(artifact.artifactType, type);
  assert.equal(artifact.artifactId, id);
  assert.equal(artifact.artifactVersion, 1);
  assert.equal(artifact.status, 'AWAITING_APPROVAL');
  assertLineage(artifact.lineage);
  assert.equal(artifact.contentHash, contentHash(artifact.content));
  assert.equal(artifact.sourceBindings.length, 2);
  assert(artifact.sourceBindings.some(x => x.type === 'M7_APPROVED_SNAPSHOT' && x.byteSha256 === PHASE3.snapshotSha256 && x.immutable));
  assert(artifact.sourceBindings.some(x => x.type === 'M8_DESIGN_BASELINE' && x.byteSha256 === PHASE3.designSha256 && x.immutable));
}

export function validateMinimalFixture(fixture) {
  assert.equal(fixture.schemaVersion, 'm8-phase3-test-fixture-v1.0');
  assert.equal(fixture.status, 'AWAITING_APPROVAL');
  assert.equal(fixture.generatedMedia, false);
  assert.equal(fixture.liveTargets, false);
  assert(Array.isArray(fixture.scenes) && fixture.scenes.length > 0);
  assert(unique(fixture.scenes.map(x => x.sceneId)));
  for (const [index, scene] of fixture.scenes.entries()) {
    assert.equal(scene.sceneNumber, index + 1);
    assert(scene.sourceText.length > 0);
    assert.equal(scene.sourceTextHash, contentHash(scene.sourceText));
    assert(Array.isArray(scene.shots) && scene.shots.length > 0);
    assert(unique(scene.shots.map(x => x.shotId)));
  }
  return true;
}

export function rejectInvalidFixtureCase(validFixture, invalidCase) {
  const clone = structuredClone(validFixture);
  switch (invalidCase.mutation) {
    case 'DUPLICATE_SCENE': clone.scenes.push(structuredClone(clone.scenes[0])); break;
    case 'NONCONTIGUOUS_SCENE': clone.scenes[0].sceneNumber = 2; break;
    case 'SOURCE_HASH_MISMATCH': clone.scenes[0].sourceTextHash = '0'.repeat(64); break;
    case 'EMPTY_SOURCE': clone.scenes[0].sourceText = ''; break;
    case 'DUPLICATE_SHOT': clone.scenes[0].shots.push(structuredClone(clone.scenes[0].shots[0])); break;
    case 'APPROVAL_CLAIM': clone.status = 'APPROVED'; break;
    case 'GENERATED_MEDIA_CLAIM': clone.generatedMedia = true; break;
    case 'LIVE_TARGET': clone.liveTargets = true; break;
    default: throw new Error(`Unknown invalid fixture mutation: ${invalidCase.mutation}`);
  }
  assert.throws(() => validateMinimalFixture(clone));
  return true;
}

export function validatePhase3Repository(root) {
  const passed = [];
  const check = (name, fn) => { fn(); passed.push(name); };
  const docs = {};
  for (const [key, relative] of Object.entries(PATHS)) {
    check(`path:${key}`, () => assert(fs.statSync(path.join(root, relative)).isFile()));
  }
  for (const key of JSON_PATHS) check(`json:${key}`, () => { docs[key] = json(root, key); });

  const sourceBytes = fs.readFileSync(path.join(root, PATHS.snapshot));
  const source = docs.snapshot;
  check('snapshot:byte-sha', () => assert.equal(sha256Hex(sourceBytes), PHASE3.snapshotSha256));
  check('snapshot:shape', () => {
    assert.equal(source.snapshotVersion, 'm7-approved-snapshot-v1.0');
    assert(source.packageHeader && !Array.isArray(source.packageHeader));
    assert.equal(source.scenes.length, 8);
  });
  check('snapshot:header', () => {
    const h = source.packageHeader;
    assert.equal(h.packageId, PHASE3.packageId);
    assert.equal(h.packageVersion, 1);
    assert.equal(h.generationMode, 'INITIAL');
    assert.equal(h.storyId, PHASE3.storyId);
    assert.equal(h.scriptId, PHASE3.scriptId);
    assert.equal(h.canonVersion, PHASE3.canonVersion);
    assert.equal(h.canonRef, PHASE3.canonRef);
    assert.equal(h.sceneCount, 8);
  });
  const sourceScenes = source.scenes.map(parsedScene);
  check('snapshot:scene-ids', () => assert.deepEqual(sourceScenes.map(x => x.sceneId), PHASE3.sceneIds));
  check('snapshot:scene-order', () => assert.deepEqual(sourceScenes.map(x => x.sceneNumber), [1,2,3,4,5,6,7,8]));
  check('snapshot:scene-unique', () => assert(unique(sourceScenes.map(x => x.sceneId))));
  check('snapshot:scene-lineage', () => sourceScenes.forEach(x => {
    assert.equal(x.packageId, PHASE3.packageId); assert.equal(x.storyId, PHASE3.storyId);
    assert.equal(x.scriptId, PHASE3.scriptId); assert.equal(x.canonVersion, PHASE3.canonVersion); assert.equal(x.canonRef, PHASE3.canonRef);
  }));
  check('snapshot:complete-creative-fields', () => sourceScenes.forEach(x => {
    assert(x.sourceText && x.sceneDescription && x.setting);
    assert(x.characters.length > 0 && x.visual.visualPrompt && x.voice.overallTone && x.motion.motionPrompt);
    assert(Array.isArray(x.assets) && x.notes.sceneNotes.length > 0);
  }));
  check('snapshot:no-live-metadata', () => {
    const raw = sourceBytes.toString('utf8');
    assert(!/(workspaceId|projectId|credential|token|signedUrl|spreadsheetId|tabId|https?:\/\/)/i.test(raw));
  });

  const manifest = docs.manifest;
  check('manifest:id', () => assert.equal(manifest.manifestId, 'MILO-007-S01-P01-P3SRC-V001'));
  check('manifest:lineage', () => assertLineage(manifest.lineage));
  check('manifest:sources', () => {
    assert(manifest.sources.some(x => x.type === 'M7_APPROVED_SNAPSHOT' && x.byteSha256 === PHASE3.snapshotSha256 && x.verified));
    assert(manifest.sources.some(x => x.type === 'M8_DESIGN_BASELINE' && x.byteSha256 === PHASE3.designSha256 && x.verifiedReadOnly && x.repositoryPath === null));
  });
  check('manifest:artifact-byte-hashes', () => manifest.artifacts.forEach(item => {
    assert.equal(sha256Hex(fs.readFileSync(path.join(root, item.path))), item.byteSha256, item.path);
  }));

  const reference = docs.reference;
  check('reference:envelope', () => assertEnvelope(reference, 'VISUAL_REFERENCE_PACK', 'MILO-007-S01-P01-REFPACK-V001'));
  check('reference:non-canon', () => assert.equal(reference.content.artifactNature, 'DERIVED_CANON_CONTROLLED_NON_CANON_PRODUCTION_ARTIFACT'));
  check('reference:classifications', () => assert.deepEqual(new Set(reference.content.entries.map(x => x.classification)), new Set(['CANON_FACT_DERIVATION','APPROVED_PRODUCTION_CHOICE','APPROVED_NON_CANON_REFERENCE'])));
  check('reference:required-categories', () => ['CHARACTER','ENVIRONMENT','PROP','SCALE','PALETTE','LIGHTING'].forEach(type => assert(reference.content.entries.some(x => x.referenceType === type))));
  check('reference:unique-ids', () => assert(unique(reference.content.entries.map(x => x.referenceId))));
  check('reference:no-asset-claim', () => {
    assert.deepEqual(reference.content.generatedAssets, []);
    reference.content.entries.forEach(x => { assert.equal(x.approvalStatus, 'PENDING_REVIEW'); assert.equal(x.assetState, 'SPECIFICATION_ONLY'); assert.equal(x.checksumBinding.sha256, null); });
  });
  check('reference:rights-provenance', () => reference.content.entries.forEach(x => { assert(x.rightsAndProvenance.rightsStatus && x.rightsAndProvenance.provenanceStatus && x.rightsAndProvenance.restrictions.length); }));
  check('reference:checksum-control', () => reference.content.entries.forEach(x => { assert(x.checksumBinding.requiredForLaterApprovedAsset); assert(/new file, record, checksum/i.test(x.checksumBinding.rule)); }));
  check('reference:spike-excluded', () => assert(/never an approved Milo reference/i.test(reference.content.spikeMediaTreatment)));

  const director = docs.director;
  check('director:envelope', () => assertEnvelope(director, 'DIRECTOR_BRIEF_COLLECTION', 'MILO-007-S01-P01-PIA-DIRECTOR_SCENES-V001'));
  check('director:specialist', () => { assert.equal(director.content.specialist, 'Film Director'); assert(director.content.specialistInstructionReadInFull); });
  check('director:scene-coverage', () => assert.deepEqual(director.content.scenes.map(x => x.sceneId), PHASE3.sceneIds));
  check('director:source-preservation', () => director.content.scenes.forEach((x,i) => { assert.equal(x.sourceText, sourceScenes[i].sourceText); assert.equal(x.sourceTextHash, contentHash(sourceScenes[i].sourceText)); }));
  check('director:five-sections', () => director.content.scenes.flatMap(x => x.setups).forEach(s => {
    for (const key of ['cameraShotAndAngle','cameraMovement','actorDirection','lightingAndAtmosphere','visualPromptForAiGenerators']) assert(s[key]);
  }));
  check('director:shot-ids', () => {
    const ids = director.content.scenes.flatMap(x => x.setups.map(s => s.shotId));
    assert.equal(ids.length, 24); assert(unique(ids));
  });
  check('director:protected-meaning', () => assert.equal(director.content.protectedStoryMeaningChanged, false));

  const storyboard = docs.storyboard;
  check('storyboard:envelope', () => assertEnvelope(storyboard, 'STORYBOARD', 'MILO-007-S01-P01-PIA-STORYBOARD-V001'));
  check('storyboard:specialist', () => { assert.equal(storyboard.content.specialist, 'Storyboard Creator'); assert(storyboard.content.specialistInstructionReadInFull); });
  check('storyboard:no-images', () => { assert.equal(storyboard.content.format, 'TEXT_SPECIFICATION_ONLY'); assert.deepEqual(storyboard.content.generatedImages, []); });
  check('storyboard:scene-coverage', () => assert.deepEqual(storyboard.content.scenes.map(x => x.sceneId), PHASE3.sceneIds));
  check('storyboard:source-preservation', () => storyboard.content.scenes.forEach((x,i) => { assert.equal(x.sourceText, sourceScenes[i].sourceText); assert.equal(x.sourceTextHash, contentHash(sourceScenes[i].sourceText)); }));
  const sbShots = storyboard.content.scenes.flatMap(x => x.shots);
  const sbPanels = storyboard.content.scenes.flatMap(x => x.panels);
  check('storyboard:shot-count-and-ids', () => { assert.equal(sbShots.length,24); assert(unique(sbShots.map(x=>x.shotId))); });
  check('storyboard:panel-count-and-ids', () => { assert.equal(sbPanels.length,32); assert(unique(sbPanels.map(x=>x.panelId))); });
  check('storyboard:orders', () => storyboard.content.scenes.forEach(x => { assert.deepEqual(x.shots.map(s=>s.shotNumber),[1,2,3]); assert.deepEqual(x.panels.map(p=>p.panelOrder),[1,2,3,4]); }));
  check('storyboard:panel-links', () => sbPanels.forEach(p => { assert(sbShots.some(s => s.shotId===p.shotId)); assert(p.panelDescription && p.providerNeutralStoryboardPrompt && p.geographyAndScreenDirection); }));
  check('storyboard:approval-criteria', () => assert(storyboard.content.humanApprovalCriteria.length >= 5));
  check('storyboard:protected-meaning', () => assert.equal(storyboard.content.protectedStoryMeaningChanged, false));

  const animation = docs.animation;
  check('animation:envelope', () => assertEnvelope(animation, 'ANIMATION_MANIFEST', 'MILO-007-S01-P01-PIA-ANIMATION_MANIFEST-V001'));
  check('animation:specialist', () => { assert.equal(animation.content.specialist, 'Animation Production Director'); assert(animation.content.specialistInstructionReadInFull); assert(animation.content.authorityAndLineage.miloGovernedMode); });
  check('animation:no-render-authority', () => { assert.equal(animation.content.authorityAndLineage.eligibleForRendering,false); assert.deepEqual(animation.content.rendererAdapters,[]); });
  check('animation:shot-match', () => assert.deepEqual(animation.content.shots.map(x=>x.shotId), sbShots.map(x=>x.shotId)));
  check('animation:scene-coverage', () => assert.deepEqual(animation.content.scenes.map(x=>x.sceneId), PHASE3.sceneIds));
  check('animation:frame-rate', () => assert.equal(animation.content.animationIntent.frameRate,24));
  check('animation:frame-arithmetic', () => animation.content.shots.forEach((x,i,all) => { assert.equal(x.outFrame-x.inFrame,x.durationFrames); assert.equal(x.durationSeconds,x.durationFrames/24); if(i) assert.equal(x.inFrame,all[i-1].outFrame); }));
  check('animation:total-timing', () => { const shots=animation.content.shots; assert.equal(shots.at(-1).outFrame,5760); assert.equal(shots.reduce((n,x)=>n+x.durationSeconds,0),240); });
  check('animation:exact-source', () => animation.content.shots.forEach(x => { const s=sourceScenes.find(y=>y.sceneId===x.sceneId); assert.equal(x.sourceText,s.sourceText); assert.equal(x.sourceTextHash,contentHash(s.sourceText)); }));
  check('animation:dialogue-preservation', () => animation.content.scenes.forEach((scene,i) => {
    const expected=sourceScenes[i].voice.dialogueCues.map(x=>x.text); const actual=animation.content.shots.filter(x=>x.sceneId===scene.sceneId).flatMap(x=>x.voiceDialogueSound.dialogueCues.map(c=>c.text)); assert.deepEqual(actual,expected);
  }));
  check('animation:missing-assets-honest', () => animation.content.assets.forEach(x => assert.equal(x.status,'MISSING')));
  check('animation:lip-sync-fallback', () => assert(/fallback/i.test(animation.content.audioPlan.fallbackClassification)));
  check('animation:acceptance-and-revision', () => animation.content.shots.forEach(x => { assert(x.technicalAcceptanceCriteria.length && x.creativeAcceptanceCriteria.length); assert(x.revisionBoundary.allowed.length && x.revisionBoundary.prohibited.length); }));
  check('animation:no-media-claim', () => animation.content.shots.forEach(x => assert.equal(x.assemblyHandoff.outputStatus,'NOT_GENERATED')));

  const prompt = docs.prompt;
  check('prompt:envelope', () => assertEnvelope(prompt, 'PROMPT_BUNDLE', 'MILO-007-S01-P01-PB-V001'));
  check('prompt:count-ids-order', () => { assert.equal(prompt.content.prompts.length,24); assert(unique(prompt.content.prompts.map(x=>x.promptId))); assert.deepEqual(prompt.content.prompts.map(x=>x.promptOrder),Array.from({length:24},(_,i)=>i+1)); });
  check('prompt:shot-coverage', () => assert.deepEqual(prompt.content.prompts.map(x=>x.shotId), animation.content.shots.map(x=>x.shotId)));
  check('prompt:source-provenance', () => prompt.content.prompts.forEach(x => { assert(x.exactSourceArtifactReferences.length>=2); x.exactSourceArtifactReferences.forEach(r=>assert(/^[a-f0-9]{64}$/.test(r.contentHash))); }));
  check('prompt:required-fields', () => prompt.content.prompts.forEach(x => { assert(x.positiveRequirements.length && x.negativeConstraints.length && x.referenceRoles.length && x.continuityLocks.length && x.allowedChanges.length && x.prohibitedChanges.length && x.acceptanceCriteria.length); }));
  check('prompt:requested-observed-separation', () => prompt.content.prompts.forEach(x => { assert(x.requestedSettings && x.observedSettings===null); }));
  check('prompt:provider-neutral', () => {
    for (const key of ['provider','model','workspaceId','projectId','endpoint','credential','token']) assert.equal(prompt.content.providerNeutrality[key],null);
    assert.equal(prompt.content.providerNeutrality.callable,false);
    prompt.content.prompts.forEach(x => { for (const key of ['provider','model','workspaceId','projectId','endpoint','credential','token']) assert.equal(x.providerProjection[key],null); assert.equal(x.providerProjection.observedSettings,null); });
  });
  check('prompt:no-authority', () => { assert(/NO_PROVIDER_CALL_AUTHORIZED/.test(prompt.content.status)); prompt.content.prompts.forEach(x=>assert.equal(x.status,'DRAFT_NOT_AUTHORIZED')); });

  const templates = docs.approvalTemplates;
  check('approval:templates-only', () => { assert.equal(templates.status,'PENDING_REVIEW'); assert.equal(templates.records.length,6); assert(templates.records.every(x=>x.liveRecord===false)); });
  check('approval:no-decisions', () => templates.records.forEach(x => { assert.equal(x.status,'PENDING_REVIEW'); assert.equal(x.decision,null); assert.equal(x.reviewer,null); assert.equal(x.reviewedAt,null); }));
  check('approval:target-hashes', () => templates.records.forEach(x => assert(/^[a-f0-9]{64}$/.test(x.targetContentHash))));
  check('approval:package-sections', () => {
    const value=text(root,'approvalPackage');
    for (const phrase of ['Reference-governance approval','Production-intent and Film Director approval','Storyboard approval','Animation-manifest approval','Prompt-bundle approval','Unresolved creative choices','Deviations from M7','Protected-meaning confirmation']) assert(value.includes(phrase));
  });
  check('generation-gate:closed', () => assert(text(root,'generationGate').includes('NOT REQUESTED — SPECIFICATION REVIEW FIRST')));
  check('specialist:all-used', () => {
    const value=text(root,'specialistLog'); for (const specialist of ['Film Director','Storyboard Creator','Animation Production Director']) assert(value.includes(`| ${specialist} | Yes |`)); assert(!value.includes('| Yes |\n'));
  });

  check('boundary:no-credential-values', () => {
    const artifactText = Object.values(PATHS).map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n');
    assert(!/(Bearer\s+[A-Za-z0-9._-]+|sk-[A-Za-z0-9]{12,}|AIza[A-Za-z0-9_-]{20,}|https?:\/\/[^\s"`]*api)/.test(artifactText));
  });
  check('boundary:no-generated-asset', () => {
    const combined=allStrings({reference,director,storyboard,animation,prompt,templates});
    assert(!/"(?:generatedAssets|generatedImages)":\[(?!\])/.test(combined));
    assert(!/"(?:approvalStatus|status)":"APPROVED"/.test(combined));
  });
  check('boundary:no-decision-log-change-required', () => assert.equal(director.content.protectedStoryMeaningChanged || storyboard.content.protectedStoryMeaningChanged, false));
  return {passed: passed.length, checks: passed};
}
