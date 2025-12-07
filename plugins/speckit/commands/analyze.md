---
description: Cross-artifact consistency and coverage analysis
---

# Analyze Feature Quality

## Overview

Perform comprehensive cross-artifact analysis to ensure consistency, completeness, and quality across specification, plan, and implementation.

## Execution Flow

### 1. Locate Feature Artifacts

Load all feature files:
- `.specify/specs/[feature]/spec.md`
- `.specify/specs/[feature]/plan.md`
- `.specify/specs/[feature]/tasks.md`
- `.specify/specs/[feature]/data-model.md`
- `.specify/specs/[feature]/contracts/`
- `.specify/memory/constitution.md`

### 2. Perform Multi-Dimensional Analysis

**Dimension 1: Requirement Coverage**
- Every requirement in spec appears in plan
- Every requirement has tasks assigned
- No orphaned tasks (tasks not linked to requirements)

**Dimension 2: Success Criteria Mapping**
- Each success criterion maps to implementation
- Tests exist to validate criteria
- Measurement approach is clear

**Dimension 3: Data Model Consistency**
- Entities in spec match data-model.md
- Relationships are complete
- State transitions documented

**Dimension 4: Contract Completeness**
- All external interfaces defined
- Contract tests exist for each
- Error scenarios covered

**Dimension 5: Constitutional Compliance**
- Plan follows all constitutional principles
- Any violations are justified
- No forbidden patterns in implementation

**Dimension 6: Test Coverage**
- Contract tests: All contracts
- Integration tests: All critical paths
- Unit tests: Complex logic only
- TDD order maintained

**Dimension 7: Terminology Consistency**
- Same terms used across all artifacts
- No conflicting definitions
- Glossary terms match usage

### 3. Generate Analysis Report

Create report structure:

```markdown
# Quality Analysis: [FEATURE NAME]

**Analysis Date**: [DATE]
**Feature**: [feature-number-name]
**Status**: [PASS/WARN/FAIL]

## Executive Summary

- Overall Score: [N%]
- Critical Issues: [N]
- Warnings: [N]
- Recommendations: [N]

## Dimension Scores

| Dimension | Score | Status | Critical Issues |
|-----------|-------|--------|-----------------|
| Requirement Coverage | [N%] | [✅/⚠️/❌] | [N] |
| Success Criteria | [N%] | [✅/⚠️/❌] | [N] |
| Data Model | [N%] | [✅/⚠️/❌] | [N] |
| Contracts | [N%] | [✅/⚠️/❌] | [N] |
| Constitution | [N%] | [✅/⚠️/❌] | [N] |
| Test Coverage | [N%] | [✅/⚠️/❌] | [N] |
| Terminology | [N%] | [✅/⚠️/❌] | [N] |

## Detailed Findings

### ❌ Critical Issues (Must Fix)

1. **[Issue Title]**
   - Location: [file:line]
   - Problem: [Description]
   - Impact: [What breaks]
   - Fix: [How to resolve]

### ⚠️ Warnings (Should Fix)

1. **[Warning Title]**
   - Location: [file:line]
   - Concern: [Description]
   - Suggestion: [How to improve]

### 💡 Recommendations (Nice to Have)

1. **[Recommendation Title]**
   - Opportunity: [Description]
   - Benefit: [Why it helps]

## Coverage Gaps

### Missing Requirements
- [List requirements without implementation]

### Missing Tests
- [List contracts/features without tests]

### Orphaned Tasks
- [List tasks not linked to requirements]

## Consistency Issues

### Terminology Conflicts
- Term "[X]" used as: [definition 1] (spec) vs [definition 2] (plan)

### Data Model Mismatches
- Entity "[X]" in spec but missing in data-model.md

## Constitutional Compliance

### Violations
- [List any constitutional violations]

### Justified Exceptions
- [List approved exceptions with rationale]

## Recommendations

1. **Priority 1 (Critical)**: [Action items]
2. **Priority 2 (Important)**: [Action items]
3. **Priority 3 (Optional)**: [Action items]

## Sign-Off

- [ ] All critical issues resolved
- [ ] Warnings acknowledged and planned
- [ ] Feature ready for implementation/review
```

### 4. Save Report

Write to: `.specify/specs/[feature]/analysis-report.md`

### 5. Output Summary

Show user:
- Overall health score
- Count of critical issues
- Top 3 recommendations
- Next actions required

## Analysis Guidelines

### Scoring

**Score calculation**:
- Each dimension: 0-100%
- Overall: Weighted average
- Critical issues: -10% each
- Warnings: -2% each

**Thresholds**:
- 90-100%: ✅ PASS
- 70-89%: ⚠️ WARN
- <70%: ❌ FAIL

### Issue Severity

**Critical** (❌):
- Requirement without implementation
- Missing contract test
- Constitutional violation
- Data model conflict

**Warning** (⚠️):
- Missing integration test
- Terminology inconsistency
- Incomplete documentation

**Recommendation** (💡):
- Optimization opportunity
- Additional test suggestion
- Documentation enhancement

## Error Handling

- If files missing: PARTIAL "Analyze available artifacts only"
- If no artifacts: ERROR "Run /speckit:specify first"
- If constitution missing: SKIP "Constitutional analysis"

## Next Steps

After analysis:
- Address critical issues
- Plan for warnings
- Consider recommendations
- Re-run analysis to verify fixes
- Proceed to implementation or code review
