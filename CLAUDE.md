# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal marketplace of reusable Claude Code plugins. The repository contains multiple independent plugins that provide specialized agents, commands, and skills for systematic development workflows, documentation generation, git operations, and utilities.

## Repository Structure

```
plugins/
├── documentation/          # Diataxis framework implementation
│   ├── agents/            # 12 specialized documentation agents
│   └── commands/          # /doc:tutorial, /doc:howto, etc.
├── git/                   # Git workflow automation
│   └── commands/          # /commit, /commit-push-pr, /clean_gone
├── utils/                 # Development utilities
│   └── commands/          # /prompt-generator, /slash-command, /zed:task
└── obsidian-location-notes/ # Location research for Obsidian
    ├── agents/            # Research agents
    ├── commands/          # /create command
    ├── skills/            # Coordinate lookup, formatting
    └── templates/         # Note templates
```

## Plugin Architecture

Each plugin follows the Claude Code plugin structure:

- **`.claude-plugin/plugin.json`**: Plugin metadata (name, version, author, description)
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
/plugin install documentation@claude-code
/plugin install git@claude-code
/plugin install utils@claude-code
```

## Development Workflow

### Adding New Plugins

1. Create new directory under `plugins/`
2. Add `.claude-plugin/plugin.json` with metadata
3. Create subdirectories: `agents/`, `commands/`, `skills/` as needed
4. Update main `README.md` with plugin description

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

### Documentation Plugin

Implements the Diataxis framework with four documentation types:

- **Tutorials**: Learning-oriented, step-by-step for beginners
- **How-tos**: Task-oriented guides for practitioners
- **Explanations**: Understanding-oriented conceptual content
- **Reference**: Information-oriented technical specifications

Agents include: tutorial-writer, technical-writer, concept-explainer, api-documenter, documentation-reviewer, plus analysis agents (code-archaeologist, business-analyst, system-designer, test-generator, optimization-engineer, ux-optimizer).

### Git Plugin

Focused on git workflow automation:

- `/commit`: Stage and commit changes
- `/commit-push-pr`: Full workflow (branch, commit, push, PR)
- `/clean_gone`: Remove local branches deleted on remote

Uses dynamic context injection to read git status, diffs, and templates.

### Obsidian Location Notes Plugin

Specialized for travel research and Obsidian note creation:

- Research agents for accommodations, food, photos, general locations
- Coordinate lookup via geolocation APIs
- Obsidian-specific formatting (frontmatter, dataview syntax)
- Template-based note generation

Requires configuration in `.claude-location-notes.local.md` for API keys and vault paths.

## Important Conventions

1. **File naming**: Use kebab-case for all files and directories
2. **No package.json**: This is a plugin repository, not a Node.js project
3. **Git workflow**: Use `/commit` or `/commit-push-pr` for changes
4. **Documentation**: Each plugin has its own README.md
5. **Examples**: Use `.example` suffix for template files requiring configuration
