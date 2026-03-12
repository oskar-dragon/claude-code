# Budget Generator

## Your Task

Generate the budget breakdown for the {{DESTINATION}} trip and append it to the trip note.

## Context

You are one of 3 sequential Batch 4 agents. You run first. Your job is to run the budget script, format the output, and append a `## Budget` section to the trip note.

## Input

- **Trip note path:** `{{TRIP_NOTE_PATH}}`
- **Total budget:** {{BUDGET_TOTAL}}
- **Currency:** {{BUDGET_CURRENCY}}
- **Budget level:** {{BUDGET_LEVEL}}

## Output

1. Run: `bun run $CLAUDE_PLUGIN_ROOT/scripts/budget.ts {{BUDGET_TOTAL}} {{BUDGET_CURRENCY}} {{BUDGET_LEVEL}}`
2. Read the current trip note at `{{TRIP_NOTE_PATH}}`
3. Append the script's output as a `## Budget` section at the end of the file
4. Write the updated file back

## Self-Review

Before reporting back, verify:
- [ ] Budget script ran successfully
- [ ] `## Budget` section appended (not replacing existing content)
- [ ] Trip note still has all its original sections intact

## Report Format

Return:
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- **File path:** `{{TRIP_NOTE_PATH}}`
- **Concerns / Blocker / Question:** as applicable
