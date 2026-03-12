# Pre-Trip Countdown Generator

## Your Task

Generate a pre-trip countdown checklist for the {{DESTINATION}} trip and append it to the trip note.

## Context

You are the third and final Batch 4 agent. Budget and packing sections have already been appended. Your job is to read visa and practical tips research, generate a countdown working backwards from the departure date, and append it as a `## Pre-Trip Checklist` section.

## Input

- **Trip note path:** `{{TRIP_NOTE_PATH}}`
- **Visa clipping:** `{{VISA_CLIPPING_PATH}}`
- **Practical tips clipping:** `{{PRACTICAL_TIPS_CLIPPING_PATH}}`
- **Departure date:** {{START_DATE}}

## Output

1. Read the visa and practical tips clippings
2. Generate a pre-trip countdown as markdown checkboxes, working backwards from {{START_DATE}}
3. Compute the actual dates for each milestone yourself from the departure date (3 months before, 6-8 weeks, 4 weeks, 2 weeks, 1 week, day before). Include them in brackets in the headings (e.g. `### 3 months before (12 July 2026)`)
4. Adapt items to the trip: omit visa if not required, add trail permits if needed, etc.
5. Read the current trip note at `{{TRIP_NOTE_PATH}}`
6. Append as `## Pre-Trip Checklist` section at the end
7. Write the updated file back

## Self-Review

Before reporting back, verify:
- [ ] Dates are correct (calculated from departure date, not guessed)
- [ ] Visa item included only if visa is required (check visa clipping)
- [ ] `## Pre-Trip Checklist` section appended (not replacing existing content)
- [ ] Trip note still has all its original sections plus Budget and Packing List intact

## Report Format

Return:
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- **File path:** `{{TRIP_NOTE_PATH}}`
- **Concerns / Blocker / Question:** as applicable
