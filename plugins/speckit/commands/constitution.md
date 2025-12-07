---
description: Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync
---

# Create/Update Project Constitution

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

You are updating the project constitution at `.specify/memory/constitution.md`. This file is a TEMPLATE containing placeholder tokens in square brackets (e.g. `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Your job is to:
1. Collect/derive concrete values
2. Fill the template precisely
3. Propagate any amendments across dependent artifacts

## Execution Flow

### 1. Load Existing Constitution

Load the constitution template at `.specify/memory/constitution.md`:
- Identify every placeholder token of the form `[ALL_CAPS_IDENTIFIER]`
- **IMPORTANT**: The user might require fewer or more principles than in the template. If a number is specified, respect that and adapt the template accordingly.

### 2. Collect Values for Placeholders

Use **interactive Q&A** to gather values:
- **Project Name**: Ask user for project name
- **Principles**: Ask how many principles they want (default: 9 like spec-kit)
- **For each principle**: Ask for principle name and description
- **Governance Dates**:
  - `RATIFICATION_DATE`: Original adoption date (ask or use today)
  - `LAST_AMENDED_DATE`: Today if making changes
- **Version**: Increment according to semantic versioning:
  - MAJOR: Backward incompatible changes
  - MINOR: New principles added
  - PATCH: Clarifications/wording fixes

### 3. Interactive Questioning

For each placeholder, ask the user:

```
Question: [Clear, specific question about the placeholder]

Options:
A) [Suggested answer 1]
B) [Suggested answer 2]
C) [Suggested answer 3]
D) Custom (provide your own)

Your choice:
```

Present all questions sequentially and collect answers.

### 4. Draft Updated Constitution

- Replace every placeholder with concrete text
- Preserve heading hierarchy
- Ensure each Principle section has:
  - Succinct name
  - Paragraph or bullet list of non-negotiable rules
  - Explicit rationale
- Ensure Governance section includes:
  - Amendment procedure
  - Versioning policy
  - Compliance review expectations

### 5. Consistency Propagation

Verify and update dependent files:
- Read `.specify/templates/plan-template.md` - align "Constitution Check" sections
- Read `.specify/templates/spec-template.md` - ensure mandatory sections match
- Read `.specify/templates/tasks-template.md` - align task categorization with principles
- Update any references to changed principles

### 6. Sync Impact Report

Prepend as HTML comment at top of constitution file:

```html
<!--
Version change: X.Y.Z → A.B.C
Modified principles: [list]
Added sections: [list]
Removed sections: [list]
Templates updated: [list with ✅/⚠️ status]
Follow-up TODOs: [any deferred items]
-->
```

### 7. Validation

Before final output, check:
- ✅ No remaining unexplained bracket tokens
- ✅ Version line matches report
- ✅ Dates in ISO format (YYYY-MM-DD)
- ✅ Principles are declarative and testable
- ✅ No vague language ("should" → MUST/SHOULD with rationale)

### 8. Write Updated Constitution

Write the completed constitution to `.specify/memory/constitution.md` (overwrite).

### 9. Output Summary

Provide final summary with:
- New version and bump rationale
- Any files flagged for manual follow-up
- Suggested commit message (e.g., `docs: amend constitution to vX.Y.Z`)

## Formatting & Style

- Use Markdown headings exactly as in template
- Wrap long lines (<100 chars ideally)
- Single blank line between sections
- No trailing whitespace

## Important Notes

- If user supplies partial updates, still perform validation and version decision
- If critical info is missing, insert `TODO(<FIELD_NAME>): explanation` and note in report
- Do not create new template; always operate on existing `.specify/memory/constitution.md`
- The constitution guides ALL subsequent development - take time to get it right
