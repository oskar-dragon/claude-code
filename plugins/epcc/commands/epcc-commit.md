---
name: epcc-commit
description: Commit phase of EPCC workflow - finalize with confidence
version: 1.0.0
argument-hint: "[commit-message] [--amend|--squash]"
---

# EPCC Commit Command

You are in the **COMMIT** phase of the Explore-Plan-Code-Commit workflow. Finalize your work with a professional commit.

## Commit Context

$ARGUMENTS

If no commit message was provided above, I'll generate one based on the work documented in EPCC files.

## Project Setup

Before finalizing the commit, identify the project directory:

1. **Extract project name** from the commit argument (or ask if not provided)
2. **Convert to kebab-case**: Lowercase, replace spaces/underscores with hyphens
   ```bash
   PROJECT_NAME=$(echo "$INPUT" | tr '[:upper:] _' '[:lower:]-' | sed 's/--*/-/g')
   ```
3. **Check for existing projects**:
   ```bash
   ls -dt .claude/epcc/*/ 2>/dev/null | head -5
   ```
4. **If existing projects found**: Use AskUserQuestion tool to let user choose:
   - Continue existing project (show name and last modified)
   - Start new project with extracted name
5. **Create directory structure** (if not exists):
   ```bash
   mkdir -p .claude/epcc/$PROJECT_NAME
   ```
6. **Set output path**: Commit summary goes to `.claude/epcc/$PROJECT_NAME/EPCC_COMMIT.md`
7. **Reference all project files**: Review all EPCC documents from `.claude/epcc/$PROJECT_NAME/`:
   - `.claude/epcc/<project-name>/EPCC_EXPLORE.md` (exploration findings)
   - `.claude/epcc/<project-name>/EPCC_PLAN.md` (implementation plan)
   - `.claude/epcc/<project-name>/EPCC_CODE.md` (implementation progress)
   - `EPCC_PRD.md` (product requirements, if exists)

## 📝 Commit Objectives

1. **Clear History**: Create meaningful commit messages
2. **Complete Documentation**: Ensure all docs are updated
3. **Clean Code**: No debug statements or TODOs
4. **Pass Checks**: All tests and linters passing
5. **Professional PR**: Ready for review

## Parallel Commit Subagents

Deploy specialized finalization agents concurrently:
@qa-engineer @security-reviewer @documentation-agent @deployment-agent @project-manager

- @qa-engineer: Run final test suite and validate quality metrics
- @security-reviewer: Perform final security scan before commit
- @documentation-agent: Ensure all documentation is complete and updated
- @deployment-agent: Validate deployment readiness and CI/CD configuration
- @project-manager: Review completion against original requirements

Note: Original requirements can be found in .claude/epcc/<project-name>/EPCC_PLAN.md if it exists.

## Pre-Commit Checklist

### Code Quality

```bash

TODO
# Run all tests
npm test  # or pytest

# Check code coverage
npm run coverage  # or pytest --cov

# Run linters
npm run lint  # or flake8/black/isort

# Security scan
npm audit  # or bandit -r .

# Remove debug code
grep -r "console.log\|debugger\|TODO\|FIXME" src/
```

### Documentation Check

```bash
# Ensure documentation is updated
ls -la .claude/epcc/<project-name>/

# Check if README needs updates
grep -i "[feature-name]" README.md

# Verify API documentation
# Check inline comments
```

## Output File: .claude/epcc/<project-name>/EPCC_COMMIT.md

Generate `.claude/epcc/<project-name>/EPCC_COMMIT.md` to document the complete change:

```markdown
# Commit Summary

## Feature: [Feature Name]

## Date: [Current Date]

## Author: [Your Name]

## Changes Overview

### What Changed

- Brief description of changes
- Key files modified
- New functionality added

### Why It Changed

- Business requirement addressed
- Problem solved
- Value delivered

### How It Changed

- Technical approach taken
- Patterns applied
- Technologies used

## Files Changed
```

Modified: src/feature.js
Added: src/feature.test.js
Updated: README.md
Created: docs/feature.md

