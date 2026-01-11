---
description: Create a new Obsidian presentation from provided resources with generated content and speaker notes
argument-hint: "[title]"
allowed-tools:
  - Read
  - Write
  - WebFetch
  - Bash
  - AskUserQuestion
  - Skill
---

# Create Presentation Command

This command scaffolds a new Obsidian presentation based on provided resources, generating slide content, speaker notes, and image hints following best practices.

## Workflow

### Step 1: Load the Obsidian Presentations Skill

**CRITICAL:** Before proceeding with any presentation creation, load the `obsidian-presentations` skill using the Skill tool:

```
Skill tool: obsidian-presentations
```

This skill provides comprehensive guidance on Obsidian slides syntax, presentation structure, content organization, and best practices that are essential for creating effective presentations.

### Step 2: Gather Presentation Requirements

Check if resources and requirements are provided. If not, collect them:

**Presentation Title:**

- If title provided as argument, use it
- Otherwise, ask user for the presentation title/topic

**Source Materials:**
Check if resources are mentioned in the user's message or context. If not, use AskUserQuestion to collect:

- PDF files (paths to local PDFs)
- Markdown files (paths to .md files in the vault)
- Pasted text (user can paste content directly)
- URLs (for web-based resources)
- **Multiple sources allowed** - user may provide several resources

**Presentation Style:**
Ask user to specify the presentation style using AskUserQuestion:

- Formal (professional language, structured format)
- Casual (conversational tone, engaging)
- Technical (detailed explanations, code/diagrams)
- Teaching (step-by-step, progressive learning)

**Target Audience:**
Ask user to specify the target audience:

- Executives (high-level, business focused)
- Technical team (detailed, implementation focused)
- General audience (accessible, minimal jargon)
- Students/learners (educational, scaffolded)
- Custom (user describes specific audience)

### Step 3: Process Source Materials

Read and analyze all provided resources:

**For PDF files:**
Use Bash with appropriate tools to extract text from PDFs if available, or ask user to provide key content from the PDF.

**For Markdown files:**
Use Read tool to load the content of markdown files from the vault.

**For URLs:**
Use WebFetch tool to retrieve content from provided URLs.

**For pasted text:**
Process the text provided directly by the user.

**Analysis:**
After gathering all source materials:

- Identify main themes and key points
- Extract supporting details and examples
- Determine logical structure for presentation
- Plan 5-10 slides based on content depth

### Step 4: Generate Presentation Content

Following the guidance from the `obsidian-presentations` skill, create the presentation:

**Structure:**

1. **Title slide** - Presentation title, optional subtitle, date
2. **Opening slide** - Overview or hook (if appropriate)
3. **Content slides (3-8)** - Main points from source materials
4. **Conclusion slide** - Key takeaways or summary
5. **Optional Q&A slide** - Thank you and questions

**For each slide:**

**Title:**

- Use `##` heading syntax for slide titles
- Create descriptive, specific titles (not generic like "Overview")

**Content:**

- 3-5 bullet points per slide
- Use markdown formatting (**bold**, _italic_, `code`)
- Keep text concise and scannable
- Include code blocks for technical presentations
- Add tables for comparative data

**Speaker Notes:**
Use `%%` syntax immediately after slide content:

```markdown
%%
Speaker notes here with:

- Detailed talking points
- Examples and context
- Timing estimates
- Transitions to next slide
  %%
```

Generate comprehensive speaker notes that:

- Expand on slide content with full explanations
- Provide examples and analogies
- Include timing suggestions
- Suggest delivery tone and pacing
- Anticipate questions and provide answers
- Include smooth transitions between slides

**Image Hints:**
Add image placeholders using `![descriptive hint]` syntax where visuals would enhance the presentation:

```markdown
![Diagram showing the three-tier architecture with frontend, backend, and database layers]
![Bar chart comparing Q1-Q4 revenue growth with 23% increase highlighted]
![Screenshot of the dashboard interface with navigation menu visible]
```

Make image hints:

- Specific about image type (diagram, chart, photo, screenshot)
- Descriptive of content and key elements
- Purpose-oriented (what the image illustrates)
- Strategic in placement (after complex concepts, for data visualization)

**Slide Separators:**
Separate slides with `---` surrounded by blank lines:

```markdown
Slide content here

%%
Speaker notes
%%

---

## Next Slide Title
```

**Tailor to Style and Audience:**
Adapt content based on specified presentation style and target audience:

- Formal: Professional language, thorough coverage
- Casual: Conversational tone, lighter examples
- Technical: Code samples, architecture details, precise terminology
- Teaching: Progressive steps, practice opportunities, frequent summaries

