# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Claude Code plugin marketplace repository containing reusable plugins for systematic development workflows, documentation, git operations, and PR review.

**Architecture**: Plugin-based system with:

- Command files (`.md` in `plugins/*/commands/`)
- Agent definitions (`.md` in `plugins/*/agents/`)
- Marketplace configuration (`.claude-plugin/marketplace.json`)

## Common Commands

### Development

```bash
# Run tests
bun test

# Type checking
bun run typecheck

# Format and lint
bun run biome:format    # Format code
bun run biome:lint      # Lint code
bun run biome:fix       # Auto-fix issues
bun run biome:check     # Check without fixing

# Run all checks (CI pipeline)
bun run check:all       # typecheck + biome:ci + test
```

### Git Workflow

Pre-commit hooks automatically run Biome checks on staged files. All commits must pass linting and formatting.

## Plugin Structure

### Plugin Organization

Each plugin follows this structure:

```
plugins/[plugin-name]/
├── README.md           # Plugin documentation
├── commands/           # Slash command definitions (.md files)
│   └── [command].md   # Command with YAML frontmatter + instructions
└── agents/             # Agent definitions (.md files)
    └── [agent].md     # Agent with specialized instructions
```

### Command File Format

Commands use YAML frontmatter:

```markdown
---
name: command-name
description: Brief description
version: 1.0.0
argument-hint: "[optional-args]"
---

# Command Implementation

[Markdown instructions for Claude]
```

### Marketplace Configuration

`.claude-plugin/marketplace.json` defines:

- Marketplace metadata (name, source, description)
- Plugin registry with name, version, source path, description, category
- GitHub source configuration

## Available Plugins

### 1. EPCC Workflow (`plugins/epcc/`)

Four-phase development workflow: Explore → Plan → Code → Commit

**Commands**:

- `/epcc-explore [area]` - Understand codebase before acting
- `/epcc-plan [feature]` - Create implementation strategy
- `/epcc-code [feature]` - Implement with TDD
- `/epcc-commit [message]` - Finalize with documentation
- `/epcc-prd [feature]` - Requirements gathering

**Key Agents**: code-archaeologist, system-designer, business-analyst, test-generator, documentation-agent, security-reviewer, optimization-engineer, ux-optimizer, qa-engineer, deployment-agent, project-manager, tech-evaluator

**Usage Pattern**: Always run phases sequentially. Exploration phase is READ-ONLY (no code changes).

### 2. Documentation (`plugins/documentation/`)

Diataxis framework for structured technical documentation

**Commands**:

- `/doc:tutorial [topic]` - Learning-oriented tutorials
- `/doc:howto [task]` - Task-oriented guides
- `/doc:explain [concept]` - Understanding-oriented explanations
- `/doc:reference [api]` - Information-oriented reference

**Key Agents**: docs-tutorial-agent, docs-howto-agent, docs-explanation-agent, docs-reference-agent, architecture-documenter

### 3. Git Operations (`plugins/git/`)

Streamlined git workflow commands

**Commands**:

- `/commit` - Auto-generate commit message and commit
- `/commit-push-pr` - Commit, push, and create PR
- `/clean-gone` - Remove local branches deleted from remote

### 4. PR Review (`plugins/pr-review/`)

Specialized review agents for comprehensive PR analysis

**Agents**:

- `comment-analyzer` - Comment accuracy and maintainability
- `pr-test-analyzer` - Test coverage quality
- `silent-failure-hunter` - Error handling review
- `type-design-analyzer` - Type design quality (1-10 ratings)
- `code-reviewer` - General code quality
- `code-simplifier` - Code simplification suggestions

## Code Style

### Formatting (Biome)

- **Indent**: Tabs (configured in biome.json:13)
- **Line width**: 100 characters
- **Quotes**: Double quotes
- **Semicolons**: Always
- **Trailing commas**: ES5 style

### File Naming

- Commands: `kebab-case.md`
- Agents: `kebab-case.md`
- Directories: `kebab-case/`

## Testing

- **Test runner**: Bun (`bun test`)
- No test files exist yet in the repository
- Tests should be added for any TypeScript utilities when implemented

## Important Constraints

### Plugin Development

1. **Command files** must have valid YAML frontmatter with `name`, `description`, `version`
2. **Agent files** should focus on single responsibility
3. **README files** for each plugin should follow the existing detailed format
4. **Marketplace registration** requires updating `.claude-plugin/marketplace.json`

### Git Pre-commit Hook

- Runs `bunx biome check --write --staged --no-errors-on-unmatched`
- Auto-fixes formatting issues
- Fails commit if manual fixes required
- Re-stages fixed files automatically

### EPCC Workflow Rules

- **Explore phase**: READ-ONLY, no code modifications, only documentation in `EPCC_EXPLORE.md`
- **Plan phase**: Creates `EPCC_PLAN.md` with task breakdown
- **Code phase**: Implements based on `EPCC_EXPLORE.md` and `EPCC_PLAN.md`, creates `EPCC_CODE.md`
- **Commit phase**: Reviews all EPCC files, generates commit message and PR description

## Dependencies

### Production

- `@stricli/core` v1.2.0 - CLI framework

### Development

- `@biomejs/biome` v2.2.5 - Formatter and linter
- `@types/bun` - TypeScript types for Bun
- `husky` v9.1.7 - Git hooks

### Runtime

- **Bun**: Required for running tests and scripts
- **TypeScript**: v5+ (peer dependency)

## Architecture Notes

### Marketplace System

- Plugins are self-contained in `plugins/` directory
- Each plugin can be installed independently
- Marketplace JSON serves as central registry
- Source points to local plugin directories

## Publishing Plugins

This repository serves as a personal marketplace. To add new plugins:

1. Create plugin directory under `plugins/[name]/`
2. Add README.md, commands/, and agents/ as needed
3. Register in `.claude-plugin/marketplace.json`
4. Commit and push to GitHub
5. Users install via the marketplace source configuration
