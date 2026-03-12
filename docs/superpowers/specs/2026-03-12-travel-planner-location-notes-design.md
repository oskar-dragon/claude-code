# Travel Planner: Plan-Trip Orchestration Rewrite

**Date:** 2026-03-12
**Status:** Draft
**Plugin:** `travel-planner`
**Skill:** `plan-trip`

---

## Problem

When `plan-trip` generates a trip note, some locations end up with `[[wikilinks]]` that have no corresponding Obsidian note. Obsidian shows these as "not created yet". The issue is random — different locations are missing on each run.

**Root Cause 1 — Non-determinism:** The trip note (Step 5) and location note creation (Step 6) independently derive their location lists from Batch 1 research. These are two separate LLM decisions that diverge. Places like transport hubs (`[[Lijiang Transport Center]]`) or specific hostels (`[[Hartang Inn Hostel]]`) get wikilinked naturally during itinerary writing but are not identified as "places warranting a note" when Step 6 re-scans the research categories.

**Root Cause 2 — Context compaction:** Step 6 currently dispatches one background subagent per location, all simultaneously. For a long trip (21+ days) this can be 50–80+ agents. As the parent conversation grows, Claude Code compresses its context, and the orchestrator loses references to pending agents. Those agents may complete successfully but their results are never received.

**Root Cause 3 — Context pollution:** All 8 Batch 1 research summaries flow back into the orchestrator's context. By the time Batch 3 runs, the orchestrator is holding the full research corpus, the trip note, and country/region note results — all of which contribute to context pressure. The orchestrator should coordinate, not accumulate.

**Root Cause 4 — Structural fragility:** The SKILL.md mixes orchestration logic with subagent instructions. The orchestrator improvises prompts at dispatch time rather than using structured templates, leading to inconsistent context passing and no standardised reporting. There is no verification step after subagent completion, no model selection guidance, and no escalation protocol when subagents fail.

---

## Design

This is a full rewrite of `plan-trip/SKILL.md` following the orchestration patterns established by the superpowers plugin (subagent-driven-development, dispatching-parallel-agents, verification-before-completion). The rewrite addresses all four root causes through six design changes.

### Change 1: Orchestrator as pure coordinator

The orchestrator never does content-producing work directly. Every content-producing step — research, note creation, trip note writing, extras — is delegated to a subagent. The orchestrator's responsibilities are limited to:

- Collecting trip details from the user (Steps 1–2)
- Computing file paths and dispatch parameters
- Dispatching subagents with precisely crafted prompts
- Tracking task status (file paths, status codes, warnings)
- Wikilink extraction and filtering (Step 5b — lightweight text processing, not content production)
- Running verification checks
- Presenting the final summary

The orchestrator's context should contain only: user preferences, trip details, file paths, status tracking, and the authoritative location list. It should never hold research content, note content, or full subagent output.

### Change 2: Prompt templates per subagent role

Extract subagent instructions from SKILL.md into structured prompt templates at `skills/plan-trip/prompts/`. The orchestrator reads a template, fills in the variables (destination, file paths, dates, preferences), and dispatches. This makes prompts consistent, debuggable, and independently improvable.

**New files:**

```
skills/plan-trip/prompts/
├── researcher.md              # Batch 1: research a single category
├── country-creator.md         # Batch 2: wrap create-country skill invocation
├── region-creator.md          # Batch 2: wrap create-region skill invocation
├── trip-note-writer.md        # Step 5: write the trip note
├── location-creator.md        # Batch 3: wrap create-location skill invocation
├── budget-generator.md        # Batch 4: generate budget breakdown
├── packing-generator.md       # Batch 4: generate packing list
└── countdown-generator.md     # Batch 4: generate pre-trip countdown
```

**Skill-wrapping templates (Batch 2 and 3):** The `country-creator.md`, `region-creator.md`, and `location-creator.md` templates do not replace the existing `create-country`, `create-region`, and `create-location` skills. They wrap them — the template instructs the subagent to read the relevant clipping files to extract the data it needs, then invoke the existing skill with that data. This avoids duplicating skill logic while ensuring each subagent has the right context.

Each template follows the superpowers implementer-prompt pattern:

```markdown
# [Role Name]

## Your Task
[What to do — filled in by orchestrator]

## Context
[Scene-setting — where this fits in the trip planning workflow]

## Input
[Exactly what files to read and what data you have]

## Output
[Where to write, what format, what frontmatter]

## Self-Review
Before reporting back, verify:
- [Checklist specific to this role]

## Report Format
Return:
- **Status:** DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
- **File path:** path to written file (if DONE/DONE_WITH_CONCERNS)
- **Concerns:** any issues encountered (if DONE_WITH_CONCERNS)
- **Blocker:** what's preventing completion (if BLOCKED)
- **Question:** what information is missing (if NEEDS_CONTEXT)
```

