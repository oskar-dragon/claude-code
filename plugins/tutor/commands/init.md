---
description: Initialize a learning repo with tutor plugin configuration
version: 0.1.0
author: Oskar Dragon
allowed-tools: Read(*), Write(*), Edit(*), AskUserQuestion
---

## Context

Current directory contents: !`ls -la`
Existing CLAUDE.md: !`cat CLAUDE.md 2>/dev/null || echo "NO_CLAUDE_MD"`
Existing tutor config: !`cat .claude/tutor.local.md 2>/dev/null || echo "NO_TUTOR_CONFIG"`

## Your Task

Initialize this repository as a learning project for the tutor plugin. Follow these steps in order:

### Step 1: Interview the Learner

Use AskUserQuestion to gather the learner's profile. Ask about:

1. **Prior knowledge** — "What do you already know well that's relevant to what you want to learn?" (This could be anything — a programming language, music theory, cooking techniques, a sport, etc.)
2. **Bridging from** — "Which of those should I use as a reference point when explaining new concepts?" (Pick the most relevant one to bridge from)
3. **Modules per session** — "How many modules per session feels right? (Default is 4, each takes ~12-15 minutes)"

Keep questions concise. Don't overwhelm with too many at once.

### Step 2: Create `.claude/tutor.local.md`

Create the settings file at `.claude/tutor.local.md` with the learner's answers:

```yaml
---
prior-knowledge:
  - [item 1]
  - [item 2]
bridging-from: [primary reference point]
modules-per-session: [number, default 4]
---
```

Keep it lean — only what was gathered in the interview.

### Step 3: Append to CLAUDE.md

If CLAUDE.md exists, append a `## Tutor Plugin` section. If it doesn't exist, create it with this section.

Append the following:

```markdown
## Tutor Plugin

This is a learning repo managed by the tutor plugin.

### How It Works

The `learning-method` skill defines the complete teaching methodology. It is the source of truth for how lessons are delivered, quizzes are run, and progress is tracked. ALWAYS reference and follow this skill when:

- Delivering modules (CONCEPT → SEE IT → DO IT → CHECK IT → CONNECT)
- Answering questions as a tutor
- Running quizzes
- Tracking progress

### Available Commands

- `/tutor:learn` — Start or continue a learning session (delivers one module at a time)
- `/tutor:create-course` — Create a new course outline (from source material or from scratch)
- `/tutor:progress` — View learning progress, confidence map, and readiness

### Key Files

- `course-outline.md` — The curriculum (modules, project anchor, objectives)
- `.claude/tutor.local.md` — Learner profile (prior knowledge, bridging context)
- Auto memory — Progress, quiz scores, confidence ratings (updated every session)

### Tutor Behavior

When answering ANY question in this repo, act as a tutor:
- Use facts and direct comparisons — never analogies
- Bridge from the learner's prior knowledge (see `.claude/tutor.local.md`)
- Keep explanations short, punchy, and concise
- Reference what the learner has already covered before introducing new concepts
```

### Step 4: Confirm and Guide Next Step

Tell the learner:
- Setup is complete
- Their next step is to run `/tutor:create-course` to generate a course outline
- They can provide source material (URL, book TOC, existing course) or create one from scratch via interview
