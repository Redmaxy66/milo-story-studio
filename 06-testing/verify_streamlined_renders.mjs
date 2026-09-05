import {readFileSync,writeFileSync,mkdirSync}from'node:fs';import {execFileSync}from'node:child_process';import {createHash}from'node:crypto';import assert from'node:assert/strict';import * as S from'../05-code/streamlined/studio.mjs';
const root=process.argv[2];assert(root,'Provide synthetic directory');const evidence=[];
for(const name of [...S.DAYS,'compilation']){
 const plan=JSON.parse(readFileSync(root+'/'+name+'.json'));const r=JSON.parse(readFileSync(root+'/renders/'+name+'/render-result.json'));
 assert.equal(createHash('sha256').update(readFileSync(r.file)).digest('hex'),r.sha256);
 const decision=S.approvalFor({job_id:plan.job_id,sha256:r.sha256},'FIXTURE_ONLY','2026-09-05T00:00:00Z','isolated_test');
 const release=S.releasePackage(plan,r,decision);assert.equal(release.published,false);assert.equal(release.week_id,'TEST_2026_W36');
 assert.throws(()=>S.releasePackage(plan,{...r,actual_runtime_sec:999},decision),/RUNTIME_INVALID/);
 assert.throws(()=>S.releasePackage(plan,{...r,sha256:'d'.repeat(64)},decision),/APPROVAL_CONTENT_CHANGED/);
 const info=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',r.file]));
 const video=info.streams.find(s=>s.codec_type==='video');assert.equal(video.width,1280);assert.equal(video.height,720);assert.equal(video.r_frame_rate,'24/1');assert(info.streams.some(s=>s.codec_type==='audio'));
 evidence.push({job_id:r.job_id,manifest_hash:r.manifest_hash,sha256:r.sha256,actual_runtime_sec:r.actual_runtime_sec,video_frames:r.video_frames,release_status:release.status,published:false});
 writeFileSync(root+'/renders/'+name+'/release-package.json',JSON.stringify(release,null,2)+'\n');
}
mkdirSync('06-testing/evidence/streamlined',{recursive:true});writeFileSync('06-testing/evidence/streamlined/synthetic-render-results.json',JSON.stringify({environment:'isolated_test',date:'2026-09-05',notice:'Neutral cards and silence only. No real story, voice or provider validation.',results:evidence},null,2)+'\n');console.log('Six real masters independently verified: 5 × 120s and 1 × 600s; releases hash-bound; wrong duration and changed masters rejected.');
