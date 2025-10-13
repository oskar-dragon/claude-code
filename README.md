# Claude Code Flow

CLI tool and plugin for spec-driven development with Claude Code using GitHub issues, Git worktrees, and parallel AI agents.

## Installation

Install via Homebrew:

```bash
brew tap oskar-dragon/tools
brew install claude-code-flow
```

## Setup

### 1. Add Marketplace

In Claude Code, add the plugin marketplace:

```
/plugin marketplace add https://github.com/oskar-dragon/claude-code.git
```

### 2. Install Plugin

Install the flow plugin:

```
/plugin install flow@claude-code
```

### 3. Activate Plugin

Quit and re-enter Claude Code to activate the plugin.

### 4. Initialize Project

Run the initialization slash command:

```
/flow:pm:init
```

## Quick Start

```bash
# Create your first feature
/pm:prd-new your-feature-name

# View available commands
/pm:help
```

## Documentation

- Plugin README: `plugins/flow/README.md`
- Homebrew Deployment: `docs/HOMEBREW_DEPLOYMENT.md`
