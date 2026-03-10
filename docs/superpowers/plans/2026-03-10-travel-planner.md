# Travel Planner Plugin Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Claude Code plugin that plans trips and creates Obsidian notes via four independent skills with parallel subagent orchestration.

**Architecture:** Four skills (plan-trip, create-location, create-country, create-region) backed by three Bun+TypeScript scripts (preferences, geocode, budget). plan-trip acts as a lean orchestrator dispatching parallel subagents. All notes use vault templates, not bundled templates.

**Tech Stack:** Claude Code plugin (markdown skills), Bun + TypeScript (scripts), Obsidian markdown (output)

**Spec:** `docs/superpowers/specs/2026-03-10-travel-planner-design.md`

---

## File Map

```
plugins/travel-planner/
├── .claude-plugin/
│   └── plugin.json                          # Plugin manifest (name only)
├── skills/
│   ├── plan-trip/
│   │   ├── SKILL.md                         # Orchestrator skill
│   │   └── references/
│   │       └── research-categories.md       # 8 research categories + trip type adaptations
│   ├── create-location/
│   │   ├── SKILL.md                         # Location note creation skill
│   │   └── references/
│   │       └── location-types.md            # Type → icon/color/tag/sections mapping
│   ├── create-country/
│   │   ├── SKILL.md                         # Country note creation skill
│   │   └── references/
│   │       └── country-sections.md          # Travel Information sub-sections
│   └── create-region/
│       └── SKILL.md                         # Region note creation skill
├── scripts/
│   ├── preferences.ts                       # Read/parse .local.md config
│   ├── geocode.ts                           # Nominatim coordinate lookup
│   ├── budget.ts                            # Budget breakdown calculator
│   └── __tests__/
│       ├── preferences.test.ts              # Tests for preferences parser
│       ├── geocode.test.ts                  # Tests for geocode (mocked HTTP)
│       └── budget.test.ts                   # Tests for budget calculator
├── .gitignore                               # Ignore node_modules, dist
├── package.json                             # Bun project config + test script
└── tsconfig.json                            # TypeScript config
```

**Existing files to modify:**
- `.claude-plugin/marketplace.json` — add travel-planner entry

---

## Chunk 1: Plugin Scaffold + TypeScript Scripts

This chunk sets up the plugin structure and implements all three TypeScript scripts with tests. These are the deterministic building blocks that the skills will call.

### Task 1: Plugin Scaffold

**Files:**
- Create: `plugins/travel-planner/.claude-plugin/plugin.json`
- Create: `plugins/travel-planner/package.json`
- Create: `plugins/travel-planner/tsconfig.json`
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Create plugin directory structure**

```bash
mkdir -p plugins/travel-planner/.claude-plugin
mkdir -p plugins/travel-planner/skills/{plan-trip/references,create-location/references,create-country/references,create-region}
mkdir -p plugins/travel-planner/scripts/__tests__
```

- [ ] **Step 2: Create plugin.json**

Write `plugins/travel-planner/.claude-plugin/plugin.json`:
```json
{
  "name": "travel-planner"
}
```

- [ ] **Step 3: Create package.json**

Write `plugins/travel-planner/package.json`:
```json
{
  "name": "travel-planner",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "bun test",
    "preferences": "bun run scripts/preferences.ts",
    "geocode": "bun run scripts/geocode.ts",
    "budget": "bun run scripts/budget.ts"
  },
  "devDependencies": {
    "@types/bun": "latest"
  }
}
```

- [ ] **Step 4: Create tsconfig.json**

Write `plugins/travel-planner/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./scripts",
    "types": ["bun-types"]
  },
  "include": ["scripts/**/*.ts"]
}
```

- [ ] **Step 5: Create .gitignore**

Write `plugins/travel-planner/.gitignore`:
```
node_modules/
dist/
```

- [ ] **Step 6: Install dependencies (including yaml for frontmatter parsing)**

Run: `cd plugins/travel-planner && bun install && bun add yaml`
Expected: lockfile and node_modules created, yaml package added

- [ ] **Step 7: Register in marketplace.json**

Modify `.claude-plugin/marketplace.json` — add to the `plugins` array:
```json
{
  "name": "travel-planner",
  "version": "0.1.0",
  "source": "./plugins/travel-planner",
  "description": "Trip planning with Obsidian integration — researches destinations, creates itineraries, location/country/region notes, budgets, and packing lists",
  "author": {
    "name": "Oskar Dragon"
  },
  "keywords": ["travel", "obsidian", "planning", "trips"]
}
```

- [ ] **Step 8: Commit scaffold**

