# Tutor Plugin

Personalized learning system with adaptive tutoring, course creation, and progress tracking. Designed for inattentive ADHD using science-backed methods: spaced repetition, active recall, metacognitive monitoring, scaffolded learning, cognitive load theory, and dual coding.

## How It Works

Each learning topic lives in its own repo. The plugin delivers modules following a structured cycle: **CONCEPT → SEE IT → DO IT → CHECK IT → CONNECT**. Every course is anchored to a real project that grows as you progress.

The system adapts over time — it tracks your confidence on each concept and organically weaves review into forward progress. No flashcard repetition, no gamification, no backwards jumping.

## Quick Start

```bash
# 1. Install the plugin
/plugin marketplace add oskar-dragon/claude-code
/plugin install tutor@claude-code

# 2. Create a new repo for your course and cd into it
mkdir my-python-course && cd my-python-course && git init

# 3. Initialize the learning environment
/tutor:init

# 4. Create a course (from scratch or from source material)
/tutor:create-course
/tutor:create-course https://some-course-url.com

# 5. Start learning
/tutor:learn

# 6. Check progress anytime
/tutor:progress
```

## Commands

| Command | Description |
|---|---|
| `/tutor:init` | Initialize a repo as a learning project — creates CLAUDE.md section and learner profile |
| `/tutor:create-course` | Create a course outline from source material or from scratch via interview |
| `/tutor:learn` | Start or continue a learning session — delivers one module at a time |
| `/tutor:progress` | View learning progress, confidence map, and readiness |

## Components

### Skill: `learning-method`

The core teaching methodology. Defines how modules are delivered, when quizzes happen, how confidence is tracked, and how the tutor behaves when answering questions. Loaded automatically in tutor-initialized repos.

### Agent: `exercise-verifier`

Checks completed exercises against the specification. Provides feedback and guidance only — never solutions. Launched automatically during the DO IT step when the learner says they're done.

## Key Files (per learning repo)

| File | Purpose |
|---|---|
| `course-outline.md` | The curriculum — ordered modules, project anchor, learning objectives |
| `.claude/tutor.local.md` | Learner profile — prior knowledge, bridging context, session preferences |
| Auto memory | Progress, quiz scores, confidence ratings (persists across sessions) |
| `CLAUDE.md` | Tutor behavior instructions (appended by `/tutor:init`) |

## Works With Any Subject

The plugin is not limited to programming. The module flow adapts to any topic:

- **Programming:** Build a real project incrementally
- **Sound design / music:** Create patches and loops using techniques just learned
- **Theory / knowledge:** Apply concepts to scenarios
- **Practical skills:** Hands-on tasks with the tool or technique covered
