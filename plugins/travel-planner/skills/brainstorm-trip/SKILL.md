---
name: brainstorm-trip
description: Interactive trip planning interview. Use when the user wants to plan a trip, go on holiday, travel somewhere, or plan a vacation. Collects destination, vibe, companions, anchors, and budget through conversation, then writes a trip brief to the vault for use with plan-trip.
version: 1.0.0
---

## Overview

This skill conducts a conversational interview to understand a trip's shape, then writes a structured brief file to the Obsidian vault. The brief is then used by `plan-trip` in a separate session to dispatch research agents and create all notes.

Reference files:
- `references/brief-format.md` — brief template and conventions

Vault root: `/Users/oskardragon-work/workspaces/obsidian/`

---

## Step 1 — Load Settings

Run silently:

```bash
bun run $CLAUDE_PLUGIN_ROOT/scripts/preferences.ts
```

- **Exit 0:** load `sources` list from the JSON output. Use these as the preferred research sources throughout.
- **Exit 1:** the config is missing or has no sources. Ask:
  > "Which travel resources do you typically find most useful? (e.g. Lonely Planet, Atlas Obscura, iOverlander, The Dyrt, local blogs)"

  Write their response to `~/.claude/travel-planner.local.md`:

  ```markdown
  ---
  sources:
    - <source 1>
    - <source 2>
  ---
  ```

  Re-run `bun run $CLAUDE_PLUGIN_ROOT/scripts/preferences.ts` to confirm it parses correctly (exit 0). If it exits 1 again, report the parse error and ask the user to correct their input before continuing.

---

## Step 2 — Destination Check

Assess how specific the destination is:

**Vague** (e.g. "somewhere in Southeast Asia", "I want to see mountains", no destination named):
- Propose 3 destination options, each with a 2–3 sentence personality sketch
- Tailor options to what Claude already knows from the conversation (if anything)
- Wait for the user to pick one or suggest their own

**Known** (a specific country, region, or city named):
- Ask: "Got it — [destination]. Any particular region or vibe you have in mind, or shall I treat the whole country as fair game?"
- If they have a specific region in mind, note it. If not, proceed.

---

## Step 3 — Experiential Questions

Ask one question at a time. Wait for an answer before asking the next. Keep the tone conversational — this is an interview with a knowledgeable friend, not a form.

1. "Who's coming on this trip?"
2. "What's the occasion or context — is there a reason you're going now, or just because?"
3. "What's your travel style for this one — would you say adventurous, relaxed, or somewhere between?"
4. "Any dietary restrictions or strong food preferences I should factor in?"
5. "Pace-wise — do you prefer a packed itinerary, room to wander, or somewhere in the middle?"
6. "What are you most excited about, or what would make this trip feel like a real success?"
7. "Is there anything you want to avoid, or anything you're unsure about?"

The answers to Q6 and Q7 become the `## Notes` section in the brief — write them as freeform prose capturing what the user actually said.

---

## Step 4 — Anchor Proposal

Based on the destination and everything learned in Step 3, propose 3–5 anchor experiences. Frame them as the spine of the itinerary — the things the trip would be built around.

Example:
> "Based on what you've told me, here are 3 anchors I'd suggest building the trip around:
> 1. Cherry blossom season in Kyoto — prime timing for your April dates
> 2. A day hike around Hakone for Fuji views and mountain air
> 3. 2–3 days in Tokyo at the end for contrast and great food
>
> Want to adjust, add, or remove any of these?"

Wait for the user to confirm, adjust, or add to the list. The agreed anchors:
- Become the `## Anchors` section in the brief
- Directly inform the `## Research Focus` section — use them to generate specific focus directives for each of the 8 research categories

---

## Step 5 — Mechanical Data

Collect the remaining trip details in one focused message:

- **Dates** — start and end dates including travel days. If flexible, ask for a rough window.
- **Budget** — total for the trip and which currency.
- **Trip type** — campervan, city break, road trip, through-hike, wild camping, beach holiday, cultural tour, or describe their own.

From the budget amount and context (trip type, destination, duration), infer and confirm a `budget_level`:
- `budget` — hostels, street food, budget transport
- `mid-range` — 3-star hotels, sit-down restaurants, occasional splurge
- `luxury` — 4-5 star hotels, fine dining, premium experiences

Say which level you're inferring and ask: "Does that sound right?"

---

## Step 6 — Derive Trip Name

Construct the trip name using this rule:

**Default:** destination + year (e.g. "Japan 2026")

**Use season instead of year** only if ALL of the following are true:
- The trip dates fall clearly within a single meteorological season (Dec–Feb = winter, Mar–May = spring, Jun–Aug = summer, Sep–Nov = autumn)
- The season is materially relevant to the trip (cherry blossoms, skiing, monsoon avoidance, etc.)

**If dates span two calendar years:** use the year in which the majority of travel days fall.

Confirm with the user before writing: "I'll call this one '[Trip Name]' — does that work?"

---

## Step 7 — Write Brief

Read `references/brief-format.md` for the exact format and conventions.

Write the brief to:
```
/Users/oskardragon-work/workspaces/obsidian/Trips/Briefs/<Trip Name>.md
```

**`{{PROFILE}}` compilation (for reference — this is compiled by `plan-trip`, not written to the brief):**

The brief stores raw fields. `plan-trip` will compile them into a prose paragraph. Just write the brief accurately.

**`## Research Focus` generation:**

For each of the 8 categories, derive a focus directive from the anchors and conversation:
- Use the anchors and stated interests to write a 1-line focus directive
- For categories with no specific angle, use: "no specific focus — follow standard research guidelines"

Ensure all 8 categories are present:
Visa & Entry, Weather, Transport, Attractions, Food, Neighbourhoods, Events, Practical Tips

**After writing:**

Confirm the path to the user and say:
> "Brief written to `Trips/Briefs/<Trip Name>.md`. When you're ready, open a new session and run `/travel-planner:plan-trip` — it will ask for this path."
