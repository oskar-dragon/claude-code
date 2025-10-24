---
name: epcc-code
description: Code phase of EPCC workflow - implement with confidence
version: 1.0.0
argument-hint: "[task-to-implement] [--tdd|--quick]"
---

# EPCC Code Command

You are in the **CODE** phase of the Explore-Plan-Code-Commit workflow. Transform plans into working code.

## Implementation Target

$ARGUMENTS

If no specific task was provided above, check `EPCC_PLAN.md` for the next task to implement.

## Coding Objectives

1. **Follow the Plan**: Implement according to EPCC_PLAN.md
2. **Apply Patterns**: Use patterns identified in EPCC_EXPLORE.md
3. **Write Clean Code**: Maintainable, tested, documented
4. **Handle Edge Cases**: Consider what could go wrong
5. **Ensure Quality**: Test as you code

## Extended Thinking Strategy

- **Simple features**: Focus on clarity
- **Complex logic**: Think about edge cases
- **Performance critical**: Think hard about optimization
- **Security sensitive**: Ultrathink about vulnerabilities

## Parallel Coding Subagents

Deploy specialized coding agents concurrently:
@test-generator @optimization-engineer @security-reviewer @documentation-agent @ux-optimizer

- @test-generator: Write tests BEFORE implementation (TDD approach)
- @optimization-engineer: Optimize algorithms and queries during implementation
- @security-reviewer: Validate security as code is written
- @documentation-agent: Generate inline documentation and API docs
- @ux-optimizer: Ensure user experience best practices in implementation

Note: Review patterns in EPCC_EXPLORE.md and follow the plan in EPCC_PLAN.md if they exist.

## Implementation Approach

### Step 1: Review Context

```bash
# Review exploration findings
cat EPCC_EXPLORE.md

# Review implementation plan
cat EPCC_PLAN.md

# Check current task status
grep -A 5 "Task Breakdown" EPCC_PLAN.md
```

### Step 2: Set Up Development Environment

```bash
# Create feature branch
git checkout -b feature/[task-name]

# Set up test watchers
npm test --watch  # or pytest-watch

# Open relevant files
zed src/[relevant-files]
```

### Step 3: Test-Driven Development (if --tdd flag)

1. Write failing test first

2. Run test to confirm it fails

3. Write minimal code to pass

4. Refactor while keeping tests green

### Step 4: Implementation Patterns

#### Pattern: Input Validation

TODO

#### Pattern: Logging

TODO

## Code Quality Checklist

### Before Writing Code

- [ ] Understand requirements from EPCC_PLAN.md
- [ ] Review similar code patterns
- [ ] Set up test environment
- [ ] Plan error handling

### While Coding

- [ ] Follow project conventions
- [ ] Write self-documenting code
- [ ] Add meaningful comments for complex logic
- [ ] Handle edge cases
- [ ] Log important operations

### After Coding

- [ ] Run all tests
- [ ] Check code coverage
- [ ] Run linters
- [ ] Update documentation
- [ ] Review for security issues

## Output File: EPCC_CODE.md

Document your implementation progress in `EPCC_CODE.md`:

```markdown
# Code Implementation Report

## Date: [Current Date]

## Feature: [Feature Name]

## Implemented Tasks

- [x] Task 1: Description
  - Files modified: [list]
  - Tests added: [count]
  - Lines of code: [count]

- [x] Task 2: Description
  - Files modified: [list]
  - Tests added: [count]
  - Lines of code: [count]

## Code Metrics

- Test Coverage: X%
- Linting Issues: X
- Security Scan: Pass/Fail
- Performance: Baseline/Improved

## Key Decisions

1. Decision: Rationale
2. Decision: Rationale

## Challenges Encountered

1. Challenge: How resolved
2. Challenge: How resolved

## Testing Summary

- Unit Tests: X passed, X failed
- Integration Tests: X passed, X failed
- E2E Tests: X passed, X failed

## Documentation Updates

- [ ] Code comments added
- [ ] API documentation updated
- [ ] README updated
- [ ] CHANGELOG entry added

## Ready for Review

- [ ] All tests passing
- [ ] Code reviewed self
- [ ] Documentation complete
- [ ] No console.logs or debug code
- [ ] Security considerations addressed
```

## Common Implementation Patterns

### API Endpoint Implementation

TODO

### Database Operations

TODO

### Async Operations

TODO

## Integration with Other Phases

### From PLAN:

- Follow task breakdown from EPCC_PLAN.md
- Implement according to technical design
- Meet acceptance criteria

### To COMMIT:

- Ensure EPCC_CODE.md is complete
- All tests passing
- Code review ready

## Final Steps

1. Update `EPCC_CODE.md` with implementation details
2. Run final test suite
3. Perform self-review
4. Prepare for commit phase

Remember: **Clean code is written once but read many times!**
