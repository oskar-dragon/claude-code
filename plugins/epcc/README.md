# EPCC Workflow Plugin

A systematic approach to software development that ensures you understand before you act, plan before you code, and document before you commit.

## Overview

The EPCC (Explore-Plan-Code-Commit) Plugin provides a structured 4-phase workflow for building features with confidence.

## Philosophy

Building software requires more than just writing code. You need to:

- **Understand the context** before making changes
- **Plan strategically** before implementation
- **Code systematically** with patterns and tests
- **Document professionally** for team collaboration

This plugin embeds these practices into a structured workflow that runs automatically when you use EPCC commands.

## Command: `/epcc-explore`

Launches the exploration phase to understand your codebase thoroughly before making any changes.

**Usage:**

```bash
/epcc-explore "user interface and existing greeting patterns"
```

Or simply:

```bash
/epcc-explore
```

Explore a specific area or perform a general codebase analysis.

## Command: `/epcc-plan`

Launches the planning phase to create detailed implementation strategies based on exploration findings.

**Usage:**

```bash
/epcc-plan "Add user authentication feature"
```

Creates a comprehensive plan with task breakdown, risk assessment, and success criteria.

## Command: `/epcc-code`

Launches the coding phase to implement features according to your plan.

**Usage:**

```bash
/epcc-code "Implement user authentication"
```

Or use test-driven development:

```bash
/epcc-code --tdd "Implement user authentication"
```

## Command: `/epcc-commit`

Launches the commit phase to finalize work.

**Usage:**

```bash
/epcc-commit "Add user authentication feature"
```

Generates commit messages, PR descriptions, and documentation.

## Command: `/epcc-prd` (Optional)

Interactive requirements gathering before starting the EPCC workflow.

**Usage:**

```bash
/epcc-prd "team knowledge management system"
```

Guides you through creating a comprehensive Product Requirements Document.

## The 4-Phase Workflow

### Phase 1: Explore

**Goal**: Understand thoroughly before acting

**What happens:**

- Launches 5 specialized agents in parallel:
  - @code-archaeologist analyzes code structure and patterns
  - @system-designer identifies architectural conventions
  - @business-analyst maps dependencies and process flows
  - @test-generator assesses test coverage
  - @documentation-agent reviews existing documentation
- Each agent explores different aspects of your codebase
- Creates `EPCC_EXPLORE.md` with findings
- Documents patterns, constraints, and dependencies

**Example output in EPCC_EXPLORE.md:**

```
Executive Summary:
- Project type: React web application
- Architecture: Component-based with Redux state management
- Current state: Production with active development

Key Components:
- src/auth/AuthService.ts:45 - Core authentication logic
- src/middleware/authMiddleware.ts:12 - Request authentication
- src/config/security.ts:8 - Security configuration

Patterns & Conventions:
- Uses functional components with hooks
- Tests written with Jest and React Testing Library
- Authentication via JWT tokens
```

**Flags:**

- `--quick`: Fast exploration for small areas
- `--deep`: Thorough exploration for complex systems

### Phase 2: Plan

**Goal**: Strategic design before implementation

**What happens:**

- Reads `EPCC_EXPLORE.md` findings
- Launches 6 agents in parallel:
  - @system-designer designs architecture
  - @tech-evaluator evaluates technology choices
  - @business-analyst breaks down requirements
  - @security-reviewer assesses security risks
  - @qa-engineer plans testing strategy
  - @project-manager estimates timeline
- Creates `EPCC_PLAN.md` with implementation roadmap
- Defines tasks, risks, and success criteria

**Example output in EPCC_PLAN.md:**

```
Feature Objective:
Add OAuth authentication with Google and GitHub providers

Technical Approach:
- Create OAuthProvider abstraction
- Integrate with existing AuthService
- Add OAuth routes and middleware
- Implement token refresh mechanism

Task Breakdown:
1. [ ] Set up database schema
2. [ ] Implement OAuthProvider interface
3. [ ] Create Google OAuth integration
4. [ ] Create GitHub OAuth integration
5. [ ] Add OAuth middleware
6. [ ] Write comprehensive tests

Risk Assessment:
- OAuth state management: Medium risk - Mitigate with Redis caching
- Token security: High risk - Mitigate with encryption and rotation
```

**Flags:**