Adjust complexity and terminology for the target audience.

### Step 5: Assemble Final Presentation

Combine all elements into the final presentation file:

1. **Frontmatter** - Create basic YAML frontmatter with current date and title
2. **Presentation content** with all slides
3. **Speaker notes** for each slide
4. **Image hints** strategically placed

**Frontmatter structure:**

```yaml
categories:
  - "[[Presentation]]"
created: [Current Date in YYYY-MM-DD format]
---
```

**Quality checks before writing:**

- Each slide has clear title
- Slides separated by `---` with blank lines
- Speaker notes use `%%` syntax
- Image hints are descriptive
- Content flows logically
- 5-10 slides total (adjust based on content)
- Frontmatter present with title and date

### Step 6: Save Presentation

**Generate filename:**
Auto-generate filename from title:

- Convert title to kebab-case or Title Case
- Add .md extension
- Example: "Introduction to AI" → "Introduction to AI.md"

**Save location:**
Save to current working directory by default.

Use Write tool to create the presentation file.

### Step 8: Confirm Creation

After successfully creating the presentation, inform the user:

- Confirm file created
- Provide full file path
- Mention number of slides generated
- Suggest next steps (review, add images, practice)

**Example confirmation:**

```
Presentation created successfully!

File: /path/to/working/directory/Introduction to AI.md
Slides: 8 (including title and conclusion)
Style: Technical
Audience: General

Next steps:
- Review the presentation and adjust content as needed
- Add images where image hints suggest
- Practice with speaker notes
- Use Obsidian's "Start presentation" command to present
```

## Important Notes

**ALWAYS load the skill first:**
The `obsidian-presentations` skill is essential. Load it at the beginning of the workflow.

**Multiple resources:**
Users may provide more than one source. Process all of them and synthesize the information into a cohesive presentation.

**Speaker notes are critical:**
Generate comprehensive, detailed speaker notes for every slide. These notes should provide full talking points that expand significantly beyond the slide content.

**Image hints enhance presentations:**
Add 3-5 image hints throughout the presentation where visuals would help illustrate concepts, show data, or provide visual breaks.

**Quality over quantity:**
Better to have 7 excellent slides than 15 mediocre ones. Each slide should serve a clear purpose.

**Iterative refinement:**
The generated presentation is a strong starting point. Users will refine it based on their specific needs.

## Examples

### Example 1: Technical Presentation from PDF

**User:** `/create-presentation` (with PDF attached about microservices)

**Workflow:**

1. Load obsidian-presentations skill
2. Ask for title, style, audience
3. Extract content from PDF using Bash/appropriate tools
4. Generate 8 slides covering microservices architecture, benefits, challenges, implementation
5. Include code examples and architecture diagrams (as image hints)
6. Add detailed speaker notes with technical explanations
7. Save as "Microservices Architecture Overview.md"

### Example 2: Teaching Presentation from URL

**User:** `/create-presentation Introduction to Python` (with URL to Python tutorial)

**Workflow:**

1. Load obsidian-presentations skill
2. Fetch content from URL using WebFetch
3. Ask for style (teaching) and audience (beginners)
4. Generate 10 slides with progressive learning structure
5. Include code examples at each step
6. Add image hints for code output and diagrams
7. Include comprehensive teaching notes with analogies
8. Save as "Introduction to Python.md"

### Example 3: Business Presentation from Multiple Sources

**User:** `/create-presentation Q4 Results` (with spreadsheet data pasted and strategy document path)

**Workflow:**

1. Load obsidian-presentations skill
2. Read markdown strategy document
3. Process pasted spreadsheet data
4. Ask for style (formal) and audience (executives)
5. Generate 7 slides: title, context, Q4 metrics, wins, challenges, Q1 outlook, summary
6. Add image hints for charts showing data trends
7. Include speaker notes with talking points and anticipated questions
8. Save as "Q4 Results Presentation.md"

## Tips for Effective Use

**Provide rich source materials:**
The more comprehensive the source materials, the better the generated presentation will be.

**Specify audience carefully:**
Audience specification significantly impacts content complexity and tone.

**Review and refine:**
Generated presentations are strong foundations but benefit from human review and customization.

**Add images after generation:**
Use the image hints as a guide to find or create appropriate visuals.

**Practice with speaker notes:**
The speaker notes are designed to be comprehensive guides—use them when practicing your delivery.

## Related Skills

- **obsidian-presentations** - Essential skill for presentation creation, loaded automatically by this command

This command streamlines the process of creating professional Obsidian presentations, leveraging AI to transform source materials into well-structured slides with comprehensive speaker notes and strategic image hints.
