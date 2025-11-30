---
name: validate-skill
description: Validate Claude Code skill structure and SKILL.md frontmatter compliance
version: v1.0.0
author: Oskar Dragon
last_updated: 2025-11-30
argument-hint: "[skill-directory-path]"
---

# Validate Skill Command

Validate a Claude Code skill directory to ensure it follows the proper structure and SKILL.md frontmatter format.

## Arguments

**Optional:**
- `[skill-directory-path]`: Path to the skill directory to validate
  - If not provided, will prompt user to specify the skill location
  - Can be absolute path or relative to current working directory
  - Should point to the skill directory containing SKILL.md

## Examples

```bash
# Validate skill in default location
/skill-creator:validate-skill .claude/skills/my-skill

# Validate skill with relative path
/skill-creator:validate-skill plugins/my-plugin/skills/custom-skill

# Validate skill with absolute path
/skill-creator:validate-skill /Users/username/.claude/skills/helper-skill

# Run without arguments (will prompt for path)
/skill-creator:validate-skill
```

## Your Task

Parse the skill directory path from `$ARGUMENTS` and execute the quick_validate.py script:

**Script location:** `plugins/skill-creator/scripts/quick_validate.py`

### Argument Parsing

1. Extract skill directory path from arguments
2. If no path provided:
   - Ask user: "Please provide the path to the skill directory you want to validate"
   - Wait for response and use that path

### Execution

Run the Python script with the skill directory path:

```bash
python3 plugins/skill-creator/scripts/quick_validate.py <skill-directory-path>
```

### Dependencies

⚠️ **Important:** This script requires PyYAML to parse frontmatter.

If the script fails with a PyYAML import error:
1. Check if PyYAML is installed: `pip list | grep PyYAML`
2. If not installed, provide installation instructions:
   ```bash
   pip install pyyaml
   # or
   pip3 install pyyaml
   ```

### What the Script Validates

The script checks:

**SKILL.md Existence:**
- File must exist in the skill directory

**Frontmatter Structure:**
- Must start with `---`
- Must be valid YAML
- Must be a dictionary (not list or scalar)

**Required Fields:**
- `name`: Must be present
- `description`: Must be present

**Name Validation:**
- Hyphen-case format (lowercase letters, digits, hyphens only)
- Cannot start or end with hyphens
- Cannot contain consecutive hyphens (`--`)
- Max 64 characters

**Description Validation:**
- Cannot contain angle brackets (`<` or `>`)
- Max 1024 characters

**Allowed Properties:**
- Only these frontmatter keys allowed: `name`, `description`, `license`, `allowed-tools`, `metadata`
- Any other keys will cause validation failure

### Expected Output

**Success:**
```
Skill is valid!
```
Exit code: 0

**Failure:**
```
[Specific error message describing what's wrong]
```
Exit code: 1

### Common Validation Errors

**"SKILL.md not found"**
- The skill directory doesn't contain SKILL.md
- Check that you're pointing to the correct directory

**"No YAML frontmatter found"**
- SKILL.md doesn't start with `---`
- Add frontmatter at the top of the file

**"Missing 'name' in frontmatter"**
- Add `name: skill-name` to frontmatter

**"Missing 'description' in frontmatter"**
- Add `description: Your skill description` to frontmatter

**"Name 'XYZ' should be hyphen-case"**
- Use lowercase letters, digits, and hyphens only
- Example: `my-skill-name` not `My_Skill_Name`

**"Name cannot start/end with hyphen or contain consecutive hyphens"**
- Invalid: `-my-skill`, `my-skill-`, `my--skill`
- Valid: `my-skill`, `my-skill-name`

**"Description cannot contain angle brackets"**
- Remove `<` and `>` characters from description
- These are restricted to prevent XSS issues

**"Unexpected key(s) in SKILL.md frontmatter"**
- Only use allowed properties: `name`, `description`, `license`, `allowed-tools`, `metadata`
- Remove or move unexpected keys to the metadata field

### After Validation

If validation **passes:**
- Your skill is ready to use with Claude Code
- No further action needed

If validation **fails:**
1. Read the error message carefully
2. Edit the SKILL.md file to fix the issue
3. Run validation again to verify the fix
4. Repeat until validation passes

## Notes

- Validation follows the agent_skills_spec.md specification
- The same validation is used internally by Claude Code when loading skills
- It's recommended to validate skills before committing them to version control
- Validation only checks structure and frontmatter, not the quality of skill content

## Initial Input

$ARGUMENTS
