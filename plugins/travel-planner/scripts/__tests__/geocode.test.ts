import { describe, it, expect, mock, beforeEach } from "bun:test";
import { geocode, selectBestResult, type NominatimResult } from "../geocode";

describe("selectBestResult", () => {
  const results: NominatimResult[] = [
    {
      lat: "51.4545",
      lon: "-2.5879",
      display_name: "Bristol, City of Bristol, England, United Kingdom",
      importance: 0.8,
      type: "city",
    },
    {
      lat: "41.6738",
      lon: "-72.9493",
      display_name: "Bristol, Hartford County, Connecticut, United States",
      importance: 0.5,
      type: "city",
    },
  ];

  it("selects highest importance result", () => {
    const best = selectBestResult(results);
    expect(best?.lat).toBe("51.4545");
  });

  it("returns null for empty results", () => {
    expect(selectBestResult([])).toBeNull();
  });
});

describe("geocode", () => {
  beforeEach(() => {
    mock.restore();
  });

  it("returns coordinates for a known location", async () => {
    const mockResponse = [
      {
        lat: "48.8566",
        lon: "2.3522",
        display_name: "Paris, Ile-de-France, France",
        importance: 0.9,
        type: "city",
      },
    ];

    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify(mockResponse))),
    ) as typeof fetch;

    const result = await geocode("Paris");
    expect(result).toEqual({
      lat: "48.8566",
      lon: "2.3522",
      display_name: "Paris, Ile-de-France, France",
    });
  });

  it("returns null when no results found", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify([]))),
    ) as typeof fetch;

    const result = await geocode("Nonexistent Place XYZ123");
    expect(result).toBeNull();
  });

  it("tries alternative search with country filter", async () => {
    let callCount = 0;
    globalThis.fetch = mock(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve(new Response(JSON.stringify([])));
      }
      return Promise.resolve(
        new Response(
          JSON.stringify([
            {
              lat: "35.0",
              lon: "38.0",
              display_name: "Wadi Rum, Jordan",
              importance: 0.6,
              type: "desert",
            },
          ]),
        ),
      );
    }) as typeof fetch;

    const result = await geocode("Wadi Rum", "Jordan");
    expect(result).not.toBeNull();
    expect(callCount).toBe(2);
  });
});