- `--quick`: Fast planning for simple features
- `--detailed`: Comprehensive planning with extensive risk analysis
- `--with-risks`: Include detailed risk assessment matrix

### Phase 3: Code

**Goal**: Implement with confidence

**What happens:**

- Reviews `EPCC_EXPLORE.md` for patterns to follow
- Consults `EPCC_PLAN.md` for implementation strategy
- Launches 5 specialized agents in parallel:
  - @test-generator writes tests FIRST (TDD)
  - @optimization-engineer ensures performance
  - @security-reviewer validates security practices
  - @documentation-agent generates inline documentation
  - @ux-optimizer ensures user experience best practices
- Implements code following project conventions
- Creates `EPCC_CODE.md` documenting what was built

**Example output in EPCC_CODE.md:**

```
Implemented Tasks:
- [x] Database schema for OAuth providers
  - Files: migrations/001_add_oauth_tables.sql
  - Tests: 5 passing
  - Lines: 45

- [x] OAuthProvider abstraction
  - Files: src/auth/OAuthProvider.ts
  - Tests: 12 passing
  - Lines: 150

Code Metrics:
- Test Coverage: 95%
- Linting Issues: 0
- Security Scan: Pass
- Performance: Baseline maintained

Key Decisions:
1. Used strategy pattern for OAuth providers - allows easy addition of new providers
2. Implemented token refresh with Redis caching - prevents database overload
```

**Flags:**

- `--tdd`: Enforce test-driven development (tests first)
- `--quick`: Fast implementation for simple features

### Phase 4: Commit

**Goal**: Finalize with documentation

**What happens:**

- Launches 5 specialized agents in parallel:
  - @qa-engineer runs final test suite
  - @security-reviewer performs security scan
  - @documentation-agent ensures docs are complete
  - @deployment-agent validates deployment readiness
  - @project-manager reviews completion against requirements
- Generates commit message
- Creates complete PR description
- Documents everything in `EPCC_COMMIT.md`

**Example output in EPCC_COMMIT.md:**

```
Changes Overview:
Added OAuth authentication with Google and GitHub providers

What Changed:
- New OAuthProvider abstraction for pluggable auth providers
- Google and GitHub OAuth implementations
- OAuth middleware and routes
- Comprehensive test coverage (95%)

Why It Changed:
- Users requested social login for easier onboarding
- Reduces friction in signup process
- Aligns with modern authentication patterns

Testing Summary:
- Unit Tests:  32 passing
- Integration Tests:  8 passing
- Security Scan:  Pass
- Coverage: 95% (increased from 87%)

Commit Message:
feat: Add OAuth authentication with Google and GitHub

- Implement OAuthProvider abstraction for pluggable auth
- Add Google and GitHub OAuth providers
- Include token refresh mechanism with Redis caching
- Add comprehensive test coverage (95%)

Closes #123

Based on:
- Exploration: EPCC_EXPLORE.md
- Plan: EPCC_PLAN.md
- Implementation: EPCC_CODE.md
```

**Flags:**

- `--amend`: Amend previous commit
- `--squash`: Squash multiple commits

## Agents

### `code-archaeologist`

**Purpose**: Reverse-engineers legacy code and uncovers hidden patterns

**Focus areas:**

- Code structure and organization
- Hidden dependencies and data flows
- Technical debt identification
- Business logic extraction
- Safe refactoring strategies

**When triggered:**

- Automatically in Phase 1 (Explore)
- Manually when inheriting legacy codebases

**Output:**

- System architecture map
- Dependency graphs with file:line references
- Technical debt assessment
- Refactoring recommendations

### `system-designer`

**Purpose**: Designs high-level system architecture and component relationships

**Focus areas:**

- Component boundaries and responsibilities
- Service integration patterns
- Data flow design
- Scalability patterns
- Fault tolerance strategies

**When triggered:**

- Automatically in Phase 1 (Explore) and Phase 2 (Plan)
- Manually for architecture design tasks

**Output:**

- Component diagrams
- Integration patterns
- Scalability strategies
- Architecture documentation

### `business-analyst`

**Purpose**: Maps dependencies, process flows, and breaks down requirements

**Focus areas:**

- Requirement decomposition
- Process flow mapping
- Dependency identification
- Task prioritization
- Timeline estimation

