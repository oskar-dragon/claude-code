---
name: inbox
description: This skill should be used when the user asks to "process my inbox", "organise inbox", "clean up inbox", "zero inbox", or wants to process unprocessed items using the COD Organise phase.
version: "1.0.0"
---

Execute the COD Organise phase for Oskar's inbox. Use the productivity-system skill for methodology (COD workflow, ZeroInbox principle) and the todoist-workflow skill for task management.

This is the systematic processing of all unprocessed items (notes, emails, tasks, files) into their proper locations.

## Step 1: Identify Unprocessed Items

Scan common inbox locations for unprocessed items:

- **Todoist inbox**: Use `find-tasks` with `projectId: "inbox"`
- **Obsidian inbox folder**: Check for unprocessed notes in `Inbox/` folder
- **Desktop and Downloads**: Ask Oskar if there are files to process
- **Other inboxes**: Ask Oskar if there are other locations to check (email, Slack, physical inbox, etc.)

## Step 2: Process Each Item

For each unprocessed item, determine:

1. **What is it?** Understand the item
2. **Is it actionable?** Does it require action from Oskar?
3. **Where does it belong?** What's the proper location or next step?

Use the COD decision tree:

- **Not actionable + no future value**: Delete or archive
- **Not actionable + reference value**: File in appropriate Obsidian folder with proper wikilinks
- **Actionable + takes <2 minutes**: Ask Oskar if they want to do it now or defer
- **Actionable + takes >2 minutes**: Create Todoist task or add to existing project

## Step 3: Route to Proper Locations

Based on the decision for each item:

### For Reference Items (Non-Actionable)

- Move Obsidian notes from `Inbox/` to appropriate folders (`Resources/`, `People/`, etc.)
- Add proper frontmatter and wikilinks
- Link to relevant projects, goals, or areas

### For Actionable Items

Create Todoist tasks with:

- Clear action-oriented task name
- Appropriate Time Sector bucket (THIS WEEK, NEXT WEEK, THIS MONTH, LONG TERM)
- Due date if time-sensitive
- Labels based on context
- Deep link to related Obsidian note if applicable

For tasks related to existing projects:

- Add the task to the project note's `## Tasks` section — the project note is the source of truth
- If the project has a project-reference task in Todoist, no additional Todoist task is needed unless it's a specific time-bound action

## Step 4: Archive Processed Inbox Items

After processing each item:

- Delete from Todoist inbox (complete or move to appropriate project)
- Move or delete from Obsidian inbox folder
- Clear desktop/downloads if applicable

Goal is ZeroInbox — all items processed and routed.

## Step 5: Present Summary

Show Oskar:

- Total items processed
- Items deleted/archived
- Reference items filed (with new locations)
- Actionable items created (with Todoist links)
- Any items requiring follow-up or clarification

## Step 6: Update Memory

Save any new insights, conventions, or processing patterns to auto memory.
