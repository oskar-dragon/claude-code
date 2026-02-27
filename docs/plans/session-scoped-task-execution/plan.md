# Session-Scoped Task Execution Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make executing-plans session-scoped — one PR per session, all step tasks created upfront from plan.md, tasks.json as the only persistent state. Remove PR-level native task creation from writing-plans.

**Architecture:** Two skill files change: writing-plans loses its "Native Task Integration Reference" section (no more PR-level TaskCreate), and executing-plans gets a new session flow (read tasks.json → find next PR → create all steps upfront → execute → close session). tasks.json schema is unchanged. No code — these are markdown skill files.

**Tech Stack:** Markdown skill files in `plugins/superpowers/skills/`

**Committable:** true

---

### Task 0: Update writing-plans/SKILL.md

**Files:**
- Modify: `plugins/superpowers/skills/writing-plans/SKILL.md`

**Steps:**

1. Verify current state — confirm the sections that need changing exist:
   ```bash
   grep -n "Native Task Integration Reference\|If no tasks: you will create them\|Only PR-level tasks get" plugins/superpowers/skills/writing-plans/SKILL.md
   ```
   Expected: all three lines found.

2. Update the "Initialize Task Tracking" section. Replace:
   ```
   1. Call `TaskList` to check for existing tasks from brainstorming
   2. If tasks exist: you will enhance them with implementation details as you write the plan
   3. If no tasks: you will create them with `TaskCreate` as you write each plan task

   **Do not proceed to exploration until TaskList has been called.**
   ```
   With:
   ```
   1. Call `TaskList` to check for existing tasks from brainstorming (for awareness only)
   2. Note any existing tasks for context — do not enhance or create PR-level tasks

   **Do not proceed to exploration until TaskList has been called.**

   **IMPORTANT:** Do NOT call `TaskCreate` for PR-level tasks at plan time. PR tasks go into `tasks.json` only. The executing skill reads tasks.json to find the next PR to work on each session.
   ```

3. Update the "Key differences from old format" note. Replace:
   ```
   - Only PR-level tasks get `TaskCreate` — steps do NOT get their own tasks at plan time
   - The executing skill creates step-level subtasks on-the-fly during execution
   ```
   With:
   ```
   - PR-level tasks go into `tasks.json` only — do NOT create them via `TaskCreate`
   - The executing skill reads tasks.json and creates all step-level native tasks at session start
   ```

4. Remove the entire "Native Task Integration Reference" section — from `## Native Task Integration Reference` through the closing `### Notes` block (ending with "Plan document remains the permanent record"). This section no longer applies.

5. Verify changes — confirm old content is gone:
   ```bash
   grep -n "Native Task Integration Reference\|If no tasks: you will create them\|on-the-fly" plugins/superpowers/skills/writing-plans/SKILL.md
   ```
   Expected: no matches.

6. Verify tasks.json section is still intact:
   ```bash
   grep -n "Task Persistence\|tasks.json" plugins/superpowers/skills/writing-plans/SKILL.md
   ```
   Expected: Task Persistence section and tasks.json references still present.

7. Commit:
   ```bash
   git add plugins/superpowers/skills/writing-plans/SKILL.md
   git commit -m "feat(writing-plans): remove PR-level TaskCreate, tasks.json is sole task store"
   ```

**Acceptance Criteria:**
- [ ] "Native Task Integration Reference" section is gone
- [ ] "Initialize Task Tracking" no longer instructs creating tasks via TaskCreate
- [ ] "Key differences" note updated to reflect new behavior
- [ ] "Task Persistence" (tasks.json output) section untouched

---

### Task 1: Update executing-plans/SKILL.md

**Files:**
- Modify: `plugins/superpowers/skills/executing-plans/SKILL.md`
- Modify: `plugins/superpowers/.claude-plugin/plugin.json`

**Steps:**

1. Verify current state — confirm sections that need changing exist:
   ```bash
   grep -n "recreate from JSON\|Continue to next task\|on-the-fly\|Step 1b" plugins/superpowers/skills/executing-plans/SKILL.md
   ```
   Expected: all found.

