---
name: graduate
description: Promote journal fragments to standalone notes — find ideas, insights, and concepts worth preserving from recent journal entries and create or enrich vault notes. Use when the user says "graduate", "promote notes", "extract ideas from journal", "what should I graduate", or provides a date range like "graduate last month". Accepts an optional date range or journal entry path as argument.
argument-hint: <date-range or journal-entry-path>
allowed-tools:
  - Glob
  - Read
  - Grep
  - Edit
  - Skill
  - AskUserQuestion
  - mcp__qmd__search
  - mcp__qmd__vector_search
---

# Graduate — Promote Journal Fragments to Notes

Find what's worth keeping from recent journal entries and help it become permanent knowledge in the vault.

## Input

If an argument was provided (`{{args}}`):

- If it's a date range (e.g., "last month", "past 30 days", "January 2026"): use that range
- If it's a path to a specific journal entry: process just that entry
- If empty: default to past 14 days

## Process

### 1. Read Journal Entries

- Glob Journal/ files for the specified date range (YYYY-MM-DD\*.md)
- Read all entries, noting filename (date + time) for each

### 2. Find Graduation Candidates

For each entry, look for:

**Explicit signals — strong graduation candidates:**

- Named concepts or frameworks the user is developing
- Original insights or claims (not just "I read that X" but "I think X because Y")
- Unresolved `[[wikilinks]]` pointing to notes that don't exist yet
- Ideas the user labels explicitly: "I should write about this", "this is worth exploring"
- Questions the user returns to repeatedly

**Implicit signals — worth flagging:**

- Longer, energised passages (multiple paragraphs on one idea)
- Original analogies or mental models
- A recurring theme across 3+ entries in the date range
- Something explained as if teaching someone else

**Skip these:**

- Tasks and todos (belong in Todoist)
- Meeting logistics and scheduling
- Venting or emotional processing without a transferable insight
- Things that already have substantial standalone notes in the vault

### 3. Cross-Reference with Existing Vault

For each candidate:

- mcp**qmd**vector_search for the concept/idea
- Glob for exact title matches

Classify each candidate:

- **New concept**: no note exists → top candidate for graduation
- **Underdeveloped**: a thin stub or brief note exists → candidate to enrich
- **Already covered**: substantial note exists → skip unless journal adds a new angle
- **Recurring unresolved**: a `[[link]]` referenced 3+ times in the vault → high priority stub

### 4. Present Candidates

Present as a ranked table:

```
| # | Idea | Source Entries | Connects To | Type | Recommendation |
|---|------|----------------|-------------|------|----------------|
| 1 | [summary] | [date(s)] | [[note]], [[note]] | New | Create |
| 2 | [summary] | [date] | [[note]] | Underdeveloped | Enrich |
| 3 | [summary] | [date(s)] | — | Recurring | Create stub |
```

Ask: "Which of these would you like to graduate? (Enter numbers, 'all', or 'none')"

### 5. Graduate Approved Candidates

For each approved candidate:

**Creating a new note:**

1. Determine appropriate template:
   - General insight or concept → Evergreen Note template
   - Person → Person template
   - Book/resource → Reference template
   - Other category → appropriate category template
2. Use `obsidian:obsidian-cli` skill to create the note from the template
3. Write the note content preserving the original voice and energy from the journal entries
4. Use `obsidian:obsidian-markdown` skill to ensure proper formatting (wikilinks, callouts, properties)
5. Add links to related notes identified in Step 3

**Enriching an existing note:**

1. Read the existing note
2. Add new content from journal entries with date context
3. Add any new backlinks discovered
4. Use Edit to write changes

**In both cases — update source journal entries:** 5. Go back to each source journal entry and add `[[Note Title]]` as a wikilink where the concept was first mentioned 6. Use Edit for each source journal file

### 6. Summary

Report what was graduated:

```
Graduated [N] ideas:
- Created: [list of new notes]
- Enriched: [list]
- Source entries updated: [list]

Still in the queue (not graduated today):
- [list of candidates that were skipped or declined]
```

## Output Rules

- All note creation and editing requires user approval (from Step 4)
- Preserve the original voice — don't sanitise or generalise the user's thinking
- Backlinks in source journal entries should be minimal (just add the wikilink, don't rewrite the entry)
- If no graduation candidates are found, say so briefly: "Nothing in the past [N] days seems ready to graduate. The journal entries are mostly [tasks/logistics/other]."
