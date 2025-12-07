#!/usr/bin/env bash
# Create a new feature specification with branch and directory structure

set -e

# Source common utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Parse arguments
JSON_MODE=false
SHORT_NAME=""
BRANCH_NUMBER=""
ARGS=()
i=1

while [ $i -le $# ]; do
	arg="${!i}"
	case "$arg" in
		--json)
			JSON_MODE=true
			;;
		--short-name)
			if [ $((i + 1)) -gt $# ]; then
				error_exit "--short-name requires a value"
			fi
			i=$((i + 1))
			next_arg="${!i}"
			if [[ "$next_arg" == --* ]]; then
				error_exit "--short-name requires a value"
			fi
			SHORT_NAME="$next_arg"
			;;
		--number)
			if [ $((i + 1)) -gt $# ]; then
				error_exit "--number requires a value"
			fi
			i=$((i + 1))
			next_arg="${!i}"
			if [[ "$next_arg" == --* ]]; then
				error_exit "--number requires a value"
			fi
			BRANCH_NUMBER="$next_arg"
			;;
		--help|-h)
			echo "Usage: $0 [--json] [--short-name <name>] [--number N] <feature_description>"
			echo ""
			echo "Options:"
			echo "  --json              Output in JSON format"
			echo "  --short-name <name> Provide a custom short name (2-4 words) for the branch"
			echo "  --number N          Specify branch number manually (overrides auto-detection)"
			echo "  --help, -h          Show this help message"
			echo ""
			echo "Examples:"
			echo "  $0 'Add user authentication system' --short-name 'user-auth'"
			echo "  $0 'Implement OAuth2 integration for API' --number 5"
			exit 0
			;;
		*)
			ARGS+=("$arg")
			;;
	esac
	i=$((i + 1))
done

FEATURE_DESCRIPTION="${ARGS[*]}"
if [ -z "$FEATURE_DESCRIPTION" ]; then
	error_exit "Feature description is required. Usage: $0 [options] <feature_description>"
fi

# Get repository root
REPO_ROOT=$(get_repo_root)
HAS_GIT=$(has_git && echo "true" || echo "false")

cd "$REPO_ROOT"

# Get .specify paths
SPECIFY_DIR=$(get_specify_dir "$REPO_ROOT")
SPECS_DIR=$(get_specs_dir "$REPO_ROOT")

# Check if .specify exists
if [ ! -d "$SPECIFY_DIR" ]; then
	error_exit ".specify directory not found. Please run /speckit:setup first."
fi

mkdir -p "$SPECS_DIR"

# Generate branch name suffix if not provided
if [ -z "$SHORT_NAME" ]; then
	# Simple generation: take first meaningful words
	SHORT_NAME=$(echo "$FEATURE_DESCRIPTION" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/ /g' | awk '{for(i=1;i<=NF && i<=3;i++) printf "%s%s", $i, (i<NF && i<3)?"-":""}')
	SHORT_NAME=$(clean_branch_name "$SHORT_NAME")
fi

# Determine branch number (check local specs only)
if [ -z "$BRANCH_NUMBER" ]; then
	HIGHEST=$(get_highest_feature_number "$SPECS_DIR")
	BRANCH_NUMBER=$((HIGHEST + 1))
fi

# Format feature number and branch name
FEATURE_NUM=$(printf "%03d" "$((10#$BRANCH_NUMBER))")
BRANCH_NAME="${FEATURE_NUM}-${SHORT_NAME}"

# Validate branch name length (GitHub limit: 244 bytes)
MAX_BRANCH_LENGTH=244
if [ ${#BRANCH_NAME} -gt $MAX_BRANCH_LENGTH ]; then
	MAX_SUFFIX_LENGTH=$((MAX_BRANCH_LENGTH - 4))
	TRUNCATED_SUFFIX=$(echo "$SHORT_NAME" | cut -c1-$MAX_SUFFIX_LENGTH | sed 's/-$//')
	warn "Branch name truncated from ${#BRANCH_NAME} to $MAX_BRANCH_LENGTH bytes"
	BRANCH_NAME="${FEATURE_NUM}-${TRUNCATED_SUFFIX}"
fi

# Create git branch if in git repo
if [ "$HAS_GIT" = "true" ]; then
	# Check if branch already exists
	if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
		# Branch exists locally, try to create dir only
		warn "Branch $BRANCH_NAME already exists locally"
		info "Creating spec directory without creating branch"
	elif git ls-remote --heads origin "$BRANCH_NAME" 2>/dev/null | grep -q "$BRANCH_NAME"; then
		# Branch exists on remote
		warn "Branch $BRANCH_NAME exists on remote"
		info "Creating spec directory without creating branch"
	else
		# Branch doesn't exist, create it
		git checkout -b "$BRANCH_NAME" || warn "Failed to create branch, continuing with directory creation"
	fi
else
	warn "Git repository not detected; skipping branch creation"
fi

# Create feature directory
FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"
mkdir -p "$FEATURE_DIR"

# Copy spec template
TEMPLATE="$SPECIFY_DIR/templates/spec-template.md"
SPEC_FILE="$FEATURE_DIR/spec.md"

if [ -f "$TEMPLATE" ]; then
	cp "$TEMPLATE" "$SPEC_FILE"
else
	warn "Spec template not found, creating empty spec file"
	touch "$SPEC_FILE"
fi

# Output results
if $JSON_MODE; then
	printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":"%s","FEATURE_DIR":"%s"}\n' \
		"$BRANCH_NAME" "$SPEC_FILE" "$FEATURE_NUM" "$FEATURE_DIR"
else
	echo "Feature created successfully!"
	echo ""
	echo "  Branch name: $BRANCH_NAME"
	echo "  Feature number: $FEATURE_NUM"
	echo "  Spec file: $SPEC_FILE"
	echo "  Feature directory: $FEATURE_DIR"
	echo ""
fi
