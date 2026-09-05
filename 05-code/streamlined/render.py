#!/usr/bin/env python3
"""Local deterministic FFmpeg runner. No network, uploads, or paid providers."""
import argparse, hashlib, json, math, pathlib, subprocess, tempfile, os

def run(args):
    return subprocess.run(args, check=True, capture_output=True, text=True).stdout

def sha(path):
    h=hashlib.sha256()
    with open(path,'rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''): h.update(chunk)
    return h.hexdigest()

def probe(path):
    return json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]))

def fail(ok,message):
    if not ok: raise ValueError(message)

def render(plan, root, output):
    root=pathlib.Path(root).resolve();output=pathlib.Path(output).resolve()
    fail(plan['environment'] in ('isolated_test','production'),'Invalid environment')
    fail(plan['fps']==24 and plan['width']==1280 and plan['height']==720,'Unsupported render format')
    # JS canonical hashing is verified by CLI before invocation (avoids Python/JS number differences).
    fail(len(plan['manifest_hash'])==64,'Manifest hash missing')
    fail(not output.exists(),'Output already exists; choose a new version')
    output.mkdir(parents=True)
    media={};infos={}
    for a in plan['assets']:
        path=(root/a['file']).resolve()
        fail(path.is_relative_to(root) and path.is_file(),'Asset outside vault or missing')
        fail(sha(path)==a['sha256']==a['reviewed_sha256'],'Asset hash changed: '+a['asset_id'])
        fail(a['approved'] and a['rights_confirmed'] and a['environment']==plan['environment'],'Asset not approved')
        media[a['asset_id']]=path;infos[a['asset_id']]=probe(path)
    def duration(asset):
        return float(infos[asset]['format'].get('duration',0))
    total=0
    for s in plan['segments']:
        fail(s['in_frame']==total and s['out_frame']-s['in_frame']==round(s['duration_sec']*24),'Frame discontinuity')
        total=s['out_frame']
    fail(total==plan['total_frames'],'Wrong frame count')
    pieces=[]
    with tempfile.TemporaryDirectory(prefix='milo-render-') as temp:
        temp=pathlib.Path(temp)
        for i,s in enumerate(plan['segments']):
            a=next(a for a in plan['assets'] if a['asset_id']==s['asset_id']);d=s['duration_sec'];start=s.get('start_sec',0)
            fail(start>=0 and math.isfinite(start),'Invalid source time')
            args=['ffmpeg','-v','error','-nostdin','-y']
            if a['kind']=='image': args+=['-loop','1','-framerate','24','-i',str(media[a['asset_id']])]
            else:
                fail(start+d<=duration(a['asset_id'])+1/24,'Video source too short')
                args+=['-ss',str(start),'-i',str(media[a['asset_id']])]
            audio=s.get('audio_asset_id') or plan.get('audio_asset_id')
            audio_start=s.get('audio_in_sec',0) if s.get('audio_asset_id') else s['in_frame']/24
            if audio:
                fail(audio_start+d<=duration(audio)+0.03,'Audio source too short; supply measured edit')
                args+=['-ss',str(audio_start),'-i',str(media[audio])]
            else: args+=['-f','lavfi','-i','anullsrc=r=48000:cl=stereo']
            piece=temp/f'{i:04d}.mkv'
            args+=['-map','0:v:0','-map','1:a:0','-vf','scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24,format=yuv420p','-t',str(d),'-c:v','libx264','-preset','ultrafast','-crf','23','-threads','2','-c:a','pcm_s16le','-ar','48000','-ac','2',str(piece)]
            run(args);pieces.append(piece)
        listing=temp/'concat.txt';listing.write_text(''.join("file '"+str(p)+"'\n" for p in pieces))
        master=output/'master.mp4'
        run(['ffmpeg','-v','error','-nostdin','-y','-f','concat','-safe','0','-i',str(listing),'-c:v','copy','-c:a','aac','-b:a','128k','-t',str(total/24),'-movflags','+faststart',str(master)])
    info=probe(master);video=next(s for s in info['streams'] if s['codec_type']=='video')
    actual=float(info['format']['duration'])
    fail(int(video['nb_frames'])==total,'Encoded frame count mismatch')
    fail(abs(actual-total/24)<=1/24,'Encoded runtime mismatch')
    thumb=output/'thumbnail.jpg';t=plan['thumbnail'];a=next(a for a in plan['assets'] if a['asset_id']==t['asset_id'])
    args=['ffmpeg','-v','error','-nostdin','-y']
    if a['kind']=='video':args+=['-ss',str(t.get('at_sec',0))]
    run(args+['-i',str(media[t['asset_id']]),'-frames:v','1','-vf','scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2','-threads','1',str(thumb)])
    result={'job_id':plan['job_id'],'manifest_hash':plan['manifest_hash'],'environment':plan['environment'],'file':str(master),'sha256':sha(master),'actual_runtime_sec':actual,'video_frames':total,'thumbnail':{'file':str(thumb),'sha256':sha(thumb)},'metadata':plan.get('metadata')}
    (output/'render-result.json').write_text(json.dumps(result,indent=2)+'\n')
    return result

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('manifest');p.add_argument('--vault',required=True);p.add_argument('--output',required=True);a=p.parse_args()
    # Public entry verifies all timeline fields against the canonical JS digest.
    code="import{readFileSync}from'node:fs';import{hash}from'./studio.mjs';let p=JSON.parse(readFileSync(process.argv[1]));let h=p.manifest_hash;delete p.manifest_hash;if(hash(p)!==h)throw Error('MANIFEST_CHANGED');"
    run(['node','--input-type=module','-e',code,str(pathlib.Path(a.manifest).resolve())]) if pathlib.Path.cwd()==pathlib.Path(__file__).parent else subprocess.run(['node','--input-type=module','-e',code,str(pathlib.Path(a.manifest).resolve())],cwd=pathlib.Path(__file__).parent,check=True)
    print(json.dumps(render(json.load(open(a.manifest)),a.vault,a.output)))
