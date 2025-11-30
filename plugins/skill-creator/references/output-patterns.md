# Output Patterns

This document describes two primary approaches for structuring Claude's output when designing skills.

## Template Pattern

This method involves providing formatted structures for consistent results.

### Strict Templates

Use exact templates with mandatory sections for cases requiring precision (APIs, data formats, structured reports).

**Example - API Response:**
```json
{
  "status": "success",
  "data": { ... },
  "metadata": { ... }
}
```

**When to use:**
- API integrations requiring specific formats
- Data exports with fixed schemas
- Compliance reports with required sections

### Flexible Guidance

Offer suggested structures while encouraging adaptation based on context.

**Example - Analysis Report:**
```markdown
## Executive Summary
[Provide 2-3 sentence overview]

## Key Findings
[List major discoveries]

## Recommendations
[Action items based on findings]

Note: Adjust sections as needed for the specific analysis type.
```

**When to use:**
- Analytical tasks with varying scopes
- Creative outputs requiring contextual judgment
- Processes with optional steps

## Examples Pattern

This approach demonstrates desired output through input/output pairs. Examples help Claude understand the desired style and level of detail more clearly than descriptions alone.

**Example - Commit Messages:**

```
Input: "Added dark mode toggle to settings page"

Output:
feat(ui): add dark mode toggle to settings

Added toggle switch in settings page that allows users to switch
between light and dark themes. Preference is saved to localStorage
and applied globally across all pages.
```

**When to use:**
- Style-specific outputs (commit messages, code comments)
- Complex formatting requirements
- Nuanced tone or voice requirements

## Choosing the Right Pattern

**Use Templates when:**
- Output structure is well-defined
- Consistency across multiple outputs is critical
- Downstream systems depend on specific formats

**Use Examples when:**
- Style and tone matter more than structure
- You want to show rather than tell
- Format is flexible but quality standards are high

**Combine both when:**
- You need consistent structure AND specific style
- Some sections are rigid, others are flexible
- You want to provide scaffolding with concrete demonstrations

## Key Principle

**Match template strictness to actual requirements:** Rigid structures for data consistency, flexible frameworks for contextual work.
