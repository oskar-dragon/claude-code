---
description: Initialize SpecKit directory structure and templates in the current repository
---

# SpecKit Setup

You are initializing the Spec-Driven Development (SDD) toolkit in this repository.

## Execution

Execute the setup script to create the `.specify/` directory structure with all necessary templates and scripts:

```bash
!${CLAUDE_PLUGIN_ROOT}/scripts/bash/setup.sh
```

The script will:

1. Check for existing `.specify/` directory and handle appropriately (skip/overwrite/merge)
2. Create directory structure: `memory/`, `specs/`,
3. Copy all templates from the plugin to the repository
4. Copy automation scripts (bash) to the repository
5. Initialize constitution template in `memory/constitution.md`
6. Make all scripts executable

## After Setup

Once setup completes, guide the user through the next steps:

1. **Create Project Constitution**: Run `/speckit:constitution` to establish governing principles
2. **Create First Feature**: Run `/speckit:specify <description>` to create a feature specification
3. **Follow SDD Workflow**: Constitution → Specify → Clarify → Plan → Tasks → Implement

## Important Notes

- Setup can be run multiple times (user chooses skip/overwrite/merge)
- The `.specify/` directory is created at the git root (or current directory if not in git)
- All templates and scripts are copied to the user's repository for customization
- Scripts use `${CLAUDE_PLUGIN_ROOT}` for portability across installations

## User Guidance

After the script completes, explain:

- Where files were created
- What each directory contains
- The SDD workflow sequence
- How to get started with `/speckit:constitution`
