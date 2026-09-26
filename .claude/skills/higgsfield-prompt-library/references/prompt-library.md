# Higgsfield Prompt Library

**Curated working set — category → use case → description → paste-ready prompt**  
Compiled 26 Sep 2026. Original prompts written in the MCSLA / Seedance production grammar used across public Higgsfield skill packs. Not a dump of thousands of scraped lines.

**How to use**
1. Pick category, then use case.
2. Swap the subject, product, and location in square-bracket notes.
3. Keep one camera move per clip. Split extra moves into new generations.
4. For I2V: describe only what *changes*. Do not re-describe the still.
5. Lock identity with Soul ID or a reference image; never restyle the face in prose.

**Universal header (prepend when the UI does not already set it)**
```
Model: [Seedance 2.5 / Soul V2 / Kling 3.0 / Cinema Studio]
Aspect: [16:9 | 9:16 | 1:1 | 21:9]
Duration: [5–15s]
Style: [one grade only]
```

**MCSLA checklist**
- **M**odel — one engine
- **C**amera — one named move
- **S**ubject — observable body, wardrobe, age-as-role not “young/kid”
- **L**ook — light + palette + grain
- **A**ction — verbs the camera can film

---

# 0. House rules that actually change output

| Rule | Why |
|---|---|
| Shot count + duration + aspect at the top | Seedance treats this as the shot list, not decoration |
| One action per 4–6 seconds | Extra simultaneous actions smear |
| Name what the camera is *not* doing on POV / continuous shots | Stops random zooms |
| `NO MUSIC` or list SFX explicitly | Otherwise the model invents a score |
| Identity lock last line | Restate Soul ID / reference so the face does not drift |
| No trademarked brands, no real celebrity names, no blood unless you accept a reject | Higgsfield IP + safety filters |

---

# 1. Cinematic narrative

## 1.1 Establishing landscape
**Use when:** first shot of a place; world-building; travel open.  
**Model bias:** Soul / Cinema Studio still, then Seedance I2V.

```
16:9, 8s, one continuous shot.
Extreme wide of a coastal road cut into black volcanic cliffs at blue hour.
A single pair of headlights traces the switchback toward a lit harbour town far below.
Camera: slow Crane Up from road level to a high three-quarter reveal of the whole bay.
Look: cold cyan sea, warm tungsten town lights, light marine haze, anamorphic 2.35:1, no text.
Audio: wind over rock, distant surf, no music.
NO zoom, no orbit, no titles.
```

## 1.2 Character intro (walk-in)
**Use when:** first time we meet a locked character.  
**Needs:** Soul ID or start-frame.

```
9:16, 8s. Start from the attached still as frame one.
The same person as in the reference walks into a sunlit kitchen, linen shirt, sleeves rolled.
Opens the fridge, takes a glass bottle of water, turns a half-step toward camera with a small closed-mouth smile.
Camera: slow Dolly In from medium-wide to medium close-up. Eye level.
Look: warm morning window key, soft fill, shallow DOF.
Audio: fridge seal, bottle clink on tile, distant street.
Identity lock: keep the face, hair, and wardrobe of the reference exactly. No beautify.
```

## 1.3 Quiet drama beat
**Use when:** emotion without plot machinery.

```
16:9, 8s.
A man in his 40s in a grey sweater walks a hospital corridor. Fluorescent tubes buzz.
He stops at a door. Hand on the handle. He does not open it. Head drops. Long exhale.
Camera: slow Dolly In from behind, halt just over his shoulder.
Look: desaturated cool blue-white, crushed blacks, 16:9 cinematic.
Audio: distant intercom, his breath, no music.
```

## 1.4 Reunion / embrace
**Use when:** payoff shot; warm grain.

```
16:9, 8s, Super 8 feel.
Arrivals hall. A woman scans faces, a handwritten card in her hand. She sees someone. The card drops. She moves through the crowd.
Camera: slow Arc around the embrace; background crowds smear.
Look: warm grain, soft vignette, lifted shadows.
Audio: hall murmur pulled low, no score swell until the last second — actually: NO MUSIC.
```

## 1.5 Continuation (clip 2 of a pair)
**Use when:** extending a finished clip. Paste identity block verbatim.

