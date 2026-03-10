# Travel Planner Plugin — Design Spec

## Overview

A Claude Code plugin for planning trips and creating Obsidian notes. Scaffolds trip itineraries, researches destinations via parallel subagents, creates location/country/region notes, generates budgets, packing lists, and pre-trip timelines.

All notes are written to the Obsidian vault at `/Users/oskardragon-work/workspaces/obsidian/` using existing vault templates — no templates bundled in the plugin.

## Plugin Structure

```
plugins/travel-planner/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   ├── plan-trip/
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── research-categories.md
│   ├── create-location/
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── location-types.md
│   ├── create-country/
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── country-sections.md
│   └── create-region/
│       └── SKILL.md
└── scripts/
    ├── preferences.ts
    ├── geocode.ts
    └── budget.ts
```

## Skills

### 1. `plan-trip` — Main Orchestrator

The primary skill. Acts as a lean orchestrator that collects input and dispatches parallel subagents for research and note creation. Never does heavy research or note-writing itself.

**Workflow:**

1. Read preferences via `bun run preferences.ts` — onboard if `.claude/travel-planner.local.md` doesn't exist
2. Collect trip details:
   - Destination
   - Dates (start/end)
   - Budget (total + currency)
   - Purpose
   - Trip type (campervan, through-hike, city break, road trip, wild camping, etc.)
   - Number of travellers
   - Must-see items
3. Dispatch **Parallel Batch 1 — Research** (8 background subagents, sonnet model):
   - Visa & entry requirements
   - Weather & best time to visit
   - Transport (getting there + getting around)
   - Attractions & activities
   - Food scene & restaurants
   - Neighbourhoods & areas to stay
   - Events during travel dates
   - Practical tips (currency, tipping, safety, SIM cards)
   - Each agent checks `preferred_sources` from preferences first, then broader web
   - Each returns a structured text summary
4. Dispatch **Parallel Batch 2 — Country & Region** (2 subagents):
   - Check/create country note (invokes `create-country` skill)
   - Check/create region note(s) (invokes `create-region` skill)
   - Uses relevant research from Batch 1 (visa, currency, safety for country; general info for region)
5. Orchestrator writes trip note at `Travel/Trips/<Trip Name>.md`:
   - Frontmatter:
     ```yaml
     categories:
       - "[[Trips]]"
     created: YYYY-MM-DD
     start: YYYY-MM-DD
     end: YYYY-MM-DD
     location: "[[Country]]"
     type: (trip style — e.g., Roadtrip, City Break, Through-hike)
     ```
   - `![[Map.base#Location]]` embed
   - Day-by-day itinerary with `[[location]]` wikilinks
   - Links section (booking placeholders)
   - Invokes `obsidian:obsidian-markdown` for formatting
6. Dispatch **Parallel Batch 3 — Location Notes** (one subagent per place):
   - Each invokes `create-location` skill
   - Receives research data from Batch 1 as input
7. Dispatch **Parallel Batch 4 — Trip Extras** (3 subagents):
   - Budget breakdown (via `budget.ts`)
   - Packing checklist (climate/activity/trip-type aware)
   - Pre-trip countdown (3 months to day-before timeline)
   - Each returns structured text. **Orchestrator collects all three results and appends them to the trip note in a single write** to avoid write conflicts.
8. Check/create shared expense tracking base at `Categories/Expenses.base` if it doesn't exist:
   - Single `.base` file for all trips
   - Each expense row has a trip field for filtering
   - Trip note links to it
   - Invokes `obsidian:obsidian-bases` for base file creation

**Trip type adaptation:**
- Campervan: campsite availability, driving routes, gas stations, shower/laundry facilities
- Through-hike: trail conditions, resupply points, water sources, permits, elevation
- City break: public transport, walking routes, museum passes, nightlife
- Wild camping: legality, water sources, leave-no-trace guidelines, weather exposure
- Road trip: driving distances, rest stops, scenic routes, car rental logistics

