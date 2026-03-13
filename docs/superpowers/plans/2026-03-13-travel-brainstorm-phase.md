# Travel Planner: Interactive Brainstorming Phase — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split travel planning into two session-separated skills — `brainstorm-trip` (conversational interview → writes brief) and `plan-trip` (reads brief → dispatches research agents).

**Architecture:** `brainstorm-trip` collects trip context interactively and writes a structured brief file to the Obsidian vault. `plan-trip` reads that brief, compiles `{{PROFILE}}`, `{{ANCHORS}}`, and `{{FOCUS}}` from it, and dispatches research/creation agents as before. The brief is the contract between sessions.

**Tech Stack:** Bun/TypeScript (preferences.ts), Obsidian Markdown, Claude Code skill YAML frontmatter

**Spec:** `docs/superpowers/specs/2026-03-13-travel-brainstorm-phase-design.md`

---

## File Map

**Created:**
- `plugins/travel-planner/skills/brainstorm-trip/SKILL.md` — new brainstorm skill
- `plugins/travel-planner/skills/brainstorm-trip/references/brief-format.md` — brief template reference

**Modified:**
- `plugins/travel-planner/scripts/preferences.ts` — strip to sources-only
- `plugins/travel-planner/scripts/__tests__/preferences.test.ts` — update tests to match new contract
- `plugins/travel-planner/skills/plan-trip/SKILL.md` — add Step 0, update Steps 1/5/7, remove Step 2, update description
- `plugins/travel-planner/skills/plan-trip/prompts/researcher.md` — swap preference placeholders for `{{PROFILE}}`, `{{FOCUS}}`, `{{ANCHORS}}`
- `plugins/travel-planner/skills/plan-trip/prompts/trip-note-writer.md` — swap preference placeholders for `{{PROFILE}}`
- `plugins/travel-planner/skills/plan-trip/prompts/budget-generator.md` — extract budget fields from brief
- `plugins/travel-planner/skills/plan-trip/prompts/packing-generator.md` — swap `{{INTERESTS}}` for `{{PROFILE}}`
- `.claude-plugin/marketplace.json` — bump travel-planner to 0.3.0

---

## Chunk 1: Update `preferences.ts`

### Task 1: Update preferences.ts tests

**Files:**
- Modify: `plugins/travel-planner/scripts/__tests__/preferences.test.ts`

- [ ] **Step 1: Write the new tests (TDD — tests first)**

Replace the file contents with:

```typescript
import { describe, it, expect } from "bun:test";
import { parsePreferences } from "../preferences";

const SOURCES_ONLY_CONTENT = `---
sources:
  - Lonely Planet
  - Atlas Obscura
  - iOverlander
---
`;

const OLD_FORMAT_CONTENT = `---
travel_style: adventurous
budget_level: mid-range
accommodation_preference:
  - hotels
interests:
  - food
dietary_restrictions: []
pace_preference: moderate
travel_companions: couple
preferred_sources:
  - Lonely Planet
sources:
  - Lonely Planet
  - Atlas Obscura
---
`;

describe("parsePreferences", () => {
  it("parses sources-only config", () => {
    const result = parsePreferences(SOURCES_ONLY_CONTENT);
    expect(result.sources).toEqual(["Lonely Planet", "Atlas Obscura", "iOverlander"]);
  });

  it("ignores old fields (travel_style, budget_level, etc.) silently", () => {
    const result = parsePreferences(OLD_FORMAT_CONTENT);
    expect(result.sources).toEqual(["Lonely Planet", "Atlas Obscura"]);
    expect((result as any).travel_style).toBeUndefined();
    expect((result as any).preferred_sources).toBeUndefined();
  });

  it("throws on missing frontmatter delimiters", () => {
    expect(() => parsePreferences("no frontmatter here")).toThrow("No YAML frontmatter found");
  });

  it("throws when sources field is absent", () => {
    const content = `---
travel_style: adventurous
---
`;
    expect(() => parsePreferences(content)).toThrow("Missing required field: sources");
  });

  it("throws when sources is an empty array", () => {
    const content = `---
sources: []
---
`;
    expect(() => parsePreferences(content)).toThrow("sources must be a non-empty array");
  });

  it("throws on invalid YAML", () => {
    expect(() => parsePreferences("---\n:\n---")).toThrow();
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
cd plugins/travel-planner && bun test __tests__/preferences.test.ts
```

Expected: multiple failures (old interface, missing sources check)

- [ ] **Step 3: Update preferences.ts**

Replace file contents with:

