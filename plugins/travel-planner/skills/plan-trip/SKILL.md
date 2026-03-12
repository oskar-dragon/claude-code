---
name: plan-trip
description: This skill should be used when the user asks to "plan a trip", "create a trip itinerary", "help me plan travel to", "organise a holiday", "plan a vacation", "plan a campervan trip", "help me plan a hike", or mentions trip planning, travel planning, holiday planning, or itinerary creation to a specific destination. Orchestrates full trip planning — researches destinations via parallel subagents, generates itineraries, creates Obsidian location/country/region notes, budgets, packing lists, and pre-trip timelines.
version: 0.2.0
---

## Overview

This skill is a pure orchestrator. It coordinates subagents via prompt templates in the `prompts/` directory. The orchestrator never reads or holds research content — only file paths and status codes from each subagent.

Reference files:
- `references/research-categories.md` — category descriptions and trip type adaptations
- `prompts/` — prompt templates for all subagent roles

---

## Model Selection

| Batch | Role | Model |
|-------|------|-------|
| Batch 1 | Research agents (8 parallel) | `sonnet` |
| Batch 2 | Country/region note creators | `haiku` |
| Step 5 | Trip note writer | `sonnet` |
| Batch 3 | Location note creators (chunked) | `haiku` |
| Batch 4 | Budget/packing/countdown (sequential) | `haiku` |

---

## Status Handling

All subagents return one of four statuses. Handle as follows:

| Status | Action |
|--------|--------|
| DONE | Record result, proceed |
| DONE_WITH_CONCERNS | Record result, log concern for final summary |
| BLOCKED | Log blocker, skip downstream steps that depend on this output |
| NEEDS_CONTEXT | Provide missing context, re-dispatch |

---

## Step 1 — Load Preferences

Before asking the user anything, load their travel preferences. Run:

```bash
bun run $CLAUDE_PLUGIN_ROOT/scripts/preferences.ts
```

The script prints preferences as JSON to stdout and exits 0 on success. If exit code is 1, the config file does not exist yet and you must onboard the user.

**Onboarding flow (exit code 1 only):**

Tell the user you need a few preferences before you can plan effectively. Ask the following in a single message grouped into two or three short sections — do not fire them one at a time:

- **Travel style:** adventurous, relaxed, or balanced
- **Budget level:** budget, mid-range, or luxury
- **Accommodation preferences:** e.g. hotels, hostels, Airbnb, campervan, wild camping, huts
- **Interests:** e.g. culture, food, photography, hiking, history, wildlife, nightlife, architecture
- **Dietary restrictions:** e.g. vegetarian, vegan, gluten-free, halal, kosher, none
- **Pace preference:** slow (fewer places, more depth), moderate, or fast (cover maximum ground)
- **Travel companions:** solo, couple, family with children (ages help), group of friends
- **Preferred research sources:** websites or communities they trust most for travel research (e.g. Lonely Planet, Atlas Obscura, The Dyrt, iOverlander, local blogs)

Write their responses to `~/.claude/travel-planner.local.md` in YAML frontmatter format:

```yaml
---
travel_style: balanced
budget_level: mid-range
accommodation_preference:
  - hotels
  - airbnb
interests:
  - food
  - photography
  - hiking
dietary_restrictions: []
pace_preference: moderate
travel_companions: couple
preferred_sources:
  - Lonely Planet
  - Atlas Obscura
---
```

Re-run `bun run $CLAUDE_PLUGIN_ROOT/scripts/preferences.ts` after writing to confirm it parses correctly. If it exits 1 again, report the parse error to the user and ask them to correct their input.

---

## Step 2 — Collect Trip Details

Once preferences are loaded, collect the details for this specific trip. Ask everything in 1-2 focused messages — do not drip-feed questions one at a time. Group related questions together:

**Message 1 — the basics:**
- **Destination** — city, region, or country. Be as specific or as broad as they like; you will narrow it down during research.
- **Dates** — start and end dates, including travel days. If they are flexible, ask for a rough window.
- **Budget** — total budget for the trip and which currency.
- **Trip type** — this significantly shapes research priorities and the itinerary structure. Present these options clearly: campervan, through-hike, city break, road trip, wild camping, beach holiday, cultural tour — or ask them to describe their own. Refer to `references/research-categories.md` for how each type adapts the research categories.

**Message 2 (if anything is unclear or missing):**
- **Travellers** — number and composition: solo, couple, family with children (note ages if children), group of friends.
- **Purpose** — what does a successful trip feel like? Leisure and rest, adventure and challenge, cultural immersion, relaxation, celebration, etc.
- **Must-sees** — anything they have already decided they must do or see. These become anchors in the itinerary and are handed to Batch 1 research agents as high-priority items.

Hold all collected details in memory for use throughout the remaining steps.

---

## Step 3 — Batch 1: Research

1. Compute 8 clipping file paths using the pattern: `Clippings/<Trip Name> — <Category>.md`
   Categories: Visa & Entry Requirements, Weather & Best Time to Visit, Transport, Attractions & Activities, Food Scene & Restaurants, Neighbourhoods & Areas to Stay, Events During Travel Dates, Practical Tips

