---
name: emerge
description: Surface ideas the vault implies but never states — find patterns the user is living but hasn't articulated. Use when the user says "emerge", "what am I not seeing", "implicit ideas", "surface patterns", "what does my vault imply", or "what's emerging". Optional argument to focus on a specific domain.
argument-hint: <optional: domain>
allowed-tools:
  - Glob
  - Read
  - Grep
  - mcp__qmd__vector_search
  - mcp__qmd__deep_search
  - mcp__qmd__search
---

# Emerge — Surface Implicit Ideas

Find what the vault implies but the user hasn't articulated yet.

**Scope:** Journal entries from past 90 days + all evergreen notes, goals, and projects. Structural detection (orphans, dead-ends) is vault-wide.

## Input

If an argument was provided (`{{args}}`): focus the analysis on that domain.
Otherwise: general scan across all domains.

## Detection Process

Run all four detection methods, then apply the fabrication check before presenting.

### Method 1: Structural Detection

Find orphans and dead-end notes that share themes but aren't linked to each other:
- Glob all .md files in vault root
- Find groups of orphan notes (notes with no or few incoming links)
- mcp__qmd__vector_search each orphan against other orphans
- Look for clusters of unlinked notes covering similar ground
- Hypothesis: if 3+ orphans share a theme, the undrawn connection between them may represent an unarticulated idea

### Method 2: Thematic Detection

Find patterns recurring across 3+ domains without being named:
- Read active Goals (from each Area of Focus)
- Glob Journal/ files from past 90 days and read a representative sample
- mcp__qmd__search for recurring terms across goals, projects, and journal
- Look for: concepts that appear in career AND health AND relationships (or any 3 domains) but are never given a name or standalone note

### Method 3: Behavioral Detection

Search journal entries for patterns in decisions and energy:
- Grep Journal/ files (past 90 days) for decision language: "decided", "chose", "picked", "went with", "committed to"
- Grep for energy language: "excited", "energised", "can't stop thinking about", "pulled toward"
- Grep for avoidance: "not ready", "not yet", "putting off", "avoiding", "don't want to"
- Find patterns: what consistently gets chosen? avoided? energises? What pattern do these decisions form?

### Method 4: Convergence Detection

Find multiple threads that project forward toward the same unnamed point:
- mcp__qmd__deep_search for themes that span journal + notes + goals
- Look for: separate ideas from different contexts that, if extended, would arrive at the same conclusion
- These are ideas that haven't converged yet but are heading toward each other

## Fabrication Check

**Critical: Before presenting any emergence, verify it isn't already stated.**

For each potential emergence from any method:
- mcp__qmd__search for the idea expressed as a plain sentence
- Grep for key terms that would appear if the idea was already noted
- If found in a substantial existing note → discard (already articulated, not emergent)
- If found only in passing mentions or fragments → keep (partially articulated, still valid)

## Present Emergences

For each emergence that passes the fabrication check:

```
---
**[Emergence N]**

*[The idea in one plain sentence]*

Detection: [Structural / Thematic / Behavioral / Convergence] ([how many methods found it])

Evidence:
- [Specific note/entry with excerpt]
- [Specific note/entry with excerpt]
- [More evidence as needed]

Why emergent: [Why this hasn't been stated despite the evidence — what's prevented it from being articulated?]

Confidence: High / Medium / Low
- High: 5+ data points and/or 2+ detection methods
- Medium: 3-4 data points
- Low: 1-2 data points (worth flagging but uncertain)

What to do with it:
- New note? Create a standalone note if this is substantial enough to develop
- Question to investigate? Pose it as an open question for future journaling
- Name for something being lived? Just give it a name — naming it may be enough
- Leave alone? Not every emergence needs to be acted on
---
```

Ask: "Any of these worth acting on? I can help you create a note or pose it as a question."

## Synthesis: Meta-Emergence

After presenting all emergences, check: is there a pattern in the emergences themselves?

```
**Meta-emergence:** [Is there an emergence that explains why these specific things are emerging now?]
```

If no meaningful meta-pattern, skip this section.

## Output Rules

- Terminal only. No vault changes (unless user asks to graduate an emergence into a note).
- Every emergence must have specific evidence — never assert without data.
- The fabrication check is non-negotiable: if it's already in the vault, it's not emergent.
- If no emergences found: "The vault doesn't seem to imply anything you haven't already articulated. That's a good sign — your thinking is well-integrated."
- Confidence levels matter: don't present Low-confidence emergences with the same weight as High.
