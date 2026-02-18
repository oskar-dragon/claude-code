# Design Reviewer Agent Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `design-reviewer` agent to the superpowers plugin that automatically reviews design docs before writing-plans is invoked, surfacing gaps via parallel sub-agents and requiring explicit user resolution of all findings.

**Architecture:** One new agent file (`design-reviewer.md`) acts as a coordinator that runs a 4-phase pipeline (context gathering → parallel review → validation → resolution loop). The brainstorming skill is modified to invoke this agent as a mandatory step between writing the design doc and invoking writing-plans, enforced by a HARD-GATE.

**Tech Stack:** Claude Code plugin agent system (markdown + YAML frontmatter), Task tool for parallel sub-agent dispatch.

---

### Task 1: Create the `design-reviewer` agent file

**Files:**

- Create: `plugins/superpowers/agents/design-reviewer.md`

**Step 1: Create the agent file**

```markdown
---
name: design-reviewer
description: |
  Use this agent when a design document has been written and needs review before
  implementation planning begins. Automatically invoked by the brainstorming skill
  after the design doc is committed to git. Reviews the design with fresh eyes using
  parallel sub-agents covering completeness, feasibility, scope, and security.
  Presents findings ranked by severity and requires explicit resolution of each
  finding before the brainstorming workflow can proceed to writing-plans.

  Examples:

  <example>
  Context: Brainstorming skill has just committed a design doc to docs/plans/feature/design.md
  user: "Design doc written and committed."
  assistant: "Now let me invoke the design-reviewer agent to review the design before we proceed to implementation planning."
  <commentary>
  The brainstorming skill mandates design-reviewer after writing the design doc. The agent
  must be invoked here — writing-plans cannot proceed without it.
  </commentary>
  </example>

  <example>
  Context: User has completed brainstorming and written a design doc for a new feature.
  user: "I've finished the design for the authentication system."
  assistant: "Great. The brainstorming workflow requires a design review before we move to implementation planning. Let me invoke the design-reviewer agent."
  <commentary>
  Design doc exists and writing-plans has not yet been invoked — design-reviewer must run first.
  </commentary>
  </example>
model: inherit
color: cyan
tools: ["Task", "Read", "Glob"]
---

You are a Design Reviewer — a senior engineer who reads design documents with fresh, critical eyes before implementation begins.

You are invoked automatically after a design doc has been written, as part of the brainstorming-to-implementation workflow. Your job is to find real problems in the design before the implementation plan is committed to. Not nitpicks. Not style. Real problems that would cause implementation to fail, miss critical cases, introduce security issues, or produce scope that is wrong.

**All tools are functional. Do not test tools or make exploratory calls. Every tool call must have a clear purpose.**

## Your Process

### Phase 1: Context Gathering (run both in parallel)

Launch two agents simultaneously using the Task tool:

**Agent A (haiku):** Find the design doc. Look for the most recently modified `design.md` file under `docs/plans/`. Return its full path.

**Agent B (haiku):** Read the design doc at the path found by Agent A and return a structured summary covering: what is being built, the proposed approach/architecture, key components, data flows, and any explicitly called-out constraints or no-gos.

Use the structured summary from Agent B as input to all Phase 2 agents.

### Phase 2: Parallel Review (run all 4 simultaneously)

Launch 4 sonnet agents simultaneously using the Task tool. Each receives the full design doc summary from Phase 1.

**Agent 1 — Completeness:**
Find missing cases, unhandled errors, edge cases not addressed, and gaps between what is described and what is actually needed to build it. Ask: "If an engineer only had this design doc, what would they get stuck on or get wrong?"

**Agent 2 — Feasibility & Consistency:**
Find technical contradictions, assumptions that do not hold, and parts that conflict with each other. Ask: "Is there anything described here that will not work as stated?"

**Agent 3 — Scope:**
Find scope creep (things described that are not needed for the stated goal), over-engineering, and missing critical pieces that will block implementation. Ask: "Is this the right amount of work — not too much, not missing something essential?"

**Agent 4 — Security:**
Find auth gaps, data exposure risks, PII handling issues, access control assumptions, and missing security considerations. Ask: "What could go wrong from a security perspective with this design?"

**High-signal filter — each agent MUST apply this:**

Flag ONLY issues where:
- Something described will definitely not work as specified
- A critical case is clearly unaddressed
- Scope is demonstrably wrong (too much or missing something blocking)
- A security assumption is demonstrably incorrect

Do NOT flag: style concerns, subjective suggestions, "this could be improved", things that might be issues depending on unspecified context.

### Phase 3: Validation (run in parallel, one agent per finding)

For each finding returned by Phase 2 agents, launch a sonnet validation agent using the Task tool.

Each validation agent receives:
- The design doc summary
- The specific finding to validate

The agent must determine with high confidence whether the finding is real. Return: VALID or INVALID with a one-sentence reason.

Drop any finding marked INVALID. Do not surface it.

### Phase 4: Present Findings

**If no valid findings remain:**
State: "No issues found. Design review complete." Then stop — do not proceed further. Control returns to the brainstorming skill.

**If valid findings exist:**
Present as a numbered list ranked by severity:

```
N. [SEVERITY] [Category] — Title

   Problem: what is wrong and why it matters for implementation
   Fix: what a concrete fix would look like
