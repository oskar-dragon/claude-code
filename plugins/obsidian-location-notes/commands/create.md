---
name: create
description: Create a location note in Obsidian with automated research and accurate coordinates
argument-hint: <location-name>
---

# Create Obsidian Location Note

You are creating a comprehensive location note in the user's Obsidian vault with automated research, accurate GPS coordinates, and template-specific information.

## Step 1: Get Location Name

Location from arguments: $ARGUMENTS

If no location was provided, ask the user:
"What location would you like to create a note for? (e.g., 'Eiffel Tower, Paris' or 'Yosemite Tunnel View')"

## Step 2: Select Template Type

Use the AskUserQuestion tool to determine which template type to use:

**Question:** "What type of location note do you want to create for [location name]?"

**Options:**

1. **Photo Location**
   - Description: "Research photography tips, best times, camera settings, and composition advice"

2. **Accommodation/Campsite**
   - Description: "Research accommodation details, amenities, and camping information"

3. **Food/Restaurant**
   - Description: "Research cuisine type, specialties, dining details, and culinary information"

4. **General Location**
   - Description: "Research general location information, history, and visitor details"

## Step 3: Verify Plugin Settings

Read the plugin settings file: `~/.claude/obsidian-location-notes.local.md`

**If file doesn't exist:**
- Inform user: "Plugin settings not found. I'll create the configuration file for you."
- Ask user: "What is the full path to your Obsidian vault?"
- Ask user: "What folder in your vault should location notes be saved to?"
- Create `~/.claude/obsidian-location-notes.local.md` with:
  ```
  ---
  vault_path: [user's vault path]
  notes_folder: [user's folder name]
  ---
  ```

**If file exists:**
- Parse the frontmatter to extract `vault_path` and `notes_folder`
- Verify the vault path exists using a bash command
- If path doesn't exist, inform user and ask for correct path

## Step 4: Sanitize File Name

Convert the location name to a valid filename:
- Remove special characters (keep letters, numbers, spaces, hyphens)
- Replace spaces with hyphens
- Convert to lowercase
- Remove leading/trailing hyphens

**Examples:**
- "Eiffel Tower, Paris" → "eiffel-tower-paris"
- "Old Man of Storr on Isle of Skye" → "old-man-of-storr-on-isle-of-skye"
- "Yosemite - Tunnel View!" → "yosemite-tunnel-view"

## Step 5: Launch Research Agent

Based on the template selection, use the Task tool to launch the appropriate agent.

**Construct the full file path:**
```
{vault_path}/{notes_folder}/{sanitized-filename}.md
```

**Agent invocation based on template type:**

### If Photo Location:
```
Use Task tool with:
- subagent_type: "obsidian-location-notes:photo-location-researcher"
- prompt: "Research and create a comprehensive photo location note.

LOCATION: {full location name}
FILE PATH: {vault_path}/{notes_folder}/{sanitized-filename}.md

Your task:
1. Research photography-specific information (best times, camera settings, composition tips)
2. Find accurate GPS coordinates
3. Gather travel and access information for photographers
4. Find example/inspiration images
5. Create a properly formatted Obsidian note at the file path above

The note MUST include:
- Complete YAML frontmatter with all required fields
- Detailed photography tips section
- Travel information section
- Properly formatted Mapview block
- Image display using Dataview

DO NOT just describe what you would do - actually create the file using the Write tool."
```

### If Accommodation/Campsite:
```
Use Task tool with:
- subagent_type: "obsidian-location-notes:accommodation-researcher"
- prompt: "Research and create a comprehensive accommodation location note.

LOCATION: {full location name}
FILE PATH: {vault_path}/{notes_folder}/{sanitized-filename}.md

Your task:
1. Research accommodation/campsite details, amenities, facilities
2. Find accurate GPS coordinates
3. Gather booking and travel information
4. Find representative images
5. Create a properly formatted Obsidian note at the file path above

The note MUST include:
- Complete YAML frontmatter with all required fields
- Detailed description section
- Amenities and facilities section
- Travel information section
- Properly formatted Mapview block
- Image display using Dataview

DO NOT just describe what you would do - actually create the file using the Write tool."
```

### If Food/Restaurant:
```
Use Task tool with:
- subagent_type: "obsidian-location-notes:food-location-researcher"
- prompt: "Research and create a comprehensive food location note.

LOCATION: {full location name}
FILE PATH: {vault_path}/{notes_folder}/{sanitized-filename}.md

Your task:
1. Research cuisine type, specialties, and dining details
2. Find accurate GPS coordinates
3. Gather hours, pricing, and reservation information
4. Find food/restaurant images
5. Create a properly formatted Obsidian note at the file path above

The note MUST include:
- Complete YAML frontmatter with all required fields
- Detailed description and specialties section
- Dining details section
- Travel information section
- Properly formatted Mapview block
- Image display using Dataview

DO NOT just describe what you would do - actually create the file using the Write tool."
```

### If General Location:
```
Use Task tool with:
- subagent_type: "obsidian-location-notes:general-location-researcher"
- prompt: "Research and create a comprehensive general location note.

LOCATION: {full location name}
FILE PATH: {vault_path}/{notes_folder}/{sanitized-filename}.md

Your task:
1. Research location information, history, and significance
2. Find accurate GPS coordinates
3. Gather visitor information and access details
4. Find representative images
5. Create a properly formatted Obsidian note at the file path above

The note MUST include:
- Complete YAML frontmatter with all required fields
- Detailed description section
- Visitor information section
- Travel information section
- Properly formatted Mapview block
- Image display using Dataview

DO NOT just describe what you would do - actually create the file using the Write tool."
```

## Step 6: Wait for Agent Completion

The research agent will autonomously:
- Perform web research
- Find accurate coordinates
- Gather template-specific information
- Create the Obsidian note file
- Report results

## Step 7: Confirm Success

After the agent completes, verify the note was created and inform the user:

```
✓ Created [template-type] note for "[location name]"
  Location: {vault_path}/{notes_folder}/{filename}

The note is ready in your Obsidian vault!
```

---

**Important:**
- Let the research agent do all the work - don't try to create the note yourself
- Pass the complete file path to the agent
- Ensure the agent knows it must actually use the Write tool, not just describe what to do
