# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Claude Code plugin marketplace repository containing four plugins:
- **EPCC Workflow**: 4-phase development workflow (Explore → Plan → Code → Commit) with 12 specialized agents
- **Documentation**: Diataxis framework implementation with agents for tutorials, how-tos, references, and explanations
- **Git Operations**: Streamlined git commands for commits, pushes, and PRs
- **PR Review**: Specialized review agents for comprehensive code review

## Development Commands

### Testing & Quality
```bash
bun test                 # Run tests
bun run typecheck        # TypeScript type checking
bun run biome:check      # Check formatting and linting
bun run biome:fix        # Auto-fix formatting and linting issues
bun run check:all        # Run all checks (typecheck + biome:ci + test)
```

### Formatting & Linting
```bash
bun run biome:format     # Format code
bun run biome:lint       # Lint code
bun run biome:ci         # CI mode (no writes, exit on errors)
```

### Pre-commit
Husky pre-commit hook automatically runs `biome check --write --staged` on staged files.

## Plugin Architecture

### Directory Structure
```
plugins/
├── epcc/
│   ├── .claude-plugin/plugin.json    # Plugin metadata
│   ├── commands/                      # Slash commands (*.md)
│   │   ├── epcc-explore.md
│   │   ├── epcc-plan.md
│   │   ├── epcc-code.md
│   │   └── epcc-commit.md
│   └── agents/                        # Agent definitions (*.md)
│       ├── code-archaeologist.md
│       └── ...
├── documentation/
├── git/
└── pr-review/
```

### Key Files
- `.claude-plugin/marketplace.json`: Marketplace definition with all plugins
- `plugins/*/commands/*.md`: Slash command implementations
- `plugins/*/agents/*.md`: Agent prompt definitions
- `plugins/*/.claude-plugin/plugin.json`: Plugin metadata

## Code Style

### Biome Configuration
- **Indentation**: Tabs (not spaces)
- **Line width**: 100 characters
- **Quote style**: Double quotes
- **Semicolons**: Always required
- **Trailing commas**: ES5 style

### TypeScript
- Strict mode enabled
- Module resolution: bundler mode
- Target: ESNext with Preserve module
- Array types: Use shorthand syntax (`string[]` not `Array<string>`)
- No unused variables/imports (error level)

### Important Rules
- No `console` allowed except where explicitly needed
- Unused variables and imports are errors
- Prefer `for...of` over `.forEach()` where applicable
- Use block statements for conditionals
- Organize imports automatically

## Plugin Development

### Creating a New Command
1. Add `*.md` file to `plugins/<plugin-name>/commands/`
2. Command name becomes `/plugin-name:command-name`
3. Markdown content is the slash command prompt

### Creating a New Agent
1. Add `*.md` file to `plugins/<plugin-name>/agents/`
2. Agent name matches filename (e.g., `code-reviewer.md` → `@code-reviewer`)
3. Markdown content defines agent behavior and instructions

### EPCC Workflow Pattern
EPCC commands follow a 4-phase workflow that generates documentation files:
- **Explore**: Creates `EPCC_EXPLORE.md` with codebase analysis
- **Plan**: Creates `EPCC_PLAN.md` with implementation strategy
- **Code**: Creates `EPCC_CODE.md` with implementation details
- **Commit**: Creates `EPCC_COMMIT.md` with commit message and PR description

Each phase reads previous phase outputs to maintain context.

### Documentation Plugin Pattern
Documentation commands follow the Diataxis framework:
- **Tutorials**: Learning-oriented, step-by-step for beginners
- **How-tos**: Task-oriented guides for specific problems
- **Explanations**: Understanding-oriented conceptual content
- **References**: Information-oriented technical specifications

## Installation & Usage

### Adding the Marketplace
```bash
/plugin marketplace add oskar-dragon/claude-code
```

### Installing Plugins
```bash
/plugin install epcc-workflow@claude-code
/plugin install documentation@claude-code
/plugin install git@claude-code
/plugin install pr-review@claude-code
```

### Example Usage
```bash
# EPCC workflow
/epcc:epcc-explore "authentication system"
/epcc:epcc-plan "Add OAuth support"
/epcc:epcc-code --tdd "OAuth implementation"
/epcc:epcc-commit "Add OAuth authentication"

# Documentation
/documentation:docs-tutorial "Getting started guide"
/documentation:docs-howto "Configure authentication"
/documentation:docs-reference "API endpoints"
/documentation:docs-explanation "Architecture decisions"
```

## CI/CD

GitHub Actions workflow runs on push/PR:
1. Install dependencies with Bun
2. Run `bun run biome:ci` (formatting + linting)
3. Run `bun run typecheck` (TypeScript validation)
4. Run `bun test` (test suite)

All checks must pass for CI to succeed.

## Best Practices

### When Modifying Plugins
- Test commands locally before committing
- Keep command prompts focused and actionable
- Document agent responsibilities clearly
- Follow existing patterns in similar plugins
- Update plugin README.md when adding features

### Code Changes
- Run `bun run check:all` before committing
- Let pre-commit hook auto-fix Biome issues
- Ensure TypeScript strict mode compliance
- Add tests for new functionality
- Keep dependencies minimal (currently only @stricli/core)

### Documentation
- Plugin READMEs should explain purpose, commands, agents, and usage patterns
- Include troubleshooting sections for common issues
- Provide examples for all commands and workflows
- Document flags and options clearly
