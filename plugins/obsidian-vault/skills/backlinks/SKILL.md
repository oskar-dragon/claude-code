---
name: backlinks
description: Wire the vault graph — find orphaned notes and missing connections, discover where notes should link but don't, and apply approved connections. Use when the user says "backlinks", "wire the graph", "find missing connections", "vault maintenance", "link orphans", or "connect notes". Optional argument to focus on a specific topic or cluster.
argument-hint: <optional: cluster or topic>
allowed-tools:
  - Glob
  - Read
  - Grep
  - Edit
  - AskUserQuestion
  - mcp__qmd__vector_search
  - mcp__qmd__search
---

# Backlinks — Wire the Vault Graph

Find where the vault should be connected but isn't, and apply approved connections.

## Input

If an argument was provided (`{{args}}`): focus analysis on that topic/cluster.
Otherwise: full vault scan.

## Phase 1: Structural Inventory

### Find Orphan Notes

- Glob all `.md` files in vault root (excluding `Templates/`, `Daily/`, `Journal/`, `Attachments/`, `Categories/`, `Clippings/`, `References/`, `Travel/`)
- For each note, Grep the entire vault for `[[Filename]]` and `[[Filename|` occurrences
- Orphans: notes with zero incoming links from content notes

### Find Unresolved Links

- Grep all vault files for `\[\[` patterns (wikilink syntax)
- For each wikilink target, check if a corresponding `.md` file exists (Glob for exact match)
- Collect unresolved links and count occurrences across the vault

### Report Scope

Before analysis, report:

```
Scope: [N] notes scanned, [M] orphans found, [K] unresolved links found.
[If focused on topic: "[N] notes in the [topic] cluster"]

Want me to analyse all, or focus on a specific area?
```

Wait for user's response via AskUserQuestion before proceeding.

## Phase 2: Connection Discovery

### Analyse Orphans

For each orphan note that contains actual content (skip stubs, skeletons, empty notes):

1. Read the note's title and first 2-3 sections
2. mcp__qmd__vector_search for semantically similar content
3. Identify nearest content cluster (what area of the vault this note belongs to)
4. Find the best 2-3 link candidates (existing notes that should reference this orphan)

### Unresolved Link Candidates

For unresolved links appearing 3+ times across the vault:

- Flag these as stub candidates: "The link `[[Term]]` appears [N] times but no note exists"
- These are the highest-priority connections to make

### Thematic Overlaps

- mcp__qmd__search for themes shared across disconnected clusters
- Look for notes in different areas that develop the same idea without linking

## Phase 3: Score and Recommend

Categorise each connection:

**High priority**: rescues a valuable orphan, bridges disconnected clusters, or directly touches active goals/projects
**Medium priority**: strengthens an existing cluster or connects related concepts
**Low priority**: valid connection but low impact

Present recommendations by priority:

```
#1. [High] Orphan rescued: "[note title]"
    Edit: Add [[Note Title]] to "[Target Note]" in [section]
    Why: [what this connection unlocks — what navigation it enables]

#2. [High] Stub needed: "[[Term]]" (appears 7 times, no note exists)
    Action: Create minimal stub note

#3. [Medium] Thematic link: "[note A]" ↔ "[note B]"
    Edit: Add [[Note B]] to "[Note A]" in [section]
    Why: [both discuss X but don't link]

...
```

Ask via AskUserQuestion: "Execute all High / High+Medium / pick specific / none?"

Collect the user's decision before proceeding.

## Phase 4: Execute

For each approved connection:

**Adding links to existing notes:**
- Read the target note
- Find the semantically appropriate location (not just appended at the bottom — find the relevant section or paragraph)
- Use Edit to add the `[[wikilink]]` in context

**Creating stub notes:**
- Create a minimal file with just:
  ```
  # [Term]

  ## Related
  [links to notes that reference this stub]
  ```
- Place in vault root (or appropriate category folder if obvious)

### Report

```
Made [N] connections across [M] notes.
[K] stubs created.

Skipped: [list of any connections not made and why]
```

## Output Rules

- Always scope first — never start analysis on a huge vault without asking
- Connections go in semantically appropriate places, not appended to end of notes
- Stub notes have minimal content — title and Related section only, no synthesised content
- If the topic argument was provided, respect the focus — don't stray into unrelated areas
- Terminal only. No changes without approval at each phase.
