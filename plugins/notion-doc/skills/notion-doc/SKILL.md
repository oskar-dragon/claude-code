---
name: notion-doc
description: This skill should be used when the user asks to "create a notion doc", "generate a project document", "write a PRD", "create a pitch document", "generate notion PRD", "write project spec", or mentions creating a project document from design docs. Takes design doc file path(s) as input and generates a structured Notion-style PRD.
disable-model-invocation: true
---

# Notion Project Document Generator

## Overview

Generate structured Qogita project documents (Notion PRDs) from existing design/planning docs. Read the source docs, synthesize them into the canonical template, and write the output to `docs/notion_prds/<project-name>.md`.

**Announce at start:** "Using the notion-doc skill to generate the project document."

## Input

The user provides one or more doc file paths in their message. These are typically design docs created during brainstorming/planning and live in `docs/` directories.

If no doc paths are provided, ask the user:

- "Which design doc(s) should I use as input? They're usually in the docs/ directory."
- Offer to glob for `docs/**/*.md` to help them find the right files.

Read all provided docs before generating.

## Output

Write the generated document to: `docs/notion_prds/<project-name>.md`

Derive `<project-name>` from the primary input filename (e.g., `docs/ml-pricing-design.md` becomes `docs/notion_prds/ml-pricing-design.md`). Create the `docs/notion_prds/` directory if it doesn't exist.

## Document Structure

Generate each section in order. For the full template reference, consult `references/template.md`.

```markdown
# **Problem**

[Synthesized from source docs — detailed but scannable]

# Solution

[Synthesized from source docs — overview with key design decisions]

# **Estimated Impact**

[Only include if source docs contain data/calculations. Otherwise: "TBD — requires impact analysis."]

# No-gos

[Extract from source docs. If not explicitly stated, ask the user what's out of scope.]

# Open Questions

[Carry over unresolved questions from source docs. Add any new ones identified during synthesis.]

# Technical Specification

[Core technical approach from source docs]

## Architecture

[Mermaid diagrams — see references/formats.md]

## API Spec

[API contract changes — see references/formats.md]

## Tech Debt

[Trade-offs identified in source docs]

# Testing Strategy

[Given/When/Then acceptance criteria — see references/formats.md]

# Release Strategy

[Feature flags, rollout plan from source docs. Default: recommend feature flags.]
```

## Writing Style

- **Pragmatic and concise.** No walls of text. Use bullet points and tables.
- **Scannable.** Headers, bold key terms, short paragraphs.
- **Honest about unknowns.** Never fabricate data, estimates, or impact calculations. Mark unknowns as TBD.
- **Implementation-aware.** Enough detail for engineers to understand what's being built, but tasks will have the lower-level implementation details.

## Handling Missing Information

When source docs don't contain enough information for a section:

1. **Estimated Impact** — Always mark TBD unless source docs contain actual data.
2. **No-gos** — Ask the user what's out of scope.
3. **API changes / DB changes** — Ask: "Does this project involve API or database changes? If so, what endpoints/models are affected?"
4. **Testing Strategy** — Ask: "Any specific testing scenarios or acceptance criteria I should include?"
5. **Release Strategy** — Default to recommending feature flags if not specified.

## Format Specifications

For API contract changes, database model changes, diagram guidelines, and test case formats, consult `references/formats.md`.

## Checklist

Before finalizing the document, verify:

- [ ] All sections from the template are present (even if marked TBD)
- [ ] No fabricated data or estimates
- [ ] API changes use the table format (if applicable)
- [ ] DB model changes use the table format with migration strategy (if applicable)
- [ ] Mermaid diagrams are valid and add clarity (if included)
- [ ] Test cases use Given/When/Then format
- [ ] Document is concise and scannable
- [ ] Open questions are captured
- [ ] User was asked about any missing information
