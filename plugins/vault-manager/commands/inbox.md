---
description: COD Organise phase — scan for unprocessed items, route to proper locations, create tasks for actionable items
---

Execute the COD Organise phase for Oskar's vault. Use the productivity-system skill for methodology (COD Organise, ZeroInbox 2.0) and the todoist-workflow skill for task creation.

## Step 1: Scan for Unprocessed Items

Search for items that need routing:

- **Recent journal entries**: Check `Journal/` for entries from the last few days that haven't been referenced in daily notes or routed elsewhere
- **Todoist inbox**: Use Todoist MCP to check for unprocessed inbox items (tasks without projects or dates)
- **Unfiled notes**: Check vault root and common folders for notes missing `categories` frontmatter property

Present the list of unprocessed items to Oskar.

## Step 2: Propose Routing

For each unprocessed item, propose where it should go:

- Which folder (Projects/, Goals/, Notes/, References/, etc.)
- Which template to apply (read the template first to understand its frontmatter)
- What `categories`, `type`, `topics`, and other properties to set
- Which existing notes to link via wikilinks

Apply ZeroInbox 2.0 logic:
- **Trash**: Flag items that appear irrelevant or outdated for Oskar's confirmation
- **Archive**: Route reference items to proper locations
- **Action This Day**: Identify actionable items for Todoist

## Step 3: Confirm with Oskar

Present routing decisions in batches. Ask Oskar to confirm or adjust:

- Use AskUserQuestion for quick confirmations
- Allow overrides on any routing decision
- If many items, batch into groups of 3-5 for review

## Step 4: File Items

For each confirmed routing:

- Move or create notes in the correct folder
- Apply template frontmatter (read the template first)
- Set `categories`, `type`, `topics`, and other properties with wikilinks
- Add wikilinks to related notes
- Preserve any existing content

## Step 5: Create Todoist Tasks

For actionable items identified in Step 2:

- Create Todoist tasks with appropriate dates and priorities
- Include deep links to relevant Obsidian notes in task descriptions
- Assign to Todoist projects where applicable

## Step 6: Update Memory

Save any new conventions discovered during routing to auto memory:

- New routing patterns Oskar confirmed
- Preferences for how certain types of items should be handled
- Any corrections to existing conventions
