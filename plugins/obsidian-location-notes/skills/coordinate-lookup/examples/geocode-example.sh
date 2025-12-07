#!/bin/bash
# Example usage of the geocode.py utility script

# Set plugin root (in real usage, this is provided by Claude Code)
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"

echo "=== Geocoding Examples ==="
echo

echo "1. Basic usage with Nominatim (free):"
python3 "$PLUGIN_ROOT/scripts/geocode.py" "Eiffel Tower, Paris"
echo

echo "2. With Google Maps API (requires GOOGLE_MAPS_API_KEY):"
if [ -n "$GOOGLE_MAPS_API_KEY" ]; then
    python3 "$PLUGIN_ROOT/scripts/geocode.py" "Eiffel Tower, Paris" --use-google
else
    echo "   (Skipped - GOOGLE_MAPS_API_KEY not set)"
fi
echo

echo "3. Validating coordinates:"
python3 "$PLUGIN_ROOT/scripts/geocode.py" "48.858370, 2.294481" --validate-only
echo

echo "4. Invalid coordinates (should fail):"
python3 "$PLUGIN_ROOT/scripts/geocode.py" "100.0, 200.0" --validate-only 2>&1 || echo "   ✓ Validation correctly failed"
echo

echo "5. Location not found:"
python3 "$PLUGIN_ROOT/scripts/geocode.py" "NonexistentPlaceXYZ12345" 2>&1 || echo "   ✓ Correctly reported not found"
echo

echo "=== End Examples ==="
