---
name: backlinks
description: Wire the vault knowledge graph. Run /backlinks for a full audit of orphans, cluster gaps, unresolved links, and semantic twins — then execute approved connections. Use when Oskar asks to improve the graph, wire notes, fix orphans, find connections, bridge clusters, or audit link structure. Also trigger when he says things like "what's not connected", "what am I missing links for", "wire up the vault", or "run the graph audit".
argument-hint: [cluster-name]
disable-model-invocation: true
---

# /backlinks — Wire the Graph

Your vault is the context layer for an augmented cognition system. Every missing link is a capability gap that compounds across every future planning session, review, and synthesis run.

**Your role**: Make the graph traversable. You connect — Oskar thinks. When you find an empty hub, flag it, don't fill it. When you find notes that should link, wire them, don't rewrite them. The substance in this vault is human thinking. Your contribution is the wiring between those thoughts.

## Input

Cluster argument: $ARGUMENTS

If a cluster name is provided (e.g., `/backlinks health`), skip the full Phase 1 scan and focus Phases 3–4 on that cluster and its nearest neighbors.

## Vault Facts

- **Daily notes**: `Daily/YYYY-MM-DD.md`
- **Journal entries**: `Journal/YYYY-MM-DD HHmm - Title.md`
- **Content folders**: `Notes/`, `Journal/`, `Projects/`, `Goals/`, `References/`, `Clippings/`, `Travel/`
- **Skip from orphan analysis**: `Templates/`, `Attachments/`, `Categories/` — structural, not content
- **Vault root**: `/Users/herrschade/workspaces/obsidian/`

---

## Phase 1: Structural Inventory

Graph-only. No content reads.

```bash
obsidian orphans
obsidian deadends
obsidian unresolved verbose
obsidian tags counts sort=count
obsidian files total
```

Then identify hub notes: look at which notes appear most frequently as backlink targets in `obsidian unresolved verbose` output, and any notes you recognise as likely hubs from the tag/folder structure. Get backlinks for the top 15–20:

```bash
obsidian backlinks file="<Hub Note>" counts
```

For outgoing links from hub notes (needed to map which clusters they bridge):

```bash
obsidian eval code="app.metadataCache.getFileCache(app.vault.getFiles().find(f => f.basename === '<Hub Note>'))?.links?.map(l => l.link).join('\n') ?? 'none'"
```

Build a rough cluster map. Note which clusters have zero cross-links.

---

## Phase 2: Priority Context

Read to build the priority filter used for scoring in Phase 6. Maximum 5–6 reads.

Recent daily notes (past 7 days):

```bash
obsidian daily:read
obsidian read path="Daily/YYYY-MM-DD.md"   # repeat for past days
```

Read 2–3 active project or goal files if their titles suggest current focus. Extract:

- Current priorities and active projects
- Open questions and active threads
- People and concepts getting current attention

---

## Phase 3: Orphan Rescue Scan

Filter orphans from Phase 1. Skip non-content files:

