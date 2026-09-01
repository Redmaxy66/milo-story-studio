#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wfPath = '04-n8n-workflows/development/Milo Production Package Generator v0.1.json';
const specPath = '02-story-system/PRODUCTION_PACKAGE_SPEC.md';
const schemaPath = '02-story-system/PRODUCTION_PACKAGE_AI_OUTPUT_SCHEMA.json';
const promptPath = '03-prompts/m7-production-package-generator.md';
const statusPath = '02-story-system/STORY_STATUS_MODEL.md';
const errorsPath = '02-story-system/ERROR_CODE_REGISTER.md';
const decisionsPath = 'DECISION_LOG.md';
const PROMPT_REF = '7947021016f14c84c71421aeb225b80cad990c9d';
const HANDLER_ID = '3an2myLOF7o4STK8';

const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const json = p => JSON.parse(read(p));
const wf = json(wfPath);
const spec = read(specPath);
const schema = json(schemaPath);
const prompt = read(promptPath);
const status = read(statusPath);
const errors = read(errorsPath);
const decisions = read(decisionsPath);
const node = name => wf.nodes.find(n => n.name === name);
const targets = (source, output = 0, type = 'main') => (wf.connections[source]?.[type]?.[output] ?? []).map(x => x.node);
const incomingSources = (workflow, targetName) => Object.entries(workflow.connections).flatMap(([source, connection]) =>
  Object.values(connection).flatMap(branches => branches.flatMap(branch => branch.filter(target => target.node === targetName).map(() => ({source})))));
const tests = [];
const test = (name, fn) => tests.push([name, fn]);

function normalize(s) { return String(s ?? '').replace(/\s+/g, ' ').trim(); }
function packageId(scriptId, version) { return `${scriptId}-P${String(version).padStart(2, '0')}`; }
function sceneId(pkg, n) { return `${pkg}-SC${String(n).padStart(2, '0')}`; }
function assetId(pkg, n) { return `${pkg}-A${String(n).padStart(3, '0')}`; }

function schemaErrors(value, contract, location = '$') {
  const errors = [];
  const actualType = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  if (contract.type && actualType !== contract.type) return [`${location}: expected ${contract.type}, got ${actualType}`];
  if (contract.enum && !contract.enum.includes(value)) errors.push(`${location}: value is outside enum`);
  if (contract.type === 'string' && contract.minLength && value.length < contract.minLength) errors.push(`${location}: string is too short`);
  if (contract.type === 'array') {
    if (contract.minItems !== undefined && value.length < contract.minItems) errors.push(`${location}: too few items`);
    if (contract.maxItems !== undefined && value.length > contract.maxItems) errors.push(`${location}: too many items`);
    if (contract.items) value.forEach((item, index) => errors.push(...schemaErrors(item, contract.items, `${location}[${index}]`)));
  }
  if (contract.type === 'object') {
    for (const key of contract.required ?? []) if (!(key in value)) errors.push(`${location}.${key}: required property missing`);
    if (contract.additionalProperties === false) {
      for (const key of Object.keys(value)) if (!(key in (contract.properties ?? {}))) errors.push(`${location}.${key}: additional property`);
    }
    for (const [key, childContract] of Object.entries(contract.properties ?? {})) {
      if (key in value) errors.push(...schemaErrors(value[key], childContract, `${location}.${key}`));
    }
  }
  return errors;
}

function makeValidAiScene(sourceText = 'Hello explorers.') {
  return {
    sourceText,
    sceneDescription:'Milo warmly greets the explorers.',
    setting:'Moonberry Wood',
    characters:['Milo'],
    visualGuidance:{
      visualPrompt:'Warm Milo scene',charactersPresent:['Milo'],environment:'Moonberry Wood',moodLighting:'Warm amber',
      mustInclude:['Milo'],mustAvoid:['unsupported canon'],continuityRequirements:['preserve Milo identity'],
      canonReferences:['VISUAL_REFERENCE.md'],openCanonConstraints:['keep unresolved details open'],
    },
    voiceGuidance:{
      overallTone:'warm',pacingNote:'gentle',emotion:'welcoming',emphasisNotes:['clear greeting'],pauseGuidance:['brief pause'],
      dialogueCues:[{speaker:'Milo',text:'Hello',deliveryNote:'warmly'}],
    },
    motionGuidance:{
      motionPrompt:'Milo gives a gentle wave',characterActions:['wave'],environmentMotion:['leaves drift'],cameraGuidance:'slow push',
      transitionGuidance:'gentle cut',timingNote:'unhurried',continuityConstraints:['preserve approved action'],
    },
    assetRequirements:[{assetType:'VISUAL',role:'PRIMARY_SCENE_VISUAL',requirements:'Warm Moonberry Wood scene'}],
    productionNotes:['Keep the scene gentle'],
  };
}

