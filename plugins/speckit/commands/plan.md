---
description: Create technical implementation plan with tech stack choices and architecture decisions
---

# Create Technical Implementation Plan

## User Input

```text
$ARGUMENTS
```

You **MUST** use the user input to determine tech stack and technical choices.

## Overview

Transform the feature specification into a concrete technical implementation plan with architecture, tech stack, and phase-by-phase execution strategy.

## Execution Flow

### 1. Locate Current Feature

Find the active feature:
- Check current git branch or latest spec directory
- Load `.specify/specs/[feature]/spec.md`
- Create output file: `.specify/specs/[feature]/plan.md`

### 2. Load Constitution

Read `.specify/memory/constitution.md` to understand:
- Project principles and constraints
- Architectural rules
- Quality standards
- Forbidden patterns

### 3. Parse User Tech Stack Input

From `$ARGUMENTS`, extract:
- Programming language(s)
- Framework(s) and libraries
- Database/storage choices
- Infrastructure/hosting
- Third-party services

If tech stack is unclear, ask user for specifics.

### 4. Load Plan Template

Read `.specify/templates/plan-template.md` to understand required structure.

### 5. Create Implementation Plan

Generate plan with these sections:

**Phase -1: Pre-Implementation Gates**
- Simplicity Gate (Article VII): ≤3 projects, no future-proofing
- Anti-Abstraction Gate (Article VIII): Use frameworks directly
- Integration-First Gate (Article IX): Contracts defined, contract tests first

**Tech Stack Selection**
- Language and runtime
- Framework choices with rationale
- Database and storage
- External services
- Justification for each choice against constitution

**Architecture Overview**
- System components and boundaries
- Data flow
- Integration points
- Technology mapping

**Implementation Phases**
- Phase 0: Setup and scaffolding
- Phase 1-N: Feature increments (per user story)
- Each phase: Prerequisites, deliverables, validation

**Data Model**
- Entities and relationships
- Create separate `data-model.md` file

**API Contracts**
- Endpoints, events, or interfaces
- Create files in `contracts/` directory

**Test Strategy**
- Contract tests (first priority)
- Integration tests (realistic environments)
- Unit tests (minimal, focused)
- Following TDD: Red → Green → Refactor

**Risks and Mitigation**
- Technical risks
- Dependencies
- Unknowns requiring research

### 6. Research Phase (if needed)

If tech stack involves rapidly changing libraries or unfamiliar tools:
- Create `research.md` file
- Document specific versions
- Note breaking changes or gotchas
- Include relevant documentation links

### 7. Constitutional Validation

Check plan against constitution:
- ✅ No unnecessary abstractions
- ✅ Using ≤3 projects initially
- ✅ Test-first approach enforced
- ✅ Integration tests prioritized over mocks
- ✅ Library-first principle followed

If constitutional violations exist:
- Document in "Complexity Tracking" section
- Provide explicit justification
- Get user approval for exceptions

### 8. Cross-Reference Spec

Ensure every requirement in spec.md is addressed:
- Map requirements to implementation phases
- Verify success criteria are achievable
- Check all entities are modeled

### 9. Generate Supporting Files

Create in feature directory:
- `plan.md` - Main implementation plan
- `data-model.md` - Entity and relationship details
- `contracts/` - API specifications, event schemas
- `research.md` - Tech stack research (if needed)
- `quickstart.md` - Key validation scenarios

### 10. Output Summary

Report:
- Plan file location
- Tech stack summary
- Phase count
- Any constitutional exceptions
- Readiness for `/speckit:tasks`

## Guidelines

### Tech Stack Justification

For each technology choice, document:
- Why chosen (requirements alignment)
- Alternatives considered
- Tradeoffs accepted
- Constitutional compliance

### Implementation Phases

Each phase must have:
- Clear prerequisites
- Specific deliverables
- Independent testability
- User value increment

### Avoiding Over-Engineering

Red flags (require justification):
- More than 3 projects initially
- Custom abstractions over framework features
- Speculative "might need" features
- Mocking instead of realistic tests

### Success Criteria

Plan must enable spec's success criteria:
- Map each criterion to implementation
- Verify tech stack can deliver
- Identify measurement approach

## Error Handling

- If no spec found: ERROR "Run /speckit:specify first"
- If constitution not found: WARN "Continue without constitutional checks"
- If user provides no tech stack: Ask for required details
- If tech stack conflicts with constitution: Flag and get approval

## Next Steps

After planning:
- Review plan with stakeholders
- Run `/speckit:tasks` to generate task breakdown
- Address any research gaps first
