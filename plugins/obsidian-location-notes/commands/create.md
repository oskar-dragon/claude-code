---
description: Create a location note in Obsidian with automated research and accurate coordinates
argument-hint: <location-name-or-url> [--type food|photo|accommodation|general]
allowed-tools: Read, Write, Bash, WebSearch, WebFetch, Grep, Task, AskUserQuestion
---

Create a comprehensive location note in your Obsidian vault for: **$ARGUMENTS**

## Workflow

**Step 1: Load Configuration**

Read the plugin configuration from `.claude/obsidian-location-notes.local.md` to get:
- Vault path (required)
- Save location within vault

If configuration file missing or vault_path not set, inform user they need to create configuration file with vault_path field.

**Step 2: Determine Location Type**

If `--type` flag provided in arguments, use that type.
Otherwise, ask user to select location type using AskUserQuestion:
- General (landmarks, POIs, attractions)
- Food (restaurants, cafes, dining)
- Photo Location (photography spots)
- Accommodation (campsites, hotels, lodging)

**Step 3: Parse Input**

Determine if input is:
- URL (starts with http:// or https://)
- File path (ends with .pdf or contains file system path)
- Location name (anything else)

**Step 4: Launch Parallel Research**

Use Task tool to launch TWO agents IN PARALLEL (single message with multiple Task calls):

1. **Research Agent** (based on location type selected):
   - `general-location-researcher` for General
   - `food-location-researcher` for Food
   - `photo-location-researcher` for Photo Location
   - `accommodation-researcher` for Accommodation

   Provide to agent:
   - Location input (name, URL, or PDF path)
   - Expected research fields based on template type
   - Instruction to gather minimum 5 sources

2. **Coordinate Finder Agent**:
   - `coordinate-finder`
   - Provide location name
   - Agent will use OpenStreetMap Nominatim API
   - Returns [latitude, longitude] or null if not found

**Step 5: Wait for Agent Results**

Both agents will return their results. Coordinate finder may return null if coordinates unavailable (acceptable).

**Step 6: Assemble Note**

Select appropriate template from:
- `${CLAUDE_PLUGIN_ROOT}/templates/general-location.md` for General
- `${CLAUDE_PLUGIN_ROOT}/templates/food.md` for Food
- `${CLAUDE_PLUGIN_ROOT}/templates/photo-location.md` for Photo Location
- `${CLAUDE_PLUGIN_ROOT}/templates/accommodation.md` for Accommodation

Read the template using Read tool.

Fill template with research results:
- **Country**: Wikilink format `'[[Country Name]]'`
- **Region**: Wikilink format `'[[Region Name]]'`
- **location**: Array `[latitude, longitude]` from coordinate finder (omit if null)
- **Source**: Array of URLs from research
- **image**: URL or wikilink from research
- **tags**: Appropriate tag for type (map/food, map/photo-location, map/accommodation/campsite, map/other)
- **Description**: Detailed information from research
- **Travel Information**: Directions, parking, accessibility from research
- **Type-specific fields**: best_time for photo locations, etc.

Use location name as note title and filename (e.g., "Old Man of Storr.md").

**Step 7: Create Note File**

Write note to: `<vault_path>/<save_location>/<Location Name>.md`

Use Write tool to create the file.

**Step 8: Validate Note**

Launch the `note-validator` agent using Task tool to:
- Verify all required fields are populated
- Check YAML frontmatter syntax
- Confirm template structure followed
- Validate coordinate format (if present)

The validator will report issues and ask if they should be fixed.

**Step 9: Report Success**

Inform user:
- Note created successfully at file path
- Summary of information included
- Any warnings (e.g., coordinates not found, images not available)
- Validation results

## Important Notes

- Load obsidian-formatting skill if working with Obsidian-specific syntax
- Load coordinate-lookup skill if troubleshooting geolocation
- Respect rate limits when calling Nominatim API (1 req/second)
- Source URLs must be in frontmatter Source array
- Wikilinks in frontmatter must be quoted: `'[[Page]]'`
- Location coordinates as array: `[lat, lon]`
- Gracefully handle missing data (coordinates, images)
- Show user progress as agents work
