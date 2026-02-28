---
description: Start or continue a learning session — delivers one module at a time
version: 0.1.0
author: Oskar Dragon
allowed-tools: Read(*), Write(*), Edit(*), Grep(*), Glob(*), AskUserQuestion, Bash(*), Task(*)
---

## Context

Learner profile: !`cat .claude/tutor.local.md 2>/dev/null || echo "NO_PROFILE — run /tutor:init first"`
Course outline: !`cat course-outline.md 2>/dev/null || echo "NO_COURSE — run /tutor:create-course first"`

## Your Task

Deliver the next learning module following the learning-method skill. This is the core learning workflow.

### Before Starting

1. Read auto memory to determine where the learner left off (which modules are completed, last quiz format, confidence ratings)
2. Read `course-outline.md` to find the next module
3. Read `.claude/tutor.local.md` for bridging context

If no progress exists in memory, start with Module 1.

### Delivering a Module

Follow the learning-method skill strictly. For each module:

**1. CONCEPT (2-3 min)**
- Short, punchy explanation
- Bridge from learner's prior knowledge (check `.claude/tutor.local.md`)
- Use comparisons, not analogies
- ASCII diagram only if concept is spatial

**2. SEE IT (2-3 min)**
- Complete working example in the project context
- Brief inline comments explaining "why"

**3. DO IT (5-10 min)**
- Present a clear exercise spec
- The exercise must add real functionality to the project
- Then STOP and WAIT for the learner to complete it
- When they say they're done, use the Task tool to launch the **exercise-verifier** agent to check their work
- The verifier gives feedback/guidance only — never solutions
- If the verifier finds issues, let the learner fix them and verify again

**4. CHECK IT (2-3 min) — ONLY when it adds value**
- Skip if the exercise already demonstrated understanding
- If including: rotate quiz format (check memory for last format used)
- After the answer, ask for confidence rating (Guessed / Somewhat sure / Knew it) using AskUserQuestion

**5. CONNECT (1-2 min)**
- Link to what was learned before and what's coming next
- Build anticipation

### After Completing a Module

1. Update auto memory with:
   - Module number and title completed
   - Quiz results if CHECK IT was done (format, correct/incorrect, confidence)
   - Concepts covered and confidence levels
   - Last quiz format used
   - Any notes about what worked or what the learner found difficult

2. Tell the learner they can:
   - Say "next" or "continue" for the next module
   - Ask questions about anything covered
   - Take a break and come back later (progress is saved)

### Module Pacing

- Deliver ONE module at a time
- Wait for the learner to say they want to continue before delivering the next one
- A typical session is 4-5 modules (~1 hour), but let the learner control the pace
- If the learner seems to be struggling, suggest taking a break or slowing down

### Tutoring During a Session

If the learner asks a question at any point:
- Answer with facts and direct comparisons, not analogies
- Reference what they've already learned
- Keep it short and punchy
- Then resume where you left off in the module flow

### When the Course is Complete

If all modules in the course outline are done:
- Congratulate the learner
- Show a summary of what they've built (the project)
- Show their confidence map across all concepts
- Suggest next steps (deeper topics, related courses, practice ideas)
