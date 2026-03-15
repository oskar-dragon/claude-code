---
name: meeting-notes
description: Process unprocessed Superwhisper meeting recordings into structured Obsidian notes. Queries the Superwhisper SQLite database for Meeting-mode recordings, infers metadata (title, people, organization, topics) from each transcript, asks the user to confirm before saving. Use when the user says "meeting notes", "process meetings", "transcribe meetings", "superwhisper meetings", or wants to convert recorded meeting transcripts into vault notes.
allowed-tools:
  - Bash
  - Skill
  - AskUserQuestion
---

# Meeting Notes — Process Superwhisper Recordings

Convert unprocessed Superwhisper meeting recordings into structured Obsidian notes, one at a time with user confirmation of metadata before saving.

## Step 1: Get vault path

```bash
obsidian eval code="app.vault.adapter.basePath"
```

Store this as `$VAULT_PATH`. All file operations use this as the root.

## Step 2: Load processed IDs

Read the tracking file — one recording ID per line:

```bash
cat "$VAULT_PATH/References/.superwhisper-processed" 2>/dev/null || echo ""
```

## Step 3: Query unprocessed meetings

Recording IDs are stored as binary blobs in SQLite — use `hex()` to get stable string representations:

```bash
sqlite3 "$HOME/Library/Application Support/superwhisper/database/superwhisper.sqlite" \
  "SELECT hex(r.id), r.datetime, r.duration, f.c3
   FROM recording r
   JOIN recording_fts ON recording_fts.recordingId = hex(r.id)
   JOIN recording_fts_content f ON f.id = recording_fts.rowid
   WHERE r.modeName = 'Meeting'
   ORDER BY r.datetime ASC"
```

Filter out any recording whose hex ID is already in the processed list.

If nothing remains: tell the user "No new meeting recordings to process." and stop.

Otherwise show the user what you found:
```
Found 3 unprocessed meeting recordings:
1. 2026-03-10 14:32 — 45 min
2. 2026-03-12 09:15 — 28 min
3. 2026-03-15 11:59 — 20 min

Processing them oldest-first...
```

## Step 4: Process each recording

For each unprocessed recording, in chronological order:

### 4a. Infer metadata from transcript

Read the full transcript (`f.c3` — the LLM-processed version) and extract:

- **Title**: what was this meeting about? A short descriptive name (not generic like "Meeting")
- **Date**: from the recording datetime (YYYY-MM-DD)
- **Duration**: in minutes, rounded
- **People**: other participants — everyone mentioned as present or speaking, *excluding the vault owner (Oskar)*. Format as wikilinks (e.g. `[[Ivo]]`, `[[Malina]]`). For each person, check if a note exists with `obsidian read file="<Name>"`. If it doesn't exist, create one silently: `obsidian create name="<Name>" template="People Template" silent`. Always use wikilinks.
- **Organization**: company or team this relates to, formatted as a wikilink (e.g. `[[Qogita]]`). For personal meetings with no clear organization, leave empty.
- **Topics**: key subjects discussed — only include topics that already exist as notes in the vault. For each candidate topic, verify with `obsidian read file="<topic name>"`. Only include it if the note exists. If none of the inferred topics exist, leave this field empty and flag it in the confirmation step so the user can add topics manually.
- **Type**: `[[Work Meetings]]` or `[[Personal Meetings]]` based on content. Use `[[Work Meetings]]` when there's a clear professional/company context or multiple named colleagues.

### 4b. Ask user to confirm metadata

Present your inferences and wait for corrections before doing anything:

```
Meeting 1 of 3 — 2026-03-10

Here's what I inferred:
  Title:        ML Personalized Pricing Planning
  People:       [[Ivo]], [[Malina]], [[Luka]], [[Ruben]]
  Organization: [[Qogita]]
  Topics:       [[ML Pricing]], [[Dynamic Pricing]]
  Type:         [[Work Meetings]]

Correct? (Press enter to confirm, or tell me what to change)
```

Apply any corrections the user gives. Only proceed once confirmed.

### 4c. Structure the note body

Use the transcript to write the note body. Always attempt these sections in order — include only what the transcript actually supports:

1. **Summary** — 2-4 sentences capturing what this meeting was about and what was decided
2. **Key Decisions** — numbered list, only if concrete decisions were made
3. **Action Items** — checkbox list (`- [ ] task — Owner`), only if tasks were assigned or implied
4. **Technical Details** / **Discussion Notes** / other sections — only if the transcript clearly supports them

Don't invent content. If the transcript is short or conversational, a Summary alone is fine.

### 4d. Build the full note

Construct the markdown with frontmatter:

```markdown
---
categories:
  - "[[Meetings]]"
type:
  - "<type-wikilink>"
date: YYYY-MM-DD
organization:
  - "[[<organization>]]"
location:
  - Remote
people:
  - "[[<name1>]]"
  - "[[<name2>]]"
topics:
  - "<topic-wikilink>"
---

# <Title>

**Duration:** ~N minutes
**Date:** <human-readable date>

<body sections>

---
*Notes captured from SuperWhisper transcript.*
```

### 4e. Save the note

```bash
obsidian create \
  name="YYYY-MM-DD Title" \
  path="References/YYYY-MM-DD Title.md" \
  content="<full note content>" \
  silent overwrite
```

Use `\n` for newlines in the content string.

### 4f. Mark as processed

Append the hex ID (the value returned by `hex(r.id)`) to the tracking file:

```bash
echo "<HEX-RECORDING-ID>" >> "$VAULT_PATH/References/.superwhisper-processed"
```

### 4g. Confirm to user

```
✓ Saved: References/2026-03-10 ML Personalized Pricing Planning.md
```

Then move to the next recording.

## Notes

- The tracking file is hidden (`.superwhisper-processed`) so it doesn't clutter the vault
- `f.c3` is the LLM-processed transcript — prefer it over `f.c2` (raw) as it's cleaner
- If `obsidian eval` fails (Obsidian not running), tell the user to open Obsidian first
- If the transcript is very short (under 100 words), still create a note — just keep it brief
