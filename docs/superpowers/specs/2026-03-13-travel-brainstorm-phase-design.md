# Travel Planner: Interactive Brainstorming Phase

**Date:** 2026-03-13
**Status:** Approved

## Overview

Split the travel planning flow into two session-separated skills:

1. `brainstorm-trip` — conversational interview, writes a trip brief to the vault
2. `plan-trip` — reads the brief, dispatches research agents (unchanged except brief loading and focus directive injection)

The brief file is the contract between the two skills and the source of truth for trip context.

---

## Section 1 — Architecture

```
Session 1: brainstorm-trip
  → loads sources from settings (silent)
  → conversational interview
  → writes Trips/Briefs/<Trip Name>.md to vault
  → done

Session 2: plan-trip <brief path>
  → loads settings (sources only)
  → reads brief
  → dispatches research agents with {{PROFILE}} and {{FOCUS}} injected
  → creates all notes as today
```

**Settings file** is stripped down to sources only (preferred research sources like Lonely Planet, Atlas Obscura, iOverlander). All other preferences (travel style, dietary, pace, interests, companions) move to the brainstorming conversation — they vary per trip and shouldn't be stale saved state.

---

## Section 2 — `brainstorm-trip` conversation flow

**Step 1 — Load settings** (silent — reads sources list only)

**Step 2 — Destination check**

- **Vague** ("somewhere in Southeast Asia", "I want mountains"): propose 3 destination options with personality sketches, tailored to what Claude learns in the conversation
- **Known** ("Japan", "Lisbon"): light confirmation — "any particular region or vibe, or treat the whole country as fair game?"

**Step 3 — Experiential questions** (one at a time, conversational)

1. Who's coming?
2. What's the occasion or context for this trip?
3. Travel style for this trip — adventurous, relaxed, or somewhere between?
4. Any dietary restrictions or strong food preferences?
5. Pace — packed itinerary or room to wander?
6. What are you most excited about, or what would make this trip feel like a success?
7. Anything you want to avoid or are unsure about?

**Step 4 — Anchor proposal**

Based on destination + conversation, propose 3–5 anchor experiences. User can add, remove, or adjust. These become the spine of the itinerary and directly generate the Research Focus directives.

**Step 5 — Mechanical data**

Collect: dates, total budget + currency, trip type (campervan, city break, road trip, etc.)

**Step 6 — Write brief**

Write `Trips/Briefs/<Trip Name>.md` to vault. Confirm path to user and suggest next step: open a new session and run `plan-trip` with the brief path.

---

## Section 3 — Brief file format

Location: `Trips/Briefs/<Trip Name>.md`

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
- **Attractions:** nature, gardens, photography spots over temples checklist
- **Food:** vegetarian-friendly restaurants, local markets, cooking experiences
- **Neighbourhoods:** quiet/walkable bases outside tourist centres
- **Transport:** scenic routes (Shinkansen, local trains) over fastest options
- **Practical Tips:** photography gear, vegetarian dining cards in Japanese

## Notes
- Excited about: food scene, spring light for photography
- Avoid: overly touristy experiences, rushed itinerary
```

**Conventions:**
- Only `categories` uses wikilinks — all other content is plain text
- `categories` is always `"[[Briefs]]"`
- No trip-level metadata (dates, location, type) in frontmatter — that belongs in the eventual trip note; here it lives in the `## Trip` section as plain text

---

## Section 4 — Changes to `plan-trip`

### What changes

**Step 1 — Load settings:** reads sources list only (stripped down from current 8-category preferences)

**Step 2 — Load brief:** replaces the current question-asking step. Reads brief file path passed as argument, extracts all sections into context.

**Researcher prompts:** two new placeholders injected per agent:
- `{{PROFILE}}` — companions, style, pace, dietary, interests from the brief
- `{{FOCUS}}` — the relevant Research Focus line for that agent's category

Example injection for the Attractions researcher:
```
Profile: couple, relaxed with some adventure, vegetarian, interests: food photography nature
Focus: nature, gardens, photography spots over temples checklist
```

### What stays the same

Everything else is unchanged:
- All 8 research categories and trip-type adaptations
- Batch 1 (8 parallel research agents)
- Batch 2 (country + region note creation)
- Step 5 trip note writer + wikilink extraction
- Batch 3 (location notes)
- Batch 4 (budget, packing, countdown)
- Steps 8–10 (expense tracker, verification, summary)

---

## Out of scope (separate tasks)

- Region notes currently skip existing notes rather than updating — should be fixed separately
- Location notes ask for confirmation on existing notes — behaviour TBD separately
