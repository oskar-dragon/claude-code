# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal marketplace of reusable Claude Code plugins. The repository contains multiple independent plugins that provide specialized agents, commands, and skills for systematic development workflows, documentation generation, git operations, and utilities.

## Repository Structure

```
plugins/
├── development/            # Core dev skills (git workflows, Zed tasks, setup)
│   └── skills/            # /git:commit, /git:commit-push-pr, /git:clean-gone, /zed:task, /dev:setup
├── canary-update/          # Canary schema update automation
├── chezmoi/                # Chezmoi dotfiles management
├── markdown-new/           # Token-efficient web fetching via markdown.new
├── notion-doc/             # Qogita Notion PRD generation
├── obsidian-vault/         # Obsidian vault skills (recipes, MCPs)
├── travel-planner/         # Trip planning with Obsidian integration
├── tutor/                  # Personalised learning system
└── vault-manager/          # Obsidian daily/weekly/monthly note management
```

## Plugin Architecture

Each plugin follows the Claude Code plugin structure:

- **`.claude-plugin/plugin.json`**: Plugin metadata (name, author, description)
- **`agents/`**: Autonomous agents with specialized prompts (`.md` files with YAML frontmatter)
- **`commands/`**: Slash commands (`.md` files with YAML frontmatter)
- **`skills/`**: Reusable capabilities with progressive disclosure
- **`templates/`**: Reusable content templates

### Key Patterns

1. **YAML frontmatter**: All commands and agents use frontmatter for metadata:
   - `version`: Command/agent version
   - `author`: Creator name
   - `allowed-tools`: Tool restrictions (for commands)
   - `description`: Brief description for discovery

2. **Dynamic context**: Commands use `!`git command`` syntax to inject dynamic context

3. **Tool restrictions**: Commands specify allowed tools in frontmatter for safety

## Common Commands

### Plugin Management

```bash
# Add this marketplace
/plugin marketplace add oskar-dragon/claude-code

# List available plugins
/plugin marketplace list

# Install specific plugin
/plugin install development@claude-code
/plugin install chezmoi@claude-code
/plugin install travel-planner@claude-code

# After installing development, run once to install superpowers
/dev:setup
```

## Development Workflow

### Adding New Plugins

1. Create new directory under `plugins/`
2. Add `.claude-plugin/plugin.json` with metadata
3. Create subdirectories: `agents/`, `commands/`, `skills/` as needed
4. Update main `README.md` with plugin description
5. **MUST add the new plugin entry to `.claude-plugin/marketplace.json`**

### Creating Commands

Commands are markdown files with YAML frontmatter:

```markdown
---
version: "1.0.0"
author: "Your Name"
allowed-tools: Bash(git:*), Read(*), Write(*)
description: Brief description
---

## Context

Dynamic context using !`command` syntax

## Your task

Clear instructions for Claude
```

### Creating Agents

Agents are markdown files with YAML frontmatter and detailed system prompts:

```markdown
---
name: agent-name
description: Agent description for discovery
tools: [Read, Write, Grep, Glob]
color: blue
---

Detailed agent system prompt...
```

### Creating Skills

Skills use progressive disclosure with `SKILL.md` as entry point:

```
skills/
└── skill-name/
    ├── SKILL.md           # Entry point
    ├── examples/          # Usage examples
    └── references/        # Detailed documentation
```

## Architecture Principles

1. **Modularity**: Each plugin is independent and self-contained
2. **Reusability**: Commands, agents, and skills are reusable across projects
3. **Progressive disclosure**: Skills provide overview first, details on demand
4. **Safety**: Commands use `allowed-tools` to restrict capabilities
5. **Dynamic context**: Commands inject runtime context via backtick execution
6. **Convention over configuration**: Standard directory structure for auto-discovery

## Plugin-Specific Notes

### Development Plugin

Core development skills, all skill-based (no commands):

- `/dev:setup`: Run once after install — installs superpowers (`disable-model-invocation: true`)
- `/git:commit`: Stage and commit changes
- `/git:commit-push-pr`: Full workflow (branch, commit, push, PR)
- `/git:clean-gone`: Remove local branches deleted on remote
- `/zed:task`: Generate Zed task configuration

## Important Conventions

1. **File naming**: Use kebab-case for all files and directories
2. **No package.json**: This is a plugin repository, not a Node.js project
3. **Git workflow**: Use `/commit` or `/commit-push-pr` for changes
4. **Documentation**: Each plugin has its own README.md
5. **Examples**: Use `.example` suffix for template files requiring configuration
6. **Version bumping**: ALWAYS bump the plugin's version in `.claude-plugin/marketplace.json` when making any changes to it
7. **Marketplace registration**: ALWAYS add new plugins to `.claude-plugin/marketplace.json`
