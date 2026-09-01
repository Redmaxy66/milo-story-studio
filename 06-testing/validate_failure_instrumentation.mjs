#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowFiles = [
  '04-n8n-workflows/development/Milo Concept Approval v0.1.json',
  '04-n8n-workflows/development/Milo Concept Generator v0.1.json',
  '04-n8n-workflows/development/Milo Continuity Approval v0.1.json',
  '04-n8n-workflows/development/Milo Continuity Reviewer v0.1.json',
  '04-n8n-workflows/development/Milo Outline Approval v0.1.json',
  '04-n8n-workflows/development/Milo Outline Generator v0.1.json',
  '04-n8n-workflows/development/Milo Script Approval v0.1.json',
  '04-n8n-workflows/development/Milo Script Generator v0.1.json',
  '04-n8n-workflows/tested/Milo Story Intake v0.1.json',
];
const handlerFile = '04-n8n-workflows/development/Milo Failure Handler v0.1.json';
const expectedColumns = [
  'failureId','occurredAt','workflowName','workflowId','executionId','sourceType','storyId','conceptId','outlineId','scriptId','reviewId','errorCode','message','nodeName','nodeType','attempt','rawError','status',
];
const preInstrumentationCodes = [
  'APPROVAL_VALIDATION_FAILED','APPROVED_CONCEPT_COUNT_INVALID','APPROVED_OUTLINE_COUNT_INVALID','APPROVED_OUTLINE_INVALID','APPROVED_OUTLINE_VALIDATION_FAILED','APPROVED_SCRIPT_INVALID','CONCEPTS_ALREADY_EXIST','CONCEPT_STORY_ID_MISMATCH','CONCEPT_VALIDATION_FAILED','CONTINUITY_AI_OUTPUT_INVALID','CONTINUITY_APPROVAL_INVALID','CONTINUITY_REVIEW_ALREADY_EXISTS','CONTINUITY_REVIEW_PROCESSING_FAILED','CONTINUITY_REVIEW_SAVE_FAILED','DUPLICATE_OUTLINE','OUTLINE_APPROVAL_STAMP_FAILED','OUTLINE_GENERATION_FAILED','OUTLINE_SAVE_FAILED','OUTLINE_VALIDATION_FAILED','SCRIPT_ALREADY_EXISTS','SCRIPT_NOT_READY_FOR_CONTINUITY_REVIEW','SCRIPT_SAVE_FAILED','SCRIPT_VALIDATION_FAILED','STORY_CONTINUITY_APPROVED_UPDATE_FAILED','STORY_CONTINUITY_STATUS_UPDATE_FAILED','STORY_ID_MISSING','STORY_NOT_READY_FOR_CONCEPT_APPROVAL','STORY_NOT_READY_FOR_CONTINUITY_APPROVAL','STORY_NOT_READY_FOR_OUTLINE_APPROVAL','STORY_NOT_READY_FOR_SCRIPT_APPROVAL','STORY_NOT_READY_FOR_SCRIPT_GENERATION','STORY_OUTLINE_APPROVAL_UPDATE_FAILED','STORY_OUTLINE_STATUS_UPDATE_FAILED','STORY_SCRIPT_REVISION_UPDATE_FAILED','STORY_SCRIPT_STATUS_UPDATE_FAILED',
];