### 2. `create-location` — Individual Location Notes

Independently invokable. Creates a single location note in the Obsidian vault.

**Workflow:**
1. Determine location type (or ask if not specified)
2. Read `Templates/Place Template.md` from vault
3. Research the location via web search
4. Geocode via `bun run geocode.ts` (Nominatim/OpenStreetMap)
5. Create note at appropriate vault path with correct type-specific fields
6. Invoke `obsidian:obsidian-markdown` for formatting

**Location types (from `references/location-types.md`):**

Convention: green = see/do/eat, blue = stay.

| Type | Tag | Icon | Color | Extra Section |
|---|---|---|---|---|
| Photo Locations | `map/photo-location` | `camera` | green | Photography Tips |
| Restaurants | `map/food` | `utensils-crossed` | green | — |
| Hotel | `map/accommodation` | `hotel` | blue | — |
| Campsite | `map/accommodation/campsite` | `tent-tree` | blue | — |
| Trails | `map/trails` | `footprints` | green | — |
| Other | `map/other` | `map-pin` | green | — |

Attractions and general activities use the `Other` type (`map/other`, `map-pin`, green).

**Frontmatter fields (all types):**
```yaml
categories:
  - "[[Places]]"
type: "[[Type Name]]"
location:
  - "[[Region]]"
  - "[[Country]]"
coordinates:
  - "latitude"
  - "longitude"
image: (URL or wikilink)
source: [URLs]
icon: (per type)
color: (per type)
created: YYYY-MM-DD
visited: false
```

**Content structure (all types):**
1. `![[Map.base#Place Itself]]`
2. `## Description`
3. `## Photography Tips` (photo locations only)
4. `## Travel Information`
5. Dataview image expression at end

### 3. `create-country` — Country Notes

Independently invokable. Creates or updates a country note.

**Workflow:**
1. Check if country note already exists in vault — update if so, create if not
2. Read `Templates/Country Template.md` from vault
3. Research country information via web search (categories in `references/country-sections.md`)
4. Geocode via `bun run geocode.ts`
5. Create/update note
6. Invoke `obsidian:obsidian-markdown` for formatting

**Frontmatter:**
```yaml
categories:
  - "[[Places]]"
type:
  - "[[Countries]]"
coordinates:
  - "latitude"
  - "longitude"
created: YYYY-MM-DD
color: gray
icon: earth
```

**Content sections:**
1. `## Trips` with `![[Trips.base#Location]]`
2. `## Places` with `![[Map.base#Location]]` and `![[Places.base#Location]]`
3. `## Description`
4. `## Travel Information`
   - `### Best Time to Visit`
   - `### Visa Requirements`
   - `### Currency & Prices`
   - `### Safety`
   - `### Airport`
5. `## Useful Links`

### 4. `create-region` — Region Notes

Independently invokable. Creates a region note linked to its parent country.

**Workflow:**
1. Check if region note already exists — skip if so
2. Read `Templates/Region Template.md` from vault
3. Link to parent country via `location` field
4. Geocode via `bun run geocode.ts`
5. Create note with base embeds + optional description
6. Invoke `obsidian:obsidian-markdown` for formatting

**Frontmatter:**
```yaml
categories:
  - "[[Places]]"
type:
  - "[[Regions]]"
location:
  - "[[Country Name]]"
coordinates:
  - "latitude"
  - "longitude"
created: YYYY-MM-DD
```

**Content sections:**
1. `## Trips` with `![[Trips.base#Location]]`
2. `## Places` with `![[Map.base#Location]]` and `![[Places.base#Location]]`

## Preferences

Stored in `.claude/travel-planner.local.md`. Created via onboarding on first `plan-trip` invocation. Read by `preferences.ts`.

