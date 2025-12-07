---
description: Convert tasks from task breakdown to GitHub issues
---

# Convert Tasks to GitHub Issues

## Overview

Transform the task breakdown into tracked GitHub issues for project management and collaboration.

## Prerequisites

- GitHub CLI (`gh`) must be installed
- Repository must have GitHub remote
- User must be authenticated (`gh auth login`)

## Execution Flow

### 1. Check Prerequisites

Verify:
```bash
gh --version
gh auth status
```

If not authenticated or gh not found, provide installation/auth instructions.

### 2. Load Tasks

Find active feature:
- Load `.specify/specs/[feature]/tasks.md`
- Parse all tasks
- Extract metadata (phase, description, file paths, parallel markers)

### 3. Ask User for Issue Creation Strategy

Present options:

```
How should tasks be converted to GitHub issues?

A) One issue per task (most granular)
B) One issue per phase (grouped by phase)
C) One issue for entire feature (single epic)
D) Custom (specify grouping)

Your choice:
```

### 4. Prepare Issue Labels

Check if labels exist, create if needed:
```bash
gh label create "speckit" --description "Created by SpecKit" --color "0052CC"
gh label create "feature" --description "New feature" --color "0E8A16"
gh label create "phase-1" --description "Phase 1 tasks" --color "FBCA04"
# ... for each phase
```

### 5. Create Issues Based on Strategy

**Strategy A: One Issue Per Task**

For each task:
```bash
gh issue create \
  --title "[Feature NNN] Task: [description]" \
  --body "[Generated body with context]" \
  --label "speckit,feature,phase-N" \
  --assignee "[user]"
```

**Strategy B: One Issue Per Phase**

For each phase:
```bash
gh issue create \
  --title "[Feature NNN] Phase N: [Phase name]" \
  --body "[Task list in markdown]" \
  --label "speckit,feature,phase-N"
```

**Strategy C: Single Epic Issue**

Create one issue with all tasks:
```bash
gh issue create \
  --title "[Feature NNN] [Feature name]" \
  --body "[All tasks organized by phase]" \
  --label "speckit,feature,epic"
```

### 6. Issue Body Template

For each issue, generate rich body:

```markdown
## Feature: [Feature Name]

**Feature Number**: [NNN]
**Phase**: [N]
**Spec**: [Link to spec.md]
**Plan**: [Link to plan.md]

## Description

[Task description from tasks.md]

## File(s) to Modify

- `[file/path/1.ts]`
- `[file/path/2.ts]`

## Prerequisites

- [ ] [Prerequisite 1]
- [ ] [Prerequisite 2]

## Acceptance Criteria

- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Implementation Notes

[Type]: [Test/Implementation/Integration]
[Parallelizable]: [Yes/No]

## Related

- Spec: `.specify/specs/[feature]/spec.md`
- Plan: `.specify/specs/[feature]/plan.md`
- Tasks: `.specify/specs/[feature]/tasks.md`

---

*Created by SpecKit `/speckit:taskstoissues`*
```

### 7. Track Created Issues

Maintain mapping file: `.specify/specs/[feature]/github-issues.json`

```json
{
  "feature": "[feature-name]",
  "created": "[timestamp]",
  "strategy": "[A/B/C]",
  "issues": [
    {
      "number": 123,
      "title": "[Issue title]",
      "url": "[GitHub URL]",
      "task": "[Task description]",
      "phase": "[Phase N]",
      "status": "open"
    }
  ]
}
```

### 8. Update tasks.md

Add GitHub issue links to tasks:

```markdown
- [ ] Task description (file: path/to/file) [#123](https://github.com/org/repo/issues/123)
```

### 9. Output Summary

Show user:

```
✅ GitHub Issues Created

Strategy: [One issue per task]
Total issues created: [N]

Created:
- #123: [Task 1] (https://github.com/org/repo/issues/123)
- #124: [Task 2] (https://github.com/org/repo/issues/124)
...

Mapping saved to: .specify/specs/[feature]/github-issues.json
Tasks updated with issue links

View all issues:
gh issue list --label "speckit"

View feature issues:
gh issue list --label "speckit" --search "Feature [NNN]"
```

## Advanced Options

### Milestones

Ask user to assign to milestone:
```bash
gh api repos/:owner/:repo/milestones
# Show list, let user choose
gh issue create ... --milestone [N]
```

### Assignees

Ask who should be assigned:
```bash
gh issue create ... --assignee "[username]"
```

### Projects

Link to GitHub Projects:
```bash
gh issue create ... --project "[Project name]"
```

## Error Handling

- If gh not found: GUIDE "Install GitHub CLI"
- If not authenticated: GUIDE "Run: gh auth login"
- If no remote: ERROR "Add GitHub remote first"
- If issue creation fails: RETRY with error details
- If rate limited: WARN "GitHub API rate limit, waiting..."

## Sync Back

To sync issue status back to tasks.md:

```bash
# Check issue status
gh issue view [N] --json state

# Update tasks.md accordingly
- [x] Completed task (if issue closed)
- [ ] Open task (if issue open)
```

## Next Steps

After issue creation:
- Share issue links with team
- Track progress in GitHub
- Use for sprint planning
- Link PRs to issues
- Close issues as tasks complete