function assert(condition, message) { if (!condition) throw new Error(message); }
function readJson(relativePath) { return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')); }
function validateConnections(workflow) {
  const names = new Set(workflow.nodes.map((node) => node.name));
  assert(names.size === workflow.nodes.length, `${workflow.name}: duplicate node names`);
  for (const [source, connection] of Object.entries(workflow.connections ?? {})) {
    assert(names.has(source), `${workflow.name}: connection source does not exist: ${source}`);
    for (const branches of Object.values(connection)) for (const branch of branches) for (const target of branch) assert(names.has(target.node), `${workflow.name}: connection target does not exist: ${target.node}`);
  }
}
function connectionCount(workflow) { let count=0; for (const connection of Object.values(workflow.connections ?? {})) for (const branches of Object.values(connection)) for (const branch of branches) count += branch.length; return count; }
function targetNames(workflow, source, output=0, type='main') { return (workflow.connections[source]?.[type]?.[output] ?? []).map((target) => target.node); }
function incomingSources(workflow, targetName) {
  const sources=[];
  for (const [source, connection] of Object.entries(workflow.connections ?? {})) for (const [type, branches] of Object.entries(connection)) branches.forEach((branch, output) => { for (const target of branch) if (target.node === targetName) sources.push({source,type,output}); });
  return sources;
}
function singleTarget(workflow, source, output=0, type='main') { const targets=targetNames(workflow,source,output,type); assert(targets.length===1, `${workflow.name}: expected one ${source} output ${output} target, found ${targets.length}`); return targets[0]; }
function singleEqualsValue(node) { const conditions=node?.parameters?.conditions?.conditions ?? []; assert(conditions.length===1, `${node?.name ?? 'unknown node'}: expected one condition`); assert(conditions[0].operator?.operation==='equals', `${node.name}: expected equals condition`); return conditions[0].rightValue; }
function singleCondition(node) { const conditions=node?.parameters?.conditions?.conditions ?? []; assert(conditions.length===1, `${node?.name ?? 'unknown node'}: expected one condition`); return conditions[0]; }
function n8nStringToBoolean(value) { const normalized=String(value).toLowerCase(); return !['0','false','no'].includes(normalized); }
function evaluateExplicitBooleanExpression(expression, json) {
  const prefix='={{ String('; const suffix=').trim().toLowerCase().toBoolean() }}';
  assert(expression.startsWith(prefix),'Boolean expression must explicitly convert with String(...)');
  assert(expression.endsWith(suffix),'Boolean expression must trim and use n8n toBoolean() with no literal suffix');
  const predicate=expression.slice(prefix.length,-suffix.length);
  const rawResult=new Function('$json',`return (${predicate});`)(structuredClone(json));
  assert(typeof rawResult==='boolean','Wrapped validation predicate must produce a genuine Boolean');
  return n8nStringToBoolean(String(rawResult).trim().toLowerCase());
}
function collectCodes(workflow) {
  const codes=new Set();
  for (const node of workflow.nodes) {
    for (const assignment of node.parameters?.assignments?.assignments ?? []) {
      if (assignment.name !== 'errorCode') continue;
      for (const match of String(assignment.value).matchAll(/([A-Z][A-Z0-9_]{2,})/g)) if (match[1].includes('_')) codes.add(match[1]);
    }
    for (const match of String(node.parameters?.jsCode ?? '').matchAll(/errorCode\s*[:=]\s*['"`]([A-Z][A-Z0-9_]+)['"`]/g)) codes.add(match[1]);
  }
  return codes;
}

const workflows=workflowFiles.map(readJson);
const handler=readJson(handlerFile);
const allWorkflows=[...workflows,handler];
for (const workflow of allWorkflows) validateConnections(workflow);

const localFailures=workflows.flatMap((workflow) => workflow.nodes.filter((node) => /^Prepare .*Failure$/.test(node.name)).map((node) => ({workflow,node})));
assert(localFailures.length === 43, `Expected 43 local failure nodes, found ${localFailures.length}`);

const metadataFields=['workflowName','workflowId','executionId','sourceType','nodeName','nodeType'];
for (const {workflow,node} of localFailures) {
  assert(node.type==='n8n-nodes-base.set', `${workflow.name} / ${node.name}: expected Set node`);
  const assignments=node.parameters.assignments.assignments;
  for (const field of metadataFields) assert(assignments.some((assignment) => assignment.name===field), `${workflow.name} / ${node.name}: missing ${field}`);
  assert(assignments.find((assignment) => assignment.name==='executionId').value==='={{ $exec.id }}', `${workflow.name} / ${node.name}: wrong executionId expression`);
  assert(assignments.some((assignment) => assignment.name==='errorCode'), `${workflow.name} / ${node.name}: missing errorCode`);
  const targets=workflow.connections[node.name]?.main?.[0] ?? [];
  assert(targets.length===1 && targets[0].node==='Call Failure Handler', `${workflow.name} / ${node.name}: not durably routed`);
  assert(incomingSources(workflow,node.name).length>0, `${workflow.name} / ${node.name}: orphaned failure node`);
}

for (const workflow of workflows) {
  const calls=workflow.nodes.filter((node) => node.name==='Call Failure Handler');
  assert(calls.length===1, `${workflow.name}: expected one handler call node`);
  assert(calls[0].type==='n8n-nodes-base.executeWorkflow', `${workflow.name}: wrong handler call node type`);
  assert(['','3an2myLOF7o4STK8'].includes(calls[0].parameters.workflowId.value), `${workflow.name}: wrong handler ID`);
  assert(calls[0].parameters.workflowId.cachedResultName.endsWith('Milo Failure Handler v0.1'), `${workflow.name}: wrong handler target name`);
}

const outlineApproval=workflows.find((workflow) => workflow.name==='Milo Outline Approval v0.1');
assert(outlineApproval.nodes.length===16, `Outline Approval: expected 16 nodes, found ${outlineApproval.nodes.length}`);
assert(connectionCount(outlineApproval)===20, `Outline Approval: expected 20 connections, found ${connectionCount(outlineApproval)}`);

const conceptGenerator=workflows.find((workflow) => workflow.name==='Milo Concept Generator v0.1');
const conceptBatchGate=conceptGenerator.nodes.find((node) => node.name==='Concept Batch Is Valid');
const conceptValidationFailure=conceptGenerator.nodes.find((node) => node.name==='Prepare Concept Validation Failure');
const conceptDuplicateGate=conceptGenerator.nodes.find((node) => node.name==='Concepts Do Not Exist');
const conceptValidationAssignments=conceptValidationFailure?.parameters?.assignments?.assignments ?? [];
assert(conceptGenerator.nodes.length===42, `Concept Generator: expected 42 nodes, found ${conceptGenerator.nodes.length}`);
assert(connectionCount(conceptGenerator)===52, `Concept Generator: expected 52 connections, found ${connectionCount(conceptGenerator)}`);
assert(conceptBatchGate?.type==='n8n-nodes-base.if','Concept Generator: batch validation gate must remain an IF node');
assert(singleTarget(conceptGenerator,conceptBatchGate.name,0)==='Unpack Valid Concept Batch','Concept Generator: valid batch happy path changed');
assert(singleTarget(conceptGenerator,conceptBatchGate.name,1)===conceptValidationFailure.name,'Concept Generator: invalid batch must prepare its validation failure');
assert(singleTarget(conceptGenerator,conceptValidationFailure.name,0)==='Call Failure Handler','Concept Generator: validation failure must reach Call Failure Handler');
assert(conceptValidationAssignments.some((assignment) => assignment.name==='errorCode' && assignment.value==='CONCEPT_VALIDATION_FAILED'),'Concept Generator: invalid-batch errorCode changed');
assert(singleTarget(conceptGenerator,conceptDuplicateGate.name,0)==='Restore Concept Input','Concept Generator: duplicate-protection happy path changed');
assert(singleTarget(conceptGenerator,conceptDuplicateGate.name,1)==='Prepare Concepts Already Exist Failure','Concept Generator: duplicate-protection failure path changed');
assert(singleTarget(conceptGenerator,'Prepare Concepts Already Exist Failure',0)==='Call Failure Handler','Concept Generator: duplicate failure must reach Call Failure Handler');
assert(singleTarget(conceptGenerator,'Read Eligible Story Ideas',0)==='Check Existing Concepts Before Canon','Concept Generator: pre-canon duplicate guard missing');
assert(singleTarget(conceptGenerator,'No Existing Concepts Before Canon',0)==='Restore Eligible Story','Concept Generator: pre-canon duplicate happy path changed');
assert(singleTarget(conceptGenerator,'No Existing Concepts Before Canon',1)==='Prepare Concepts Already Exist Failure','Concept Generator: pre-canon duplicate failure route changed');

const validateAllConcepts=conceptGenerator.nodes.find((node) => node.name==='Validate All Concept Options');
assert(validateAllConcepts?.type==='n8n-nodes-base.code','Concept Generator: deterministic batch validator is missing');
const runConceptValidator=new Function('$input',validateAllConcepts.parameters.jsCode);
const invalidConceptBatch=runConceptValidator({all:()=>[{json:{storyId:'TEST-INVALID'}}]});
assert(invalidConceptBatch[0]?.json?.conceptBatchValid===false,'Concept Generator: invalid batch did not produce false');

for (const workflow of workflows) for (const node of workflow.nodes.filter((candidate)=>candidate.type==='n8n-nodes-base.if')) for (const condition of node.parameters?.conditions?.conditions ?? []) {
  if (condition.operator?.type!=='boolean') continue;
  const expression=String(condition.leftValue ?? '').trimEnd();
  if (!expression.startsWith('={{')) continue;
  assert(expression.slice(expression.lastIndexOf('}}')+2)==='', `${workflow.name} / ${node.name}: Boolean IF expression has a literal suffix`);
}

const outlineReady=outlineApproval.nodes.find((node)=>node.name==='Story Is Ready for Outline Approval');
const outlineAlreadyApproved=outlineApproval.nodes.find((node)=>node.name==='Story Already Outline Approved');
const markStoryOutlineApproved=outlineApproval.nodes.find((node)=>node.name==='Mark Story Outline Approved');
const approvedOutlineIsValid=outlineApproval.nodes.find((node)=>node.name==='Approved Outline Is Valid');
const markStoryValues=markStoryOutlineApproved?.parameters?.columns?.value ?? {};
assert(outlineReady?.type==='n8n-nodes-base.if','Outline Approval: ready-state node must remain an IF node');
assert(outlineAlreadyApproved?.type==='n8n-nodes-base.if','Outline Approval: missing already-approved recovery IF node');
assert(singleEqualsValue(outlineReady)==='OUTLINE_GENERATED','Outline Approval: happy-path state was weakened');
assert(singleEqualsValue(outlineAlreadyApproved)==='OUTLINE_APPROVED','Outline Approval: recovery state must be OUTLINE_APPROVED only');
assert(markStoryOutlineApproved?.parameters?.operation==='update','Outline Approval: Story happy path must remain an update');
assert(markStoryValues.status==='OUTLINE_APPROVED','Outline Approval: Story happy path must set OUTLINE_APPROVED');
assert(Object.keys(markStoryValues).sort().join(',')==='createdAt,status,storyId,updatedAt','Outline Approval: Story update fields changed or include an unrelated lifecycle mutation');
assert(singleTarget(outlineApproval,outlineReady.name,0)==='Mark Story Outline Approved','Outline Approval: happy path must update Story status');
assert(singleTarget(outlineApproval,outlineReady.name,1)===outlineAlreadyApproved.name,'Outline Approval: non-ready Story must enter recovery check');
assert(singleTarget(outlineApproval,outlineAlreadyApproved.name,0)==='Stamp Outline Approval Processed','Outline Approval: repair path must skip Story rewrite and stamp the Outline');
assert(singleTarget(outlineApproval,outlineAlreadyApproved.name,1)==='Prepare Story Not Ready Failure','Outline Approval: unrelated Story states must fail');
assert(singleTarget(outlineApproval,'Mark Story Outline Approved',0)==='Stamp Outline Approval Processed','Outline Approval: happy path must stamp after Story update');
assert(singleTarget(outlineApproval,'Mark Story Outline Approved',1)==='Prepare Story Outline Approval Update Failure','Outline Approval: Story update failure route was lost');
assert(singleTarget(outlineApproval,'Stamp Outline Approval Processed',1)==='Prepare Outline Approval Stamp Failure','Outline Approval: stamp failure route was lost');

const approvedOutlineCondition=singleCondition(approvedOutlineIsValid);
assert(approvedOutlineIsValid?.type==='n8n-nodes-base.if','Outline Approval: validation gate must remain an IF node');
assert(approvedOutlineIsValid.parameters.conditions?.options?.typeValidation==='strict','Outline Approval: validation gate must retain strict type checking');
assert(approvedOutlineCondition.operator?.type==='boolean' && approvedOutlineCondition.operator?.operation==='true','Outline Approval: validation gate must test Boolean true');
const validApprovedOutline={storyId:'MILO-001',outlineId:'MILO-001-O01',conceptId:'MILO-001-C01',approvalStatus:'APPROVED',approvalProcessedAt:'',version:1};
assert(evaluateExplicitBooleanExpression(approvedOutlineCondition.leftValue,validApprovedOutline)===true,'Outline Approval: valid outline did not evaluate true');
assert(evaluateExplicitBooleanExpression(approvedOutlineCondition.leftValue,{...validApprovedOutline,storyId:'TEST-INVALID'})===false,'Outline Approval: invalid outline did not evaluate false');
for (const [input,expected] of [['true',true],['false',false],['true ',true],['false ',false]]) assert(n8nStringToBoolean(String(input).trim().toLowerCase())===expected, `n8n Boolean normalization mismatch for ${JSON.stringify(input)}`);
assert(singleTarget(outlineApproval,approvedOutlineIsValid.name,0)==='Read Source Story','Outline Approval: valid outline must route to Read Source Story');
const invalidOutlineFailure=singleTarget(outlineApproval,approvedOutlineIsValid.name,1);
assert(invalidOutlineFailure==='Prepare Invalid Approved Outline Failure','Outline Approval: invalid outline must route to its failure payload');
assert(singleTarget(outlineApproval,invalidOutlineFailure,0)==='Call Failure Handler','Outline Approval: invalid outline failure must reach Call Failure Handler');

const outlineGenerator=workflows.find((workflow)=>workflow.name==='Milo Outline Generator v0.1');
const validateOutlineRecord=outlineGenerator.nodes.find((node)=>node.name==='Validate Outline Record');
const validateOutlineRecordCondition=singleCondition(validateOutlineRecord);
assert(validateOutlineRecord?.type==='n8n-nodes-base.if','Outline Generator: record validation gate must remain an IF node');
assert(validateOutlineRecordCondition.operator?.type==='boolean','Outline Generator: record validation gate must remain Boolean');
assert(validateOutlineRecordCondition.leftValue.startsWith('={{'),'Outline Generator: validation expression is missing');
assert(validateOutlineRecordCondition.leftValue.trimEnd().endsWith('}}'),'Outline Generator: Boolean expression has a literal suffix');

function simulateOutlineApprovalStoryRoute(status) {
  const route=[outlineReady.name];
  if (status===singleEqualsValue(outlineReady)) { const markStory=singleTarget(outlineApproval,outlineReady.name,0); route.push(markStory,singleTarget(outlineApproval,markStory,0)); return route; }
  route.push(singleTarget(outlineApproval,outlineReady.name,1));
  if (status===singleEqualsValue(outlineAlreadyApproved)) { route.push(singleTarget(outlineApproval,outlineAlreadyApproved.name,0)); return route; }
  const failure=singleTarget(outlineApproval,outlineAlreadyApproved.name,1); route.push(failure,singleTarget(outlineApproval,failure,0)); return route;
}
assert(JSON.stringify(simulateOutlineApprovalStoryRoute('OUTLINE_GENERATED'))===JSON.stringify(['Story Is Ready for Outline Approval','Mark Story Outline Approved','Stamp Outline Approval Processed']),'Outline Approval: happy-path route is wrong');
assert(JSON.stringify(simulateOutlineApprovalStoryRoute('OUTLINE_APPROVED'))===JSON.stringify(['Story Is Ready for Outline Approval','Story Already Outline Approved','Stamp Outline Approval Processed']),'Outline Approval: repair-path route is wrong');
for (const status of ['','IDEA','CONCEPT_APPROVED','SCRIPT_GENERATED','CONTINUITY_APPROVED']) assert(JSON.stringify(simulateOutlineApprovalStoryRoute(status))===JSON.stringify(['Story Is Ready for Outline Approval','Story Already Outline Approved','Prepare Story Not Ready Failure','Call Failure Handler']),`Outline Approval: invalid Story state escaped failure routing: ${status || '<blank>'}`);

const scriptApproval=workflows.find((workflow)=>workflow.name==='Milo Script Approval v0.1');
const invalidScriptFailure=scriptApproval.nodes.find((node)=>node.name==='Prepare Invalid Approved Script Failure');
const invalidScriptAssignments=invalidScriptFailure?.parameters?.assignments?.assignments ?? [];
assert(invalidScriptAssignments.some((assignment)=>assignment.name==='storyId'),'Script Approval: invalid-script payload is missing storyId');
assert(!invalidScriptAssignments.some((assignment)=>assignment.name==='stroyId'),'Script Approval: stroyId typo remains in invalid-script payload');

const scriptGeneratorWorkflow=workflows.find((workflow)=>workflow.name==='Milo Script Generator v0.1');
const storyNotReadyFailure=scriptGeneratorWorkflow.nodes.find((node)=>node.name==='Prepare Story Not Ready Failure');
const storyNotReadyAssignments=storyNotReadyFailure?.parameters?.assignments?.assignments ?? [];
const scriptFailureStoryId=storyNotReadyAssignments.find((assignment)=>assignment.name==='storyId');
const scriptFailureStoryStatus=storyNotReadyAssignments.find((assignment)=>assignment.name==='StoryStatus');
assert(scriptFailureStoryId?.value==="={{ $json.storyId ?? '' }}",'Script Generator: handled failure storyId must be a literal expression');
assert(!storyNotReadyAssignments.some((assignment)=>assignment.name==='stroyId'),'Script Generator: stroyId typo remains in Story-not-ready payload');
assert(scriptFailureStoryStatus?.value==="={{ $json.status ?? '' }}",'Script Generator: StoryStatus must not contain a leading formula marker');
assert(!scriptFailureStoryId.value.startsWith('=='),'Script Generator: storyId payload would be interpreted as a Sheets formula');

for (const workflowName of ['Milo Script Generator v0.1','Milo Outline Generator v0.1','Milo Outline Approval v0.1','Milo Concept Approval v0.1']) {
  const workflow=workflows.find((candidate)=>candidate.name===workflowName);
  assert(Object.keys(workflow.pinData ?? {}).length===0, `${workflowName}: unintended pinned data remains`);
  assert(!JSON.stringify(workflow).includes('TEST-INVALID'), `${workflowName}: TEST-INVALID test data remains`);
}

const handlerTypes=new Set(handler.nodes.map((node)=>node.type));
assert(handlerTypes.has('n8n-nodes-base.executeWorkflowTrigger'),'Handler missing Execute Sub-workflow Trigger');
assert(handlerTypes.has('n8n-nodes-base.errorTrigger'),'Handler missing Error Trigger');
assert(!Object.hasOwn(handler.settings,'errorWorkflow'),'Handler must not recursively target itself as an Error Workflow');

for (const workflow of allWorkflows) for (const node of workflow.nodes.filter((node)=>node.type==='n8n-nodes-base.googleSheets' && node.parameters.operation==='append')) assert(node.retryOnFail!==true, `${workflow.name} / ${node.name}: Sheets append must not retry`);

const handlerSheets=handler.nodes.filter((node)=>node.type==='n8n-nodes-base.googleSheets');
assert(handlerSheets.length===1,'Handler must have exactly one Sheets node');
assert(handlerSheets[0].parameters.operation==='append','FailureLog must be append-only for new events');
assert(handlerSheets[0].parameters.sheetName.value==='FailureLog','Handler must target FailureLog only');

const observedCodes=new Set(workflows.flatMap((workflow)=>[...collectCodes(workflow)]));
observedCodes.add('CANON_LINEAGE_INVALID');
observedCodes.add('CANON_LINEAGE_MISMATCH');
observedCodes.add('GOVERNED_CANON_RELEASE_INVALID');
observedCodes.add('CANON_INITIALIZATION_INTEGRITY_FAILED');
for (const code of preInstrumentationCodes) assert(observedCodes.has(code), `Existing error code was lost: ${code}`);
for (const code of collectCodes(handler)) observedCodes.add(code);
observedCodes.add('HANDLED_FAILURE');
observedCodes.add('UNHANDLED_WORKFLOW_ERROR');
const registerText=fs.readFileSync(path.join(repoRoot,'02-story-system/ERROR_CODE_REGISTER.md'),'utf8');
const registeredCodes=new Set([...registerText.matchAll(/^\| `([A-Z0-9_]+)` \|/gm)].map((match)=>match[1]));
assert(registeredCodes.size===observedCodes.size, `Error-code register count ${registeredCodes.size} does not match implementation count ${observedCodes.size}`);
for (const code of observedCodes) assert(registeredCodes.has(code), `Implemented error code is not registered: ${code}`);

const normalizeNode=handler.nodes.find((node)=>node.name==='Normalize Failure Event');
assert(normalizeNode?.type==='n8n-nodes-base.code','Handler normalizer is missing');
const runNormalizer=new Function('$input','$workflow','$execution',normalizeNode.parameters.jsCode);
const normalize=(payload)=>runNormalizer({all:()=>[{json:structuredClone(payload)}]},{id:'handler-workflow-id',name:handler.name},{id:'handler-execution-id'})[0].json;
const handledValidation=normalize({success:false,errorCode:'APPROVED_SCRIPT_INVALID',message:'Approved script failed deterministic validation.',workflowName:'Milo Continuity Reviewer v0.1',workflowId:'continuity-reviewer-id',executionId:'exec-handled-1',sourceType:'HANDLED',nodeName:'Prepare Invalid Approved Script Failure',nodeType:'n8n-nodes-base.set',storyId:'MILO-001',scriptId:'MILO-001-S01',storyStatus:'SCRIPT_APPROVED',attempt:0,failedAt:'2026-08-30T12:00:00.123Z'});
assert(Object.keys(handledValidation).join('|')===expectedColumns.join('|'),'Handled row does not match FailureLog column order');
assert(handledValidation.sourceType==='HANDLED','Handled sourceType was not retained');
assert(handledValidation.errorCode==='APPROVED_SCRIPT_INVALID','Local errorCode was not retained');
assert(handledValidation.status==='OPEN','New failure status must be OPEN');
assert(!Object.hasOwn(handledValidation,'storyStatus'),'Failure Handler must not emit lifecycle status fields');
assert(JSON.parse(handledValidation.rawError).storyStatus==='SCRIPT_APPROVED','Local payload meaning was not retained in rawError');

const handledSheetsFailurePayload={success:false,errorCode:'SCRIPT_SAVE_FAILED',message:'Script could not be saved to the Story Vault.',workflowName:'Milo Script Generator v0.1',workflowId:'script-generator-id',executionId:'exec-sheets-1',sourceType:'HANDLED',nodeName:'Prepare Script Save Failure',nodeType:'n8n-nodes-base.set',storyId:'MILO-002',scriptId:'MILO-002-S01',attempt:0,failedAt:'2026-08-30T12:01:00.456Z'};
const handledSheetsFailure=normalize(handledSheetsFailurePayload);
const handledSheetsFailureRepeat=normalize(handledSheetsFailurePayload);
assert(handledSheetsFailure.errorCode==='SCRIPT_SAVE_FAILED','Sheets failure errorCode was not retained');
assert(handledSheetsFailure.failureId===handledSheetsFailureRepeat.failureId,'Same event must produce the same failureId');
const scriptGenerator=workflows.find((workflow)=>workflow.name==='Milo Script Generator v0.1');
const scriptSaveNode=scriptGenerator.nodes.find((node)=>node.name==='Save Script Record');
assert(scriptSaveNode?.type==='n8n-nodes-base.googleSheets','Script save test source is not a Sheets node');
assert(scriptSaveNode.onError==='continueErrorOutput','Script save node must expose its handled error output');
assert(scriptGenerator.connections['Save Script Record']?.main?.[1]?.some((target)=>target.node==='Prepare Script Save Failure'),'Script save error output is not routed through its local failure payload');
assert(scriptGenerator.connections['Prepare Script Save Failure']?.main?.[0]?.some((target)=>target.node==='Call Failure Handler'),'Script save failure payload is not routed to the shared handler');

const unhandled=normalize({execution:{id:'exec-unhandled-1',stoppedAt:'2026-08-30T12:02:00.789Z',lastNodeExecuted:'Read Source Story',error:{message:'Synthetic unhandled crash',node:{name:'Read Source Story',type:'n8n-nodes-base.googleSheets'}}},workflow:{id:'outline-approval-id',name:'Milo Outline Approval v0.1'}});
assert(Object.keys(unhandled).join('|')===expectedColumns.join('|'),'Unhandled row does not match FailureLog column order');
assert(unhandled.sourceType==='UNHANDLED','Unhandled Error Trigger payload was not detected');
assert(unhandled.errorCode==='UNHANDLED_WORKFLOW_ERROR','Unhandled error code is wrong');
assert(unhandled.executionId==='exec-unhandled-1','Unhandled execution ID was not captured');
assert(unhandled.nodeName==='Read Source Story','Unhandled failing node was not captured');
assert(unhandled.message==='Synthetic unhandled crash','Unhandled message was not captured');

console.log('PASS JSON parsing and connection integrity: 10 workflows');
console.log('PASS Boolean IF normalization, strict typing, and literal-suffix audit');
console.log('PASS Outline Approval valid/invalid predicate branches and invalid failure route');
console.log('PASS Outline Approval happy, repair, invalid-state, and failure-handler routes');
console.log('PASS Script Approval storyId payload spelling');
console.log('PASS Script Generator, Outline Approval, and Batch 2 exports contain no retained test pins');
console.log('PASS local failure reachability and handler routing: 43/43 Prepare Failure nodes');
console.log('PASS Concept Generator D-014 pre-canon duplicate, original duplicate, invalid-batch, and handler routes');
console.log('PASS existing error-code preservation: 35/35 baseline codes');
console.log(`PASS operational error-code register: ${registeredCodes.size}/${observedCodes.size} codes`);
console.log('PASS handled validation normalization and lifecycle isolation');
console.log('PASS handled Sheets failure branch, normalization, and deterministic failureId');
console.log('PASS unhandled Error Trigger normalization');
console.log('PASS FailureLog row contract: 18/18 columns');
console.log('PASS Sheets append retry policy: retryOnFail disabled on every append');
