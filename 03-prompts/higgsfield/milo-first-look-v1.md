# Milo First Look — v1

**Status:** Approved by Alex on 2026-09-26 as an exploratory test clip
**Scope:** Exploratory Higgsfield test only. Non-canon and not a governed production
reference. It does not replace or override the checksum-bound references in
D-018 to D-023, and it grants no pilot, production or publishing authority.
**Assumed style:** Storybook gouache. `VISUAL_REFERENCE.md` still lists visual
style as an open decision.

## Why this worked

- The still was made first. A still is cheap to redo, so identity was approved before any video credits were spent.
- The video started from the approved still (start image), so Milo's identity came from the image, not from the text.
- Only one camera move, and one short action chain in 6 seconds.

## Step 1 — Still (text to image)

| Setting | Value |
|---|---|
| Model | Recraft V4.1 (`recraft_v4_1`), `model_type: standard` |
| Aspect | 16:9 (1344×768) |
| Variants | 2 (approved: variant 2) |
| Cost | 1.25 credits per image |
| Approved job ID | `e08724ea-20b5-4637-9195-fe54c134d9f8` |

```
Hand-painted storybook gouache illustration, visible brush strokes, warm muted palette, soft paper texture, non-photorealistic, illustrated, not a photo, no live-action.

A small friendly forest creature named Milo stands on a mossy path in Moonberry Wood at golden hour, facing three-quarters toward the viewer. Soft, shaggy turquoise fur. Huge round ears with cream inner panels. Warm amber eyes. Small pink nose. Broad cream muzzle. A softly glowing golden star on a cream belly. Wears a mustard-yellow explorer backpack with straps over both shoulders, a rolled paper map poking out of the top.

Behind Milo: tiny cottages with round doors, glowing flowers lining the path edges, one small hidden door set into a tree trunk. Cozy, safe, playful, full of wonder.

Light: low warm key light from screen-left, soft fill, gentle gouache grain.

No text, no captions, no logos, no photorealism, no 3D render, no sharp teeth, no dark or scary shadows, no extra limbs.
```

## Step 2 — Video (image to video)

| Setting | Value |
|---|---|
| Model | Seedance 2.5 (`seedance_2_5`), `mode: omni_reference` |
| Media | Approved still as `start_image` |
| Aspect / duration / resolution | 16:9 / 6s / 720p |
| Audio | `generate_audio: true` |
| Preset | Declined the suggested "3D RENDER" preset (it conflicts with the style) |
| Cost | 42 credits |
| Approved job ID | `b12124bf-4d80-43e0-84d1-450986c4860a` |

```
Start from the attached image as frame one. Hand-painted storybook gouache style, visible brush, warm muted palette, illustrated, non-photorealistic, not a photo, no live-action.

Milo's huge round ears lift once, the golden star on the belly pulses slightly brighter, then Milo takes two small steps along the mossy path toward the hidden door in the tree trunk.

Camera: slow dolly in, camera travels forward, focal length fixed. No pan, no orbit, no zoom, no cuts.

Audio: soft wind in leaves, two light footsteps on moss. NO MUSIC. NO voice. No dialogue.

Negative: photorealism, 3D render, lip-sync, talking, captions, text, logos, new characters, extra limbs.

Identity lock: keep the turquoise shaggy fur, cream inner ear panels, warm amber eyes, small pink nose, broad cream muzzle, glowing golden belly star, and mustard-yellow explorer backpack exactly as in the reference image. No beautify, no redesign.
```

## Run record

| Item | Result |
|---|---|
| Still run | 2 variants, both completed |
| First video run | Failed with no reason given; credits refunded automatically |
| Retry | One identical retry, completed |
| Total spent | 44.5 credits |
| Review | Alex reviewed the still and the clip by eye. Claude could not view them because the container's network blocks the media host. |

## Reuse notes

- **Next clip:** use this clip's last frame as the next clip's `start_image`, and paste the identity lock line unchanged.
- **Swap only:** the action line and the camera line. Keep the style line and the negatives.
- **Watch for:** identity drift in the final frame, and music added by Seedance's generated audio.
