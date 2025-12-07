---
description: Identify underspecified areas in the current feature spec through structured Q&A and encode answers back into the spec
---

# Clarify Feature Specification

## User Input

```text
$ARGUMENTS
```

## Overview

Detect and reduce ambiguity in the active feature specification through structured questioning. **Expected to run BEFORE `/speckit:plan`** to reduce downstream rework.

## Execution Flow

### 1. Find Current Feature

Determine the current feature directory:
- If in git repo: Use current branch name to find `.specify/specs/[branch-name]/`
- If not in git: Find latest numbered spec directory

Load `spec.md` from the feature directory.

### 2. Perform Coverage Scan

Analyze the spec using this taxonomy. Mark each category: Clear / Partial / Missing.

**Categories**:
1. **Functional Scope**: Core goals, out-of-scope items, user roles
2. **Domain & Data**: Entities, relationships, state transitions, scale
3. **UX Flow**: Critical journeys, error states, accessibility
4. **Non-Functional**: Performance, scalability, reliability, security
5. **Integration**: External services, APIs, failure modes
6. **Edge Cases**: Negative scenarios, rate limiting, conflicts
7. **Constraints**: Technical limits, tradeoffs
8. **Terminology**: Glossary, consistent terms

### 3. Generate Clarification Questions

Based on coverage scan, generate up to 5 highly targeted questions:
- Prioritize: Missing > Partial > Ambiguous
- Impact order: Functional scope > Data model > Non-functional > UX > Integration
- Each question must be specific and actionable

### 4. Present Questions (Hybrid Mode)

Present all questions together in this format:

```markdown
# Clarification Questions for [FEATURE NAME]

## Question 1: [Category - Topic]

**Current spec says**: "[Quote or 'Not specified']"

**What we need to know**: [Specific question]

**Why it matters**: [Impact on implementation/testing/UX]

**Suggested answers**:
A) [Option 1]
B) [Option 2]
C) [Option 3]
D) Custom (provide your own)

---

[Repeat for questions 2-5]

---

## How to Respond

**Interactive mode**: Answer each question one by one as I ask
**Batch mode**: Provide all answers at once (e.g., "Q1: A, Q2: Custom - [details], Q3: B, Q4: A, Q5: C")

Your preference?
```

Wait for user to choose mode.

### 5. Collect Answers

**If Interactive**:
- Ask questions sequentially
- Wait for answer before next question
- Allow clarification or refinement

**If Batch**:
- Wait for user to provide all answers
- Parse responses (Q1: X, Q2: Y, etc.)
- Confirm understanding before proceeding

### 6. Update Specification

For each answered question:
1. Locate relevant section in spec
2. Remove any `[NEEDS CLARIFICATION]` markers
3. Insert concrete answer inline
4. Add to "Clarifications" section at end of spec:

```markdown
## Clarifications

### [Date] - Clarification Session

1. **[Question topic]**: [Answer provided]
   - Impact: [What this resolves]

2. **[Question topic]**: [Answer provided]
   - Impact: [What this resolves]
```

### 7. Validate Updated Spec

Check that:
- ✅ All questions have been addressed
- ✅ No new ambiguities introduced
- ✅ Spec sections are consistent
- ✅ Requirements remain testable

### 8. Output Summary

Report:
- Number of questions asked and answered
- Sections updated in spec
- Any remaining ambiguities (if user skipped questions)
- Readiness assessment for `/speckit:plan`

## Guidelines

### Question Quality

Good questions:
- Specific and bounded ("What happens when X?")
- Answerable without implementation details
- Clear impact on spec completeness

Bad questions:
- Implementation details ("Which database?")
- Premature optimization ("How fast should caching be?")
- Already answered in spec

### Handling "Skip"

If user wants to skip clarification:
- Warn about increased rework risk
- Document skipped questions in spec
- Allow proceeding to `/speckit:plan`

### Maximum Questions

- Limit: 5 questions per session
- If more needed, run `/speckit:clarify` again after user reviews
- Prioritize ruthlessly - ask only what blocks planning

## Error Handling

- If no spec file found: ERROR "Run /speckit:specify first"
- If spec is already clear: SUCCESS "No clarifications needed"
- If user cancels mid-session: Save partial answers, allow resume

## Next Steps

After clarification:
- Update requirements checklist
- Ready for `/speckit:plan <tech stack>`
- User can run `/speckit:clarify` again if needed
