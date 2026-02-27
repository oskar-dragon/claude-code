# PR → Task → Step Hierarchy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore a 3-level PR → Tasks → Steps hierarchy across all three execution workflow skills, where each task ends with named verify + commit steps and a PR is opened once all its tasks are complete.

**Architecture:** Three markdown skill files change: writing-plans gets a new plan format template (PR sections wrapping tasks with bold named step headers), executing-plans gets PR-level execution logic (all tasks within a PR run uninterrupted, PR opened at end), and subagent-driven-development gets the same PR-level grouping. tasks.json loses the flat tasks array and tracks only prs. No code — these are markdown instruction files.

**Tech Stack:** Markdown skill files in `plugins/superpowers/skills/`

**Committable:** true

---

## PR 1: Restore PR → Task → Step hierarchy across all execution workflows

### Task 1: Update writing-plans/SKILL.md

**Files:**
- Modify: `plugins/superpowers/skills/writing-plans/SKILL.md`

**Step 1: Read the current file**

```bash
cat plugins/superpowers/skills/writing-plans/SKILL.md
```

**Step 2: Replace the "PR-Sized Task Granularity" section**

Find this block (exact text):
```
## PR-Sized Task Granularity

**Each task is a complete, PR-able deliverable** — not individual steps like "write test, run test, commit". Those are steps WITHIN a task.

A task is something someone can:
- Open a PR for
- Test independently
- Review as a unit
- Merge on its own

**Steps within a task are the TDD cycle and commit — they live inside the task description, not as separate tasks.**
```

Replace with:
```
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
```

**Step 3: Replace the "Task Structure" section**

Find this block from `## Task Structure` through the end of the "Key differences" note:
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
- PR-level tasks go into `tasks.json` only — do NOT create them via `TaskCreate`
- The executing skill reads tasks.json and creates all step-level native tasks at session start
```

Replace with:
````
## Plan Structure

Plans use a 3-level hierarchy. All numbering starts at 1. Every task MUST end with a named Verify step then a named Commit step.

```markdown
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
```

**Rules:**
- Steps are bold named headers (`**Step N: Description**`) with content below — never a numbered list
- The `→ Open PR: "..."` line ends each PR section — the executing skill reads this for the PR title
- PR body is built from the task subjects and acceptance criteria in that PR
````

**Step 4: Update the tasks.json template in "Task Persistence"**

Find the entire JSON block inside `## Task Persistence`:
```
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
```

Replace with:
```
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
```

**Step 5: Verify old patterns are gone**

```bash
grep -n "PR-Sized Task\|numbered list\|\"id\": 0\|Task 0:\|Steps are numbered" plugins/superpowers/skills/writing-plans/SKILL.md
```

Expected: no matches.

**Step 6: Verify new patterns are present**

```bash
grep -n "Task Granularity\|## PR 1:\|Step 1: Write\|Step 5: Verify\|Step 6: Commit\|\"prs\":" plugins/superpowers/skills/writing-plans/SKILL.md
```

Expected: all found.

**Step 7: Commit**

```bash
git add plugins/superpowers/skills/writing-plans/SKILL.md
git commit -m "feat(writing-plans): restore PR→Task→Step hierarchy with bold named steps"
```

**Acceptance Criteria:**
- [ ] "PR-Sized Task Granularity" replaced with "Task Granularity" describing 3-level hierarchy
- [ ] Plan structure template shows `## PR N:` sections with bold named step headers
- [ ] Every task ends with Verify + Commit as named steps
- [ ] `→ Open PR: "..."` line documented
- [ ] tasks.json template uses `prs` array only (no `tasks`)
- [ ] All numbering starts at 1

---

### Task 2: Update executing-plans/SKILL.md

**Files:**
- Modify: `plugins/superpowers/skills/executing-plans/SKILL.md`

**Step 1: Read the current file**

```bash
cat plugins/superpowers/skills/executing-plans/SKILL.md
```

**Step 2: Replace Step 0**

Find:
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