function runBuild(output, scriptText = output.scenes.map(scene => scene.sourceText).join(' ')) {
  const action = {
    packageId:'MILO-007-S01-P01',packageVersion:1,generationMode:'INITIAL',supersedesPackageId:'',
    packageFormatVersion:'1.0',promptVersion:'m7-production-package-v1.0',promptPath,promptRef:PROMPT_REF,
    generatorProvider:'OpenAI',generatorModel:'gpt-5-mini',
    story:{storyId:'MILO-007',workingTitle:'Test Story',ageRange:'5-10',canonVersion:'canon-v1.0',canonRef:'977755913d9ad41e4f16392d01ea993507af4102'},
    script:{storyId:'MILO-007',scriptId:'MILO-007-S01',outlineId:'MILO-007-O01',conceptId:'MILO-007-C01',title:'Test Story',scriptText,wordCount:2,estimatedLengthMinutes:1,theme:'Kindness',lesson:'Help others',version:1},
    review:{reviewId:'MILO-007-S01-R01',version:1,assessmentResult:'PASS'},
  };
  const build = new Function('$json', '$', node('Build And Validate Complete Package').parameters.jsCode);
  return build({output}, name => {
    assert.equal(name, 'Resolve M7 Action');
    return {first:() => ({json:action})};
  })[0].json;
}

function validateHistory(rows, scriptId) {
  const h = [...rows].sort((a,b) => a.packageVersion - b.packageVersion);
  for (let i=0; i<h.length; i++) {
    const v = i + 1;
    if (h[i].packageVersion !== v) return false;
    if (h[i].packageId !== packageId(scriptId, v)) return false;
    if (i === 0 && h[i].supersedesPackageId) return false;
    if (i > 0 && h[i].supersedesPackageId !== h[i-1].packageId) return false;
  }
  return true;
}

function makeRichScene(pkg, n, words) {
  const sourceText = words.join(' ');
  return {
    packageId: pkg,
    packageVersion: 1,
    sceneId: sceneId(pkg,n),
    sceneNumber: n,
    storyId: 'MILO-001',
    scriptId: 'MILO-001-S01',
    sourceText,
    sceneDescription: 'A detailed production-facing scene description '.repeat(35),
    setting: 'Moonberry Wood',
    charactersJson: JSON.stringify(['Milo','Friend']),
    visualGuidanceJson: JSON.stringify({visualPrompt:'Warm detailed production image guidance '.repeat(90),charactersPresent:['Milo'],environment:'Cozy magical forest '.repeat(20),moodLighting:'Warm gentle light '.repeat(20),mustInclude:['canon'],mustAvoid:['unsupported canon'],continuityRequirements:['maintain identity'],canonReferences:['VISUAL_REFERENCE.md'],openCanonConstraints:['do not fix open style']}),
    voiceGuidanceJson: JSON.stringify({overallTone:'warm',pacingNote:'gentle',emotion:'curious',emphasisNotes:['clear'],pauseGuidance:['brief'],dialogueCues:[{speaker:'Milo',text:'Hello',deliveryNote:'warm'}]}),
    motionGuidanceJson: JSON.stringify({motionPrompt:'Gentle motion guidance '.repeat(70),characterActions:['walk'],environmentMotion:['flowers glow'],cameraGuidance:'slow follow',transitionGuidance:'gentle cut',timingNote:'unhurried',continuityConstraints:['preserve events']}),
    assetRequirementsJson: JSON.stringify([{assetId:assetId(pkg,n),sceneId:sceneId(pkg,n),assetType:'VISUAL',role:'PRIMARY_SCENE_VISUAL',status:'PLANNED',requirements:'scene image'}]),
    productionNotesJson: JSON.stringify({sceneNotes:['note'],packageNotes:['package note']}),
    canonVersion:'canon-v1.0',canonRef:'977755913d9ad41e4f16392d01ea993507af4102',createdAt:'2026-09-01T00:00:00.000Z'
  };
}

function makePersistedSceneRows(count = 8, pkg = 'MILO-007-S01-P01') {
  return Array.from({length:count}, (_, index) => ({
    packageId:pkg,
    packageVersion:1,
    sceneId:sceneId(pkg,index+1),
    sceneNumber:index+1,
    storyId:'MILO-007',
    scriptId:'MILO-007-S01',
    sourceText:`Scene ${index+1}.`,
    assetRequirementsJson:JSON.stringify([{assetId:assetId(pkg,index+1),sceneId:sceneId(pkg,index+1),assetType:'VISUAL',role:'SCENE_VISUAL',status:'PLANNED',requirements:`Scene ${index+1} visual`}]),
    productionNotesJson:JSON.stringify({sceneNotes:[],packageNotes:['Preserve approved Script text.']}),
    canonVersion:'canon-v1.0',
    canonRef:'977755913d9ad41e4f16392d01ea993507af4102',
    createdAt:'2026-09-01T12:27:33.562Z',
  }));
}

