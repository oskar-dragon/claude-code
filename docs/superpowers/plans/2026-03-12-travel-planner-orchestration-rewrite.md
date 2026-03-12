# Plan-Trip Orchestration Rewrite Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the `plan-trip` skill as a lean orchestrator with prompt templates, structured status reporting, file-based research handoff, and sequential chunked dispatch — so that every `[[wikilink]]` in a trip note gets a corresponding location note, reliably.

**Architecture:** The orchestrator (SKILL.md) becomes a pure coordinator that never holds research content. Eight prompt templates define each subagent role. Research is persisted as Obsidian clippings. Location notes are derived from the trip note's wikilinks and dispatched in chunks of 10.

**Tech Stack:** Claude Code skills (markdown), Obsidian vault, bun scripts (existing — `geocode.ts`, `budget.ts`, `preferences.ts`)

**Spec:** `docs/superpowers/specs/2026-03-12-travel-planner-location-notes-design.md`

---

## Chunk 1: Prompt Templates

### Task 1: Create the researcher prompt template

**Files:**
- Create: `plugins/travel-planner/skills/plan-trip/prompts/researcher.md`

- [ ] **Step 1: Read the existing research instructions**

Read the current Batch 1 instructions in `plugins/travel-planner/skills/plan-trip/SKILL.md` (lines 85–121) and `plugins/travel-planner/skills/plan-trip/references/research-categories.md` (full file). These contain the research category descriptions, output format, and trip type adaptations.

- [ ] **Step 2: Write the researcher prompt template**

Create `plugins/travel-planner/skills/plan-trip/prompts/researcher.md` following the template structure from the spec (Change 2). The template uses placeholder variables that the orchestrator fills in at dispatch time:

```markdown
# Research Agent

## Your Task

Research **{{CATEGORY_NAME}}** for a trip to **{{DESTINATION}}**.

## Context

You are one of 8 parallel research agents. Your job is to research a single category thoroughly and write the results as an Obsidian clipping. The orchestrator will use your clipping file to inform downstream steps (trip note writing, location note creation, packing lists, etc). Your output must be self-contained — other agents cannot see your work except through the file you write.

## Input

- **Destination:** {{DESTINATION}}
- **Dates:** {{START_DATE}} to {{END_DATE}}
- **Trip type:** {{TRIP_TYPE}}
- **Traveller interests:** {{INTERESTS}}
- **Dietary restrictions:** {{DIETARY_RESTRICTIONS}}
- **Must-sees:** {{MUST_SEES}}
- **Preferred sources:** {{PREFERRED_SOURCES}} — check these first before broader web search
- **Category to research:** {{CATEGORY_NAME}}
- **Category description:** {{CATEGORY_DESCRIPTION}}
- **Trip type adaptations:** {{TRIP_TYPE_ADAPTATIONS}} (if any for this category)

## Output

Write your research to: `{{TARGET_FILE_PATH}}`

Use this exact frontmatter:

---
categories:
  - "[[Clippings]]"
author:
  - "[[Claude]]"
source:
  - <URL 1>
  - <URL 2>
  - <URL 3 — minimum 3 sources>
created: {{TODAY}}
topics:
  - "[[{{COUNTRY}}]]"
---

After the frontmatter, write the research content in this format:

## {{CATEGORY_NAME}}

[2-3 sentence summary]

### Key Findings
- [Bullet point with specific info]
- [Continue with all relevant findings]

### Sources
- [Repeat source URLs from frontmatter for easy reading]

## Self-Review

Before reporting back, verify:
- [ ] File written to the correct path
- [ ] Frontmatter has all required fields (categories, author, source, created, topics)
- [ ] At least 3 source URLs included
- [ ] Key findings are specific (names, prices, dates, addresses — not vague generalities)
- [ ] Content addresses the specific travel dates, not generic information
- [ ] Trip type adaptations applied if relevant to this category
- [ ] Preferred sources checked first

## Report Format

Return:
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- **File path:** path to written clipping file
- **Concerns:** (if DONE_WITH_CONCERNS) e.g. "only found 2 sources", "research is thin for events during these dates"
- **Blocker:** (if BLOCKED) what prevented completion
- **Question:** (if NEEDS_CONTEXT) what information is missing
```

