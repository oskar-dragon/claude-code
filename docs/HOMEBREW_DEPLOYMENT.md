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

1. Go to `oskar-dragon/claude-code-flow` repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `TAP_GITHUB_TOKEN`
5. Value: Paste the token from step 1
6. Click "Add secret"

## How It Works

When you push a tag (e.g., `v0.1.1`), the release workflow:

1. **Builds** binaries for all platforms (macOS ARM64, macOS x64, Linux x64)
2. **Calculates** SHA256 checksums for each binary
3. **Creates** GitHub release with binaries and checksums
4. **Updates** Homebrew formula in `oskar-dragon/homebrew-tools`:
   - Updates version number
   - Updates download URLs
   - Replaces placeholder SHA256s with actual checksums
   - Commits and pushes to tap repository

## Testing the Deployment

```bash
# Create and push a new tag
git tag v0.1.1
git push origin v0.1.1

# Wait for GitHub Actions to complete (~5 minutes)

# Test installation
brew tap oskar-dragon/tools
brew install claude-code-flow

# Verify
claude-code-flow --version
```

## Installation for Users

```bash
brew tap oskar-dragon/tools
brew install claude-code-flow
```

## Updating

When a new version is released, users can update with:

```bash
brew update
brew upgrade claude-code-flow
```