function simulatePersistedSceneRead(inputItems, persistedRows, executeOnce) {
  const invocations = executeOnce ? 1 : inputItems.length;
  return {
    invocations,
    outputItems:Array.from({length:invocations}, () => persistedRows).flat(),
  };
}

function runSceneVerification(persistedRows, packageResult, scriptText) {
  const verify = new Function('$input', '$', node('Verify Complete Scene Set').parameters.jsCode);
  return verify(
    {all:() => persistedRows.map(json => ({json:structuredClone(json)}))},
    name => {
      if (name === 'Build And Validate Complete Package') return {first:() => ({json:structuredClone(packageResult)})};
      if (name === 'Resolve M7 Action') return {first:() => ({json:{script:{scriptText}}})};
      throw new Error(`Unexpected scene-verification dependency: ${name}`);
    },
  )[0].json;
}

function makeHeaderRepairFixture() {
  const orphanScenes = makePersistedSceneRows();
  const scriptText = orphanScenes.map(row => row.sourceText).join(' ');
  const story = {
    storyId:'MILO-007',status:'CONTINUITY_APPROVED',workingTitle:'Milo repair fixture',ageRange:'5-10',
    canonVersion:'canon-v1.0',canonRef:'977755913d9ad41e4f16392d01ea993507af4102',
  };
  const script = {
    storyId:story.storyId,scriptId:'MILO-007-S01',outlineId:'MILO-007-O01',conceptId:'MILO-007-C01',title:'Milo repair fixture',
    approvalStatus:'APPROVED',approvalProcessedAt:'2026-09-01T10:00:00.000Z',scriptText,wordCount:16,estimatedLengthMinutes:1,
    theme:'Kindness',lesson:'Help others',version:1,canonVersion:story.canonVersion,canonRef:story.canonRef,
  };
  const review = {
    storyId:story.storyId,scriptId:script.scriptId,scriptVersion:1,reviewId:'MILO-007-S01-R01',version:1,
    reviewStatus:'APPROVED',reviewProcessedAt:'2026-09-01T11:00:00.000Z',assessmentResult:'PASS',
    canonVersion:story.canonVersion,canonRef:story.canonRef,
  };
  return {orphanScenes,scriptText,story,script,review};
}

function runResolveForHeaderRepair(fixture) {
  const resolve = new Function('$', '$input', node('Resolve M7 Action').parameters.jsCode);
  const rows = {
    'Normalize Generation Request':[{requestValid:true,generationMode:'INITIAL',storyId:''}],
    'Read Stories':[fixture.story],
    'Read Scripts':[fixture.script],
    'Read Continuity Reviews':[fixture.review],
    'Read Existing Production Packages':[],
  };
  return resolve(
    name => ({
      first:() => ({json:structuredClone(rows[name][0])}),
      all:() => rows[name].map(json => ({json:structuredClone(json)})),
    }),
    {all:() => fixture.orphanScenes.map(json => ({json:structuredClone(json)}))},
  )[0].json;
}

function runHeaderReconstruction(action) {
  const reconstruct = new Function('$', node('Reconstruct Header From Verified Scenes').parameters.jsCode);
  return reconstruct(name => {
    assert.equal(name, 'Resolve M7 Action');
    return {first:() => ({json:structuredClone(action)})};
  })[0].json;
}

function runHeaderVerification(persistedHeaders, action, repairResult) {
  const verify = new Function('$input', '$', node('Verify Complete Package').parameters.jsCode);
  return verify(
    {all:() => persistedHeaders.map(json => ({json:structuredClone(json)}))},
    name => {
      if (name === 'Resolve M7 Action') return {first:() => ({json:structuredClone(action)})};
      if (name === 'Reconstruct Header From Verified Scenes') return {first:() => ({json:structuredClone(repairResult)})};
      throw new Error(`Unexpected header-verification dependency: ${name}`);
    },
  )[0].json;
}

test('M7-001 workflow identity, inactive state and pin hygiene', () => {
  assert.equal(wf.name, 'Milo Production Package Generator v0.1');
  assert.equal(wf.active, false);
  assert.deepEqual(wf.pinData, {});
  assert(!JSON.stringify(wf).includes('TEST-INVALID'));
});

test('M7-002 graph references unique existing nodes', () => {
  const names = wf.nodes.map(n => n.name);
  const edgeCount = Object.values(wf.connections).flatMap(connection => Object.values(connection)).flat(2).length;
  assert.equal(wf.nodes.length, 47);
  assert.equal(edgeCount, 57);
  assert.equal(new Set(names).size, names.length);
  for (const [source, conn] of Object.entries(wf.connections)) {
    assert(names.includes(source), `missing source ${source}`);
    for (const branches of Object.values(conn)) for (const branch of branches) for (const t of branch) assert(names.includes(t.node), `missing target ${t.node}`);
  }
});

