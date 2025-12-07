#!/usr/bin/env bash
# Setup script to initialize SpecKit directory structure in a repository

set -e

# Source common utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Get repository root
REPO_ROOT=$(get_repo_root)
SPECIFY_DIR="$REPO_ROOT/.specify"

echo "SpecKit Setup"
echo "============="
echo ""
echo "Repository root: $REPO_ROOT"
echo "Target directory: $SPECIFY_DIR"
echo ""

# Check if .specify already exists
if [ -d "$SPECIFY_DIR" ]; then
	echo "⚠️  Directory $SPECIFY_DIR already exists."
	echo ""
	echo "What would you like to do?"
	echo "  1) Skip (keep existing files)"
	echo "  2) Overwrite all files (destructive)"
	echo "  3) Merge (add missing files, preserve existing)"
	echo "  4) Cancel"
	echo ""
	read -p "Enter choice (1-4): " choice

	case $choice in
		1)
			echo "✓ Skipping setup - using existing .specify directory"
			exit 0
			;;
		2)
			echo "⚠️  This will DELETE and recreate the .specify directory."
			read -p "Are you sure? (yes/no): " confirm
			if [ "$confirm" != "yes" ]; then
				echo "Cancelled."
				exit 0
			fi
			echo "Removing existing directory..."
			rm -rf "$SPECIFY_DIR"
			;;
		3)
			echo "✓ Merging - will preserve existing files"
			;;
		4)
			echo "Cancelled."
			exit 0
			;;
		*)
			echo "Invalid choice. Cancelled."
			exit 1
			;;
	esac
	echo ""
fi

# Create directory structure
echo "Creating directory structure..."
mkdir -p "$SPECIFY_DIR/memory"
mkdir -p "$SPECIFY_DIR/specs"
mkdir -p "$SPECIFY_DIR/scripts/bash"
mkdir -p "$SPECIFY_DIR/templates"
echo "✓ Directories created"
echo ""

# Copy templates from plugin
echo "Copying templates..."
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT}"

if [ -z "$PLUGIN_ROOT" ]; then
	error_exit "CLAUDE_PLUGIN_ROOT environment variable not set. This script must be run from a Claude Code command."
fi

# Copy templates
cp -n "$PLUGIN_ROOT/templates/spec-template.md" "$SPECIFY_DIR/templates/" 2>/dev/null || true
cp -n "$PLUGIN_ROOT/templates/plan-template.md" "$SPECIFY_DIR/templates/" 2>/dev/null || true
cp -n "$PLUGIN_ROOT/templates/tasks-template.md" "$SPECIFY_DIR/templates/" 2>/dev/null || true
cp -n "$PLUGIN_ROOT/templates/checklist-template.md" "$SPECIFY_DIR/templates/" 2>/dev/null || true
cp -n "$PLUGIN_ROOT/templates/agent-file-template.md" "$SPECIFY_DIR/templates/" 2>/dev/null || true
echo "✓ Templates copied"
echo ""

# Copy scripts
echo "Copying scripts..."
cp -n "$PLUGIN_ROOT/scripts/bash/common.sh" "$SPECIFY_DIR/scripts/bash/" 2>/dev/null || true
cp -n "$PLUGIN_ROOT/scripts/bash/create-new-feature.sh" "$SPECIFY_DIR/scripts/bash/" 2>/dev/null || true
cp -n "$PLUGIN_ROOT/scripts/bash/update-agent-context.sh" "$SPECIFY_DIR/scripts/bash/" 2>/dev/null || true

# Make scripts executable
chmod +x "$SPECIFY_DIR/scripts/bash/"*.sh 2>/dev/null || true
echo "✓ Scripts copied and made executable"
echo ""

# Initialize constitution template
echo "Initializing constitution template..."
if [ ! -f "$SPECIFY_DIR/memory/constitution.md" ]; then
	cp "$PLUGIN_ROOT/memory/constitution-template.md" "$SPECIFY_DIR/memory/constitution.md"
	echo "✓ Constitution template created"
else
	echo "  (already exists, skipping)"
fi
echo ""

# Success summary
echo "✅ SpecKit setup complete!"
echo ""
echo "Directory structure:"
check_dir "$SPECIFY_DIR/memory" "memory/ (project principles)"
check_dir "$SPECIFY_DIR/specs" "specs/ (feature specifications)"
check_dir "$SPECIFY_DIR/scripts/bash" "scripts/bash/ (automation)"
check_dir "$SPECIFY_DIR/templates" "templates/ (spec, plan, tasks)"
echo ""
echo "Next steps:"
echo "  1. Run: /speckit:constitution"
echo "     Create your project's governing principles"
echo ""
echo "  2. Run: /speckit:specify <feature description>"
echo "     Create your first feature specification"
echo ""
echo "  3. Follow the SDD workflow:"
echo "     Constitution → Specify → Clarify → Plan → Tasks → Implement"
echo ""
