#!/bin/bash
# Examples of geocoding various location types using Nominatim API

USER_AGENT="ObsidianLocationNotes/0.1.0 (Claude Code Plugin)"
BASE_URL="https://nominatim.openstreetmap.org/search"

# Helper function to query and display results
geocode() {
    local query="$1"
    local country="${2:-}"
    local url="$BASE_URL?q=${query}&format=json&limit=3"

    if [ -n "$country" ]; then
        url+="&countrycodes=$country"
    fi

    echo "Query: $query"
    echo "URL: $url"
    echo "---"

    sleep 1  # Respect rate limit
    curl -s -H "User-Agent: $USER_AGENT" "$url" | \
        jq -r '.[] | "  Lat: \(.lat), Lon: \(.lon)\n  Name: \(.display_name)\n  Type: \(.type)\n  Importance: \(.importance)\n"'

    echo ""
}

echo "=== Example 1: Famous Landmark ==="
geocode "Eiffel+Tower" "fr"

echo "=== Example 2: Natural Feature ==="
geocode "Old+Man+of+Storr" "gb"

echo "=== Example 3: Restaurant with City ==="
geocode "Dishoom+Edinburgh" "gb"

echo "=== Example 4: Botanical Garden ==="
geocode "University+of+Bristol+Botanic+Gardens" "gb"

echo "=== Example 5: Generic Name (needs country filter) ==="
geocode "Central+Park"  # Without country - ambiguous
geocode "Central+Park" "us"  # With country - specific

echo "=== Example 6: Accommodation ==="
geocode "Glencoe+Campsite" "gb"

echo "=== Example 7: Photography Location ==="
geocode "Fairy+Pools+Isle+of+Skye" "gb"

echo "=== Example 8: Failed Lookup ==="
geocode "NonexistentPlaceThatDoesNotExist12345"

echo "=== Example 9: Alternative Name Format ==="
geocode "Bristol+Botanical+Garden" "gb"  # Alternative spelling

echo "=== Example 10: Structured Address ==="
# Using structured query parameters
sleep 1
curl -s -H "User-Agent: $USER_AGENT" \
    "$BASE_URL?street=The+Holmes&city=Bristol&postalcode=BS9+1JG&country=UK&format=json" | \
    jq -r '.[] | "  Lat: \(.lat), Lon: \(.lon)\n  Name: \(.display_name)\n"'