```typescript
import { parse as parseYaml } from "yaml";

export interface Preferences {
  sources: string[];
}

export function parsePreferences(content: string): Preferences {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error("No YAML frontmatter found");
  }

  const parsed = parseYaml(match[1]);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid YAML frontmatter");
  }

  if (!("sources" in parsed)) {
    throw new Error("Missing required field: sources");
  }

  const sources = (parsed as Record<string, unknown>).sources;
  if (!Array.isArray(sources) || sources.length === 0) {
    throw new Error("sources must be a non-empty array");
  }

  return { sources: sources as string[] };
}

// CLI entry point
if (import.meta.main) {
  const configPath =
    process.argv[2] ?? `${process.env.HOME}/.claude/travel-planner.local.md`;

  const file = Bun.file(configPath);
  const exists = await file.exists();

  if (!exists) {
    console.error(
      JSON.stringify({ error: "config_not_found", path: configPath }),
    );
    process.exit(1);
  }

  const content = await file.text();
  try {
    const prefs = parsePreferences(content);
    console.log(JSON.stringify(prefs));
  } catch (e) {
    console.error(
      JSON.stringify({ error: "parse_error", message: (e as Error).message }),
    );
    process.exit(1);
  }
}
```

- [ ] **Step 4: Run tests — confirm all pass**

```bash
cd plugins/travel-planner && bun test __tests__/preferences.test.ts
```

Expected: all 6 tests pass

- [ ] **Step 5: Run full test suite**

```bash
cd plugins/travel-planner && bun test
```

Expected: all tests pass (geocode.test.ts and budget.test.ts unaffected)

- [ ] **Step 6: Commit**

```bash
git add plugins/travel-planner/scripts/preferences.ts plugins/travel-planner/scripts/__tests__/preferences.test.ts
git commit -m "feat(travel-planner): strip preferences to sources-only"
```

---

## Chunk 2: Create `brainstorm-trip` skill

### Task 2: Create brief-format reference file

**Files:**
- Create: `plugins/travel-planner/skills/brainstorm-trip/references/brief-format.md`

- [ ] **Step 1: Create the reference file**

```markdown
# Trip Brief Format

Reference for `brainstorm-trip` when writing a trip brief to the vault.

**Location:** `Trips/Briefs/<Trip Name>.md` (relative to vault root `/Users/oskardragon-work/workspaces/obsidian/`)

## Template

\`\`\`markdown
---
categories:
  - "[[Briefs]]"
created: YYYY-MM-DD
---

## Trip
- **Destination:** <country or region>
- **Dates:** YYYY-MM-DD to YYYY-MM-DD
- **Budget:** <total> <currency>
- **Budget Level:** budget | mid-range | luxury
- **Type:** <campervan | city break | road trip | through-hike | wild camping | beach holiday | cultural tour | other>
- **Companions:** <solo | couple | family | group — brief description>
- **Occasion:** <brief context, e.g. "first trip together", "post-burnout escape">

## Profile
- **Style:** <adventurous | relaxed | balanced — brief description>
- **Pace:** <packed | moderate | slow — brief description>
- **Dietary:** <restrictions or "none">
- **Interests:** <comma-separated list>

## Anchors
- <Anchor experience 1>
- <Anchor experience 2>
- <Anchor experience 3>

## Research Focus
- **Visa & Entry:** <focus directive or "no specific focus — follow standard research guidelines">
- **Weather:** <focus directive or "no specific focus — follow standard research guidelines">
- **Transport:** <focus directive or "no specific focus — follow standard research guidelines">
- **Attractions:** <focus directive or "no specific focus — follow standard research guidelines">
- **Food:** <focus directive or "no specific focus — follow standard research guidelines">
- **Neighbourhoods:** <focus directive or "no specific focus — follow standard research guidelines">
- **Events:** <focus directive or "no specific focus — follow standard research guidelines">
- **Practical Tips:** <focus directive or "no specific focus — follow standard research guidelines">

## Notes
<Freeform prose from Q6/Q7 of the interview — what they're excited about and what to avoid>
\`\`\`

## Conventions

- Only `categories` uses wikilinks — all other content is plain text
- `created` is set to today's date at write time
- All 8 Research Focus categories must be present — use neutral fallback for any without a specific directive
- `## Notes` is freeform prose, not bullets — write it as the user expressed it
```

- [ ] **Step 2: Commit**

```bash
git add plugins/travel-planner/skills/brainstorm-trip/references/brief-format.md
git commit -m "feat(travel-planner): add brief-format reference for brainstorm-trip"
```

### Task 3: Create `brainstorm-trip` SKILL.md

**Files:**
- Create: `plugins/travel-planner/skills/brainstorm-trip/SKILL.md`

- [ ] **Step 1: Create the skill file**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add plugins/travel-planner/skills/brainstorm-trip/SKILL.md
git commit -m "feat(travel-planner): add brainstorm-trip skill"
```

---

