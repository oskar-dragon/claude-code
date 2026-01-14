# Canary Development Plugin

A Claude Code plugin for the Canary Django codebase that provides automatic code formatting and architecture guidance.

## Features

### Automatic Code Formatting

PostToolUse hooks that automatically format Python code after Write or Edit operations:

- **Ruff Check**: Runs `ruff check --fix` to auto-fix linting issues
- **Ruff Format**: Runs `ruff format` to format code according to project standards

Both hooks run silently (errors don't block operations) and target the specific file that was modified.

### Automated Code Review

Architecture pattern enforcement in pull requests:

- **BFF pattern validation**: Prevents circular dependencies, ensures proper coordination vs business logic separation
- **Interface design validation**: Enforces RFC-109 patterns, protects app boundaries
- **Parallel execution**: Runs alongside CLAUDE.md compliance and bug detection (6 total agents)
- **High signal only**: Flags only real architectural violations that cause maintenance issues

### Architecture Guidance Agents

Two specialized agents provide expert guidance on Canary's architecture patterns:

#### BFF Architect (`bff-architect`)

Expert in the Backend-for-Frontend aggregation pattern used in Canary. Helps with:

- Service aggregation across multiple domains
- Preventing circular dependencies
- Structuring BFF apps and services
- Coordinating cross-domain operations
- Understanding one-way dependency flow

**When to use**: Ask about BFF patterns, aggregation, cross-domain coordination, or orchestration layers.

#### Interface Architect (`interface-architect`)

Expert in RFC-109 interface design patterns. Helps with:

- Structuring `interfaces/` directories
- Creating and using DTOs (Data Transfer Objects)
- Managing cross-app dependencies
- Encapsulation and boundary design
- Performance within domain boundaries

**When to use**: Ask about interface design, DTOs, dependency management, or encapsulation patterns.

### Code Review Integration

Both architecture agents are integrated into the `/code-review` command for automated PR review:

- **BFF Architect**: Automatically reviews PRs for BFF pattern violations including circular dependencies, improper aggregation, business logic in BFF layers, and dependency inversion issues
- **Interface Architect**: Automatically reviews PRs for interface design violations including improper cross-app imports, DTO violations, boundary violations, and encapsulation issues

These agents run in parallel with CLAUDE.md compliance and bug detection agents during automated code reviews, ensuring architectural patterns are enforced across all pull requests.

**Architecture violations flagged:**
- Circular dependencies and wrong dependency direction
- Business logic in aggregation layers
- Cross-app boundary violations (model imports, ORM traversal)
- Implementation leakage and improper DTOs
- Transactional boundary violations

## Usage

### Automatic Formatting

Formatting happens automatically after you:

- Write new Python files
- Edit existing Python files

The hooks run in the background and won't interrupt your workflow.

### Architecture Guidance

Simply ask Claude for help with architecture questions:

**BFF Pattern Examples**:

- "How do I aggregate data from multiple domains?"
- "Help me structure a buyers BFF"
- "How do I prevent circular dependencies?"
- "What's the BFF pattern for coordinating checkout?"

**Interface Design Examples**:

- "How should I structure my interfaces directory?"
- "Should I use DTOs or pass model instances?"
- "How do I manage cross-app dependencies?"
- "How do I encapsulate this business logic?"

The appropriate expert agent will be invoked to provide guidance.

## Technical Details

### Hooks Configuration

Located in `hooks/hooks.json`:

- Triggers on `PostToolUse` event
- Matches `Write|Edit` tools
- Runs separate commands for check and format
- Uses `|| true` for silent failure
- Operates on `${FILE_PATH}` (the specific changed file)

### Agents

Both agents are reactive (invoked explicitly by user queries):

- **bff-architect**: Blue, uses Sonnet model, has Read/Glob/Grep tools
- **interface-architect**: Green, uses Sonnet model, has Read/Glob/Grep tools

Agents have comprehensive knowledge embedded in their system prompts based on:

- BFF aggregation pattern documentation
- RFC-109: Designing and Depending on Interfaces, Not Implementation

## Requirements

- Python 3.13+
- ruff (code formatter and linter)
- Claude Code CLI

## Project Context

This plugin is specifically designed for the Canary Django monolith, which follows:

- Service layer pattern (business logic in `services/`)
- Interface-based architecture (`interfaces/` directories)
- BFF aggregation for cross-domain coordination
- Strict one-way dependency flow
- DTO-based contracts between apps

## Development

Plugin structure:

```
.claude-plugin/
├── plugin.json          # Plugin metadata
├── README.md            # This file
├── hooks/
│   └── hooks.json       # PostToolUse hooks configuration
└── agents/
    ├── bff-architect.md      # BFF pattern expert
    └── interface-architect.md # Interface design expert
```

## Version History

- **0.1.2** (2026-01-11): Enhanced code review
  - Integrated BFF architect into /code-review command
  - Integrated Interface architect into /code-review command
  - Added automated BFF pattern violation detection in PRs
  - Added automated interface design violation detection in PRs
  - Enhanced PR review with 6 parallel agents (up from 4)
- **0.1.1** (2026-01-11): Minor updates
- **0.1.0** (2026-01-11): Initial release
  - Automatic ruff check and format hooks
  - BFF architect agent
  - Interface architect agent
