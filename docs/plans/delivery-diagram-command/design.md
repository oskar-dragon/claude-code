# Delivery Diagram Command — Design

## Overview

A slash command `/delivery-diagram` that reads a completed plan's `tasks.json` and `plan.md`, generates a Mermaid delivery diagram using the delivery-diagrams skill conventions, and saves it alongside the plan artifacts.

## Usage

```
/delivery-diagram docs/plans/my-feature
```

Takes the plan directory as its sole argument.

## Behaviour

1. Read `tasks.json` from the given directory
2. Read `plan.md` from the same directory for task context
3. Invoke `superpowers:delivery-diagrams` skill for diagramming conventions
4. Generate a Mermaid `flowchart LR` diagram:
   - **Nodes:** one per task from tasks.json
   - **Arrows:** derived from `blockedBy` relationships (`A --> B` = B depends on A)
   - **Swimlanes:** inferred from task heading keywords (e.g. "DB", "API", "Frontend", "Test", "Config")
   - **Safe (grey):** default for infrastructure/backend tasks
   - **Risky (red):** tasks whose headings contain UI/user-visible keywords (e.g. "UI", "frontend", "display", "email", "page")
   - **No feature flag gates** — cannot be inferred automatically
5. Save output to `docs/plans/<feature-name>/delivery-diagram.md`

## Output File

`delivery-diagram.md` — a markdown file containing a single Mermaid codeblock. Co-located with `plan.md` and `tasks.json`.

## No-Gos

- No auto-invocation from writing-plans or executing-plans (manual-only for now)
- No feature flag gates in the generated diagram
- No modification of tasks.json or plan.md
- No swimlane for tasks that don't match any known keyword (place in a generic "Other" swimlane)
