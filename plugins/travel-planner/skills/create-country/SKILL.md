---
name: create-country
description: This skill should be used when the user asks to "create a country note", "add a country to Obsidian", "research a country for travel", "add country travel information", or when a trip destination needs a country note with visa, currency, safety, and airport information. Creates or updates country notes in the Obsidian vault.
version: 0.1.0
---

## Purpose

Create or update a country note in `/Users/oskardragon-work/workspaces/obsidian/Travel/Countries/<Country Name>.md`.

---

## Workflow

### 1. Check for an existing note

Use the Glob tool to search for `Travel/Countries/<Country Name>.md` in the vault.

- **If found:** update only the Travel Information sub-sections with fresh research. Do not recreate the entire note.
- **If not found:** proceed to create a new note following the full workflow below.

### 2. Read the vault template

Read `/Users/oskardragon-work/workspaces/obsidian/Templates/Country Template.md` to pick up any vault-specific formatting conventions before writing the note.

### 3. Research the country

Research the country across the 5 categories defined in `references/country-sections.md`:

1. Best Time to Visit
2. Visa Requirements
3. Currency & Prices
4. Safety
5. Airport

Use web search to gather current, accurate information. If this skill was invoked by the `plan-trip` skill and pre-provided research data was supplied, use it as the primary source and supplement any gaps with additional web searches.

### 4. Geocode the country

Run:

```
bun run $CLAUDE_PLUGIN_ROOT/scripts/geocode.ts "<Country Name>"
```

Use the returned latitude and longitude in the frontmatter.

### 5. Assemble the note

Build the note with the following structure in order:

**Frontmatter:**

```yaml
categories:
  - "[[Places]]"
type:
  - "[[Countries]]"
coordinates:
  - "<latitude>"
  - "<longitude>"
created: YYYY-MM-DD
color: gray
icon: earth
```

Note: do NOT include a `location` field — countries are top-level and do not have a parent location.

**Body sections:**

```markdown
## Trips

![[Trips.base#Location]]

## Places

![[Map.base#Location]]

![[Places.base#Location]]

## Description

<2-3 paragraph overview of the country for travellers: geography, culture, general character, and why people visit>

## Travel Information

### Best Time to Visit

<content per references/country-sections.md>

### Visa Requirements

<content per references/country-sections.md>

### Currency & Prices

<content per references/country-sections.md>

### Safety

<content per references/country-sections.md>

### Airport

<content per references/country-sections.md>

## Useful Links

- [Official Tourism Site](<url>)
- [Visa Application Portal](<url>)
- [FCDO Travel Advice](<url>)
```

### 6. Apply Obsidian formatting

Invoke the `obsidian:obsidian-markdown` skill to ensure the note follows vault formatting conventions before writing.

### 7. Write the note

Write the assembled note to `/Users/oskardragon-work/workspaces/obsidian/Travel/Countries/<Country Name>.md`.

---

## Reference

See `references/country-sections.md` for the full specification of what to research and how to structure each Travel Information sub-section.
