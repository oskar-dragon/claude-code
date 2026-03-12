export interface BudgetBreakdown {
  total: number;
  currency: string;
  categories: {
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
    misc: number;
  };
}

type BudgetTier = "budget" | "mid-range" | "luxury";

const TIER_SPLITS: Record<BudgetTier, number[]> = {
  budget: [0.4, 0.25, 0.2, 0.1, 0.05],
  "mid-range": [0.35, 0.25, 0.25, 0.1, 0.05],
  luxury: [0.45, 0.2, 0.2, 0.1, 0.05],
};

const CATEGORY_NAMES = [
  "accommodation",
  "food",
  "activities",
  "transport",
  "misc",
] as const;

export function calculateBudget(
  total: number,
  currency: string,
  tier: string,
): BudgetBreakdown {
  const splits = TIER_SPLITS[tier as BudgetTier] ?? TIER_SPLITS["mid-range"];

  const categories = Object.fromEntries(
    CATEGORY_NAMES.map((name, i) => [name, Math.round(total * splits[i])]),
  ) as BudgetBreakdown["categories"];

  return { total, currency, categories };
}

export function formatBudgetTable(breakdown: BudgetBreakdown): string {
  const { total, currency, categories } = breakdown;
  const lines: string[] = ["| Category | Amount | % |", "|---|---|---|"];

  for (const name of CATEGORY_NAMES) {
    const amount = categories[name];
    const pct = Math.round((amount / total) * 100);
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    lines.push(`| ${label} | ${amount} ${currency} | ${pct}% |`);
  }

  lines.push(`| **Total** | **${total} ${currency}** | **100%** |`);
  return lines.join("\n");
}

// CLI entry point
if (import.meta.main) {
  const total = Number(process.argv[2]);
  const currency = process.argv[3];
  const tier = process.argv[4] ?? "mid-range";

  if (isNaN(total) || !currency) {
    console.error(
      JSON.stringify({
        error: "missing_arguments",
        message: "Usage: bun run budget.ts <total> <currency> [tier]",
      }),
    );
    process.exit(1);
  }

  const breakdown = calculateBudget(total, currency, tier);
  const table = formatBudgetTable(breakdown);
  console.log(table);
}
