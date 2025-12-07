#!/usr/bin/env bash
# Update CLAUDE.md with SpecKit context for Claude Code

set -e

# Source common utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Get repository root
REPO_ROOT=$(get_repo_root)
CLAUDE_MD="$REPO_ROOT/CLAUDE.md"
SPECIFY_DIR=$(get_specify_dir "$REPO_ROOT")

# Check if .specify exists
if [ ! -d "$SPECIFY_DIR" ]; then
	warn ".specify directory not found. Skipping CLAUDE.md update."
	exit 0
fi

# Generate SpecKit context section
SPECKIT_CONTEXT=$(cat <<'EOF'

## SpecKit Context

This project uses **Spec-Driven Development (SDD)** methodology via the SpecKit plugin.

### Directory Structure

- `.specify/memory/constitution.md` - Project governing principles
- `.specify/specs/` - Feature specifications organized by number
- `.specify/templates/` - Templates for specs, plans, tasks, checklists
- `.specify/scripts/` - Automation scripts

### Available Commands

- `/speckit:constitution` - Create or update project principles
- `/speckit:specify <description>` - Create feature specification
- `/speckit:clarify` - Clarify underspecified requirements
- `/speckit:plan <tech stack>` - Create technical implementation plan
- `/speckit:tasks` - Generate executable task breakdown
- `/speckit:implement` - Execute tasks with progress tracking
- `/speckit:analyze` - Cross-artifact consistency analysis
- `/speckit:checklist` - Generate quality validation checklists
- `/speckit:taskstoissues` - Convert tasks to GitHub issues

### SDD Workflow

Follow this structured progression:

1. **Constitution** → Establish project principles (one-time)
2. **Specify** → Define WHAT and WHY (not HOW)
3. **Clarify** → Resolve ambiguities through Q&A
4. **Plan** → Create technical plan with tech stack
5. **Tasks** → Break down into executable tasks
6. **Implement** → Execute task-by-task
7. **Validate** → Ensure quality and consistency

### Best Practices

- Specifications are technology-agnostic (describe WHAT, not HOW)
- Technical decisions go in the plan, not the spec
- Constitution principles are immutable and guide all decisions
- Test-first development is enforced through phase gates
- Features are independently testable units

EOF
)

# Check if CLAUDE.md exists
if [ ! -f "$CLAUDE_MD" ]; then
	info "CLAUDE.md not found, creating with SpecKit context"
	echo "# CLAUDE.md" > "$CLAUDE_MD"
	echo "" >> "$CLAUDE_MD"
	echo "This file provides guidance to Claude Code when working with code in this repository." >> "$CLAUDE_MD"
	echo "$SPECKIT_CONTEXT" >> "$CLAUDE_MD"
	echo "✓ Created CLAUDE.md with SpecKit context"
else
	# Check if SpecKit context already exists
	if grep -q "## SpecKit Context" "$CLAUDE_MD"; then
		info "SpecKit context already exists in CLAUDE.md"
		read -p "Update existing SpecKit context? (y/n): " update
		if [ "$update" != "y" ]; then
			echo "Skipped CLAUDE.md update"
			exit 0
		fi

		# Remove old SpecKit context section
		sed -i.bak '/## SpecKit Context/,/^##[^#]/d' "$CLAUDE_MD"
	fi

	# Append new SpecKit context
	echo "$SPECKIT_CONTEXT" >> "$CLAUDE_MD"
	echo "✓ Updated CLAUDE.md with SpecKit context"
fi