- [ ] **Step 3: Verify the template**

Read back the written file. Confirm:
- All placeholder variables use `{{VARIABLE}}` syntax consistently
- The frontmatter template matches the spec's clipping format (categories, author, source as list, created, topics)
- The self-review checklist covers the key quality gates
- The report format matches the spec's 4 status codes

- [ ] **Step 4: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/prompts/researcher.md
git commit -m "feat(travel-planner): add researcher prompt template"
```

---

### Task 2: Create the country-creator prompt template

**Files:**
- Create: `plugins/travel-planner/skills/plan-trip/prompts/country-creator.md`

- [ ] **Step 1: Read the create-country skill**

Read `plugins/travel-planner/skills/create-country/SKILL.md` and `plugins/travel-planner/skills/create-country/references/country-sections.md`. Understand what data the skill needs to do its job.

- [ ] **Step 2: Write the country-creator prompt template**

This template wraps the existing `create-country` skill. The subagent reads clipping files to extract the data, then invokes the skill.

```markdown
# Country Note Creator

## Your Task

Create the country note for **{{COUNTRY}}** by invoking the `travel-planner:create-country` skill.

## Context

You are creating the country note as part of a trip planning workflow. The research has already been done — your job is to read the relevant research clippings, extract the data the create-country skill needs, and invoke it. Do not do additional web research unless the clipping data has clear gaps.

## Input

Read these clipping files to extract country-level data:
- `{{VISA_CLIPPING_PATH}}` — visa requirements, passport validity
- `{{PRACTICAL_TIPS_CLIPPING_PATH}}` — currency, safety, emergency numbers
- `{{TRANSPORT_CLIPPING_PATH}}` — main airports
- `{{WEATHER_CLIPPING_PATH}}` — best time to visit

Extract from these clippings:
- Visa data (requirements for UK/EU/US, cost, duration, application process)
- Currency and price information
- Safety overview
- Main airport names and codes
- Best time to visit summary

## Output

Invoke the `travel-planner:create-country` skill with the extracted data. The skill writes the note to `Travel/Countries/{{COUNTRY}}.md` in the vault.

If the note already exists, the skill will update only the Travel Information sections. Report this as `existing` in your status.

## Self-Review

Before reporting back, verify:
- [ ] The create-country skill was invoked (not bypassed)
- [ ] Data passed to the skill came from the clipping files (not invented)
- [ ] If note already existed, it was updated not overwritten

## Report Format

Return:
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- **File path:** path to country note (e.g. `Travel/Countries/China.md`)
- **Note:** `created` or `existing`
- **Concerns:** (if DONE_WITH_CONCERNS) e.g. "visa clipping had limited data, supplemented with web search"
- **Blocker:** (if BLOCKED) what prevented completion
- **Question:** (if NEEDS_CONTEXT) what information is missing
```

- [ ] **Step 3: Verify the template**

Read back the file. Confirm it instructs the subagent to invoke the existing skill (not duplicate its logic), lists the correct clipping file paths as placeholders, and includes status reporting.

- [ ] **Step 4: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/prompts/country-creator.md
git commit -m "feat(travel-planner): add country-creator prompt template"
```

---

### Task 3: Create the region-creator prompt template

**Files:**
- Create: `plugins/travel-planner/skills/plan-trip/prompts/region-creator.md`

- [ ] **Step 1: Read the create-region skill**

Read `plugins/travel-planner/skills/create-region/SKILL.md`. Note that regions are lightweight — mostly Base embeds and a short description. The skill skips creation entirely if the note already exists.

- [ ] **Step 2: Write the region-creator prompt template**

