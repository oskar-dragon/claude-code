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

1. Call `TaskList` to check for existing native tasks
2. **CRITICAL - Locate tasks file:** Look for `tasks.json` in the same directory as the plan file (e.g., if plan is `docs/plans/<feature-name>/plan.md`, look for `docs/plans/<feature-name>/tasks.json`)
3. If tasks file exists AND native tasks empty: recreate from JSON using TaskCreate, restore blockedBy with TaskUpdate
4. If native tasks exist: verify they match plan, resume from first `pending`/`in_progress`
5. If neither: proceed to Step 1b to bootstrap from plan

Update `tasks.json` after every task status change.

**Committable mode:** Read the `**Committable:**` field from the plan header. If `false`, tasks file is `tasks.local.json` instead of `tasks.json`. Plan file is `plan.local.md` instead of `plan.md`.

### Step 1: Load and Review Plan

1. Read plan file fully
2. Review critically - identify any questions or concerns about the plan
3. If concerns: Raise them with your human partner before starting
4. If no concerns: Proceed to task setup

### Step 1b: Bootstrap Tasks from Plan (if needed)

If TaskList returned no tasks or tasks don't match plan:

1. Parse the plan document for `## Task N:` or `### Task N:` headers
2. For each task found, use TaskCreate with:
   - subject: The task title from the plan
   - description: Full task content including steps, files, acceptance criteria
   - activeForm: Present tense action (e.g., "Implementing X")
3. **CRITICAL - Dependencies:** For EACH task that has blockedBy in the plan or .tasks.json:
   - Call `TaskUpdate` with `taskId` and `addBlockedBy: [list-of-blocking-task-ids]`
   - Do NOT skip this step - dependencies are essential for correct execution order
4. Call `TaskList` and verify blockedBy relationships show correctly (e.g., "blocked by #1, #2")

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
2. Mark PR-task as in_progress: `TaskUpdate` (status: in_progress), update `tasks.json`
3. **Create step subtasks:** Parse the steps from the plan task description. For each step, create a native subtask:
   ```
   TaskCreate:
     subject: "Step N: [step description]"
     description: "[step detail from plan]"
     activeForm: "[doing step description]"
   ```
   Chain with `addBlockedBy` so steps execute sequentially.
4. **Execute each step:** Mark subtask in_progress → execute → mark completed
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

### Step 3: Report and Continue

After each PR-task:

- Show what was implemented
- Show PR URL
- Show verification output

Then ask:

```yaml
AskUserQuestion:
  question: "Task N complete. PR created. What next?"
  header: "Next"
  options:
    - label: "Continue to next task"
      description: "Start the next pending PR-task"
    - label: "Close session"
      description: "Save progress and stop here. Resume later with /superpowers:executing-plans"
```

If continuing: go to Step 2 with next pending task.
If closing: ensure tasks.json is up to date, report remaining tasks.

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
- One PR-task at a time, not batches
- Create branch before each task if on main
- Create step subtasks on-the-fly during execution
- Push + PR after each task, not at the end
- tasks.json updated only when PR-task fully completes

## Integration

**Required workflow skills:**

- **superpowers:using-git-worktrees** - REQUIRED: Set up isolated workspace before starting
- **superpowers:writing-plans** - Creates the plan this skill executes
- **superpowers:finishing-a-development-branch** - Complete development after all tasks
