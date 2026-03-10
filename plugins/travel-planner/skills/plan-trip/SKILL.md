---
name: plan-trip
description: This skill should be used when the user asks to "plan a trip", "create a trip itinerary", "help me plan travel to", "organise a holiday", "plan a vacation", "plan a campervan trip", "help me plan a hike", or mentions trip planning, travel planning, holiday planning, or itinerary creation to a specific destination. Orchestrates full trip planning — researches destinations via parallel subagents, generates itineraries, creates Obsidian location/country/region notes, budgets, packing lists, and pre-trip timelines.
version: 0.1.0
---

## Overview

Act as a lean orchestrator. Collect trip details, dispatch parallel subagents to do the heavy work (research, note creation, and extras), and assemble the results into an Obsidian trip note. Never do the research or note creation directly — delegate it.

The skill runs in four parallel batches to minimise total time. Batch 1 gathers all research. Batch 2 creates country and region notes (using research from Batch 1). Once the trip note is written, Batch 3 creates individual location notes and Batch 4 generates budget, packing, and countdown content. All batches except Batch 2 can be dispatched without waiting on each other except where explicitly stated.

All notes are created in the Obsidian vault at `/Users/oskardragon-work/workspaces/obsidian/`.

---

## 1. Load Preferences

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

## 2. Collect Trip Details

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

## 3. Parallel Batch 1 — Research (8 subagents, run_in_background: true)

Dispatch all 8 research subagents simultaneously using the Agent tool with `run_in_background: true`. Do not wait for one to finish before starting the next — fire all 8 at once.

Each subagent receives as context: destination, dates, trip type, user interests, dietary restrictions, must-sees, and the `preferred_sources` list from preferences. Each subagent checks `preferred_sources` first before doing broader web search, and returns results in the structured format defined in `references/research-categories.md`:

```
## [Category Name]

[2-3 sentence summary]

### Key Findings
- [Bullet point with specific info]

### Sources
- [URL — minimum 3]
```

The 8 categories are:

1. **Visa & entry requirements** — visa requirement for UK, EU, and US passport holders; visa types and application process; cost; duration allowed; passport validity requirements; vaccination requirements.

2. **Weather & best time to visit** — temperature ranges for the travel month; rainfall patterns; whether dates fall in peak, shoulder, or off-peak season; what to expect during those specific dates; suggested packing based on weather.

3. **Transport** — getting there (flights, trains, ferries) and getting around (public transport, car rental, rideshare, cycling). Include rough costs. Apply trip-type adaptations from `references/research-categories.md` — campervan trips add campsite and service station research; road trips reframe this category as full driving route research.

4. **Attractions & activities** — top sights, hidden gems, day trip options, guided tours, outdoor activities, cultural experiences. Note which require advance booking or permits. For through-hikes, this becomes full trail research (route, distance, elevation, conditions, permits, shelters, resupply points).

5. **Food scene & restaurants** — local cuisine overview, must-try dishes, specific restaurant recommendations across budget levels, street food, markets, vegetarian/vegan options informed by dietary restrictions, local drinks.

6. **Neighbourhoods & areas to stay** — best areas for the trip type, neighbourhood character, proximity to sights, safety, price range, specific hotel or accommodation recommendations across budget levels.

7. **Events during travel dates** — festivals, public holidays, exhibitions, sporting events, markets happening during the specific travel window. Flag anything that will cause crowds, road closures, or price spikes.

8. **Practical tips** — currency and exchange; tipping norms; best SIM or eSIM options; power adapter type; language phrases; cultural etiquette (dress codes, religious site rules, photography); emergency numbers; healthcare access; water safety; common scams to avoid.

Wait for all 8 subagents to complete before proceeding to Batch 2.

---

## 4. Parallel Batch 2 — Country & Region Notes (2 subagents)