**When triggered:**

- Automatically in Phase 1 (Explore) and Phase 2 (Plan)

**Output:**

- Process flow diagrams
- Dependency maps
- Prioritized task lists
- Timeline estimates

### `test-generator`

**Purpose**: Writes comprehensive test suites using test-driven development

**Focus areas:**

- Write failing tests FIRST (TDD Red phase)
- Unit, integration, and E2E tests
- Edge case coverage
- 90%+ code coverage
- Test fixtures and mocks

**When triggered:**

- Automatically in Phase 1 (Explore assessment) and Phase 3 (Code implementation)
- Manually for TDD workflows

**Output:**

- Failing test suite (Red phase)
- Comprehensive test coverage
- Test documentation
- Coverage reports

### `documentation-agent`

**Purpose**: Reviews, analyzes, and generates comprehensive documentation

**Focus areas:**

- Existing documentation analysis
- Inline code comments
- API documentation
- README updates
- Changelog entries

**When triggered:**

- Automatically in all phases
- Manually for documentation tasks

**Output:**

- Documentation analysis
- Generated API docs
- Updated README files
- Changelog entries

### `security-reviewer`

**Purpose**: Validates security practices and identifies vulnerabilities

**Focus areas:**

- Security vulnerability scanning
- Input validation review
- Authentication and authorization checks
- Sensitive data exposure prevention
- Security best practices

**When triggered:**

- Automatically in Phase 2 (Plan) and Phase 3 (Code)
- Manually for security audits

**Output:**

- Security vulnerability report
- Risk assessment with severity ratings
- Mitigation recommendations
- Security checklist

### `optimization-engineer`

**Purpose**: Ensures performance and optimizes algorithms

**Focus areas:**

- Algorithm optimization
- Query optimization
- Performance bottleneck identification
- Resource utilization
- Caching strategies

**When triggered:**

- Automatically in Phase 3 (Code)
- Manually for performance optimization

**Output:**

- Performance analysis
- Optimization recommendations
- Benchmark results
- Resource usage reports

### `ux-optimizer`

**Purpose**: Ensures user experience best practices in implementation

**Focus areas:**

- User interface patterns
- Accessibility standards
- User journey optimization
- Responsive design
- Error messaging

**When triggered:**

- Automatically in Phase 3 (Code)
- Manually for UX improvements

**Output:**

- UX analysis
- Accessibility audit
- User journey diagrams
- Improvement recommendations

### `qa-engineer`

**Purpose**: Runs comprehensive quality assurance and validation

**Focus areas:**

- Test execution and validation
- Quality metrics analysis
- Bug identification
- Regression testing
- Test automation

**When triggered:**

- Automatically in Phase 2 (Plan) and Phase 4 (Commit)
- Manually for QA tasks

**Output:**

- Test execution report
- Quality metrics
- Bug reports
- QA checklist

### `deployment-agent`

**Purpose**: Validates deployment readiness and CI/CD configuration

**Focus areas:**

- Deployment configuration
- Environment validation
- CI/CD pipeline checks
- Infrastructure readiness
- Rollback procedures

**When triggered:**

- Automatically in Phase 4 (Commit)
- Manually for deployment tasks

**Output:**

- Deployment readiness checklist
- Configuration validation
- CI/CD status
- Rollback plan

### `project-manager`

**Purpose**: Reviews completion against requirements and manages timeline

**Focus areas:**

- Requirement tracking
- Timeline estimation
- Resource allocation
- Progress monitoring
- Stakeholder communication

**When triggered:**

- Automatically in Phase 2 (Plan) and Phase 4 (Commit)
- Manually for project management

**Output:**

- Progress reports
- Timeline estimates
- Resource allocation plans
- Completion status

### `tech-evaluator`

**Purpose**: Evaluates technology choices and build vs buy decisions

**Focus areas:**

- Technology assessment
- Library/framework evaluation
- Cost-benefit analysis
- Vendor evaluation
- Technical feasibility

**When triggered:**

- Automatically in Phase 2 (Plan)
- Manually for technology decisions

**Output:**

- Technology comparison
- Recommendation with rationale
- Cost analysis
- Risk assessment

## Usage Patterns

### Full workflow (recommended for new features):

