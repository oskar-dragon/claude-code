---
name: trace
description: Track how a specific idea, concept, or topic has evolved through the vault over time — from first appearance through inflection points to current state. Use when the user says "trace [topic]", "how has my thinking on [topic] evolved", "trace idea", "history of [concept]", or "how did I come to think about X". Requires a topic argument.
argument-hint: <topic>
allowed-tools:
  - Glob
  - Read
  - Grep
  - mcp__qmd__deep_search
  - mcp__qmd__vector_search
  - mcp__qmd__search
---

# Trace — Idea Evolution Through the Vault

Build a chronological narrative of how a specific idea developed in the user's thinking.

## Input

Topic to trace: `{{args}}`

If no argument provided, ask: "What idea or topic would you like to trace?"

## Process

### 1. Synonym Discovery

Start by understanding the concept's vocabulary:
- mcp__qmd__search for the topic to find related notes
- Read the 3-5 most relevant results
- Extract 3-5 alternative terms, phrasings, and related concepts the user uses

Build a synonym set: `[original term, synonym1, synonym2, synonym3, ...]`

### 2. Broad Search

Search the entire vault — notes, journal entries, references — with all synonyms:
- mcp__qmd__deep_search for the original topic (multi-strategy comprehensive search)
- Grep for each synonym across vault root and Journal/ (to catch mentions deep in note content)
- Glob Journal/ for date-ordered entries, check each for topic mentions

Collect all mentions with: file path, date (from filename or properties), excerpt

### 3. Follow the Graph

For each note that meaningfully engages with the topic:
- Read its backlinks: Grep for `[[note title]]` across the vault
- Follow 2-3 hops to find:
  - Notes that influenced this thinking (cited or linked sources)
  - Related concepts that developed alongside this idea
  - People, conversations, books, or events that triggered shifts (look for `[[Person Name]]` or `[[Book Title]]` links)

### 4. Build the Timeline

Organise all findings chronologically:
- Journal entries: use filename date (YYYY-MM-DD HHmm)
- Notes: use `created:` property if present, else modification time
- References: use `created:` property

For each point in the timeline, record:
```
Date: [date]
Context: [what was happening — other notes created around same time, project context]
Thinking: [the idea as it appeared at this point — direct quote where possible]
Trigger: [what prompted this thinking — linked source, event, person, question]
Shift: [did the thinking change from previous entry?]
```

### 5. Identify the Arc

Synthesise the timeline into an arc:

**First appearance**: When and in what form — question, hunch, reaction to something else?

**Key inflection points**: Where did the thinking shift? What caused each shift?

**Current position**: Where does the vault leave things — resolved, open, evolved into something else?

**Evolution pattern** (choose the closest match):
- **Linear deepening**: same direction, progressively refined
- **Pivot**: clear break — thinking reversed or significantly redirected
- **Convergence**: separate threads that gradually merged into one position
- **Divergence**: one idea that split into multiple distinct threads
- **Circular**: returned to an earlier position after exploration
- **Open exploration**: no arc yet — still actively developing

### 6. Surface Tensions

Look for:
- Contradictions between entries at different dates
- Questions asked early that were never answered
- Positions taken and then quietly abandoned
- Ideas mentioned once with energy that never recurred

### 7. Present the Trace

Structure the output as:

```
# Trace: [Topic]

## The Arc
[2-3 sentence summary of how the thinking evolved]

Pattern: [evolution pattern label]

## Timeline

**[Date]** — [context]
> "[quote or paraphrase]"
[Source: [[Note Title]] or Journal YYYY-MM-DD HHmm]
[Trigger: [what prompted this]]

**[Date]** — [context]
...

## Inflection Points

**[Date]: [what shifted]**
Before: [prior position]
After: [new position]
Caused by: [trigger]

## Where It Stands Now

[Current position — direct quote from most recent engagement]

## Open Tensions

- [contradiction or unresolved question 1]
- [contradiction or unresolved question 2]

## What to Do With This

[Optional — if a pattern suggests a next step, note it. E.g., "The recurring tension between X and Y might be worth resolving — there's a draft of [[Note]] that addresses part of it."]
```

## Output Rules

- Terminal only. No vault changes.
- Every claim must be cited (note title and date).
- If fewer than 3 data points found, say so: "Not enough trace data to build a meaningful arc. Found [N] mentions. You might try a broader term."
- Synthesis should feel like a reader discovering a story, not an analyst generating a report.