```

## Testing Summary
- Unit Tests: ✅ All passing (X tests)
- Integration Tests: ✅ All passing (X tests)
- E2E Tests: ✅ All passing (X tests)
- Coverage: 95% (increased from 92%)

## Performance Impact
- Baseline: Xms
- After Change: Xms
- Impact: +/- X%

## Security Considerations
- [ ] Input validation implemented
- [ ] Authentication checked
- [ ] Authorization verified
- [ ] No sensitive data exposed
- [ ] Security scan passed

## Documentation Updates
- [x] Code comments added
- [x] API documentation updated
- [x] README.md updated
- [x] CHANGELOG.md entry added
- [x] EPCC documents completed

## Commit Message

```

feat: Add [feature name] with [key capability]

- Implement [specific functionality]
- Add comprehensive test coverage
- Update documentation
- Improve performance by X%

Closes #[issue-number]

Based on:

- Exploration: .claude/epcc/<project-name>/EPCC_EXPLORE.md
- Plan: .claude/epcc/<project-name>/EPCC_PLAN.md
- Implementation: .claude/epcc/<project-name>/EPCC_CODE.md

```

## Pull Request Description

### Summary
[Brief description of changes]

### Changes Made
- Change 1
- Change 2
- Change 3

### Testing
- How to test the changes
- What to look for
- Edge cases covered

### Screenshots (if UI changes)
[Before/After screenshots]

### Related Issues
- Fixes #[issue]
- Relates to #[issue]

### Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Follows code style
- [ ] Security reviewed
```

## Commit Best Practices

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Formatting, no code change
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding missing tests
- **chore**: Maintenance

### Good Commit Messages

```bash
# Good
git commit -m "feat: Add user authentication with JWT tokens

- Implement login/logout endpoints
- Add JWT token generation and validation
- Include refresh token mechanism
- Add comprehensive test coverage

Closes #123"

# Bad
git commit -m "Fixed stuff"
git commit -m "WIP"
git commit -m "Update code"
```

## Git Commands

### Stage Changes

```bash
# Review changes
git status
git diff

# Stage specific files
git add src/feature.js src/feature.test.js

# Or stage all
git add .

# Unstage if needed
git reset HEAD file.js
```

### Create Commit

```bash
# Commit with message
git commit -m "feat: Implement feature X"

# Commit with detailed message
git commit  # Opens editor for detailed message

# Amend last commit
git commit --amend

# Squash commits
git rebase -i HEAD~3
```

### Push Changes

```bash
# Push to feature branch
git push origin feature/branch-name

# Force push after rebase (careful!)
git push --force-with-lease origin feature/branch-name
```

## Creating the Pull Request

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Checklist

- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged

## EPCC Documentation

- Exploration: [.claude/epcc/<project-name>/EPCC_EXPLORE.md](./.claude/epcc/<project-name>/EPCC_EXPLORE.md)
- Plan: [.claude/epcc/<project-name>/EPCC_PLAN.md](./.claude/epcc/<project-name>/EPCC_PLAN.md)
- Code: [.claude/epcc/<project-name>/EPCC_CODE.md](./.claude/epcc/<project-name>/EPCC_CODE.md)
- Commit: [.claude/epcc/<project-name>/EPCC_COMMIT.md](./.claude/epcc/<project-name>/EPCC_COMMIT.md)
```

## Post-Commit Actions

### After Committing

1. Create/Update Pull Request
2. Request code review
3. Address review feedback
4. Merge when approved
5. Delete feature branch
6. Update project board

### Clean Up EPCC Files

```bash
# Archive EPCC documents (optional - already organized in .claude/epcc/<project-name>/)
# The files are already organized by project, no need to move them
# Optionally, you can archive completed projects:
mkdir -p .claude/epcc-archive/
mv .claude/epcc/<project-name>/ .claude/epcc-archive/

```

## Final Output

Upon completion, ensure `.claude/epcc/<project-name>/EPCC_COMMIT.md` contains:

- Complete change summary
- All test results
- Performance metrics
- Security validations
- Final commit message
- PR description

Remember: **A good commit tells a story of why, what, and how!**