- Images: `.heic`, `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- Media: `.mov`, `.mp4`, `.wav`, `.mp3`
- Folders: `Templates/`, `Categories/`, `Attachments/`

For remaining orphans, apply this decision tree:

| Condition                                                           | Action                                                       |
| ------------------------------------------------------------------- | ------------------------------------------------------------ |
| Title contains a word from current priorities or hub backlink chain | Read (first 20 lines)                                        |
| Title contains a question mark                                      | Read (first 20 lines)                                        |
| Otherwise                                                           | Title-only — flag if semantically related to active clusters |

For each meaningful orphan, find its nearest cluster neighbor:

```bash
obsidian search:context query="<key concept from orphan>"
```

**Hard cap: No more than 100 note reads total across all phases.** Be selective.

---

## Phase 4: Cluster Bridge Analysis

For each pair of the top 5–6 clusters with no existing links between them, search for shared themes:

```bash
obsidian search:context query="<theme from Cluster A>"
```

Try 2–3 vocabulary variants per concept — ideas evolve under different names. Read intermediary notes that might serve as bridges.

---

## Phase 5: Unresolved Link Triage

From `obsidian unresolved`:

- **3+ references**: Likely worth creating as a stub note
- **2 references**: Check for near-duplicates or name variants of existing notes
- **1 reference**: Skip unless it's a critical concept from current priorities

Check for name variants that resolve to existing notes before recommending new stubs.

---

## Phase 6: Score and Recommend

Score each candidate on 3 dimensions (multiplicative):

| Dimension               | 1                               | 3                              | 5                                 |
| ----------------------- | ------------------------------- | ------------------------------ | --------------------------------- |
| **Conceptual Strength** | Same word, different context    | Related problems/questions     | Same thesis from different angles |
| **Structural Impact**   | 6th link to well-connected note | Rescues valuable orphan        | Bridges two isolated clusters     |
| **Priority Alignment**  | Neither note is active          | One note relates to a priority | Both notes relate to active work  |

**Composite = Conceptual × Structural × Priority** (max 125)

| Tier     | Range |
| -------- | ----- |
| Critical | 75+   |
| High     | 40–74 |
| Medium   | 15–39 |
| Low      | <15   |

Quality controls:

- Minimum Conceptual Strength of 2. Same word, different concept = skip.
- Cap at 30 total recommendations.
- Each connection must be explainable in one sentence.
- Include borderline cases with lower scores rather than silently excluding — let Oskar decide.

### Connection Types

| Type                      | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| Orphan to Hub             | Orphaned note connected to its nearest cluster hub             |
| Cluster Bridge            | Two clusters share themes but zero links between them          |
| Internal Gap              | Within-cluster notes missing cross-references                  |
| Empty Hub                 | Hub with many backlinks but no content — flag only, never fill |
| Semantic Twin             | Two notes about the same concept, different vocabulary         |
| Person to Concept         | Person note that should link to associated concepts            |
| Temporal Bridge           | Old thinking relevant to new work, never connected             |
| Unresolved Worth Creating | `[[link]]` appearing 3+ times, worth formalising as a stub     |

### Connection Card Format

```
### [#]. [Type]: [Short description]
**Score:** [X] (Conceptual [N] × Structural [N] × Priority [N])
**What:** [One-sentence description]
**Edit:** Add `[[Target Note]]` to [Source Note] in [section/location]
**Why:** [One sentence on what this unlocks]
```

For Empty Hub flags:

```
### [#]. Empty Hub: [Note name]
**Referenced by:** [list of notes that link to it]
**What this needs:** Your thinking. [N] notes point here and find nothing.
```

---

## Phase 7: Execute

Present findings by tier (Critical first), then ask:

```
Execute: All Critical+High (recommended) / Critical only / Pick by number / None
```

### Execution rules

**Adding `[[links]]`**: Read the note first. Place the link in the relevant section where it makes semantic sense — not dumped at the bottom. Use `Edit` on the vault file directly.

File paths follow: `<vault-root>/<folder>/<Note Name>.md`

**Creating stub notes** (Unresolved Worth Creating only): Title + a "Related" section listing backlinks. No synthesised content, no descriptions, no summaries. Use `obsidian create`:

```bash
obsidian create name="<Note Name>" content="# <Note Name>\n\n## Related\n\n- [[Source Note A]]\n- [[Source Note B]]" silent
```

**Empty Hubs**: Do NOT fill. Flag in report only. Oskar writes the content.

### Post-execution verification

```bash
obsidian backlinks file="<modified note>"
```

Report: "Made X connections across Y notes. Z new stub notes created."

---

## Output Format

```
BACKLINKS REPORT — [Date]
Vault: [N] notes | Orphans assessed: [N] meaningful (of [N] total) | Connections recommended: [N]

---
## Critical ([N])
[Connection cards]

## High ([N])
[Connection cards]

## Medium ([N])
[Connection cards]

## Summary
[2–3 sentences: biggest structural gaps and what executing these changes unlocks]

---
Execute: All Critical+High / Critical only / Pick by number / None
```

---

## Limitations — be honest about these

- **False positives**: Include with lower score rather than silently exclude. Let Oskar decide.
- **Vocabulary drift**: Try 2–3 variants per concept. Ideas evolve under different names.
- **Recency bias**: Flag old-but-rich orphans even when they don't match current priorities. Old thinking is often the most valuable.
- **Graph vs. content tension**: Well-connected notes can have shallow content. Poorly-connected notes can be deeply thoughtful. Connection count alone doesn't indicate value.

10 excellent connections beat 30 mediocre ones. The best connections make Oskar say "how was this not already linked?"
