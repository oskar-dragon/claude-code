---
description: Generate custom quality validation checklists that verify requirements completeness and clarity
---

# Generate Quality Checklist

## Overview

Create custom, domain-specific checklists that act as "unit tests for English" - validating requirements are complete, clear, and consistent.

## Execution Flow

### 1. Determine Checklist Type

Ask user what type of checklist to generate:

```
What type of quality checklist do you need?

A) Requirements Completeness (spec validation)
B) Implementation Readiness (plan validation)
C) Test Coverage (test validation)
D) Documentation Quality (docs validation)
E) Custom (specify your own criteria)

Your choice:
```

### 2. Locate Target Artifact

Based on type, load appropriate file:
- Requirements: `.specify/specs/[feature]/spec.md`
- Implementation: `.specify/specs/[feature]/plan.md`
- Test: `.specify/specs/[feature]/tasks.md`
- Documentation: Project README, docs/

### 3. Generate Checklist Items

Create checklist based on type and content:

**For Requirements**:
- [ ] No implementation details (languages, frameworks)
- [ ] All user scenarios defined with clear flows
- [ ] Success criteria are measurable
- [ ] Edge cases identified
- [ ] Error handling specified
- [ ] Data entities and relationships clear
- [ ] Security/privacy requirements explicit
- [ ] Performance targets defined
- [ ] Scope boundaries clear (in-scope/out-of-scope)

**For Implementation**:
- [ ] All requirements mapped to implementation phases
- [ ] Tech stack justified against constitution
- [ ] Data model complete with relationships
- [ ] API contracts defined
- [ ] Test strategy includes contract tests first
- [ ] No constitutional violations (or justified)
- [ ] External dependencies identified
- [ ] Risks documented with mitigation
- [ ] Setup instructions clear

**For Test Coverage**:
- [ ] Contract tests exist for all interfaces
- [ ] Integration tests cover critical paths
- [ ] Unit tests for complex logic only
- [ ] TDD order maintained (tests before code)
- [ ] Realistic test environments (no excessive mocking)
- [ ] Error scenarios tested
- [ ] Performance tests for critical paths
- [ ] Test data management strategy

**For Documentation**:
- [ ] README includes getting started
- [ ] All public APIs documented
- [ ] Code examples provided and working
- [ ] Architecture diagrams present
- [ ] Configuration options explained
- [ ] Troubleshooting section exists
- [ ] Contributing guidelines clear

### 4. Add Domain-Specific Items

Analyze the specific feature/project and add tailored items:
- Security checklist for auth features
- Performance checklist for real-time features
- Accessibility checklist for UI features
- Compliance checklist for regulated domains

### 5. Create Checklist File

Write to: `.specify/specs/[feature]/checklists/[type]-checklist.md`

```markdown
# [Type] Quality Checklist: [FEATURE NAME]

**Purpose**: [What this validates]
**Created**: [DATE]
**Target**: [Link to target file]

## Checklist Items

### [Category 1]

- [ ] Item 1
  - **What to check**: [Specific criteria]
  - **Why it matters**: [Impact]
  - **How to verify**: [Validation method]

- [ ] Item 2
  - **What to check**: [Specific criteria]
  - **Why it matters**: [Impact]
  - **How to verify**: [Validation method]

### [Category 2]

[Continue...]

## Validation Notes

**Instructions**:
1. Review each item systematically
2. Check box only when fully satisfied
3. Add notes for partial completion
4. Document exceptions with rationale

**Pass Criteria**:
- Critical items (marked 🔴): Must all pass
- Important items (marked 🟡): 90%+ should pass
- Optional items (marked 🟢): Nice to have

## Review Results

**Reviewer**: [Name]
**Date**: [Date]
**Status**: [PASS/PARTIAL/FAIL]

**Items**:
- Total: [N]
- Passed: [N]
- Failed: [N]
- N/A: [N]

**Critical Issues**: [List any failed critical items]

**Sign-Off**: [ ] Ready for next phase
```

### 6. Auto-Validate (Optional)

If possible, automatically check items:
- Scan spec for [NEEDS CLARIFICATION] markers
- Count undefined success criteria
- Check for implementation details in spec
- Verify all requirements have IDs

Update checklist with automated results.

### 7. Output Summary

Show user:
- Checklist location
- Total items: [N]
- Auto-validated: [N]
- Requires manual review: [N]

## Checklist Guidelines

### Item Quality

Good checklist items:
- Specific and actionable
- Objectively verifiable
- Clear pass/fail criteria

Bad checklist items:
- Vague ("code is good")
- Subjective ("feels right")
- Unmeasurable

### Categories

Organize items into logical groups:
- Completeness
- Clarity
- Consistency
- Correctness
- Compliance

### Severity Levels

Mark items:
- 🔴 Critical: Must pass
- 🟡 Important: Should pass
- 🟢 Optional: Nice to have

## Error Handling

- If target file not found: ASK "Which file to validate?"
- If checklist exists: ASK "Overwrite or create new?"
- If type unclear: PROMPT "Select checklist type"

## Next Steps

After checklist creation:
- Review all items
- Check boxes as validated
- Address failed items
- Re-run validation
- Use checklist in code reviews
