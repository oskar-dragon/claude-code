# Obsidian Slides Plugin

A Claude Code plugin for scaffolding Obsidian presentations with AI-generated content and talking points.

## Overview

This plugin helps you quickly create professional Obsidian presentations by:
- Generating slide content from multiple sources (PDFs, markdown files, text, URLs)
- Creating speaker notes with talking points for each slide
- Adding image hints to suggest where visuals would enhance your presentation
- Using your custom presentation template automatically

## Features

- **Multi-source support**: Combine content from PDFs, markdown files, pasted text, and URLs
- **Intelligent structure**: Automatically organizes content into well-structured slides
- **Speaker notes**: Generates talking points using Obsidian's `%%` comment syntax
- **Image hints**: Suggests where to add visuals with `![descriptive hint]` placeholders
- **Template integration**: Uses your existing Obsidian presentation template
- **Style customization**: Tailors content to your specified presentation style and audience

## Components

### Skill: `obsidian-presentations`
Knowledge base about creating effective Obsidian presentations, including syntax, structure, and best practices.

### Command: `create-presentation`
Interactive command to scaffold new presentations.

## Usage

### Creating a Presentation

Run the command:
```
/obsidian-slides:create-presentation
```

The command will guide you through:
1. Providing source materials (or detecting them from context)
2. Selecting presentation style/tone
3. Specifying target audience
4. Generating the presentation file

The presentation will be created in your current working directory using your template.

### Output Format

Generated presentations follow Obsidian's official Slides plugin format:
- Use `---` to separate slides
- Include speaker notes with `%%` syntax
- Suggest images with `![descriptive hint]` placeholders
- Include your template frontmatter

## Requirements

- Obsidian with the core Slides plugin enabled
- Presentation template at: `Templates/Presentation Template.md`

## Installation

1. Copy this plugin to your Claude Code plugins directory
2. Restart Claude Code or reload plugins
3. The plugin components will be available automatically

## License

MIT