## Chunk 3: Update `plan-trip` SKILL.md

### Task 4: Update plan-trip SKILL.md

**Files:**
- Modify: `plugins/travel-planner/skills/plan-trip/SKILL.md`

- [ ] **Step 1: Update the frontmatter description and version**

Replace the `---` block at the top:

```yaml
---
name: plan-trip
description: Executes a trip plan from a brief file written by brainstorm-trip. Dispatches research agents, creates Obsidian notes, and builds a full itinerary. Invoke with a brief file path.
version: 0.3.0
---
```

- [ ] **Step 2: Add Step 0 — Load Brief (before Step 1)**

Insert this section before `## Step 1 — Load Preferences`:

```markdown
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
```

- [ ] **Step 3: Update Step 1 — strip onboarding to sources only**

Replace the entire `## Step 1 — Load Preferences` section with:

```markdown
## Step 1 — Load Settings

Run:

```bash
bun run $CLAUDE_PLUGIN_ROOT/scripts/preferences.ts
```

- **Exit 0:** load `sources` list from JSON output. Use as `{{PREFERRED_SOURCES}}` in researcher prompts.
- **Exit 1:** tell the user: "Run `brainstorm-trip` first — it will set up your sources and write a trip brief." Do not proceed until a valid settings file exists.

---
```

- [ ] **Step 4: Remove Step 2 — Collect Trip Details**

Delete the entire `## Step 2 — Collect Trip Details` section. All trip details now come from the brief loaded in Step 0.

- [ ] **Step 5: Update Step 3 (now Step 2) — researcher placeholder list**

In the `## Step 3 — Batch 1: Research` section, replace the placeholder fill-in list in point 2:

Old:
```
Fill in all `{{PLACEHOLDER}}` variables (destination, dates, trip type, interests, dietary restrictions, must-sees, preferred sources, category name, category description from `references/research-categories.md`, trip type adaptations, target file path, today's date, country)
```

New:
```
Fill in all `{{PLACEHOLDER}}` variables:
- From brief: `{{DESTINATION}}`, `{{START_DATE}}`, `{{END_DATE}}`, `{{TRIP_TYPE}}`, `{{COUNTRY}}`
- Compiled from brief: `{{PROFILE}}`, `{{ANCHORS}}`, `{{FOCUS}}` (use the focus line for this agent's category)
- From settings: `{{PREFERRED_SOURCES}}`
- Computed: `{{CATEGORY_NAME}}`, `{{CATEGORY_DESCRIPTION}}` (from `references/research-categories.md`), `{{TRIP_TYPE_ADAPTATIONS}}`, `{{TARGET_FILE_PATH}}`, `{{TODAY}}`
```

- [ ] **Step 6: Update Step 5 — remove preference placeholder list**

In `## Step 5 — Write Trip Note`, replace point 2's fill-in list:

Old:
```
- User preferences: travel style, budget level, pace, interests, dietary restrictions, companions, budget total, budget currency, must-sees
```

New:
```
- `{{PROFILE}}` — compiled prose paragraph from Step 0
- `{{BUDGET_TOTAL}}` and `{{BUDGET_CURRENCY}}` — parsed from `Budget` field in brief (e.g. "3000 GBP" → total=3000, currency=GBP)
- `{{ANCHORS}}` — compiled from Step 0
```

- [ ] **Step 7: Update Step 7 — packing placeholder**

In `## Step 7 — Batch 4: Trip Extras`, under **Packing**, replace the fill-in list:

Old:
```
Fill in: destination, trip note path, weather clipping path, practical tips clipping path, trip type, trip duration in nights, interests
```

New:
```
Fill in: destination, trip note path, weather clipping path, practical tips clipping path, trip type, `{{PROFILE}}`, trip duration in nights (calculated from brief: `end_date - start_date`)
```

Also update the **Budget** fill-in:

Old:
```
Fill in: destination, trip note path, budget total, budget currency, budget level
```

New:
```
Fill in: destination, trip note path, and these values parsed from the brief: `{{BUDGET_TOTAL}}` (total number), `{{BUDGET_CURRENCY}}` (currency code), `{{BUDGET_LEVEL}}` (budget/mid-range/luxury from `Budget Level` field)
```

- [ ] **Step 8: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/SKILL.md
git commit -m "feat(travel-planner): update plan-trip to load brief and remove onboarding"
```

---

## Chunk 4: Update Prompt Templates and Marketplace

### Task 5: Update researcher.md

**Files:**
- Modify: `plugins/travel-planner/skills/plan-trip/prompts/researcher.md`

- [ ] **Step 1: Update the Input section**

Replace:
```markdown
- **Traveller interests:** {{INTERESTS}}
- **Dietary restrictions:** {{DIETARY_RESTRICTIONS}}
- **Must-sees:** {{MUST_SEES}}
```

With:
```markdown
- **Traveller profile:** {{PROFILE}}
- **Trip anchors:** {{ANCHORS}}
- **Research focus for this category:** {{FOCUS}}
```

- [ ] **Step 2: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/prompts/researcher.md
git commit -m "feat(travel-planner): update researcher prompt for PROFILE/ANCHORS/FOCUS"
```

