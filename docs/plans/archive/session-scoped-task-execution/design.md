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
    { "id": 1, "subject": "Task 1: Frontend", "status": "in_progress", "blockedBy": [0] },
    { "id": 2, "subject": "Task 2: Tests", "status": "pending", "blockedBy": [1] }
  ],
  "lastUpdated": "2026-02-27T00:00:00Z"
}
```

Status values: `pending` | `in_progress` | `completed`

---

### writing-plans changes

writing-plans outputs:
- `plan.md` — unchanged structure and content
- `tasks.json` — unchanged structure

**Removed:** the "Native Task Integration Reference" section entirely. writing-plans no longer calls `TaskCreate` for PR-level tasks — these are not mirrored into the native task list.

**Updated:** the "Initialize Task Tracking" section becomes read-only. It calls `TaskList` to check for existing brainstorming tasks (for awareness only) but never calls `TaskCreate` for PR-level tasks. All PR-level tasks go into tasks.json only.

---

### executing-plans — new session flow

#### Session start (replaces Step 0 bootstrap)

On session start, native tasks are always empty (they are ephemeral). The bootstrap no longer recreates PR-level native tasks from tasks.json. Instead:

1. **Read tasks.json** — find the next unblocked PR task:
   - status is `pending` AND all `blockedBy` IDs have status `completed`
   - If no such task exists: all PRs are done — invoke finishing-a-development-branch
2. **Write `status: in_progress`** for that PR to tasks.json immediately (recovery anchor — see Mid-session failure below)
3. **Read plan.md** — parse that PR's task section to extract its steps (see Step parsing below)
4. **Create step tasks sequentially** via `TaskCreate`, capturing each returned ID to wire the next step's `blockedBy`:
   - Create Step 1 → capture ID `s1`
   - Create Step 2 with `blockedBy: [s1]` → capture ID `s2`
   - Create Step 3 with `blockedBy: [s2]` → etc.

#### Execution

5. **Execute steps in order** — mark each step `in_progress` → `completed` as you go
6. **Create PR** after all steps are done

#### Session end

7. **Update tasks.json** — set that PR's `status` to `completed`, update `lastUpdated`
8. **Session ends** — present a summary of what was completed. No "Continue to next task" option. User returns in a new session for the next PR.

No PR-level native task is created. Only step tasks, only for the current PR.

---

### Step parsing from plan.md

plan.md uses a stable format defined by writing-plans. Steps are extracted from the PR task section:

```markdown
### Task N: [Component Name]

**Steps:**
1. Write failing test for [specific behavior]
2. Run test — verify it fails: `pytest tests/path/test.py -v`
3. Implement minimal code to pass test
...
```

Parsing rules:
- Locate the `### Task N:` header matching the current PR (by task ID)
- Find the `**Steps:**` subsection within that task
- Extract each numbered list item as a step subject
- Stop at the next `###` header or end of file

---

### Mid-session failure recovery

If a session ends mid-PR (crash, user closes Claude), tasks.json shows the PR as `in_progress` (written at step 2 above). On the next session:

1. executing-plans reads tasks.json — finds the PR with `in_progress` status
2. Checks the current git branch — if a feature branch for this PR exists, it resumes from there
3. Re-reads plan.md, re-creates all step tasks, and continues

This avoids re-running steps that already have commits. The user may need to manually verify which steps were already done if the branch exists but is mid-step.

---

## Data Flow

```
Session start
    │
    ▼
Read tasks.json
    │
    ├─ in_progress PR found? ──► Resume that PR (check git branch)
    │
    └─ No in_progress? ──► Find next unblocked pending PR
                                    │
                                    ▼
                          Write status: in_progress → tasks.json
                                    │
                                    ▼
                          Read plan.md → parse steps for this PR
                                    │
                                    ▼
                          TaskCreate Step 1 → capture ID s1
                          TaskCreate Step 2 (blockedBy: [s1]) → capture ID s2
                          TaskCreate Step N (blockedBy: [s(n-1)])
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
                          Write status: completed → tasks.json
                                    │
                                    ▼
                          Session end summary
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
- No "Continue to next task" prompt in executing-plans — one PR per session, hard boundary
