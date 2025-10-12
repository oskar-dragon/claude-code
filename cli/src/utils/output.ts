export function printBanner(): void {
  console.log("");
  console.log("");
  console.log(" ██████╗ ██████╗███████╗");
  console.log("██╔════╝██╔════╝██╔════╝");
  console.log("██║     ██║     █████╗  ");
  console.log("██║     ██║     ██╔══╝  ");
  console.log("╚██████╗╚██████╗██║     ");
  console.log(" ╚═════╝ ╚═════╝╚═╝     ");
  console.log("┌─────────────────────────────────┐");
  console.log("│  Claude Code Flow System        │");
  console.log("└─────────────────────────────────┘");
  console.log("https://github.com/claude-code-flow");
  console.log("");
  console.log("");
}

export function printHeader(text: string): void {
  console.log("");
  console.log(text);
  console.log("=".repeat(text.length));
  console.log("");
}

export function printSection(emoji: string, text: string): void {
  console.log("");
  console.log(`${emoji} ${text}`);
}

export function printSuccess(text: string): void {
  console.log(`  ✅ ${text}`);
}

export function printError(text: string): void {
  console.log(`  ❌ ${text}`);
}

export function printWarning(text: string): void {
  console.log(`  ⚠️  ${text}`);
}

export function printInfo(text: string): void {
  console.log(`  ℹ️  ${text}`);
}

export function printStep(text: string): void {
  console.log(`  ${text}`);
}
