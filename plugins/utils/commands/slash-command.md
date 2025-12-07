---
name: slash-command
description: "Generate slash commands for Claude Code plugins"
argument-hint: "[command-purpose] [--namespace <name of namespace e.g. utils>] [--name <plugin-name e.g. create-plugin>]"
version: v1.0.0
author: Oskar Dragon
---

You are a slash command generator for Claude Code plugins. Your task is to create well-structured, properly formatted slash command files based on user requirements.

## Context

- Command purpose: $1 (required)
- Namespace: $2 (optional "utils", "git", "epcc", "documentation")
- Plugin name: $3 (optional)

## Your Task

**STEP 1: Verify User Input**

- Verify if the user has provided the command purpose. If not, use AskUserQuestion tool to ask: "What is the primary purpose of this command?". Analyse the command and if the requirement is vague, ask for more details.

**STEP 2: Gather Command Requirements**

Analyse the command purpose provided by the user and infer the arguments that will be required for the command, description of the command.

Then, use AskUserQuestion tool to collect (ask ALL questions in a single call):

1. **Command Name** (header: "Command Name")
   - Question: "What should the command be named? (Use kebab-case, e.g., 'create-api', 'review-code')"
   - Options:
     - "[name_1]" - [description_1]
     - "[name_2]" - [description_2]
     - "[name_3]" - [description_3]
     - (User can provide custom name via "Other")

2. **Accepts Arguments** (header: "Arguments")
   - Question: "Does this command accept arguments from the user?"
   - Options:
     - "Yes, required arguments" - Command needs user input to function
     - "Yes, optional arguments" - Command works with or without input
     - "No arguments needed" - Command is self-contained
     - "Uses flags/options" - Command accepts --flag style options
     - "Infer from context" - Automatically determine based on command purpose

**STEP 3: Analyse and iterate**

Analyse provided information by the user. If there is any inambiguity, ask the user for more details about the the detail that it is missing. If there is no ambiguity, proceed to the next step.

**STEP 4: Validate Target Location**

Calculate target path:

- `plugins/{namespace}/commands/{command-name}.md`

Check if plugin directory exists:

- Use Bash tool: `ls -la plugins/{namespace}/commands 2>/dev/null || echo "NOT_FOUND"`
- IF directory NOT_FOUND:
  - WARN user: "Plugin '{namespace}' does not exist in plugins directory"
  - Ask if they want to proceed anyway or choose different namespace

Check if command file already exists:

- Use Bash tool: `test -f plugins/{namespace}/commands/{command-name}.md && echo "EXISTS" || echo "NEW"`
- IF EXISTS:
  - Ask user: "Command file already exists. Overwrite?"
  - IF no → STOP and inform user
  - IF yes → PROCEED with overwrite

**STEP 5: Generate Command Content**

Based on gathered requirements, generate the slash command markdown with this structure:

```markdown
---
name: [command-name]
description: "[user-provided description]"
argument-hint: "[generated based on user's argument requirements]"
version: v1.0.0
author: Oskar Dragon
---

## Context

[Context required]

## Your Task

### STEP 1: [Step 1 Title]

[Step 1 instruction]

### STEP 2: [Step 2 Title]

[Step 2 instruction]

### STEP 3: [Step 3 Title]

[Step 3 instruction]

[More Steps]
```

**STEP 6: Write Command File**

Use Write tool to create the file:

- Path: `plugins/{namespace}/commands/{command-name}.md`
- Content: The generated markdown from Step 4
- Ensure proper YAML frontmatter formatting
- Ensure markdown is well-structured

**STEP 6: Provide Usage Instructions**

Display to user:

```
✅ Slash command created successfully!

Location: plugins/{namespace}/commands/{command-name}.md
Command: /{namespace}:{command-name}
Arguments: {argument-hint or "none"}

Usage:
  /{namespace}:{command-name} {show example with arguments}

Next steps:
  1. Review the generated command file
  2. Test the command: /{namespace}:{command-name}
```

## Rules

**Frontmatter Generation Rules:**
[target] [--level basic|intermediate|advanced] [--format text|examples|interactive] [--context domain]

- `description`: Brief description (1-2 sentences max)
- `argument-hint`:
  - IF no args, skip this compeltely
  - IF args: `"[required-arg]"`
  - IF flags: `"[--flag1 <options>]"`
  - IF multiple: `"[required-arg] [--flags <options>]"`
- Flags can accept free text e.g. `"[--flag1 <free text>]"` or options e.g `"[--flag1 option1|option2]"`.

## Examples

### Example 1: Simple command without arguments

```
/utils:slash-command utils hello
```

Creates a command that prints a greeting, no arguments needed.

### Example 2: Command with arguments

```
/utils:slash-command git quick-commit
```

Creates a command that accepts a commit message and creates a git commit.

### Example 3: File-generating command

```
/utils:slash-command documentation create-readme
```

Creates a command that generates README.md files based on project analysis.

### Example 4: Namespaced command

```
/utils:slash-command epcc my-agent workflow-plugin
```

Creates: plugins/epcc/commands/my-agent.md
Available as: /epcc:my-agent

## Important Notes

- Command names MUST use kebab-case (lowercase with hyphens)
- YAML frontmatter MUST be valid (proper indentation, quotes where needed)
- Use AskUserQuestion tool for interactive gathering of information
- Always validate file paths before writing
- Provide clear success messages with usage examples
- Include error handling in generated commands where appropriate
