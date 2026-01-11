---
name: obsidian-presentations
description: This skill should be used when the user asks to "create an Obsidian presentation", "create a presentation", "scaffold slides", "generate a slideshow", "build presentation slides", or mentions creating presentations in Obsidian. Provides comprehensive guidance on creating effective Obsidian presentations with proper syntax, structure, and speaker notes.
version: 0.1.0
---

# Creating Obsidian Presentations

## Purpose

This skill provides guidance for creating effective presentations using Obsidian's official Slides core plugin. It covers the essential syntax, slide structure, content organization, and best practices for generating presentations with speaker notes and image hints.

## When to Use This Skill

Use this skill when creating presentations in Obsidian from source materials such as PDFs, markdown files, text, or URLs. The skill applies to scaffolding new presentations that combine content from multiple sources into well-structured slides with talking points.

## Core Workflow

### 1. Gather and Analyze Source Materials

Start by collecting all source materials:
- Read PDF files to extract key information
- Parse markdown documents for relevant content
- Extract information from URLs using web fetch
- Analyze pasted text or notes

Identify the main themes, key points, and supporting details that will form the presentation structure.

### 2. Structure the Presentation

Organize content into a logical flow:

**Opening (1-2 slides):**
- Title slide with presentation topic
- Optional overview or agenda slide

**Body (3-8 slides):**
- Main content slides, each covering one key concept
- Support each point with evidence from source materials
- Limit each slide to 3-5 key points for clarity

**Closing (1-2 slides):**
- Summary or key takeaways
- Optional call-to-action or next steps slide

### 3. Apply Obsidian Slides Syntax

Use Obsidian's official Slides plugin syntax:

**Slide Separator:**
```markdown
---
```

Use exactly three hyphens on a line surrounded by blank lines to separate slides.

**Speaker Notes:**
```markdown
%%
Speaker notes go here. These are visible only to the presenter.
Include talking points, timing cues, and reminders.
%%
```

Use Obsidian's comment syntax for speaker notes on each slide.

**Image Hints:**
```markdown
![Descriptive hint about what image would fit here]
```

Add image placeholders with descriptive hints to suggest where visuals would enhance the presentation.

### 4. Generate Slide Content

For each slide, create:

**Slide Title:**
Use heading syntax (`##` for slide titles) to create clear, concise titles.

**Content:**
- Use bullet points for main ideas
- Keep text minimal and scannable
- Use **bold** for emphasis
- Use *italics* for secondary emphasis
- Include code blocks when presenting technical content

**Speaker Notes:**
Add comprehensive talking points that:
- Expand on slide content
- Provide context and examples
- Include timing estimates
- Suggest transitions to next slide

**Image Hints:**
Suggest relevant visuals that would:
- Illustrate complex concepts
- Provide visual breaks in text-heavy content
- Show data, charts, or diagrams
- Demonstrate examples or case studies

### 5. Tailor Content to Audience and Style

Adjust content based on:

**Presentation Style:**
- **Formal**: Professional language, structured format, thorough coverage
- **Casual**: Conversational tone, lighter content, engaging examples
- **Technical**: Detailed explanations, code samples, architecture diagrams
- **Teaching**: Step-by-step progression, interactive elements, practice exercises

**Target Audience:**
- Adjust complexity level to audience expertise
- Use appropriate terminology and jargon
- Include relevant examples and use cases
- Anticipate questions and address them in speaker notes

## Content Organization Strategies

### From Multiple Sources

When combining content from various sources:

1. **Identify common themes** across all sources
2. **Extract unique insights** from each source
3. **Synthesize information** into cohesive narrative
4. **Attribute key facts** in speaker notes when relevant
5. **Avoid redundancy** by consolidating similar points

### Information Hierarchy

Structure each slide with clear hierarchy:

**Primary (Slide Title):** Main concept or question
**Secondary (Bullets):** Supporting points or answers
**Tertiary (Speaker Notes):** Detailed explanations and context

