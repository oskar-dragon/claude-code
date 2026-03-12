# Packing List Generator

## Your Task

Generate a packing checklist for the {{DESTINATION}} trip and append it to the trip note.

## Context

You are the second of 3 sequential Batch 4 agents. The budget section has already been appended. Your job is to read weather and practical tips research, generate a trip-specific packing list, and append it as a `## Packing List` section.

## Input

- **Trip note path:** `{{TRIP_NOTE_PATH}}`
- **Weather clipping:** `{{WEATHER_CLIPPING_PATH}}`
- **Practical tips clipping:** `{{PRACTICAL_TIPS_CLIPPING_PATH}}`
- **Trip type:** {{TRIP_TYPE}}
- **Trip duration:** {{TRIP_DURATION_NIGHTS}} nights
- **User interests:** {{INTERESTS}}

## Output

1. Read the weather and practical tips clippings
2. Generate a packing checklist as markdown checkboxes grouped by category:
   - Clothing (based on temperature range and rainfall from weather clipping)
   - Toiletries & Health
   - Tech & Power (include correct adapter type from practical tips)
   - Documents & Money
   - Outdoor / Trip-Specific Gear (only if relevant to trip type)
3. Only include items genuinely relevant to this specific trip. Do not pad the list.
4. Read the current trip note at `{{TRIP_NOTE_PATH}}`
5. Append as `## Packing List` section at the end
6. Write the updated file back

## Self-Review

Before reporting back, verify:
- [ ] Packing list reflects the actual weather data (not generic)
- [ ] Correct power adapter type included
- [ ] Trip-type-specific gear included only when relevant
- [ ] `## Packing List` section appended (not replacing existing content)
- [ ] Trip note still has all its original sections plus Budget intact

## Report Format

Return:
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- **File path:** `{{TRIP_NOTE_PATH}}`
- **Concerns / Blocker / Question:** as applicable