2. For each of the 8 categories:
   - Read `prompts/researcher.md`
   - Fill in all `{{PLACEHOLDER}}` variables (destination, dates, trip type, interests, dietary restrictions, must-sees, preferred sources, category name, category description from `references/research-categories.md`, trip type adaptations, target file path, today's date, country)
   - Dispatch with `run_in_background: true`, `model: sonnet`

3. Wait for all 8 to complete.

4. For each result:
   - DONE / DONE_WITH_CONCERNS → record file path, log any concerns
   - BLOCKED → log blocker, note which category is missing

**Orchestrator now holds: 8 clipping file paths. Not research content.**

---

## Step 4 — Batch 2: Country & Region Notes

Run both in parallel:

1. **Country note:**
   - Read `prompts/country-creator.md`
   - Fill in: country name, `{{VISA_CLIPPING_PATH}}`, `{{PRACTICAL_TIPS_CLIPPING_PATH}}`, `{{TRANSPORT_CLIPPING_PATH}}`, `{{WEATHER_CLIPPING_PATH}}`
   - Dispatch with `model: haiku`

2. **Region note:**
   - Read `prompts/region-creator.md`
   - Fill in: region name, country, `{{NEIGHBOURHOODS_CLIPPING_PATH}}`
   - Dispatch with `model: haiku`

3. Wait for both. Handle statuses. Record:
   - Country note file path and whether `created` or `existing`
   - Region note file path and whether `created` or `existing`

---

## Step 5 — Write Trip Note

1. Read `prompts/trip-note-writer.md`
2. Fill in all placeholders:
   - All 8 clipping file paths (`{{CLIPPING_PATH_VISA}}`, `{{CLIPPING_PATH_WEATHER}}`, `{{CLIPPING_PATH_TRANSPORT}}`, `{{CLIPPING_PATH_ATTRACTIONS}}`, `{{CLIPPING_PATH_FOOD}}`, `{{CLIPPING_PATH_NEIGHBOURHOODS}}`, `{{CLIPPING_PATH_EVENTS}}`, `{{CLIPPING_PATH_PRACTICAL}}`)
   - Trip details: trip name, trip note path, destination, start/end dates, trip type, today's date, country
   - User preferences: travel style, budget level, pace, interests, dietary restrictions, companions, budget total, budget currency, must-sees
   - Country and region note paths
3. Dispatch with `model: sonnet`, wait for completion.
4. Handle status. Record the trip note file path.

---

## Step 5b — Extract Wikilinks

This step is done by the orchestrator directly — no subagent needed.

1. Read the written trip note.
2. Extract all `[[wikilinks]]` using Grep with pattern `\[\[([^\]]+)\]\]`.
3. Build the exclusion list:
   - Country name
   - Region name
   - Trip note name
   - `Trips`, `Clippings`, `Claude`, `Map.base`
   - All 8 clipping note names
   - Neighbourhood names (from the Neighbourhoods clipping path or Batch 2 region context)
4. Remove excluded links from the wikilink list.
5. For each remaining link, infer its `create-location` type from context in the trip note:
   - Restaurant/food context → `Restaurants`
   - Accommodation section → `Hotel` or `Campsite`
   - Viewpoint/photo context → `Photo Locations`
   - Trail/hike context → `Trails`
   - Everything else → `Other`
   - Non-place artefacts (e.g. `[[Book]]`) → log warning, skip
6. Check vault for existing notes: Glob `Travel/Locations/<Name>.md` for each. Remove existing ones from the create list, record as `existing`.
7. The result is the **authoritative location list**: names and inferred types.

---

## Step 6 — Batch 3: Location Notes

Process the authoritative location list in chunks of 10:

For each chunk:
1. For each location in the chunk:
   - Read `prompts/location-creator.md`
   - Fill in: location name, location type, country, region
   - Fill in all 5 clipping paths: `{{CLIPPING_PATH_ATTRACTIONS}}`, `{{CLIPPING_PATH_FOOD}}`, `{{CLIPPING_PATH_NEIGHBOURHOODS}}`, `{{CLIPPING_PATH_TRANSPORT}}`, `{{CLIPPING_PATH_PRACTICAL}}`
2. Dispatch all locations in the chunk in parallel with `model: haiku`
3. Wait for all in the chunk to complete
4. Handle statuses for each: record created/existing/blocked/concerns
5. Repeat for the next chunk

Run Batch 3 concurrently with Batch 4 (Step 7) — dispatch both before waiting.

---

## Step 7 — Batch 4: Trip Extras

Dispatch Batch 4 concurrently with Batch 3. Within Batch 4, run sequentially:

1. **Budget:**
   - Read `prompts/budget-generator.md`
   - Fill in: destination, trip note path, budget total, budget currency, budget level
   - Dispatch with `model: haiku`, wait for completion before proceeding

2. **Packing:**
   - Read `prompts/packing-generator.md`
   - Fill in: destination, trip note path, weather clipping path, practical tips clipping path, trip type, trip duration in nights, interests
   - Dispatch with `model: haiku`, wait for completion before proceeding

3. **Countdown:**
   - Read `prompts/countdown-generator.md`
   - Fill in: destination, trip note path, visa clipping path, practical tips clipping path, start date
   - Dispatch with `model: haiku`, wait for completion

---

## Step 8 — Expense Tracking

After the trip note is fully written, check whether an expense tracking base already exists. Use the Glob tool to search for `Categories/Expenses.base` inside the vault.

If the file does not exist, invoke the `obsidian:obsidian-bases` skill to create it at:

```
/Users/oskardragon-work/workspaces/obsidian/Categories/Expenses.base
```

The base should have these fields:
- **Trip** — link to trip note
- **Date** — date field
- **Category** — select field with options: accommodation, food, activities, transport, misc
- **Description** — text field
- **Amount** — number field
- **Currency** — text field

If the base already exists, skip creation.

Regardless of whether the base was created or already existed, add a link to it in the trip note's `## Links` section:

```markdown
- Expense tracker: [[Categories/Expenses]]
```

---

## Step 9 — Post-Completion Verification

For every location in the authoritative list:
1. Glob for `Travel/Locations/<Name>.md`
2. File exists → verified ✓
3. File missing despite DONE status → flag as **silent failure**
4. File missing due to BLOCKED → already logged

Log silent failures prominently in the summary.

---

## Step 10 — Summary

Report:
- **Trip note:** `<path>`
- **Research clippings:** 8 created — list all 8 paths
- **Country note:** created | existing — `<path>`
- **Region note:** created | existing — `<path>`
- **Location notes:** X created, Y existing, Z concerns, W blocked, V silent failures
- **Expense base:** created | existing
- **Warnings:** list all concerns, blockers, and silent failures with location names
