# Skill Creator Plugin

A Claude Code plugin for creating and validating agent skills with proper directory structure and SKILL.md templates, based on Anthropic's proven skill-creator scripts.

## Overview

The Skill Creator Plugin streamlines the process of creating new Claude Code skills. Instead of manually setting up directories and writing SKILL.md frontmatter, it automates skill scaffolding using battle-tested scripts from Anthropic's official skill-creator toolkit.

**Key Features:**
- Creates skills in `.claude/skills/` directory by default
- Generates valid SKILL.md with proper YAML frontmatter
- Scaffolds standard resource directories (scripts/, references/, assets/)
- Validates skill structure and frontmatter compliance
- Follows Anthropic's agent_skills_spec.md format

## Commands

### `/skill-creator:init-skill`

Creates a new Claude Code skill with complete directory structure and templates.

**Usage:**

```bash
# Create skill in default location (.claude/skills/)
/skill-creator:init-skill my-new-skill

# Create skill in custom location
/skill-creator:init-skill my-helper --path plugins/my-plugin/skills

# Create skill for personal use
/skill-creator:init-skill pdf-helper --path ~/.claude/skills
```

**Arguments:**
- `<skill-name>` (required): Hyphen-case skill name (e.g., `data-analyzer`, `pdf-helper`)
  - Lowercase letters, digits, and hyphens only
  - Max 64 characters
  - Cannot start/end with hyphens or contain `--`

- `--path <custom-path>` (optional): Directory where skill should be created
  - Default: `.claude/skills`
  - Skill created at `<path>/<skill-name>/`

**Output:**

The command creates a complete skill directory:

```
.claude/skills/my-new-skill/
├── SKILL.md              # Template with frontmatter and structural guidance
├── scripts/
│   └── example.py        # Executable script template
├── references/
│   └── api_reference.md  # Reference documentation template
└── assets/
    └── example_asset.txt # Asset file placeholder
```

**What's Generated:**

1. **SKILL.md**: Complete template with:
   - YAML frontmatter (name, description placeholder)
   - Comprehensive structural guidance
   - TODO items for completion
   - Resource organization examples

2. **scripts/example.py**: Placeholder for executable scripts
   - Python script template
   - Executable permissions set
   - Examples from other skills

3. **references/api_reference.md**: Template for reference docs
   - Documentation structure suggestions
   - When to use reference docs
   - Examples from existing skills

4. **assets/example_asset.txt**: Placeholder for asset files
   - Explains asset file purpose
   - Lists common asset types
   - Examples from other skills

**Next Steps After Creation:**

1. Edit `SKILL.md` to complete TODO items
2. Update frontmatter description
3. Choose structural pattern (workflow, task-based, reference, capabilities)
4. Delete the "Structuring This Skill" guidance section
5. Customize or delete example files
6. Run `/skill-creator:validate-skill` to verify structure

### `/skill-creator:validate-skill`

Validates a Claude Code skill directory for structure and frontmatter compliance.

**Usage:**

```bash
# Validate skill in default location
/skill-creator:validate-skill .claude/skills/my-skill

# Validate skill with relative path
/skill-creator:validate-skill plugins/my-plugin/skills/custom-skill

# Run without arguments (will prompt)
/skill-creator:validate-skill
```

**Arguments:**
- `[skill-directory-path]` (optional): Path to skill directory
  - If not provided, prompts for path
  - Can be absolute or relative
  - Must point to directory containing SKILL.md

**What's Validated:**

**Structure Checks:**
- SKILL.md file exists
- Frontmatter starts with `---`
- Valid YAML syntax
- Frontmatter is a dictionary

**Required Fields:**
- `name`: Must be present
- `description`: Must be present

**Name Validation:**
- Hyphen-case format (lowercase, digits, hyphens)
- No leading/trailing hyphens
- No consecutive hyphens (`--`)
- Max 64 characters

**Description Validation:**
- No angle brackets (`<` or `>`)
- Max 1024 characters

**Allowed Properties:**
- Only these keys: `name`, `description`, `license`, `allowed-tools`, `metadata`
- Unexpected keys cause validation failure

**Output:**

**Success:**
```
Skill is valid!
```

**Failure:**
```
[Specific error message describing the issue]
```

Common errors:
- `SKILL.md not found`
- `No YAML frontmatter found`
- `Missing 'name' in frontmatter`
- `Missing 'description' in frontmatter`
- `Name 'MySkill' should be hyphen-case`
- `Name cannot start/end with hyphen or contain consecutive hyphens`
- `Description cannot contain angle brackets`
- `Unexpected key(s) in SKILL.md frontmatter: xyz`

## Skill Structure Patterns

The generated SKILL.md includes guidance on four common structural patterns. Choose the one that best fits your skill's purpose:

### 1. Workflow-Based (Sequential Processes)

**Best for:** Clear step-by-step procedures

