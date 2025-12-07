#!/usr/bin/env python3
"""
Geocoding utility for looking up GPS coordinates.

Usage:
    python geocode.py "Location Name"
    python geocode.py "Location Name" --use-google

Environment Variables:
    GOOGLE_MAPS_API_KEY - Google Maps API key (optional)
"""

import argparse
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from typing import Optional, Tuple, Dict, Any


def geocode_nominatim(location: str) -> Optional[Dict[str, Any]]:
    """
    Geocode location using OpenStreetMap Nominatim (free, no API key).

    Args:
        location: Location name to geocode

    Returns:
        Dict with coordinates and metadata, or None if not found
    """
    base_url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": location,
        "format": "json",
        "limit": "1"
    }

    url = f"{base_url}?{urllib.parse.urlencode(params)}"

    try:
        # Nominatim requires User-Agent header
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "ObsidianLocationNotes/0.1.0"}
        )

        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())

            if data and len(data) > 0:
                result = data[0]
                return {
                    "location": location,
                    "coordinates": [
                        round(float(result["lat"]), 6),
                        round(float(result["lon"]), 6)
                    ],
                    "source": "nominatim",
                    "display_name": result.get("display_name", "")
                }

    except urllib.error.HTTPError as e:
        if e.code == 429:
            return {
                "error": "Rate limit exceeded",
                "source": "nominatim",
                "suggestion": "Wait 1 second before retrying"
            }
        return {
            "error": f"HTTP error: {e.code}",
            "source": "nominatim"
        }
    except Exception as e:
        return {
            "error": f"Request failed: {str(e)}",
            "source": "nominatim"
        }

    return {
        "error": "Location not found",
        "location": location,
        "source": "nominatim",
        "suggestion": "Try more specific query with city and country"
    }


def geocode_google(location: str, api_key: str) -> Optional[Dict[str, Any]]:
    """
    Geocode location using Google Maps Geocoding API.

    Args:
        location: Location name to geocode
        api_key: Google Maps API key

    Returns:
        Dict with coordinates and metadata, or None if not found
    """
    base_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": location,
        "key": api_key
    }

    url = f"{base_url}?{urllib.parse.urlencode(params)}"

    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())

            if data["status"] == "OK" and data.get("results"):
                result = data["results"][0]
                loc = result["geometry"]["location"]

                return {
                    "location": location,
                    "coordinates": [
                        round(float(loc["lat"]), 6),
                        round(float(loc["lng"]), 6)
                    ],
                    "source": "google",
                    "formatted_address": result.get("formatted_address", "")
                }
            elif data["status"] == "ZERO_RESULTS":
                return {
                    "error": "Location not found",
                    "location": location,
                    "source": "google",
                    "suggestion": "Try more specific query"
                }
            elif data["status"] == "REQUEST_DENIED":
                return {
                    "error": "API key invalid or request denied",
                    "source": "google",
                    "suggestion": "Check GOOGLE_MAPS_API_KEY environment variable"
                }
            else:
                return {
                    "error": f"API error: {data['status']}",
                    "source": "google"
                }

    except Exception as e:
        return {
            "error": f"Request failed: {str(e)}",
            "source": "google"
        }


def validate_coordinates(lat: float, lon: float) -> Tuple[bool, str]:
    """
    Validate coordinate ranges.

    Args:
        lat: Latitude
        lon: Longitude

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not (-90 <= lat <= 90):
        return False, f"Latitude {lat} out of range (-90 to 90)"

    if not (-180 <= lon <= 180):
        return False, f"Longitude {lon} out of range (-180 to 180)"

    return True, "Valid coordinates"


def main():
    """Main entry point for geocoding utility."""
    parser = argparse.ArgumentParser(
        description="Geocode location to GPS coordinates"
    )
    parser.add_argument(
        "location",
        help="Location name to geocode (e.g., 'Eiffel Tower, Paris')"
    )
    parser.add_argument(
        "--use-google",
        action="store_true",
        help="Use Google Maps API instead of Nominatim (requires GOOGLE_MAPS_API_KEY)"
    )
    parser.add_argument(
        "--validate-only",
        action="store_true",
        help="Only validate coordinates format (expects 'lat,lon')"
    )

    args = parser.parse_args()

    # Validate coordinates if requested
    if args.validate_only:
        try:
            parts = args.location.split(",")
            if len(parts) != 2:
                print(json.dumps({
                    "error": "Invalid format",
                    "suggestion": "Use 'latitude,longitude' format"
                }), file=sys.stderr)
                sys.exit(1)

            lat = float(parts[0].strip())
            lon = float(parts[1].strip())

            is_valid, message = validate_coordinates(lat, lon)
            if is_valid:
                print(json.dumps({
                    "valid": True,
                    "coordinates": [lat, lon],
                    "message": message
                }))
                sys.exit(0)
            else:
                print(json.dumps({
                    "valid": False,
                    "error": message
                }), file=sys.stderr)
                sys.exit(1)

        except ValueError as e:
            print(json.dumps({
                "error": f"Invalid number format: {str(e)}"
            }), file=sys.stderr)
            sys.exit(1)

    # Geocode using selected provider
    result = None

    if args.use_google:
        api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
        if not api_key:
            print(json.dumps({
                "error": "GOOGLE_MAPS_API_KEY environment variable not set",
                "suggestion": "Set API key or use Nominatim (remove --use-google flag)"
            }), file=sys.stderr)
            sys.exit(1)

        result = geocode_google(args.location, api_key)
    else:
        result = geocode_nominatim(args.location)

    # Output result
    if result:
        if "error" in result:
            print(json.dumps(result, indent=2), file=sys.stderr)
            sys.exit(1)
        else:
            # Validate coordinates before returning
            coords = result["coordinates"]
            is_valid, message = validate_coordinates(coords[0], coords[1])

            if not is_valid:
                print(json.dumps({
                    "error": "Invalid coordinates returned",
                    "details": message,
                    "coordinates": coords
                }), file=sys.stderr)
                sys.exit(1)

            print(json.dumps(result, indent=2))
            sys.exit(0)
    else:
        print(json.dumps({
            "error": "No result returned from geocoding service"
        }), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