```
Seedance Continuation. 21:9, 6s.
Continuing from the last frame of the prior clip — husband at the bedside, head bowed, hand on hers.
He lifts his head. Eyes fill but do not spill. Jaw tightens. Breath held.
Camera: locked-off medium close-up. No move.
Look: corridor blue through the door, one warm bedside lamp.
Audio: heart monitor, then silence under his breath. NO MUSIC.
Keep wardrobe, ring, stubble, lamp position identical.
```

---

# 2. Action and chase

## 2.1 Night-market sprint
**Use when:** urban pursuit, social or trailer.

```
16:9, 10s.
A woman in a charcoal track jacket sprints a rain-soaked night market, weaving between stalls.
Steam off food carts. Neon breaks in puddles. A steel shutter drops; she slides under it.
Camera: Action Run — low behind her, matching pace. One move only.
Look: cold blue shadows, amber stall light, high contrast.
Audio: sneakers on wet stone, shutter rattle, her breath. NO MUSIC.
NO blood, NO logos.
```

## 2.2 Underground car-park vault
**Use when:** reference-based character lock + physical stunt.

```
Seedance Reference-Based. 16:9, 8s.
[Attach character still.]
She sprints between parked cars, glances back, vaults a sedan hood, lands, keeps running toward the ramp at frame right.
Camera: low tracking shot, parallel right, losing and regaining her between pillars.
Look: sodium-vapor, exhaust haze, wet concrete patches.
Audio: ragged breath close to mic, sneaker slap, hood impact. Fluorescent ballast far back. NO MUSIC.
Do not redesign the face or jacket.
```

## 2.3 Rooftop grapple
**Use when:** two-person fight, weather as rhythm.

```
16:9, 10s. One continuous take.
Two figures grapple on a rain-slick rooftop. City grid below. Lightning strobes the exchange.
One is thrown, slides to the ledge, catches with both hands.
Camera: FPV circling just outside reach until the throw; then hold Dutch Angle on the hanging figure.
Look: desaturated blue-grey, anamorphic flare on lightning.
Audio: rain, boot scrape, impact. NO MUSIC.
Choreography only — no blades, no blood.
```

## 2.4 POV chase (what the camera must NOT do)
**Use when:** first-person running.

```
9:16, 8s. Single continuous POV.
Handheld head-height through a narrow wet alley. Natural bounce of running. Peripheral brick and pipes.
A figure ahead turns a corner and is gone.
Camera: no cuts, no zoom, no drone lift, no orbit. Only natural head movement.
Look: crushed night, one sodium spill at the exit.
Audio: breath in the mic, footfalls. NO MUSIC.
```

---

# 3. Sci-fi and VFX

## 3.1 Zero-g corridor
**Use when:** hard sci-fi, debris physics.

```
21:9, 10s.
A figure in a battered EVA suit, helmet clipped at the hip, drifts a darkened station corridor.
One glove trails the bulkhead. Toolkit on a tether. Emergency strobe every two seconds.
Camera: slow Dolly In matching her drift, centre-framed.
Look: cold dying-station blue, amber strobe, frost on seams, crushed blacks.
Audio: life-support fan drone, hull groan, strobe relay click, helmet breath. NO MUSIC.
```

## 3.2 Cyber street approach
**Use when:** world texture, not a fight.

```
16:9, 8s.
Rain megacity street. A figure in a long coat and slim visor walks toward camera through crowd.
Holographic stall signs flicker either side. Puddles hold the neon.
Camera: slow Dolly Out as they keep approaching and never quite arrive.
Look: magenta/cyan practicals, deep shadow, shallow DOF.
NO readable brand logos.
```

## 3.3 Transformation beat
**Use when:** Seedance transformation grammar — numbered shots, 15s.

```
15s, 16:9, six beats, escalation.
Shot 1 (0–2s): calm workshop, figure at a bench, overhead practical.
Shot 2 (2–4s): first tremor in the hands, tools rattle.
Shot 3 (4–7s): metal dust lifts off the bench and orbits the figure.
Shot 4 (7–10s): plates form along the forearms — [VFX: brushed steel growth, no gore].
Shot 5 (10–13s): visor seals. Stance widens.
Shot 6 (13–15s): aftermath stillness, steam off the new plates.
Camera: continuous cinematic, slight push.
Audio: bench hum → metal tick → seal hiss. NO MUSIC.
```