2. Replace the entire Step 0 section. Replace:
   ```
   ### Step 0: Load Persisted Tasks

   1. Call `TaskList` to check for existing native tasks
   2. **CRITICAL - Locate tasks file:** Look for `tasks.json` in the same directory as the plan file (e.g., if plan is `docs/plans/<feature-name>/plan.md`, look for `docs/plans/<feature-name>/tasks.json`)
   3. If tasks file exists AND native tasks empty: recreate from JSON using TaskCreate, restore blockedBy with TaskUpdate
   4. If native tasks exist: verify they match plan, resume from first `pending`/`in_progress`
   5. If neither: proceed to Step 1b to bootstrap from plan

   Update `tasks.json` after every task status change.

   **Committable mode:** Read the `**Committable:**` field from the plan header. If `false`, tasks file is `tasks.local.json` instead of `tasks.json`. Plan file is `plan.local.md` instead of `plan.md`.
   ```
   With:
   ```
   ### Step 0: Load Persisted Tasks

   Native tasks are always empty at session start — do NOT recreate PR-level native tasks. tasks.json is the sole persistent state.

   1. **Locate tasks file:** `tasks.json` in the same directory as the plan file (e.g., `docs/plans/<feature-name>/tasks.json`)
   2. Read tasks.json to determine what to work on:
      - If a task has `status: in_progress`: that PR was interrupted mid-session. Check `git branch --show-current` — if a feature branch exists for it, resume from there. Proceed to Step 2 for this task.
      - If no `in_progress` task: find the next `pending` task whose `blockedBy` IDs all have `status: completed`. Proceed to Step 1c then Step 2.
      - If all tasks are `completed`: invoke superpowers:finishing-a-development-branch.

   **Committable mode:** Read the `**Committable:**` field from the plan header. If `false`, tasks file is `tasks.local.json` instead of `tasks.json`. Plan file is `plan.local.md` instead of `plan.md`.
   ```

3. Remove the entire Step 1b section. Delete from `### Step 1b: Bootstrap Tasks from Plan (if needed)` through the closing `4. Call TaskList and verify...` item. This step created PR-level native tasks from the plan — no longer needed.

4. Update Step 2, items 2-4. Replace:
   ```
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
   ```
   With:
   ```
   2. **Write `status: in_progress` to tasks.json** for this PR task immediately (recovery anchor if session ends mid-task)
   3. **Create ALL step tasks upfront:** Parse the `**Steps:**` section from this PR's `### Task N:` block in plan.md. Create native tasks sequentially, capturing each returned ID to wire the next step's `blockedBy`:
      ```
      TaskCreate: subject: "Step 1: [description]", activeForm: "[doing]"  → capture ID s1
      TaskCreate: subject: "Step 2: [description]", activeForm: "[doing]", blockedBy: [s1]  → capture ID s2
      TaskCreate: subject: "Step N: [description]", activeForm: "[doing]", blockedBy: [s(n-1)]
      ```
      All step tasks are created BEFORE starting execution.
   4. **Execute each step in order:** Mark step in_progress → execute → mark step completed. Repeat for all steps.
   ```

5. Replace Step 3 AskUserQuestion with session-end summary. Replace the entire Step 3 content after "After each PR-task:" (the `AskUserQuestion` block and the `If continuing/closing` lines) with:
   ```
   Present a session-end summary:
   - What was completed (PR title + URL)
   - Verification output
   - How many PRs remain (from tasks.json)
   - Command to resume next session: `/superpowers:executing-plans <plan-path>`

   **Session ends here.** Do NOT offer to continue to the next task. One PR per session is the hard boundary. The user will open a new session when ready for the next PR.
   ```

6. Update the Remember section. Replace:
   ```
   - Create step subtasks on-the-fly during execution
   ```
   With:
   ```
   - Create ALL step tasks upfront at PR start, before execution begins
   - tasks.json written twice per PR: in_progress at start, completed at end
   ```
   Also remove the bullet:
   ```
   - One PR-task at a time, not batches
   ```
   (No longer needed — the session model enforces this.)

7. Bump plugin version to 1.3.0:
   ```bash
   # Edit plugins/superpowers/.claude-plugin/plugin.json: "version": "1.2.0" → "1.3.0"
   ```

8. Verify all old patterns are gone:
   ```bash
   grep -n "recreate from JSON\|Continue to next task\|on-the-fly\|Step 1b\|Bootstrap Tasks from Plan" plugins/superpowers/skills/executing-plans/SKILL.md
   ```
   Expected: no matches.

9. Verify key new patterns are present:
   ```bash
   grep -n "in_progress.*recovery\|upfront\|All step tasks are created BEFORE\|One PR per session" plugins/superpowers/skills/executing-plans/SKILL.md
   ```
   Expected: all found.

10. Verify version bump:
    ```bash
    grep "version" plugins/superpowers/.claude-plugin/plugin.json
    ```
    Expected: `"version": "1.3.0"`

11. Commit:
    ```bash
    git add plugins/superpowers/skills/executing-plans/SKILL.md plugins/superpowers/.claude-plugin/plugin.json
    git commit -m "feat(executing-plans): session-scoped execution with upfront step creation

    - One PR per session, hard boundary (no 'continue to next task')
    - All step tasks created upfront at PR start instead of on-the-fly
    - tasks.json written at PR start (in_progress) and end (completed)
    - Step 0 reads tasks.json to find next PR; no PR-level native tasks created
    - Mid-session recovery via in_progress status + git branch check
    - Bump superpowers to 1.3.0"
    ```

**Acceptance Criteria:**
- [ ] Step 0 no longer recreates PR-level native tasks from tasks.json
- [ ] Step 1b removed entirely
- [ ] Step 2 creates all step tasks upfront, writes in_progress to tasks.json before steps
- [ ] Step 3 ends session after each PR — no "Continue to next task" option
- [ ] Remember section updated
- [ ] plugin.json version is 1.3.0