### Change 3: Structured status reporting

Every subagent returns one of four statuses:

| Status | Meaning | Orchestrator action |
|--------|---------|-------------------|
| `DONE` | File written, self-review passed | Record path, proceed |
| `DONE_WITH_CONCERNS` | File written, but issues noted (thin research, geocoding failed, <3 sources) | Record path + concern, proceed |
| `BLOCKED` | Cannot complete (API error, location not found, ambiguous data) | Log warning, skip this item, continue with remaining |
| `NEEDS_CONTEXT` | Missing information to proceed | Provide context, re-dispatch once. If still NEEDS_CONTEXT, escalate to BLOCKED |

The orchestrator handles each status type. It never ignores a non-DONE status — concerns are surfaced in the Step 9 summary, blocks are logged as warnings.

### Change 4: File-based research handoff

Research agents write their output as Obsidian clippings instead of returning summaries to the orchestrator. This keeps the orchestrator's context lean — it only tracks file paths, not content.

Each Batch 1 research agent writes a clipping to the vault at:

```
Clippings/<Trip Name> — <Category>.md
```

For example, a China trip produces:
- `Clippings/China October 2026 — Visa & Entry.md`
- `Clippings/China October 2026 — Weather.md`
- `Clippings/China October 2026 — Transport.md`
- `Clippings/China October 2026 — Attractions.md`
- `Clippings/China October 2026 — Food Scene.md`
- `Clippings/China October 2026 — Neighbourhoods.md`
- `Clippings/China October 2026 — Events.md`
- `Clippings/China October 2026 — Practical Tips.md`

Each clipping uses the standard vault frontmatter format. The `source` field uses YAML list format (multiple sources per clipping, unlike single-source web clippings). The `topics` field links to the destination for discoverability:

```yaml
---
categories:
  - "[[Clippings]]"
author:
  - "[[Claude]]"
source:
  - "https://example.com/source1"
  - "https://example.com/source2"
  - "https://example.com/source3"
created: YYYY-MM-DD
topics:
  - "[[China]]"
---
```

The research content follows the existing structured format defined in `references/research-categories.md`.

**How subagents learn to write files:** The orchestrator reads `prompts/researcher.md`, fills in the target file path, clipping frontmatter template, and research category, then dispatches. The subagent writes the file and returns a structured status report with the file path. The orchestrator collects the 8 paths for all downstream dispatch.

**Downstream consumers read files directly:**
- The trip note writer (Step 5 subagent) reads the clipping files it needs
- Batch 2 subagents (country/region) receive file paths, read the relevant clippings themselves
- Batch 3 subagents (location notes) receive file paths to the relevant clippings
- Batch 4 subagents receive specific file paths (see Change 6)
- The orchestrator only passes file paths, never research content

**Bonus:** Research persists in the vault as browsable clippings, traceable back to sources. The trip note can link to them (e.g. `[[China October 2026 — Food Scene]]`).

### Change 5: Trip note as single source of truth for locations

After the trip note is written (Step 5), add a wikilink extraction step before dispatching any location subagents:

1. Read the written trip note.
2. Extract every `[[wikilink]]` using a grep/regex pattern.
3. Remove already-handled links using the **runtime names** the orchestrator already knows:
   - The country note name and region note name (from Batch 2 results)
   - The trip note's own name (e.g. `[[China October 2026]]`)
   - The fixed category link `[[Trips]]`
   - All 8 research clipping links (e.g. `[[China October 2026 — Food Scene]]`)
   - Any neighbourhood/area names from the Neighbourhoods research that were used as wikilinks in the Accommodation section — these are regions, not locations. The orchestrator can identify these because the trip note writer uses neighbourhood names from the `<Trip Name> — Neighbourhoods.md` clipping.
4. For each remaining link, infer its `create-location` type from context:
   - Links in restaurant/food bullet points → **Restaurants**
   - Links in accommodation section → **Hotel** or **Campsite** (based on surrounding text)
   - Links described as viewpoints, photo spots → **Photo Locations**
   - Links described as trails, hikes → **Trails**
   - Everything else (attractions, transport hubs, markets, museums, etc.) → **Other**
   - Any link that clearly is not a physical place (formatting artefacts like `[[Book]]` or `[[Maps.me]]`) is logged as a warning and skipped. The valid types are defined in `create-location/references/location-types.md`.
5. Check whether each remaining link already has a note in the vault (using Glob at `Travel/Locations/<Name>.md`). Remove any that already exist from the dispatch list — record them as `existing` for the Step 9 summary.
6. The remaining list — each entry carrying its name and inferred type — is the **authoritative location set** for Batch 3.

