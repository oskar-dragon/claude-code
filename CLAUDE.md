# Claude Code Flow - Architecture Guide

This document describes the high-level architecture of Claude Code Flow, a spec-driven development system built for Claude Code with GitHub Issues, Git worktrees, and parallel AI agents.

## Overview

Claude Code Flow is a dual-layer system:

1. **CLI Tool** (`cli/`) - Standalone command-line utility that manages PRDs, epics, tasks, and GitHub synchronization
2. **Claude Code Plugins** (`plugins/`) - Extensions that integrate the workflow into Claude Code via slash commands and hooks

## System Architecture

```
claude-code/
├── cli/                          # Standalone CLI tool (compiled to macOS/Linux binaries)
│   └── src/
│       ├── index.ts             # Bun entrypoint
│       ├── app.ts               # StriCLI application definition
│       ├── commands/            # Command implementations
│       │   ├── init.ts
│       │   ├── prd-list.ts, prd-status.ts
│       │   ├── epic-list.ts, epic-show.ts, epic-status.ts
│       │   ├── status.ts, standup.ts, next.ts
│       │   ├── blocked.ts, in-progress.ts
│       │   ├── validate.ts, search-cmd.ts, help-cmd.ts
│       │   └── ... (more commands)
│       └── utils/               # Shared utilities
│           ├── filesystem.ts    # File I/O operations
│           ├── git.ts           # Git commands
│           ├── github.ts        # GitHub CLI integration
│           ├── prds.ts          # PRD file management
│           ├── epics.ts         # Epic file management
│           ├── tasks.ts         # Task file management & transcript parsing
│           ├── validation.ts    # Input validation
│           ├── search.ts        # Search functionality
│           ├── plugin.ts        # Plugin registration/installation
│           └── output.ts        # Terminal formatting
│
├── plugins/                      # Claude Code plugin system
│   ├── flow/                    # Main project management plugin
│   │   ├── .claude-plugin/      # Plugin metadata
│   │   │   └── plugin.json
│   │   ├── commands/            # Slash command definitions
│   │   │   ├── pm/             # Project management commands (prd-new, epic-sync, etc.)
│   │   │   ├── context/        # Context management commands
│   │   │   └── testing/        # Testing-related commands
│   │   ├── agents/             # Task-oriented agent templates
│   │   ├── rules/              # Claude Code rule files
│   │   ├── hooks/              # Pre-tool-use hooks (e.g., bash-worktree-fix.sh)
│   │   ├── README.md           # Full workflow documentation
│   │   ├── AGENTS.md           # Parallel execution patterns
│   │   ├── COMMANDS.md         # Command reference
│   │   ├── CONTEXT_ACCURACY.md # Context preservation strategies
│   │   └── LOCAL_MODE.md       # Local-first operation
│   │
│   └── code-quality/           # Code quality hooks plugin
│       ├── .claude-plugin/     # Plugin metadata
│       ├── hooks/              # Hook implementations
│       │   └── formatting.ts   # Post-tool-use hook example
│       ├── templates/          # Hook templates for projects
│       │   └── hooks/
│       │       ├── lib.ts      # Shared hook utilities
│       │       ├── index.ts    # Entry point
│       │       └── session.ts  # Session data management
│       ├── utils.ts            # Utility functions
│       └── session.ts          # Session tracking
│
├── .claude-plugin/             # Root marketplace definition
│   └── marketplace.json        # Plugin registry
│
├── package.json                # Bun project manifest
├── biome.json                  # Code formatting/linting
└── .husky/                     # Git hooks


## Core Concepts

### 1. The Workflow Phases

**Phase 1: PRD Creation** → `.claude/prds/feature-name.md`
- Brainstorm product requirements
- Define user stories, success criteria, constraints

**Phase 2: Implementation Planning** → `.claude/epics/feature-name/epic.md`
- Transform PRD into technical architecture
- Create implementation plan with technical decisions

**Phase 3: Task Decomposition** → `.claude/epics/feature-name/[task].md`
- Break epic into concrete, parallel-safe tasks
- Add dependencies, effort estimates, acceptance criteria

**Phase 4: GitHub Synchronization**
- Push epic and tasks as GitHub Issues
- Maintain 1:1 mapping between local files and GitHub issues

**Phase 5: Parallel Execution**
- Specialized agents work on independent tasks
- Use Git worktrees for clean isolation
- Agents coordinate through Git commits

### 2. Dual-Mode Architecture

**CLI Mode** (Standalone tool via Homebrew)
```bash
claude-code-flow init              # Initialize project
claude-code-flow prd-list          # List PRDs
claude-code-flow epic-list         # List epics
claude-code-flow status            # Overall dashboard
```

**Plugin Mode** (Within Claude Code interface)
```
/pm:init                           # Initialize project
/pm:prd-new feature-name          # Create new PRD
/pm:prd-parse feature-name        # Parse PRD to epic
/pm:epic-sync feature-name        # Sync to GitHub
/pm:issue-start 1234              # Begin work on issue
/pm:next                          # Get next priority task
```

### 3. File Organization

**Local Workspace** (`.claude/` directory)
```
.claude/
├── prds/                         # Product Requirements Documents
│   ├── feature-a.md
│   └── feature-b.md
│
├── epics/                        # Implementation plans (git-ignored)
│   ├── feature-a/
│   │   ├── epic.md              # Overview and architecture
│   │   ├── 001.md               # Task before GitHub sync
│   │   ├── {issue-id}.md        # Task after GitHub sync
│   │   └── updates/             # Work-in-progress tracking
│   └── feature-b/
│
├── commands/
│   ├── pm/                       # Project management slash commands
│   │   ├── prd-new.md
│   │   ├── prd-parse.md
│   │   ├── epic-sync.md
│   │   ├── issue-start.md
│   │   └── ...
│   ├── context/                  # Context creation/management
│   └── testing/                  # Testing/validation commands
│
├── agents/                       # Task-specific agent templates
│   ├── backend-api.md           # For backend tasks
│   ├── frontend-ui.md           # For UI tasks
│   └── testing-qa.md            # For testing tasks
│
├── hooks/                        # Claude Code hooks
│   ├── bash-worktree-fix.sh     # Auto-cd to worktree
│   └── formatting.ts            # Post-tool hooks
│
└── settings.json                # Plugin configuration
```

**GitHub Issues** (Remote source of truth)
- Epic issue tracks sub-issues
- Labels: `epic:feature`, `task:feature`, `status:in-progress`
- Comments maintain progress/decision trail
- Uses gh-sub-issue extension for parent-child relationships

### 4. The Plugin System

**Two Plugin Types:**

**a) Flow Plugin** - Project management
- Provides `/pm:*` slash commands
- Manages PRDs, epics, and GitHub sync
- Maintains agent templates and rules
- Reads/writes local file structure

**b) Code-Quality Plugin** - Hook system
- Implements Claude Code hooks (PreToolUse, PostToolUse, etc.)
- Can validate, transform, or intercept tool execution
- Example: `bash-worktree-fix.sh` automatically prefixes commands with `cd /path/to/worktree &&`

**Plugin Registration Flow:**
```
marketplace.json (root registry)
  ↓
  contains plugins[].source (path)
  ↓
