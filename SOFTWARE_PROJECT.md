# SOFTWARE_PROJECT.md
## GPT Work Software Project Operating Overlay
**Version:** 1.0  
**Status:** Active Project-Type Overlay  
**Parent Framework:** `AGENTS.md`

---

## 1. Purpose

This file extends `AGENTS.md` for software, automation, integration and technical implementation projects.

It governs work involving source code, repositories, APIs, workflow automation, infrastructure configuration, databases, schemas, deployment, testing, integration platforms, cloud applications, CI/CD, technical documentation, migrations and production cutovers.

The parent `AGENTS.md` remains binding.

---

## 2. Software Operating Principle

> **INSPECT → UNDERSTAND → PLAN → CHANGE → TEST → VERIFY → RECORD → REPORT**

Do not modify a technical system before understanding its current state, relevant dependencies, target state, environment and rollback implications.

---

## 3. Repository Discipline

Where a repository exists, treat it as the primary technical source of truth for code, configuration, schemas, workflow exports, tests and technical documentation.

Before substantive changes:

1. identify the correct repository
2. confirm the current branch
3. inspect repository status
4. identify uncommitted or untracked work
5. understand relevant project structure
6. locate applicable specifications and tests

Do not assume a clean working tree.

Do not overwrite or incorporate unrelated user changes.

---

## 4. Existing Work Must Be Preserved

Unless explicitly authorised:

- do not discard existing changes
- do not reset the repository
- do not overwrite unrelated local work
- do not delete untracked files
- do not clean the working tree
- do not force-checkout over user changes

Unexpected existing work is project state, not clutter.

---

## 5. Specifications Win

Typical priority:

1. explicit current work order
2. active architecture or technical decision
3. approved specification
4. tests encoding approved behaviour
5. current implementation
6. inferred intent

Do not preserve incorrect implementation merely because it already exists.

Do not alter a specification merely to make existing code pass.

---

## 6. Architecture and Minimal Change

Respect established service boundaries, module boundaries, interfaces, API contracts, database ownership, workflow responsibilities, environment separation and canonical data models.

Prefer the smallest coherent implementation that satisfies the requirement.

Avoid speculative abstractions, broad refactors, unrelated dependency upgrades, unnecessary renaming and formatting churn.

---

## 7. Environment Awareness

Always identify which environment is being inspected or changed:

- local
- development
- test
- staging
- UAT
- production

Do not infer environment from naming alone when direct verification is possible.

Production and non-production are separate states.

---

## 8. Production Protection

Before production mutation:

- confirm target identity
- confirm environment
- inspect current state
- confirm required dependencies
- confirm relevant credentials resolve
- confirm rollback path where practical
- confirm no unexpected active execution conflicts
- understand user/data impact

Make only the authorised production change.

---

## 9. Credentials and Secrets

Never expose or copy secrets unnecessarily.

Prefer credential references, secret stores and environment variables.

Do not commit secrets.

If a secret is discovered in tracked code or output, report the issue without unnecessarily reproducing it.

---

## 10. Configuration and Stable References

Treat configuration as executable project state.

After configuration changes, re-read saved values and verify references, warnings and environment-specific overrides.

Treat identifiers as potentially significant. Do not replace workflow IDs, database IDs, deployment IDs, document IDs or integration IDs merely for cleanliness.

Where identity migration is required:

- record old identity
- record new identity
- preserve rollback mapping
- verify downstream references
- verify human-readable names after the change

---

## 11. API and Schema Discipline

Preserve API and schema compatibility unless breaking change is authorised.

Before schema changes, inspect downstream consumers, defaults, nullable behaviour, indexes, constraints, migration requirements and historical records.

Prefer additive and backward-compatible changes where feasible.

Do not delete or repurpose existing fields without explicit authority.

---

## 12. Persistent Data Protection

Never:

- bulk delete production data without explicit authority
- truncate data for convenience
- run test mutations against production unintentionally
- modify unrelated rows during targeted remediation

For data mutations:

1. identify target records
2. validate selection criteria
3. perform the minimum mutation
4. re-query affected records
5. verify unaffected state where material

---

## 13. Automation and Workflow Systems

For workflow platforms:

- inspect the complete workflow before modifying critical paths
- understand upstream/downstream dependencies
- verify triggers
- verify credentials
- verify target systems
- verify error handling
- verify activation/publish state
- distinguish saved state from active state

Do not activate or publish unless explicitly authorised.

Do not execute live data paths merely to verify configuration unless live execution is authorised.

---

## 14. Workflow Replacement and Migration

Prefer controlled migration over destructive replacement when risk warrants it.

Where practical:

1. preserve existing production implementation
2. prepare replacement independently
3. validate replacement
4. resolve dependencies and credentials
5. perform controlled cutover
6. verify identity and configuration
7. retain a rollback path
8. retire old implementation only when authorised

Replacement and retirement are separate actions.

---

## 15. Deployment Order

For dependency chains, determine whether deployment order matters.

Where upstream components depend on downstream services or workflows, prefer:

> **DOWNSTREAM → UPSTREAM**