test('M7-003 shared Failure Handler and Error Workflow are preserved', () => {
  assert.equal(wf.settings.errorWorkflow, HANDLER_ID);
  assert.equal(node('Call Failure Handler').parameters.workflowId.value, HANDLER_ID);
  assert.deepEqual(targets('Prepare M7 Failure'), ['Call Failure Handler']);
  const prepareFailure = node('Prepare M7 Failure').parameters.jsCode;
  assert(prepareFailure.includes('executionId:$execution.id'));
  assert(!prepareFailure.includes('$exec.id'));
  const runPrepareFailure = new Function('$json', '$workflow', '$execution', '$', prepareFailure);
  const prepared = runPrepareFailure(
    { errorCode:'PRODUCTION_PACKAGE_INPUT_INVALID', message:'test rejection' },
    { name:wf.name, id:'live-workflow-id' },
    { id:'live-execution-id' },
    () => ({ first:() => ({ json:{ action:'FAIL', storyId:'MILO-007' } }) }),
  );
  assert.equal(prepared[0].json.executionId, 'live-execution-id');
  assert.equal(prepared[0].json.sourceType, 'HANDLED');
});

test('M7-004 approved two-tab storage targets exist in export', () => {
  const names = wf.nodes.filter(n=>n.type==='n8n-nodes-base.googleSheets').map(n=>n.parameters.sheetName?.value);
  assert(names.includes('Production Packages'));
  assert(names.includes('Production Package Scenes'));
  assert(names.includes('Stories'));
  const globalReads = ['Read Stories','Read Scripts','Read Continuity Reviews','Read Existing Production Packages','Read Existing Production Package Scenes'];
  for (const name of globalReads) assert.equal(node(name).executeOnce, true, `${name} must execute once per workflow run`);
  const tableRowCounts = { Stories:7, Scripts:2, Reviews:2, Packages:0, Scenes:0 };
  const runtimeCounts = {
    Stories:tableRowCounts.Stories,
    Scripts:node('Read Scripts').executeOnce ? tableRowCounts.Scripts : tableRowCounts.Stories * tableRowCounts.Scripts,
    Reviews:node('Read Continuity Reviews').executeOnce ? tableRowCounts.Reviews : tableRowCounts.Scripts * tableRowCounts.Reviews,
  };
  assert.deepEqual(runtimeCounts, { Stories:7, Scripts:2, Reviews:2 });
  const approvedScripts = [{storyId:'MILO-001',scriptId:'MILO-001-S01',approvalStatus:'APPROVED'},{storyId:'MILO-007',scriptId:'MILO-007-S01',approvalStatus:'APPROVED'}];
  assert.deepEqual(approvedScripts.filter(s=>s.storyId==='MILO-007'&&s.approvalStatus==='APPROVED').map(s=>s.scriptId), ['MILO-007-S01']);
});

test('M7-005 all Google Sheets append nodes prohibit automatic retry', () => {
  const appends = wf.nodes.filter(n=>n.type==='n8n-nodes-base.googleSheets'&&n.parameters.operation==='append');
  assert.equal(appends.length, 2);
  for (const n of appends) assert.notEqual(n.retryOnFail, true, `${n.name} retries append`);
});

test('M7-006 immutable prompt provenance and Story canonRef runtime reads', () => {
  assert.equal(node('Get M7 Prompt').parameters.additionalParameters.reference, PROMPT_REF);
  for (const name of ['Get Milo Canon Context','Get Visual Reference','Get Voice Guide','Get Continuity Rules']) {
    assert(String(node(name).parameters.additionalParameters.reference).includes('story.canonRef'));
  }
  assert(JSON.stringify(wf).includes(`promptRef:'${PROMPT_REF}'`));
});

test('M7-007 generator provider/model and two-attempt AI policy', () => {
  assert.equal(node('OpenAI Production Model').parameters.model.value, 'gpt-5-mini');
  assert.equal(node('Generate Production Package').retryOnFail, true);
  assert.equal(node('Generate Production Package').maxTries, 2);
  assert(JSON.stringify(wf).includes("generatorProvider:'OpenAI'"));
});

test('M7-008 schema and prompt preserve AI/deterministic boundary', () => {
  assert(schema.required.includes('scenes'));
  assert.equal(schema.properties.scenes.minItems, 1);
  assert.deepEqual(Object.keys(schema.properties).sort(), ['productionNotes','scenes']);
  assert(prompt.includes('preserve the approved Script exactly'));
  for (const forbidden of ['package IDs','package versions','canonVersion/canonRef','publishing schedules']) assert(prompt.includes(forbidden));
});

