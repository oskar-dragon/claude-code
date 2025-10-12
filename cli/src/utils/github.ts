import { $ } from "bun";

export async function hasGhCli(): Promise<boolean> {
  return await $`command -v gh`.quiet().nothrow();
}

export async function installGhCli(): Promise<boolean> {
  const hasBrew = await $`command -v brew`.quiet().nothrow();
  if (hasBrew) {
    return await $`brew install gh`.nothrow();
  }

  const hasApt = await $`command -v apt-get`.quiet().nothrow();
  if (hasApt) {
    return await $`sudo apt-get update && sudo apt-get install gh`.nothrow();
  }

  return false;
}

export async function isGhAuthenticated(): Promise<boolean> {
  return await $`gh auth status`.quiet().nothrow();
}

export async function authenticateGh(): Promise<boolean> {
  return await $`gh auth login`.nothrow();
}

export async function hasGhSubIssueExtension(): Promise<boolean> {
  const result = await $`gh extension list`.quiet().text();
  return result.includes("yahsan2/gh-sub-issue");
}

export async function installGhSubIssueExtension(): Promise<boolean> {
  return await $`gh extension install yahsan2/gh-sub-issue`.nothrow();
}

export async function isGhRepo(): Promise<boolean> {
  return await $`gh repo view`.quiet().nothrow();
}

export type LabelCreationResult = {
  epic: boolean;
  task: boolean;
};

export async function createGhLabels(): Promise<LabelCreationResult> {
  let epicCreated = false;
  let taskCreated = false;

  // Try to create epic label
  const epicResult = await $`gh label create epic --color 0E8A16 --description "Epic issue containing multiple related tasks" --force`
    .quiet()
    .nothrow();

  if (epicResult) {
    epicCreated = true;
  } else {
    // Check if it already exists
    const labels = await $`gh label list`.quiet().text();
    epicCreated = labels.split("\n").some((line) => line.startsWith("epic"));
  }

  // Try to create task label
  const taskResult = await $`gh label create task --color 1D76DB --description "Individual task within an epic" --force`
    .quiet()
    .nothrow();

  if (taskResult) {
    taskCreated = true;
  } else {
    // Check if it already exists
    const labels = await $`gh label list`.quiet().text();
    taskCreated = labels.split("\n").some((line) => line.startsWith("task"));
  }

  return { epic: epicCreated, task: taskCreated };
}

export async function getGhVersion(): Promise<string> {
  const result = await $`gh --version`.text();
  return result.split("\n")[0].trim();
}

export async function getGhExtensionCount(): Promise<number> {
  const result = await $`gh extension list`.quiet().text();
  return result.trim().split("\n").filter((line) => line.length > 0).length;
}

export async function getGhAuthStatus(): Promise<string> {
  const result = await $`gh auth status`.quiet().text();
  const match = result.match(/Logged in to ([^ ]*)/);
  return match ? match[0] : "Not authenticated";
}