```markdown
# Region Note Creator

## Your Task

Create the region note for **{{REGION}}** in **{{COUNTRY}}** by invoking the `travel-planner:create-region` skill.

## Context

You are creating the region note as part of a trip planning workflow. Regions are lightweight organisational nodes in the vault — mostly Obsidian Base embeds that dynamically pull in linked trips and places. The research has already been done.

## Input

Read this clipping file for neighbourhood/area context:
- `{{NEIGHBOURHOODS_CLIPPING_PATH}}` — neighbourhood character, areas to stay, proximity to sights

Extract: region name, parent country, and a brief (1-2 sentence) description of the area.

## Output

Invoke the `travel-planner:create-region` skill with the extracted data. The skill writes the note to `Travel/Regions/{{REGION}}.md` in the vault.

If the note already exists, the skill skips creation entirely. Report this as `existing` in your status.

## Self-Review

Before reporting back, verify:
- [ ] The create-region skill was invoked (not bypassed)
- [ ] Parent country is correct
- [ ] If note already existed, creation was skipped (not overwritten)

## Report Format

Return:
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- **File path:** path to region note (e.g. `Travel/Regions/Yunnan.md`)
- **Note:** `created` or `existing`
- **Concerns:** (if DONE_WITH_CONCERNS) any issues
- **Blocker:** (if BLOCKED) what prevented completion
- **Question:** (if NEEDS_CONTEXT) what information is missing
```

- [ ] **Step 3: Verify the template**

Read back the file. Confirm it instructs the subagent to invoke the existing skill (not duplicate its logic), uses the correct clipping path placeholder, and includes status reporting.

- [ ] **Step 4: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/prompts/region-creator.md
git commit -m "feat(travel-planner): add region-creator prompt template"
```

---

### Task 4: Create the trip-note-writer prompt template

**Files:**
- Create: `plugins/travel-planner/skills/plan-trip/prompts/trip-note-writer.md`

- [ ] **Step 1: Read current trip note writing instructions**

Read the current Step 5 in `plugins/travel-planner/skills/plan-trip/SKILL.md` (lines 139–212). This contains the trip note structure, frontmatter format, section order, and formatting rules.

- [ ] **Step 2: Write the trip-note-writer prompt template**

This is the most complex template — it produces the core trip note with itinerary, accommodation, links, and notes sections. The key instruction: **link every specific place using `[[Location Name]]` wikilinks** — these wikilinks become the authoritative location list.

```markdown
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
```

- [ ] **Step 3: Verify the template**

Read back the file. Confirm:
- The critical rules section explicitly tells the writer to wikilink every named place
- The clipping file paths use a list placeholder (the orchestrator fills in all 8)
- All 5 body sections are listed in correct order
- The self-review includes the wikilink check

- [ ] **Step 4: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/prompts/trip-note-writer.md
git commit -m "feat(travel-planner): add trip-note-writer prompt template"
```

---

### Task 5: Create the location-creator prompt template

**Files:**
- Create: `plugins/travel-planner/skills/plan-trip/prompts/location-creator.md`

- [ ] **Step 1: Read the create-location skill**

Read `plugins/travel-planner/skills/create-location/SKILL.md` and `plugins/travel-planner/skills/create-location/references/location-types.md`. Understand the valid types, frontmatter fields, and content structure.

- [ ] **Step 2: Write the location-creator prompt template**