```bash
# Step 1: Explore the codebase
/epcc-explore "authentication system"

# Step 2: Create implementation plan
/epcc-plan "Add OAuth authentication"

# Step 3: Implement with TDD
/epcc-code --tdd "OAuth authentication"

# Step 4: Finalize and commit
/epcc-commit "Add OAuth authentication"
```

### Quick workflow for small changes:

```bash
# Quick exploration
/epcc-explore --quick "login form"

# Fast planning
/epcc-plan --quick "Update login UI"

# Implementation
/epcc-code "Update login UI"

# Commit
/epcc-commit "Update login form styling"
```

### Deep exploration for complex systems:

```bash
# Thorough exploration
/epcc-explore --deep "payment processing system"

# Detailed planning with risks
/epcc-plan --detailed --with-risks "Refactor payment flow"

# Careful implementation
/epcc-code "Refactor payment processing"

# Complete documentation
/epcc-commit "Refactor payment processing for better error handling"
```

## Best Practices

1. **Always start with exploration** - Even if you think you know the code, exploration uncovers forgotten patterns and hidden dependencies

2. **Don't skip planning** - 15 minutes of planning saves hours of refactoring and debugging

3. **Read the EPCC files** - They contain valuable insights. Review `EPCC_EXPLORE.md` and `EPCC_PLAN.md` before coding

4. **Use TDD when possible** - The `--tdd` flag enforces test-first development, catching bugs early

5. **Keep EPCC files for reference** - They're excellent documentation for code reviews and future maintenance

6. **Archive completed workflows** - Move `EPCC_*.md` files to `.epcc-archive/feature-name/` to keep your workspace clean

## When to Use This Plugin

**Use for:**

- New features that touch multiple files
- Refactoring complex code
- Working with unfamiliar codebases
- Features requiring architectural decisions
- Changes with unclear requirements or scope

**Don't use for:**

- Trivial one-line changes
- Simple typo fixes
- Well-understood, simple tasks
- Urgent hotfixes (though exploration might prevent future issues)

## Requirements

- Claude Code installed
- Git repository (for commit documentation)
- Project codebase (workflow assumes existing code to analyze)

## Troubleshooting

### Exploration takes too long

**Issue**: Exploration phase is slow for large codebases

**Solution**:

- Use `--quick` flag for faster exploration
- Focus exploration on specific areas: `/epcc-explore "src/auth"`
- Parallel agents are normal - they run concurrently for efficiency

### Too many EPCC\_\*.md files

**Issue**: Workspace cluttered with EPCC documentation files

**Solution**:

```bash
# Archive completed workflows
mkdir -p .epcc-archive/feature-name
mv EPCC_*.md .epcc-archive/feature-name/

# Or commit them with your feature
git add EPCC_*.md
git commit -m "docs: Add EPCC workflow documentation"
```

### Generated code doesn't match project style

**Issue**: Code doesn't follow project conventions

**Solution**:
Create a `CLAUDE.md` file in your project root with your conventions:

```markdown
# CLAUDE.md

## Code Style

- Use spaces, not tabs (2 spaces)
- Functions should be under 50 lines
- Always use TypeScript strict mode

## Testing

- Write tests first (TDD)
- Use Jest for testing
- Minimum 90% coverage
```

EPCC will automatically read and follow these rules during exploration.

### Plan doesn't address my specific needs

**Issue**: Generated plan misses important aspects

**Solution**:

- Review `EPCC_EXPLORE.md` first - the plan is based on exploration findings
- Re-run exploration with specific focus: `/epcc-explore "area you care about"`
- Edit `EPCC_PLAN.md` directly before coding phase
- Provide more context in your plan command

## Tips

1. **Create a PRD first for complex projects** - Use `/epcc-prd` to gather requirements before starting EPCC workflow

2. **Use exploration proactively** - Run `/epcc-explore` when joining a new project to understand the codebase

3. **Review agent outputs carefully** - Agents provide insights about your codebase that even experienced developers might miss

4. **Combine with other plugins** - EPCC works great with security, testing, and documentation plugins

5. **Trust the process** - Each phase builds on the previous one. Skipping phases reduces quality

6. **Use flags wisely**:
   - Quick fixes: `--quick` flags throughout
   - Complex work: `--deep` exploration, `--detailed` planning, `--tdd` coding
   - Security critical: Always use default (thorough) exploration and planning