test('M7-009 happy-path identifiers are deterministic', () => {
  assert.equal(packageId('MILO-001-S01',1), 'MILO-001-S01-P01');
  assert.equal(sceneId('MILO-001-S01-P01',3), 'MILO-001-S01-P01-SC03');
  assert.equal(assetId('MILO-001-S01-P01',12), 'MILO-001-S01-P01-A012');
});

test('M7-010 invalid state/input and PRE-CANON LEGACY are rejected before generation', () => {
  const code = node('Resolve M7 Action').parameters.jsCode;
  assert(code.includes('STORY_NOT_READY_FOR_PRODUCTION_PACKAGE'));
  assert(code.includes('PRODUCTION_PACKAGE_INPUT_INVALID'));
  assert(code.includes('CANON_LINEAGE_INVALID'));
  assert(code.includes("story.status==='CONTINUITY_APPROVED'"));
});

test('M7-011 downstream/Story canon mismatch is deterministic', () => {
  const code = node('Resolve M7 Action').parameters.jsCode;
  assert(code.includes('CANON_LINEAGE_MISMATCH'));
  assert(code.includes('script.canonRef'));
  assert(code.includes('review.canonRef'));
});

test('M7-012 exact Script coverage is enforced', () => {
  const script='One  two\nthree.';
  const good=['One two','three.'];
  const bad=['One two','different.'];
  assert.equal(normalize(good.join(' ')), normalize(script));
  assert.notEqual(normalize(bad.join(' ')), normalize(script));
  assert(node('Build And Validate Complete Package').parameters.jsCode.includes('exact Script coverage'));
});

test('M7-013 scene numbering and IDs are contiguous', () => {
  const pkg='MILO-001-S01-P02';
  assert.deepEqual([1,2,3].map(n=>sceneId(pkg,n)), [`${pkg}-SC01`,`${pkg}-SC02`,`${pkg}-SC03`]);
  assert(node('Build And Validate Complete Package').parameters.jsCode.includes('sceneNumber:i+1'));
});

test('M7-014 package history requires contiguous versions and supersession', () => {
  const good=[{packageVersion:1,packageId:'MILO-001-S01-P01',supersedesPackageId:''},{packageVersion:2,packageId:'MILO-001-S01-P02',supersedesPackageId:'MILO-001-S01-P01'}];
  const gap=[good[0],{packageVersion:3,packageId:'MILO-001-S01-P03',supersedesPackageId:'MILO-001-S01-P01'}];
  assert(validateHistory(good,'MILO-001-S01'));
  assert(!validateHistory(gap,'MILO-001-S01'));
});

test('M7-015 normal duplicate cannot masquerade as regeneration', () => {
  const code=node('Resolve M7 Action').parameters.jsCode;
  assert(code.includes("req.generationMode==='INITIAL'&&same"));
  assert(code.includes('PRODUCTION_PACKAGE_ALREADY_EXISTS'));
  assert(code.includes("req.generationMode==='CONTROLLED_REGENERATION'"));
  assert(code.includes('PRODUCTION_PACKAGE_REGENERATION_INVALID'));
});

test('M7-016 controlled regeneration and upstream revision carry generation provenance', () => {
  const code=node('Resolve M7 Action').parameters.jsCode;
  for (const v of ['CONTROLLED_REGENERATION','UPSTREAM_REVISION','supersedesPackageId','packageFormatVersion','promptVersion','promptRef','generatorProvider','generatorModel']) assert(code.includes(v));
});

test('M7-017 package format version is explicit and distinct from package version', () => {
  assert(spec.includes('`packageFormatVersion` is `1.0`'));
  assert(spec.includes('separate from `packageVersion`'));
  assert(JSON.stringify(wf).includes("packageFormatVersion:'1.0'"));
});

test('M7-018 partial-write repair routes exist and avoid fresh AI for repair', () => {
  assert(node('Validate Status Repair'));
  assert(node('Reconstruct Header From Verified Scenes'));
  assert.deepEqual(targets('Status Repair Is Valid',0), ['Mark Story Production Package Generated']);
  assert.deepEqual(targets('Header Repair Is Valid',0), ['Prepare Repaired Header']);
  assert(!targets('Header Repair Is Valid',0).includes('Generate Production Package'));
});

test('M7-019 save/verify order gates each irreversible step', () => {
  assert.deepEqual(targets('Generated Package Is Valid',0), ['Expand Scene Rows']);
  assert.deepEqual(targets('Generated Package Is Valid',1), ['Prepare M7 Failure']);
  assert.deepEqual(targets('Scene Set Is Verified',0), ['Prepare Package Header']);
  assert.deepEqual(targets('Scene Set Is Verified',1), ['Prepare M7 Failure']);
  assert.deepEqual(targets('Complete Package Is Verified',0), ['Mark Story Production Package Generated']);
  assert.deepEqual(targets('Complete Package Is Verified',1), ['Prepare M7 Failure']);
});

