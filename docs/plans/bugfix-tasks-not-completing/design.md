# Bug Fix: tasks.json Not Updated on Task Completion

## Problem

When using the `executing-plans` workflow, `tasks.json` task statuses are not updated from `pending` to `completed` as tasks are executed.

**Evidence:** `docs/plans/delivery-diagram-command/tasks.json` shows both tasks as `"pending"` despite the delivery-diagram command file having been created (i.e., tasks were executed).

## Root Cause

In `plugins/superpowers/skills/executing-plans/SKILL.md`, the only instruction to update `tasks.json` is in Step 0 as a brief note:

> "Update `tasks.json` after every task status change."

When Claude executes Step 2 ("Execute Batch"), the checklist says "Mark as completed" — which Claude interprets as calling `TaskUpdate` (native task tool) only. The Step 0 note is mentally disconnected from the Step 2 action, so `tasks.json` is never written.

## Fix

**File:** `plugins/superpowers/skills/executing-plans/SKILL.md`

**Change:** In Step 2, make the `tasks.json` update explicit and co-located with both status transitions (`in_progress` and `completed`), including a concrete description of what to update.

### Current Step 2 (per-task checklist)

```
1. Mark as in_progress
2. Follow each step exactly (plan has bite-sized steps)
3. Run verifications as specified
4. Mark as completed
```

### Proposed Step 2 (per-task checklist)

```
1. Mark as in_progress: TaskUpdate (status: in_progress) then update tasks.json
   (set the task's "status" to "in_progress" and update "lastUpdated")
2. Follow each step exactly (plan has bite-sized steps)
3. Run verifications as specified
4. Mark as completed: TaskUpdate (status: completed) then update tasks.json
   (set the task's "status" to "completed" and update "lastUpdated")
```

## No-Gos

- Do not touch `subagent-driven-development` — not reported as broken
- Do not restructure the skill or add new steps — smallest effective change
- Do not change how `tasks.json` is initialized (Step 0 / writing-plans are fine)
