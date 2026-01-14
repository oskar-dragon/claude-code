# Claude Code Plugins

A personal marketplace of reusable Claude Code plugins for systematic development workflows, documentation, git operations, and PR review.

## Features

- **Documentation Generation**: Diataxis framework implementation with specialized agents for creating tutorials, how-tos, references, and explanations
- **Git Workflow Automation**: Streamlined commands for commits, PRs, and branch management
- **Code Quality Tools**: Specialized review agents for comprehensive code analysis
- **Extensible Architecture**: Modular plugin system with agents, commands, and skills

## Installation

Add this marketplace using the CLI:

```shell
/plugin marketplace add oskar-dragon/claude-code
```

Verify installation:

```shell
/plugin marketplace list
```

Install plugins:

```shell
/plugin install epcc-workflow@claude-code
/plugin install git@claude-code
/plugin install documentation@claude-code
/plugin install pr-review@claude-code
```

## Available Plugins

### Documentation

Diataxis framework implementation with agents for tutorials, how-tos, references, and explanations.

**[View Documentation](plugins/documentation/README.md)**

### Git Operations

Streamlined git commands for committing, pushing, creating PRs, and branch cleanup.

**[View Documentation](plugins/git/README.md)**

### Obsidian Location Notes

[TODO]

**[View Documentation](plugins/obsidian-location-notes/README.md)**

### Utils

Specialized review agents for comments, tests, error handling, type design, and code quality analysis.

**[View Documentation](plugins/pr-review/README.md)**

## Other plugins I use

- [Plugin Dev](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev)
- [PR Review Toolkit](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/pr-review-toolkit)
- [Feature Dev](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/feature-dev)
