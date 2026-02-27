# Committable Mode & PR-Sized Tasks Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update 5 superpowers skills to support a committable/non-committable document mode and PR-sized task granularity.

**Architecture:** Metadata propagation via plan header (`**Committable:** true/false`), task restructuring from bite-sized steps to PR-sized deliverables with steps inside, one-task-at-a-time execution with branch-per-task and inline PR creation.

**Tech Stack:** Markdown skill files (no compiled code, no tests — verification is manual review against design doc).

**Committable:** true

**Design:** `docs/plans/committable-mode-pr-sized-tasks/design.md`

---

## Important Context

This project modifies **markdown instruction files** (Claude Code skills), not source code. There is no test suite, no compilation, no runtime. Verification for each task is: read the modified file, confirm it matches the design doc, and visually confirm no existing instructions were accidentally removed.

The skills form a pipeline: brainstorming → writing-plans → executing-plans/subagent-driven → finishing-a-development-branch. Each task modifies one skill file. Dependencies reflect the pipeline order — upstream skills should be updated first so the design intent is clear, but since these are documentation files, tasks CAN be executed independently if needed.

---

### Task 1: Add committable mode to brainstorming skill

**Files:**
- Modify: `plugins/superpowers/skills/brainstorming/SKILL.md`

**Steps:**

1. Read the current skill file at `plugins/superpowers/skills/brainstorming/SKILL.md`

2. Add a new section `## Committable Mode` after the `## Checklist` section (before `## Process Flow`). Content:

```markdown
## Committable Mode

**After exploring project context (checklist step 1), ask the committable question:**

```yaml
AskUserQuestion:
  question: "Should planning documents for this workflow be committed to git?"
  header: "Documents"
  options:
    - label: "Yes, commit to git (Recommended)"
      description: "Documents use .md extension and are committed. Good for team visibility and history."
    - label: "No, keep local only"
      description: "Documents use .local.md extension and stay gitignored. Good for exploratory/throwaway work."
```

**This choice determines file extensions for the entire workflow:**

| Committable | Design | Plan | Tasks |
|---|---|---|---|
| `true` | `design.md` | `plan.md` | `tasks.json` |
| `false` | `design.local.md` | `plan.local.md` | `tasks.local.json` |

**Propagation:** Include `**Committable:** true` (or `false`) in the design doc header. Downstream skills read this field.
```

3. Update the checklist item 5 to reference committable mode. Change:
   - FROM: `5. **Write design doc** — save to docs/plans/<feature-name>/design.md and commit`
   - TO: `5. **Write design doc** — save to docs/plans/<feature-name>/design.md (or design.local.md if non-committable) and commit (if committable)`

4. Update the "Documentation" section under "After the Design". Change:
   - FROM:
     ```
     - Write the validated design to `docs/plans/<feature-name>/design.md`
     - Commit the design document to git
     ```
   - TO:
     ```
     - Write the validated design to `docs/plans/<feature-name>/design.md` (or `design.local.md` if non-committable)
     - Include `**Committable:** true` (or `false`) in the design doc header block
     - If committable: commit the design document to git
     - If non-committable: skip git add/commit for this file
     ```

5. Verify: Read the modified file end-to-end. Confirm:
   - [ ] Committable Mode section exists with the AskUserQuestion template
   - [ ] File extension table is present
   - [ ] Checklist item 5 references committable mode
   - [ ] Documentation section handles both committable and non-committable paths
   - [ ] No existing instructions were accidentally removed
   - [ ] The rest of the skill is unchanged

6. Commit:
```bash
git add plugins/superpowers/skills/brainstorming/SKILL.md
git commit -m "feat(brainstorming): add committable mode question and metadata"
```

**Acceptance Criteria:**
- [ ] Brainstorming asks committable question after context exploration
- [ ] Design doc header includes `**Committable:**` field
- [ ] File naming follows `.md` / `.local.md` convention
- [ ] Non-committable path skips git commits for planning docs
- [ ] All existing brainstorming instructions preserved

---