Replace with:
```
### Step 0: Load Persisted Tasks

Native tasks are always empty at session start — tasks.json is the sole persistent state.

1. **Locate tasks file:** `tasks.json` in the same directory as the plan file (e.g., `docs/plans/<feature-name>/tasks.json`)
2. If tasks.json has no `prs` key: the plan uses the old flat format — prompt the user to restructure with `## PR N:` sections before continuing.
3. Read the `prs` array to determine what to work on:
   - If a PR has `status: in_progress`: session was interrupted mid-PR. Check `git branch --show-current` — if a feature branch exists, re-run all tasks in this PR from the beginning of the branch. Proceed to Step 2 for this PR.
   - If no `in_progress` PR: find the next `pending` PR whose `blockedBy` IDs all have `status: completed`. Proceed to Step 1c then Step 2.
   - If all PRs are `completed`: invoke superpowers:finishing-a-development-branch.

**Committable mode:** Read the `**Committable:**` field from the plan header. If `false`, tasks file is `tasks.local.json` instead of `tasks.json`. Plan file is `plan.local.md` instead of `plan.md`.
```

**Step 3: Replace Step 1b**

Find:
```
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
```

Replace with:
```
### Step 1b: Bootstrap PRs from Plan (if needed)

If tasks.json has no `prs` array or it is empty:

1. Parse the plan document for `## PR N:` headers
2. For each PR section found, write an entry to the `prs` array:
   ```json
   { "id": N, "subject": "PR N: [title from plan]", "status": "pending" }
   ```
3. Set `blockedBy` in sequence (each PR blocked by the previous one)
4. Write the updated tasks.json to disk
```

**Step 4: Update Step 1c to fire at PR start**

Find:
```
### Step 1c: Branch Check (before each task)

Before starting each PR-task, check if on main/master:
```

Replace the header line only with:
```
### Step 1c: Branch Check (before each PR)

Before starting each PR, check if on main/master:
```

Then find the AskUserQuestion block inside Step 1c:
```
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
```

Replace with:
```
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
```

**Step 5: Replace Step 2 with PR-level execution**

Find the entire `### Step 2:` block (from `### Step 2: Execute PR-Task` through item 7):
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
```

Replace with:
```
### Step 2: Execute PR

**One PR at a time.** For the current PR:

1. Run Step 1c (Branch Check) — create branch if on main
2. **Write `status: in_progress` to `prs[N]` in tasks.json** immediately (recovery anchor)
3. **Execute all tasks within this PR:** For each `### Task N:` block in this PR's section in plan.md:
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
```

**Step 6: Update Step 3 session-end summary**

Find the current Step 3 content and replace/update so it reads:
```
### Step 3: Report

After each PR:

Present a session-end summary:
- What was completed (PR title + URL)
- Verification output
- How many PRs remain (from tasks.json `prs` array)
- Command to resume next session: `/superpowers:executing-plans <plan-path>`

**Session ends here.** Do NOT offer to continue to the next PR.
```

**Step 7: Update the Remember section**

Find the `## Remember` section and replace its bullets with:
```
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
```

**Step 8: Verify old patterns are gone**

```bash
grep -n "PR-task\|one PR-task\|Task N: \[task subject\]\|Create ALL step tasks\|\"tasks\":" plugins/superpowers/skills/executing-plans/SKILL.md
```

Expected: no matches.

**Step 9: Verify new patterns are present**

```bash
grep -n "prs\[N\]\|One PR at a time\|→ Open PR\|All tasks within a PR\|Do NOT open a PR between tasks" plugins/superpowers/skills/executing-plans/SKILL.md
```

Expected: all found.

**Step 10: Commit**

```bash
git add plugins/superpowers/skills/executing-plans/SKILL.md
git commit -m "feat(executing-plans): PR-level execution — branch per PR, tasks commit individually"
```

