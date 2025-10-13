# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Claude Code Flow** - A CLI tool that implements a workflow system for spec-driven development using GitHub Issues, Git worktrees, and parallel AI agents. Transforms PRDs into epics, epics into GitHub issues, and issues into production code with full traceability.

## Commands

### Development
- `bun run dev` - Run CLI in development mode
- `bun test` - Run all tests
- `bun run typecheck` - Type check without emitting files

### Build
- `bun run build` - Build for current platform
- `bun run build:macos-arm64` - Build standalone binary for macOS ARM64
- `bun run build:macos-x64` - Build standalone binary for macOS x64
- `bun run build:linux-x64` - Build standalone binary for Linux x64
- `bun run build:all` - Build all platform binaries

### Code Quality
- `bun run biome:check` - Check code quality
- `bun run biome:format` - Format code
- `bun run biome:lint` - Lint code
- `bun run biome:fix` - Auto-fix issues (format + lint)
- `bun run biome:ci` - CI mode (no writes)
- `bun run check:all` - Run typecheck, biome:ci, and tests

### Git Hooks
- Pre-commit hook automatically runs `bunx biome check --write --staged` on staged files

## Architecture

### CLI Framework
Built with **Stricli** (`@stricli/core`) for command routing and application structure. Entry point is `cli/src/index.ts`, app definition in `cli/src/app.ts`.

### Commands
- **init** (`cli/src/commands/init.ts`) - Initialize Claude Code Flow System
  - Checks/installs GitHub CLI
  - Authenticates GitHub
  - Installs gh-sub-issue extension
  - Creates directory structure (`.claude/prds`, `.claude/epics`, `.claude/rules`, `.claude/agents`, `.claude/scripts/pm`)
  - Creates GitHub labels (epic, task)
  - Generates CLAUDE.md template

- **validate** (`cli/src/commands/validate.ts`) - Validate PM System integrity
  - Checks directory structure
  - Validates data integrity (epic.md files, orphaned tasks)
  - Verifies task references and dependencies
  - Validates frontmatter in markdown files

### Utility Modules
- **filesystem** (`cli/src/utils/filesystem.ts`) - Directory/file operations, CLAUDE.md template
- **git** (`cli/src/utils/git.ts`) - Git repository checks using `Bun.$`
- **github** (`cli/src/utils/github.ts`) - GitHub CLI operations (install, auth, extensions, labels)
- **validation** (`cli/src/utils/validation.ts`) - System integrity checks
- **output** (`cli/src/utils/output.ts`) - Formatted console output helpers
- **plugin** (`cli/src/utils/plugin.ts`) - Plugin system utilities

### Plugin System
The **Flow plugin** (`plugins/flow/`) contains the full project management system:
- **commands/** - Slash commands for PM workflow (`/pm:*`, `/context:*`, `/testing:*`)
- **agents/** - Specialized agents (file-analyzer, code-analyzer, test-runner, parallel-worker)
- **rules/** - Operational rules (github-operations, worktree-operations, path-standards, etc.)
- **scripts/** - Shell scripts for PM operations

## Code Quality Standards

### Biome Configuration
- **Formatter**: Tabs, 100-char line width, double quotes, semicolons, ES5 trailing commas
- **Linter**: Recommended rules + custom overrides
  - Error: unused variables/imports, hook violations
  - Warn: cognitive complexity, negation else, parameter assign
  - Off: console, forEach
- **Array type syntax**: Shorthand (`string[]` not `Array<string>`)
- **Organize imports**: Enabled

### Git Workflow
- Pre-commit hook runs Biome checks and auto-fixes staged files
- Commit fails if Biome finds unfixable errors
- Fixed files are automatically re-staged

## Testing

- **Framework**: Bun's built-in test runner (`bun:test`)
- **Pattern**: Co-located test files (e.g., `git.ts` → `git.test.ts`)
- **Location**: Test files in same directory as source files
- **Run specific test**: `bun test <file-path>`

## TypeScript Configuration

- **Target/Module**: ESNext with module preservation
- **Module Resolution**: Bundler mode
- **Strict mode**: Enabled with `noUncheckedIndexedAccess` and `noImplicitOverride`
- **No emit**: TypeScript used only for type checking (Bun handles execution)

## Project Structure

```
cli/
├── src/
│   ├── index.ts           # Entry point
│   ├── app.ts             # Stricli app definition
│   ├── commands/          # CLI commands (init, validate)
│   └── utils/             # Utility modules
└── dist/                  # Build output

plugins/
└── flow/                  # Flow plugin (PM system)
    ├── commands/          # Slash commands
    ├── agents/            # AI agents
    ├── rules/             # Operational rules
    └── scripts/           # Shell scripts

.claude/                   # Created by init command
├── prds/                  # Product requirements
├── epics/                 # Epic implementations
├── rules/                 # Custom rules
├── agents/                # Custom agents
└── scripts/pm/            # PM scripts
```

## Key Design Decisions

- **Bun-first**: Uses Bun's native APIs (`Bun.$`, `Bun.file`) over Node.js equivalents
- **Local-first**: All operations work on local files first, sync to GitHub explicitly
- **No Projects API**: Uses GitHub Issues directly with labels and parent-child relationships
- **Worktrees for isolation**: Parallel work in separate worktrees prevents conflicts
- **Context preservation**: Agents shield main conversation from verbose output
