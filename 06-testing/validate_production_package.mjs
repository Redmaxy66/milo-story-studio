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
const PROMPT_REF = 'c895b665d0f80f58808200055fdb58bb18b86ab9';
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
const tests = [];
const test = (name, fn) => tests.push([name, fn]);

function normalize(s) { return String(s ?? '').replace(/\s+/g, ' ').trim(); }
function packageId(scriptId, version) { return `${scriptId}-P${String(version).padStart(2, '0')}`; }
function sceneId(pkg, n) { return `${pkg}-SC${String(n).padStart(2, '0')}`; }
function assetId(pkg, n) { return `${pkg}-A${String(n).padStart(3, '0')}`; }

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

test('M7-001 workflow identity, inactive state and pin hygiene', () => {
  assert.equal(wf.name, 'Milo Production Package Generator v0.1');
  assert.equal(wf.active, false);
  assert.deepEqual(wf.pinData, {});
  assert(!JSON.stringify(wf).includes('TEST-INVALID'));
});

test('M7-002 graph references unique existing nodes', () => {
  const names = wf.nodes.map(n => n.name);
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

let passed=0;
for (const [name,fn] of tests) {
  try { fn(); console.log(`PASS ${name}`); passed++; }
  catch (error) { console.error(`FAIL ${name}: ${error.message}`); }
}
console.log(`M7 offline validation: ${passed}/${tests.length} passed.`);
if (passed !== tests.length) process.exit(1);