This eliminates Root Cause 1 entirely. Whatever the orchestrator linked in the trip note is exactly what gets a location note — no re-derivation, no divergence.

### Change 6: Sequential task execution with post-completion verification

Following the superpowers subagent-driven-development pattern, all tasks within a batch run sequentially where they touch the same file, and in parallel only where they are fully independent.

**Batch 3 — Location notes (sequential chunks of 10):**

1. Split the authoritative location list into groups of 10.
2. Dispatch each group as parallel subagents (they write to separate files, so no conflicts) and wait for **all** to complete before the next group.
3. Handle each subagent's status:
   - `DONE` / `DONE_WITH_CONCERNS` — record, proceed
   - `BLOCKED` — log warning, continue with remaining chunks
   - `NEEDS_CONTEXT` — provide context, re-dispatch once within the same chunk
4. Repeat until all locations are processed.

Chunk size of 10 keeps context pressure manageable while maintaining reasonable throughput. This is tunable — smaller chunks are safer but slower; larger chunks are faster but risk context compaction on very long trips.

**Batch 4 — Trip extras (sequential, each appends to trip note):**

Batch 4 runs concurrently with Batch 3 (they write to different files). Within Batch 4, agents run **sequentially** because each one appends a section to the same trip note:

1. Budget subagent → reads trip note + runs budget script, appends `## Budget` section
2. Packing subagent → reads trip note + `<Trip Name> — Weather.md` + `<Trip Name> — Practical Tips.md`, appends `## Packing List` section
3. Countdown subagent → reads trip note + `<Trip Name> — Visa & Entry.md` + `<Trip Name> — Practical Tips.md`, appends `## Pre-Trip Checklist` section

Each agent sees the current state of the trip note and appends. No content flows back to the orchestrator, no temp files, no merge conflicts.

**Expense tracking (after Batch 4 completes):**

After all Batch 4 agents finish, check whether `Categories/Expenses.base` exists in the vault. If not, invoke `obsidian:obsidian-bases` to create it. Add an expense tracker link to the trip note's `## Links` section. (Preserved from current SKILL.md Step 8.)

**Post-completion verification (after all batches finish):**

Do not trust subagent status reports alone. Independently verify by running a Glob check for every location in the authoritative list:

```
For each location in authoritative list:
  Glob: Travel/Locations/<Name>.md
  If file exists → verified
  If file missing despite DONE status → flag as "silent failure" in summary
  If file missing due to BLOCKED status → already logged
```

This is the last safety net. It catches silent failures that no status code protects against.

---

## Model Selection

Use the least powerful model that can handle each role to conserve cost and increase speed.

| Batch | Role | Complexity | Recommended model |
|-------|------|-----------|------------------|
| Batch 1 | Research agents | Web search + synthesis + judgment | `sonnet` |
| Batch 2 | Country/region note creators | Skill invocation with extracted data | `haiku` |
| Step 5 | Trip note writer | Creative itinerary planning, geographic grouping | `sonnet` |
| Batch 3 | Location note creators | Skill invocation + geocoding script | `haiku` |
| Batch 4 | Budget generator | Run script, append formatted output | `haiku` |
| Batch 4 | Packing list generator | Read weather data, generate and append checklist | `haiku` |
| Batch 4 | Countdown generator | Read visa/practical data, generate and append timeline | `haiku` |

The orchestrator itself runs at whatever model the user has selected — it does minimal work so model choice is less critical.

---

## Batch Flow (updated)

