# Error Log

| Date | Workflow | Error | Cause | Fix | Lesson |
|---|---|---|---|---|---|
| 2026-09-01 | Milo Outline Generator v0.1 | Controlled `CANON_LINEAGE_INVALID` for historical `MILO-004` while governed `MILO-007` was ready | `Read Eligible Stories` used `status=CONCEPT_APPROVED` with first-match enabled, allowing an earlier PRE-CANON LEGACY row to starve a legitimate governed Story | Read and deterministically classify the complete candidate set, exclude PRE-CANON LEGACY rows, select one governed Story, and route malformed candidates through existing integrity handling | Lifecycle status alone is insufficient for downstream automatic selection when historical pre-canon rows share the same status |
