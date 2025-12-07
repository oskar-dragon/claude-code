---
description: Generate executable task breakdown from implementation plan
---

# Generate Task Breakdown

## Overview

Transform the implementation plan into a detailed, ordered task list ready for execution.

## Execution Flow

### 1. Locate Plan

Find active feature:
- Load `.specify/specs/[feature]/plan.md`
- Load `.specify/specs/[feature]/data-model.md` (if exists)
- Load `.specify/specs/[feature]/contracts/` (if exists)
- Output to: `.specify/specs/[feature]/tasks.md`

### 2. Load Tasks Template

Read `.specify/templates/tasks-template.md` for structure.

### 3. Extract Implementation Phases

From plan.md, identify:
- Phase 0: Setup/scaffolding
- Phase 1-N: Feature increments
- Dependencies between phases

### 4. Generate Tasks per Phase

For each phase, create tasks following TDD workflow:

**Pattern**:
1. Contract tests (define behavior)
2. Implementation (make tests pass)
3. Integration tests (realistic environment)
4. Unit tests (if needed for complex logic)

**Task structure**:
```
- [ ] [P] Task description (file: path/to/file.ext)
```

Where:
- `[ ]` = Checkbox for tracking
- `[P]` = Parallelizable (can run concurrently with other [P] tasks)
- File path = Where implementation happens

### 5. Dependency Ordering

Order tasks to respect dependencies:
- Models before services
- Services before endpoints
- Contracts before implementation
- Tests before code

Mark independent tasks with `[P]` for parallel execution.

### 6. Organize by User Story

Group tasks under user stories from spec:
```markdown
## Phase 1: [User Story 1 Title]

**Goal**: [What this phase delivers]

**Prerequisites**: [What must be done first]

**Tasks**:
- [ ] Create data models for X (file: src/models/x.ts)
- [ ] [P] Write contract tests for Y (file: tests/contracts/y.test.ts)
- [ ] [P] Write contract tests for Z (file: tests/contracts/z.test.ts)
- [ ] Implement Y service (file: src/services/y.ts)
- [ ] Implement Z service (file: src/services/z.ts)
- [ ] Write integration tests (file: tests/integration/feature.test.ts)

**Validation**: [How to verify this phase works]

---

[Repeat for each phase]
```

### 7. Add Checkpoint Validations

After each phase, include validation step:
- Manual testing scenarios
- Automated test commands
- Expected outcomes
- Success criteria from spec

### 8. Include File Paths

Every task must specify exact file path:
- Implementation files
- Test files
- Configuration files
- Documentation updates

### 9. Output Summary

Report:
- Total phases: [N]
- Total tasks: [N]
- Parallelizable tasks: [N]
- Estimated complexity: [Low/Medium/High]
- Ready for `/speckit:implement`

## Task Breakdown Guidelines

### Granularity

Good task size:
- Completable in one focused session
- Independently testable
- Clear success criteria

Too large:
- "Implement entire feature"
- "Build all services"

Too small:
- "Add semicolon"
- "Import library"

### Test-First Ordering

**Always**:
1. Write tests (red phase)
2. Implement code (green phase)
3. Refactor (cleanup)

**Never**:
- Implementation before tests
- Tests as afterthought

### Parallelization Markers

Mark `[P]` when tasks:
- Don't depend on each other
- Work on different files
- Can run simultaneously

Don't mark `[P]` when:
- Task depends on another
- Touches same files
- Sequential by nature

## Error Handling

- If no plan found: ERROR "Run /speckit:plan first"
- If plan incomplete: WARN "Plan may be missing details"
- If tasks can't be parallelized: OK, mark all sequential

## Next Steps

After task generation:
- Review task breakdown
- Adjust priorities if needed
- Run `/speckit:implement` to execute