test('M7-020 lifecycle isolation keeps failure routes away from Story mutation', () => {
  const incoming=[];
  for (const [s,c] of Object.entries(wf.connections)) for (const branches of Object.values(c)) for (const branch of branches) for (const t of branch) if(t.node==='Mark Story Production Package Generated') incoming.push(s);
  assert.deepEqual(new Set(incoming), new Set(['Complete Package Is Verified','Status Repair Is Valid']));
  assert(!targets('Prepare M7 Failure').includes('Mark Story Production Package Generated'));
});

test('M7-021 operational error codes are registered', () => {
  for (const code of ['STORY_NOT_READY_FOR_PRODUCTION_PACKAGE','PRODUCTION_PACKAGE_INPUT_INVALID','PRODUCTION_PACKAGE_ALREADY_EXISTS','PRODUCTION_PACKAGE_REGENERATION_INVALID','PRODUCTION_PACKAGE_GENERATION_FAILED','PRODUCTION_PACKAGE_AI_OUTPUT_INVALID','PRODUCTION_PACKAGE_SCENE_SAVE_FAILED','PRODUCTION_PACKAGE_SCENE_VERIFY_FAILED','PRODUCTION_PACKAGE_SAVE_FAILED','PRODUCTION_PACKAGE_VERIFY_FAILED','PRODUCTION_PACKAGE_REPAIR_REQUIRED','STORY_PRODUCTION_PACKAGE_STATUS_UPDATE_FAILED']) assert(errors.includes(code), code);
});

test('M7-022 lifecycle model adds only the approved M7 state', () => {
  assert(status.includes('PRODUCTION_PACKAGE_GENERATED'));
  assert(status.includes('CONTINUITY_APPROVED -> PRODUCTION_PACKAGE_GENERATED'));
  assert(status.includes('M8 states are not added'));
});

test('M7-023 D-013 is recorded with immutable blueprint and separate realised provenance principle', () => {
  assert(decisions.includes('D-013'));
  assert(decisions.includes('immutable, append-versioned production blueprints'));
  assert(decisions.includes('realised media and its provenance must be stored separately'));
});

test('M7-024 export has no live identity, pins, mocks or activation', () => {
  assert.equal(wf.active,false);
  assert.equal(wf.id,undefined);
  assert.equal(wf.versionId,undefined);
  assert.deepEqual(wf.pinData,{});
  assert(!JSON.stringify(wf).includes('TEST-INVALID'));
});

test('M7-025 single-cell scenesJson design is absent', () => {
  assert(!spec.includes('`scenesJson`'));
  assert(!JSON.stringify(wf).includes('scenesJson'));
  assert(spec.includes('Production Package Scenes'));
});

test('M7-026 planned assets are separate from realised provenance', () => {
  const build=node('Build And Validate Complete Package').parameters.jsCode;
  assert(build.includes("status:'PLANNED'"));
  assert(!build.includes('externalUrl'));
  assert(!build.includes('externalAssetId'));
  assert(spec.includes('does not store realised fields'));
});

test('M7-027 realistic child-row JSON fields stay below the 50k design boundary', () => {
  const words=Array.from({length:900},(_,i)=>`word${i}`);
  const chunks=Array.from({length:14},(_,i)=>words.slice(i*64, i===13?900:(i+1)*64));
  const rows=chunks.map((w,i)=>makeRichScene('MILO-001-S01-P01',i+1,w));
  for(const row of rows) for(const key of ['sourceText','charactersJson','visualGuidanceJson','voiceGuidanceJson','motionGuidanceJson','assetRequirementsJson','productionNotesJson']) assert(String(row[key]).length < 50000, `${key} exceeds boundary`);
});

test('M7-028 runtime parser schema exactly matches the authoritative schema', () => {
  const runtimeSchema = JSON.parse(node('Production Package Output Parser').parameters.inputSchema);
  assert.deepEqual(runtimeSchema, schema);
});

test('M7-029 required nested guidance arrays reject string values', () => {
  const paths = [
    ['visualGuidance','continuityRequirements'],
    ['visualGuidance','openCanonConstraints'],
    ['voiceGuidance','emphasisNotes'],
    ['voiceGuidance','pauseGuidance'],
    ['motionGuidance','continuityConstraints'],
  ];
  for (const [group, field] of paths) {
    const output = {scenes:[makeValidAiScene()],productionNotes:[]};
    output.scenes[0][group][field] = 'incorrect string value';
    assert(schemaErrors(output, schema).some(error => error.includes(`${group}.${field}: expected array`)), `${group}.${field} accepted a string`);
  }
});