```bash
git add plugins/travel-planner/.claude-plugin/plugin.json plugins/travel-planner/package.json plugins/travel-planner/tsconfig.json plugins/travel-planner/.gitignore plugins/travel-planner/bun.lockb .claude-plugin/marketplace.json
git commit -m "feat(travel-planner): scaffold plugin structure"
```

---

### Task 2: preferences.ts

**Files:**
- Create: `plugins/travel-planner/scripts/preferences.ts`
- Create: `plugins/travel-planner/scripts/__tests__/preferences.test.ts`

This script reads `.claude/travel-planner.local.md`, parses YAML frontmatter, and outputs structured JSON to stdout. Exits with code 1 if file doesn't exist.

- [ ] **Step 1: Write failing tests**

Write `plugins/travel-planner/scripts/__tests__/preferences.test.ts`:

```typescript
import { describe, it, expect } from "bun:test";
import { parsePreferences, type Preferences } from "../preferences";

const SAMPLE_CONTENT = `---
travel_style: adventurous
budget_level: mid-range
accommodation_preference:
  - boutique hotels
  - Airbnb
interests:
  - culture
  - food
  - photography
dietary_restrictions: []
pace_preference: moderate
travel_companions: couple
preferred_sources:
  - https://www.atlasobscura.com
  - https://www.alltrails.com
---

## Notes
Some free-form notes here.
`;

const MINIMAL_CONTENT = `---
travel_style: budget
budget_level: budget
accommodation_preference: []
interests: []
dietary_restrictions: []
pace_preference: relaxed
travel_companions: solo
preferred_sources: []
---
`;

describe("parsePreferences", () => {
  it("parses full preferences with all fields", () => {
    const result = parsePreferences(SAMPLE_CONTENT);
    expect(result.travel_style).toBe("adventurous");
    expect(result.budget_level).toBe("mid-range");
    expect(result.accommodation_preference).toEqual(["boutique hotels", "Airbnb"]);
    expect(result.interests).toEqual(["culture", "food", "photography"]);
    expect(result.dietary_restrictions).toEqual([]);
    expect(result.pace_preference).toBe("moderate");
    expect(result.travel_companions).toBe("couple");
    expect(result.preferred_sources).toEqual([
      "https://www.atlasobscura.com",
      "https://www.alltrails.com",
    ]);
  });

  it("parses minimal preferences", () => {
    const result = parsePreferences(MINIMAL_CONTENT);
    expect(result.travel_style).toBe("budget");
    expect(result.preferred_sources).toEqual([]);
  });

  it("throws on missing frontmatter delimiters", () => {
    expect(() => parsePreferences("no frontmatter here")).toThrow();
  });

  it("throws on missing required field", () => {
    const content = `---
travel_style: adventurous
---
`;
    expect(() => parsePreferences(content)).toThrow();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd plugins/travel-planner && bun test scripts/__tests__/preferences.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement preferences.ts**

Write `plugins/travel-planner/scripts/preferences.ts`:

```typescript
import { parse as parseYaml } from "yaml";

export interface Preferences {
  travel_style: string;
  budget_level: string;
  accommodation_preference: string[];
  interests: string[];
  dietary_restrictions: string[];
  pace_preference: string;
  travel_companions: string;
  preferred_sources: string[];
}

const REQUIRED_FIELDS: (keyof Preferences)[] = [
  "travel_style",
  "budget_level",
  "accommodation_preference",
  "interests",
  "dietary_restrictions",
  "pace_preference",
  "travel_companions",
  "preferred_sources",
];

export function parsePreferences(content: string): Preferences {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error("No YAML frontmatter found");
  }

  const parsed = parseYaml(match[1]);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid YAML frontmatter");
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in parsed)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return parsed as Preferences;
}