---

# 4. Horror and thriller

## 4.1 Wrong-room mirror
**Use when:** slow dread, VHS.

```
4:3, 8s, VHS.
A woman unlocks her apartment. Sets keys down. Turns toward the kitchen.
Camera: slow Dolly In to the hallway mirror.
The reflection shows the couch against the opposite wall. She has not moved. The room in the glass has.
Hold Dutch Angle on her face as she sees it.
Look: sickly green practicals, light scan lines, muted.
Audio: key drop, fridge, then the room tone thinning. NO MUSIC.
```

## 4.2 Basement beam
**Use when:** single practical light.

```
16:9, 8s.
A man at the top of basement stairs. Flashlight beam cuts down.
Camera: Tilt Down with the beam. At the bottom a rocking chair moves with no one in it.
Look: crushed blacks, one beam only.
Audio: wood rocker, house settle. NO MUSIC.
```

## 4.3 ECU object of dread
**Use when:** still → I2V of a prop.

```
Still, 3:4, Nano Banana / Soul.
Extreme close-up, slight Dutch, of a hand gripping an ornate silver key. Knuckles white.
Blurred floral wallpaper behind. Sickly yellow-green practical. 1970s thriller grain.
Then I2V 5s: the fingers tighten once. That is the only motion. Camera locked.
```

---

# 5. Romance and lyric

## 5.1 Rooftop dusk
```
16:9, 8s.
Two people on a terrace at dusk, empty cups, city below.
A pause. She looks at him. He tucks hair behind her ear.
Camera: slow Arc around both; city bokeh.
Look: golden hour, shallow DOF.
Audio: distant traffic, fabric. NO MUSIC.
```

## 5.2 Train letter
```
16:9, 8s, Super 8.
A woman in a train compartment reads a letter. Rain on the glass. Countryside smears.
A small smile at one line.
Camera: Focus Change from rain on glass to her face.
Look: warm grain, soft afternoon side-light.
```

---

# 6. Comedy and social

## 6.1 2-second hook then hold
**Use when:** Reels / TikTok open.

```
9:16, 8s.
0–2s HOOK: smash to a close-up of a kettle screaming; a hand slaps it off.
2–8s: same kitchen, the person turns to camera mid-sentence, deadpan, holding toast.
Camera: locked-off after the hook. No extra moves.
Look: bright daylight kitchen, slightly oversat food colours.
Audio: kettle, slap, then dry room. NO MUSIC.
On-screen text: none — add in edit.
```

## 6.2 Fail-and-recover product gag
```
9:16, 6s.
A jar lid will not open. Two attempts. Third try: it pops, contents stay in.
Camera: waist-up locked off, phone-in-kitchen energy.
Look: UGC, overhead kitchen LED, no grade slop.
Audio: lid strain, pop. NO MUSIC.
```

---

# 7. Product and commerce

## 7.1 Hero pour / ritual
**Use when:** CPG hero, morning ritual.

```
16:9, 5s.
Matte black insulated mug on raw concrete beside a window. No logo.
Camera: Robo Arm arc from base to lid.
Hot coffee pours. Steam in macro. A hand closes around the mug.
Look: warm neutrals, soft window key.
Audio: liquid pour, ceramic. NO MUSIC.
```

## 7.2 360 product void
**Use when:** drop / PDP spin.

```
1:1, 6s.
A single sneaker, white, minimal marks, suspended in a black void.
Backlit dust. Camera: 3D Rotation, full 360, even speed, then hold.
Look: pure black, sharp product, 4K.
NO extra props, NO floor shadow crawl.
```

## 7.3 Edit-shot label swap
**Use when:** keep a good take, change one SKU.

```
Seedance Edit Shot. 1:1, 6s.
From the existing mug clip: change only the background bag from kraft to matte black with a copper foil mark.
Keep steam, mug, wood, light direction, and camera move.
Audio unchanged. NO MUSIC.
```

