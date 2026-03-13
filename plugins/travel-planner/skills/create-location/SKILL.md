---
name: create-location
description: This skill should be used when the user asks to "create a location note", "add a place to Obsidian", "make a note for this restaurant/hotel/campsite/trail/photo spot", "research a location", or wants to add any point of interest to their Obsidian vault. Creates researched location notes with geocoding, correct type-specific formatting, and Obsidian integration.
version: 0.1.0
---

## Purpose

Create a single location note in the Obsidian vault at `/Users/oskardragon-work/workspaces/obsidian/`. Save the note to `Travel/Locations/<Name>.md` unless a more specific path is provided.

## Workflow

### 1. Determine Location Type

Identify the location type from the user's request. Valid types:

- Photo Locations
- Restaurants
- Hotel
- Campsite
- Trails
- Other

If the type is not clear from context, ask the user before proceeding.

### 2. Read the Vault Template

Read `/Users/oskardragon-work/workspaces/obsidian/Templates/Place Template.md` to understand the expected note structure before assembling the output.

### 3. Check for Existing Note

Use the Glob tool to check whether a note already exists at the target path. If a file is found, warn the user and ask for explicit confirmation before overwriting.

### 4. Research the Location

**If invoked by `plan-trip`:** research data is provided in the prompt. Use that data and skip web search. If an `Image URL:` line is present in the research data, use that URL to populate the `image` frontmatter field. If absent, leave `image` empty.

**If invoked standalone:** research the location via web search. Collect:

- Description of the place
- Address or access instructions
- Opening hours (if applicable)
- Key highlights
- Minimum 3 sources (URLs)

### 5. Geocode Coordinates

Run:

```bash
bun run $CLAUDE_PLUGIN_ROOT/scripts/geocode.ts "<location name>" "<country>"
```

Use the returned latitude and longitude in the `coordinates` field. If geocoding fails, leave `coordinates` empty — do not invent values.

### 6. Assemble the Note

Build the note using the template structure. Apply type-specific icon and color from `references/location-types.md`. Do NOT add a `tags` field — it is not part of the frontmatter template.

Field rules:

- Always use YAML list format for `categories`, `type`, `location`, `coordinates`, and `source`
- Leave `image` empty if no image URL is found; do not invent images
- Set `created` to today's date in `YYYY-MM-DD` format
- Set `visited: false`
- Only include frontmatter fields listed in `references/location-types.md`. Do NOT add `tags`, `aliases`, or any other fields not in the template.

### 7. Apply Obsidian Formatting

Invoke the `obsidian:obsidian-markdown` skill to apply correct Obsidian-specific formatting:

- Wikilink syntax in frontmatter (must be quoted, e.g. `'[[Country]]'`)
- Dataview expressions
- Any other Obsidian-specific conventions

### 8. Write the Note

Write the assembled note to the target path in the vault.

## Reference

See `references/location-types.md` for the full mapping of location type → icon, color, and optional sections.

## Notes

- Always use list format for `categories`, `type`, `location`, `coordinates`, and `source` fields (YAML arrays)
- Wikilinks in frontmatter must be quoted: `'[[Country]]'` — use `obsidian:obsidian-markdown` skill for correct syntax
- Leave `image` empty if no image URL is found; do not invent images
- Only include frontmatter fields listed in `references/location-types.md` — do not add `tags`, `aliases`, or other fields