unless architecture requires another sequence.

Verify each component before proceeding.

---

## 16. Error Handling and Idempotency

Production-grade systems should fail observably.

Where relevant, provide:

- meaningful error categories
- diagnostic context
- consistent failure payloads
- correlation or execution IDs
- appropriate retry behaviour
- duplicate protection
- distinction between handled and unhandled failure

Assess idempotency for retriable or repeatable operations.

---

## 17. Testing Strategy

Testing should match the risk and scope of the change.

Possible layers:

- static checks
- linting
- type checks
- unit tests
- integration tests
- workflow validation
- contract tests
- regression tests
- end-to-end tests
- controlled live tests

Run the smallest test set that provides sufficient confidence, expanding when risk or failures justify it.

Do not modify failing tests simply to make a change appear successful.

---

## 18. Controlled Live Testing

A live test is a production mutation and requires appropriate authority.

Before live execution:

- define the exact test case
- identify expected side effects
- confirm test record identity
- understand downstream consequences
- define cleanup if necessary

After execution:

- inspect the full result
- verify expected records
- verify duplicates/unexpected records were not created
- verify downstream state
- clean up authorised test artifacts
- re-check final state

---

## 19. Failure Testing

Where reliability matters, test both happy and failure paths.

Verify that failures:

- classify correctly
- log correctly
- do not cause prohibited mutation
- do not create duplicates
- recover correctly where applicable

---

## 20. Deployment Discipline

Before deployment, verify as applicable:

- code complete
- tests pass
- configuration resolves
- credentials resolve
- schemas match
- dependencies exist
- target environment is correct
- no temporary pins/mocks/test values remain
- activation state is correct
- rollback remains available

After deployment, independently inspect deployed state and required dependent paths.

Deployment completion requires post-deployment verification.

---

## 21. Rollback and Hotfixes

Understand rollback before consequential deployment.

Possible mechanisms include prior versions, previous workflows, reversible configuration, feature flags, repository revert or database rollback.

For hotfixes:

- minimise scope
- preserve evidence
- avoid unrelated refactoring
- test at the safest available level
- verify production immediately afterward
- record what changed

---

## 22. Code Quality and Documentation

Optimise for correctness, readability, maintainability, predictable behaviour and consistency.

Prefer clear code over clever code.

Update technical documentation when changes materially alter setup, configuration, interfaces, architecture, deployment, operational procedures or user-visible behaviour.

Documentation must describe actual resulting state.

---

## 23. Version Control

Where commits are authorised:

- inspect the diff
- include only intended changes
- avoid formatting noise
- use meaningful commit messages
- preserve project conventions

Before pushing:

- confirm branch
- confirm intended commits
- confirm required checks passed

Never force-push or rewrite shared history without explicit authority.

---

## 24. Security and Observability

Consider authentication, authorization, secret handling, input validation, injection risk, data exposure, privilege boundaries and logging of sensitive information.

Operationally important systems should make it possible to answer:

- what happened?
- when?
- where?
- to which record/request?
- why did it fail?
- was retry attempted?
- what state resulted?

---

## 25. Canonical Artifacts

Canonical technical artifacts must not be silently recreated, moved, retagged or overwritten.

If a canonical artifact has both a human-readable version and an immutable reference, preserve both.

---

## 26. Remediation

Out-of-scope defects should be recorded in the project's remediation mechanism rather than silently fixed.

Specifications and active priorities determine remediation order.

---

## 27. Software Completion Contract

A software work package may only be reported `COMPLETE` when all applicable conditions pass:

- [ ] correct target/repository/environment confirmed
- [ ] required implementation completed
- [ ] unrelated user work preserved
- [ ] specification requirements satisfied
- [ ] required configuration resolved
- [ ] required credentials resolve
- [ ] required tests pass
- [ ] failure paths checked where required
- [ ] resulting state independently verified
- [ ] no prohibited production execution occurred
- [ ] protected invariants remain intact
- [ ] no unexpected material warnings remain
- [ ] deployment state matches authority granted
- [ ] rollback state remains understood
- [ ] required documentation/state records updated
- [ ] material decisions recorded where applicable

---

## 28. Software Final Report

Report:

### Status
`COMPLETE`, `COMPLETE WITH NOTES`, `PARTIAL`, `BLOCKED`, or `FAILED VALIDATION`

### Implementation
What changed.

### Validation
Tests and verification performed.

### Environment
Which environments were touched.

### Production
Whether production state changed.

### Preserved
Important existing state confirmed unchanged.

### Evidence
Key IDs, versions, commits or results where useful.

### Exceptions
Warnings, unresolved defects or deviations.

### Next
Logical next authorised work package.

---

## 29. Software Working Philosophy

**Repository state is evidence.**

**Production is not a test environment.**

**Saved is not necessarily active.**

**Deployment is not verification.**

**Working systems deserve protection.**

**Migrations should preserve an escape route.**

**Failure paths are part of the product.**

**IDs, schemas and interfaces are contracts until proven otherwise.**

**Small verified changes beat large elegant guesses.**

---

**End of Software Project Operating Overlay v1.0**
