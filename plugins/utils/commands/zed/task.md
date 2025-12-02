---
name: zed-task
version: v1.0.0
author: Oskar Dragon
description: Generate Zed task configuration with intelligent defaults
argument-hint: "[task-description]"
---

## Context

- Task description: $ARGUMENTS
- Current directory: !`pwd`
- Existing .zed directory: !`test -d .zed && echo "exists" || echo "not found"`
- Current tasks file: !`test -f .zed/tasks.json && echo "found" || echo "not found"`
- Project type: !`fd -t f "(package.json|go.mod|Cargo.toml|pyproject.toml)" -d 1 | head -3`
- Available scripts: !`test -f package.json && jq -r '.scripts | keys[]' package.json 2>/dev/null | head -5 || echo "none"`

## Your Task

**STEP 1: Parse Task Description**

- EXTRACT task requirements from $ARGUMENTS
- DETERMINE project type from available files (package.json, go.mod, etc.)
- IDENTIFY task category:
  - IF contains "test" → test runner task
  - IF contains "dev" OR "serve" → development server task
  - IF contains "build" → build task
  - IF contains "format" OR "fmt" → formatting task
  - ELSE → custom command task

**STEP 2: Analyze Existing Zed Configuration**

- CHECK if .zed directory exists
- IF .zed/tasks.json exists:
  - READ current configuration using Read tool
  - PARSE existing task labels to avoid duplicates
  - IDENTIFY patterns in existing tasks
- ELSE:
  - PREPARE to create new tasks.json structure

**STEP 3: Generate Task Configuration**

CREATE task object with:

- **Label**: Descriptive name based on $ARGUMENTS
- **Command**: Appropriate command based on project type and available scripts
- **Working Directory**: Always use $ZED_WORKTREE_ROOT
- **Terminal Settings**:
  - use_new_terminal: true for servers, false for quick tasks
  - allow_concurrent_runs: true for tests/formatters, false for servers
- **Reveal Behavior**:
  - "always" for servers
  - "on_error" for tests/builds
  - "never" for formatters

APPLY Zed variable best practices:

- $ZED_WORKTREE_ROOT for project-level operations
- $ZED_FILE for file-specific tasks
- $ZED_COLUMN/$ZED_ROW for cursor-aware operations

**STEP 4: Create or Update tasks.json**

IF .zed/tasks.json doesn't exist:

- CREATE .zed directory using Bash tool
- GENERATE new tasks.json with single task in array format
- WRITE file with proper JSON formatting

ELSE:

- READ existing tasks.json
- PARSE JSON structure
- ADD new task to existing array
- PRESERVE all existing tasks
- WRITE updated configuration using Edit tool

**STEP 5: Provide Usage Instructions**

- DISPLAY final task configuration in formatted JSON
- EXPLAIN Zed keyboard shortcuts:
  - `cmd-shift-p` → search "task: spawn"
  - `task: rerun` to repeat last task
  - Consider creating keybindings for frequent tasks
- DOCUMENT relevant Zed variables used in the task

## Task Templates

**Test Runner:**

```json
{
  "label": "Test current file",
  "command": "bun test $ZED_FILE",
  "cwd": "$ZED_WORKTREE_ROOT",
  "use_new_terminal": false,
  "allow_concurrent_runs": true,
  "reveal": "on_error"
}
```

**Development Server:**

```json
{
  "label": "Start dev server",
  "command": "bun dev",
  "cwd": "$ZED_WORKTREE_ROOT",
  "use_new_terminal": true,
  "allow_concurrent_runs": false,
  "reveal": "always"
}
```

**Formatter:**

```json
{
  "label": "Format file",
  "command": "bun fmt $ZED_FILE",
  "cwd": "$ZED_WORKTREE_ROOT",
  "use_new_terminal": false,
  "allow_concurrent_runs": true,
  "reveal": "never"
}
```

## Zed Variables

- `$ZED_WORKTREE_ROOT`: Project root directory
- `$ZED_FILE`: Currently selected file
- `$ZED_COLUMN`: Current cursor column
- `$ZED_ROW`: Current cursor row

## Usage

```
/tool:zed:task "run tests"
/tool:zed:task "start dev server"
/tool:zed:task "format current file"
```

## Examples

### Example 1: Test Runner

`/tool:zed:task "run tests"`

Creates a test task that runs the project's test command, reveals output on errors, and allows concurrent runs.

### Example 2: Development Server

`/tool:zed:task "start dev server"`

Creates a dev server task with a new terminal, prevents concurrent runs, and always shows output.

### Example 3: File Formatter

`/tool:zed:task "format current file"`

Creates a formatting task for the current file, never reveals output, and allows concurrent runs.

## After Task Creation

1. Use `cmd-shift-p` and search for "task: spawn"
2. Select your task from the list
3. Use "task: rerun" to repeat the last task
4. Consider creating keybindings for frequently used tasks
