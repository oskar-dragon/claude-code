---
description: This skill should be used when the user asks to "plan my day", "do morning planning", "daily plan", "review yesterday", "set priorities", or wants to start their morning planning routine with 2+8 prioritisation.
version: "2.0.0"
---

Execute Oskar's morning planning routine. Use the todoist-workflow skill for task management.

## Step 1: Review Yesterday

Read yesterday's daily note from `Daily/` folder (filename format: YYYY-MM-DD.md).

- Note unfinished items and carryover tasks
- Summarise what was accomplished
- If no daily note exists for yesterday, note this and move on

## Step 2: Review Recent Journal Entries

Find journal entries in `Journal/` created since the last daily plan:

- Use Glob to find files matching `Journal/YYYY-MM-DD*` for recent days
- Read each fragment and identify key themes, insights, and actionable items
- This is the Fractal Journaling daily compilation step — capture salient thoughts

## Step 3: Pull Todoist Tasks

Use Todoist MCP tools to get today's task overview:

- Get overview of today's tasks
- Find tasks due today and any overdue items
- Note tasks linked to projects or goals (check for obsidian:// deep links in descriptions)

## Step 4: Present Summary and Set Priorities

Present to Oskar:

- Yesterday's carryover items
- Key themes from journal fragments
- Today's Todoist tasks
- Any relevant goal or project updates

Then ask Oskar to select today's **2+8 priorities**:

- **2 must-do objectives** (non-negotiable today)
- **8 important-but-reschedulable tasks**

Use AskUserQuestion for structured input if helpful, or discuss conversationally.

## Step 5: Create or Update Daily Note

Read the [daily-template.md](daily-template.md) template to understand the daily note format.

Create today's daily note (`Daily/YYYY-MM-DD.md`) or update if it already exists:

- Preserve the template's frontmatter (`tags: [daily-notes]`)
- Add a "## Priorities" section with the 2+8 selections
- Add a "## Carryover" section if there are items from yesterday
- Add a "## Journal Highlights" section with salient themes from fragments
- Keep the `![[Daily.base]]` embed from the template

## Step 6: Create Todoist Tasks

For any new actionable items identified during planning:

- Create Todoist tasks with appropriate dates and priorities
- Include deep links to relevant Obsidian notes in task descriptions
- Deep link format: `obsidian://open?vault=Vault%20V2&file=<URL-encoded-path>`

## Step 7: Update Memory

Save any new insights, conventions, or decisions discovered during planning to auto memory files as appropriate.
