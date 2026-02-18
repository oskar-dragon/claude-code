# Bug Fix: tasks.json Not Updated on Task Completion — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the `executing-plans` skill so that `tasks.json` task statuses are updated every time a task transitions to `in_progress` or `completed`.

**Architecture:** Single text edit to `plugins/superpowers/skills/executing-plans/SKILL.md` — the per-task checklist in Step 2 is updated so both status transitions explicitly instruct Claude to update `tasks.json` (in addition to calling `TaskUpdate`). Co-location of the instruction with the action eliminates the disconnect that caused the bug.

**Tech Stack:** Markdown prompt engineering — no code, no build step.

---

### Task 1: Update Step 2 checklist in executing-plans/SKILL.md

**Files:**

- Modify: `plugins/superpowers/skills/executing-plans/SKILL.md:55-58`

**Step 1: Verify the current text at lines 55–58 matches what we expect to replace**

```bash
grep -n "Mark as in_progress\|Mark as completed" plugins/superpowers/skills/executing-plans/SKILL.md
```

Expected output:
```
55:1. Mark as in_progress
58:4. Mark as completed
```

If the line numbers differ, adjust the edit to match. Do not proceed until grep confirms the text is exactly as expected.

**Step 2: Apply the edit**

Replace this block (lines 55–58):

```
1. Mark as in_progress
2. Follow each step exactly (plan has bite-sized steps)
3. Run verifications as specified
4. Mark as completed
```

With:

```
1. Mark as in_progress: `TaskUpdate` (status: in_progress), then update `tasks.json`
   (set the task's `"status"` to `"in_progress"` and update the root-level `"lastUpdated"`)
2. Follow each step exactly (plan has bite-sized steps)
3. Run verifications as specified
4. Mark as completed: `TaskUpdate` (status: completed), then update `tasks.json`
   (set the task's `"status"` to `"completed"` and update the root-level `"lastUpdated"`)
```

Use the Edit tool with `old_string`/`new_string` — do not use sed.

**Step 3: Verify the change was applied correctly**

```bash
grep -n "Mark as in_progress\|Mark as completed\|tasks.json\|lastUpdated" plugins/superpowers/skills/executing-plans/SKILL.md
```

Expected output (line numbers approximate):
```
26:Update `tasks.json` after every task status change.
55:1. Mark as in_progress: `TaskUpdate` (status: in_progress), then update `tasks.json`
56:   (set the task's `"status"` to `"in_progress"` and update the root-level `"lastUpdated"`)
59:4. Mark as completed: `TaskUpdate` (status: completed), then update `tasks.json`
60:   (set the task's `"status"` to `"completed"` and update the root-level `"lastUpdated"`)
```

**Step 4: Read the full Step 2 section to confirm it reads naturally**

Read lines 49–59 of the file and confirm the section is coherent and correctly formatted.

**Step 5: Commit**

```bash
git add plugins/superpowers/skills/executing-plans/SKILL.md
git commit -m "fix: explicitly co-locate tasks.json update in executing-plans Step 2"
```

Expected: commit succeeds with no pre-commit hook failures.

**Acceptance Criteria:**

- The four-line checklist in Step 2 now has explicit `tasks.json` update instructions on lines 1 and 4
- `"lastUpdated"` is described as root-level in both instructions
- No other lines in the file were changed
- File is committed
