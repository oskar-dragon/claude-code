import { describe, it, expect } from "bun:test";
import { parsePreferences } from "../preferences";

const SOURCES_ONLY_CONTENT = `---
sources:
  - Lonely Planet
  - Atlas Obscura
  - iOverlander
---
`;

const OLD_FORMAT_CONTENT = `---
travel_style: adventurous
budget_level: mid-range
accommodation_preference:
  - hotels
interests:
  - food
dietary_restrictions: []
pace_preference: moderate
travel_companions: couple
preferred_sources:
  - Lonely Planet
sources:
  - Lonely Planet
  - Atlas Obscura
---
`;

describe("parsePreferences", () => {
  it("parses sources-only config", () => {
    const result = parsePreferences(SOURCES_ONLY_CONTENT);
    expect(result.sources).toEqual(["Lonely Planet", "Atlas Obscura", "iOverlander"]);
  });

  it("ignores old fields (travel_style, budget_level, etc.) silently", () => {
    const result = parsePreferences(OLD_FORMAT_CONTENT);
    expect(result.sources).toEqual(["Lonely Planet", "Atlas Obscura"]);
    expect((result as any).travel_style).toBeUndefined();
    expect((result as any).preferred_sources).toBeUndefined();
  });

  it("throws on missing frontmatter delimiters", () => {
    expect(() => parsePreferences("no frontmatter here")).toThrow("No YAML frontmatter found");
  });

  it("throws when sources field is absent", () => {
    const content = `---
travel_style: adventurous
---
`;
    expect(() => parsePreferences(content)).toThrow("Missing required field: sources");
  });

  it("throws when sources is an empty array", () => {
    const content = `---
sources: []
---
`;
    expect(() => parsePreferences(content)).toThrow("sources must be a non-empty array");
  });

  it("throws on invalid YAML", () => {
    const content = `---\n{\nbad yaml\n---`;
    expect(() => parsePreferences(content)).toThrow("Flow map must end with a }");
  });

  it("throws when sources contains non-strings", () => {
    const content = `---
sources:
  - 1
  - true
---
`;
    expect(() => parsePreferences(content)).toThrow("sources must be an array of strings");
  });
});
