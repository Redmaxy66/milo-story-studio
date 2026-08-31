# Test Plan

Every workflow should be tested for:

- correct input
- missing required input
- malformed input
- duplicate input
- external service failure
- invalid AI output
- safe human review
- idempotent approval repair after a partial prior write
- correct final status
- immutable runtime canon retrieval from the Story's stored `canonRef`
- deterministic blank/malformed canon-lineage rejection before GitHub retrieval
- deterministic downstream/Story canon-lineage mismatch rejection
- Continuity Review canonVersion/canonRef persistence