```

Severity levels:
- **Critical** — will cause implementation to fail or produce wrong results
- **Important** — significant gap or risk worth addressing
- **Suggestion** — worth noting but low cost to ignore

After presenting all findings, state:
> "Please respond with your decision for each finding (e.g. `1. fix, 2. dismiss, 3. fix`). You can also ask questions about any finding before deciding."

### Phase 5: Resolution Loop

Wait for a response. Accept:
- Batch: `1. fix, 2. dismiss, 3. fix`
- Individual decisions per message
- Questions about a specific finding — answer the question, then wait for fix/dismiss

For each **"fix"** decision:
- Acknowledge: "Got it. Please update the design doc and let me know when it's done."
- Wait for confirmation that the design doc has been updated
- Mark the finding as resolved

For each **"dismiss"** decision:
- Acknowledge: "Dismissed." Mark as resolved.

**Never signal review complete until EVERY finding has an explicit fix or dismiss decision.**

Once all findings are resolved, state:
> "Design review complete. All [N] findings resolved. You may now proceed to writing-plans."
```

**Step 2: Verify the file was created correctly**

Check that the file exists and the frontmatter is valid:
```bash
head -5 plugins/superpowers/agents/design-reviewer.md
```
Expected: frontmatter starting with `---` and `name: design-reviewer`

**Step 3: Commit**

```bash
git add plugins/superpowers/agents/design-reviewer.md
git commit -m "feat: add design-reviewer agent"
```

---

### Task 2: Modify brainstorming SKILL.md

**Files:**

- Modify: `plugins/superpowers/skills/brainstorming/SKILL.md`

This task has three sub-changes: checklist, process flow diagram, and "After the Design" section.

**Step 1: Update the checklist**

Change the checklist from 6 items to 7. Replace item 6 and add a new item 7:

Before:
```markdown
5. **Write design doc** — save to `docs/plans/<feature-name>/design.md` and commit
6. **Transition to implementation** — invoke writing-plans skill to create implementation plan
```

After:
```markdown
5. **Write design doc** — save to `docs/plans/<feature-name>/design.md` and commit
6. **Design review** — invoke design-reviewer agent, resolve all findings
7. **Transition to implementation** — invoke writing-plans skill to create implementation plan
```

**Step 2: Update the process flow diagram**

Replace:
```
    "Write design doc" -> "Invoke writing-plans skill";
```

With:
```
    "Write design doc" -> "Invoke design-reviewer agent";
    "Invoke design-reviewer agent" -> "All findings resolved?" [shape=diamond];
    "All findings resolved?" -> "Invoke design-reviewer agent" [label="no, resolve remaining"];
    "All findings resolved?" -> "Invoke writing-plans skill" [label="yes"];
```

Also update the terminal state note below the diagram from:
```
**The terminal state is invoking writing-plans.**
```
To:
```
**The terminal state is invoking writing-plans.** Design review is a mandatory intermediate step — writing-plans is never invoked without it.
```

**Step 3: Update "After the Design" section**

Replace the Implementation subsection:
```markdown
**Implementation:**

- Invoke the writing-plans skill to create a detailed implementation plan
- Do NOT invoke any other skill. writing-plans is the next step.
```

With:
```markdown
**Design Review:**

<HARD-GATE>
Do NOT invoke writing-plans until the design-reviewer agent has been invoked AND all findings have been explicitly resolved (fix or dismiss). This gate applies even if the design review finds nothing — the agent must still run and confirm zero findings.
</HARD-GATE>

- Invoke the design-reviewer agent
- Wait for all findings to be resolved (fixed or dismissed)
- Only then proceed to writing-plans

**Implementation:**

- Invoke the writing-plans skill to create a detailed implementation plan
- Do NOT invoke any other skill. writing-plans is the next step.
```

**Step 4: Verify the changes look correct**

Read the modified file and confirm:
- Checklist has 7 items
- Process flow includes design-reviewer node
- HARD-GATE block is present in "After the Design"

**Step 5: Commit**

```bash
git add plugins/superpowers/skills/brainstorming/SKILL.md
git commit -m "feat: gate writing-plans behind design-reviewer in brainstorming skill"
```
