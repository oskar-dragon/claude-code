---
name: executing-plans
description: Use when you have a written implementation plan to execute in a separate session with review checkpoints
---

# Executing Plans

## Overview

Load plan, review critically, execute one PR-sized task at a time, create PR, report for review.

**Core principle:** One PR-sized task at a time with branch-per-task and inline PR creation.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

## The Process

### Step 0: Load Persisted Tasks

Native tasks are always empty at session start — do NOT recreate PR-level native tasks. tasks.json is the sole persistent state.

1. **Locate tasks file:** `tasks.json` in the same directory as the plan file (e.g., `docs/plans/<feature-name>/tasks.json`)
2. Read tasks.json to determine what to work on:
   - If a task has `status: in_progress`: that PR was interrupted mid-session. Check `git branch --show-current` — if a feature branch exists for it, resume from there. Proceed to Step 2 for this task.
   - If no `in_progress` task: find the next `pending` task whose `blockedBy` IDs all have `status: completed`. Proceed to Step 1c then Step 2.
   - If all tasks are `completed`: invoke superpowers:finishing-a-development-branch.

**Committable mode:** Read the `**Committable:**` field from the plan header. If `false`, tasks file is `tasks.local.json` instead of `tasks.json`. Plan file is `plan.local.md` instead of `plan.md`.

### Step 1: Load and Review Plan

1. Read plan file fully
2. Review critically - identify any questions or concerns about the plan
3. If concerns: Raise them with your human partner before starting
4. If no concerns: Proceed to task setup

### Step 1c: Branch Check (before each task)

Before starting each PR-task, check if on main/master:

```bash
git branch --show-current
```

If on main/master, ask for a branch name:

```yaml
AskUserQuestion:
  question: "What branch name for Task N: [task subject]?"
  header: "Branch"
  options:
    - label: "feat/[auto-generated-slug]"
      description: "Auto-generated from task subject"
    - label: "Custom name"
      description: "Enter your own branch name"
```

Create the branch:

```bash
git checkout -b <branch-name>
```

### Step 2: Execute PR-Task

**One task at a time.** For the current PR-task:

1. Run Step 1c (Branch Check) — create branch if on main
2. **Write `status: in_progress` to tasks.json** for this PR task immediately (recovery anchor if session ends mid-task)
3. **Create ALL step tasks upfront:** Parse the `**Steps:**` section from this PR's `### Task N:` block in plan.md. Create native tasks sequentially, capturing each returned ID to wire the next step's `blockedBy`:
   ```
   TaskCreate: subject: "Step 1: [description]", activeForm: "[doing]"  → capture ID s1
   TaskCreate: subject: "Step 2: [description]", activeForm: "[doing]", blockedBy: [s1]  → capture ID s2
   TaskCreate: subject: "Step N: [description]", activeForm: "[doing]", blockedBy: [s(n-1)]
   ```
   All step tasks are created BEFORE starting execution.
4. **Execute each step in order:** Mark step in_progress → execute → mark step completed. Repeat for all steps.
5. **All steps done — create PR:**
   ```bash
   git push -u origin <branch-name>
   gh pr create --title "Task N: [task subject]" --body "$(cat <<'EOF'
   ## Summary
   [What this task implements]

   ## Acceptance Criteria
   [From the plan task]
   EOF
   )"
   ```
6. **Switch back to main:**
   ```bash
   git checkout main && git pull
   ```
7. Mark PR-task as `completed` in native tasks AND `tasks.json`

### Step 3: Report and End Session

After each PR-task:

Present a session-end summary:
- What was completed (PR title + URL)
- Verification output
- How many PRs remain (from tasks.json)
- Command to resume next session: `/superpowers:executing-plans <plan-path>`

**Session ends here.** Do NOT offer to continue to the next task. One PR per session is the hard boundary. The user will open a new session when ready for the next PR.

### Step 4: Complete All Work

After the **final** PR-task is completed and its PR created:

- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- **REQUIRED SUB-SKILL:** Use superpowers:finishing-a-development-branch
- At this point we're on main with no feature branch. The skill detects this and skips to plan archiving.

## When to Stop and Ask for Help

**STOP executing immediately when:**

- Hit a blocker mid-batch (missing dependency, test fails, instruction unclear)
- Plan has critical gaps preventing starting
- You don't understand an instruction
- Verification fails repeatedly

**Ask for clarification rather than guessing.**

## When to Revisit Earlier Steps

**Return to Review (Step 1) when:**

- Partner updates the plan based on your feedback
- Fundamental approach needs rethinking

**Don't force through blockers** - stop and ask.

## Remember

- Review plan critically first
- Follow plan steps exactly
- Don't skip verifications
- Reference skills when plan says to
- Between batches: just report and wait
- Stop when blocked, don't guess
- Never start implementation on main/master branch without explicit user consent
- Create branch before each task if on main
- Create ALL step tasks upfront at PR start, before execution begins
- tasks.json written twice per PR: in_progress at start, completed at end
- Push + PR after each task, not at the end

## Integration

**Required workflow skills:**

- **superpowers:using-git-worktrees** - REQUIRED: Set up isolated workspace before starting
- **superpowers:writing-plans** - Creates the plan this skill executes
- **superpowers:finishing-a-development-branch** - Complete development after all tasks
