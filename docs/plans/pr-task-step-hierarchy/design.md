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
- PR sections numbered from 1; tasks numbered globally from 1 across all PRs; steps numbered from 1 within each task
- Single-PR plans still use `## PR 1:` (no implicit "whole plan = 1 PR")
- The `→ Open PR: "..."` line at the end of each PR section is the PR title used by the executing skill

## tasks.json Schema

Only PRs are tracked — no task-level entries. The assumption is that a session either completes a PR fully or doesn't start it; mid-PR interruption is not a supported recovery scenario.

```json
{
  "planPath": "docs/plans/<feature>/plan.md",
  "prs": [
    { "id": 1, "subject": "PR 1: Feature name", "status": "pending" },
    { "id": 2, "subject": "PR 2: Next feature", "status": "pending", "blockedBy": [1] }
  ],
  "lastUpdated": "<timestamp>"
}
```

- PRs can have `blockedBy` other PR IDs
- Valid statuses: `pending`, `in_progress`, `completed`
- All IDs start at 1

## PR Grouping Heuristic (for writing-plans)

Group tasks into a PR when they collectively deliver **one independently deployable increment**. A PR is deployable when:
- All tests pass
- No type errors, lint errors, or formatting errors
- The feature is complete and reviewable — not half-finished or broken
- A reviewer can meaningfully assess it as a unit

A PR must not span unrelated concerns. When in doubt, split into more PRs.

## Execution Flow Changes

### writing-plans

- Plan template updated to show `## PR N:` sections wrapping `### Task N:` blocks
- Task template updated to use bold named step headers (not numbered list)
- Template enforces Verify + Commit as the mandatory last two steps of every task
- tasks.json output updated to contain only a `prs` array (no tasks array)
- Plan document includes PR grouping heuristic for the plan author

### executing-plans

- Step 0: reads `prs` array to find current PR (first `pending`/`in_progress` PR); writes `in_progress` to tasks.json immediately
- **Branch created once per PR** (not per task) — Step 1c fires at PR start, asking `"What branch name for PR N: [pr subject]?"`
- Executes all tasks within the PR sequentially; each task commits on its own
- **No "continue or close?" prompt between tasks** — tasks within a PR run uninterrupted
- When all tasks are done: opens PR using the `→ Open PR: "..."` title from the plan; body summarises the tasks completed and their acceptance criteria
- Marks PR `completed` in tasks.json, switches back to main
- Session ends after PR is opened — user starts a new session for the next PR

### subagent-driven-development

- Same PR-grouping logic: branch at PR start, subagent per task, PR after all tasks in the PR group complete
- **"Continue or close?" prompt fires after each PR is opened** — not after each task
- tasks.json written twice per PR: `in_progress` at PR start, `completed` after PR opens
- Within a PR, tasks execute sequentially without stopping to ask for continuation

## No-Gos

- **Not changing** `brainstorming` skill — task creation template stays as-is
- **Not changing** `finishing-a-development-branch` — still handles post-all-PRs cleanup
- **No backward-compat shim** for old flat plans without `## PR N:` sections — executing-plans will prompt the user to restructure if no `prs` key is found in tasks.json
- **Not touching** `tasks.json` path conventions