After Batch 1 completes, dispatch 2 subagents simultaneously using the Agent tool. Pass each subagent the relevant slice of Batch 1 research so they do not need to re-research anything.

- **Country subagent:** Invoke the `travel-planner:create-country` skill. Pass the country name and the following from Batch 1: visa data, currency information, safety overview, main airport names, and any country-level practical tips.

- **Region subagent:** Invoke the `travel-planner:create-region` skill. Pass the region or city name, the parent country, and neighbourhood/areas-to-stay research from Batch 1.

Both subagents check for existing notes before writing — if a note already exists it will be left unchanged and the subagent will return a status of `existing`. Record whether each note was `created` or `existing`; you will include this in the final summary.

Wait for both subagents to complete before writing the trip note in step 5.

---

## 5. Write Trip Note

Write the trip note at `Travel/Trips/<Trip Name>.md` inside the vault. Use `<Destination> <Month> <Year>` as the trip name — for example `Jordan October 2025` or `Scottish Highlands June 2026`.

**Frontmatter:**

```yaml
---
categories:
  - "[[Trips]]"
created: YYYY-MM-DD
start: YYYY-MM-DD
end: YYYY-MM-DD
location: "[[Country Name]]"
type: <trip type, e.g. Roadtrip, City Break, Through-hike>
---
```

Use today's date for `created`. Use the trip start and end dates for `start` and `end`. The `location` field links to the country note created in Batch 2.

**Content structure — write these sections in order:**

**Line 1:** `![[Map.base#Location]]` — Obsidian map embed. Place this immediately after the frontmatter, before any headings.

**`## Itinerary`**

Write a day-by-day plan using Batch 1 research as the source. Structure each day as:

```
### Day 1 (DD/MM)
- Activity one — [[Location Name]]
- Activity two — [[Location Name]]
- Lunch at [[Restaurant Name]]
- Activity three
- Dinner at [[Restaurant Name]]
```

- Use `### Day N (DD/MM)` headings for each day
- List activities as bullet points
- Link every specific place using `[[Location Name]]` wikilinks — these will resolve to the location notes created in Batch 3
- Group activities geographically where possible to minimise unnecessary travel within a day
- Leave the first morning flexible for arrival and settling in if the trip starts with a travel day
- For campervan and road trips: include driving distances and route between stops on each day (e.g. `Drive from Inverness to Ullapool — 58 miles, ~1h 15m`)
- For through-hikes: include daily mileage, elevation gain/loss, and camp spots or huts for each night
- Balance the pace against the user's stated pace preference from their preferences file

**`## Accommodation`**

List accommodation for each night or block of nights. Format as:

```
- **Nights 1-3:** [[Hotel Name]], [[Neighbourhood]] — [booking placeholder link]
- **Night 4:** Wild camp at [[Location Name]]
```

Use the neighbourhoods and accommodation research from Batch 1. Add `[Book]` as a placeholder link for any accommodation that hasn't been booked yet.

**`## Links`**

List all booking links the user will need. Use placeholder format until real URLs exist:

```
- Flights: [Book]
- Accommodation: see Accommodation section above
- Car hire / campervan rental: [Book]
- Key tours or permits: [Book — advance booking required]
```

**`## Notes`**

Add a short section with the most critical practical information from Batch 1 research: visa status, any must-book-in-advance items, key warnings from practical tips, and any events flagged during the travel dates.

Invoke the `obsidian:obsidian-markdown` skill for formatting guidance before writing if you are unsure of any Obsidian-specific markdown conventions.

---

## 6. Parallel Batch 3 — Location Notes (N subagents)

Based on research from Batch 1, identify all specific places that warrant an Obsidian note. Cast a wide net — it is better to create a note for a place and not visit it than to visit a place with no note.

Include:
- Restaurants, cafes, and bars mentioned in food research
- Photo spots and viewpoints mentioned in attractions research
- Attractions, museums, galleries, and key sights
- Accommodation options shortlisted in the itinerary
- Trails, peaks, or natural features (for hiking and outdoor trips)
- Markets, festivals, or event venues from the events research

