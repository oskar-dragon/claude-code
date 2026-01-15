---
name: canary-workflow
description: This skill should be used when the user asks to "update canary types", "sync schema", "update API types", "fix canary-client", "propagate schema changes", or mentions canary-types, canary-client, or OpenAPI schema updates. Provides knowledge about the codebase structure for schema update workflows.
---

# Canary Schema Update Workflow

This skill provides context for updating and propagating OpenAPI schema changes across the Qogita frontend monorepo.

## Codebase Structure

### Key Locations

| Component                | Path                                     | Purpose                                 |
| ------------------------ | ---------------------------------------- | --------------------------------------- |
| Canary Types             | `packages/canary-types/`                 | Generated TypeScript types from OpenAPI |
| Canary Client            | `packages/canary-client/src/client.ts`   | API client methods using canary-types   |
| Test Factories           | `packages/test-factories/`               | Shared test data factories              |
| Buyers Data Layer        | `apps/buyers/src/core/data-layer/`       | Server-side data fetching for buyers    |
| Sellers Data Layer       | `apps/sellers/src/deprecated/api/`       | React Query hooks for sellers           |
| Buyers Network Handlers  | `apps/buyers/src/test/network-handlers/` | MSW handlers for buyers tests           |
| Sellers Network Handlers | `apps/sellers/test/network-handlers/`    | MSW handlers for sellers tests          |

### Data Flow

```
OpenAPI Spec → canary-types → canary-client → data-layer → network-handlers
                                    ↓
                            test-factories
```

## Update Workflow

### Step 1: Generate Types

Run the type generation command:

```bash
pnpm --filter canary-types type:update
```

This regenerates TypeScript types from the OpenAPI specification.

### Step 2: Analyze Changes

After type generation, analyze the git diff to identify:

1. **New types** - Types added that may need client methods
2. **Modified types** - Fields added/removed/changed
3. **Removed types** - Types deleted that may break existing code
4. **Endpoint changes** - New/modified/removed API endpoints

Use git diff to see changes:

```bash
git diff packages/canary-types/
```

### Step 3: Update Canary Client

The canary-client at `packages/canary-client/src/client.ts` contains methods that:

- Import types from `@qogita/canary-types`
- Make HTTP requests using `ky`
- Return typed responses

When types change:

- Update method signatures to match new types
- Add new methods for new endpoints
- Update parameter types for modified endpoints
- Handle removed types by updating or removing methods

### Step 4: Update Data Layer

**Buyers App** (`apps/buyers/src/core/data-layer/`):

- Uses React Server Components with direct API calls
- Files are organized by domain (user.ts, cart.ts, order.ts, etc.)
- Import types from `@qogita/canary-types`
- Use canary-client methods

**Sellers App** (`apps/sellers/src/deprecated/api/`):

- Uses React Query for data fetching
- Files are organized as `*-queries.ts` (user-queries.ts, sale-queries.ts, etc.)
- Import types from `@qogita/canary-types`
- Use canary-client methods

### Step 5: Update Network Handlers

Network handlers mock API responses for testing:

**Buyers** (`apps/buyers/src/test/network-handlers/`):

- `server/` - Handlers for server-side tests
- `browser/` - Handlers for browser tests
- Must match API response shapes from canary-types

**Sellers** (`apps/sellers/test/network-handlers/`):

- `server/` - Handlers for server-side tests
- Must match API response shapes from canary-types

### Step 6: Update Test Factories

Test factories at `packages/test-factories/` provide typed test data:

- Must use types from `@qogita/canary-types`
- Update factory return types when types change
- Add new factories for new types

## Validation Commands

Run these commands to validate changes:

```bash
# Type checking
turbo type-check

# Linting
turbo lint

# Formatting
turbo format

# Unused exports check
turbo unused-exports
```

For targeted validation:

```bash
# Check specific packages
turbo type-check --filter=@qogita/canary-client
turbo type-check --filter=buyers
turbo type-check --filter=sellers
```

## Common Patterns

### Adding a New API Method

1. Add type imports to canary-client
2. Create method with proper typing
3. Add to data layer in relevant app
4. Create network handler for testing
5. Add test factory if new type

### Updating Existing Method

1. Update type imports if changed
2. Modify method signature/body
3. Update data layer usage
4. Update network handler response shape
5. Update test factory if type changed

### Handling Breaking Changes

When a type is removed or significantly changed:

1. Search for all usages: `rg "TypeName" --type ts`
2. Update or remove references
3. Check for cascading effects in data layer
4. Update network handlers
5. Update test factories

### Handling Unused Function Exports

When new functions are added to canary-client but aren't used yet in data layers, the `turbo unused-exports` check will fail. For new functions that are intentionally not yet in use, add suppression comments:

```typescript
// TODO: Remove ts-unused-exports:disable-next-line once this function is in use
// ts-unused-exports:disable-next-line
export function newApiMethod() { ... }
```

**When to use suppression:**

- New API methods added to canary-client that aren't yet consumed by data layers
- Functions that are part of a larger feature being implemented incrementally

**When NOT to use suppression:**

- Types or interfaces (these don't block commits)
- Functions that should be removed or are truly orphaned
- Re-exported types from canary-types

The schema-validator agent handles this automatically for function exports.

## File Mapping

Common mappings between canary-client methods and data layer files:

| Domain  | Client Methods                | Buyers Data Layer | Sellers Data Layer |
| ------- | ----------------------------- | ----------------- | ------------------ |
| User    | getUser, updateUser           | user.ts           | user-queries.ts    |
| Cart    | getActiveCart, createCartLine | cart.ts           | -                  |
| Order   | getOrders, getOrder           | order.ts          | -                  |
| Sale    | getSales, updateSale          | -                 | sale-queries.ts    |
| Address | getAddresses, createAddress   | address.ts        | address-queries.ts |
| Claim   | getClaim, createClaim         | claim.ts          | claim-queries.ts   |
