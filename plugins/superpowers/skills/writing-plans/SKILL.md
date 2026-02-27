---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## CRITICAL CONSTRAINTS — Read Before Anything Else

**You MUST NOT call `ExitPlanMode` at any point during this skill.** This skill manages its own completion flow via `AskUserQuestion`. Calling `ExitPlanMode` breaks the workflow and skips the user's execution choice. If you feel the urge to call `ExitPlanMode`, STOP — that means you should be at the Execution Handoff section below.

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Context:** This should be run in a dedicated worktree (created by brainstorming skill).

**Save plans to:** `docs/plans/<feature-name>/plan.md` (or `plan.local.md` if non-committable)

## REQUIRED FIRST STEP: Initialize Task Tracking

**BEFORE exploring code or writing the plan, you MUST:**

1. Call `TaskList` to check for existing tasks from brainstorming
2. If tasks exist: you will enhance them with implementation details as you write the plan
3. If no tasks: you will create them with `TaskCreate` as you write each plan task

**Do not proceed to exploration until TaskList has been called.**

```
TaskList
```

## Committable Mode

**Read the `**Committable:**` field from the design doc header.** This was set during brainstorming.

- If `true` (or absent for backward compatibility): use `.md` extensions, commit planning docs
- If `false`: use `.local.md` / `.local.json` extensions, skip git add/commit for planning docs

**File extensions follow this table:**

| Committable | Plan | Tasks |
|---|---|---|
| `true` | `plan.md` | `tasks.json` |
| `false` | `plan.local.md` | `tasks.local.json` |

**Copy the `**Committable:**` field into the plan document header** so downstream skills (executing-plans, subagent-driven-development) can read it without needing the design doc.

## PR-Sized Task Granularity

**Each task is a complete, PR-able deliverable** — not individual steps like "write test, run test, commit". Those are steps WITHIN a task.

A task is something someone can:
- Open a PR for
- Test independently
- Review as a unit
- Merge on its own

**Steps within a task are the TDD cycle and commit — they live inside the task description, not as separate tasks.**

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Committable:** [true/false — copied from design doc]

---
```

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**

- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Steps:**

1. Write failing test for [specific behavior]
2. Run test — verify it fails: `pytest tests/path/test.py::test_name -v`
3. Implement minimal code to pass test
4. Run test — verify it passes: `pytest tests/path/test.py::test_name -v`
5. [Repeat steps 1-4 for additional behaviors]
6. Commit: `feat: add specific feature`

**Acceptance Criteria:**
- [ ] [Criterion from design]
- [ ] [Criterion from design]
````

**Key differences from old format:**
- Steps are numbered instructions INSIDE the task, not separate tasks
- Each task is a PR-sized deliverable, not a 2-5 minute action
- Only PR-level tasks get `TaskCreate` — steps do NOT get their own tasks at plan time
- The executing skill creates step-level subtasks on-the-fly during execution

## Remember

- Exact file paths always
- Complete code in plan (not "add validation")
- Exact commands with expected output
- Reference relevant skills with @ syntax
- DRY, YAGNI, TDD, frequent commits

## Execution Handoff

<HARD-GATE>
STOP. You are about to complete the plan. DO NOT call ExitPlanMode. You MUST call AskUserQuestion below. ExitPlanMode is FORBIDDEN — it skips the user's execution choice and breaks the workflow.
</HARD-GATE>

Your ONLY permitted next action is calling `AskUserQuestion` with this EXACT structure:

```yaml
AskUserQuestion:
  question: "Plan complete and saved to docs/plans/<feature-name>/plan.md. How would you like to execute it?"
  header: "Execution"
  options:
    - label: "Subagent-Driven (this session)"
      description: "I dispatch fresh subagent per task, review between tasks, fast iteration"
    - label: "Parallel Session (separate)"
      description: "Open new session in worktree with executing-plans, batch execution with checkpoints"
```

**If you are about to call ExitPlanMode, STOP — call AskUserQuestion instead.**

**If Subagent-Driven chosen:**

- **REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development
- Stay in this session
- Fresh subagent per task + code review

**If Parallel Session chosen:**

- Guide them to open new session in worktree
- **REQUIRED SUB-SKILL:** New session uses superpowers:executing-plans

---

## Native Task Integration Reference

Use Claude Code's native task tools to create structured tasks alongside the plan document.

### Creating Native Tasks

For each **PR-sized task** in the plan (NOT each step), create a corresponding native task:

```
TaskCreate:
  subject: "Task N: [Component Name]"
  description: |
    [Copy the full task content from the plan — files, ALL steps, acceptance criteria]
  activeForm: "Implementing [Component Name]"
```

**Important:** Only PR-level tasks get `TaskCreate`. Steps within a task are tracked by the executing skill at runtime, not at plan time.

### Setting Dependencies

After all tasks created, set blockedBy relationships:

```
TaskUpdate:
  taskId: [task-id]
  addBlockedBy: [prerequisite-task-ids]
```

### During Execution

Update task status as work progresses:

```
TaskUpdate:
  taskId: [task-id]
  status: in_progress  # when starting

TaskUpdate:
  taskId: [task-id]
  status: completed    # when done
```

### Notes

- Native tasks provide CLI-visible progress tracking
- Plan document remains the permanent record

---

## Task Persistence

At plan completion, write the task persistence file to `docs/plans/<feature-name>/tasks.json`.

```json
{
  "planPath": "docs/plans/<feature-name>/plan.md",
  "tasks": [
    { "id": 0, "subject": "Task 0: ...", "status": "pending" },
    { "id": 1, "subject": "Task 1: ...", "status": "pending", "blockedBy": [0] }
  ],
  "lastUpdated": "<timestamp>"
}
```

All artifacts (plan, design, tasks) must be co-located in `docs/plans/<feature-name>/`.

**If committable:** Commit both plan and tasks file:
```bash
git add docs/plans/<feature-name>/plan.md docs/plans/<feature-name>/tasks.json
git commit -m "plan: <feature-name>"
```

**If non-committable:** Files are `plan.local.md` and `tasks.local.json`. Do NOT commit.

### Resuming Work

Any new session can resume by running:

```
/superpowers:executing-plans <plan-path>
```

The skill reads the `tasks.json` file and continues from where it left off.
