# Canary Update Plugin

A Claude Code plugin that automates the canary-types schema update workflow, propagating OpenAPI changes across the codebase.

## Overview

When backend APIs change, this plugin automates the process of:

1. Regenerating TypeScript types from OpenAPI
2. Updating the canary-client API methods
3. Propagating changes to data layers (buyers/sellers apps)
4. Updating network handlers for tests
5. Updating test factories
6. Validating all changes pass linting and type-checking

## Usage

Run the command in Claude Code:

```
/canary-update
```

## Workflow

### Phase 1: Generate Types

Runs `pnpm --filter canary-types type:update` to regenerate types from OpenAPI.

### Phase 2: Analyze Changes

The `schema-analyzer` agent examines the git diff and creates an implementation plan showing:

- Changed types and their impact
- Affected canary-client methods
- Affected data layer files
- Affected network handlers
- Affected test factories

### Phase 3: Approve Plan

You review the implementation plan and approve before changes are made.

### Phase 4: Implement Changes

Claude implements all changes according to the approved plan.

### Phase 5: Validate

The `schema-validator` agent runs all validation checks:

- `turbo type-check` - TypeScript compilation
- `turbo lint` - ESLint checks
- `turbo format` - Prettier formatting
- `turbo unused-exports` - Orphaned exports

If any issues are found, they are fixed and re-validated until all checks pass.

## Components

### Command

- `/canary-update` - Main entry point for the workflow

### Agents

- `schema-analyzer` - Analyzes schema changes and creates implementation plans
- `schema-validator` - Validates changes pass all quality checks

### Skills

- `canary-workflow` - Knowledge about codebase structure and update patterns

## Codebase Locations

| Component                | Path                                     |
| ------------------------ | ---------------------------------------- |
| Canary Types             | `packages/canary-types/`                 |
| Canary Client            | `packages/canary-client/src/client.ts`   |
| Test Factories           | `packages/test-factories/`               |
| Buyers Data Layer        | `apps/buyers/src/core/data-layer/`       |
| Sellers Data Layer       | `apps/sellers/src/deprecated/api/`       |
| Buyers Network Handlers  | `apps/buyers/src/test/network-handlers/` |
| Sellers Network Handlers | `apps/sellers/test/network-handlers/`    |

## Git Hooks Compatibility

The validator runs the same checks as the pre-commit hook:

- `turbo lint`
- `turbo format`
- `turbo type-check`
- `turbo unused-exports`

This ensures changes will pass when committing.
