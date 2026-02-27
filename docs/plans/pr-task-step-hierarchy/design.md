# PR → Task → Step Hierarchy — Design

**Committable:** true

## Goal

Restore a 3-level hierarchy in the superpowers planning/execution workflow:

- **PR** — a PR-worthy chunk of work (branch + pull request)
- **Task** — an atomic commit unit within a PR (each ends in verify + commit)
- **Step** — an implementation detail within a task (bold named header with content)

The current system collapsed Tasks and PRs into one level (each Task = its own PR). This design restores the original structure where many Tasks accumulate commits into one PR.

## Reference

Original step format preserved from `../superpowers/skills/writing-plans/SKILL.md`:
- Steps are **bold named headers** (`**Step N: Description**`) with content below
- Not numbered list items
- Final two steps of every task are always: `**Step N-1: Verify**` then `**Step N: Commit**`

## plan.md Structure

Plans gain a `## PR N:` top-level section. Tasks live inside PR sections. Numbering starts at 1.

```markdown
## PR 1: [PR-worthy description]

### Task 1: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`

**Step 1: [Action]**

[content — code, explanation, etc.]

**Step 2: Verify**

Run: `command`
Expected: output

**Step 3: Commit**

```bash
git add path/to/file
git commit -m "feat: description"
```

**Acceptance Criteria:**
- [ ] Criterion from design

### Task 2: [Next component]

...

→ Open PR: "PR title"

## PR 2: [Next PR-worthy description]

...
```

**Invariants:**
- Every task MUST end with a named Verify step then a named Commit step
- PR sections numbered from 1; tasks numbered globally from 1 across all PRs
- Single-PR plans still use `## PR 1:` (no implicit "whole plan = 1 PR")

## tasks.json Schema

```json
{
  "planPath": "docs/plans/<feature>/plan.md",
  "prs": [
    { "id": 1, "subject": "PR 1: Feature name", "status": "pending" },
    { "id": 2, "subject": "PR 2: Next feature", "status": "pending", "blockedBy": [1] }
  ],
  "tasks": [
    { "id": 1, "subject": "Task 1: ...", "status": "pending", "prId": 1 },
    { "id": 2, "subject": "Task 2: ...", "status": "pending", "prId": 1, "blockedBy": [1] },
    { "id": 3, "subject": "Task 3: ...", "status": "pending", "prId": 2, "blockedBy": [2] }
  ],
  "lastUpdated": "<timestamp>"
}
```

- PRs can have `blockedBy` other PR IDs
- Tasks reference their PR via `prId`
- Both start at 1

## Execution Flow Changes

### writing-plans

- Plan template updated to show `## PR N:` sections wrapping `### Task N:` blocks
- Task template updated to use bold named step headers (not numbered list)
- Template enforces Verify + Commit as the mandatory last two steps of every task
- tasks.json output updated to include `prs` array and `prId` on tasks

### executing-plans

- Step 0: reads `prs` array to find current PR (first `pending`/`in_progress` PR)
- Creates branch at PR start (not task start)
- Executes all tasks within that PR sequentially; each task commits on its own
- Opens PR when all tasks for that PR are `completed`
- Session ends after PR is opened — user starts a new session for the next PR
- Mid-session recovery: if a PR is `in_progress`, check git branch and resume

### subagent-driven-development

- Same PR-grouping logic: branch at PR start, subagent per task, PR after all PR tasks complete
- `tasks.json` written twice per PR: `in_progress` at PR start, `completed` after PR opens

## No-Gos

- **Not changing** `brainstorming` skill — task creation template stays as-is
- **Not changing** `finishing-a-development-branch` — still handles post-all-PRs cleanup
- **No backward-compat shim** for old flat plans without `## PR N:` sections — executing-plans will prompt user to restructure if no PRs found
- **Not touching** `tasks.json` path conventions
