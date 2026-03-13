# Travel Planner: Interactive Brainstorming Phase

**Date:** 2026-03-13
**Status:** Approved

## Overview

Split the travel planning flow into two session-separated skills:

1. `brainstorm-trip` — conversational interview, writes a trip brief to the vault
2. `plan-trip` — reads the brief, dispatches research agents with profile and focus injection

The brief file is the contract between the two skills and the source of truth for trip context.

---

## Section 1 — Architecture

```
Session 1: brainstorm-trip
  → loads sources from settings (silent)
  → conversational interview
  → writes Trips/Briefs/<Trip Name>.md to vault
  → done

Session 2: plan-trip
  → asks for brief file path
  → loads settings (sources only)
  → reads brief
  → compiles {{PROFILE}} from brief
  → dispatches research agents with {{PROFILE}} and {{FOCUS}} injected
  → creates all notes as today
```

### Settings file format

`~/.claude/travel-planner.local.md` is stripped down to sources only:

```markdown
---
sources:
  - Lonely Planet
  - Atlas Obscura
  - iOverlander
---
```

Old fields (`travel_style`, `budget_level`, etc.) in existing files are silently ignored by the updated script.

### `preferences.ts` updated contract

- Reads `~/.claude/travel-planner.local.md`
- Returns `{ "sources": ["Lonely Planet", "Atlas Obscura"] }` to stdout on success (exit 0). The JSON key is `sources` (renamed from `preferred_sources` in the old script).
- Returns exit code 1 if file is missing OR `sources` field is absent/empty
- Old fields in the file (`preferred_sources`, `travel_style`, `budget_level`, etc.) are silently ignored — no migration required

The settings file written by either skill contains only a `sources:` frontmatter block and nothing else:
```markdown
---
sources:
  - Lonely Planet
  - Atlas Obscura
  - iOverlander
---
```

Both `brainstorm-trip` and `plan-trip` write this same file format when onboarding. The behaviour on exit 1 differs by skill:
- `brainstorm-trip`: asks "Which travel resources do you typically find most useful?" and writes the file before continuing
- `plan-trip`: tells the user "Run `brainstorm-trip` first — it will set up your sources and write a trip brief"

---

## Section 2 — `brainstorm-trip` skill

**Location:** `plugins/travel-planner/skills/brainstorm-trip/SKILL.md`

**Frontmatter:**
```yaml
name: brainstorm-trip
description: Interactive trip planning interview. Use when the user wants to plan a trip, go on holiday, travel somewhere, or plan a vacation. Collects destination, vibe, companions, anchors, and budget through conversation, then writes a trip brief to the vault for use with plan-trip.
version: 1.0.0
```

**Trigger phrases:** "plan a trip", "brainstorm a trip", "I want to go to", "help me plan travel to", "plan a vacation", "plan a campervan trip", "plan a hike"

Note: `plan-trip`'s description must NOT include these trigger phrases — it should only be invoked explicitly by the user with a brief path, not matched from general intent.

### Conversation flow

**Step 1 — Load settings**

Run `bun run $CLAUDE_PLUGIN_ROOT/scripts/preferences.ts` silently.
- Exit 0: load sources list
- Exit 1: ask "Which travel resources do you typically find most useful? (e.g. Lonely Planet, Atlas Obscura, iOverlander)" and write `~/.claude/travel-planner.local.md` in the format defined in Section 1 before continuing

**Step 2 — Destination check**

- **Vague** ("somewhere in Southeast Asia", "I want mountains"): propose 3 destination options with personality sketches tailored to what Claude learns in the conversation
- **Known** ("Japan", "Lisbon"): light confirmation — "any particular region or vibe, or treat the whole country as fair game?"

**Step 3 — Experiential questions** (one at a time, conversational)

1. Who's coming?
2. What's the occasion or context for this trip?
3. Travel style for this trip — adventurous, relaxed, or somewhere between?
4. Any dietary restrictions or strong food preferences?
5. Pace — packed itinerary or room to wander?
6. What are you most excited about, or what would make this trip feel like a success?
7. Anything you want to avoid or are unsure about?

The answers to Q6 and Q7 are written to `## Notes` as freeform prose (no bullet structure required). The orchestrator appends this section verbatim to `{{PROFILE}}`.

**Step 4 — Anchor proposal**

Based on destination + conversation, propose 3–5 anchor experiences. User can add, remove, or adjust. These become the spine of the itinerary and directly generate the `## Research Focus` section.

**Step 5 — Mechanical data**

Collect: dates, total budget + currency, trip type (campervan, city break, road trip, etc.)