**Acceptance Criteria:**
- [ ] Step 0 reads `prs` array, not flat tasks
- [ ] Step 0 prompts user if no `prs` key found
- [ ] Step 1b bootstraps PRs from `## PR N:` headers (not tasks)
- [ ] Step 1c fires per PR, references PR subject in branch prompt
- [ ] Step 2 executes all tasks within PR without PR creation between them
- [ ] Step 2 opens PR at the end using `→ Open PR:` line for title
- [ ] No "continue or close?" between tasks — only at session end
- [ ] Remember section updated with PR-level language

---

### Task 3: Update subagent-driven-development/SKILL.md

**Files:**
- Modify: `plugins/superpowers/skills/subagent-driven-development/SKILL.md`

**Step 1: Read the current file**

```bash
cat plugins/superpowers/skills/subagent-driven-development/SKILL.md
```

**Step 2: Update the process graph — remove per-task PR creation, add per-PR PR creation**

In the `digraph process` dot block, make these changes:

Remove these three edges:
```
    "TaskUpdate: mark task completed" -> "Push branch + create PR";
    "Push branch + create PR" -> "Switch back to main";
    "Switch back to main" -> "Ask: continue or close?";
    "Ask: continue or close?" -> "More tasks remain?" [label="continue"];
    "Ask: continue or close?" -> "Close session" [label="close"];
    "More tasks remain?" -> "Dispatch implementer subagent (./implementer-prompt.md)" [label="yes"];
    "More tasks remain?" -> "Dispatch final code reviewer subagent for entire implementation" [label="no"];
```

Remove these nodes:
```
    "Push branch + create PR" [shape=box];
    "Switch back to main" [shape=box];
    "Ask: continue or close?" [shape=diamond];
    "Close session" [shape=box];
    "More tasks remain?" [shape=diamond];
```

Add these nodes and edges in their place:
```
    "More tasks remain in this PR?" [shape=diamond];
    "Push branch + create PR" [shape=box];
    "Switch back to main" [shape=box];
    "Ask: continue to next PR or close?" [shape=diamond];
    "Close session" [shape=box];
    "More PRs remain?" [shape=diamond];

    "TaskUpdate: mark task completed" -> "More tasks remain in this PR?";
    "More tasks remain in this PR?" -> "Dispatch implementer subagent (./implementer-prompt.md)" [label="yes"];
    "More tasks remain in this PR?" -> "Push branch + create PR" [label="no"];
    "Push branch + create PR" -> "Switch back to main";
    "Switch back to main" -> "Ask: continue to next PR or close?";
    "Ask: continue to next PR or close?" -> "More PRs remain?" [label="continue"];
    "Ask: continue to next PR or close?" -> "Close session" [label="close"];
    "More PRs remain?" -> "Dispatch implementer subagent (./implementer-prompt.md)" [label="yes"];
    "More PRs remain?" -> "Dispatch final code reviewer subagent for entire implementation" [label="no"];
```

**Step 3: Replace "Per-Task Branch and PR Flow" section**

Find the entire section from `## Per-Task Branch and PR Flow` through `**Committable mode:** ...`:
```
## Per-Task Branch and PR Flow

**Before each task:**

Check if on main/master. If so, ask for branch name and create branch (same as executing-plans Step 1c).

**After task passes both reviews:**

1. Push branch and create PR:
   ```bash
   git push -u origin <branch-name>
   gh pr create --title "Task N: [task subject]" --body "..."
   ```
2. Switch back to main: `git checkout main && git pull`
3. Mark PR-task completed in native tasks AND tasks.json
4. Ask: "Continue to next task, or close session?"

**After final task:**
- Dispatch final code-reviewer subagent for entire implementation (unchanged)
- Invoke finishing-a-development-branch for plan archiving (we're on main, no feature branch — skill detects this and skips to archiving)

**Committable mode:** Read the `**Committable:**` field from the plan header. Use correct file extensions for tasks.json (or tasks.local.json).
```

