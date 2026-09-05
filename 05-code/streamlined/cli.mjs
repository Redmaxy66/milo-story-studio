#!/usr/bin/env node
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import * as S from './studio.mjs';
const [action,input,output]=process.argv.slice(2);
if(!input||!output)throw Error('Usage: node cli.mjs prepare|media|assemble|release INPUT.json OUTPUT.json');
const job=JSON.parse(readFileSync(input,'utf8'));let result;
if(action==='prepare')result=S.prepareWeek(job.week,job.canon_text);
else if(action==='media')result=S.prepareAttempt(job.request,job.ledger,job.budget,job.environment);
else if(action==='assemble')result=job.format==='compilation'?S.compilationTimeline(job.week,job.compilation,job.assets):S.dailyTimeline(job.week,job.episode_id,job.assets);
else if(action==='release')result=S.releasePackage(job.plan,job.render_result,job.approval);
else throw Error('Unknown action');
mkdirSync(dirname(resolve(output)),{recursive:true});writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(result.status??result.job_id);
