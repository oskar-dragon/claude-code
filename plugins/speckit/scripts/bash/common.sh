#!/usr/bin/env bash
# Common functions and variables for SpecKit scripts

# Get repository root, with fallback for non-git repositories
get_repo_root() {
	if git rev-parse --show-toplevel >/dev/null 2>&1; then
		git rev-parse --show-toplevel
	else
		# Fall back to current directory for non-git repos
		pwd
	fi
}

# Check if we have git available
has_git() {
	git rev-parse --show-toplevel >/dev/null 2>&1
}

# Get .specify directory path
get_specify_dir() {
	local repo_root="$1"
	echo "$repo_root/.specify"
}

# Get specs directory path
get_specs_dir() {
	local repo_root="$1"
	echo "$repo_root/.specify/specs"
}

# Find highest feature number from specs directory
get_highest_feature_number() {
	local specs_dir="$1"
	local highest=0

	if [ -d "$specs_dir" ]; then
		for dir in "$specs_dir"/*; do
			[ -d "$dir" ] || continue
			dirname=$(basename "$dir")
			number=$(echo "$dirname" | grep -o '^[0-9]\+' || echo "0")
			number=$((10#$number))
			if [ "$number" -gt "$highest" ]; then
				highest=$number
			fi
		done
	fi

	echo "$highest"
}

# Clean and format a branch name
clean_branch_name() {
	local name="$1"
	echo "$name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-//' | sed 's/-$//'
}

# Check file exists
check_file() {
	[[ -f "$1" ]] && echo "  ✓ $2" || echo "  ✗ $2"
}

# Check directory exists and has files
check_dir() {
	[[ -d "$1" && -n $(ls -A "$1" 2>/dev/null) ]] && echo "  ✓ $2" || echo "  ✗ $2"
}

# Print error message and exit
error_exit() {
	echo "ERROR: $1" >&2
	exit 1
}

# Print warning message
warn() {
	echo "WARNING: $1" >&2
}

# Print info message
info() {
	echo "INFO: $1" >&2
}
