# Obsidian Slides Syntax Guide

Complete reference for Obsidian's official Slides plugin syntax and markdown features.

## Core Syntax

### Slide Separators

Slides are separated using three hyphens surrounded by blank lines:

```markdown
# First Slide

Content here

---

# Second Slide

More content
```

**Critical rules:**
- Use exactly three hyphens (`---`)
- Must be on its own line
- Requires blank line before and after
- No spaces before or after hyphens

### Speaker Notes

Use Obsidian's comment syntax for presenter-only notes:

```markdown
## Slide Title

Slide content visible to audience

%%
These are speaker notes.
They appear only to the presenter.
Can span multiple lines.
%%
```

**Features:**
- Invisible to audience during presentation
- Can contain multiple paragraphs
- Support full markdown formatting
- Useful for talking points, timing, transitions

### Image Placeholders

Suggest images using standard markdown image syntax:

```markdown
![Descriptive hint about the image content]
```

**Best practices:**
- Be specific about image type (chart, diagram, photo, screenshot)
- Describe key elements or composition
- Indicate purpose (illustrate X, show Y, compare Z)
- Place where image would logically fit

**Examples:**
```markdown
![Bar chart showing monthly revenue growth from Jan-Dec 2025]
![System architecture diagram with microservices and message queue]
![Screenshot of the new dashboard interface with analytics panel]
![Team photo from the 2025 annual conference]
```

## Markdown Formatting

Obsidian Slides supports standard markdown formatting:

### Headings

```markdown
# Slide Title (H1)
## Section Heading (H2)
### Subsection (H3)
```

**Recommendation:** Use H1 (`#`) for slide titles to maintain visual hierarchy.

### Text Formatting

```markdown
**Bold text** for emphasis
*Italic text* for secondary emphasis
***Bold and italic*** for strong emphasis
~~Strikethrough~~ for crossed-out text
`Inline code` for technical terms
```

### Lists

**Unordered lists:**
```markdown
- First item
- Second item
  - Nested item
  - Another nested item
- Third item
```

**Ordered lists:**
```markdown
1. First step
2. Second step
3. Third step
```

**Recommendation:** Use unordered lists for most slides (better for non-sequential points).

### Code Blocks

**Inline code:**
```markdown
Use the `git commit` command
```

**Code blocks with syntax highlighting:**
````markdown
```python
def hello_world():
    print("Hello, World!")
```
````

**Supported languages:** Python, JavaScript, TypeScript, Java, C++, Rust, Go, Bash, SQL, and many more.

### Links

**Internal links:**
```markdown
[[Other Note]]
[[Other Note|Display Text]]
```

**External links:**
```markdown
[Display Text](https://example.com)
```

### Blockquotes

```markdown
> This is a quoted text
> It can span multiple lines
```

**Use for:**
- Important quotes from sources
- Key definitions
- Emphasis on critical points

### Horizontal Rules

```markdown
---
```

**Note:** In presentations, `---` separates slides. To add a visual horizontal line within a slide, use a different approach or avoid it.

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

**Best practices:**
- Keep tables simple (3-4 columns max)
- Use for comparative data
- Consider using a chart image hint instead for complex data

## Frontmatter

Presentations can include YAML frontmatter for metadata:

```markdown
---
title: Presentation Title
author: Presenter Name
date: 2026-01-11
categories:
  - "[[Presentation]]"
type: []
---

# First Slide
```

**Common fields:**
- `title`: Presentation title
- `author`: Presenter name
- `date`: Presentation date
- `categories`: Obsidian categories or tags
- `type`: Custom type classification

## Advanced Markdown Features

### Task Lists

```markdown
- [ ] Uncompleted task
- [x] Completed task
```

**Use for:**
- Agenda items
- Checklist presentations
- Action items

### Footnotes

```markdown
Here's a statement with a footnote[^1].

[^1]: This is the footnote content.
```

**Use sparingly** in presentations; consider using speaker notes instead.

### Math Expressions

**Inline math:**
```markdown
$E = mc^2$
```

**Block math:**
```markdown
$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$
```

**Requires:** Math plugin or MathJax support in Obsidian.