```markdown
# Location Note Creator

## Your Task

Create the location note for **{{LOCATION_NAME}}** (type: **{{LOCATION_TYPE}}**) by invoking the `travel-planner:create-location` skill.

## Context

You are creating a location note as part of a trip planning workflow. This location was wikilinked in the trip itinerary for {{DESTINATION}}. The research has already been done — your job is to read the relevant clipping files, extract data about this specific location, and invoke the create-location skill. If the clipping data is insufficient for this particular place, you may do a brief targeted web search to fill gaps.

## Input

- **Location name:** {{LOCATION_NAME}}
- **Location type:** {{LOCATION_TYPE}} (one of: Photo Locations, Restaurants, Hotel, Campsite, Trails, Other)
- **Country:** {{COUNTRY}}
- **Region:** {{REGION}}

Read these clipping files for relevant data about this location:
- `{{CLIPPING_PATH_ATTRACTIONS}}` — Attractions & Activities
- `{{CLIPPING_PATH_FOOD}}` — Food Scene & Restaurants
- `{{CLIPPING_PATH_NEIGHBOURHOODS}}` — Neighbourhoods & Areas to Stay
- `{{CLIPPING_PATH_TRANSPORT}}` — Transport
- `{{CLIPPING_PATH_PRACTICAL}}` — Practical Tips

Not all clipping files will be relevant — search them for mentions of "{{LOCATION_NAME}}" or related terms.

Search these files for mentions of "{{LOCATION_NAME}}" or related terms. Extract: description, address, opening hours, highlights, and any source URLs that mention this place.

## Output

Invoke the `travel-planner:create-location` skill with:
- Location name: {{LOCATION_NAME}}
- Location type: {{LOCATION_TYPE}}
- Country: {{COUNTRY}}
- Region: {{REGION}}
- Research data extracted from clippings (and brief web search if needed)

The skill handles geocoding, template reading, Obsidian formatting, and file writing.

**Important:** When invoked from plan-trip, the create-location skill will skip its "ask user for confirmation" step for existing notes. If the note already exists, skip creation and report as `existing`.

## Self-Review

Before reporting back, verify:
- [ ] The create-location skill was invoked (not bypassed)
- [ ] Location type matches what was provided (don't change it)
- [ ] Data passed to the skill came from clipping files or targeted web search (not invented)
- [ ] The note file exists at the expected path after skill invocation

## Report Format

Return:
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- **File path:** path to location note (e.g. `Travel/Locations/Jade Dragon Snow Mountain.md`)
- **Concerns:** (if DONE_WITH_CONCERNS) e.g. "geocoding failed, coordinates left empty", "only 1 source found", "location not mentioned in clippings, used web search only"
- **Blocker:** (if BLOCKED) e.g. "location not found — may be misspelled in trip note", "geocoding API unavailable"
- **Question:** (if NEEDS_CONTEXT) what information is missing
```

- [ ] **Step 3: Verify the template**

Read back the file. Confirm:
- The template instructs the subagent to invoke the `create-location` skill (not bypass it)
- The 5 explicit clipping paths use flat `{{CLIPPING_PATH_*}}` placeholders
- Valid location types are listed (Photo Locations, Restaurants, Hotel, Campsite, Trails, Other)
- Self-review and status reporting sections are present
- The instruction about existing notes is clear (skip creation, report as `existing`)

- [ ] **Step 4: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/prompts/location-creator.md
git commit -m "feat(travel-planner): add location-creator prompt template"
```

---

### Task 6: Create the three Batch 4 prompt templates

**Files:**
- Create: `plugins/travel-planner/skills/plan-trip/prompts/budget-generator.md`
- Create: `plugins/travel-planner/skills/plan-trip/prompts/packing-generator.md`
- Create: `plugins/travel-planner/skills/plan-trip/prompts/countdown-generator.md`

- [ ] **Step 1: Read current Batch 4 instructions**

Read the current Step 7 in `plugins/travel-planner/skills/plan-trip/SKILL.md` (lines 235–325). This contains the budget script invocation, packing list structure, and countdown timeline format.

- [ ] **Step 2: Write the budget-generator prompt template**

```markdown
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
```

- [ ] **Step 3: Write the packing-generator prompt template**

```markdown
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
```

- [ ] **Step 4: Write the countdown-generator prompt template**

```markdown
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
```

- [ ] **Step 5: Verify all three templates**

Read back all three files. Confirm each:
- References the correct clipping files
- Instructs to append (not overwrite) the trip note
- Is aware of its position in the sequential chain (what sections already exist)
- Has self-review and status reporting

- [ ] **Step 6: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/prompts/budget-generator.md plugins/travel-planner/skills/plan-trip/prompts/packing-generator.md plugins/travel-planner/skills/plan-trip/prompts/countdown-generator.md
git commit -m "feat(travel-planner): add Batch 4 prompt templates (budget, packing, countdown)"
```

---

## Chunk 2: Rewrite SKILL.md

### Task 7: Rewrite the plan-trip SKILL.md

**Files:**
- Modify: `plugins/travel-planner/skills/plan-trip/SKILL.md`

This is the core task — rewriting the orchestrator to be a pure coordinator. The new SKILL.md should be significantly shorter than the current one because all subagent-specific instructions have moved into prompt templates.

- [ ] **Step 1: Read the current SKILL.md one more time**

Read `plugins/travel-planner/skills/plan-trip/SKILL.md` in full. Note what must be preserved:
- Frontmatter (name, description, version — bump version to `0.2.0`)
- Step 1 (Load Preferences) — unchanged
- Step 2 (Collect Trip Details) — unchanged
- Step 8 (Expense Tracking) logic
- Step 9 (Summary) structure

