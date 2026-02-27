---
name: executing-plans
description: Use when you have a written implementation plan to execute in a separate session with review checkpoints
---

# Executing Plans

## Overview

Load plan, review critically, execute one PR at a time, create PR, report for review.

**Core principle:** One PR at a time with branch-per-PR and inline PR creation.

**Announce at start:** "I'm using the executing-plans skill to implement this plan."

## The Process

### Step 0: Load Persisted Tasks

Native tasks are always empty at session start — tasks.json is the sole persistent state.

1. **Locate tasks file:** `tasks.json` in the same directory as the plan file (e.g., `docs/plans/<feature-name>/tasks.json`)
2. If tasks.json has no `prs` key: the plan uses the old flat format — prompt the user to restructure with `## PR N:` sections before continuing.
3. Read the `prs` array to determine what to work on:
   - If a PR has `status: in_progress`: session was interrupted mid-PR. Check `git branch --show-current` — if a feature branch exists, re-run all tasks in this PR from the beginning of the branch. Proceed to Step 2 for this PR.
   - If no `in_progress` PR: find the next `pending` PR whose `blockedBy` IDs all have `status: completed`. Proceed to Step 1c then Step 2.
   - If all PRs are `completed`: invoke superpowers:finishing-a-development-branch.

**Committable mode:** Read the `**Committable:**` field from the plan header. If `false`, tasks file is `tasks.local.json` instead of `tasks.json`. Plan file is `plan.local.md` instead of `plan.md`.

### Step 1: Load and Review Plan

1. Read plan file fully
2. Review critically - identify any questions or concerns about the plan
3. If concerns: Raise them with your human partner before starting
4. If no concerns: Proceed to task setup

### Step 1b: Bootstrap PRs from Plan (if needed)

If tasks.json has no `prs` array or it is empty:

1. Parse the plan document for `## PR N:` headers
2. For each PR section found, write an entry to the `prs` array:
   ```json
   { "id": N, "subject": "PR N: [title from plan]", "status": "pending" }
   ```
3. Set `blockedBy` in sequence (each PR blocked by the previous one)
4. Write the updated tasks.json to disk

### Step 1c: Branch Check (before each PR)

Before starting each PR, check if on main/master:

```bash
git branch --show-current
```

If on main/master, ask for a branch name:

```yaml
AskUserQuestion:
  question: "What branch name for PR N: [pr subject]?"
  header: "Branch"
  options:
    - label: "feat/[auto-generated-slug]"
      description: "Auto-generated from PR subject"
    - label: "Custom name"
      description: "Enter your own branch name"
```

Create the branch:

```bash
git checkout -b <branch-name>
```

### Step 2: Execute PR

**One PR at a time.** For the current PR:

1. Run Step 1c (Branch Check) — create branch if on main
2. **Write `status: in_progress` to `prs[N]` in tasks.json** immediately (recovery anchor)
3. **Execute all tasks within this PR:** For each `### Task N:` block belonging to this PR section in plan.md:
   a. Create native subtasks for this task's steps:
      ```
      TaskCreate: subject: "Task N: [task subject]", activeForm: "Implementing [task subject]"
      TaskCreate: subject: "Step 1: [description]", activeForm: "[doing]", blockedBy: [task-id]
      TaskCreate: subject: "Step 2: [description]", activeForm: "[doing]", blockedBy: [step-1-id]
      ...
      ```
   b. Mark task in_progress → execute each step → mark task completed
   c. Each task ends with its own named Verify step and Commit step — follow them exactly
   d. **Do NOT open a PR between tasks** — continue to the next task in the PR
4. **All tasks done — open PR:** Parse the `→ Open PR: "..."` line from the current `## PR N:` section in plan.md for the title:
   ```bash
   git push -u origin <branch-name>
   gh pr create --title "[title from → Open PR line]" --body "$(cat <<'EOF'
   ## Summary
   [Task subjects from this PR, one per line]

   ## Acceptance Criteria
   [Acceptance criteria from each task in this PR]
   EOF
   )"
   ```
5. **Switch back to main:**
   ```bash
   git checkout main && git pull
   ```
6. Write `status: completed` to `prs[N]` in tasks.json

### Step 3: Report

After each PR:

Present a session-end summary:
- What was completed (PR title + URL)
- Verification output
- How many PRs remain (from tasks.json `prs` array)
- Command to resume next session: `/superpowers:executing-plans <plan-path>`

**Session ends here.** Do NOT offer to continue to the next PR.

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
- Follow plan steps exactly — bold named step headers, not a numbered list
- Don't skip verifications or commits
- Reference skills when plan says to
- Stop when blocked, don't guess
- Never start implementation on main/master branch without explicit user consent
- One PR at a time
- Create branch once per PR, before any tasks start
- All tasks within a PR run uninterrupted — no "continue or close?" between tasks
- Each task ends with its own named Verify + Commit steps — follow them exactly
- Open PR after all tasks in the PR complete, using the `→ Open PR:` title from the plan
- tasks.json `prs` entry updated twice: `in_progress` at PR start, `completed` after PR opens

## Integration

**Required workflow skills:**

- **superpowers:using-git-worktrees** - REQUIRED: Set up isolated workspace before starting
- **superpowers:writing-plans** - Creates the plan this skill executes
- **superpowers:finishing-a-development-branch** - Complete development after all tasks
