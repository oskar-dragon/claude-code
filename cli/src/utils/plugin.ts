import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

type MarketplaceEntry = {
	source: {
		source: "directory";
		path: string;
	};
	installLocation: string;
	lastUpdated: string;
};

type KnownMarketplaces = Record<string, MarketplaceEntry>;

type ClaudeSettings = {
	enabledPlugins?: Record<string, boolean>;
	[key: string]: unknown;
};

async function fileExists(filePath: string): Promise<boolean> {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

export async function findProjectRoot(startPath: string = process.cwd()): Promise<string | null> {
	let currentPath = resolve(startPath);
	const root = resolve("/");

	while (currentPath !== root) {
		const claudePluginPath = join(currentPath, ".claude-plugin");
		if (await fileExists(claudePluginPath)) {
			return currentPath;
		}
		currentPath = dirname(currentPath);
	}

	return null;
}

async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
	if (!(await fileExists(filePath))) {
		return defaultValue;
	}
	const content = await readFile(filePath, "utf-8");
	return JSON.parse(content) as T;
}

async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
	const dirPath = dirname(filePath);
	await mkdir(dirPath, { recursive: true });
	await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export type MarketplaceResult = {
	registered: boolean;
	updated: boolean;
	existed: boolean;
	previousPath?: string;
};

export async function registerMarketplace(
	marketplaceName: string,
	projectPath: string
): Promise<MarketplaceResult> {
	const claudeDir = join(homedir(), ".claude", "plugins");
	const knownMarketplacesPath = join(claudeDir, "known_marketplaces.json");

	const marketplaces = await readJsonFile<KnownMarketplaces>(knownMarketplacesPath, {});

	const existing = marketplaces[marketplaceName];

	// If exists with same path, no action needed
	if (existing && existing.source.path === projectPath) {
		return {
			registered: false,
			updated: false,
			existed: true,
			previousPath: projectPath,
		};
	}

	// If exists with different path, update it
	if (existing) {
		const previousPath = existing.source.path;
		marketplaces[marketplaceName] = {
			source: {
				source: "directory",
				path: projectPath,
			},
			installLocation: projectPath,
			lastUpdated: new Date().toISOString(),
		};
		await writeJsonFile(knownMarketplacesPath, marketplaces);
		return {
			registered: false,
			updated: true,
			existed: true,
			previousPath,
		};
	}

	// Register new marketplace
	marketplaces[marketplaceName] = {
		source: {
			source: "directory",
			path: projectPath,
		},
		installLocation: projectPath,
		lastUpdated: new Date().toISOString(),
	};

	await writeJsonFile(knownMarketplacesPath, marketplaces);
	return {
		registered: true,
		updated: false,
		existed: false,
	};
}

export async function enablePlugin(pluginName: string, marketplaceName: string): Promise<boolean> {
	const settingsPath = join(homedir(), ".claude", "settings.json");

	const settings = await readJsonFile<ClaudeSettings>(settingsPath, {});

	// Initialize enabledPlugins if it doesn't exist
	if (!settings.enabledPlugins) {
		settings.enabledPlugins = {};
	}

	const pluginKey = `${pluginName}@${marketplaceName}`;

	// Check if already enabled
	if (settings.enabledPlugins[pluginKey] === true) {
		return false;
	}

	// Enable plugin
	settings.enabledPlugins[pluginKey] = true;

	await writeJsonFile(settingsPath, settings);
	return true;
}

export type InstallResult = {
	marketplaceResult: MarketplaceResult;
	pluginEnabled: boolean;
	pluginExisted: boolean;
	projectPath: string;
	error?: string;
};

export async function installPlugin(
	pluginName: string,
	marketplaceName: string,
	projectPath: string
): Promise<InstallResult> {
	try {
		const marketplaceResult = await registerMarketplace(marketplaceName, projectPath);
		const pluginEnabled = await enablePlugin(pluginName, marketplaceName);

		return {
			marketplaceResult,
			pluginEnabled,
			pluginExisted: !pluginEnabled,
			projectPath,
		};
	} catch (error) {
		return {
			marketplaceResult: {
				registered: false,
				updated: false,
				existed: false,
			},
			pluginEnabled: false,
			pluginExisted: false,
			projectPath,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
