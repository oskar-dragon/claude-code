# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code Flow (ccf) - CLI tool built with Bun and @stricli/core for structured development workflows.

**Key architecture:**

- `cli/` - Main CLI application (TypeScript, Bun runtime)
- `plugins/project-management/` - PM workflow system (see `to-migrate/README.md` for full documentation)
- `to-migrate/` - Legacy CCPM system being migrated into this repository

## Development Commands

### Build & Run

```bash

cd cli
bun run dev              # Run CLI in development mode
bun run build            # Build for distribution
bun run build:all        # Build for all platforms (macOS arm64/x64, Linux x64)
```

### Testing

```bash
cd cli
bun test                 # Run all tests
bun test src/app.test.ts # Run specific test file
```

**Testing patterns:**

- Uses `bun:test` (built-in test runner)
- Follow AAA pattern (Arrange, Act, Assert)
- See `cli/src/app.test.ts` for examples

### CLI Usage

```bash
ccf init                 # Initialize Claude Code Flow System
```

## Architecture

### CLI Structure (@stricli/core)

- `cli/src/index.ts` - Entry point using @stricli/core runner
- `cli/src/app.ts` - Application definition with route map
- `cli/src/commands/*.ts` - Command implementations using `buildCommand()`

**Adding new commands:**

1. Create `cli/src/commands/your-command.ts` using `buildCommand()`
2. Import and add to route map in `cli/src/app.ts`
3. Command automatically available via `ccf your-command`

### Project Management System

The `to-migrate/` directory contains a complete PM workflow system (formerly CCPM) that uses:

- PRD → Epic → Task → GitHub Issues flow
- Parallel execution with Git worktrees
- Claude Code slash commands in `.claude/commands/pm/`

**Core workflow:**

1. `/pm:prd-new` - Create Product Requirements Document
2. `/pm:prd-parse` - Transform PRD into technical epic
3. `/pm:epic-oneshot` - Decompose and sync to GitHub Issues
4. `/pm:issue-start` - Launch specialized agents in parallel

See `to-migrate/README.md` for complete documentation.

## Technology Stack

**Runtime:** Bun (not Node.js)

- Use `bun <file>` instead of `node <file>`
- Use `bun test` instead of Jest/Vitest
- Bun automatically loads .env files

**CLI Framework:** @stricli/core

- Type-safe command definitions
- Automatic help generation
- Built-in parameter parsing

**TypeScript config:**

- Target: ESNext with bundler module resolution
- Strict mode enabled
- Allows importing .ts extensions (Bun handles this)

## File Structure Conventions

```
cli/
├── src/
│   ├── index.ts           # CLI entry point
│   ├── app.ts             # Application & route definition
│   ├── commands/          # Command implementations
│   └── *.test.ts          # Tests alongside source
├── dist/                  # Build output
├── bin/                   # Compiled binaries
├── package.json
└── tsconfig.json

plugins/
└── project-management/    # PM workflow commands/agents

to-migrate/               # Legacy CCPM system (being integrated)
├── .claude/              # Complete PM system
│   ├── commands/pm/      # Slash commands
│   ├── agents/           # Specialized agents
│   ├── prds/             # Product Requirements Docs
│   └── epics/            # Implementation plans
└── README.md             # Full PM system documentation
```

## Migration Context

This repository is consolidating the CCPM project management system:

- Original system in `to-migrate/`
- New CLI tool in `cli/`
- Goal: Unified ccf CLI with integrated PM workflows