**Example:** Document processing with defined stages

**Structure:**
```markdown
## Overview
## Workflow Decision Tree
## Step 1: Analyze
## Step 2: Process
## Step 3: Validate
```

### 2. Task-Based (Tool Collections)

**Best for:** Skills offering different operations

**Example:** PDF manipulation with multiple capabilities

**Structure:**
```markdown
## Overview
## Quick Start
## Merge PDFs
## Split PDFs
## Extract Text
```

### 3. Reference/Guidelines (Standards)

**Best for:** Brand guidelines, coding standards

**Example:** Design system specifications

**Structure:**
```markdown
## Overview
## Guidelines
## Specifications
## Usage
```

### 4. Capabilities-Based (Integrated Systems)

**Best for:** Multiple interrelated features

**Example:** Product management workflows

**Structure:**
```markdown
## Overview
## Core Capabilities
### 1. Feature Planning
### 2. Requirement Gathering
### 3. Documentation
```

**Note:** Patterns can be mixed. Many skills combine approaches based on complexity.

## Resource Directories

### scripts/

Executable code (Python, Bash, etc.) that can be run directly.

**Purpose:**
- Automation scripts
- Data processing utilities
- Helper functions

**Characteristics:**
- May be executed without loading into context
- Can still be read by Claude for understanding

**Examples from other skills:**
- PDF skill: `fill_fillable_fields.py`, `extract_form_field_info.py`
- DOCX skill: `document.py`, `utilities.py`

### references/

Documentation and reference material loaded into context to inform Claude's process.

**Purpose:**
- API documentation
- Database schemas
- Workflow guides
- Comprehensive references

**Characteristics:**
- Loaded into context during skill execution
- Informs Claude's reasoning and approach

**Examples from other skills:**
- Product management: `communication.md`, `context_building.md`
- BigQuery: API reference docs
- Finance: Schema docs, policies

### assets/

Files not loaded into context, but used within Claude's output.

**Purpose:**
- Templates
- Boilerplate code
- Images, fonts, icons
- Sample data

**Characteristics:**
- Not read during execution
- Copied or used in final output

**Examples from other skills:**
- Brand styling: PowerPoint templates, logos
- Frontend builder: HTML/React boilerplate
- Typography: Font files

**Note:** Delete any unneeded directories. Not every skill requires all three types.

## Installation

### Prerequisites

- Claude Code installed
- Python 3.x available
- PyYAML library (for validation)

### Install PyYAML

The validation script requires PyYAML:

```bash
# Install via pip
pip install pyyaml

# Or via pip3
pip3 install pyyaml

# Verify installation
python3 -c "import yaml; print('PyYAML installed')"
```

### Add Plugin to Claude Code

```bash
# Add marketplace (if not already added)
/plugin marketplace add oskar-dragon/claude-code

# Install skill-creator plugin
/plugin install skill-creator@claude-code
```

## Usage Workflows

### Create a New Skill

```bash
# 1. Initialize skill
/skill-creator:init-skill my-awesome-skill

# 2. Edit the generated SKILL.md
# - Complete the description in frontmatter
# - Choose structural pattern
# - Write skill content
# - Delete guidance sections

# 3. Add custom resources
# - scripts/ - Add any automation scripts
# - references/ - Add documentation
# - assets/ - Add templates or files

# 4. Validate structure
/skill-creator:validate-skill .claude/skills/my-awesome-skill

# 5. Test the skill
# Skills in .claude/skills/ are automatically available to Claude Code
```

### Create Skill for a Plugin

```bash
# 1. Create skill in plugin's skills/ directory
/skill-creator:init-skill custom-helper --path plugins/my-plugin/skills

# 2. Edit and customize SKILL.md
# Same process as above

# 3. Validate
/skill-creator:validate-skill plugins/my-plugin/skills/custom-helper

# 4. Skill is now part of your plugin
```

### Validate Existing Skills

```bash
# Check all skills in .claude/skills/
/skill-creator:validate-skill .claude/skills/skill-one
/skill-creator:validate-skill .claude/skills/skill-two

# Check plugin skills
/skill-creator:validate-skill plugins/my-plugin/skills/my-skill
```

## Best Practices

### 1. Follow Naming Conventions

**Do:**
- `pdf-helper` ✓
- `data-analyzer` ✓
- `api-client` ✓

**Don't:**
- `PdfHelper` ✗ (not lowercase)
- `pdf_helper` ✗ (underscore not allowed)
- `-pdf-helper` ✗ (starts with hyphen)
- `pdf--helper` ✗ (consecutive hyphens)

### 2. Write Clear Descriptions

**Do:**
```yaml
description: Process PDF documents by filling forms, extracting text, and merging files. Use when working with PDF files or when user requests PDF operations.
```

**Don't:**
```yaml
description: Helper for PDFs  # Too vague
description: <PDF processor>  # Contains angle brackets (invalid)
```

