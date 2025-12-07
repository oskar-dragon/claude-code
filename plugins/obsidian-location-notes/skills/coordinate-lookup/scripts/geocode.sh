#!/bin/bash
# Geocode a location using OpenStreetMap Nominatim API
# Usage: ./geocode.sh "Location Name" [country_code]
#
# Examples:
#   ./geocode.sh "Old Man of Storr"
#   ./geocode.sh "Dishoom" "gb"
#   ./geocode.sh "University of Bristol Botanic Gardens" "gb"

set -euo pipefail

# Check arguments
if [ $# -lt 1 ]; then
    echo "Usage: $0 \"Location Name\" [country_code]" >&2
    echo "Example: $0 \"Eiffel Tower\" \"fr\"" >&2
    exit 1
fi

LOCATION="$1"
COUNTRY="${2:-}"

# Build query URL
QUERY="https://nominatim.openstreetmap.org/search"
QUERY+="?q=$(echo "$LOCATION" | sed 's/ /+/g')"
QUERY+="&format=json&limit=5&addressdetails=1"

if [ -n "$COUNTRY" ]; then
    QUERY+="&countrycodes=$COUNTRY"
fi

# Query API with User-Agent header (required by Nominatim)
sleep 1  # Respect 1 req/second rate limit
RESPONSE=$(curl -s -H "User-Agent: ObsidianLocationNotes/0.1.0 (Claude Code Plugin)" "$QUERY")

# Check if response is empty array
if [ "$RESPONSE" = "[]" ]; then
    echo "Error: No results found for '$LOCATION'" >&2
    exit 1
fi

# Parse and display results
echo "$RESPONSE" | jq -r '
    if length == 0 then
        "No results found"
    else
        .[] |
        "Latitude: \(.lat)\nLongitude: \(.lon)\nLocation: \(.display_name)\nType: \(.type)\nImportance: \(.importance)\n---"
    end
'

# Output best result as YAML array format
echo ""
echo "Best result for Obsidian frontmatter:"
echo "$RESPONSE" | jq -r '
    if length > 0 then
        .[0] |
        "location:\n  - \(.lat)\n  - \(.lon)"
    else
        "# No coordinates found"
    end
'
