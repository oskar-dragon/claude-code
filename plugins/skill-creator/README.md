# Skill Creator Plugin

Guides you through creating effective Claude Code skills using Anthropic's proven skill-creator framework.

## What It Does

Claude automatically uses this skill when you want to create or update Claude Code skills. It provides:

- Comprehensive skill creation guidance
- Best practices and design patterns
- Helper scripts for scaffolding and validation
- Reference documentation for workflows and output patterns

## Usage

The skill auto-triggers when you express intent to create a skill:

```
"Help me create a skill for database migrations"
"I want to build a skill that generates API documentation"
"Guide me through creating a skill for React component scaffolding"
```

Claude will walk you through the skill creation process following Anthropic's framework.

## Core Principles

The skill teaches three fundamental principles:

1. **Concise is Key** - Only add context Claude doesn't already have
2. **Set Appropriate Degrees of Freedom** - Match specificity to task fragility
3. **Anatomy of a Skill** - SKILL.md + optional bundled resources

## Skill Creation Workflow

1. **Understanding** - Gather concrete examples and edge cases
2. **Planning** - Determine what's reusable vs. one-off
3. **Initializing** - Use `init_skill.py` to scaffold structure
4. **Editing** - Write SKILL.md with progressive disclosure
5. **Iterating** - Test and refine based on real usage

## Manual Script Usage

While the skill guides you automatically, you can also use the helper scripts directly:

### Initialize a New Skill

```bash
python3 plugins/skill-creator-2/scripts/init_skill.py <skill-name> --path <output-directory>
```

Creates a new skill directory with:
- SKILL.md template with TODO placeholders
- Example scripts, references, and assets directories

Default output: `.claude/skills/`

### Validate a Skill

```bash
python3 plugins/skill-creator-2/scripts/quick_validate.py <path-to-skill-directory>
```

Validates:
- YAML frontmatter format
- Required fields (name, description)
- Naming conventions (hyphen-case)
- Description format and length

## Directory Structure

After initialization:

```
your-skill/
├── SKILL.md              # Main skill definition
├── scripts/              # Optional helper scripts
├── references/           # Optional reference docs
└── assets/               # Optional images, data files
```

## Resources

The plugin includes reference documentation:

- **workflows.md** - Sequential and conditional workflow patterns
- **output-patterns.md** - Template and example patterns for output

## Author

Oskar Dragon