## 7.4 UGC unboxing
```
9:16, 10s. Marketing Studio mode: ugc_unboxing if available.
Hands on a kitchen table open a plain mailer, lift a glass serum bottle, tilt it to the window.
Face optional — if present, Soul ID.
Camera: slightly handheld, phone height.
Look: real apartment daylight, no studio cyclorama.
Audio: paper, glass. Talk to camera one line: "This is the one I actually kept."
```

## 7.5 Marketplace card set (stills)
**Use when:** listing pack, not video.

```
1:1 stills, white or lifestyle, one product.
Card 1: dead-front on seamless.
Card 2: 45-degree three-quarter.
Card 3: in-hand scale.
Card 4: detail of texture / cap.
Card 5: lifestyle on the intended surface.
Same colour temperature across all five. No badge text in-camera.
```

---

# 8. Fashion and beauty

## 8.1 Editorial walk
```
3:4 or 16:9, 8s.
A model in a sand-coloured tailored suit walks a raw concrete gallery.
Coat moves one beat behind the stride.
Camera: lateral Truck at walking pace, waist-up, then settle.
Look: hard side key, filmic skin, no beauty filter melt.
Audio: heel on concrete. NO MUSIC.
```

## 8.2 Beauty macro
```
1:1, 5s.
Macro of a dropper releasing one drop onto the back of a hand.
Camera: locked, then 2cm push.
Look: clean daylight, specular highlight on the droplet only.
```

## 8.3 Lookbook sequence
```
9:16, 12s, four outfits, same Soul ID.
0–3 look A against brick.
3–6 look B against the same brick, same mark on the wall.
6–9 look C.
9–12 look D, hold.
Camera: each block a simple push-in. Same lens height.
Keep face lock. Change only wardrobe and one prop.
```

---

# 9. Motion graphics and design-led film

## 9.1 Kinetic type launch
**Use when:** announcement, no presenter.

```
16:9, 8s.
Black field. A single word assembled from brushed-steel letters that slide in on rails and lock with a physical clack.
A thin orange underline draws left to right.
Camera: locked. All motion is the type.
Look: dark studio, one overhead strip, no photoreal city behind the type.
Audio: rail slide, clack. NO MUSIC.
On-model text only if the model is reliable with type; otherwise generate plates and composite.
```

## 9.2 Exploded product
```
16:9, 8s.
A pair of wireless earbuds levitates. Housing, battery, driver separate on Z-depth, hover, reassemble.
Camera: slow Orb around 30 degrees.
Look: pale grey void, soft studio, contact shadows under each part.
```

## 9.3 Glass UI
```
16:9, 8s.
A frosted-glass phone interface floats over a dark desk. Cards shuffle forward.
Fingers do not appear. UI is the actor.
Camera: slow Push In.
Look: refractive glass, subtle caustics, no OS trademarks.
```

## 9.4 Blueprint to building
```
16:9, 10s.
White line blueprint of a two-storey house on navy. Lines extrude into timber and plaster, then settle as a dusk exterior with one warm window.
Camera: Crane Up through the extrusion.
Look: start schematic, end photoreal dusk, one continuous morph. [VFX: no construction workers]
```

## 9.5 Flat vector explainer
```
16:9, 10s per block.
STYLE: flat 2D vector, bold outlines, solid fills, no gradients, no photoreal.
Scene: a parcel icon hops from a warehouse block to a van block to a door block.
Motion: hard cuts between three boards, each a 2-second hold plus a slide.
NEGATIVE: photorealism, 3D render, live-action, logos, captions burned in.
```

---

# 10. Music, dance, performance

## 10.1 Rehearsal room
```
16:9, 8s.
A dancer in rehearsal blacks hits a floor phrase in a raw studio. Wall of mirrors.
Camera: lateral track, then halt on the last pose.
Look: tungsten practicals, scuffed floor.
Audio: bare feet, breath. NO MUSIC unless you will replace it in edit — then NO MUSIC.
```

## 10.2 Stage wash
```
16:9, 8s.
Performer centre stage, single cold backlight, haze.
Camera: slow Push from wide to waist.
Look: crushed house, one rim.
Do not invent a crowd if you need an empty house — say empty house.
```

---

# 11. Real estate and travel

