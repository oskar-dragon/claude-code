# markdown-new Plugin

> Teach Claude to use markdown.new for web content fetching, reducing token usage by ~80%

## Overview

This plugin provides a skill that teaches Claude Code to use the [markdown.new](https://markdown.new) service instead of direct HTML fetching. By converting web pages to clean Markdown, you can reduce token usage by approximately 80% when analyzing web content.

## Features

- **Token Optimization**: 80% fewer tokens compared to raw HTML
- **Smart Conversion**: Three-tier conversion pipeline (native Markdown, AI, browser rendering)
- **Image Handling**: Option to retain or strip images based on use case
- **Flexible Methods**: Choose conversion method based on site complexity

## What is markdown.new?

markdown.new is a Cloudflare-powered service that converts any URL to clean Markdown using the native `text/markdown` content type. It automatically falls back through multiple conversion methods to ensure the best possible output.

### Conversion Pipeline

1. **Primary**: Native `text/markdown` from Cloudflare edge (zero parsing)
2. **Fallback 1**: Cloudflare Workers AI `toMarkdown()` (fast HTML conversion)
3. **Fallback 2**: Browser rendering for JavaScript-heavy pages

## Installation

### From Marketplace

```bash
/plugin marketplace add oskar-dragon/claude-code
/plugin install markdown-new@claude-code
```

### Local Development

```bash
cc --plugin-dir /path/to/claude-code/plugins/markdown-new
```

## Usage

The plugin provides a single skill that automatically activates when Claude needs to fetch web content. No manual invocation required.

### Basic Example

When you ask Claude to fetch a webpage, it will automatically use markdown.new:

```
User: "Fetch and summarize https://example.com/blog/post"
Claude: Uses https://markdown.new/https://example.com/blog/post
```

### With Images

For content where images matter:

```
User: "Fetch the documentation with images from https://example.com/docs"
Claude: Uses https://markdown.new/https://example.com/docs?retain_images=true
```

### JavaScript-Heavy Sites

For single-page applications:

```
User: "Fetch content from this React app: https://example.com"
Claude: Uses https://markdown.new/https://example.com?method=browser
```

## Components

### Skills

- **using-markdown-new**: Teaches Claude when and how to use markdown.new
  - Triggers on: "fetch", "website", "URL", "web page", "WebFetch", "scrape"
  - Progressive disclosure: Lean SKILL.md with detailed references and examples
  - Covers: conversion methods, image handling, edge cases

## Benefits

### Token Efficiency

```
HTML: <h2 class="section-title" id="about">About Us</h2>
Tokens: 12-15

Markdown: ## About Us
Tokens: 3

Reduction: 80%
```

### Context Window Optimization

- **5x more content** per context window
- **Faster processing** with less token overhead
- **Cleaner data** for AI analysis

## Learn More

- [markdown.new Homepage](https://markdown.new)
- [Cloudflare Blog Post](https://blog.cloudflare.com/markdown-for-agents/)
- [Skill Documentation](skills/using-markdown-new/SKILL.md)

## License

MIT