Dispatch one subagent per location, all simultaneously using the Agent tool. Each subagent:
- Invokes the `travel-planner:create-location` skill
- Receives: location name, location type (restaurant/attraction/viewpoint/trail/accommodation/etc), country, region, and the specific research data from Batch 1 that is relevant to that location

Do not wait for Batch 3 subagents to complete before starting Batch 4 — dispatch both simultaneously.

---

## 7. Parallel Batch 4 — Trip Extras (3 subagents)

Dispatch all 3 subagents simultaneously using the Agent tool. Collect all 3 results before appending to the trip note.

**Budget subagent:**

Run:
```bash
bun run $CLAUDE_PLUGIN_ROOT/scripts/budget.ts <total> <currency> <budget_level>
```

Pass the total budget, currency, and `budget_level` from preferences. The script returns a markdown table breaking the budget into categories. Return that table verbatim.

**Packing subagent:**

Generate a packing checklist as markdown checkboxes. Base it on:
- Destination climate from weather research (temperature range, rainfall likelihood)
- Trip type (campervan trips need different gear than city breaks)
- Trip duration (number of nights)
- User interests from preferences (hiking interest → walking boots; photography → camera gear)

Group items by category. Use this structure as a baseline and adapt it:

```markdown
### Clothing
- [ ] Item

### Toiletries & Health
- [ ] Item

### Tech & Power
- [ ] Item

### Documents & Money
- [ ] Item

### Outdoor / Trip-Specific Gear
- [ ] Item (only include if relevant to trip type)
```

Do not pad the list. Include only items that are genuinely relevant to this specific trip.

**Countdown subagent:**

Generate a pre-trip countdown as markdown checkboxes, working backwards from departure date. Use approximate dates and include the specific dates in brackets. Adapt the items to the trip — for example, if no visa is needed, omit the visa item; if a through-hike requires trail permits, add those specifically:

```markdown
### 3 months before ([date])
- [ ] Book flights
- [ ] Book accommodation for key nights

### 6-8 weeks before ([date])
- [ ] Apply for visa (if required — check research)
- [ ] Book tours or permits requiring advance reservation

### 4 weeks before ([date])
- [ ] Purchase travel insurance
- [ ] Notify bank of travel dates
- [ ] Check passport validity (minimum 6 months remaining)

### 2 weeks before ([date])
- [ ] Download offline maps (Maps.me / Google Maps offline)
- [ ] Exchange currency or order travel card

### 1 week before ([date])
- [ ] Pack using packing list above
- [ ] Reconfirm all bookings
- [ ] Check weather forecast and adjust packing

### Day before departure
- [ ] Charge all devices and battery packs
- [ ] Download entertainment for journey
- [ ] Set alarms
- [ ] Check in online if available
```

**After all 3 subagents complete**, append to the trip note in a single write operation to prevent file conflicts:

```markdown
## Budget

<budget table from budget subagent>

## Packing List

<checklist from packing subagent>

## Pre-Trip Checklist

<countdown from countdown subagent>
```

---

## 8. Expense Tracking

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

## 9. Summary

Once all batches are complete and the trip note is fully written, report to the user in a concise summary:

- **Trip note path** — full vault path to the trip note
- **Location notes** — total count of location notes created (e.g. "14 location notes created")
- **Country note** — whether it was newly created or already existed
- **Region note** — whether it was newly created or already existed
- **Expense base** — whether it was newly created or already existed, plus the path
- **Warnings** — any issues encountered: geocoding failures, locations where research was thin, subagents that returned no sources, any notes that could not be created

If there are no warnings, say so explicitly. Keep the summary scannable — use bullet points, not prose.

---

## Reference Files

- `references/research-categories.md` — full category descriptions, output format, and trip type adaptations for all 8 research subagents