## 11.1 Property walk-through
```
16:9, 12s.
Continuous walk from foyer through living room to terrace doors that open onto a sea view.
Camera: eye-level Steadicam, no snap-zoom, no drone until the terrace — actually: no drone at all in this clip.
Look: late-afternoon interiors, warm wood, clean but lived-in, no staging clutter explosion.
Audio: footsteps, door latch, distant surf.
```

## 11.2 Drone approach (separate clip)
```
16:9, 8s.
Aerial approach along a coastline to a detached house on a headland.
Camera: one descending approach. No orbit stacked on the descent.
Look: golden hour, long shadows.
```

---

# 12. Food

## 12.1 Steam and break
```
16:9, 6s.
A crusted loaf on a board. Hands tear it. Steam.
Camera: 45-degree locked, then 3cm push on the tear.
Look: warm key from window left, dark rustic table.
Audio: crust crack. NO MUSIC.
```

## 12.2 Plating
```
1:1, 8s.
Chef’s hands plate a single seared piece and a green oil line.
Camera: overhead locked.
Look: dark ceramic, specular on oil only.
```

---

# 13. Animation and illustrated (kids-safe / faceless)

Age-blind: describe role and clothing, never “child/kid/young.”

## 13.1 Storybook still + drift
```
STYLE key (paste every clip): hand-painted storybook gouache, soft textures, warm muted palette, visible brush, non-photorealistic, illustrated, not a photo, no live-action.
Still: a small fox in a blue scarf on a hill of long grass under a paper moon. No text.
I2V 8s: grass drifts, scarf lifts, fox’s ears tick once. Slow push-in.
AUDIO: wind in grass only. NO voice.
NEGATIVE: photorealism, 3D render, lip-sync, captions, logos.
```

## 13.2 Faceless explainer silhouette
```
STYLE: strict monochrome minimalism, black silhouettes on white void, high contrast, lots of negative space, illustrated, not a photo.
Block: a lone silhouette dissolves at the edges into drifting sand.
Motion: very slow push-in.
AUDIO: low air. NO voice, NO captions.
```

---

# 14. Camera move pocket book

Use these as the *only* camera sentence.

| Move | Prompt fragment |
|---|---|
| Static | Camera planted. Zero drift, zero breathe, zero stabilize float. |
| Pan right | Pure pan from fixed point, no truck, no dolly. Settle and hold. |
| Tilt up | Pure tilt, position never changes. Decelerate into a hold. |
| Zoom in | Optical only. Tripod locked. One even zoom. No dolly. |
| Dolly in | Camera travels forward. Focal length fixed. |
| Truck left/right | Lateral travel, height locked. |
| Crane up | Vertical rise with a small push over the subject. |
| Orbit / Arc | Circle the subject at constant radius and height. |
| FPV | Wide, close, chaotic only if the brief is chaotic; else “smooth FPV.” |
| Action Run | Low behind a runner, matched pace. |
| Focus change | Rack from plane A to plane B. Body locked. |
| Dutch hold | Locked Dutch after a motivated event, not the whole clip. |

Do not stack four of these in one prompt.

---

# Bonus A — Director skill (how to brief a reel)

Use this as a system prompt for an agent, or as your own pre-flight.

```
ROLE: Director of Photography + editor-in-chief for Higgsfield.
GOAL: Turn a one-sentence brief into a 4–8 clip shot list the models can actually shoot.

OUTPUT FORMAT
1. Logline (one sentence)
2. Visual grammar (palette, lens family, grain, what is forbidden)
3. Character lock method (Soul ID / still / none)
4. Shot list table: # | duration | aspect | purpose | camera (one) | action | audio | start-frame needed?
5. Assembly note (order, J-cuts, what is done in edit not in-model)
6. Risk list (IP words, blood, readable type, multi-action overload)

RULES
- Prefer fewer, cleaner clips over one overloaded 15s.
- One camera sentence per clip.
- Write I2V clips as change-lists.
- Never invent celebrity likeness or branded packaging.
- If the user wants “cinematic masterpiece,” translate that into light + lens + palette.
- Ask at most three questions, and only if a missing fact would waste a credit.
```

**Director questions (max three)**  
1. Locked face or anonymous figure?  
2. 16:9 film or 9:16 social?  
3. Score later in edit, or silence in-model?

