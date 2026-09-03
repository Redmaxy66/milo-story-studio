# M8 Animation Production Manifest Specification

**Version:** 1.0
**Boundary:** renderer-neutral, offline preparation

Required top-level content follows: schema/envelope, lineage, authority, animation intent, continuity locks, assets, scenes, shots, audio plan, renderer adapters, quality checks, revision boundaries, assembly handoff, status. Each shot binds a stable upstream shot ID, duration seconds/frames, frame rate, contiguous in/out frames, motion choreography, performance, camera motion, environment/VFX, exact dialogue/audio cues, lip-sync requirement or fallback, dependencies, acceptance criteria, revision boundary, and handoff.

Missing assets are labelled missing. Requested technical timing is distinct from approved story timing. Provider/renderer adapters remain empty until separately authorised. A Phase 3 result may be specification-complete but cannot claim renderer readiness, approval, media existence, assembly eligibility, or lifecycle mutation.
