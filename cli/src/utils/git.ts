import { $ } from "bun";

export async function isGitRepository(): Promise<boolean> {
  const result = await $`git rev-parse --git-dir`.quiet().nothrow();
  return result.exitCode === 0;
}

export async function hasRemote(): Promise<boolean> {
  const result = await $`git remote -v`.quiet().text();
  return result.includes("origin");
}

export async function getRemoteUrl(): Promise<string | null> {
  try {
    const result = await $`git remote get-url origin`.quiet().text();
    return result.trim();
  } catch {
    return null;
  }
}

export type GitStatus = {
  isRepository: boolean;
  hasRemote: boolean;
  remoteUrl: string | null;
};

export async function checkGitStatus(): Promise<GitStatus> {
  const isRepository = await isGitRepository();

  if (!isRepository) {
    return {
      isRepository: false,
      hasRemote: false,
      remoteUrl: null,
    };
  }

  const hasRemoteConfigured = await hasRemote();
  const remoteUrl = hasRemoteConfigured ? await getRemoteUrl() : null;

  return {
    isRepository: true,
    hasRemote: hasRemoteConfigured,
    remoteUrl,
  };
}