### Task 2: Update writing-plans for committable mode and PR-sized task format

**Files:**
- Modify: `plugins/superpowers/skills/writing-plans/SKILL.md`

**Steps:**

1. Read the current skill file at `plugins/superpowers/skills/writing-plans/SKILL.md`

2. Add a new section `## Committable Mode` after the `## REQUIRED FIRST STEP` section (before `## Bite-Sized Task Granularity`). Content:

```markdown
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
```

3. Replace the `## Bite-Sized Task Granularity` section entirely with a new `## PR-Sized Task Granularity` section:

```markdown
## PR-Sized Task Granularity

**Each task is a complete, PR-able deliverable** — not individual steps like "write test, run test, commit". Those are steps WITHIN a task.

A task is something someone can:
- Open a PR for
- Test independently
- Review as a unit
- Merge on its own

**Steps within a task are the TDD cycle and commit — they live inside the task description, not as separate tasks.**
```

4. Update the `## Plan Document Header` to include the Committable field. Change the template to:

```markdown
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
```

5. Replace the `## Task Structure` section with the PR-sized format:

````markdown
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
````

6. Update the `## Native Task Integration Reference` to clarify PR-level only. Replace the "Creating Native Tasks" subsection:

```markdown
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
```

7. Update `Save plans to:` line to reference committable mode. Change:
   - FROM: `**Save plans to:** docs/plans/<feature-name>/plan.md`
   - TO: `**Save plans to:** docs/plans/<feature-name>/plan.md (or plan.local.md if non-committable)`

8. Update the commit section at the end of the skill. In the `## Task Persistence` section, update the file reference and add committable handling. After the tasks.json code block, add:

```markdown
**If committable:** Commit both plan and tasks file:
```bash
git add docs/plans/<feature-name>/plan.md docs/plans/<feature-name>/tasks.json
git commit -m "plan: <feature-name>"
```

**If non-committable:** Files are `plan.local.md` and `tasks.local.json`. Do NOT commit.
```

9. Verify: Read the modified file end-to-end. Confirm:
   - [ ] Committable Mode section reads metadata from design doc
   - [ ] Plan header includes `**Committable:**` field
   - [ ] Task structure shows PR-sized format with steps inside
   - [ ] Native Task Integration says PR-level only
   - [ ] Task Persistence handles both committable and non-committable
   - [ ] Bite-Sized Task Granularity section is replaced (not just appended to)
   - [ ] All existing instructions not related to granularity/committable are preserved

10. Commit:
```bash
git add plugins/superpowers/skills/writing-plans/SKILL.md
git commit -m "feat(writing-plans): add committable mode and PR-sized task format"
```

**Acceptance Criteria:**
- [ ] Reads `**Committable:**` from design doc and propagates to plan header
- [ ] Uses correct file extensions based on committable flag
- [ ] Task format is PR-sized with steps inside (not bite-sized separate tasks)
- [ ] Only PR-level tasks get TaskCreate
- [ ] Backward compatible (no Committable field = assume true)
- [ ] Non-committable path skips git commits for planning docs

---

### Task 3: Update executing-plans for one-task-at-a-time with branch-per-task

**Files:**
- Modify: `plugins/superpowers/skills/executing-plans/SKILL.md`

**Steps:**

1. Read the current skill file at `plugins/superpowers/skills/executing-plans/SKILL.md`

2. Update the `## Overview` section. Change:
   - FROM: `Load plan, review critically, execute tasks in batches, report for review between batches.`
   - FROM: `**Core principle:** Batch execution with checkpoints for architect review.`
   - TO: `Load plan, review critically, execute one PR-sized task at a time, create PR, report for review.`
   - TO: `**Core principle:** One PR-sized task at a time with branch-per-task and inline PR creation.`

3. In `### Step 0: Load Persisted Tasks`, the logic stays the same but add a note about committable mode after the existing content:

```markdown
**Committable mode:** Read the `**Committable:**` field from the plan header. If `false`, tasks file is `tasks.local.json` instead of `tasks.json`. Plan file is `plan.local.md` instead of `plan.md`.
```