From budget amount and context, infer and confirm `budget_level`: `budget` / `mid-range` / `luxury`. Confirm with user.

**Step 6 — Derive trip name**

Default rule: destination + year (e.g. "Japan 2026"). Use destination + season only if the trip dates fall clearly within a single meteorological season AND the season is materially relevant to the trip (e.g. cherry blossoms, skiing, monsoon avoidance). If the trip spans two calendar years, use the year of the majority of travel days. Confirm with user before writing.

**Step 7 — Write brief**

Write `Trips/Briefs/<Trip Name>.md` to the vault at `<vault root>/Trips/Briefs/<Trip Name>.md`. The vault root is hardcoded to `/Users/oskardragon-work/workspaces/obsidian/` (same as `plan-trip`). Set `created` to today's date. Confirm path to user and suggest: "Open a new session and run `/travel-planner:plan-trip` — it will ask for this brief path."

---

## Section 3 — Brief file format

**Location:** `Trips/Briefs/<Trip Name>.md`

The `## Research Focus` section covers all 8 research categories. Categories with no specific focus use the neutral fallback: "no specific focus — follow standard research guidelines".

```markdown
---
categories:
  - "[[Briefs]]"
created: YYYY-MM-DD
---

## Trip
- **Destination:** Japan
- **Dates:** 2026-04-01 to 2026-04-14
- **Budget:** 3000 GBP
- **Budget Level:** mid-range
- **Type:** city break
- **Companions:** couple
- **Occasion:** first trip to Japan together

## Profile
- **Style:** relaxed with some adventure
- **Pace:** moderate — anchor days with room to wander
- **Dietary:** vegetarian
- **Interests:** food, photography, nature

## Anchors
- Cherry blossom season in Kyoto (fixed point)
- Day hike around Hakone / Mt Fuji views
- 2–3 days Tokyo for contrast

## Research Focus
- **Visa & Entry:** no specific focus — follow standard research guidelines
- **Weather:** focus on cherry blossom timing for early April in Kyoto
- **Transport:** scenic routes (Shinkansen, local trains) over fastest options
- **Attractions:** nature, gardens, photography spots over temples checklist
- **Food:** vegetarian-friendly restaurants, local markets, cooking experiences
- **Neighbourhoods:** quiet/walkable bases outside tourist centres
- **Events:** festivals or events coinciding with cherry blossom season
- **Practical Tips:** photography gear, vegetarian dining cards in Japanese

## Notes
- Excited about: food scene, spring light for photography
- Avoid: overly touristy experiences, rushed itinerary
```

**Conventions:**
- Only `categories` uses wikilinks — all other content is plain text
- `categories` is always `"[[Briefs]]"`
- `created` is set at write time by `brainstorm-trip`
- `## Notes` content is included in the compiled `{{PROFILE}}` string (see below)

### `{{PROFILE}}` compilation

The orchestrator compiles `{{PROFILE}}` as a single prose paragraph from the brief fields, in this order:

1. `Companions` (from `## Trip`)
2. `Style` (from `## Profile`)
3. `Pace` (from `## Profile`)
4. `Dietary` (from `## Profile`)
5. `Interests` (from `## Profile`)
6. `Occasion` (from `## Trip`)
7. `## Notes` content (strip bullet markers, join as prose sentences)

Example output:
> "Travelling as a couple. Relaxed style with some adventure. Moderate pace — anchor days with room to wander. Vegetarian. Interests: food, photography, nature. Occasion: first trip to Japan together. Excited about: food scene, spring light for photography. Wants to avoid: overly touristy experiences, rushed itinerary."

`## Anchors` is NOT included in `{{PROFILE}}` — it is passed to all 8 research agents as `{{ANCHORS}}`. The orchestrator compiles it by reading the `## Anchors` bullet list from the brief and joining items as a comma-separated list of plain strings (strip bullet markers, strip "(fixed point)" and similar annotations).

Example: `Cherry blossom season in Kyoto, Day hike around Hakone, 2–3 days Tokyo`

### `{{FOCUS}}` category mapping

The `## Research Focus` labels map to `plan-trip`'s 8 research categories as follows:

| Brief label | plan-trip category |
|---|---|
| Visa & Entry | Visa & Entry Requirements |
| Weather | Weather & Best Time to Visit |
| Transport | Transport |
| Attractions | Attractions & Activities |
| Food | Food Scene & Restaurants |
| Neighbourhoods | Neighbourhoods & Areas to Stay |
| Events | Events During Travel Dates |
| Practical Tips | Practical Tips |

Each research agent receives the focus line for its matching category.

---

## Section 4 — Changes to `plan-trip`

