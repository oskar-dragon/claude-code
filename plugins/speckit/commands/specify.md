---
description: Create or update the feature specification from a natural language feature description
---

# Create Feature Specification

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Overview

The text the user typed after `/speckit:specify` is the feature description. Use it to create a complete, structured specification.

## Execution Flow

### 1. Validate Input

If `$ARGUMENTS` is empty, ERROR: "No feature description provided. Usage: /speckit:specify <feature description>"

### 2. Generate Short Name

Analyze the feature description and create a 2-4 word short name:
- Use action-noun format when possible ("add-user-auth", "fix-payment-bug")
- Preserve technical terms and acronyms (OAuth2, API, JWT, etc.)
- Keep it concise but descriptive

Examples:
- "I want to add user authentication" → "user-auth"
- "Implement OAuth2 integration for the API" → "oauth2-api-integration"
- "Create a dashboard for analytics" → "analytics-dashboard"

### 3. Ask User for Branch Name

Present the suggested short name and ask for confirmation:

```
Suggested branch name: [short-name]

Would you like to:
A) Use suggested name: [short-name]
B) Provide custom name
C) Skip branch creation (directory only)

Your choice:
```

Wait for user response before proceeding.

### 4. Determine Feature Number

Check local `.specify/specs/` directories only:
- Scan all directories matching pattern `[0-9]+-*`
- Find highest number N
- Use N+1 for new feature

### 5. Run create-new-feature Script

Execute the script with collected information:

```bash
!${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-new-feature.sh --json --number [N+1] --short-name "[name]" "$ARGUMENTS"
```

The script will:
- Create branch (if in git repo)
- Create `.specify/specs/[NNN]-[name]/` directory
- Copy spec template to `spec.md`
- Output JSON with paths

**Parse the JSON output** to get `BRANCH_NAME`, `SPEC_FILE`, `FEATURE_NUM`, and `FEATURE_DIR`.

### 6. Load Spec Template

Read `.specify/templates/spec-template.md` to understand required sections.

### 7. Create Specification Content

Follow this workflow:

1. **Parse Description**: Extract key concepts (actors, actions, data, constraints)

2. **Handle Unclear Aspects**:
   - Make informed guesses based on context and industry standards
   - Only mark `[NEEDS CLARIFICATION: specific question]` if:
     - Choice significantly impacts scope or UX
     - Multiple reasonable interpretations exist
     - No reasonable default exists
   - **LIMIT: Maximum 3 [NEEDS CLARIFICATION] markers**
   - Prioritize: scope > security/privacy > UX > technical details

3. **Fill Required Sections**:
   - **User Scenarios & Testing**: Define clear user flows
   - **Functional Requirements**: Each must be testable
   - **Success Criteria**: Measurable, technology-agnostic outcomes
   - **Key Entities**: If data is involved

4. **Document Assumptions**: Record reasonable defaults in Assumptions section

### 8. Specification Quality Validation

After writing initial spec, create validation checklist at `[FEATURE_DIR]/checklists/requirements.md`:

```markdown
# Specification Quality Checklist: [FEATURE NAME]

**Purpose**: Validate specification completeness before planning
**Created**: [DATE]
**Feature**: [Link to spec.md]

## Content Quality

- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

## Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Success criteria are technology-agnostic
- [ ] All acceptance scenarios defined
- [ ] Edge cases identified
- [ ] Scope clearly bounded
- [ ] Dependencies and assumptions identified

## Feature Readiness

- [ ] All functional requirements have clear acceptance criteria
- [ ] User scenarios cover primary flows
- [ ] Feature meets measurable outcomes
- [ ] No implementation details leak into specification
```

### 9. Run Validation

Review spec against each checklist item:
- For each item, determine pass/fail
- Document specific issues

**If items fail (excluding [NEEDS CLARIFICATION])**:
1. List failing items and specific issues
2. Update spec to address each issue
3. Re-run validation (max 3 iterations)
4. If still failing, document in checklist notes and warn user

**If [NEEDS CLARIFICATION] markers remain** (max 3):
1. Extract all markers from spec
2. For each clarification, present options:

```markdown
## Question [N]: [Topic]

**Context**: [Quote relevant spec section]

**What we need to know**: [Question from marker]

**Suggested Answers**:

| Option | Answer | Implications |
|--------|--------|--------------|
| A | [First answer] | [What this means] |
| B | [Second answer] | [What this means] |
| C | [Third answer] | [What this means] |
| Custom | Provide your own | [How to provide] |

**Your choice**: _[Wait for user]_
```

3. Present all questions together
4. Wait for user responses
5. Update spec with answers
6. Re-run validation

### 10. Report Completion

Output summary:
- Branch name: [BRANCH_NAME]
- Spec file: [SPEC_FILE]
- Feature number: [FEATURE_NUM]
- Checklist results
- Readiness for next phase

Next steps:
- `/speckit:clarify` (if needed)
- `/speckit:plan <tech stack>`

## Guidelines

### Focus on WHAT and WHY

- Describe user needs and business value
- Avoid HOW to implement (no tech stack, APIs, code)
- Write for business stakeholders, not developers

### Success Criteria Rules

Must be:
1. **Measurable**: Specific metrics (time, percentage, count)
2. **Technology-agnostic**: No frameworks, languages, tools
3. **User-focused**: Outcomes from user/business perspective
4. **Verifiable**: Testable without implementation details

**Good examples**:
- "Users complete checkout in under 3 minutes"
- "System supports 10,000 concurrent users"
- "95% of searches return results in under 1 second"

**Bad examples** (implementation-focused):
- "API response time under 200ms" (too technical)
- "Redis cache hit rate above 80%" (technology-specific)

### Template References

The spec template uses `{SCRIPT}` placeholders. These are replaced with actual script paths from `${CLAUDE_PLUGIN_ROOT}` when executed.

## Error Handling

- If `.specify/` doesn't exist: ERROR "Run /speckit:setup first"
- If git branch creation fails: Continue with directory creation only
- If template not found: Use empty spec file with warning
- If feature number calculation fails: Default to 001

## Important Notes

- Only run create-new-feature script ONCE per feature
- Parse JSON output to get paths
- Branch creation only happens if in git repo
- Feature numbering checks local spec dirs only
- Full validation matching spec-kit methodology
