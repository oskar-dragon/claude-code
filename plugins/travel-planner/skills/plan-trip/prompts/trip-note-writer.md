# Trip Note Writer

## Your Task

Write the trip note for **{{TRIP_NAME}}** at `{{TRIP_NOTE_PATH}}`.

## Context

You are writing the main trip note for a {{TRIP_TYPE}} to {{DESTINATION}}, {{START_DATE}} to {{END_DATE}}. All research has already been done and is available in clipping files. You read those files to build the itinerary and supporting sections. Every specific place you mention must be linked using `[[Location Name]]` wikilinks — these links will be used to create individual location notes after you're done.

## Input

Read these 8 research clipping files:
- `{{CLIPPING_PATH_VISA}}` — Visa & Entry Requirements
- `{{CLIPPING_PATH_WEATHER}}` — Weather & Best Time to Visit
- `{{CLIPPING_PATH_TRANSPORT}}` — Transport
- `{{CLIPPING_PATH_ATTRACTIONS}}` — Attractions & Activities
- `{{CLIPPING_PATH_FOOD}}` — Food Scene & Restaurants
- `{{CLIPPING_PATH_NEIGHBOURHOODS}}` — Neighbourhoods & Areas to Stay
- `{{CLIPPING_PATH_EVENTS}}` — Events During Travel Dates
- `{{CLIPPING_PATH_PRACTICAL}}` — Practical Tips

Also use:
- **User preferences:** travel style: {{TRAVEL_STYLE}}, budget: {{BUDGET_LEVEL}}, pace: {{PACE_PREFERENCE}}, interests: {{INTERESTS}}, dietary: {{DIETARY_RESTRICTIONS}}, companions: {{TRAVEL_COMPANIONS}}
- **Trip details:** budget: {{BUDGET_TOTAL}} {{BUDGET_CURRENCY}}, must-sees: {{MUST_SEES}}
- **Country note:** `{{COUNTRY_NOTE_PATH}}`
- **Region note:** `{{REGION_NOTE_PATH}}`

## Output

Write the trip note to `{{TRIP_NOTE_PATH}}` with this structure:

**Frontmatter:**

```yaml
---
categories:
  - "[[Trips]]"
created: {{TODAY}}
start: {{START_DATE}}
end: {{END_DATE}}
location: "[[{{COUNTRY}}]]"
type: {{TRIP_TYPE}}
---
```

**Body — in this exact order:**

1. `![[Map.base#Location]]` — map embed, first line after frontmatter

2. `## Itinerary` — day-by-day plan using research data
   - Use `### Day N (DD/MM)` headings
   - List activities as bullet points
   - **Link every specific place** using `[[Location Name]]` wikilinks
   - Group activities geographically to minimise travel within a day
   - For campervan/road trips: include driving distances and times
   - For through-hikes: include daily mileage, elevation, camp spots
   - Balance pace against user's preference ({{PACE_PREFERENCE}})

3. `## Accommodation` — list per night or block of nights
   - Format: `- **Nights 1-3:** [[Hotel Name]], [[Neighbourhood]] — [Book]`
   - Use neighbourhood names from the Neighbourhoods clipping

4. `## Links` — booking placeholder links
   - Flights, accommodation, car hire, key tours/permits

5. `## Notes` — critical practical info
   - Visa status, must-book-in-advance items, key warnings, events during dates

Invoke the `obsidian:obsidian-markdown` skill for formatting guidance before writing.

## Critical Rules

- **Every specific place gets a wikilink.** Restaurants, hotels, attractions, viewpoints, trails, markets, transport hubs — if it has a name, link it with `[[Name]]`. The downstream location creation depends on this.
- **Do not link generic descriptions.** "a local restaurant" = no link. "[[Zhongyi Market]]" = link.
- **Wikilink neighbourhood names in the Accommodation section.** Use `[[Neighbourhood Name]]` for each neighbourhood mentioned, even though these are regions not locations. The downstream wikilink extraction step expects them and filters them out. If you don't link them, they won't be filtered and may be missed.

## Self-Review

Before reporting back, verify:
- [ ] File written to the correct path
- [ ] Frontmatter has all required fields
- [ ] Every named place in the itinerary has a `[[wikilink]]`
- [ ] Day headings use the correct format: `### Day N (DD/MM)`
- [ ] All 5 sections present in correct order (map embed, itinerary, accommodation, links, notes)
- [ ] Trip type adaptations applied (driving distances for road trips, daily mileage for hikes, etc)
- [ ] Pace matches user preference

## Report Format

Return:
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- **File path:** path to trip note
- **Concerns:** (if DONE_WITH_CONCERNS) e.g. "some days are light on activities due to thin research", "had to guess on accommodation neighbourhood"
- **Blocker:** (if BLOCKED) what prevented completion
- **Question:** (if NEEDS_CONTEXT) what information is missing