### Slide Density

Balance information density:
- **Light slides** (1-3 bullets): For introductory or transition slides
- **Medium slides** (3-5 bullets): For main content slides
- **Dense slides** (5-7 bullets): Use sparingly, only when necessary

Add more speaker notes for lighter slides to ensure adequate content coverage.

## Speaker Notes Best Practices

Effective speaker notes include:

**What to Say:**
- Full sentences or detailed talking points
- Analogies and examples not on the slide
- Stories or anecdotes that illustrate concepts

**How to Present:**
- Estimated time for the slide
- Tone suggestions (enthusiastic, serious, reflective)
- Interaction cues (pause for questions, check understanding)

**Supporting Details:**
- Statistics or data sources
- Definitions of technical terms
- Answers to anticipated questions
- Smooth transitions to next slide

## Image Hint Guidelines

Create descriptive, actionable image hints:

**Good Examples:**
```markdown
![Diagram showing the three-tier architecture with frontend, backend, and database layers]
![Bar chart comparing Q1-Q4 revenue growth, highlighting 23% increase in Q4]
![Screenshot of the dashboard interface with navigation menu highlighted]
![Photo of team collaboration in a modern office setting]
```

**What Makes a Good Hint:**
- Specific about image content and purpose
- Describes what should be shown, not just the topic
- Indicates image type (diagram, chart, photo, screenshot)
- Suggests composition or key elements

**When to Add Image Hints:**
- After introducing a complex concept
- Before or after detailed bullet points
- To break up text-heavy slides
- When visualizing data or processes
- To add emotional or contextual resonance

## Template Integration

When using a presentation template:

1. **Preserve frontmatter** from the template
2. **Update template variables** (date, title, categories)
3. **Begin content** after the frontmatter
4. **Maintain template structure** if it includes specific sections

## Quality Checklist

Before finalizing a presentation, verify:

- [ ] Each slide has a clear title
- [ ] Slides are separated by `---` with blank lines
- [ ] Speaker notes use `%%` comment syntax
- [ ] Image hints are descriptive and specific
- [ ] Content flows logically from slide to slide
- [ ] Bullet points are concise and scannable
- [ ] Technical terms are explained in speaker notes
- [ ] Presentation length matches intended duration
- [ ] Frontmatter is complete and accurate

## Additional Resources

### Reference Files

For detailed information, consult:

- **`references/syntax-guide.md`** - Complete Obsidian Slides syntax reference with markdown features and formatting options
- **`references/best-practices.md`** - Presentation design principles, content organization strategies, and advanced techniques

### Example Files

Working presentation examples in `examples/`:

- **`technical-presentation.md`** - Example technical presentation showing code, architecture, and data visualization
- **`teaching-presentation.md`** - Example teaching presentation with progressive learning structure

## Common Patterns

### Title Slide
```markdown
# Presentation Title

**Presenter Name**
**Date**

%%
Introduce yourself, state the presentation goal, and set expectations.
Estimated time: 1 minute
%%
```

### Content Slide
```markdown
## Key Concept

- Main point one
- Main point two
- Main point three

![Relevant visualization or supporting image]

%%
Explain each point in detail. Provide examples and context.
Transition: "This leads us to..."
Estimated time: 3-4 minutes
%%
```

### Closing Slide
```markdown
## Key Takeaways

- Summary point one
- Summary point two
- Summary point three

**Questions?**

%%
Recap the main message. Open for questions.
Thank the audience.
%%
```

## Implementation Notes

When generating presentations programmatically:

1. **Read source materials** completely before structuring
2. **Identify 3-7 main points** that form the presentation backbone
3. **Create outline** with slide titles before writing content
4. **Generate content** slide by slide with speaker notes
5. **Add image hints** after content is in place
6. **Review flow** and adjust for pacing and transitions

Focus on creating clear, actionable content that serves both the presenter (through speaker notes) and the audience (through concise slide content). Balance information density with visual appeal through strategic use of image hints and formatting.