4. Add a new `### Step 1c: Branch Check` section after `### Step 1b`:

```markdown
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
```

5. Replace `### Step 2: Execute Batch` entirely with a new one-task-at-a-time flow:

```markdown
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
```

6. Replace `### Step 3: Report` with:

```markdown
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
```

7. Replace `### Step 4: Continue` and `### Step 5: Complete Development` with:

```markdown
### Step 4: Complete All Work

After the **final** PR-task is completed and its PR created:

- Announce: "I'm using the finishing-a-development-branch skill to complete this work."
- **REQUIRED SUB-SKILL:** Use superpowers:finishing-a-development-branch
- At this point we're on main with no feature branch. The skill detects this and skips to plan archiving.
```

8. Update the `## Remember` section. Add these bullets:
```markdown
- One PR-task at a time, not batches
- Create branch before each task if on main
- Create step subtasks on-the-fly during execution
- Push + PR after each task, not at the end
- tasks.json updated only when PR-task fully completes
```

9. Verify: Read the modified file end-to-end. Confirm:
   - [ ] Overview says one-task-at-a-time, not batches
   - [ ] Step 0 mentions committable mode for file extensions
   - [ ] Step 1c handles branch creation before each task
   - [ ] Step 2 creates step subtasks, executes them, creates PR inline
   - [ ] Step 3 reports and asks continue/close
   - [ ] Step 4 invokes finishing-a-development-branch after final task only
   - [ ] Remember section includes new bullets
   - [ ] All existing safety instructions (when to stop, when to ask for help) preserved

10. Commit:
```bash
git add plugins/superpowers/skills/executing-plans/SKILL.md
git commit -m "feat(executing-plans): one-task-at-a-time with branch-per-task and inline PR"
```

**Acceptance Criteria:**
- [ ] Executes one PR-task at a time (not batches of 3)
- [ ] Creates branch before each task if on main
- [ ] Creates step subtasks on-the-fly from plan steps
- [ ] Pushes and creates PR after each task completes
- [ ] Switches back to main between tasks
- [ ] Updates tasks.json only after PR-task fully completes
- [ ] Reads committable mode from plan header
- [ ] finishing-a-development-branch invoked once after final task
- [ ] Session can be closed and resumed between tasks

---

### Task 4: Update subagent-driven-development for one-task-at-a-time flow

**Files:**
- Modify: `plugins/superpowers/skills/subagent-driven-development/SKILL.md`

**Steps:**

1. Read the current skill file at `plugins/superpowers/skills/subagent-driven-development/SKILL.md`

2. Update the process flow diagram. The key changes to the dot graph:
   - After `"TaskUpdate: mark task completed"`, add branch check + PR creation nodes before `"More tasks remain?"`
   - Add new nodes:
     - `"Push branch + create PR"` after task completion
     - `"Switch back to main"` after PR creation
     - `"Ask: continue or close?"` before checking remaining tasks
   - After `"More tasks remain?" -> no`, change to go to finishing-a-development-branch (for archiving only)

3. Update the process description. After the per-task cycle (implement → spec review → code quality review → mark complete), add the branch/PR flow:

```markdown
**After task passes both reviews:**

1. Push branch and create PR:
   ```bash
   git push -u origin <branch-name>
   gh pr create --title "Task N: [task subject]" --body "..."
   ```
2. Switch back to main: `git checkout main && git pull`
3. Mark PR-task completed in native tasks AND tasks.json
4. Ask: "Continue to next task, or close session?"
```

4. Update the "After all tasks" section at the end of the process flow. Change from dispatching final code reviewer + finishing skill to:

```markdown
**After final task:**
- Dispatch final code-reviewer subagent for entire implementation (unchanged)
- Invoke finishing-a-development-branch for plan archiving (we're on main, no feature branch — skill detects this and skips to archiving)
```

5. Add a section about branch creation. Before the per-task cycle, add:

```markdown
**Before each task:**

Check if on main/master. If so, ask for branch name and create branch (same as executing-plans Step 1c).
```

