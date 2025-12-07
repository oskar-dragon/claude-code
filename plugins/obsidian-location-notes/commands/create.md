---
name: create
description: Create a location note in Obsidian with automated research and accurate coordinates
argument-hint: <location-name>
allowed-tools: ["AskUserQuestion", "Task", "Read"]
---

# Create Obsidian Location Note

Create a comprehensive location note in the user's Obsidian vault with automated research, accurate GPS coordinates, and template-specific information.

## Command Arguments

The command accepts a location name as argument:

```
/obsidian-loc:create "Eiffel Tower, Paris"
/obsidian-loc:create "Trolltunga Camping Norway"
```

If no argument is provided, ask the user for the location name.

## Execution Process

Follow these steps to create a location note:

### Step 1: Get Location Name

If the user didn't provide a location name as an argument, ask for it:

```
What location would you like to create a note for?
Example: "Eiffel Tower, Paris" or "Yosemite Tunnel View"
```

### Step 2: Select Template Type

Use the AskUserQuestion tool to ask which template type to use. Present these 4 options:

**Question:** "What type of location note do you want to create?"

**Options:**
1. **Accommodation/Campsite** - Places to stay, camping spots, lodging
   - Description: "Research accommodation details, amenities, and camping information"

2. **Photo Location** - Photography spots, scenic viewpoints
   - Description: "Research photography tips, best times, camera settings, and composition advice"

3. **Food/Restaurant** - Dining locations, restaurants, food markets
   - Description: "Research cuisine type, specialties, dining details, and culinary information"

4. **General Location** - Landmarks, museums, parks, other points of interest
   - Description: "Research general location information, history, and visitor details"

### Step 3: Verify Plugin Settings

Before launching the research agent, check if plugin settings exist:

1. Read the file `.claude/obsidian-location-notes.local.md`
2. If file doesn't exist, inform the user:
   ```
   Plugin settings not found. Please create `.claude/obsidian-location-notes.local.md` with:

   ---
   vault_path: /path/to/your/obsidian/vault
   notes_folder: Locations
   ---
   ```
3. If file exists, parse the frontmatter to get `vault_path` and `notes_folder`
4. Verify the vault path exists on the file system

### Step 4: Launch Appropriate Research Agent

Based on the template selection, use the Task tool to launch the corresponding agent:

**If Accommodation/Campsite selected:**
```
Launch agent: accommodation-researcher
Prompt: "Research and create an accommodation note for: {location_name}

The note should be created at: {vault_path}/{notes_folder}/{sanitized-location-name}.md

Include:
- Complete research on accommodation/campsite details
- Accurate GPS coordinates
- Travel and parking information
- Amenities and facilities
- Representative image URL"
```

**If Photo Location selected:**
```
Launch agent: photo-location-researcher
Prompt: "Research and create a photo location note for: {location_name}

The note should be created at: {vault_path}/{notes_folder}/{sanitized-location-name}.md

Include:
- Photography-specific research (best times, settings, tips)
- Accurate GPS coordinates
- Composition and technique advice
- Access information for photographers
- Example/inspiration image URL"
```

**If Food/Restaurant selected:**
```
Launch agent: food-location-researcher
Prompt: "Research and create a food location note for: {location_name}

The note should be created at: {vault_path}/{notes_folder}/{sanitized-location-name}.md

Include:
- Cuisine type and specialties
- Accurate GPS coordinates
- Dining details and atmosphere
- Access and parking information
- Food image URL"
```

**If General Location selected:**
```
Launch agent: general-location-researcher
Prompt: "Research and create a general location note for: {location_name}

The note should be created at: {vault_path}/{notes_folder}/{sanitized-location-name}.md

Include:
- General location information and history
- Accurate GPS coordinates
- Visitor and travel information
- Significance and features
- Representative image URL"
```

### Step 5: File Name Sanitization

When constructing the file path, sanitize the location name:

- Remove special characters (keep letters, numbers, spaces, hyphens)
- Replace spaces with hyphens
- Convert to lowercase
- Remove leading/trailing hyphens

**Examples:**
- "Eiffel Tower, Paris" → "eiffel-tower-paris.md"
- "Yosemite - Tunnel View!" → "yosemite-tunnel-view.md"
- "Noma (Copenhagen)" → "noma-copenhagen.md"

## Agent Responsibilities

The research agent will:

1. Load necessary skills (obsidian-formatting, coordinate-lookup)
2. Research comprehensive information via web search
3. Find accurate GPS coordinates (using coordinate-finder agent)
4. Gather template-specific details
5. Find representative images (URL only)
6. Create the Obsidian note file with proper formatting
7. Report success or errors back to the user

## Error Handling

**Settings file missing:**
- Inform user how to create `.claude/obsidian-location-notes.local.md`
- Provide example configuration

**Vault path doesn't exist:**
- Inform user the configured vault path is invalid
- Ask them to verify the path in settings

**Agent reports coordinate failure:**
- The agent should handle this by requesting manual input
- Do not intervene, let agent complete the process

**File already exists:**
- Agent should check and either overwrite or create versioned name
- Inform user of the decision

## Success Confirmation

After the agent completes, confirm with the user:

```
✓ Created {template-type} note for "{location_name}"
  Location: {vault_path}/{notes_folder}/{filename}
  Coordinates: [lat, lon]
  Source: {research_source}

The note is ready in your Obsidian vault!
```

## Important Notes

- DO NOT attempt to create the note yourself - delegate to the research agent
- DO NOT skip the template selection step
- DO ensure settings are configured before launching agent
- DO let the coordinate-finder agent handle coordinate failures
- DO sanitize file names to avoid filesystem issues

## Tips for Users

Suggest these tips when appropriate:

- Include city/country in location name for better research accuracy
- For accommodations: Specify type (campsite, hotel, etc.)
- For photos: Mention the viewpoint or specific spot if known
- For food: Include restaurant name or market name
- For general: Be specific (e.g., "Colosseum Rome" not just "Colosseum")

---

This command orchestrates the location note creation workflow, delegating research and note generation to specialized agents while ensuring proper configuration and user guidance.
