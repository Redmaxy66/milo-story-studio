import { createHash } from 'node:crypto';

// One source for CLI tests and generated n8n Code nodes. No network or side effects.
export const VERSION = 'milo-streamlined-v1';
export const CANON = '977755913d9ad41e4f16392d01ea993507af4102';
export const DAYS = ['ep_mon', 'ep_tue', 'ep_wed', 'ep_thu', 'ep_fri'];
export const PAID_EXECUTION_ENABLED = false; // Only a separately approved pilot may change this.
export function canonical(value) {
  if (value === null || typeof value !== 'object') {
    if (value === undefined || (typeof value === 'number' && !Number.isFinite(value))) throw new Error('INVALID_JSON');
    return JSON.stringify(value);
  }
  return Array.isArray(value) ? '[' + value.map(canonical).join(',') + ']' : '{' + Object.keys(value).sort().map(k => JSON.stringify(k)+':'+canonical(value[k])).join(',') + '}';
}
export const hash = value => createHash('sha256').update(canonical(value)).digest('hex');
export function check(condition, code, detail='') { if (!condition) throw new Error(code+(detail ? ': '+detail : '')); }
export const finite = n => typeof n === 'number' && Number.isFinite(n);
export const text = s => typeof s === 'string' && s.trim().length > 0;
export const clone = v => JSON.parse(JSON.stringify(v));
export function frames(seconds, fps=24) {
  check(finite(seconds) && seconds >= 0 && Number.isInteger(fps) && fps>0, 'INVALID_TIME');
  check(Math.abs(seconds*fps - Math.round(seconds*fps)) < 0.00001, 'OFF_FRAME_TIME');
  return Math.round(seconds*fps);
}
export function approvalFor(content, by, at, environment='production') {
  check(text(by)&&text(at),'APPROVER_REQUIRED');
  return {decision:'APPROVED', content_hash:hash(content), by, at, environment};
}
export function verifyApproval(content, approval, environment) {
  check(approval?.decision==='APPROVED' && text(approval.by) && text(approval.at), 'APPROVAL_REQUIRED');
  check(approval.content_hash===hash(content),'APPROVAL_CONTENT_CHANGED');
  check(approval.environment===environment,'APPROVAL_ENVIRONMENT_MISMATCH');
  check(environment!=='production' || !/TEST|FIXTURE/i.test(approval.by),'SYNTHETIC_APPROVAL');
}
export function episodeContent(ep) {
  const {approval, ...content}=ep; return content;
}
export function validateWeek(week, {requireApproval=false}={}) {
  check(text(week.week_id) && /^[A-Za-z0-9_-]+$/.test(week.week_id),'WEEK_ID_REQUIRED');
  check(['isolated_test','production'].includes(week.environment),'ENVIRONMENT_REQUIRED');
  check(week.canon_ref===CANON && week.canon_version==='canon-v1.0','CANON_MISMATCH');
  check(Array.isArray(week.episodes) && week.episodes.length===5,'FIVE_EPISODES_REQUIRED');
  const ids=week.episodes.map(e=>e.episode_id);
  check(new Set(ids).size===5 && DAYS.every(d=>ids.includes(d)),'EPISODE_ID_SET_INVALID');
  for(const e of week.episodes) {
    check(text(e.title)&&text(e.hook_sentence)&&text(e.script_text),'EPISODE_TEXT_REQUIRED',e.episode_id);
    check(Number.isInteger(e.version)&&e.version>=1,'SCRIPT_VERSION_INVALID');
    check(e.target_runtime_sec===120,'DAILY_TARGET_MUST_BE_120');
    if(e.narration_duration_sec!==null) check(finite(e.narration_duration_sec)&&e.narration_duration_sec>0&&e.narration_duration_sec<=120,'NARRATION_TOO_LONG');
    check(Array.isArray(e.shots)&&e.shots.length>0,'SHOTS_REQUIRED');
    const shotIds=new Set();let total=0;
    for(const s of e.shots) {
      check(Number.isInteger(s.shot_no)&&s.shot_no>0&&!shotIds.has(s.shot_no),'DUPLICATE_OR_INVALID_SHOT');shotIds.add(s.shot_no);
      check(['still','video'].includes(s.kind)&&text(s.asset_id),'SHOT_ASSET_REQUIRED');
      check(finite(s.duration_sec)&&s.duration_sec>0,'SHOT_DURATION_INVALID');frames(s.duration_sec);
      check(finite(s.trim_handle_sec)&&s.trim_handle_sec>=0&&s.trim_handle_sec<s.duration_sec,'TRIM_HANDLE_INVALID');
      check(s.trim_handle_sec===0 || (s.removable===true && s.dialogue_occupied===false),'UNSAFE_TRIM_HANDLE');
      total+=frames(s.duration_sec);
    }
    check(total===2880,'DAILY_TIMELINE_NOT_120',e.episode_id);
    if(requireApproval) {
      check(e.continuity_reviewed===true && e.kid_safe_reviewed===true,'EDITORIAL_REVIEW_REQUIRED');
      check(e.narration_duration_sec!==null,'ACTUAL_VOICE_TIMING_REQUIRED');
      verifyApproval(episodeContent(e), e.approval, week.environment);
    }
  }
  return week;
}
export function prepareWeek(week, canonText) {
  validateWeek(week);
  check(text(canonText),'CANON_TEXT_REQUIRED');
  return {version:VERSION,week_id:week.week_id,environment:week.environment,status:'SCRIPT_REVIEW_REQUIRED',
    writing_prompt: 'Use the approved Milo canon below. Prepare five complete, distinct, kid-safe two-minute stories, ep_mon through ep_fri. Preserve Milo identity, gentle tone and character agency. Start around 200–240 spoken words; actual narration timing controls acceptance. Include a hook_sentence and one compact shot plan per episode. Do not invent canon. Return scripts for batch human review; no spend or media approval is implied.\n\n'+canonText+'\n\nBriefs:\n'+JSON.stringify(week.episodes.map(e=>({episode_id:e.episode_id,title:e.title,brief:e.script_text}))),
    episode_ids:DAYS,week:clone(week),next_action:'Review all five scripts and obtain actual narration timing before approving media.'};
}
export function assetMap(assets, environment) {
  check(Array.isArray(assets),'ASSETS_REQUIRED');const map=new Map();
  for(const a of assets) {
    check(text(a.asset_id)&&!map.has(a.asset_id),'DUPLICATE_ASSET');
    check(/^[a-f0-9]{64}$/.test(a.sha256||'')&&text(a.file),'ASSET_IDENTITY_REQUIRED');
    check(a.approved===true&&a.reviewed_sha256===a.sha256&&a.rights_confirmed===true,'ASSET_NOT_APPROVED',a.asset_id);
    check(a.environment===environment,'ASSET_ENVIRONMENT_MISMATCH');
    check(['image','video','audio'].includes(a.kind),'ASSET_KIND_INVALID');
    map.set(a.asset_id,a);
  }
  return map;
}
export function makePayload(request) {
  // OpenArt MCP takes a params OBJECT; JSON input must contain this wrapper.
  check(text(request.request_id)&&request.tool==='openart_generate_video','REQUEST_ID_OR_TOOL_INVALID');
  const p=clone(request.params);
  check(p&&p.model==='wan2-7'&&p.mode==='element2video','UNVERIFIED_VIDEO_CONFIGURATION');
  check(text(p.prompt)&&Array.isArray(p.visualReferences)&&p.visualReferences.length>=1&&p.visualReferences.length<=5,'PROMPT_OR_REFERENCES_MISSING');
  check(p.visualReferences.every(r=>r.type==='image'&&text(r.id)&&/^https:\/\//.test(r.url||'')),'INVALID_PROVIDER_REFERENCE');
  check(new Set(p.visualReferences.map(r=>r.id)).size===p.visualReferences.length,'DUPLICATE_PROVIDER_REFERENCE');
  check(p.duration===10&&p.resolution==='720p'&&p.aspectRatio==='16:9'&&p.videoCount===1&&p.enablePromptExpansion===false,'UNVERIFIED_VIDEO_SETTINGS');
  check(text(request.source_hash)&&/^[a-f0-9]{64}$/.test(request.source_hash),'SOURCE_HASH_REQUIRED');
  return {params:p};
}
export function prepareAttempt(request, ledger, budget, environment) {
  const payload=makePayload(request);
  verifyApproval({request_id:request.request_id,source_hash:request.source_hash,payload},request.approval,environment);
  check(Array.isArray(ledger),'LEDGER_REQUIRED');
  check(!ledger.some(a=>a.request_id===request.request_id),'REQUEST_ALREADY_ATTEMPTED');
  check(!ledger.some(a=>['RESERVED','SUBMITTED','RUNNING','UNKNOWN','RECONCILIATION_REQUIRED'].includes(a.status)),'PRIOR_ATTEMPT_UNRESOLVED');
  check(finite(budget.total_cap)&&budget.total_cap>0&&Number.isInteger(budget.max_attempts)&&budget.max_attempts>0,'BUDGET_REQUIRED');
  check(ledger.length<budget.max_attempts,'ATTEMPT_LIMIT');
  check(finite(request.estimated_credits)&&finite(request.maximum_credits)&&request.estimated_credits>0&&request.maximum_credits>=request.estimated_credits,'INVALID_REQUEST_COST');
  const spent=ledger.reduce((n,a)=>{check(finite(a.actual_credits)&&a.actual_credits>=0,'UNRECONCILED_COST');return n+a.actual_credits;},0);
  check(spent+request.maximum_credits<=budget.total_cap,'BUDGET_EXCEEDED');
  return {request_id:request.request_id,attempt_id:request.request_id+'-A01',status:'PREPARED_NOT_SUBMITTED',payload,
    payload_hash:hash(payload),tool:request.tool,mcp_json:JSON.stringify(payload),maximum_credits:request.maximum_credits,
    remaining_after_reservation:budget.total_cap-spent-request.maximum_credits,environment,automatic_retries:0};
}
export function requirePaidAuthority() {
  check(PAID_EXECUTION_ENABLED,'PAID_PILOT_APPROVAL_REQUIRED');
}
export function reconcileAttempt(attempt, response) {
  const r=clone(attempt);r.raw_status=response.status??null;
  check((finite(response.actual_credits)&&response.actual_credits>=0)||response.actual_credits===null,'INVALID_ACTUAL_COST');
  r.actual_credits=response.actual_credits;
  const validId=text(response.history_id)&&response.history_id!=='submit-failed';
  r.history_id=validId?response.history_id:null;r.outputs=response.outputs??[];
  if(response.history_id==='submit-failed') {
    r.status=response.actual_credits===0?'FAILED_NO_GENERATION':'RECONCILIATION_REQUIRED';
  } else if(!validId) r.status='RECONCILIATION_REQUIRED';
  else if(['PENDING','QUEUED','SUBMITTED','RUNNING','PROCESSING'].includes(response.status)) r.status='RUNNING';
  else if(['COMPLETED','SUCCEEDED'].includes(response.status)) {
    r.status=r.outputs.length===1&&text(r.outputs[0].resource_id)&&/^https:\/\//.test(r.outputs[0].url||'')&&finite(r.actual_credits)?'COMPLETED_NEEDS_RETRIEVAL':'RECONCILIATION_REQUIRED';
  } else r.status='RECONCILIATION_REQUIRED';
  if(finite(r.actual_credits)&&r.actual_credits>r.maximum_credits)r.status='RECONCILIATION_REQUIRED';
  r.retry_allowed=false;
  r.next_action=r.status==='RUNNING'?'POLL_EXISTING_JOB':r.status==='COMPLETED_NEEDS_RETRIEVAL'?'DOWNLOAD_HASH_AND_REVIEW':'STOP_AND_RECONCILE';
  return r;
}
export function dailyTimeline(week, episodeId, assets) {
  validateWeek(week,{requireApproval:true});const map=assetMap(assets,week.environment);
  const ep=week.episodes.find(e=>e.episode_id===episodeId);check(ep,'EPISODE_NOT_FOUND');
  const segments=ep.shots.map(s=>{const a=map.get(s.asset_id);check(a&&a.kind!=='audio','SHOT_ASSET_NOT_FOUND');return {id:ep.episode_id+'-SH'+s.shot_no,asset_id:s.asset_id,start_sec:s.source_in_sec??0,duration_sec:s.duration_sec,kind:s.kind,episode_id:ep.episode_id,shot_no:s.shot_no};});
  check(map.get(ep.voice_asset_id)?.kind==='audio','VOICE_ASSET_REQUIRED');
  return finalizeTimeline({week_id:week.week_id,job_id:week.week_id+'-'+ep.episode_id+'-V'+ep.version,environment:week.environment,format:'daily',fps:24,width:1280,height:720,target_runtime_sec:120,tolerance_sec:0,segments,audio_asset_id:ep.voice_asset_id,assets:clone(assets),chapters:[],thumbnail:{asset_id:ep.shots[0].asset_id,at_sec:0}});
}
export function finalizeTimeline(plan) {
  let cursor=0;
  for(const s of plan.segments){check(s.duration_sec>0,'EMPTY_SEGMENT');s.in_frame=cursor;cursor+=frames(s.duration_sec,plan.fps);s.out_frame=cursor;}
  plan.total_frames=cursor;plan.estimated_runtime_sec=cursor/plan.fps;
  check(Math.abs(plan.estimated_runtime_sec-plan.target_runtime_sec)<=plan.tolerance_sec+0.00001,'TARGET_RUNTIME_MISMATCH');
  plan.manifest_hash=hash(Object.fromEntries(Object.entries(plan).filter(([k])=>k!=='manifest_hash')));
  return plan;
}
export function compilationTimeline(week, compilation, assets) {
  validateWeek(week,{requireApproval:true});const c=clone(compilation);const map=assetMap(assets,week.environment);
  check(c.week_id===week.week_id&&c.target_runtime_sec===600,'COMPILATION_TARGET_INVALID');
  check(Array.isArray(c.order)&&c.order.length===5&&new Set(c.order).size===5&&DAYS.every(d=>c.order.includes(d)),'COMPILATION_ORDER_INVALID');
  check(Array.isArray(c.bridges)&&c.bridges.length===4,'FOUR_BRIDGES_REQUIRED');
  check(new Set(c.bridges.map(b=>b.after)).size===4&&c.order.slice(0,4).every(id=>c.bridges.some(b=>b.after===id)),'BRIDGE_POSITION_INVALID');
  const eps=new Map(week.episodes.map(e=>[e.episode_id,clone(e)]));
  const shotFor=ref=>{const ep=eps.get(ref?.episode_id);const s=ep?.shots.find(x=>x.shot_no===ref.shot_no);check(s,'SHOT_REFERENCE_INVALID');return s;};
  shotFor(c.cold_open);shotFor(c.thumbnail_shot);
  const adjustments=c.runtime_adjustments??[];check(Array.isArray(adjustments),'STRUCTURED_ADJUSTMENTS_REQUIRED');
  let intro=null;
  for(const adj of adjustments) {
    if(adj.type==='trim_still') {
      const s=shotFor(adj);check(s.kind==='still'&&s.removable&&!s.dialogue_occupied,'UNSAFE_STILL_TRIM');
      check(finite(adj.duration_sec)&&adj.duration_sec>0&&adj.duration_sec<=s.trim_handle_sec,'TRIM_EXCEEDS_HANDLE');
      frames(adj.duration_sec);s.duration_sec-=adj.duration_sec;s.trim_handle_sec-=adj.duration_sec;
    } else if(adj.type==='extend_bridge') {
      const b=c.bridges.find(x=>x.after===adj.after);check(b&&adj.duration_sec===8&&b.duration_sec<=8,'BRIDGE_EXTENSION_INVALID');b.duration_sec=8;
    } else if(adj.type==='add_intro_montage') {
      check(!intro&&adj.duration_sec===10&&map.has(adj.asset_id),'INTRO_INVALID');intro={id:'intro',asset_id:adj.asset_id,start_sec:0,duration_sec:10};
    } else throw new Error('UNKNOWN_RUNTIME_ADJUSTMENT');
  }
  const segments=[];const chapters=[];
  const add=s=>{const a=map.get(s.asset_id);check(a&&a.kind!=='audio','VISUAL_ASSET_REQUIRED',s.asset_id);if(s.audio_asset_id)check(map.get(s.audio_asset_id)?.kind==='audio','SEGMENT_AUDIO_REQUIRED');segments.push(s);};
  if(intro)add(intro);
  const cold=shotFor(c.cold_open);check(finite(c.cold_open.duration_sec)&&c.cold_open.duration_sec>0&&c.cold_open.duration_sec<=cold.duration_sec,'COLD_OPEN_DURATION_INVALID');
  add({id:'cold_open',asset_id:cold.asset_id,start_sec:(cold.source_in_sec??0)+(c.cold_open.in_sec??0),duration_sec:c.cold_open.duration_sec,audio_asset_id:c.cold_open.audio_asset_id??null});
  for(let i=0;i<5;i++) {
    const ep=eps.get(c.order[i]);
    const chapter=c.chapters.find(x=>x.episode_id===ep.episode_id);check(chapter&&text(chapter.label),'CHAPTER_LABEL_REQUIRED');
    chapters.push({episode_id:ep.episode_id,label:chapter.label,start_sec:segments.reduce((n,s)=>n+s.duration_sec,0)});
    // Each compilation story edit uses its own approved narration, not the 120s daily mux.
    check(map.get(ep.compilation_voice_asset_id)?.kind==='audio','COMPILATION_VOICE_REQUIRED');
    let audioCursor=0;
    for(const s of ep.shots){add({id:ep.episode_id+'-SH'+s.shot_no,episode_id:ep.episode_id,shot_no:s.shot_no,asset_id:s.asset_id,start_sec:s.source_in_sec??0,duration_sec:s.duration_sec,audio_asset_id:ep.compilation_voice_asset_id,audio_in_sec:audioCursor});audioCursor+=s.duration_sec;}
    if(i<4) {
      const b=c.bridges.find(x=>x.after===ep.episode_id);
      check([6,8].includes(b.duration_sec)&&text(b.bridge_line),'BRIDGE_INVALID');
      check(b.next_episode_id===c.order[i+1]&&b.hook_sentence===eps.get(c.order[i+1]).hook_sentence,'WRONG_NEXT_STORY_HOOK');
      check(map.get(b.voice_asset_id)?.kind==='audio','BRIDGE_VOICE_REQUIRED');
      add({id:'bridge_'+ep.episode_id,asset_id:b.motion_asset_id??b.bridge_bg,start_sec:0,duration_sec:b.duration_sec,audio_asset_id:b.voice_asset_id});
    }
  }
  check(text(c.outro.line)&&finite(c.outro.duration_sec)&&c.outro.duration_sec>0,'OUTRO_INVALID');
  check(map.get(c.outro.voice_asset_id)?.kind==='audio','OUTRO_VOICE_REQUIRED');
  add({id:'outro',asset_id:c.outro.asset_id,start_sec:0,duration_sec:c.outro.duration_sec,audio_asset_id:c.outro.voice_asset_id});
  const thumb=shotFor(c.thumbnail_shot);
  verifyApproval(Object.fromEntries(Object.entries(compilation).filter(([k])=>k!=='approval')),compilation.approval,week.environment);
  const plan=finalizeTimeline({week_id:week.week_id,job_id:week.week_id+'-COMPILATION',environment:week.environment,format:'compilation',fps:24,width:1280,height:720,target_runtime_sec:600,tolerance_sec:10,segments,assets:clone(assets),chapters,thumbnail:{asset_id:thumb.asset_id,at_sec:c.thumbnail_shot.at_sec??0},metadata:{title:c.title,description:c.description,tags:c.tags}});
  plan.compilation={...c,estimated_runtime_sec:plan.estimated_runtime_sec,chapters}; return finalizeTimeline(plan);
}
export function releasePackage(plan, renderResult, decision) {
  check(renderResult.job_id===plan.job_id&&renderResult.manifest_hash===plan.manifest_hash,'RENDER_MANIFEST_MISMATCH');
  check(finite(renderResult.actual_runtime_sec)&&Math.abs(renderResult.actual_runtime_sec-plan.target_runtime_sec)<=plan.tolerance_sec+1/plan.fps,'RENDER_RUNTIME_INVALID');
  check(/^[a-f0-9]{64}$/.test(renderResult.sha256||'')&&text(renderResult.file),'MASTER_IDENTITY_REQUIRED');
  verifyApproval({job_id:plan.job_id,sha256:renderResult.sha256},decision,plan.environment);
  const m=plan.metadata??renderResult.metadata;
  check(text(m?.title)&&text(m.description)&&Array.isArray(m.tags)&&m.tags.every(text),'METADATA_REQUIRED');
  check(!/(https?:\/\/|www\.)/i.test(m.description),'DESCRIPTION_LINK_PROHIBITED');
  const sentenceCount=m.description.split(/[.!?]+/).map(s=>s.trim()).filter(Boolean).length;
  check(sentenceCount>=2&&sentenceCount<=3,'DESCRIPTION_SENTENCE_COUNT');
  return {week_id:plan.week_id,job_id:plan.job_id,status:plan.environment==='isolated_test'?'SYNTHETIC_RELEASE_TEST_PASSED':'READY_FOR_HUMAN_RELEASE',environment:plan.environment,...m,actual_runtime_sec:renderResult.actual_runtime_sec,master:renderResult.file,sha256:renderResult.sha256,thumbnail:renderResult.thumbnail,chapters:plan.chapters,published:false};
}