// CLI entry point
if (import.meta.main) {
  const configPath =
    process.argv[2] ??
    `${process.env.HOME}/.claude/travel-planner.local.md`;

  const file = Bun.file(configPath);
  const exists = await file.exists();

  if (!exists) {
    console.error(JSON.stringify({ error: "config_not_found", path: configPath }));
    process.exit(1);
  }

  const content = await file.text();
  try {
    const prefs = parsePreferences(content);
    console.log(JSON.stringify(prefs, null, 2));
  } catch (e) {
    console.error(JSON.stringify({ error: "parse_error", message: (e as Error).message }));
    process.exit(1);
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd plugins/travel-planner && bun test scripts/__tests__/preferences.test.ts`
Expected: All 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add plugins/travel-planner/scripts/preferences.ts plugins/travel-planner/scripts/__tests__/preferences.test.ts
git commit -m "feat(travel-planner): add preferences parser with tests"
```

---

### Task 3: geocode.ts

**Files:**
- Create: `plugins/travel-planner/scripts/geocode.ts`
- Create: `plugins/travel-planner/scripts/__tests__/geocode.test.ts`

Queries Nominatim API for coordinates. Respects rate limits. Returns `[lat, lon]` or null.

- [ ] **Step 1: Write failing tests**

Write `plugins/travel-planner/scripts/__tests__/geocode.test.ts`:

```typescript
import { describe, it, expect, mock, beforeEach } from "bun:test";
import { geocode, selectBestResult, type NominatimResult } from "../geocode";

describe("selectBestResult", () => {
  const results: NominatimResult[] = [
    {
      lat: "51.4545",
      lon: "-2.5879",
      display_name: "Bristol, City of Bristol, England, United Kingdom",
      importance: 0.8,
      type: "city",
    },
    {
      lat: "41.6738",
      lon: "-72.9493",
      display_name: "Bristol, Hartford County, Connecticut, United States",
      importance: 0.5,
      type: "city",
    },
  ];

  it("selects highest importance result", () => {
    const best = selectBestResult(results);
    expect(best?.lat).toBe("51.4545");
  });

  it("returns null for empty results", () => {
    expect(selectBestResult([])).toBeNull();
  });
});

describe("geocode", () => {
  beforeEach(() => {
    mock.restore();
  });

  it("returns coordinates for a known location", async () => {
    const mockResponse = [
      {
        lat: "48.8566",
        lon: "2.3522",
        display_name: "Paris, Ile-de-France, France",
        importance: 0.9,
        type: "city",
      },
    ];

    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify(mockResponse)))
    ) as typeof fetch;

    const result = await geocode("Paris");
    expect(result).toEqual({ lat: "48.8566", lon: "2.3522", display_name: "Paris, Ile-de-France, France" });
  });

  it("returns null when no results found", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify([])))
    ) as typeof fetch;

    const result = await geocode("Nonexistent Place XYZ123");
    expect(result).toBeNull();
  });

  it("tries alternative search with country filter", async () => {
    let callCount = 0;
    globalThis.fetch = mock(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve(new Response(JSON.stringify([])));
      }
      return Promise.resolve(
        new Response(
          JSON.stringify([
            {
              lat: "35.0",
              lon: "38.0",
              display_name: "Wadi Rum, Jordan",
              importance: 0.6,
              type: "desert",
            },
          ])
        )
      );
    }) as typeof fetch;

    const result = await geocode("Wadi Rum", "Jordan");
    expect(result).not.toBeNull();
    expect(callCount).toBe(2);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd plugins/travel-planner && bun test scripts/__tests__/geocode.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement geocode.ts**

Write `plugins/travel-planner/scripts/geocode.ts`:

```typescript
export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  importance: number;
  type: string;
}

export interface GeocodedLocation {
  lat: string;
  lon: string;
  display_name: string;
}

const BASE_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "travel-planner-claude-plugin/0.1.0";

async function searchNominatim(
  query: string,
  countryCode?: string
): Promise<NominatimResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "5",
  });
  if (countryCode) {
    params.set("countrycodes", countryCode);
  }

  const response = await fetch(`${BASE_URL}?${params}`, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Nominatim API error: ${response.status}`);
  }

  return response.json();
}

export function selectBestResult(
  results: NominatimResult[]
): NominatimResult | null {
  if (results.length === 0) return null;
  return results.sort((a, b) => b.importance - a.importance)[0];
}

export async function geocode(
  locationName: string,
  country?: string
): Promise<GeocodedLocation | null> {
  // Strategy 1: exact name search
  let results = await searchNominatim(locationName);
  let best = selectBestResult(results);
  if (best) {
    return { lat: best.lat, lon: best.lon, display_name: best.display_name };
  }

  // Strategy 2: name + country filter (if country provided)
  if (country) {
    // Wait 1 second to respect rate limit
    await Bun.sleep(1000);
    results = await searchNominatim(`${locationName} ${country}`);
    best = selectBestResult(results);
    if (best) {
      return { lat: best.lat, lon: best.lon, display_name: best.display_name };
    }
  }

  // Strategy 3: simplified name (remove articles, parenthetical text)
  const simplified = locationName
    .replace(/\(.*?\)/g, "")
    .replace(/\b(the|of|de|la|le|el|al)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (simplified !== locationName) {
    await Bun.sleep(1000);
    results = await searchNominatim(simplified);
    best = selectBestResult(results);
    if (best) {
      return { lat: best.lat, lon: best.lon, display_name: best.display_name };
    }
  }

  return null;
}

// CLI entry point
if (import.meta.main) {
  const locationName = process.argv[2];
  const country = process.argv[3];

  if (!locationName) {
    console.error(JSON.stringify({ error: "missing_argument", message: "Usage: bun run geocode.ts <location> [country]" }));
    process.exit(1);
  }

  const result = await geocode(locationName, country);
  if (result) {
    console.log(JSON.stringify(result));
  } else {
    console.log(JSON.stringify({ coordinates: null, reason: "No results found", tried: [locationName, country].filter(Boolean) }));
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd plugins/travel-planner && bun test scripts/__tests__/geocode.test.ts`
Expected: All 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add plugins/travel-planner/scripts/geocode.ts plugins/travel-planner/scripts/__tests__/geocode.test.ts
git commit -m "feat(travel-planner): add geocode script with Nominatim lookup"
```

---

### Task 4: budget.ts

**Files:**
- Create: `plugins/travel-planner/scripts/budget.ts`
- Create: `plugins/travel-planner/scripts/__tests__/budget.test.ts`

Calculates budget breakdown by category and returns a markdown table.

- [ ] **Step 1: Write failing tests**

Write `plugins/travel-planner/scripts/__tests__/budget.test.ts`:

```typescript
import { describe, it, expect } from "bun:test";
import { calculateBudget, formatBudgetTable, type BudgetBreakdown } from "../budget";

describe("calculateBudget", () => {
  it("calculates budget tier breakdown", () => {
    const result = calculateBudget(1000, "GBP", "budget");
    expect(result.total).toBe(1000);
    expect(result.currency).toBe("GBP");
    expect(result.categories.accommodation).toBe(400);
    expect(result.categories.food).toBe(250);
    expect(result.categories.activities).toBe(200);
    expect(result.categories.transport).toBe(100);
    expect(result.categories.misc).toBe(50);
  });

  it("calculates mid-range breakdown", () => {
    const result = calculateBudget(2000, "EUR", "mid-range");
    expect(result.categories.accommodation).toBe(700);
    expect(result.categories.food).toBe(500);
    expect(result.categories.activities).toBe(500);
    expect(result.categories.transport).toBe(200);
    expect(result.categories.misc).toBe(100);
  });

  it("calculates luxury breakdown", () => {
    const result = calculateBudget(5000, "USD", "luxury");
    expect(result.categories.accommodation).toBe(2250);
    expect(result.categories.food).toBe(1000);
    expect(result.categories.activities).toBe(1000);
    expect(result.categories.transport).toBe(500);
    expect(result.categories.misc).toBe(250);
  });

  it("defaults to mid-range for unknown tier", () => {
    const result = calculateBudget(1000, "GBP", "unknown");
    expect(result.categories.accommodation).toBe(350);
  });
});

describe("formatBudgetTable", () => {
  it("formats as markdown table", () => {
    const breakdown: BudgetBreakdown = {
      total: 1000,
      currency: "GBP",
      categories: {
        accommodation: 400,
        food: 250,
        activities: 200,
        transport: 100,
        misc: 50,
      },
    };

    const table = formatBudgetTable(breakdown);
    expect(table).toContain("| Category |");
    expect(table).toContain("| Accommodation | 400 GBP | 40% |");
    expect(table).toContain("| **Total** | **1000 GBP** | **100%** |");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd plugins/travel-planner && bun test scripts/__tests__/budget.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement budget.ts**

Write `plugins/travel-planner/scripts/budget.ts`:

```typescript
export interface BudgetBreakdown {
  total: number;
  currency: string;
  categories: {
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
    misc: number;
  };
}

type BudgetTier = "budget" | "mid-range" | "luxury";

const TIER_SPLITS: Record<BudgetTier, number[]> = {
  budget: [0.4, 0.25, 0.2, 0.1, 0.05],
  "mid-range": [0.35, 0.25, 0.25, 0.1, 0.05],
  luxury: [0.45, 0.2, 0.2, 0.1, 0.05],
};

const CATEGORY_NAMES = ["accommodation", "food", "activities", "transport", "misc"] as const;

export function calculateBudget(
  total: number,
  currency: string,
  tier: string
): BudgetBreakdown {
  const splits = TIER_SPLITS[tier as BudgetTier] ?? TIER_SPLITS["mid-range"];

  const categories = Object.fromEntries(
    CATEGORY_NAMES.map((name, i) => [name, Math.round(total * splits[i])])
  ) as BudgetBreakdown["categories"];

  return { total, currency, categories };
}

export function formatBudgetTable(breakdown: BudgetBreakdown): string {
  const { total, currency, categories } = breakdown;
  const lines: string[] = [
    "| Category | Amount | % |",
    "|---|---|---|",
  ];

  for (const name of CATEGORY_NAMES) {
    const amount = categories[name];
    const pct = Math.round((amount / total) * 100);
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    lines.push(`| ${label} | ${amount} ${currency} | ${pct}% |`);
  }

  lines.push(`| **Total** | **${total} ${currency}** | **100%** |`);
  return lines.join("\n");
}

// CLI entry point
if (import.meta.main) {
  const total = Number(process.argv[2]);
  const currency = process.argv[3];
  const tier = process.argv[4] ?? "mid-range";

  if (!total || !currency) {
    console.error(JSON.stringify({ error: "missing_arguments", message: "Usage: bun run budget.ts <total> <currency> [tier]" }));
    process.exit(1);
  }

  const breakdown = calculateBudget(total, currency, tier);
  const table = formatBudgetTable(breakdown);
  console.log(table);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd plugins/travel-planner && bun test scripts/__tests__/budget.test.ts`
Expected: All 5 tests PASS

- [ ] **Step 5: Run full test suite**

Run: `cd plugins/travel-planner && bun test`
Expected: All tests across all 3 scripts PASS

- [ ] **Step 6: Commit**

```bash
git add plugins/travel-planner/scripts/budget.ts plugins/travel-planner/scripts/__tests__/budget.test.ts
git commit -m "feat(travel-planner): add budget breakdown calculator with tests"
```

---

## Chunk 2: Foundation Skills (create-location, create-country, create-region)

These three skills are independently invokable and are also called by plan-trip. Build them first since plan-trip depends on them.

### Task 5: create-location skill + reference

**Files:**
- Create: `plugins/travel-planner/skills/create-location/SKILL.md`
- Create: `plugins/travel-planner/skills/create-location/references/location-types.md`

- [ ] **Step 1: Write location-types.md reference**

Write `plugins/travel-planner/skills/create-location/references/location-types.md`:

This file documents the mapping from location type to frontmatter fields and content sections. Include:
- Table of all 7 types with their tag, icon, color, and extra sections
- Color convention explanation (green = see/do/eat, blue = stay)
- Frontmatter field reference for each type
- Content section order for each type
- The Dataview image expression used at the end of all notes

Source the exact values from the design spec section "2. `create-location`".

- [ ] **Step 2: Write SKILL.md**

Write `plugins/travel-planner/skills/create-location/SKILL.md`:

Frontmatter:
```yaml
---
name: create-location
description: This skill should be used when the user asks to "create a location note", "add a place to Obsidian", "make a note for this restaurant/hotel/campsite/trail/photo spot", "research a location", or wants to add any point of interest to their Obsidian vault. Creates researched location notes with geocoding, correct type-specific formatting, and Obsidian integration.
version: 0.1.0
---
```

Body content — write in imperative form, covering:
1. Purpose: create a single location note in the Obsidian vault at `/Users/oskardragon-work/workspaces/obsidian/`
2. Workflow steps:
   - Determine location type (ask user if not specified). Valid types: Photo Locations, Restaurants, Hotel, Campsite, Trails, Other
   - Read the vault template: `/Users/oskardragon-work/workspaces/obsidian/Templates/Place Template.md`
   - Research the location via web search (find description, address, opening hours, highlights, sources — minimum 3 sources)
   - Geocode via `bun run ${CLAUDE_PLUGIN_ROOT}/scripts/geocode.ts "<location name>" "<country>"`
   - Check if note already exists at target path — warn and ask before overwriting
   - Create note file using template structure with type-specific fields from `references/location-types.md`
   - Invoke `obsidian:obsidian-markdown` skill for proper Obsidian formatting
3. Output path: notes go in the vault at a location determined by context (e.g., `Travel/Locations/<Name>.md` or alongside related trip notes)
4. Point to `references/location-types.md` for type → icon/color/tag/section mapping
5. Note: when invoked by plan-trip, research data may already be provided — skip web search if research summary is included in the prompt

Keep under 2000 words. Use imperative form throughout.

- [ ] **Step 3: Validate skill structure**

Check:
- SKILL.md has valid YAML frontmatter with `name` and `description`
- Description uses third person and includes trigger phrases
- Body uses imperative form
- Reference file exists and is referenced from SKILL.md
- Under 2000 words

- [ ] **Step 4: Commit**

```bash
git add plugins/travel-planner/skills/create-location/
git commit -m "feat(travel-planner): add create-location skill"
```

---

### Task 6: create-country skill + reference

**Files:**
- Create: `plugins/travel-planner/skills/create-country/SKILL.md`
- Create: `plugins/travel-planner/skills/create-country/references/country-sections.md`

- [ ] **Step 1: Write country-sections.md reference**

Write `plugins/travel-planner/skills/create-country/references/country-sections.md`:

Document the Travel Information sub-sections that a country note should contain:
- Best Time to Visit — seasons, climate, peak/off-peak, festivals
- Visa Requirements — visa type, duration, application process, cost
- Currency & Prices — local currency, exchange tips, typical costs, tipping norms
- Safety — general safety level, areas to avoid, common scams, emergency numbers
- Airport — main international airports, transport to city, typical taxi/transfer costs

For each sub-section, list what information to research and how to structure it.

- [ ] **Step 2: Write SKILL.md**

Write `plugins/travel-planner/skills/create-country/SKILL.md`:

Frontmatter:
```yaml
---
name: create-country
description: This skill should be used when the user asks to "create a country note", "add a country to Obsidian", "research a country", or needs country-level travel information (visa, currency, safety, airports). Creates or updates country notes in the Obsidian vault with researched travel information.
version: 0.1.0
---
```

Body content — write in imperative form, covering:
1. Purpose: create or update a country note in the vault at `/Users/oskardragon-work/workspaces/obsidian/`
2. Workflow:
   - **Check if country already exists** — search vault for existing note. If found, update Travel Information sections with fresh research. If not found, create new.
   - Read vault template: `/Users/oskardragon-work/workspaces/obsidian/Templates/Country Template.md`
   - Research country via web search using categories from `references/country-sections.md`
   - Geocode via `bun run ${CLAUDE_PLUGIN_ROOT}/scripts/geocode.ts "<country>"`
   - Create/update note with frontmatter (`categories: - [[Places]]`, `type: - [[Countries]]` (list format), `color: gray`, `icon: earth`, `created: YYYY-MM-DD`, coordinates)
   - Content sections: Trips embed, Places embed + map, Description, Travel Information (5 sub-sections), Useful Links
   - Invoke `obsidian:obsidian-markdown` for formatting
3. Output path: `/Users/oskardragon-work/workspaces/obsidian/Travel/Countries/<Country Name>.md`
4. Existence check: use Glob tool to search for `**/<Country Name>.md` files with `type: [[Countries]]` in frontmatter
5. Point to `references/country-sections.md` for research categories
6. Note: when invoked by plan-trip, some research data (visa, currency, safety) may already be provided — use it and supplement with additional research

Keep under 2000 words.

- [ ] **Step 3: Validate skill structure**

Same validation as Task 5 Step 3.

- [ ] **Step 4: Commit**

```bash
git add plugins/travel-planner/skills/create-country/
git commit -m "feat(travel-planner): add create-country skill"
```

---

### Task 7: create-region skill

**Files:**
- Create: `plugins/travel-planner/skills/create-region/SKILL.md`

- [ ] **Step 1: Write SKILL.md**

Write `plugins/travel-planner/skills/create-region/SKILL.md`:

Frontmatter:
```yaml
---
name: create-region
description: This skill should be used when the user asks to "create a region note", "add a region to Obsidian", "add an area note", or needs to create a geographic region or area linked to a country. Creates region notes in the Obsidian vault with Base embeds for trips and places.
version: 0.1.0
---
```

Body content — write in imperative form, covering:
1. Purpose: create a region/area note in the vault at `/Users/oskardragon-work/workspaces/obsidian/`
2. Workflow:
   - **Check if region already exists** — search vault for existing note with matching name. If found, skip creation entirely (regions are minimal, no update needed).
   - Read vault template: `/Users/oskardragon-work/workspaces/obsidian/Templates/Region Template.md`
   - Geocode via `bun run ${CLAUDE_PLUGIN_ROOT}/scripts/geocode.ts "<region>" "<country>"`
   - Create note with frontmatter (`categories: - [[Places]]`, `type: - [[Regions]]` (list format), `location: - [[Country Name]]`, `created: YYYY-MM-DD`, coordinates)
   - Content: Trips base embed, Places base embed + map. Optionally add a brief `## Description` if context is available.
   - Invoke `obsidian:obsidian-markdown` for formatting
3. Output path: `/Users/oskardragon-work/workspaces/obsidian/Travel/Regions/<Region Name>.md`
4. Existence check: use Glob tool to search for `**/<Region Name>.md`
5. This is intentionally minimal — regions are lightweight organisational nodes that rely on Base embeds for dynamic content

Keep under 1000 words (this is a simple skill).

- [ ] **Step 2: Validate skill structure**

Same validation as Task 5 Step 3.

- [ ] **Step 3: Commit**

```bash
git add plugins/travel-planner/skills/create-region/
git commit -m "feat(travel-planner): add create-region skill"
```

---

## Chunk 3: Orchestrator Skill (plan-trip)

The main skill that ties everything together. Depends on all three foundation skills and all three scripts.

### Task 8: plan-trip reference — research-categories.md

**Files:**
- Create: `plugins/travel-planner/skills/plan-trip/references/research-categories.md`

- [ ] **Step 1: Write research-categories.md**

Write `plugins/travel-planner/skills/plan-trip/references/research-categories.md`:

Document the 8 research categories and how they adapt by trip type:

**Base categories (all trip types):**
1. Visa & entry requirements — visa type, passport validity, travel insurance, vaccination
2. Weather & best time — temperature range, rainfall, seasonal events, what to pack
3. Transport — getting there (flights, trains), getting around (public transport, car rental, walking)
4. Attractions & activities — top sights, hidden gems, day trips, guided tours
5. Food scene & restaurants — local cuisine, must-try dishes, restaurant recommendations, dietary options
6. Neighbourhoods & areas to stay — best areas for tourists, budget/mid/luxury zones, safety
7. Events during dates — festivals, public holidays, exhibitions, local events
8. Practical tips — currency exchange, tipping, SIM cards/eSIM, power adapters, language basics, safety

**Trip type adaptations:**
- Campervan: add campsite availability, dump stations, gas prices, driving rules, wild camping legality, shower/laundry facilities, overnight parking spots
- Through-hike: add trail conditions, resupply points, water sources, permits, elevation profiles, shelter/hut availability, gear requirements
- City break: add museum/gallery passes, walking routes, public transport cards, nightlife areas
- Wild camping: add legality by region, water purification, leave-no-trace guidelines, weather exposure, emergency shelter
- Road trip: add driving distances between stops, rest areas, scenic routes, fuel costs, car rental tips, road conditions

**Research instructions:**
- Each category is researched by a dedicated subagent
- Subagents check `preferred_sources` from preferences first, then broader web search
- Each subagent returns a structured text summary (not raw search results)
- Summary format: category name, key findings as bullet points, source URLs

- [ ] **Step 2: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/references/research-categories.md
git commit -m "feat(travel-planner): add research categories reference"
```

---

### Task 9: plan-trip SKILL.md

**Files:**
- Create: `plugins/travel-planner/skills/plan-trip/SKILL.md`

- [ ] **Step 1: Write SKILL.md**

Write `plugins/travel-planner/skills/plan-trip/SKILL.md`:

Frontmatter:
```yaml
---
name: plan-trip
description: This skill should be used when the user asks to "plan a trip", "create a trip itinerary", "help me plan travel to", "organise a holiday", "plan a vacation", or mentions trip planning, travel planning, holiday planning, or itinerary creation. Orchestrates full trip planning — research, itinerary generation, location/country/region note creation, budgets, packing lists, and pre-trip timelines in an Obsidian vault.
version: 0.1.0
---
```

Body content — write in imperative form, covering:

**1. Overview**
Lean orchestrator that collects trip details and dispatches parallel subagents. Never does heavy research or note-writing directly. All notes are created in the Obsidian vault at `/Users/oskardragon-work/workspaces/obsidian/`.

**2. Preferences**
- Run `bun run ${CLAUDE_PLUGIN_ROOT}/scripts/preferences.ts` to load config
- If exit code 1 (config not found), onboard the user:
  - Ask about: travel style, budget level, accommodation preferences, interests, dietary restrictions, pace, travel companions, preferred source websites
  - Write responses to `~/.claude/travel-planner.local.md` in YAML frontmatter format
  - Re-run preferences script to confirm

**3. Collect Trip Details**
Ask for (in one or two focused questions):
- Destination (city, region, or country)
- Dates (start and end)
- Budget (total amount + currency)
- Purpose (leisure, adventure, cultural, etc.)
- Trip type (campervan, through-hike, city break, road trip, wild camping — this significantly affects research and itinerary)
- Number of travellers
- Must-see items or specific interests

**4. Parallel Batch 1 — Research**
Dispatch 8 background subagents (sonnet model) simultaneously using the Agent tool. Each agent:
- Receives: destination, dates, trip type, preferences (interests, dietary restrictions, preferred sources)
- Researches one specific category from `references/research-categories.md`
- Returns: structured text summary with bullet points and source URLs
- Refer to `references/research-categories.md` for the full list and trip type adaptations

**5. Parallel Batch 2 — Country & Region**
After Batch 1 completes, dispatch 2 subagents:
- Country agent: invoke `create-country` skill with relevant research (visa, currency, safety). Pass destination country name.
- Region agent: invoke `create-region` skill with destination region/city and parent country.

**6. Write Trip Note**
The orchestrator writes the trip note itself (not delegated) at `Travel/Trips/<Trip Name>.md`:
- Use research summaries from Batch 1 to compose day-by-day itinerary
- Frontmatter: `categories: [[Trips]]`, `created`, `start`, `end`, `location: [[Country]]`, `type`
- Content: map embed, daily itinerary with `[[location]]` wikilinks, links section
- Invoke `obsidian:obsidian-markdown` for formatting

**7. Parallel Batch 3 — Location Notes**
Dispatch one subagent per researched place (restaurants, attractions, photo spots, accommodations, trails):
- Each invokes `create-location` skill
- Pass: location name, type, research summary, country, region
- These run in parallel

**8. Parallel Batch 4 — Trip Extras**
Dispatch 3 subagents:
- Budget breakdown: run `bun run ${CLAUDE_PLUGIN_ROOT}/scripts/budget.ts <total> <currency> <tier>`, return markdown table
- Packing checklist: generate climate/activity/trip-type aware list as markdown checklist
- Pre-trip countdown: generate timeline from 3 months to day-before as markdown checklist

**Collect all three results and append to trip note in a single write** (avoids file write conflicts).

**9. Expense Tracking**
Check if `Categories/Expenses.base` exists in the vault. If not, create it:
- Invoke `obsidian:obsidian-bases` skill
- Fields: Trip (link), Date, Category, Description, Amount, Currency
- Add a link to this base from the trip note

**10. Summary**
Report to user: trip note path, number of location notes created, country/region status, any warnings.

Keep body under 3000 words. Reference `research-categories.md` for category details rather than duplicating.

- [ ] **Step 2: Validate skill structure**

Check:
- SKILL.md has valid YAML frontmatter with `name` and `description`
- Description uses third person and includes specific trigger phrases
- Body uses imperative form
- Reference file is referenced from SKILL.md
- Under 3000 words
- All `${CLAUDE_PLUGIN_ROOT}` paths are correct
- Batch flow matches the design spec

- [ ] **Step 3: Commit**

```bash
git add plugins/travel-planner/skills/plan-trip/
git commit -m "feat(travel-planner): add plan-trip orchestrator skill"
```

---

### Task 10: Final Validation

- [ ] **Step 1: Verify complete directory structure**

Run: `find plugins/travel-planner -type f | sort`

Expected output:
```
plugins/travel-planner/.claude-plugin/plugin.json
plugins/travel-planner/bun.lockb
plugins/travel-planner/package.json
plugins/travel-planner/scripts/__tests__/budget.test.ts
plugins/travel-planner/scripts/__tests__/geocode.test.ts
plugins/travel-planner/scripts/__tests__/preferences.test.ts
plugins/travel-planner/scripts/budget.ts
plugins/travel-planner/scripts/geocode.ts
plugins/travel-planner/scripts/preferences.ts
plugins/travel-planner/skills/create-country/SKILL.md
plugins/travel-planner/skills/create-country/references/country-sections.md
plugins/travel-planner/skills/create-location/SKILL.md
plugins/travel-planner/skills/create-location/references/location-types.md
plugins/travel-planner/skills/create-region/SKILL.md
plugins/travel-planner/skills/plan-trip/SKILL.md
plugins/travel-planner/skills/plan-trip/references/research-categories.md
plugins/travel-planner/tsconfig.json
```

- [ ] **Step 2: Run full test suite**

Run: `cd plugins/travel-planner && bun test`
Expected: All tests PASS

- [ ] **Step 3: Verify marketplace registration**

Run: `grep -A5 "travel-planner" .claude-plugin/marketplace.json`
Expected: entry with version "0.1.0"

- [ ] **Step 4: Verify all SKILL.md files have valid frontmatter**

For each SKILL.md:
- Has `---` delimiters
- Has `name` field
- Has `description` field with trigger phrases in third person
- Body uses imperative form

- [ ] **Step 5: Final commit if any fixes needed**

```bash
git add -A && git commit -m "fix(travel-planner): address validation issues"
```

(Only if there were fixes — skip if everything passed.)
