---
name: init-skill
description: Create a new Claude Code skill with proper directory structure and SKILL.md template
version: v1.0.0
author: Oskar Dragon
last_updated: 2025-11-30
argument-hint: "<skill-name> [--path <custom-path>]"
---

# Init Skill Command

Create a new Claude Code skill with the standard directory structure, SKILL.md template, and example resource files.

## Arguments

**Required:**
- `<skill-name>`: Hyphen-case skill name (e.g., `data-analyzer`, `pdf-helper`, `brand-guidelines`)
  - Lowercase letters, digits, and hyphens only
  - Max 64 characters
  - Must match directory name exactly

**Optional:**
- `--path <custom-path>`: Custom directory where skill should be created
  - Default: `.claude/skills` (if not specified)
  - Creates skill at `<path>/<skill-name>/`

## Examples

```bash
# Create skill in default location (.claude/skills/)
/skill-creator:init-skill my-new-skill

# Create skill in custom location
/skill-creator:init-skill my-new-skill --path plugins/my-plugin/skills

# Create skill for personal use
/skill-creator:init-skill custom-helper --path ~/.claude/skills
```

## Your Task

Parse the arguments from `$ARGUMENTS` and execute the init_skill.py script:

**Script location:** `plugins/skill-creator/scripts/init_skill.py`

### Argument Parsing

1. Extract skill name (first argument, required)
2. Check if `--path` flag is present:
   - If present: Use the value after `--path`
   - If not present: Script defaults to `.claude/skills`

### Execution

Run the Python script with appropriate arguments:

```bash
# If --path provided
python3 plugins/skill-creator/scripts/init_skill.py <skill-name> --path <path>

# If --path NOT provided (script uses default)
python3 plugins/skill-creator/scripts/init_skill.py <skill-name>
```

### What the Script Does

The script will:
1. Create directory at `<path>/<skill-name>/`
2. Generate `SKILL.md` with YAML frontmatter template
3. Create `scripts/` directory with `example.py`
4. Create `references/` directory with `api_reference.md`
5. Create `assets/` directory with `example_asset.txt`
6. Make scripts executable
7. Display success message with next steps

### Expected Output

The script provides clear feedback:
- ✅ Success messages for each created file/directory
- ❌ Error messages if directory exists or creation fails
- Next steps guidance

### Error Handling

If the script fails:
- Check that skill name follows naming requirements
- Verify the target directory is writable
- Ensure Python 3 is available
- Check if directory already exists (common cause)

### After Creation

Once the skill is created successfully:
1. Open the generated `SKILL.md` file
2. Complete all TODO items in the frontmatter and content
3. Customize or delete example files in `scripts/`, `references/`, and `assets/`
4. Run `/skill-creator:validate-skill <path-to-skill>` to check structure

## Notes

- Skills created in `.claude/skills/` are automatically available to Claude Code
- Skills can later be copied to plugin directories if needed
- The generated SKILL.md includes comprehensive guidance on structuring your skill
- All example files are meant to be replaced or deleted based on actual needs

## Initial Input

$ARGUMENTS
