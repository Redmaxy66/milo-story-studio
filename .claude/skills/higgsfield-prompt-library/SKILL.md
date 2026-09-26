---
name: higgsfield-prompt-library
description: Write, refine, or structure Higgsfield AI image and video prompts. Use when the user asks for Higgsfield, Seedance, Soul ID, Kling, Cinema Studio, motion graphics, storyboards, shot lists, I2V, T2V, product ads, UGC, camera moves, or a director / design-chief / acting brief for AI video.
---

# Higgsfield Prompt Library

Write paste-ready Higgsfield prompts. Do not dump theory. Do not invent celebrity likeness or trademarked packaging.

## Default header

```
Model: [Seedance 2.5 | Soul V2 | Kling 3.0 | Cinema Studio]
Aspect: [16:9 | 9:16 | 1:1 | 21:9]
Duration: [5-15s]
Style: [one grade only]
```

## MCSLA (every prompt)

- M — one model
- C — one named camera move
- S — observable subject (role + wardrobe; never boy/girl/kid/young)
- L — light + palette + grain
- A — verbs a camera can film

## Hard rules

1. Put shot count, duration, and aspect at the top.
2. One action per 4-6 seconds. Split extra action into a new clip.
3. One camera sentence. On POV / continuous shots, also name what the camera is NOT doing.
4. I2V describes only what changes. Do not re-describe the still.
5. Lock identity with Soul ID or a start-frame. Restate the lock on the last line.
6. Audio is explicit. `NO MUSIC` unless the user will keep in-model score.
7. No blood, no real brand marks, no on-screen text unless the user demands it and the model can set type.
8. If the user says "cinematic masterpiece", translate into lens + light + palette.

## Camera pocket book (use exactly one)

- Static — planted, zero drift
- Pan / Tilt — rotation only, position fixed
- Zoom in — optical only, tripod locked
- Dolly in/out — travel, focal length fixed
- Truck — lateral, height locked
- Crane up — vertical rise
- Orbit / Arc — constant radius
- FPV — wide, close; say smooth unless chaos is the brief
- Action Run — low behind a runner
- Focus change — rack A to B, body locked
- Dutch hold — after a motivated event, not the whole clip

## Category router

| User wants | Pattern |
|---|---|
| First meeting a locked face | Walk-in + Soul ID + Dolly In |
| Place / travel open | Extreme wide + Crane Up |
| Quiet emotion | Locked or tiny Dolly In, body events not mood words |
| Chase | Action Run, rain/practicals, NO logos |
| POV run | No cuts, no zoom, no orbit |
| Fight | One continuous take, choreography, no gore |
| Sci-fi | Physics + one VFX beat in `[VFX:]` |
| Horror | One practical light, one wrong detail |
| Product hero | Robo Arm or 360 void, no fake badges |
| UGC ad | 9:16, handheld, 0-2s hook then hold |
| Edit one thing on a good take | Seedance Edit Shot — name only the change |
| Extend a clip | Continuation — paste identity block verbatim |
| Motion graphics | Type / exploded product / glass UI / blueprint morph — graphics are the actor |
| Illustrated / kids-safe | Style tile on every clip + faceless or animal role; no age words |
| Multi-clip film | Run Director skill first, then Storyboard, then stills before video |

## I2V skeleton

```
Start from the attached image as frame one.
[Only the motion.]
Camera: [one move].
Look: [grade].
Audio: [diegetic]. NO MUSIC.
Identity lock: keep face, hair, wardrobe of the reference. No beautify.
```

## T2V skeleton

```
[Duration], [aspect], [shot count].
[Subject + wardrobe.]
[Place + time + weather.]
[Action sequence.]
Camera: [one move].
Look: [light + palette].
Audio: [list]. NO MUSIC.
Negative: [IP / blood / extra moves / burned-in text].
```

## Transformation skeleton (15s)

Number 5-6 shots. Calm → first sign → escalation → peak VFX → settle. Put VFX inline as `[VFX: ...]`.

## Director mode (when they ask for a reel, not one prompt)

Output:
1. Logline
2. Visual grammar (palette, lens, forbidden)
3. Identity method
4. Shot list table — #, duration, aspect, purpose, one camera, action, audio, start-frame?
5. Edit assembly note
6. Risk list

Ask at most three questions — locked face?, 16:9 or 9:16?, score in edit?

## Storyboard mode

Each beat:
- Slug INT/EXT · place · time
- What is in frame
- Size + angle
- One motion + duration
- Transition
- Start-frame recipe
- Negatives
Keep screen-left / screen-right consistent for two-handers.

## Design chief mode

Before spending motion credits:
1. Style tile (10-20 words, pasted on every clip)
2. Four-colour roles (key, fill, accent, forbidden)
3. Type policy
4. Three recurring materials
5. Which upload is STYLE vs IDENTITY vs VARIETY
6. Do-not board

One style tile per project.

## Acting mode

Replace mood adjectives with face and body events.
Max three beats per 8s: start state → change → end state.
Dialogue only as short quoted lines if lip-sync is on; else closed mouth.

## Style tiles (copy when relevant)

- Cinematic commercial — warm neutrals, soft window key, no beauty-filter skin
- Hard sci-fi — cold steel blue, crushed blacks, emergency amber, no cartoon
- VHS thriller — 4:3, scan lines, sickly green practicals
- Super 8 lyric — warm grain, soft vignette, lifted shadows
- Flat vector — bold outlines, solid fills, no gradients, non-photorealistic, not a photo
- Storybook gouache — visible brush, warm muted palette, illustrated, no live-action
- Monochrome silhouette — black on white void, high contrast, lots of negative space

## Prompt library (read before writing)

Worked, paste-ready prompts live in `references/prompt-library.md`: house rules, 13 genre categories (cinematic, action, sci-fi/VFX, horror, romance, comedy/social, product, fashion/beauty, motion graphics, performance, real estate/travel, food, illustrated/kids-safe), the camera pocket book, and full Director, Storyboard, Design chief and Acting briefs (Bonus A-D).

1. Open the "Quick routing" table at the end of the library to find the section.
2. Read only that section, not the whole file.
3. Adapt the closest library prompt (swap subject, product, place) before writing from scratch.
4. The rules in this SKILL.md win if a library prompt conflicts with them.

## Output contract

Unless the user asks for a full reel:
- Give the prompt in one fenced block ready to paste
- One line under it — why this camera / why this duration
- Offer the still-first variant if I2V would be safer

Never pad with "award-winning, 8K, masterpiece."