### Callouts

```markdown
> [!note]
> This is a note callout

> [!warning]
> This is a warning callout

> [!tip]
> This is a tip callout
```

**Available types:** note, abstract, info, tip, success, question, warning, failure, danger, bug, example, quote

**Use for:**
- Highlighting important information
- Drawing attention to warnings or tips
- Structuring slide content

## Presentation Control

### Starting a Presentation

**From File Menu:**
1. Right-click the tab of a note
2. Click "Start presentation"

**From Command Palette:**
1. Press `Ctrl+P` (or `Cmd+P` on macOS)
2. Search for "Start presentation"
3. Press Enter

### Navigation

**During presentation:**
- Click arrows in bottom-right corner
- Press left/right arrow keys
- Press spacebar to advance

**Exit presentation:**
- Press `Escape`
- Click X in upper-right corner

## Template Structure

Typical presentation template structure:

```markdown
---
categories:
  - "[[Presentation]]"
type: []
created: 2026-01-11
---

# Title Slide

%%
Opener and introduction
%%

---

## Content Slide 1

%%
Main content notes
%%

---

## Conclusion

%%
Closing remarks
%%
```

## Best Practices Summary

**Slide Separators:**
- Always use `---` with blank lines before/after
- Don't use for visual horizontal rules

**Speaker Notes:**
- Use `%%` syntax
- Include comprehensive talking points
- Add timing estimates and transitions

**Image Hints:**
- Be specific and descriptive
- Indicate image type and purpose
- Place strategically for visual flow

**Markdown:**
- Use headings for titles
- Keep bullet points concise
- Format code with syntax highlighting
- Use bold for key emphasis

**Formatting:**
- Limit text per slide (3-5 bullets)
- Use visual hierarchy (headings, formatting)
- Include whitespace for readability
- Balance content with image hints

## Common Patterns

### Title Slide with Metadata
```markdown
---
title: Annual Report 2025
author: Jane Smith
date: 2026-01-15
---

# Annual Report 2025

**Jane Smith**
**January 15, 2026**

%%
Welcome everyone. Set the context for the presentation.
%%
```

### Content Slide with Code
````markdown
## Implementation

```python
def process_data(input_file):
    with open(input_file, 'r') as f:
        data = f.read()
    return parse(data)
```

%%
Explain the code structure.
Highlight key functions.
%%
````

### Data Slide with Image Hint
```markdown
## Revenue Growth

![Line chart showing revenue growth from $1M to $5M over 2020-2025]

- 2020: $1.0M
- 2023: $3.2M
- 2025: $5.1M

%%
Point out the 410% growth.
Mention key milestones.
%%
```

### Conclusion Slide
```markdown
## Key Takeaways

- Main insight one
- Main insight two
- Main insight three

**Thank you!**

%%
Summarize briefly.
Open for questions.
Provide contact information.
%%
```

## Troubleshooting

### Slides Not Separating

**Problem:** Slides appear as one continuous document

**Solutions:**
- Verify `---` has blank line before and after
- Check for exactly three hyphens
- Ensure no spaces before/after hyphens
- Confirm Slides plugin is enabled

### Speaker Notes Visible

**Problem:** Notes appear in presentation view

**Solutions:**
- Use `%%` syntax, not `<!-- HTML comments -->`
- Close notes with `%%` on separate line
- Check for syntax errors in comment blocks

### Formatting Not Applying

**Problem:** Markdown formatting doesn't render

**Solutions:**
- Check markdown syntax (missing asterisks, brackets)
- Verify Obsidian's reading mode renders correctly
- Test in edit mode vs. presentation mode
- Confirm plugin compatibility

## Quick Reference Card

```
Slide separator:     ---
Speaker notes:       %% notes %%
Image hint:          ![description]
Bold:                **text**
Italic:              *text*
Code:                `code`
Heading:             # Title
List:                - item
Link:                [text](url)
Internal link:       [[note]]
Code block:          ```lang\ncode\n```
```

Use this guide as a comprehensive reference when creating Obsidian presentations. Combine syntax elements strategically to create clear, engaging, and effective slides.
