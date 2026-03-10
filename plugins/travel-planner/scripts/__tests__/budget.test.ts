import { describe, it, expect } from "bun:test";
import { calculateBudget, formatBudgetTable, type BudgetBreakdown } from "../budget";

describe("calculateBudget", () => {
  it("calculates budget tier breakdown", () => {
    const result = calculateBudget(1000, "GBP", "budget");
    expect(result.total).toBe(1000);
    expect(result.currency).toBe("GBP");
    expect(result.categories.accommodation).toBe(400);
    expect(result.categories.food).toBe(250);
    expect(result.categories.activities).toBe(200);
    expect(result.categories.transport).toBe(100);
    expect(result.categories.misc).toBe(50);
  });

  it("calculates mid-range breakdown", () => {
    const result = calculateBudget(2000, "EUR", "mid-range");
    expect(result.categories.accommodation).toBe(700);
    expect(result.categories.food).toBe(500);
    expect(result.categories.activities).toBe(500);
    expect(result.categories.transport).toBe(200);
    expect(result.categories.misc).toBe(100);
  });

  it("calculates luxury breakdown", () => {
    const result = calculateBudget(5000, "USD", "luxury");
    expect(result.categories.accommodation).toBe(2250);
    expect(result.categories.food).toBe(1000);
    expect(result.categories.activities).toBe(1000);
    expect(result.categories.transport).toBe(500);
    expect(result.categories.misc).toBe(250);
  });

  it("defaults to mid-range for unknown tier", () => {
    const result = calculateBudget(1000, "GBP", "unknown");
    expect(result.categories.accommodation).toBe(350);
  });
});

describe("formatBudgetTable", () => {
  it("formats as markdown table", () => {
    const breakdown: BudgetBreakdown = {
      total: 1000,
      currency: "GBP",
      categories: {
        accommodation: 400,
        food: 250,
        activities: 200,
        transport: 100,
        misc: 50,
      },
    };

    const table = formatBudgetTable(breakdown);
    expect(table).toContain("| Category |");
    expect(table).toContain("| Accommodation | 400 GBP | 40% |");
    expect(table).toContain("| **Total** | **1000 GBP** | **100%** |");
  });
});