### Task 6: Update trip-note-writer.md

**Files:**
- Modify: `plugins/travel-planner/skills/plan-trip/prompts/trip-note-writer.md`

- [ ] **Step 1: Update the Also use section**

Replace:
```markdown
- **User preferences:** travel style: {{TRAVEL_STYLE}}, budget: {{BUDGET_LEVEL}}, pace: {{PACE_PREFERENCE}}, interests: {{INTERESTS}}, dietary: {{DIETARY_RESTRICTIONS}}, companions: {{TRAVEL_COMPANIONS}}
- **Trip details:** budget: {{BUDGET_TOTAL}} {{BUDGET_CURRENCY}}, must-sees: {{MUST_SEES}}
```

With:
```markdown
- **Traveller profile:** {{PROFILE}}
- **Trip anchors:** {{ANCHORS}}
- **Budget:** {{BUDGET_TOTAL}} {{BUDGET_CURRENCY}}
```

- [ ] **Step 2: Update the pace reference in the Itinerary output instructions**

Replace:
```markdown
- Balance pace against user's preference ({{PACE_PREFERENCE}})
```

With:
```markdown
- Balance pace against the traveller profile — pace preference is included in {{PROFILE}}
```

- [ ] **Step 3: Update the Self-Review checklist**

Replace:
```markdown
- [ ] Pace matches user preference
```

With:
```markdown
- [ ] Pace matches traveller profile
```

- [ ] **Step 4: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/prompts/trip-note-writer.md
git commit -m "feat(travel-planner): update trip-note-writer prompt for PROFILE/ANCHORS"
```

### Task 7: Update budget-generator.md

**Files:**
- Modify: `plugins/travel-planner/skills/plan-trip/prompts/budget-generator.md`

- [ ] **Step 1: Update the Input section**

Replace:
```markdown
- **Total budget:** {{BUDGET_TOTAL}}
- **Currency:** {{BUDGET_CURRENCY}}
- **Budget level:** {{BUDGET_LEVEL}}
```

With (no change — these are still filled in by the orchestrator from the brief, placeholder names stay the same):

No change needed to the template — the placeholder names `{{BUDGET_TOTAL}}`, `{{BUDGET_CURRENCY}}`, `{{BUDGET_LEVEL}}` are unchanged. The orchestrator now extracts these values from the brief instead of from Step 2 user input. The prompt file itself needs no edit.

- [ ] **Step 1 (revised): Verify no change needed**

```bash
grep -n "BUDGET" plugins/travel-planner/skills/plan-trip/prompts/budget-generator.md
```

Confirm output shows `{{BUDGET_TOTAL}}`, `{{BUDGET_CURRENCY}}`, `{{BUDGET_LEVEL}}` — these match the names the SKILL.md will fill from the brief. No template edit required.

- [ ] **Step 2: Commit note**

No file change needed for budget-generator.md — placeholder names are already compatible.

### Task 8: Update packing-generator.md

**Files:**
- Modify: `plugins/travel-planner/skills/plan-trip/prompts/packing-generator.md`

- [ ] **Step 1: Verify no `{{dietary_restrictions}}` placeholder exists**

```bash
grep -n "dietary" plugins/travel-planner/skills/plan-trip/prompts/packing-generator.md
```

Expected: no matches. The spec mentions removing it but it was never added to this template. If it IS present, add it to the replacement in Step 2.

- [ ] **Step 2: Update the Input section**

Replace:
```markdown
- **User interests:** {{INTERESTS}}
```

With:
```markdown
- **Traveller profile:** {{PROFILE}}
```

- [ ] **Step 3: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/prompts/packing-generator.md
git commit -m "feat(travel-planner): update packing prompt for PROFILE"
```

### Task 9: Bump marketplace version

**Files:**
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Bump travel-planner to 0.3.0**

In `.claude-plugin/marketplace.json`, find the travel-planner entry and update:
```json
"version": "0.3.0"
```

Also update the description to reflect both skills:
```json
"description": "Trip planning with Obsidian integration — brainstorm-trip for interactive planning interviews, plan-trip for research, itineraries, location/country/region notes, budgets, and packing lists"
```

- [ ] **Step 2: Commit**

```bash
git add .claude-plugin/marketplace.json
git commit -m "chore(travel-planner): bump version to 0.3.0"
```

---