test('M7-030 valid nested guidance arrays pass the authoritative schema', () => {
  const output = {scenes:[makeValidAiScene()],productionNotes:[]};
  assert.deepEqual(schemaErrors(output, schema), []);
});

test('M7-031 dialogue cue without speaker is rejected', () => {
  const output = {scenes:[makeValidAiScene()],productionNotes:[]};
  delete output.scenes[0].voiceGuidance.dialogueCues[0].speaker;
  assert(schemaErrors(output, schema).some(error => error.includes('speaker: required property missing')));
});

test('M7-032 dialogue cue without deliveryNote is rejected', () => {
  const output = {scenes:[makeValidAiScene()],productionNotes:[]};
  delete output.scenes[0].voiceGuidance.dialogueCues[0].deliveryNote;
  assert(schemaErrors(output, schema).some(error => error.includes('deliveryNote: required property missing')));
});

test('M7-033 dialogue cue text must be an exact sourceText substring', () => {
  const invalid = {scenes:[makeValidAiScene('Hello explorers.')],productionNotes:[]};
  invalid.scenes[0].voiceGuidance.dialogueCues[0].text = 'hello';
  assert.deepEqual(schemaErrors(invalid, schema), []);
  assert.equal(runBuild(invalid).packageValid, false);
  const valid = {scenes:[makeValidAiScene('Hello explorers.')],productionNotes:[]};
  assert.equal(runBuild(valid).packageValid, true);
});

test('M7-034 exact normalized Script coverage requires complete ordered scenes', () => {
  const first = makeValidAiScene('Hello explorers.');
  const second = makeValidAiScene('Welcome home.');
  first.voiceGuidance.dialogueCues[0].text = 'Hello';
  second.voiceGuidance.dialogueCues[0].text = 'Welcome';
  const output = {scenes:[first,second],productionNotes:[]};
  assert.equal(runBuild(output, 'Hello explorers. Welcome home.').packageValid, true);
  assert.equal(runBuild(output, 'Welcome home. Hello explorers.').packageValid, false);
  assert.equal(runBuild({scenes:[first],productionNotes:[]}, 'Hello explorers. Welcome home.').packageValid, false);
});

test('M7-035 invalid nested output routes to the handled failure path before writes', () => {
  const output = {scenes:[makeValidAiScene()],productionNotes:[]};
  output.scenes[0].visualGuidance.continuityRequirements = 'invalid';
  const result = runBuild(output);
  assert.equal(result.packageValid, false);
  assert.equal(result.errorCode, 'PRODUCTION_PACKAGE_AI_OUTPUT_INVALID');
  assert.deepEqual(targets('Generated Package Is Valid',1), ['Prepare M7 Failure']);
  assert.deepEqual(targets('Prepare M7 Failure'), ['Call Failure Handler']);
  for (const writeNode of ['Append Production Package Scenes','Append Production Package Header','Mark Story Production Package Generated']) {
    assert(!targets('Prepare M7 Failure').includes(writeNode));
  }
});

test('M7-036 valid output can enter the existing persistence path', () => {
  const output = {scenes:[makeValidAiScene()],productionNotes:['Package note']};
  const result = runBuild(output);
  assert.equal(result.packageValid, true);
  assert.equal(result.sceneRows.length, 1);
  assert.deepEqual(targets('Generated Package Is Valid',0), ['Expand Scene Rows']);
  assert.deepEqual(targets('Expand Scene Rows'), ['Append Production Package Scenes']);
});

test('M7-037 asset manifest and generation provenance remain populated', () => {
  const output = {scenes:[makeValidAiScene()],productionNotes:[]};
  const result = runBuild(output);
  const manifest = JSON.parse(result.header.assetManifestJson);
  assert.equal(manifest.length, 1);
  assert.equal(manifest[0].status, 'PLANNED');
  assert.equal(result.header.promptRef, PROMPT_REF);
  assert.equal(result.header.generatorProvider, 'OpenAI');
  assert.equal(result.header.generatorModel, 'gpt-5-mini');
});

test('M7-038 prompt explicitly preserves nested array and dialogue substring contracts', () => {
  for (const field of ['continuityRequirements','openCanonConstraints','emphasisNotes','pauseGuidance','continuityConstraints']) {
    assert(prompt.includes(field));
  }
  assert(prompt.includes('must be JSON arrays'));
  assert(prompt.includes('must contain all three required string fields'));
  assert(prompt.includes("exact substring of that same scene's `sourceText`"));
  assert(prompt.includes('preserving its punctuation and casing exactly'));
});

test('M7-039 eight appended scene items trigger one persisted-scene read', () => {
  const appended = makePersistedSceneRows();
  assert.equal(node('Read Persisted Scene Set').executeOnce, true);
  assert.equal(simulatePersistedSceneRead(appended, appended, node('Read Persisted Scene Set').executeOnce).invocations, 1);
});