```
Step 1 — Load preferences (orchestrator)
Step 2 — Collect trip details (orchestrator)
  ↓
Batch 1 — Research (8 parallel background agents, model: sonnet)
  Each agent reads prompts/researcher.md template
  Each agent writes a clipping to Clippings/<Trip Name> — <Category>.md
  Each agent returns: status + file path
  ↓ wait for all, handle statuses

Batch 2 — Country note + Region note (2 parallel agents, model: haiku)
  Each agent reads prompts/country-creator.md or region-creator.md
  Each agent reads relevant clipping files, invokes existing skill
  Each agent returns: status + file path
  ↓ wait for both, handle statuses

Step 5 — Write trip note (subagent, model: sonnet)
  Reads prompts/trip-note-writer.md template
  Reads all 8 clipping files directly
  Writes trip note (itinerary, accommodation, links, notes sections)
  Returns: status + file path

Step 5b — Extract [[wikilinks]] → authoritative location list (orchestrator)
           Filter: remove country name, region name, trip note name,
                   [[Trips]], all 8 clipping links, neighbourhood names
           Infer type: from context (section, surrounding text)
           Skip: any link that is not a physical place (log warning)
           Skip: any link whose note already exists in vault (record as existing)
  ↓
  ├─ Batch 4 — Trip extras (sequential, concurrent with Batch 3) ─┐
  │   Each agent appends to trip note directly                      │
  │   1. Budget subagent (haiku): run script → append ## Budget     │
  │   2. Packing subagent (haiku): read Weather + Practical Tips    │
  │      clippings → append ## Packing List                         │
  │   3. Countdown subagent (haiku): read Visa + Practical Tips     │
  │      clippings → append ## Pre-Trip Checklist                   │
  │   Then: expense tracking (check/create Expenses.base,           │
  │         add link to trip note)                                   │
  │                                                                  │
  └─ Batch 3 — Location notes (sequential chunks of 10, model: haiku)
       Each agent reads prompts/location-creator.md template         │
       Each agent reads relevant clipping files, invokes skill       │
       Each agent returns: status + file path                        │
       Chunk 1: agents 1–10   → wait → handle statuses              │
       Chunk 2: agents 11–20  → wait → handle statuses              │
       ...                                                           │
                                        ↓ wait for all ←────────────┘

Post-completion verification (orchestrator)
  Glob check: does Travel/Locations/<Name>.md exist for every
  location in the authoritative list?
  Flag any silent failures.

Summary
  Report: created, existing, concerns, blocked, silent failures
```

**Orchestrator context throughout:** file paths, task status, location list with inferred types, status tracking. Never research content, never note content.

---

## File Structure (new and modified)

```
skills/plan-trip/
├── SKILL.md                              # REWRITE: lean coordinator logic only
├── prompts/                              # NEW: subagent prompt templates
│   ├── researcher.md                     # Batch 1
│   ├── country-creator.md                # Batch 2 (wraps create-country skill)
│   ├── region-creator.md                 # Batch 2 (wraps create-region skill)
│   ├── trip-note-writer.md               # Step 5
│   ├── location-creator.md              # Batch 3 (wraps create-location skill)
│   ├── budget-generator.md               # Batch 4
│   ├── packing-generator.md              # Batch 4
│   └── countdown-generator.md            # Batch 4
└── references/
    └── research-categories.md            # EXISTING: unchanged
```

---

## Scope

**In scope:**
- Rewrite `plan-trip/SKILL.md` as a pure coordinator following superpowers orchestration patterns
- Create 8 prompt templates in `skills/plan-trip/prompts/`
- All subagents use structured status reporting (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT)
- All subagents include self-review checklist before reporting
- Step 3 (Batch 1): research agents write Obsidian clippings with `author: ["[[Claude]]"]` and return file paths only
- Step 4 (Batch 2): country/region subagents receive file paths, read clippings, invoke existing skills
- Step 5 (trip note): dispatched as a subagent that reads clippings directly
- Step 5b (wikilink extraction): extract from written trip note, infer types from context, filter neighbourhoods
- Step 6 (Batch 3): dispatch location subagents in sequential chunks of 10
- Step 7 (Batch 4): sequential execution, each agent appends directly to trip note
- Expense tracking: preserved from current SKILL.md Step 8
- Post-completion verification: Glob check for all expected location notes
- Model selection guidance in SKILL.md for each batch
- Existing notes in the vault are detected before dispatch and skipped

**Out of scope:**
- Changes to `create-location`, `create-country`, or `create-region` skills (prompt templates wrap existing skills, not replace them)
- Changes to the trip note format or structure
- Changes to `references/research-categories.md`
- Any other plugins

---

## Success Criteria

- All `[[wikilinks]]` in a generated trip note that map to a valid `create-location` type (Photo Locations, Restaurants, Hotel, Campsite, Trails, Other) have corresponding Obsidian location notes after the skill completes; links identified as non-location artefacts are logged as warnings and excluded from this requirement
- Notes that already exist in the vault are not re-created or overwritten — they are recorded as `existing` in the summary
- No "not created yet" tooltips in Obsidian for locations linked in the itinerary or accommodation sections
- Research clippings are persisted in `Clippings/` with `author: ["[[Claude]]"]`, list-format `source` URLs, and `topics` linking to the destination
- The orchestrator's context never contains raw research content — only file paths and task status
- Every subagent returns a structured status (DONE / DONE_WITH_CONCERNS / BLOCKED / NEEDS_CONTEXT) — no unstructured returns
- Post-completion verification independently confirms all location notes exist on disk
- The summary includes counts for: created, existing, concerns, blocked, and silent failures
- All 8 prompt templates exist in `skills/plan-trip/prompts/` and follow the standardised template structure
- Expense tracking is preserved: `Expenses.base` is created if missing, link added to trip note
- Batch 4 agents append sections sequentially to the trip note without file conflicts
