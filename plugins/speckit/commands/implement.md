---
description: Execute all tasks from task breakdown with progress tracking
---

# Implement Feature

## Overview

Execute the task breakdown systematically, showing progress and maintaining quality through TDD.

## User Requirements

Per user specification:
- Execute tasks **one by one** (not all at once)
- Show what has been done
- Show what's next/left
- Allow visibility into progress

## Execution Flow

### 1. Load Tasks

Find active feature:
- Load `.specify/specs/[feature]/tasks.md`
- Parse all tasks and their status
- Identify phases and dependencies

### 2. Display Progress Overview

Show complete task list with status:

```markdown
# Implementation Progress: [FEATURE NAME]

## Overall Status
- Total tasks: [N]
- Completed: [N] (✅)
- Current: [1] (🔄)
- Remaining: [N] (⏳)

## Phase 1: [Phase Name]
- ✅ Task 1 description
- ✅ Task 2 description
- 🔄 Task 3 description (CURRENT)
- ⏳ Task 4 description
- ⏳ Task 5 description

## Phase 2: [Phase Name]
- ⏳ Task 6 description
- ⏳ Task 7 description
...
```

### 3. Task-by-Task Execution

For each uncompleted task:

**Step 1: Announce Current Task**
```
🔄 Starting Task [N of M]: [Task description]

File: [file/path]
Phase: [Phase name]
Type: [Test/Implementation/Integration]
```

**Step 2: Execute Task**
- Read target file (if exists)
- Implement changes following TDD
- If test: Write failing test first
- If implementation: Make test pass
- Maintain code quality

**Step 3: Mark Complete**
```
✅ Completed Task [N of M]: [Task description]

Changes:
- Created/Modified: [file/path]
- Lines added/changed: [approx count]
```

**Step 4: Update tasks.md**
- Mark task as complete: `- [x] Task description`
- Update progress percentage

**Step 5: Show Updated Progress**
- Display current progress overview
- Highlight next task

**Step 6: Pause for Review** (Every 3-5 tasks OR end of phase)
```
📊 Progress Check

Completed in this session:
- ✅ Task X
- ✅ Task Y
- ✅ Task Z

Next up:
- ⏳ Task A (Phase N)

Would you like to:
A) Continue with next task
B) Review changes before continuing
C) Pause implementation
D) Run tests now

Your choice:
```

### 4. Phase Completion Validation

When a phase completes:

**Step 1: Run Phase Validation**
```
🎯 Phase [N] Complete: [Phase name]

Validation:
1. All tasks in phase completed
2. Running phase tests...
```

**Step 2: Execute Tests**
- Run relevant test commands
- Show test results
- Report pass/fail

**Step 3: Phase Summary**
```
✅ Phase [N] Validated Successfully

Completed:
- [N] tasks
- [N] files created/modified
- [N] tests passing

Ready for Phase [N+1]
```

If validation fails:
- Show failures
- Pause for fixes
- Re-run validation

### 5. Overall Progress Tracking

Maintain state throughout:
- Update `.specify/specs/[feature]/tasks.md` after each task
- Keep progress visible
- Show estimated remaining tasks

### 6. Final Summary

When all tasks complete:

```
🎉 Implementation Complete: [FEATURE NAME]

Summary:
- Total tasks completed: [N]
- Total files created/modified: [N]
- Total tests passing: [N]
- Time tracking: [if tracked]

Next steps:
1. Run full test suite
2. Manual validation
3. Code review
4. Run /speckit:analyze for quality check
```

## Guidelines

### TDD Enforcement

Every implementation task:
1. Write test first (Red)
2. Implement minimal code to pass (Green)
3. Refactor if needed (Refactor)

Never implement before tests exist.

### Progress Visibility

User should always know:
- Current task
- Completed tasks (with ✅)
- Remaining tasks (with ⏳)
- Current phase
- Overall percentage

### Error Handling

If task fails:
- Show error
- Explain issue
- Offer options:
  - Retry
  - Skip (mark as TODO)
  - Pause for manual fix
  - Abort

Don't continue blindly past errors.

### Parallel Tasks

If task marked `[P]`:
- Can be done in any order within phase
- Ask user which to do first
- Track separately

### Quality Gates

Before proceeding:
- Code compiles/lints
- Tests pass
- No obvious issues

## User Interaction

### Pause Points

Pause for user input:
- After each phase
- Every 3-5 tasks
- On errors
- On validation failures
- When user requests

### Continuation

When resuming:
- Show progress since last session
- Highlight next task
- Confirm ready to continue

## Error Handling

- If no tasks.md: ERROR "Run /speckit:tasks first"
- If all tasks complete: SUCCESS "Implementation already done"
- If tests fail: PAUSE "Fix tests before continuing"
- If file not found: CREATE "Creating new file"

## Next Steps

After implementation:
- Run `/speckit:analyze` for quality check
- Manual testing
- Create commit
- Prepare for PR