- [ ] **Step 2: Write the new SKILL.md**

Rewrite the file. The new structure should be:

**Frontmatter:** Keep `name` and `description` unchanged. Bump `version` to `0.2.0`.

**Overview section:** State the orchestrator-as-pure-coordinator principle. Reference the `prompts/` directory. State that the orchestrator never holds research content — only file paths and status tracking.

**Model Selection section:** Include the model selection table from the spec:

| Batch | Role | Model |
|-------|------|-------|
| Batch 1 | Research agents | `sonnet` |
| Batch 2 | Country/region note creators | `haiku` |
| Step 5 | Trip note writer | `sonnet` |
| Batch 3 | Location note creators | `haiku` |
| Batch 4 | Budget/packing/countdown | `haiku` |

**Status Handling section:** Define the 4 status codes and how to handle each (table from spec Change 3).

**Step 1 — Load Preferences:** Copy from current SKILL.md unchanged.

**Step 2 — Collect Trip Details:** Copy from current SKILL.md unchanged.

**Step 3 — Batch 1: Research:** New instructions:
1. Compute the 8 clipping file paths: `Clippings/<Trip Name> — <Category>.md`
2. For each of the 8 categories, read `prompts/researcher.md`, fill in the placeholders, and dispatch with `run_in_background: true` and `model: sonnet`
3. Wait for all 8 to complete
4. Handle statuses — record file paths for DONE/DONE_WITH_CONCERNS, log warnings for BLOCKED
5. **The orchestrator now holds: 8 file paths. Not 8 research summaries.**

**Step 4 — Batch 2: Country & Region Notes:** New instructions:
1. Read `prompts/country-creator.md`, fill in country name and relevant clipping paths (visa, practical tips, transport, weather), dispatch with `model: haiku`
2. Read `prompts/region-creator.md`, fill in region name, country, and neighbourhoods clipping path, dispatch with `model: haiku`
3. Wait for both, handle statuses, record whether each was `created` or `existing`

**Step 5 — Write Trip Note:** New instructions:
1. Read `prompts/trip-note-writer.md`, fill in all 8 clipping paths, trip details, preferences, country/region note paths
2. Dispatch as a single subagent with `model: sonnet`
3. Wait for completion, handle status, record the trip note file path

**Step 5b — Extract Wikilinks:** This is orchestrator work (no subagent). Instructions:
1. Read the written trip note
2. Extract all `[[wikilinks]]` using Grep with pattern `\[\[([^\]]+)\]\]`
3. Build the exclusion list: country name, region name, trip note name, `Trips`, all 8 clipping names, neighbourhood names (from the Neighbourhoods clipping file name or Batch 2 region subagent context)
4. Remove excluded links
5. For each remaining link, infer its `create-location` type from context in the trip note (which section it appears in, surrounding text):
   - Restaurant/food context → Restaurants
   - Accommodation section → Hotel or Campsite
   - Viewpoint/photo context → Photo Locations
   - Trail/hike context → Trails
   - Everything else → Other
   - Non-place artefacts → log warning, skip
6. Check vault for existing notes: Glob `Travel/Locations/<Name>.md` for each. Remove existing ones, record as `existing`.
7. The result is the authoritative location list with names and types.

**Step 6 — Batch 3: Location Notes (chunked):** New instructions:
1. Split the authoritative list into groups of 10
2. For each chunk:
   a. For each location in the chunk, read `prompts/location-creator.md`, fill in name, type, country, region, relevant clipping paths
   b. Dispatch all 10 (or fewer for the last chunk) in parallel with `model: haiku`
   c. Wait for all to complete
   d. Handle statuses for each
3. Repeat until all chunks processed

**Step 7 — Batch 4: Trip Extras (sequential):** New instructions:
- Dispatch concurrently with Batch 3 (Step 6)
- Within Batch 4, run sequentially:
1. Read `prompts/budget-generator.md`, fill in budget details and trip note path, dispatch with `model: haiku`, wait for completion
2. Read `prompts/packing-generator.md`, fill in weather/practical tips clipping paths, dispatch with `model: haiku`, wait for completion
3. Read `prompts/countdown-generator.md`, fill in visa/practical tips clipping paths, dispatch with `model: haiku`, wait for completion