plugins/{name}/.claude-plugin/plugin.json
  ↓
Claude Code loads plugin from .claude-plugin/
```

### 5. GitHub Integration

**Why GitHub as Database:**
- Single source of truth for all work
- Enables human-AI collaboration
- Provides complete audit trail
- Works with existing CI/CD tools
- No dependency on separate project management tools

**Issue Relationships:**
- Epic issue #1234 (parent)
  - Task issue #1235 (child)
  - Task issue #1236 (child)
  - Task issue #1237 (child)

**Sync Strategy:**
- Local files: Fast, no network
- GitHub sync: Explicit, controlled
- Bidirectional: Can import existing issues
- Conflict resolution: Local files are source of truth

### 6. Parallel Execution System

**Key Insight:** One issue ≠ One task

A single "Implement authentication" issue becomes:
- Agent 1: Database schema & migrations
- Agent 2: Service layer & business logic
- Agent 3: API endpoints & middleware
- Agent 4: UI components & forms
- Agent 5: Tests & documentation

**All working simultaneously using:**
- Git worktrees for clean isolation
- Different agents per worktree
- Local coordination via Git commits
- Transparent to GitHub (clean PR at the end)

**Context Optimization:**
- Main thread stays strategic (oversight)
- Each agent has isolated context (implementation details)
- No context pollution or window limits
- Main thread becomes the conductor

### 7. Data Structures

**PRD Format:**
```markdown
---
name: Feature Name
description: Short description
status: backlog|in-progress|implemented
---

