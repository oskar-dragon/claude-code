---
name: create-region
description: This skill should be used when the user asks to "create a region note", "add a region to Obsidian", "add an area note", "create a note for this area/city/region", or when a trip needs a region or geographic area note linked to a parent country. Creates lightweight region notes in the Obsidian vault with Base embeds for trips and places.
version: 0.1.0
---

## Purpose

Create a region or area note in the Obsidian vault at `/Users/oskardragon-work/workspaces/obsidian/Travel/Regions/<Region Name>.md`. Regions are lightweight organisational nodes — their content is mostly driven by Obsidian Base embeds that dynamically pull in linked trips and places.

## Workflow

### 1. Check existence first

Use the Glob tool to search for `Travel/Regions/<Region Name>.md` or `**/<Region Name>.md` in the vault. If the file is found, skip creation entirely — regions are minimal and don't need updating.

### 2. Read vault template

Read the template from `/Users/oskardragon-work/workspaces/obsidian/Templates/Region Template.md` to confirm any vault-specific structure before writing.

### 3. Geocode the region

Run the geocode script to get coordinates:

```bash
bun run $CLAUDE_PLUGIN_ROOT/scripts/geocode.ts "<Region Name>" "<Country Name>"
```

Use the returned latitude and longitude in the frontmatter.

### 4. Assemble the note

Build the note with:

- **Frontmatter** (see format below)
- **`## Trips`** section containing: `![[Trips.base#Location]]`
- **`## Places`** section containing: `![[Map.base#Location]]` and `![[Places.base#Location]]`
- **`## Description`** section (optional) — add 1–2 sentences if useful context about the region is available

### 5. Format for Obsidian

Invoke the `obsidian:obsidian-markdown` skill to ensure correct Obsidian formatting before writing.

### 6. Write the note

Write the assembled note to `/Users/oskardragon-work/workspaces/obsidian/Travel/Regions/<Region Name>.md`.

## Frontmatter Format

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

The `location` field links to the parent country note. Regions do not use `icon` or `color` fields.
