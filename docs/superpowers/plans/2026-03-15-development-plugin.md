# Development Plugin Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the `development` plugin by converting 5 existing git/utils commands into skills via the skill-creator eval loop, then update the marketplace and delete the old plugin directories.

**Architecture:** All components are skills under `plugins/development/skills/`. No commands directory. Skills are created iteratively using the skill-creator process with parallel with/without-skill eval runs. `dev-setup` has `disable-model-invocation: true` to prevent Claude invoking it automatically.

**Tech Stack:** Claude Code plugin system, superpowers:skill-creator, Python eval scripts (bundled with skill-creator), `claude` CLI.

**Spec:** `docs/superpowers/specs/2026-03-15-development-plugin-design.md`

---

## Chunk 1: Plugin scaffold + dev-setup skill

### Task 1: Create plugin scaffold

**Files:**
- Create: `plugins/development/.claude-plugin/plugin.json`
- Create: `plugins/development/skills/dev-setup/` (directory)
- Create: `plugins/development/skills/git/commit/` (directory)
- Create: `plugins/development/skills/git/commit-push-pr/` (directory)
- Create: `plugins/development/skills/git/clean-gone/` (directory)
- Create: `plugins/development/skills/zed/task/` (directory)

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p plugins/development/.claude-plugin
mkdir -p plugins/development/skills/dev-setup
mkdir -p plugins/development/skills/git/commit
mkdir -p plugins/development/skills/git/commit-push-pr
mkdir -p plugins/development/skills/git/clean-gone
mkdir -p plugins/development/skills/zed/task
```

- [ ] **Step 2: Write plugin.json**

```json
{
  "name": "development",
  "description": "Core development skills — git workflows, Zed tasks, and dev environment setup",
  "version": "1.0.0"
}
```

Save to: `plugins/development/.claude-plugin/plugin.json`

- [ ] **Step 3: Gitignore eval workspaces**

Eval workspaces created by skill-creator must not be committed. Add to `.gitignore` (create if absent):

```
plugins/development/skills/*-workspace/
```

```bash
echo 'plugins/development/skills/*-workspace/' >> .gitignore
```

- [ ] **Step 4: Commit scaffold**

```bash
git add plugins/development/ .gitignore
git commit -m "feat(development): scaffold plugin structure"
```

---

### Task 2: Create dev-setup skill via skill-creator

**Files:**
- Create: `plugins/development/skills/dev-setup/SKILL.md`
- Create: `plugins/development/skills/dev-setup/evals/evals.json`
- Create: `plugins/development/skills/dev-setup-workspace/` (eval workspace, gitignored)

- [ ] **Step 1: Invoke skill-creator**

Use the `@superpowers:skill-creator` skill. Provide this context:

> I want to create a skill called `dev-setup`. It must have `disable-model-invocation: true` — it is only ever invoked manually by the developer, never by Claude. When invoked as `/dev:setup`, it displays a human-readable onboarding checklist of manual steps the developer needs to complete after installing the `development` plugin. The primary step is installing superpowers, which cannot be auto-installed. The skill should be short, clear, and checklist-style — no automation, just instructions.

- [ ] **Step 2: Confirm draft SKILL.md with this initial structure**

```markdown
---
description: One-time developer setup after installing the development plugin. Shows manual steps required to complete the installation.
disable-model-invocation: true
---

Complete these steps after installing the `development` plugin:

**1. Add the official Anthropic marketplace** (skip if already added):
```
/plugin marketplace add anthropics/claude-plugins-official
```

**2. Install superpowers:**
```
/plugin install superpowers@claude-plugins-official
```

**3. Verify everything is installed:**
```
/plugin list
```

Once superpowers is installed, all development skills have access to the full superpowers workflow (TDD, brainstorming, debugging, etc.).
```

- [ ] **Step 3: Write evals.json**

Save to `plugins/development/skills/dev-setup/evals/evals.json`:

```json
{
  "skill_name": "dev-setup",
  "evals": [
    {
      "id": 1,
      "prompt": "I just installed the development plugin from the claude-code marketplace. What do I need to do to finish setting it up?",
      "expected_output": "Displays a clear checklist: add anthropics/claude-plugins-official marketplace, then install superpowers"
    },
    {
      "id": 2,
      "prompt": "run dev setup",
      "expected_output": "Shows the onboarding checklist with all required manual steps including /plugin marketplace add and /plugin install commands"
    },
    {
      "id": 3,
      "prompt": "I installed development@claude-code but the /git:commit skill doesn't seem to know about TDD or superpowers. How do I fix this?",
      "expected_output": "Displays the setup checklist guiding the developer to install superpowers manually"
    }
  ]
}
```

- [ ] **Step 4: Run eval loop (skill-creator)**

Follow the skill-creator process:
- Spawn with-skill and without-skill runs in parallel for all 3 prompts
- While runs are in progress, draft assertions (the skill should output the `/plugin install` command clearly)
- Generate eval viewer: `python <skill-creator-path>/eval-viewer/generate_review.py <workspace>/iteration-1 --skill-name "dev-setup" --benchmark <workspace>/iteration-1/benchmark.json`
- Review outputs and iterate until approved

- [ ] **Step 5: Commit approved skill**

```bash
git add plugins/development/skills/dev-setup/
git commit -m "feat(development): add dev-setup skill"
```

---

## Chunk 2: Git skills

### Task 3: Create git/commit skill via skill-creator

**Source:** `plugins/git/commands/commit.md`

**Files:**
- Create: `plugins/development/skills/git/commit/SKILL.md`
- Create: `plugins/development/skills/git/commit/evals/evals.json`
- Create: `plugins/development/skills/git-commit-workspace/` (eval workspace)

- [ ] **Step 1: Invoke skill-creator**

Use `@superpowers:skill-creator`. Provide this context:

> I want to convert an existing slash command into a skill called `git/commit`. The original command staged changes and created a git commit. Here is the source content:
>
> ```
> Dynamic context injected: git status, git diff HEAD, current branch, recent 10 commits.
> Task: Based on the above changes, create a single git commit. Stage and create the commit in a single message. No other tools, no other text.
> ```
>
> The skill should preserve this behaviour: read current git context, stage relevant files, write a good commit message, commit. It should not do anything else (no push, no PR).

- [ ] **Step 2: Confirm initial SKILL.md draft**

```markdown
---
description: Stage and commit current changes with an appropriate commit message. Use when the user says "commit", "commit my changes", "save my work to git", or similar.
---

Review the current state of the repository and create a focused, well-described commit.

## Steps

1. Check `git status` and `git diff HEAD` to understand what has changed
2. Stage the relevant files (prefer specific files over `git add -A` unless all changes belong together)
3. Write a commit message that explains *why* the change was made, not just what changed
4. Commit

## Constraints

- Do not push
- Do not create a PR
- Do not do anything beyond staging and committing
- Commit message should follow conventional commits format where appropriate (`feat:`, `fix:`, `chore:`, etc.)
```

- [ ] **Step 3: Write evals.json**

Save to `plugins/development/skills/git/commit/evals/evals.json`:

```json
{
  "skill_name": "git-commit",
  "evals": [
    {
      "id": 1,
      "prompt": "commit my changes",
      "expected_output": "Runs git status/diff, stages files, writes a conventional commit message, commits"
    },
    {
      "id": 2,
      "prompt": "I've updated the auth middleware and added some tests — can you commit this?",
      "expected_output": "Reads diff, stages relevant files, writes a meaningful commit message describing the auth middleware change"
    },
    {
      "id": 3,
      "prompt": "save my work",
      "expected_output": "Recognises this as a commit request, stages and commits without pushing"
    }
  ]
}
```

- [ ] **Step 4: Run eval loop (skill-creator)**

Follow the skill-creator process. Key assertion to check: skill commits without pushing.

- [ ] **Step 5: Commit approved skill**

```bash
git add plugins/development/skills/git/commit/
git commit -m "feat(development): add git/commit skill"
```

---

### Task 4: Create git/commit-push-pr skill via skill-creator

**Source:** `plugins/git/commands/commit-push-pr.md`

**Files:**
- Create: `plugins/development/skills/git/commit-push-pr/SKILL.md`
- Create: `plugins/development/skills/git/commit-push-pr/evals/evals.json`
- Create: `plugins/development/skills/git-commit-push-pr-workspace/` (eval workspace)

- [ ] **Step 1: Invoke skill-creator**

Use `@superpowers:skill-creator`. Provide this context:

> Convert a slash command into a `git/commit-push-pr` skill. The original command did:
> 1. Branch from main if on main
> 2. Commit with a good message
> 3. Push to origin
> 4. Check for a PR template at `.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/PULL_REQUEST_TEMPLATE/default.md`, `pull_request_template.md`, `docs/pull_request_template.md` (first match wins)
> 5. Create a PR with `gh pr create`, using the template if found, otherwise using a default Summary + Code changes structure
> 6. Do all of this in a single message (parallel tool calls)
>
> The skill should preserve this full workflow.

- [ ] **Step 2: Confirm initial SKILL.md draft**

```markdown
---
description: Full git workflow — commit, push, and open a pull request. Use when the user says "create a PR", "commit and push", "open a pull request", "I'm done with this feature", or similar.
---

Run the complete commit → push → PR workflow in one go.

## Steps

1. Check `git status` and `git diff HEAD`
2. If on `main` or `master`, create a new branch first
3. Stage and commit with a clear message
4. Push to origin
5. Look for a PR template by checking these paths in order (stop at first match):
   - `.github/pull_request_template.md`
   - `.github/PULL_REQUEST_TEMPLATE.md`
   - `.github/PULL_REQUEST_TEMPLATE/default.md`
   - `pull_request_template.md`
   - `docs/pull_request_template.md`
6. Create PR with `gh pr create`:
   - If a template was found: follow it exactly, preserving all section headings
   - If no template: use Summary + Code changes structure
   - Be concise — bullet points, no filler prose

## Constraints

- Do all steps in a single message using parallel tool calls
- Never skip the PR template if one exists
- PR description should explain *why*, not just *what*
```

- [ ] **Step 3: Write evals.json**

Save to `plugins/development/skills/git/commit-push-pr/evals/evals.json`:

```json
{
  "skill_name": "git-commit-push-pr",
  "evals": [
    {
      "id": 1,
      "prompt": "I'm done with this feature, create a PR",
      "expected_output": "Commits, pushes, and creates a PR with a meaningful description"
    },
    {
      "id": 2,
      "prompt": "commit push and open a pull request",
      "expected_output": "Full workflow: branch check, commit, push, PR creation"
    },
    {
      "id": 3,
      "prompt": "ship it",
      "expected_output": "Recognises as a commit+push+PR request and runs the full workflow"
    }
  ]
}
```

- [ ] **Step 4: Run eval loop (skill-creator)**

Key assertions: branches from main correctly, PR is created, template is used when present.

- [ ] **Step 5: Commit approved skill**

```bash
git add plugins/development/skills/git/commit-push-pr/
git commit -m "feat(development): add git/commit-push-pr skill"
```

---

### Task 5: Create git/clean-gone skill via skill-creator

**Source:** `plugins/git/commands/clean_gone.md`

**Files:**
- Create: `plugins/development/skills/git/clean-gone/SKILL.md`
- Create: `plugins/development/skills/git/clean-gone/evals/evals.json`
- Create: `plugins/development/skills/git-clean-gone-workspace/` (eval workspace)

- [ ] **Step 1: Invoke skill-creator**

Use `@superpowers:skill-creator`. Provide this context:

> Convert a slash command into a `git/clean-gone` skill. The command cleaned up local branches where the remote tracking branch is gone (deleted on remote). It handled worktrees too — branches with a `+` prefix have associated worktrees that must be removed before the branch can be deleted.
>
> The logic (note: `git fetch --prune` in step 1 is an intentional improvement over the original command, which did not fetch first — without it, [gone] status may be stale):
> 1. `git fetch --prune` to update remote tracking refs before checking
> 2. `git branch -v` to identify [gone] branches
> 3. `git worktree list` to identify associated worktrees
> 4. For each [gone] branch: remove worktree if present, then delete branch with `git branch -D`
> 5. Report what was cleaned up. If nothing to clean, say so.

- [ ] **Step 2: Confirm initial SKILL.md draft**

```markdown
---
description: Remove local git branches whose remote tracking branch has been deleted. Use when the user says "clean up branches", "remove stale branches", "tidy local branches", "delete gone branches", or similar.
---

Clean up local branches that no longer exist on the remote.

## Steps

1. Run `git fetch --prune` to sync remote tracking refs
2. Run `git branch -v` to identify branches with `[gone]` status
3. If none found, report "No stale branches to clean up" and stop
4. Run `git worktree list` to check for associated worktrees
5. For each `[gone]` branch:
   - If a worktree is associated (branch appears in `git worktree list`): `git worktree remove --force <path>`
   - Delete the branch: `git branch -D <branch-name>`
6. Report each branch and worktree removed

## Notes

- Branches with `+` prefix in `git branch -v` output have associated worktrees
- Do not touch the current branch or main/master
- This is irreversible — confirm with the user if there are many branches to delete
```

- [ ] **Step 3: Write evals.json**

Save to `plugins/development/skills/git/clean-gone/evals/evals.json`:

```json
{
  "skill_name": "git-clean-gone",
  "evals": [
    {
      "id": 1,
      "prompt": "clean up my stale branches",
      "expected_output": "Fetches, identifies [gone] branches, removes them with worktrees if present"
    },
    {
      "id": 2,
      "prompt": "I've merged a bunch of PRs and now I have loads of dead branches locally, can you tidy them up?",
      "expected_output": "Runs git fetch --prune, finds [gone] branches, deletes them, reports what was removed"
    },
    {
      "id": 3,
      "prompt": "remove branches deleted on remote",
      "expected_output": "Identifies and removes all [gone] branches including worktree cleanup"
    }
  ]
}
```

- [ ] **Step 4: Run eval loop (skill-creator)**

Key assertion: worktrees are removed before branch deletion when applicable.

- [ ] **Step 5: Commit approved skill**

```bash
git add plugins/development/skills/git/clean-gone/
git commit -m "feat(development): add git/clean-gone skill"
```

---

## Chunk 3: Zed skill + marketplace update + cleanup

### Task 6: Create zed/task skill via skill-creator

**Source:** `plugins/utils/commands/zed/task.md`

**Files:**
- Create: `plugins/development/skills/zed/task/SKILL.md`
- Create: `plugins/development/skills/zed/task/evals/evals.json`
- Create: `plugins/development/skills/zed-task-workspace/` (eval workspace)

- [ ] **Step 1: Invoke skill-creator**

Use `@superpowers:skill-creator`. Provide this context:

> Convert a slash command into a `zed/task` skill. The command generated Zed editor task configuration (`.zed/tasks.json`). It:
> 1. Parsed the task description from the argument
> 2. Detected project type from available files (package.json, go.mod, etc.)
> 3. Categorised the task (test runner, dev server, build, format, custom)
> 4. Read existing `.zed/tasks.json` if present to avoid duplicates
> 5. Generated appropriate task config with correct `use_new_terminal`, `allow_concurrent_runs`, and `reveal` settings
> 6. Created or updated `.zed/tasks.json`
>
> Templates:
> - Test runner: `use_new_terminal: false`, `allow_concurrent_runs: true`, `reveal: "always"`
> - Dev server: `use_new_terminal: true`, `allow_concurrent_runs: false`, `reveal: "always"`
> - Formatter: `use_new_terminal: false`, `allow_concurrent_runs: true`, `reveal: "never"`
>
> Always use `$ZED_WORKTREE_ROOT` for cwd, `$ZED_FILE` for file-specific tasks.

- [ ] **Step 2: Confirm initial SKILL.md draft**

```markdown
---
description: Generate or update Zed editor task configuration in .zed/tasks.json. Use when the user asks to "add a Zed task", "create a task for [action]", "set up a Zed task to run tests/dev server/formatter", or mentions .zed/tasks.json.
---

Create or update a task entry in `.zed/tasks.json` for the Zed editor.

## Steps

1. Understand the task being requested from the user's description
2. Detect project type from available config files (`package.json`, `go.mod`, `pyproject.toml`, etc.)
3. Classify the task type:
   - Contains "test" → test runner
   - Contains "dev", "serve", "start" → dev server
   - Contains "build" → build task
   - Contains "format", "fmt", "lint" → formatter
   - Otherwise → custom
4. If `.zed/tasks.json` exists, read it to avoid duplicate labels
5. Generate task config using the appropriate template below
6. Create `.zed/` directory if needed, then write or update `tasks.json`
7. Show the generated config and explain the keyboard shortcuts

## Task templates

**Test runner:**
```json
{
  "label": "<descriptive label>",
  "command": "<test command>",
  "cwd": "$ZED_WORKTREE_ROOT",
  "use_new_terminal": false,
  "allow_concurrent_runs": true,
  "reveal": "always"
}
```

**Dev server:**
```json
{
  "label": "<descriptive label>",
  "command": "<start command>",
  "cwd": "$ZED_WORKTREE_ROOT",
  "use_new_terminal": true,
  "allow_concurrent_runs": false,
  "reveal": "always"
}
```

**Formatter:**
```json
{
  "label": "<descriptive label>",
  "command": "<format command> $ZED_FILE",
  "cwd": "$ZED_WORKTREE_ROOT",
  "use_new_terminal": false,
  "allow_concurrent_runs": true,
  "reveal": "never"
}
```

## Zed variables

- `$ZED_WORKTREE_ROOT` — project root (use for cwd)
- `$ZED_FILE` — currently open file (use for file-specific tasks)

## After creation

Tell the user: use `cmd-shift-p` → "task: spawn" to run the task, or "task: rerun" to repeat the last one.
```

- [ ] **Step 3: Write evals.json**

Save to `plugins/development/skills/zed/task/evals/evals.json`:

```json
{
  "skill_name": "zed-task",
  "evals": [
    {
      "id": 1,
      "prompt": "add a zed task to run my tests with bun",
      "expected_output": "Creates .zed/tasks.json with a test runner task using bun test, correct terminal settings"
    },
    {
      "id": 2,
      "prompt": "I want to be able to start my Next.js dev server from Zed",
      "expected_output": "Detects Next.js project, creates dev server task with use_new_terminal: true"
    },
    {
      "id": 3,
      "prompt": "set up a format task for the current file using prettier",
      "expected_output": "Creates formatter task with $ZED_FILE, reveal: never, allow_concurrent_runs: true"
    }
  ]
}
```

- [ ] **Step 4: Run eval loop (skill-creator)**

Key assertion: correct `use_new_terminal`/`reveal`/`allow_concurrent_runs` values for each task type.

- [ ] **Step 5: Commit approved skill**

```bash
git add plugins/development/skills/zed/
git commit -m "feat(development): add zed/task skill"
```

---

### Task 7: Update marketplace.json

**Files:**
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Remove `git` and `utils` entries, add `development`**

In `.claude-plugin/marketplace.json`:
- Delete the `git` entry (lines with `"name": "git"` and its block)
- Delete the `utils` entry (lines with `"name": "utils"` and its block)
- Add before the first existing entry:

```json
{
  "name": "development",
  "version": "1.0.0",
  "source": "./plugins/development",
  "description": "Core development skills — git workflows, Zed tasks, and dev environment setup",
  "category": "development",
  "author": {
    "name": "Oskar Dragon"
  }
},
```

- [ ] **Step 2: Commit**

```bash
git add .claude-plugin/marketplace.json
git commit -m "feat: register development plugin in marketplace, remove git and utils"
```

---

### Task 8: Delete old plugin directories

**Files:**
- Delete: `plugins/git/` (entire directory)
- Delete: `plugins/utils/` (entire directory)

- [ ] **Step 1: Confirm nothing was missed**

```bash
# Verify all content accounted for
ls plugins/git/commands/
ls plugins/utils/commands/
```

Expected:
- `plugins/git/commands/`: `commit.md`, `commit-push-pr.md`, `clean_gone.md` — all migrated to `development` skills
- `plugins/utils/commands/zed/`: `task.md` — migrated to `development` skills

- [ ] **Step 2: Delete directories**

```bash
rm -rf plugins/git
rm -rf plugins/utils
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: delete git and utils plugins (migrated to development)"
```

---

### Task 9: Validate and smoke test

- [ ] **Step 1: Validate marketplace**

```bash
claude plugin validate .
```

Expected: no errors for `development` plugin.

- [ ] **Step 2: Verify skill paths resolve**

```bash
ls plugins/development/skills/dev-setup/
ls plugins/development/skills/git/commit/
ls plugins/development/skills/git/commit-push-pr/
ls plugins/development/skills/git/clean-gone/
ls plugins/development/skills/zed/task/
```

All should contain `SKILL.md`.

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add .
git commit -m "fix(development): address validation issues"
```
