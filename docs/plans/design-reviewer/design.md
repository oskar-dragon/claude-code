# Design: `design-reviewer` Agent

## Overview

A design-reviewer agent that slots into the brainstorming workflow between "write design doc" and "invoke writing-plans". It reviews the design doc with fresh eyes — like a senior dev reading a spec for the first time — looking for gaps, inconsistencies, and risks before the implementation plan is committed to.

## Workflow Integration

The brainstorming `SKILL.md` gets a new step 6, with a `<HARD-GATE>` block:

```
1. Explore project context
2. Ask clarifying questions
3. Propose 2-3 approaches
4. Present design sections (user approval per section)
5. Write design doc → docs/plans/<feature-name>/design.md → commit
6. [NEW] Invoke design-reviewer agent → user resolves all findings
7. Invoke writing-plans skill
```

**Hard gates:**
- The design-reviewer agent is MANDATORY — writing-plans is never invoked without it.
- All findings must be explicitly resolved (fix or dismiss) before writing-plans proceeds.
- If the user wants to fix an issue, they update the design doc first, then confirm done. The agent marks it resolved and moves on (no recursive re-review).
- If the agent finds nothing, it says so explicitly and writing-plans proceeds immediately.

## Trigger Point

After the design doc is written and committed, before the implementation plan and tasks are created. Design-only — no plan or task artifacts exist yet.

**Rationale:** Rework economics are asymmetric. A design doc is prose; revising it takes minutes. An implementation plan is structured and committed to. Catching architectural issues before the plan is built means fixing one artifact, not two.

## Agent Internal Architecture

### Phase 1: Context Gathering (parallel)
- **Haiku agent**: find all relevant CLAUDE.md files (root + any in the feature's directory path)
- **Haiku agent**: read the design doc and return a structured summary

### Phase 2: Parallel Review (4 agents simultaneously)
- **Sonnet — Completeness**: missing cases, unhandled errors, edge cases not addressed, gaps between what's described and what's actually needed to build it
- **Sonnet — Feasibility & Consistency**: technical contradictions, assumptions that don't hold, parts that conflict with each other
- **Sonnet — Scope**: scope creep, over-engineering, or missing critical pieces that will block implementation
- **Sonnet — Security**: auth gaps, data exposure risks, PII handling, access control assumptions

Each agent receives: the design doc summary from Phase 1.

High-signal only. Flag issues where:
- Something described will definitely not work as specified
- A critical case is clearly unaddressed
- Scope is clearly wrong (too much or missing something blocking)
- A security assumption is demonstrably incorrect

Do NOT flag: style concerns, subjective suggestions, nitpicks, things that might be issues depending on context.

### Phase 3: Validation (parallel, one agent per finding)
Each finding from Phase 2 gets a Sonnet validation agent that confirms the finding is real before it surfaces. False positives are dropped. Agents receive: design doc summary + the specific finding to validate.

### Phase 4: Present Findings
Findings are presented as a numbered list ranked by severity:
- **Critical** — will cause implementation to fail or produce wrong results
- **Important** — significant gap or risk worth addressing
- **Suggestion** — worth noting but low cost to ignore

Each finding includes:
- Severity + category tag
- The issue and why it's a problem
- What a "fix" would concretely mean

## User Interaction Pattern

Findings are presented as a numbered list. Oskar responds with shorthand:

```
1. fix
2. dismiss
3. fix
```

Or asks questions about specific items before deciding. The agent explains and waits.

**The agent never proceeds to signal "review complete" until every finding has an explicit fix or dismiss decision.**

For "fix" items: Oskar updates the design doc, confirms done, agent marks resolved.
For "dismiss" items: agent acknowledges and moves on.

Once all findings are resolved, the agent explicitly states review is complete and control returns to the brainstorming skill to invoke writing-plans.

## Files Changed

| File | Change |
|------|--------|
| `plugins/superpowers/agents/design-reviewer.md` | **New** — coordinator agent |
| `plugins/superpowers/skills/brainstorming/SKILL.md` | **Modified** — add step 6 + HARD-GATE |

## No-Gos

- Does not auto-fix the design — identifies and explains only, never edits `design.md`
- Does not re-run a full review after fixes — per-item resolution, then move on
- Does not review implementation artifacts — plan, tasks, code are out of scope
- Does not check CLAUDE.md — out of scope for design-level review
- Does not block on zero findings — if nothing found, says so and proceeds immediately
