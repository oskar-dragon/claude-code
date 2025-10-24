# Claude Code Plugins

A personal marketplace of reusable Claude Code plugins for systematic development workflows, documentation, git operations, and PR review.

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

### EPCC Workflow

4-phase development workflow (Explore -> Plan -> Code -> Commit) with 12 specialized agents for systematic feature development.

**[View Documentation](plugins/epcc/README.md)**

### Documentation

Diataxis framework implementation with agents for tutorials, how-tos, references, and explanations.

**[View Documentation](plugins/documentation/README.md)**

### Git Operations

Streamlined git commands for committing, pushing, creating PRs, and branch cleanup.

**[View Documentation](plugins/git/README.md)**

### PR Review

Specialized review agents for comments, tests, error handling, type design, and code quality analysis.

**[View Documentation](plugins/pr-review/README.md)**
