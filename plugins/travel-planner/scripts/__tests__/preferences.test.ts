import { describe, it, expect } from "bun:test";
import { parsePreferences, type Preferences } from "../preferences";

const SAMPLE_CONTENT = `---
travel_style: adventurous
budget_level: mid-range
accommodation_preference:
  - boutique hotels
  - Airbnb
interests:
  - culture
  - food
  - photography
dietary_restrictions: []
pace_preference: moderate
travel_companions: couple
preferred_sources:
  - https://www.atlasobscura.com
  - https://www.alltrails.com
---

## Notes
Some free-form notes here.
`;

const MINIMAL_CONTENT = `---
travel_style: budget
budget_level: budget
accommodation_preference: []
interests: []
dietary_restrictions: []
pace_preference: relaxed
travel_companions: solo
preferred_sources: []
---
`;

describe("parsePreferences", () => {
  it("parses full preferences with all fields", () => {
    const result = parsePreferences(SAMPLE_CONTENT);
    expect(result.travel_style).toBe("adventurous");
    expect(result.budget_level).toBe("mid-range");
    expect(result.accommodation_preference).toEqual(["boutique hotels", "Airbnb"]);
    expect(result.interests).toEqual(["culture", "food", "photography"]);
    expect(result.dietary_restrictions).toEqual([]);
    expect(result.pace_preference).toBe("moderate");
    expect(result.travel_companions).toBe("couple");
    expect(result.preferred_sources).toEqual([
      "https://www.atlasobscura.com",
      "https://www.alltrails.com",
    ]);
  });

  it("parses minimal preferences", () => {
    const result = parsePreferences(MINIMAL_CONTENT);
    expect(result.travel_style).toBe("budget");
    expect(result.preferred_sources).toEqual([]);
  });

  it("throws on missing frontmatter delimiters", () => {
    expect(() => parsePreferences("no frontmatter here")).toThrow();
  });

  it("throws on missing required field", () => {
    const content = `---
travel_style: adventurous
---
`;
    expect(() => parsePreferences(content)).toThrow();
  });
});