Replace with:
```
## Per-PR Branch and PR Flow

**Before each PR (not each task):**

Check if on main/master. If so, ask for branch name and create branch — same as executing-plans Step 1c but referencing the PR subject: `"What branch name for PR N: [pr subject]?"`. Write `status: in_progress` to `prs[N]` in tasks.json immediately.

**Within a PR — after each task passes both reviews:**

- Mark task completed in native tasks
- **Do NOT open a PR** — continue to the next task in the PR
- **Do NOT ask "continue or close?"** between tasks

**After all tasks in the PR pass reviews:**

1. Push branch and open PR using the `→ Open PR: "..."` title from the plan:
   ```bash
   git push -u origin <branch-name>
   gh pr create --title "[title from → Open PR line]" --body "$(cat <<'EOF'
   ## Summary
   [Task subjects completed in this PR, one per line]

   ## Acceptance Criteria
   [Acceptance criteria from each task in this PR]
   EOF
   )"
   ```
2. Switch back to main: `git checkout main && git pull`
3. Write `status: completed` to `prs[N]` in tasks.json
4. Ask: "Continue to next PR, or close session?"

**After final PR:**
- Dispatch final code-reviewer subagent for entire implementation
- Invoke finishing-a-development-branch for plan archiving

**Committable mode:** Read the `**Committable:**` field from the plan header. Use correct file extensions for tasks.json (or tasks.local.json).
```

**Step 4: Update the Example Workflow**

Find the section showing per-task PR flow in the example (around `[Mark Task 1 complete]`):
```
[Mark Task 1 complete]
[Push branch, create PR]
[Switch to main]
[Ask: continue or close?]

Task 2: Recovery modes
```

Replace with:
```
[Mark Task 1 complete — no PR yet, more tasks in this PR]

Task 2: Recovery modes
```

And find the end of the last task in the example (around `[Mark Task 2 complete]`):
```
[Mark Task 2 complete]
[Push branch, create PR]
[Switch to main]
[Ask: continue or close?]
```

Replace with:
```
[Mark Task 2 complete — all tasks in PR 1 done]
[Push branch, create PR for PR 1]
[Switch to main]
[Ask: continue to next PR or close?]
```

**Step 5: Verify old patterns are gone**

```bash
grep -n "Continue to next task\|PR-task completed\|Mark Task.*complete\]$\|Per-Task Branch" plugins/superpowers/skills/subagent-driven-development/SKILL.md
```

Expected: no matches.

**Step 6: Verify new patterns are present**

```bash
grep -n "Per-PR Branch\|More tasks remain in this PR\|→ Open PR\|Continue to next PR\|Do NOT open a PR" plugins/superpowers/skills/subagent-driven-development/SKILL.md
```

Expected: all found.

**Step 7: Commit**

```bash
git add plugins/superpowers/skills/subagent-driven-development/SKILL.md
git commit -m "feat(subagent-driven): PR-level grouping — PR opens after all tasks in PR complete"
```

**Acceptance Criteria:**
- [ ] Process graph shows "More tasks remain in this PR?" after each task completion
- [ ] PR opened only after all tasks in a PR pass reviews
- [ ] "Continue or close?" prompt fires after PR is opened, not after each task
- [ ] Section renamed to "Per-PR Branch and PR Flow"
- [ ] Example workflow updated to show per-PR grouping

---

### Task 4: Bump plugin version

**Files:**
- Modify: `plugins/superpowers/.claude-plugin/plugin.json`

**Step 1: Update version from 1.3.0 to 1.4.0**

In `plugins/superpowers/.claude-plugin/plugin.json`, change:
```json
"version": "1.3.0"
```
To:
```json
"version": "1.4.0"
```

**Step 2: Verify**

```bash
grep "version" plugins/superpowers/.claude-plugin/plugin.json
```

Expected: `"version": "1.4.0"`

**Step 3: Commit**

```bash
git add plugins/superpowers/.claude-plugin/plugin.json
git commit -m "chore(superpowers): bump version to 1.4.0"
```

**Acceptance Criteria:**
- [ ] plugin.json version is `"1.4.0"`

→ Open PR: "feat: restore PR → Task → Step hierarchy across all execution workflows"
