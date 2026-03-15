# Claude Code Plugins

A personal marketplace of reusable Claude Code plugins for systematic development workflows, documentation, git operations, and PR review.

## Features

- **Development Skills**: Git workflow automation, Zed task generation, and dev environment setup via `/dev:setup`
- **Travel Planning**: Trip research, itineraries, budgets, and Obsidian note generation
- **Obsidian Integration**: Vault management, recipes, daily/weekly/monthly notes
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
/plugin install development@claude-code
/plugin install travel-planner@claude-code
/plugin install chezmoi@claude-code
/plugin install obsidian-vault@claude-code
```

After installing `development`, run once to set up superpowers:

```shell
/dev:setup
```

## Available Plugins

### Development

Core development skills — git workflows (`/git:commit`, `/git:commit-push-pr`, `/git:clean-gone`), Zed task generation (`/zed:task`), and superpowers setup (`/dev:setup`).

### Travel Planner

Trip planning with Obsidian integration — brainstorming, itineraries, location/country/region notes, budgets, and packing lists.

**[View Documentation](plugins/travel-planner/README.md)**

### Chezmoi

Dotfiles management reference knowledge and dependency workflows.

**[View Documentation](plugins/chezmoi/README.md)**

### Obsidian Vault

Obsidian vault skills including recipe creation and MCP integrations (Todoist, Raindrop).

### Vault Manager

Daily, weekly, monthly note management and Todoist workflow for Obsidian.

### Canary Update

Automates canary-types schema updates and propagates changes across the codebase.

**[View Documentation](plugins/canary-update/README.md)**

### Notion Doc

Generate Qogita project documents from design docs following the Notion PRD template.

### Tutor

Personalised learning system with adaptive tutoring, course creation, and progress tracking.

**[View Documentation](plugins/tutor/README.md)**

### Markdown New

Token-efficient web content fetching via markdown.new, reducing token usage by ~80% compared to raw HTML.

## Other plugins I use

- [Plugin Dev](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev)
- [PR Review Toolkit](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/pr-review-toolkit)
- [Feature Dev](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/feature-dev)