**Step 8 — Expense Tracking:** Copy from current SKILL.md — check/create `Expenses.base`, add link to trip note.

**Step 9 — Post-Completion Verification:** New step:
1. For every location in the authoritative list, Glob for `Travel/Locations/<Name>.md`
2. If file exists → verified
3. If file missing despite DONE status → flag as silent failure
4. If file missing due to BLOCKED → already logged

**Step 10 — Summary:** Updated from current Step 9:
- Trip note path
- Research clippings: 8 created (list paths)
- Location notes: X created, Y existing, Z concerns, W blocked, V silent failures
- Country note: created or existing
- Region note: created or existing
- Expense base: created or existing
- Warnings: list all concerns, blocks, and silent failures

**Reference Files section:** List `references/research-categories.md` and `prompts/` directory.

- [ ] **Step 3: Verify the rewrite**

Read back the full SKILL.md. Check:
- Steps 1-2 preserved from original
- Steps 3-7 reference prompt templates (not inline subagent instructions)
- Orchestrator never reads or holds research content — only file paths
- Step 5b wikilink extraction is clearly described
- Batch 3 chunking (groups of 10) is explicit
- Batch 4 sequential execution is explicit
- Model selection is specified for each dispatch
- Status handling is consistent throughout
- Version bumped to `0.2.0`

- [ ] **Step 4: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/SKILL.md
git commit -m "feat(travel-planner): rewrite plan-trip as pure orchestrator with prompt templates

Addresses missing location notes by:
- Extracting wikilinks from trip note as single source of truth
- Dispatching location agents in sequential chunks of 10
- Writing research to Obsidian clippings (file-based handoff)
- Using structured status reporting (DONE/CONCERNS/BLOCKED/NEEDS_CONTEXT)
- Adding post-completion verification via Glob checks
- Specifying model selection per batch (sonnet for research/trip note, haiku for mechanical tasks)

BREAKING CHANGE: subagent prompts now live in prompts/ directory"
```

---

## Chunk 3: Final Verification

### Task 8: Bump marketplace version

**Files:**
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Read marketplace.json**

Read `.claude-plugin/marketplace.json` and find the travel-planner plugin entry.

- [ ] **Step 2: Bump the version**

Update the travel-planner version to match the new `0.2.0` in SKILL.md.

- [ ] **Step 3: Commit**

```bash
git add .claude-plugin/marketplace.json
git commit -m "chore: bump travel-planner version to 0.2.0"
```

---

### Task 9: Verify complete file structure

- [ ] **Step 1: Verify all prompt templates exist**

Run Glob for `plugins/travel-planner/skills/plan-trip/prompts/*.md`. Confirm all 8 files exist:
- researcher.md
- country-creator.md
- region-creator.md
- trip-note-writer.md
- location-creator.md
- budget-generator.md
- packing-generator.md
- countdown-generator.md

- [ ] **Step 2: Verify SKILL.md references all templates**

Read `plugins/travel-planner/skills/plan-trip/SKILL.md` and confirm each of the 8 template files is referenced at least once.

- [ ] **Step 3: Verify research-categories.md is unchanged**

Run `git diff plugins/travel-planner/skills/plan-trip/references/research-categories.md` to confirm no unintended changes.

- [ ] **Step 4: Verify spec success criteria**

Walk through each success criterion from the spec and confirm the implementation addresses it:
1. Wikilinks → location notes: Step 5b extracts, Batch 3 creates, Step 9 verifies
2. Existing notes not overwritten: Step 5b filters them out
3. Research clippings persisted: Batch 1 writes to Clippings/
4. Orchestrator context lean: SKILL.md never reads research content
5. Structured status reporting: all templates include Report Format section
6. Post-completion verification: Step 9 Glob check
7. Summary includes all counts: Step 10
8. All 8 templates exist: Step 1 of this task
9. Expense tracking preserved: Step 8
10. Batch 4 sequential: Step 7

- [ ] **Step 5: Final commit if any fixes needed**

If any issues found in verification, fix and commit.
