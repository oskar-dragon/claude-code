# Session-Scoped Task Execution Design

**Committable:** true

**Goal:** executing-plans drives one PR per session — reading tasks.json to find the next unblocked PR, creating all its step tasks up front from plan.md, executing them, then marking the PR complete before ending the session.

**Problem:** Currently, writing-plans creates PR-level native tasks (Task 1, Task 2, Task 3), and executing-plans creates step tasks one-by-one on-the-fly during execution. This results in all PR tasks and step tasks mixed together in a flat native task list, making it hard to see what's actually in scope for the current session.

**Solution:** Native tasks are ephemeral session state only. tasks.json is the sole persistent PR-level tracker. Each session focuses on one PR: create all its steps at once, execute, complete, update tasks.json.

---

## Architecture

### tasks.json (no schema change)

Stays flat, PR-level only. Steps are not persisted — they are derived from plan.md each session.

```json
{
  "planPath": "docs/plans/feature/plan.md",
  "tasks": [
    { "id": 0, "subject": "Task 0: Backend endpoint", "status": "completed", "blockedBy": [] },
    { "id": 1, "subject": "Task 1: Frontend", "status": "pending", "blockedBy": [0] }
  ],
  "lastUpdated": "2026-02-27T00:00:00Z"
}
```

### writing-plans (remove TaskCreate calls)

writing-plans outputs:
- `plan.md` — unchanged structure and content
- `tasks.json` — unchanged structure

**Removed:** the `TaskCreate` calls for PR-level tasks. These were mirroring tasks.json into the native task list, which is no longer desired.

### executing-plans (new session flow)

When invoked:

1. **Read tasks.json** — find the next unblocked PR task (status: `pending`, all `blockedBy` IDs have status `completed`)
2. **Read plan.md** — locate that PR's task section, extract its numbered steps
3. **Create all step tasks at once** via `TaskCreate`, chained with `blockedBy` (Step N blocked by Step N-1)
4. **Execute steps in order** — mark each step `in_progress` → `completed`
5. **Create PR** after all steps are done
6. **Update tasks.json** — set that PR's `status` to `completed`, update `lastUpdated`
7. **Session ends** (user closes Claude, returns later for next PR)

No PR-level native task is created. Only step tasks, only for the current PR.

---

## Data Flow

```
Session start
    │
    ▼
Read tasks.json
    │
    ▼
Find next unblocked PR (pending + all blockedBy completed)
    │
    ▼
Read plan.md → extract steps for this PR
    │
    ▼
TaskCreate for each step (all at once, chained blockedBy)
    │
    ▼
Execute step 1 → mark completed
Execute step 2 → mark completed
    ...
Execute step N → mark completed
    │
    ▼
Create PR
    │
    ▼
Update tasks.json: PR status = "completed"
    │
    ▼
Session ends
```

---

## Commits

Commit behavior is defined by the steps in plan.md — not by this design. Typically: one commit at the end of the PR (after all tests pass), as the last step before push + PR creation. Intermediate commits within a PR are a plan-writing convention and not affected by this change.

---

## No-gos

- No change to tasks.json schema (stays flat, PR-level only)
- No step persistence in tasks.json — steps always re-derived from plan.md
- No change to brainstorming skill's task creation (design-phase tasks are a separate concern)
- No change to subagent-driven-development in this pass
- No change to the plan.md format or step structure