test('M7-040 one persisted-scene read returns exactly eight scenes', () => {
  const appended = makePersistedSceneRows();
  const readback = simulatePersistedSceneRead(appended, appended, node('Read Persisted Scene Set').executeOnce);
  assert.equal(readback.outputItems.length, 8);
  assert.deepEqual(readback.outputItems.map(row => row.sceneId), appended.map(row => row.sceneId));
});

test('M7-041 complete scene verifier receives and accepts exactly eight scenes', () => {
  const rows = makePersistedSceneRows();
  const packageResult = {packageValid:true,packageId:'MILO-007-S01-P01',sceneRows:rows,header:{storyId:'MILO-007'}};
  const result = runSceneVerification(rows, packageResult, rows.map(row => row.sourceText).join(' '));
  assert.equal(rows.length, 8);
  assert.equal(result.sceneSetVerified, true);
});

test('M7-042 duplicate or missing persisted scenes still fail verification', () => {
  const rows = makePersistedSceneRows();
  const packageResult = {packageValid:true,packageId:'MILO-007-S01-P01',sceneRows:rows,header:{storyId:'MILO-007'}};
  const scriptText = rows.map(row => row.sourceText).join(' ');
  assert.equal(runSceneVerification(rows.slice(0,7), packageResult, scriptText).sceneSetVerified, false);
  assert.equal(runSceneVerification([...rows.slice(0,7), structuredClone(rows[6])], packageResult, scriptText).sceneSetVerified, false);
});

test('M7-043 package header remains gated behind successful scene verification', () => {
  assert.deepEqual(targets('Scene Set Is Verified',0), ['Prepare Package Header']);
  assert.deepEqual(targets('Scene Set Is Verified',1), ['Prepare M7 Failure']);
  assert.deepEqual(incomingSources(wf, 'Append Production Package Header').map(x => x.source).sort(), ['Prepare Package Header','Prepare Repaired Header']);
});

test('M7-044 current eight-scene orphan state resolves to HEADER_REPAIR', () => {
  const fixture = makeHeaderRepairFixture();
  const action = runResolveForHeaderRepair(fixture);
  assert.equal(action.action, 'HEADER_REPAIR');
  assert.equal(action.packageId, 'MILO-007-S01-P01');
  assert.equal(action.packageVersion, 1);
  assert.equal(action.generationMode, 'INITIAL');
  assert.equal(action.orphanScenes.length, 8);
});

test('M7-045 HEADER_REPAIR never re-appends existing scene rows', () => {
  assert.deepEqual(targets('Route M7 Action',2), ['Reconstruct Header From Verified Scenes']);
  assert.deepEqual(targets('Reconstruct Header From Verified Scenes'), ['Header Repair Is Valid']);
  assert.deepEqual(targets('Header Repair Is Valid',0), ['Prepare Repaired Header']);
  assert.deepEqual(targets('Prepare Repaired Header'), ['Append Production Package Header']);
  for (const source of ['Route M7 Action','Reconstruct Header From Verified Scenes','Header Repair Is Valid','Prepare Repaired Header']) {
    assert(!targets(source).includes('Append Production Package Scenes'));
  }
});

test('M7-046 successful header repair creates one header then advances lifecycle', () => {
  const fixture = makeHeaderRepairFixture();
  const action = runResolveForHeaderRepair(fixture);
  const repair = runHeaderReconstruction(action);
  assert.equal(repair.repairValid, true);
  assert.equal(repair.header.sceneCount, 8);
  const prepare = new Function('$json', node('Prepare Repaired Header').parameters.jsCode);
  const appendedHeaders = prepare(repair).map(item => item.json);
  assert.equal(appendedHeaders.length, 1);
  const verified = runHeaderVerification(appendedHeaders, action, repair);
  assert.equal(verified.packageVerified, true);
  assert.equal(verified.storyId, 'MILO-007');
  assert.deepEqual(targets('Complete Package Is Verified',0), ['Mark Story Production Package Generated']);
  assert.equal(node('Mark Story Production Package Generated').parameters.columns.value.status, 'PRODUCTION_PACKAGE_GENERATED');
});

test('M7-047 recovery preserves the no-append-retry policy', () => {
  for (const name of ['Append Production Package Scenes','Append Production Package Header']) assert.notEqual(node(name).retryOnFail, true);
  assert(!targets('Prepare M7 Failure').includes('Append Production Package Scenes'));
  assert(!targets('Prepare M7 Failure').includes('Append Production Package Header'));
});

let passed=0;
for (const [name,fn] of tests) {
  try { fn(); console.log(`PASS ${name}`); passed++; }
  catch (error) { console.error(`FAIL ${name}: ${error.message}`); }
}
console.log(`M7 offline validation: ${passed}/${tests.length} passed.`);
if (passed !== tests.length) process.exit(1);
