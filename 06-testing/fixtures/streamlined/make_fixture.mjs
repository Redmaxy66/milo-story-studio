import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import * as S from '../../../05-code/streamlined/studio.mjs';
export function fixture(){
 const env='isolated_test',at='2026-09-05T00:00:00Z';
 const approve=x=>S.approvalFor(x,'FIXTURE_ONLY',at,env);
 const week={week_id:'TEST_2026_W36',environment:env,canon_ref:S.CANON,canon_version:'canon-v1.0',episodes:S.DAYS.map((id,i)=>({episode_id:id,version:1,title:'Synthetic story '+(i+1),hook_sentence:'A new gentle adventure awaits '+(i+1)+'.',script_text:'SYNTHETIC TIMING FIXTURE. This is not an approved Milo script.',target_runtime_sec:120,narration_duration_sec:120,voice_asset_id:'voice120',compilation_voice_asset_id:'voice'+(i===4?'116':'112'),continuity_reviewed:true,kid_safe_reviewed:true,shots:[{shot_no:1,kind:'still',asset_id:'card'+i,duration_sec:120,trim_handle_sec:10,removable:true,dialogue_occupied:false}]}))};
 for(const ep of week.episodes)ep.approval=approve(S.episodeContent(ep));
 const order=['ep_mon','ep_wed','ep_tue','ep_thu','ep_fri'];
 const compilation={week_id:week.week_id,title:'Milo and the Pond Friends | 5 Stories',description:'Join Milo for five gentle adventures with pond friends. Kindness and curiosity help everyone find their way.',tags:['milo moonberry','kids stories'],target_runtime_sec:600,order,cold_open:{episode_id:'ep_wed',shot_no:1,duration_sec:6,audio_asset_id:'voice6'},bridges:order.slice(0,4).map((id,i)=>({after:id,bridge_bg:'card0',motion_asset_id:null,bridge_line:week.episodes.find(e=>e.episode_id===order[i+1]).hook_sentence,hook_sentence:week.episodes.find(e=>e.episode_id===order[i+1]).hook_sentence,next_episode_id:order[i+1],voice_asset_id:'voice6',duration_sec:6})),outro:{asset_id:'card4',line:'See you next week for more Milo stories.',duration_sec:6,voice_asset_id:'voice6'},thumbnail_shot:{episode_id:'ep_thu',shot_no:1},chapters:order.map((id,i)=>({episode_id:id,label:week.episodes.find(e=>e.episode_id===id).title,starts_after:i===0?'cold_open':'bridge_'+order[i-1]})),estimated_runtime_sec:600,runtime_adjustment:'trim approved silent holds: 8s Monday–Thursday; 4s Friday',runtime_adjustments:week.episodes.map((e,i)=>({type:'trim_still',episode_id:e.episode_id,shot_no:1,duration_sec:i===4?4:8}))};
 compilation.approval=approve(compilation);
 const assets=[...S.DAYS.map((_,i)=>({asset_id:'card'+i,file:'card'+i+'.ppm',kind:'image'})),...[6,112,116,120].map(n=>({asset_id:'voice'+n,file:'voice'+n+'.wav',kind:'audio'}))].map(a=>({...a,sha256:'a'.repeat(64),reviewed_sha256:'a'.repeat(64),approved:true,rights_confirmed:true,environment:env}));
 const request={request_id:'TEST_CLIP_01',tool:'openart_generate_video',source_hash:S.hash(week.episodes[0]),estimated_credits:250,maximum_credits:250,params:{model:'wan2-7',mode:'element2video',prompt:'SYNTHETIC CONTRACT TEST ONLY. Never submit.',visualReferences:[{type:'image',id:'FIXTURE_REFERENCE',url:'https://example.invalid/reference.png'}],duration:10,resolution:'720p',aspectRatio:'16:9',videoCount:1,enablePromptExpansion:false}};
 request.approval=approve({request_id:request.request_id,source_hash:request.source_hash,payload:S.makePayload(request)});
 return {week,compilation,assets,request,ledger:[],budget:{total_cap:750,max_attempts:3},environment:env,canon_text:'SYNTHETIC TEST CONTEXT ONLY. Real jobs require the unchanged approved canon document.'};
}
if(process.argv[1]===new URL(import.meta.url).pathname){
 const root=resolve(process.argv[2]||'/tmp/milo-synthetic');mkdirSync(root,{recursive:true});const f=fixture();
 for(let i=0;i<5;i++){const pixel=Buffer.from([[36,54,80],[54,85,66],[90,62,91],[70,84,100],[95,80,60]][i]);writeFileSync(root+'/card'+i+'.ppm',Buffer.concat([Buffer.from('P6\n160 90\n255\n'),Buffer.concat(Array(160*90).fill(pixel))]));}
 for(const n of [6,112,116,120])execFileSync('ffmpeg',['-v','error','-y','-f','lavfi','-i','anullsrc=r=48000:cl=stereo','-t',String(n),root+'/voice'+n+'.wav']);
 for(const a of f.assets)a.sha256=a.reviewed_sha256=createHash('sha256').update(readFileSync(root+'/'+a.file)).digest('hex');
 writeFileSync(root+'/fixture.json',JSON.stringify(f,null,2)+'\n');
 for(const e of f.week.episodes){const plan=S.dailyTimeline(f.week,e.episode_id,f.assets);plan.metadata={title:e.title,description:'Synthetic assembly test for Milo. No production story is represented.',tags:['test']};S.finalizeTimeline(plan);writeFileSync(root+'/'+e.episode_id+'.json',JSON.stringify(plan,null,2)+'\n');}
 writeFileSync(root+'/compilation.json',JSON.stringify(S.compilationTimeline(f.week,f.compilation,f.assets),null,2)+'\n');console.log(root);
}
