# M8 Provider-Neutral Prompt Bundle Specification

**Version:** 1.0

Stable bundle IDs are `<packageId>-PB-V###`; prompt IDs are `<bundleId>-PR###`. Every prompt binds exact source artifact IDs/hashes, scene/shot IDs, positive requirements, negative constraints, reference roles, continuity locks, allowed/prohibited changes, canonical capability, requested output purpose, requested settings, observed settings, and acceptance criteria.

Requested and observed settings are separate; observed settings remain null before execution. Provider projection may name a versioned adapter but provider, model, workspace ID, project ID, endpoint, credential and token remain null. Repository presence or human intent approval never authorises a provider call.
