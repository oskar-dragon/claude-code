# Committable Mode & PR-Sized Tasks

## Goal

Update superpowers skills to support (1) a committable/non-committable document mode for the entire workflow, and (2) PR-sized task granularity in plans instead of 2-5 minute bite-sized steps.

## Architecture

The core workflow is unchanged: brainstorming -> design review -> writing-plans -> executing-plans/subagent-driven -> finishing-a-development-branch. Changes are metadata propagation (committable flag in plan headers) and task restructuring (PR-sized tasks with steps inside). No new skills, agents, or files beyond what already exists.

## Tech Stack

Markdown skill files, YAML frontmatter, tasks.json persistence format.

## Committable Mode

### How it works

Brainstorming asks one extra question at workflow start:

```yaml
AskUserQuestion:
  question: "Should planning documents for this workflow be committed to git?"
  options:
    - label: "Yes, commit to git (Recommended)"
      description: "Documents use .md extension and are committed. Good for team visibility and history."
    - label: "No, keep local only"
      description: "Documents use .local.md extension and stay gitignored. Good for exploratory/throwaway work."
```

### Metadata in plan header

Both design doc and plan doc include:

```markdown
**Committable:** true
```

in their standard header block. Downstream skills read this field.

### File naming

| Committable | Design | Plan | Tasks |
|---|---|---|---|
| `true` | `design.md` | `plan.md` | `tasks.json` |
| `false` | `design.local.md` | `plan.local.md` | `tasks.local.json` |

### Commit behavior

- **Committable = true:** Skills commit documents as they do today (no change).
- **Committable = false:** Skills skip all `git add`/`git commit` steps for planning documents. Implementation commits (actual code) are always committed regardless.

### Propagation

- Brainstorming writes the flag in the design doc header.
- Writing-plans reads it from the design doc and copies it to the plan doc header.
- Executing-plans and subagent-driven-development read it from the plan doc header.
- No separate config file needed.

### Gitignore

`.local.md` and `.local.json` files are assumed to already be gitignored by the project. Skills do not manage .gitignore entries.

## PR-Sized Task Granularity

### Task format in plans

Each task in plan.md is a complete, PR-able deliverable:

```markdown
### Task 1: Implement user auth endpoint

**Files:**
- Create: `src/auth/handler.ts`
- Test: `tests/auth/handler.test.ts`

**Steps:**
1. Write failing test for auth endpoint
2. Run test -- verify it fails
3. Implement minimal handler
4. Run test -- verify it passes
5. Commit: `feat: add user auth endpoint`

**Acceptance Criteria:**
- [ ] Endpoint returns 200 with valid token
- [ ] Returns 401 without token
```

### Native task mapping

- Only PR-level tasks get `TaskCreate` (one per `### Task N:`).
- Steps within are instructions in the task description -- no nested TaskCreate at plan time.
- `tasks.json` tracks PR-level tasks only.
- Dependencies between PR-tasks use `addBlockedBy` as today.

### Step subtasks at execution time

When executing a PR-task, the executing skill creates native subtasks for each step:

```
Task #1: Implement user auth endpoint          [in_progress]
  Task #1a: Write failing test                 [completed]
  Task #1b: Run test -- verify failure         [completed]
  Task #1c: Implement minimal handler          [in_progress]
  Task #1d: Run test -- verify pass            [pending]
  Task #1e: Commit                             [pending]
```

Subtasks are created on-the-fly when the PR-task starts executing, chained with `addBlockedBy`. The parent PR-task is marked completed in native tasks AND tasks.json only after all subtasks are done AND the PR/merge is handled via finishing-a-development-branch.

## Execution Flow Changes

### Executing-plans (new flow)

1. **Load plan** -- read tasks.json, find first pending PR-task.
2. **Branch check** -- if on main/master, ask for branch name, create branch.
3. **Create step subtasks** -- parse steps from plan, TaskCreate each with `addBlockedBy` chaining.
4. **Execute steps** -- one by one, mark subtasks in_progress -> completed.
5. **All steps done** -- invoke finishing-a-development-branch skill.
6. **PR/merge handled** -- mark PR-task `completed` in native tasks AND tasks.json.
7. **Ask:** "Continue to next task, or close session?"

### Subagent-driven-development (new flow)

Same principle -- one PR-task at a time. Subagent gets the full PR-task with all steps. Review stages (spec + code quality) still happen after the subagent completes. Then finishing-a-development-branch, then update tasks.json.

### Branch naming

Before each PR-task, if on main:

```yaml
AskUserQuestion:
  question: "What branch name for Task N: [task subject]?"
  options:
    - label: "feat/[suggested-slug]"
      description: "Auto-generated from task subject"
    - label: "Custom name"
      description: "Enter your own branch name"
```

### Session resumption

Unchanged -- tasks.json is the source of truth for cross-session state. New session reads tasks.json, finds first non-completed PR-task, picks up from there.

## Skills Affected

| Skill | Changes |
|---|---|
| **brainstorming** | Ask committable question, add metadata to design doc header |
| **writing-plans** | Read committable metadata, use correct file extensions, PR-sized task format, only PR-level TaskCreates |
| **executing-plans** | One task at a time, create step subtasks on-the-fly, branch-per-task, update tasks.json on full completion |
| **subagent-driven-development** | One task at a time, same branch/PR flow, update tasks.json on full completion |

## No-Gos

- No new skills or agents
- No changes to brainstorming's core flow (just one question + metadata)
- No changes to design-reviewer agent
- No changes to TDD skill (red-green-refactor stays the same)
- No changes to finishing-a-development-branch (already handles PRs, branches, archiving)
- No changes to using-git-worktrees
- No gitignore management (`.local.md` assumed already ignored)
- No changes to code-reviewer agent
- No migration of existing plans (old plans work as-is: no `Committable` field = assume committable, old task granularity still parseable)
