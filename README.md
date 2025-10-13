# Claude Code Flow

CLI tool for spec-driven development using GitHub Issues, Git worktrees, and parallel AI agents. Transforms PRDs into epics, epics into GitHub issues, and issues into production code with full traceability.

## Installation

### Homebrew (Recommended)

```bash
brew tap oskardragon/tools
brew install claude-code-flow
```

### Direct Download

Download binaries from [GitHub Releases](https://github.com/oskar-dragon/claude-code/releases)

### Build from Source

```bash
bun install
bun run build:all
```

## Quick Start

1. **Initialize the system:**
   ```bash
   claude-code-flow init
   ```
   This installs GitHub CLI, authenticates, and creates required directories.

2. **Add the Flow plugin to Claude Code:**
   ```
   /plugin marketplace add oskar-dragon/claude-code
   /plugin install flow@claude-code
   ```

3. **Restart Claude Code** to activate the plugin

4. **Start your first feature:**
   ```
   /pm:prd-new feature-name
   ```

## Available Commands

### CLI Commands
- `claude-code-flow init` - Initialize system
- `claude-code-flow validate` - Validate system integrity
- `claude-code-flow help` - Show help
- `claude-code-flow status` - Show project status

### Plugin Commands (after plugin installation)
- `/pm:*` - Project management commands (create PRDs, manage epics, track issues)
- `/context:*` - Context management (create, update, prime)
- `/testing:*` - Test execution

Type `/pm:help` for full command reference.

## Documentation

- **Full workflow guide:** [plugins/flow/README.md](plugins/flow/README.md)
- **Command reference:** Run `/pm:help` in Claude Code
- **Architecture details:** [CLAUDE.md](CLAUDE.md)

## Development

```bash
bun run dev          # Run in development mode
bun run check:all    # Run typecheck, lint, and tests
bun test             # Run tests
bun run biome:fix    # Format and lint code
```