### Trigger phrase change

Remove all intent-based trigger phrases from `plan-trip`'s description frontmatter. It is invoked explicitly with a brief path, not matched from general intent. General trip-planning phrases now route to `brainstorm-trip`.

### Step changes

**New Step 0 — Load brief**

At session start, ask: "What's the path to your trip brief?" (e.g. `Trips/Briefs/Japan 2026.md`, relative to vault root at `/Users/oskardragon-work/workspaces/obsidian/`). Read the file at `<vault root>/<path>` and parse all sections into context. Derive the trip name from the brief filename (strip `.md`).

**Updated Step 1 — Load settings**

Run `preferences.ts` (sources only now). If exit 1: tell user to run `brainstorm-trip` first, which will set up their sources. Do not proceed until a valid settings file exists. **Remove the existing onboarding block entirely** — it collected all 8 preference fields, which no longer exist in the settings file.

**Old Step 2 removed**

The question-asking step is gone. All trip details come from the brief.

**Updated Step 5 — trip note writer**

The SKILL.md orchestrator instructions for Step 5 must be updated: remove the list of preference-derived placeholders it currently fills in (`travel style, budget level, pace, interests, dietary restrictions, companions`). Replace with a note that `{{PROFILE}}` is compiled by the orchestrator and passed to the prompt. All other Step 5 instructions (reading clippings, writing the trip note, wikilink extraction) are unchanged.

**Updated `plan-trip` description frontmatter**

Replace the current trigger-phrase-heavy description with: "Executes a trip plan from a brief file written by brainstorm-trip. Dispatches research agents, creates Obsidian notes, and builds a full itinerary. Invoke with a brief file path."

### Prompt template changes

**`prompts/researcher.md`** — placeholder changes:

| Placeholder | Change |
|---|---|
| `{{interests}}` | Removed — now in `{{PROFILE}}` |
| `{{dietary_restrictions}}` | Removed — now in `{{PROFILE}}` (renamed `dietary`) |
| `{{companions}}` | Removed — now in `{{PROFILE}}` |
| `{{must_sees}}` | Replaced by `{{ANCHORS}}` — compiled from `## Anchors` as a bullet list |
| `{{PROFILE}}` | New — compiled prose paragraph (see Section 3) |
| `{{FOCUS}}` | New — matching `## Research Focus` line for this agent's category |
| All others | Unchanged: `{{destination}}`, `{{dates}}`, `{{trip_type}}`, `{{preferred_sources}}`, `{{category_name}}`, `{{category_description}}`, `{{trip_type_adaptations}}`, `{{target_file_path}}`, `{{today}}`, `{{country}}` |

**`prompts/trip-note-writer.md`** — replace the six preference-derived placeholders (`{{travel_style}}`, `{{budget_level}}`, `{{pace}}`, `{{interests}}`, `{{dietary_restrictions}}`, `{{companions}}`) with single `{{PROFILE}}`. All other existing placeholders remain unchanged.

**`prompts/budget-generator.md`** — the prompt currently constructs the `budget.ts` call using `{{budget_level}}`, `{{budget_total}}`, and `{{budget_currency}}` placeholders. Replace all three with values extracted from the brief: `Budget Level`, and the total + currency parsed from the `Budget` field (e.g. "3000 GBP" → total=3000, currency=GBP). The script call itself is unchanged: `bun run $CLAUDE_PLUGIN_ROOT/scripts/budget.ts <total> <currency> <level>`.

**`prompts/packing-generator.md`** — replace `{{interests}}` and `{{dietary_restrictions}}` with `{{PROFILE}}`. All other existing placeholders remain unchanged: trip type, clipping paths, weather, practical tips. Orchestrator calculates trip duration in nights from the `Dates` field in the brief (`end_date - start_date`).

### Naming note

`dietary_restrictions` is renamed to `dietary` throughout all prompt templates. No functional change — update placeholder names only.

### What stays the same

- All 8 research categories and trip-type adaptations (`references/research-categories.md` unchanged)
- Batch 1 (8 parallel research agents, Sonnet)
- Batch 2 (country + region note creation, Haiku)
- Step 5 trip note writer + wikilink extraction
- Batch 3 (location notes, Haiku, chunks of 10)
- Batch 4 (budget, packing, countdown, sequential Haiku)
- Steps 8–10 (expense tracker, verification, summary)
- `budget.ts`, `geocode.ts` scripts — no changes

---

## Out of scope (separate tasks)

- Region notes currently skip existing notes rather than updating — should be fixed separately
- Location notes ask for confirmation on existing notes — behaviour TBD separately