## User Stories
...

## Success Criteria
...
```

**Epic Format:**
```markdown
---
name: Epic Name
description: Overview
status: backlog|in-progress|completed
---

## Technical Architecture
...

## Task Breakdown
...
```

**Task Format:**
```markdown
---
name: Task Name
epic_name: parent-feature
status: backlog|in-progress|completed
depends_on: [task-1, task-2]
parallel: true|false
estimated_hours: 4
---

## Requirements
...

## Acceptance Criteria
...
```

## Key Technologies

- **Runtime:** Bun (fast TypeScript executor)
- **CLI Framework:** StriCLI (command routing)
- **Git Integration:** Git CLI + Node.js APIs
- **GitHub Integration:** gh CLI + extensions
- **Testing:** Bun test
- **Code Quality:** Biome (formatter + linter)
- **Hooks Framework:** Custom TypeScript-based system

## Deployment Model

**Two Distribution Channels:**

1. **Homebrew (Binary Distribution)**
   - Precompiled binaries for macOS/Linux
   - Available via: `brew install claude-code-flow`
   - Single executable for CLI operations

2. **Claude Code Plugins (Source Distribution)**
   - Git-based marketplace
   - Installed via `/plugin install flow@claude-code`
   - Commands, agents, rules all in source form

## Critical Patterns

### 1. Task Dependencies
- Tasks explicitly declare dependencies
- System prevents parallel execution of dependent tasks
- Ensures safe concurrent development

### 2. Context Preservation
- `.claude/context/` directory for shared context
- Agents read context before work
- Progress updates stored locally before GitHub sync
- Transcript analysis for decision recovery

### 3. Worktree Isolation
- Each epic gets its own Git worktree: `../epic-{name}/`
- Bash hook automatically injects `cd` prefix
- Agents work naturally without worktree awareness
- Clean merge when work is complete

### 4. No Vibe Coding
- Every line of code traces to specification
- 5-phase discipline: Brainstorm → Document → Plan → Execute → Track
- Transparent audit trail in GitHub
- Clear decision rationale in issue comments

## Development Workflow

### For CLI Changes:
```bash
bun run dev                    # Test locally
bun run typecheck             # Check types
bun run test                  # Run tests
bun run biome:check           # Check formatting
bun run build:all             # Build for all platforms
```

### For Plugin Changes:
1. Edit files in `plugins/{name}/`
2. Test in Claude Code by installing locally
3. Verify hooks execute correctly
4. Commit changes

### Testing Principles:
- Unit tests for utilities (prds.ts, tasks.ts, etc.)
- Integration tests for commands
- Always test with real GitHub repo when possible
- Use AAA pattern (Arrange, Act, Assert)

## Important Conventions

**File Naming:**
- Commands: kebab-case (e.g., `prd-new.md`, `epic-sync.md`)
- Variables: camelCase
- Classes/Types: PascalCase
- Directories: kebab-case

**Command Structure:**
- Commands defined in `plugins/flow/commands/pm/*.md`
- Slash command: `/pm:{command-name}`
- Arguments passed via `$ARGUMENTS` in markdown

**Hook System:**
- Handlers export hook types from lib.ts
- Payload types match Claude Code specifications
- Each hook is a separate executable script
- Session data persisted to temp directory

## Security & Isolation

- Plugins have explicit permissions via rules
- Tools restricted to whitelisted functions
- GitHub authentication via `gh` CLI (secure)
- No credentials stored in plugin code
- Worktrees provide git-level isolation

## Performance Considerations

- CLI tool compiled with Bun (very fast startup)
- File operations cached where possible
- GitHub API calls batch when possible
- Local file operations never network
- Parallel agents share worktree resources efficiently

## Future Extensibility

The architecture supports:
- Additional plugins via marketplace
- Custom hook implementations
- Extended command frameworks
- GitHub Projects visualization layer
- Custom agent specialization

