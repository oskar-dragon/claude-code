---
description: Update canary-types schema and propagate changes across the codebase
allowed-tools: Read, Write, Edit, Grep, Glob, Bash, Task, TodoWrite, Skill
---

# Canary Schema Update Workflow

Execute the complete canary-types schema update workflow.

## Prerequisites

Before starting the workflow, load the `canary-workflow` skill to get codebase context about:

- Key file locations (canary-types, canary-client, data layers, network handlers)
- Data flow between components
- Common patterns for adding/updating API methods

**ACTION**: Use the Skill tool with `skill: "canary-workflow"` to load this context.

## Phase 1: Generate Types

Run the type generation command to update canary-types from OpenAPI:

```bash
pnpm --filter canary-types type:update
```

Wait for the command to complete successfully before proceeding.

## Phase 2: Analyze Changes

**ACTION**: Invoke the `schema-analyzer` agent using the Task tool with `subagent_type: "canary-update:schema-analyzer"`.

The agent will:

1. Examine git diff of `packages/canary-types/`
2. Map type changes to affected `canary-client` methods
3. Identify affected data layer files in buyers and sellers apps
4. Identify affected network handlers
5. Identify affected test factories
6. Create a detailed implementation plan

Present the implementation plan and **wait for user approval** before proceeding to Phase 3.

## Phase 3: Implement Changes

After user approves the plan, implement all changes identified by the schema-analyzer:

1. Update `packages/canary-client/src/client.ts`:
   - Add/update type imports
   - Modify method signatures
   - Add new methods for new endpoints
   - Update parameter types

2. Update data layers as needed:
   - Buyers: `apps/buyers/src/core/data-layer/`
   - Sellers: `apps/sellers/src/deprecated/api/`

3. Update network handlers as needed:
   - Buyers: `apps/buyers/src/test/network-handlers/`
   - Sellers: `apps/sellers/test/network-handlers/`

4. Update test factories as needed:
   - Location: `packages/test-factories/`

## Phase 4: Validate and Fix

**ACTION**: Invoke the `schema-validator` agent using the Task tool with `subagent_type: "canary-update:schema-validator"`.

The agent will run:

- `turbo type-check` - TypeScript compilation
- `turbo lint` - ESLint checks
- `turbo format` - Prettier formatting
- `turbo unused-exports` - Check for orphaned exports

**CRITICAL - Validation Loop**:

The validator MUST run in a loop until all checks pass:

1. Run all validation commands
2. If ANY issues are found:
   - Fix each reported issue
   - Re-invoke the `schema-validator` agent
   - Repeat from step 1
3. Only proceed to Phase 5 when ALL checks pass with zero issues

Do NOT proceed to Phase 5 until the validator reports all checks passing.

## Phase 5: Report Completion

When all validations pass, report:

- Summary of changes made
- Files modified
- Validation status (all passing)

The changes are now ready to be committed.