### 3. Choose the Right Structure

- **Simple skill** (1-2 operations): Task-based structure
- **Sequential process**: Workflow-based structure
- **Guidelines/standards**: Reference structure
- **Complex system**: Capabilities-based structure

### 4. Organize Resources Appropriately

- **Executable code** → `scripts/`
- **Documentation** → `references/`
- **Templates/assets** → `assets/`
- Delete unused directories

### 5. Complete TODOs Before Using

The generated SKILL.md contains TODO items:
- Complete the description
- Choose and implement structural pattern
- Delete guidance sections
- Add actual content

Don't skip these steps—incomplete skills won't work properly.

### 6. Validate Before Committing

Always run validation before adding skills to version control:

```bash
/skill-creator:validate-skill .claude/skills/my-skill
```

Fix any errors before committing.

### 7. Test Skills After Creation

After creating a skill, test that Claude Code loads it:
- Skills in `.claude/skills/` are loaded automatically
- Test by requesting Claude to use the skill
- Verify the skill behaves as expected

## Troubleshooting

### PyYAML Import Error

**Issue:** Validation fails with `ModuleNotFoundError: No module named 'yaml'`

**Solution:**
```bash
pip install pyyaml
# or
pip3 install pyyaml
```

### Skill Directory Already Exists

**Issue:** `Error: Skill directory already exists`

**Solution:**
- Choose a different skill name, or
- Delete the existing directory, or
- Use `--path` to create in different location

### Invalid Skill Name

**Issue:** `Name 'MySkill' should be hyphen-case`

**Solution:**
- Use lowercase letters only: `my-skill`
- Replace underscores with hyphens: `my-skill` not `my_skill`
- Remove invalid characters

### Description Contains Angle Brackets

**Issue:** `Description cannot contain angle brackets (< or >)`

**Solution:**
Remove `<` and `>` characters from the description. These are restricted for security reasons.

### Unexpected Frontmatter Keys

**Issue:** `Unexpected key(s) in SKILL.md frontmatter: xyz`

**Solution:**
Only use allowed keys:
- `name`
- `description`
- `license`
- `allowed-tools`
- `metadata`

Move custom properties to the `metadata` field:

```yaml
---
name: my-skill
description: My skill description
metadata:
  custom-property: value
---
```

### Skill Not Loading in Claude Code

**Issue:** Created skill doesn't appear to be available

**Solution:**
1. Verify skill is in `.claude/skills/` directory
2. Run validation to check structure
3. Ensure SKILL.md has valid frontmatter
4. Check Claude Code logs for errors
5. Restart Claude Code if needed

## Reference Documentation

The plugin includes two reference documents adapted from Anthropic's skill-creator:

### output-patterns.md

Guidance on structuring Claude's output:
- **Template Pattern**: Structured output formats
- **Examples Pattern**: Demonstrating desired output
- When to use each approach

Located at: `plugins/skill-creator/references/output-patterns.md`

### workflows.md

Workflow patterns for complex multi-step tasks:
- **Sequential Workflows**: Step-by-step processes
- **Conditional Workflows**: Branching logic
- **Hybrid Workflows**: Combined approaches

Located at: `plugins/skill-creator/references/workflows.md`

## Source

This plugin adapts scripts from [Anthropic's official skill-creator](https://github.com/anthropics/skills/tree/main/skill-creator):

**Adapted Scripts:**
- `init_skill.py`: Modified to default to `.claude/skills` path
- `quick_validate.py`: Used as-is for validation

**Key Adaptation:**
- Original requires: `init_skill.py <skill-name> --path <path>`
- Adapted: `--path` defaults to `.claude/skills` when not specified

This ensures compatibility with Anthropic's skill format while providing Claude Code-specific convenience.

## Tips

- **Start simple**: Create basic skills first, add complexity later
- **Use validation frequently**: Catch errors early
- **Study existing skills**: Check `.claude/skills/` for examples
- **Test thoroughly**: Verify skills work as expected before sharing
- **Document clearly**: Good descriptions help Claude use skills correctly
- **Version control**: Commit skills to git for tracking changes
- **Share useful skills**: Consider contributing to the community
- **Keep skills focused**: One skill = one clear purpose
- **Update regularly**: Maintain skills as Claude Code evolves

## When to Use This Plugin

**Use for:**
- Creating new Claude Code skills from scratch
- Standardizing skill structure across projects
- Validating skill frontmatter and structure
- Setting up personal skill libraries
- Contributing skills to plugins

**Don't use for:**
- Creating full plugins (use for skills within plugins)
- General file creation (use regular Write tool)
- Non-skill documentation

## Requirements

- Claude Code installed
- Python 3.x available in PATH
- PyYAML library (`pip install pyyaml`)
- Write access to target directories

## Version

v1.0.0 - Initial release

Based on Anthropic's skill-creator scripts with adaptations for Claude Code workflow.