```yaml
---
travel_style: adventurous
budget_level: mid-range
accommodation_preference:
  - boutique hotels
  - Airbnb
interests:
  - culture
  - food
  - photography
  - hiking
dietary_restrictions: []
pace_preference: moderate
travel_companions: couple
preferred_sources:
  - https://www.atlasobscura.com
  - https://www.alltrails.com
---

## Notes
Any free-form notes about travel preferences.
```

## Scripts (Bun + TypeScript)

### `preferences.ts`
- Reads `.claude/travel-planner.local.md`
- Parses YAML frontmatter
- Returns structured JSON to stdout
- Exits with error if file doesn't exist (triggers onboarding)

### `geocode.ts`
- Accepts location name as argument
- Queries Nominatim API (OpenStreetMap)
- Respects 1 request/second rate limit
- Search strategies: exact name → name + country → alternative formats
- Returns `{ lat, lon, display_name }` or null with reason

### `budget.ts`
- Accepts total budget, currency, budget level
- Calculates category splits:
  - Budget: 40% accommodation, 25% food, 20% activities, 10% transport, 5% misc
  - Mid-range: 35/25/25/10/5
  - Luxury: 45/20/20/10/5
- Returns markdown table

## Expense Tracking

Single shared `.base` file at `Categories/Expenses.base`. Fields:
- Trip (link to trip note, for filtering)
- Date
- Category (accommodation, food, activities, transport, misc)
- Description
- Amount
- Currency

Created on first `plan-trip` run if it doesn't exist. Each trip note links to this base.

## Subagent Architecture

The `plan-trip` orchestrator uses the Agent tool to dispatch parallel work across 4 batches:

```
plan-trip (orchestrator — stays lean)
│
├── Read preferences + collect trip details (interactive)
│
├── BATCH 1 — Research (8 parallel background agents, sonnet):
│   ├── Visa & entry requirements
│   ├── Weather & best time
│   ├── Transport
│   ├── Attractions & activities
│   ├── Food scene & restaurants
│   ├── Neighbourhoods & areas
│   ├── Events during dates
│   └── Practical tips
│   Each returns structured text summary. Preferred sources checked first.
│
├── BATCH 2 — Country & Region (2 parallel agents):
│   ├── create-country (check exists, create/update)
│   └── create-region (check exists, create if needed)
│   Fed relevant research from Batch 1.
│
├── Orchestrator writes trip note (from Batch 1 summaries)
│
├── BATCH 3 — Location Notes (N parallel agents, one per place):
│   Each invokes create-location with research data.
│
├── BATCH 4 — Trip Extras (3 parallel agents):
│   ├── Budget breakdown
│   ├── Packing checklist
│   └── Pre-trip countdown
│
└── Check/create expense base (if needed)
```

**Design principles:**
- Orchestrator never does heavy work — dispatches and assembles
- Each subagent has a single focused job
- Context isolation prevents research results from polluting the main context
- Sonnet model for research agents (cheaper, faster, sufficient for web search summarisation)
- Maximum parallelism within each batch

## Obsidian Integration

- All note templates read from vault's `Templates/` directory
- Skills invoke `obsidian:obsidian-markdown` for note formatting (wikilinks, frontmatter, callouts)
- `plan-trip` invokes `obsidian:obsidian-bases` for expense base creation
- Notes use existing Obsidian plugins: Mapview (interactive maps), Bases (database views)
- Wikilinks create knowledge graph connections between trips, countries, regions, and locations
- Base embeds (`Trips.base`, `Places.base`, `Map.base`) handle dynamic reverse lookups

## Marketplace Registration

Add to `.claude-plugin/marketplace.json`:
```json
{
  "name": "travel-planner",
  "version": "0.1.0",
  "source": "./plugins/travel-planner",
  "description": "Trip planning with Obsidian integration — researches destinations, creates itineraries, location/country/region notes, budgets, and packing lists",
  "author": "Oskar Dragon",
  "keywords": ["travel", "obsidian", "planning", "trips"]
}
```