---

# Bonus B — Storyboard skill

```
ROLE: Storyboard artist for AI video.
INPUT: logline + director grammar.
OUTPUT for each beat:
- Slug: INT/EXT · place · time
- Frame description (what is in frame, not the novel)
- Shot size + angle
- Motion (one)
- Duration
- Transition to next (cut / hold / match-on-action / continue)
- Start-frame recipe (generate still first? reuse last frame?)
- Negative (what must not appear)

Draw the board as a numbered list, not a comic novel.
Keep characters age-blind and IP-clean.
If two characters share a frame, specify screen-left / screen-right and keep it for the next beat.
```

**Storyboard beat template**
```
Beat 03 — EXT harbour dock — night — 6s — 16:9
Frame: detective, coat collar up, briefcase at his feet, papers starting to lift.
Size/angle: medium-wide, eye level, 3/4 profile.
Motion: slow Dolly In.
Audio: rain, paper flutter.
Start-frame: generate Soul still of this pose first.
Out: last frame becomes Continuation in for Beat 04.
Negative: no gun, no logo on the case, no extra extras.
```

---

# Bonus C — Design chief / art director skill

```
ROLE: Design chief.
JOB: Lock a visual system before any motion spend.

DELIVERABLES
1. Style tile paragraph (10–20 words the model will see on every clip)
2. Palette: 4 hex + what each is for (key, fill, accent, forbidden)
3. Type policy: in-model type allowed? If no, “NO on-screen text”
4. Material board: three surfaces that must recur (e.g. raw concrete, brushed steel, linen)
5. Reference roles: which upload is STYLE, which is IDENTITY, which is VARIETY
6. Do-not board: photoreal skin on an illustrated show, extra fingers, trademark shapes

STYLE TILE EXAMPLES
- “flat 2D vector, bold clean outlines, solid vibrant flat fills, no shading, no gradients, non-photorealistic”
- “hand-inked black marker on off-white paper, solid jet-black fills, thin white scratch highlights, strictly monochrome”
- “cinematic commercial, warm neutrals, soft window key, no beauty-filter skin”

RULE
One style tile per project. Do not restyle mid-reel unless the story is a morph.
```

---

# Bonus D — Acting / performance skill

```
ROLE: Acting coach for the prompt.
Replace mood adjectives with face and body events.

BAD: she looks sad and cinematic
GOOD: she holds the breath, eyes fill, jaw sets, look stays on the door handle

Write three beats max per 8 seconds:
1. Start state (posture, gaze)
2. Change (what moves)
3. End state (where the face lands)

Dialogue: short clauses in quotes if the model supports lip-sync; otherwise say closed mouth.
```

---

# Bonus E — Suggested public skills to install

These are the repos this library is aligned with (install in Claude Code / Cursor if you want agents to write the prompts for you):

| Skill / repo | Role |
|---|---|
| `higgsfield-ai/skills` | Official generate, Soul ID, Marketing Studio, product shoot |
| `OSideMedia/higgsfield-ai-prompt-skill` | MCSLA, Seedance 2.5 omni-ref, templates, character sheets |
| `cfongai/higgsfield-content-pipeline` | 15 Seedance use-case skills + shipped still/video pairs |
| `AIcentury/claude-higgsfield-skill` | Character sheets, storyboards, thumbnails |
| `cth9191/motion-design` | Motion-design looks (glass UI, kinetic type, exploded product) |
| `LumenoteApp/shot-desk` | Local assembler for Seedance / acting blocks |
| Higgsfield Academy Prompt Bank | Official named camera moves |

---

# Quick routing

| I need… | Start at |
|---|---|
| First frame of a person | 1.2 + Soul ID |
| Trailer energy | 2.1 or 2.3 |
| Product PDP | 7.2 then 7.1 |
| UGC ad | 7.4 or 6.1 |
| Brand motion piece | 9.x |
| Kids / illustrated | 13.x + Design chief tile |
| Multi-clip film | Bonus A then B, then shoot stills before video |
| Extend a good take | 1.5 Continuation or 7.3 Edit Shot |

---

*Library owner note: keep this file as the working set. Add a prompt only after it has shipped once. Version suffixes belong on the clip name, not in the category.*
