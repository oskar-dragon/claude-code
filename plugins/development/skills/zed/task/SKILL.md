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
