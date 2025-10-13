# Homebrew Deployment Setup

This document explains how the automated Homebrew deployment works.

## Prerequisites

### 1. Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: `Homebrew Tap Update`
4. Scopes: Select `repo` (full control of private repositories)
5. Click "Generate token"
6. Copy the token (you won't see it again)

### 2. Add Token to Repository Secret

1. Go to `oskar-dragon/claude-code` repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `TAP_GITHUB_TOKEN`
5. Value: Paste the token from step 1
6. Click "Add secret"

## How It Works

When you publish a GitHub release, the release workflow:

1. **Builds** binaries for all platforms (macOS ARM64, macOS x64, Linux x64)
2. **Calculates** SHA256 checksums for each binary
3. **Uploads** binaries and checksums to the release
4. **Updates** Homebrew formula in `oskar-dragon/homebrew-tools`:
   - Generates formula from template (`Formula/claude-code-flow.rb.template`)
   - Replaces placeholders with version and actual SHA256 checksums
   - Commits and pushes generated formula to tap repository

### Template-Based Approach

The tap repository contains a template file (`Formula/claude-code-flow.rb.template`) with placeholders:
- `VERSION_PLACEHOLDER` - Replaced with release version
- `ARM64_SHA_PLACEHOLDER` - Replaced with macOS ARM64 SHA256
- `X64_SHA_PLACEHOLDER` - Replaced with macOS x64 SHA256
- `LINUX_SHA_PLACEHOLDER` - Replaced with Linux x64 SHA256

This ensures SHA values are always updated correctly on each release.

## Creating a Release

### Via GitHub UI (Recommended)

1. Go to repository → Releases → "Draft a new release"
2. Click "Choose a tag" → Type new version (e.g., `v0.1.1`) → "Create new tag"
3. Set release title: `v0.1.1`
4. Add release notes describing changes
5. Click "Publish release"
6. GitHub Actions will automatically build and deploy (~5 minutes)

### Via GitHub CLI

```bash
gh release create v0.1.1 --title "v0.1.1" --notes "Release notes here"
```

## Testing the Deployment

After publishing a release:

```bash
# Wait for GitHub Actions to complete (~5 minutes)

# Test installation
brew tap oskardragon/tools
brew install claude-code-flow

# Verify
claude-code-flow --version
```

## Installation for Users

```bash
brew tap oskardragon/tools
brew install claude-code-flow
```

## Updating

When a new version is released, users can update with:

```bash
brew update
brew upgrade claude-code-flow
```