6. Update the example workflow to show the new PR-per-task flow. After the "Mark Task 1 complete" line, add:
```
[Push branch, create PR]
[Switch to main]
[Ask: continue or close?]
```

7. Add committable mode note. In the initial "Read plan" section:
```markdown
**Committable mode:** Read the `**Committable:**` field from the plan header. Use correct file extensions for tasks.json (or tasks.local.json).
```

8. Verify: Read the modified file end-to-end. Confirm:
   - [ ] Branch creation before each task
   - [ ] PR creation after each task passes reviews
   - [ ] Switch back to main between tasks
   - [ ] Continue/close prompt between tasks
   - [ ] finishing-a-development-branch after final task only
   - [ ] Committable mode note present
   - [ ] Two-stage review process (spec + quality) unchanged
   - [ ] All red flags and safety instructions preserved

9. Commit:
```bash
git add plugins/superpowers/skills/subagent-driven-development/SKILL.md
git commit -m "feat(subagent-driven): one-task-at-a-time with branch-per-task and inline PR"
```

**Acceptance Criteria:**
- [ ] One PR-task at a time with branch creation
- [ ] PR created after both reviews pass
- [ ] Switches back to main between tasks
- [ ] Continue/close session option between tasks
- [ ] Two-stage review (spec then quality) unchanged
- [ ] finishing-a-development-branch after final task only
- [ ] Committable mode supported
- [ ] Example workflow updated

---

### Task 5: Add no-feature-branch detection to finishing-a-development-branch

**Files:**
- Modify: `plugins/superpowers/skills/finishing-a-development-branch/SKILL.md`

**Steps:**

1. Read the current skill file at `plugins/superpowers/skills/finishing-a-development-branch/SKILL.md`

2. Add a new section `### Step 0: Detect State` before `### Step 1: Verify Tests`. Content:

```markdown
### Step 0: Detect State

Check if we're on a feature branch or on main:

```bash
CURRENT=$(git branch --show-current)
BASE=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || echo "main")
```

**If current branch IS the base branch (main/master):**

This means all PR-tasks have already been completed with individual PRs. Skip straight to plan archiving:

```bash
# Archive the feature's plan folder (if it exists)
if [ -d "docs/plans/<feature-name>" ]; then
  git mv docs/plans/<feature-name>/ docs/plans/archive/<feature-name>/
  git commit -m "chore: archive plan for <feature-name>"
fi
```

Then STOP. Do not present the 4 options — there is no feature branch to merge/push/discard.

**If on a feature branch:** Continue to Step 1 (existing flow unchanged).
```

3. Update the `## Quick Reference` table to include the new state:

```markdown
| State                | Action                                    |
| -------------------- | ----------------------------------------- |
| On main, no branch   | Archive plan only (skip options)          |
| On feature branch    | Verify tests → Present 4 options → Execute |
```

4. Update the `## Integration` section's "Called by" to reflect the new usage:

```markdown
**Called by:**

- **subagent-driven-development** - After all tasks complete (may be on main with no feature branch)
- **executing-plans** - After all tasks complete (may be on main with no feature branch)
```

5. Verify: Read the modified file end-to-end. Confirm:
   - [ ] Step 0 detects whether on main or feature branch
   - [ ] On main: archives plan and stops (no 4-option menu)
   - [ ] On feature branch: existing flow entirely unchanged
   - [ ] Quick reference table updated
   - [ ] Integration section updated
   - [ ] All existing safety instructions preserved (test verification, discard confirmation, etc.)

6. Commit:
```bash
git add plugins/superpowers/skills/finishing-a-development-branch/SKILL.md
git commit -m "feat(finishing): add no-feature-branch detection for plan-only archiving"
```

**Acceptance Criteria:**
- [ ] Detects "on main, no feature branch" state
- [ ] Skips to plan archiving when on main
- [ ] Existing 4-option flow completely unchanged when on feature branch
- [ ] Plan archiving works correctly (git mv to archive/)
- [ ] All existing safety checks preserved
