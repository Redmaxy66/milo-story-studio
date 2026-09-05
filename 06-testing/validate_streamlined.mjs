import assert from 'node:assert/strict';import * as S from '../05-code/streamlined/studio.mjs';import {fixture}from'./fixtures/streamlined/make_fixture.mjs';
let count=0;function test(name,fn){fn();count++;console.log('PASS '+name)}
const f=fixture();
test('five exact 120s daily timelines',()=>{for(const e of f.week.episodes)assert.equal(S.dailyTimeline(f.week,e.episode_id,f.assets).total_frames,2880)});
test('600s compilation with reordered hooks and actual chapters',()=>{const p=S.compilationTimeline(f.week,f.compilation,f.assets);assert.equal(p.total_frames,14400);assert.deepEqual(p.chapters.map(c=>c.start_sec),[6,124,242,360,478]);assert.equal(p.compilation.order[1],'ep_wed');const {manifest_hash,...rest}=p;assert.equal(S.hash(rest),manifest_hash)});
const fails=(change,pattern,action=f=>S.compilationTimeline(f.week,f.compilation,f.assets))=>{const f=fixture();change(f);assert.throws(()=>action(f),pattern)};
test('canon mismatch blocks',()=>fails(f=>f.week.canon_ref='wrong',/CANON_MISMATCH/));
test('changed script invalidates review',()=>fails(f=>f.week.episodes[0].script_text+=' changed',/APPROVAL_CONTENT_CHANGED/));
test('changed media invalidates review',()=>fails(f=>f.assets[0].sha256='b'.repeat(64),/ASSET_NOT_APPROVED/));
test('wrong next-story hook blocks',()=>fails(f=>f.compilation.bridges[0].hook_sentence='wrong',/WRONG_NEXT_STORY_HOOK/));
test('unsafe dialogue trimming blocks',()=>fails(f=>f.week.episodes[0].shots[0].dialogue_occupied=true,/UNSAFE_TRIM_HANDLE/));
test('over-trimming blocks',()=>fails(f=>f.compilation.runtime_adjustments[0].duration_sec=20,/TRIM_EXCEEDS_HANDLE/));
test('duplicate episode order blocks',()=>fails(f=>f.compilation.order[1]='ep_mon',/COMPILATION_ORDER_INVALID/));
test('compilation edit needs exact review',()=>fails(f=>f.compilation.title+=' changed',/APPROVAL_CONTENT_CHANGED/));
test('synthetic asset cannot cross into production',()=>assert.throws(()=>S.assetMap(f.assets,'production'),/ENVIRONMENT_MISMATCH/));
const attempt=()=>S.prepareAttempt(f.request,[],f.budget,f.environment);
test('MCP JSON model/mode/params envelope retained',()=>{const {model,mode,...params}=f.request.params;assert.deepEqual(JSON.parse(attempt().mcp_json),{model,mode,params})});
test('paid execution unconditionally locked',()=>assert.throws(()=>S.requirePaidAuthority({allow_paid:true}),/PAID_PILOT_APPROVAL_REQUIRED/));
test('duplicate submission blocks',()=>assert.throws(()=>S.prepareAttempt(f.request,[{request_id:f.request.request_id}],f.budget,f.environment),/REQUEST_ALREADY_ATTEMPTED/));
test('uncertain prior attempt blocks',()=>assert.throws(()=>S.prepareAttempt(f.request,[{status:'UNKNOWN'}],f.budget,f.environment),/PRIOR_ATTEMPT_UNRESOLVED/));
test('budget includes worst-case reservation',()=>assert.throws(()=>S.prepareAttempt(f.request,[],{total_cap:249,max_attempts:3},f.environment),/BUDGET_EXCEEDED/));
test('submit-failed is never a history id',()=>{const r=S.reconcileAttempt(attempt(),{history_id:'submit-failed',actual_credits:0});assert.equal(r.history_id,null);assert.equal(r.status,'FAILED_NO_GENERATION');assert.equal(r.retry_allowed,false)});
test('pending job polls rather than resubmits',()=>assert.equal(S.reconcileAttempt(attempt(),{history_id:'fixture-history',status:'RUNNING',actual_credits:null}).next_action,'POLL_EXISTING_JOB'));
test('missing final cost blocks success',()=>assert.equal(S.reconcileAttempt(attempt(),{history_id:'fixture-history',status:'COMPLETED',actual_credits:null,outputs:[{resource_id:'x',url:'https://example.invalid/x'}]}).status,'RECONCILIATION_REQUIRED'));
test('negative reported cost rejected',()=>assert.throws(()=>S.reconcileAttempt(attempt(),{actual_credits:-1}),/INVALID_ACTUAL_COST/));
console.log(`${count} test groups passed; no provider calls.`);
const {readFileSync,readdirSync}=await import('node:fs');const {createRequire}=await import('node:module');const require=createRequire(import.meta.url);
for(const file of readdirSync('04-n8n-workflows/streamlined')){
 const w=JSON.parse(readFileSync('04-n8n-workflows/streamlined/'+file));
 test('export isolation and executable code: '+file,()=>{assert.equal(w.active,false);assert.deepEqual(w.pinData,{});assert.equal(w.nodes.filter(n=>n.credentials).length,0);assert.equal(w.nodes.filter(n=>/httpRequest|scheduleTrigger|mcpClient/.test(n.type)).length,0);const fnode=w.nodes.find(n=>n.name==='Isolated fixture');const stage=w.nodes.find(n=>n.id==='stage');const job=new Function(fnode.parameters.jsCode)()[0].json;const out=new Function('require','$input',stage.parameters.jsCode)(require,{first:()=>({json:job})});assert.equal(out.length,1);assert.equal(out[0].json.environment,'isolated_test');if(file.startsWith('02'))assert.throws(()=>new Function('require','$input',stage.parameters.jsCode)(require,{first:()=>({json:{...job,submit:true}})}),/PAID_PILOT_APPROVAL_REQUIRED/)});
}
console.log(`${count} total test groups passed including exact generated n8n code.`);
