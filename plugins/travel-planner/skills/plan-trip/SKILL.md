---
name: plan-trip
description: Executes a trip plan from a brief file written by brainstorm-trip. Dispatches research agents, creates Obsidian notes, and builds a full itinerary. Invoke with a brief file path.
version: 0.3.0
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

## Step 0 — Load Brief

Ask the user:
> "What's the path to your trip brief? (e.g. `Trips/Briefs/Japan 2026.md`, relative to the vault root)"

Vault root: `/Users/oskardragon-work/workspaces/obsidian/`

Read the file at `<vault root>/<path>`. Parse all sections and hold in context.

**Derive from the brief:**

- **Trip name:** filename without `.md` extension (e.g. `Japan 2026`)
- **Trip note path:** `Trips/<Trip Name>.md` (relative to vault root)
- **`{{PROFILE}}`:** compile as a single prose paragraph in this order:
  1. `Companions` (from `## Trip`)
  2. `Style` (from `## Profile`)
  3. `Pace` (from `## Profile`)
  4. `Dietary` (from `## Profile`)
  5. `Interests` (from `## Profile`)
  6. `Occasion` (from `## Trip`)
  7. `## Notes` content (strip bullet markers, join as prose sentences)

  Example: "Travelling as a couple. Relaxed style with some adventure. Moderate pace — anchor days with room to wander. Vegetarian. Interests: food, photography, nature. Occasion: first trip to Japan together. Excited about the food scene and spring light for photography. Wants to avoid overly touristy experiences and a rushed itinerary."

- **`{{ANCHORS}}`:** comma-separated plain string from `## Anchors` bullets — strip bullet markers and strip parenthetical annotations like "(fixed point)".

  Example: `Cherry blossom season in Kyoto, Day hike around Hakone, 2–3 days Tokyo`

- **`{{FOCUS}}` mapping** (brief label → category):

  | Brief label | Research category |
  |---|---|
  | Visa & Entry | Visa & Entry Requirements |
  | Weather | Weather & Best Time to Visit |
  | Transport | Transport |
  | Attractions | Attractions & Activities |
  | Food | Food Scene & Restaurants |
  | Neighbourhoods | Neighbourhoods & Areas to Stay |
  | Events | Events During Travel Dates |
  | Practical Tips | Practical Tips |

  Each research agent gets the focus line for its matching category.

Hold `{{PROFILE}}`, `{{ANCHORS}}`, and all 8 `{{FOCUS}}` values in context for use throughout remaining steps.

---

## Step 1 — Load Settings

Run:

```bash
bun run $CLAUDE_PLUGIN_ROOT/scripts/preferences.ts
```

- **Exit 0:** load `sources` list from JSON output. Use as `{{PREFERRED_SOURCES}}` in researcher prompts.
- **Exit 1:** tell the user: "Run `brainstorm-trip` first — it will set up your sources and write a trip brief." Do not proceed until a valid settings file exists.

---

## Step 3 — Batch 1: Research

1. Compute 8 clipping file paths using the pattern: `Clippings/<Trip Name> — <Category>.md`
   Categories: Visa & Entry Requirements, Weather & Best Time to Visit, Transport, Attractions & Activities, Food Scene & Restaurants, Neighbourhoods & Areas to Stay, Events During Travel Dates, Practical Tips

2. For each of the 8 categories:
   - Read `prompts/researcher.md`
   - Fill in all `{{PLACEHOLDER}}` variables:
     - From brief: `{{DESTINATION}}`, `{{START_DATE}}`, `{{END_DATE}}`, `{{TRIP_TYPE}}`, `{{COUNTRY}}`
     - Compiled from brief: `{{PROFILE}}`, `{{ANCHORS}}`, `{{FOCUS}}` (use the focus line for this agent's category)
     - From settings: `{{PREFERRED_SOURCES}}`
     - Computed: `{{CATEGORY_NAME}}`, `{{CATEGORY_DESCRIPTION}}` (from `references/research-categories.md`), `{{TRIP_TYPE_ADAPTATIONS}}`, `{{TARGET_FILE_PATH}}`, `{{TODAY}}`
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
   - `{{PROFILE}}` — compiled prose paragraph from Step 0
   - `{{BUDGET_TOTAL}}` and `{{BUDGET_CURRENCY}}` — parsed from `Budget` field in brief (e.g. "3000 GBP" → total=3000, currency=GBP)
   - `{{ANCHORS}}` — compiled from Step 0
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
   - Fill in: destination, trip note path, and these values parsed from the brief: `{{BUDGET_TOTAL}}` (total number), `{{BUDGET_CURRENCY}}` (currency code), `{{BUDGET_LEVEL}}` (budget/mid-range/luxury from `Budget Level` field)
   - Dispatch with `model: haiku`, wait for completion before proceeding

2. **Packing:**
   - Read `prompts/packing-generator.md`
   - Fill in: destination, trip note path, weather clipping path, practical tips clipping path, trip type, `{{PROFILE}}`, trip duration in nights (calculated from brief: `end_date - start_date`)
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
