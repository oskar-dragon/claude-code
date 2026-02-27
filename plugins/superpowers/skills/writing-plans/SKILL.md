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

1. Call `TaskList` to check for existing tasks from brainstorming (for awareness only)
2. Note any existing tasks for context — do not enhance or create PR-level tasks

**Do not proceed to exploration until TaskList has been called.**

**IMPORTANT:** Do NOT call `TaskCreate` for PR-level tasks at plan time. PR tasks go into `tasks.json` only. The executing skill reads tasks.json to find the next PR to work on each session.

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

## Task Granularity

**Three levels:**
1. **PR** (`## PR N:`) — a deployable increment; gets its own branch and pull request
2. **Task** (`### Task N:`) — an atomic commit unit within a PR; each task ends in verify + commit
3. **Step** (`**Step N: ...**`) — a single implementation detail within a task; bold named header with content below

**A PR is deployable when:**
- All tests pass, no type errors, no lint or formatting errors
- The feature is complete and reviewable — not half-finished or broken
- A reviewer can meaningfully assess it as a unit

Group tasks into a PR when they collectively deliver one independently deployable increment. A PR must not span unrelated concerns. When in doubt, split into more PRs.

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

`````
## Plan Structure

Plans use a 3-level hierarchy. All numbering starts at 1. Every task MUST end with a named Verify step then a named Commit step.

````markdown
## PR 1: [PR-worthy description]

### Task 1: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

**Step 3: Write minimal implementation**

```python
def function(input):
    return expected
```

**Step 4: Run test to verify it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

**Step 5: Verify**

[any additional checks — read the file, grep for patterns, etc.]

**Step 6: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```

**Acceptance Criteria:**
- [ ] Criterion from design

→ Open PR: "feat: [pr description]"
````

**Rules:**
- Steps are bold named headers (`**Step N: Description**`) with content below — never a numbered list
- The `→ Open PR: "..."` line ends each PR section — the executing skill reads this for the PR title
- PR body is built from the task subjects and acceptance criteria in that PR
`````

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

## Task Persistence

At plan completion, write the task persistence file to `docs/plans/<feature-name>/tasks.json`.

```json
{
  "planPath": "docs/plans/<feature-name>/plan.md",
  "prs": [
    { "id": 1, "subject": "PR 1: ...", "status": "pending" },
    { "id": 2, "subject": "PR 2: ...", "status": "pending", "blockedBy": [1] }
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
