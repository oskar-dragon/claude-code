---
name: meeting
description: This skill should be used when the user asks to "process a meeting", "transcribe a meeting", "create meeting notes", "extract action items", or has a SuperWhisper transcript to process into a structured meeting note.
version: "2.0.0"
---

Process a meeting recording transcript into a structured meeting note. Use the todoist-workflow skill for task creation and deep links.

## Step 1: Find Transcript

If a transcript path was provided as argument ($ARGUMENTS), use that file.

Otherwise, find the latest transcript in `~/Documents/superwhisper/`:

- List JSON files sorted by modification time
- If multiple recent transcripts exist (within last 24 hours), ask Oskar which one to process
- Use AskUserQuestion to present options

## Step 2: Parse Transcript

Read the JSON transcript file and extract:

- The full transcript text
- Any metadata (timestamps, duration, date)
- Speaker identification if available

## Step 3: Gather Meeting Context

Ask Oskar (or infer from transcript content):

- Who attended the meeting
- Which project this relates to (if any)
- Meeting type — use AskUserQuestion with options:
  - Work meeting (uses [qogita-meeting-template.md](qogita-meeting-template.md))
  - General meeting (uses [meeting-template.md](meeting-template.md))
  - Other (specify)

## Step 4: Create Meeting Note

Read the appropriate meeting template first to understand its frontmatter structure.

Create the meeting note in the appropriate location:

- Filename: Include date and meeting topic (e.g., `2026-02-15 Sprint Planning.md`)
- Set frontmatter from template:
  - `categories: ["[[Meetings]]"]`
  - `date`: meeting date
  - `organization`: if work meeting
  - `people`: attendees as array
  - `topics`: relevant topics as wikilinks
- Body: structured summary of the meeting

## Step 5: Extract Structured Content

From the transcript, identify and organize:

- **Decisions made**: Key decisions with context
- **Action items**: Specific tasks assigned to people with deadlines
- **Key discussion points**: Important topics discussed
- **Follow-ups**: Items needing future attention

Write these as sections in the meeting note.

## Step 6: Create Todoist Tasks

For each action item extracted:

- Create a Todoist task with the action item as the task name
- Include deep link to the meeting note in the task description
- Set due dates based on discussed timelines (ask Oskar if unclear)
- Assign to relevant Todoist project if applicable

## Step 7: Link to Related Notes

Add wikilinks in the meeting note to:

- Related project notes in Projects/
- People notes (if they exist)
- Previous meetings on the same topic
- Relevant goal notes
