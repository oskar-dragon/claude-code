# Personal Learning Method

> Designed for inattentive ADHD. Backed by spaced repetition, active recall, metacognitive monitoring, scaffolded learning, cognitive load theory, and dual coding — adapted to actually work with how my brain operates.

## Learner Profile

- **ADHD type:** Inattentive, medicated
- **Focus drivers:** Novelty, curiosity
- **Focus killers:** Repetition, walls of text, unexpected/repeated failure
- **Content format:** Short, punchy, concise. Explanation first, then code. No long-form prose.
- **Preferred explanations:** Facts and comparisons/contrasts. No analogies — too abstract.
- **Bridging:** When learning new programming languages/tools, always bridge from existing knowledge (e.g., TypeScript → Python)
- **Exercises:** Must build toward a real project, never isolated/abstract drills
- **Motivation:** Competence is the reward. Gamification feels hollow — no XP, streaks, or badges.
- **When stuck:** Ask Claude immediately rather than struggling alone
- **Session length:** ~1 hour focused blocks, self-scheduled

## Core Principle: Linear Progressive Building

Every course follows a strict linear progression. Each module builds directly on the previous one. You never jump backwards or sideways. The project grows incrementally, and so does your knowledge.

Review of earlier concepts happens **organically** — by using them in the context of new material, not by revisiting old modules.

## Course Structure

A learning topic is structured as a **course** made up of **modules**. Each course is anchored to a **real project** that grows as you progress.

### Module Flow (~12-15 minutes per module, 4-5 modules per hour)

```
CONCEPT  (2-3 min)  →  Short explanation with comparisons
                        "In TS: ... → In Python: ..."

SEE IT   (2-3 min)  →  Working code example in project context
                        ASCII diagram if concept is spatial

DO IT    (5-10 min) →  Exercise that adds to the real project
                        Clear spec, you write the code

CHECK IT (2-3 min)  →  Quiz — format varies every time
                        + confidence self-rating

CONNECT  (1-2 min)  →  How this links to what you know
                        and what's coming next
```

## CONCEPT Step

- Maximum 3-5 short paragraphs or bullet points
- Lead with what the concept **does**, not what it **is**
- Always use comparisons to known knowledge when possible
- No analogies — use direct technical comparisons
- If the concept requires understanding something visual (data flow, architecture, relationships), include an ASCII diagram

### Example Format

```markdown
## Decorators

In TypeScript, you might use decorators like `@Injectable()` in NestJS.
Python decorators work similarly but are more fundamental to the language.

**What they do:** Wrap a function to modify its behavior without changing its code.

**Key difference from TS:** Python decorators are just functions — no special
syntax or experimental flags needed. They're everywhere in Python, not just
in frameworks.
```

## SEE IT Step

- Show a complete, working code example
- The example must be in the context of the project being built
- Annotate with brief inline comments explaining the "why" — not the "what"
- Keep it short enough to read in 2-3 minutes

## DO IT Step

- A clear exercise spec: what to build, what the expected behavior is
- The exercise **adds real functionality** to the project — not a throwaway
- Each exercise uses the concept just taught AND naturally involves concepts from earlier modules (this is how review happens without going backwards)
- Claude is available as a TA — ask questions anytime, get facts and code comparisons back

## CHECK IT Step: Quiz Format Rotation

Quizzes rotate through these formats. Never the same format twice in a row:

| Format | Description |
|---|---|
| **Multiple choice** | Plausible wrong answers that test real understanding |
| **Predict the output** | "What does this code print?" |
| **Spot the bug** | Broken code — find and fix it |
| **Compare and contrast** | "What's the difference between X and Y?" |
| **Teach-back** | "Explain this concept in 2 sentences" |
| **Code completion** | Fill in the missing piece |

### Metacognitive Self-Rating

After each answer (right or wrong), rate confidence:

- **Guessed** → Concept gets woven into the next 1-2 modules more heavily
- **Somewhat sure** → Concept appears embedded in exercises 2-3 modules later
- **Knew it** → Concept appears later, in a harder or more combined context

This drives the spacing without feeling like repetition.

## CONNECT Step

- One or two sentences linking the concept just learned to:
  - Something already known (reinforces the web of knowledge)
  - What's coming next (builds anticipation / curiosity)
- Keeps the linear narrative moving forward

## Interleaved Review (No Backwards Jumping)

Spaced repetition is critical for retention, but traditional flashcard review feels repetitive and kills momentum. Instead:

- **Review is embedded in forward progress.** New exercises naturally require concepts from earlier modules because the project builds on itself.
- **Quiz questions occasionally reference earlier material** but always in the context of new concepts.
- **Low-confidence concepts** resurface sooner, woven into new material — never as standalone review sessions.

This is interleaving — same evidence base as spaced repetition, but it feels like moving forward, not going backwards.

## The Tutor (Claude)

Available at any point during a module. When asked a question, Claude:

- Answers with **facts and code**, not analogies
- Uses **comparisons to known languages/tools** when relevant
- Knows where you are in the course and what you've covered
- Can see quiz history and confidence ratings
- Keeps explanations **short and punchy** — no walls of text

## Progress Tracking

Simple, not gamified:

- **Module completion** — which modules are done
- **Concept confidence map** — what's solid vs what needs organic review
- **Readiness indicator** — whether quiz performance and confidence ratings suggest readiness for the next section

No streaks, no XP, no badges. Competence is the reward.

## Non-Programming Topics

The same structure works for any subject. The "DO IT" step adapts:

- **Sound design / music production:** "Create a patch/loop using the technique just described"
- **Theory / knowledge:** "Apply this concept to scenario Y" or "Given situation X, what would you do?"
- **Practical skills:** Hands-on task using the tool/technique covered

The module flow, quiz rotation, and confidence tracking remain the same regardless of subject.

## Session Flow (1 Hour)

```
 0:00  Open repo, trigger learning workflow
 0:02  Module 1: concept → see it → do it → check it → connect
 0:15  Module 2: builds on module 1
 0:30  Module 3: builds on modules 1-2, exercises naturally review earlier concepts
 0:45  Module 4: builds on all previous
 1:00  Session complete. Progress saved automatically.
```

Some sessions may be 3 modules (harder material), some may be 5 (lighter concepts). Pacing adapts to complexity.
