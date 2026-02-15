# Query Parameters

markdown.new supports query parameters to control conversion behavior. Parameters can be combined to fine-tune output format and processing method.

## Available Parameters

### method

Controls the conversion method used.

**Type**: String enum
**Values**: `auto` | `ai` | `browser`
**Default**: `auto`

**Description**: Specifies which conversion method to use:
- `auto`: Let markdown.new choose the best method automatically (recommended)
- `ai`: Force Cloudflare Workers AI conversion
- `browser`: Force headless browser rendering

**Usage**:
```
https://markdown.new/https://example.com?method=browser
```

**When to use each value**:

| Value | Use When | Benefits | Drawbacks |
|-------|----------|----------|-----------|
| `auto` | Default for all requests | Optimal speed/completeness | None |
| `ai` | Known static HTML sites | Faster than auto for non-Cloudflare sites | May miss JS content |
| `browser` | JavaScript-heavy SPAs | Complete content capture | Slower processing |

### retain_images

Controls whether images are included in the Markdown output.

**Type**: Boolean
**Values**: `true` | `false`
**Default**: `false`

**Description**: By default, markdown.new strips images to minimize token usage. Set to `true` to keep images as Markdown image syntax.

**Usage**:
```
https://markdown.new/https://example.com?retain_images=true
```

**Image format in output**:
```markdown
![Alt text](https://example.com/image.jpg)
```

**When to use**:

**Use retain_images=true when**:
- Analyzing documentation with diagrams
- Processing design mockups or screenshots
- Visual content is essential for the task
- Working with infographics or charts
- Documentation includes architectural diagrams

**Use retain_images=false (default) when**:
- Extracting text content only
- Summarizing articles or blog posts
- Minimizing token usage is critical
- Images are decorative or non-essential
- Building text-based knowledge bases

**Token impact**:
- Image URLs add tokens: `![Alt](https://...)` ≈ 5-10 tokens per image
- For pages with many images, this can add 50-200 tokens
- Balance token cost against visual information value

## Combining Parameters

Parameters can be combined using standard URL query syntax with `&`:

### Browser Rendering with Images

```
https://markdown.new/https://example.com?method=browser&retain_images=true
```

**Use case**: JavaScript-heavy documentation site with important diagrams

### AI Conversion with Images

```
https://markdown.new/https://example.com?method=ai&retain_images=true
```

**Use case**: Static HTML blog with relevant screenshots

## URL Construction Patterns

### Single Parameter

```
Base: https://markdown.new/
Target: https://example.com/page
Parameter: method=browser

Result: https://markdown.new/https://example.com/page?method=browser
```

### Multiple Parameters

```
Base: https://markdown.new/
Target: https://example.com/page
Parameters: method=browser&retain_images=true

Result: https://markdown.new/https://example.com/page?method=browser&retain_images=true
```

### Preserving Target URL Parameters

If the target URL has its own query parameters, they are preserved:

```
Target: https://example.com/search?q=test&page=2
markdown.new: https://markdown.new/https://example.com/search?q=test&page=2

With parameters: https://markdown.new/https://example.com/search?q=test&page=2&method=browser
```

**Note**: markdown.new's parameters are appended after the target URL's parameters.

## Usage with WebFetch

### Default (No Parameters)

```
WebFetch("https://markdown.new/https://example.com", "summarize this page")
```

### With method Parameter

```
WebFetch("https://markdown.new/https://example.com?method=browser", "extract all content")
```

### With retain_images Parameter

```
WebFetch("https://markdown.new/https://docs.example.com?retain_images=true", "analyze the diagrams")
```

### With Combined Parameters

```
WebFetch("https://markdown.new/https://app.example.com?method=browser&retain_images=true", "describe the UI")
```

## Parameter Selection Decision Tree

```
Start
│
├─ Is the site JavaScript-heavy (SPA)?
│  ├─ Yes → method=browser
│  └─ No → Continue
│
├─ Are images essential for the task?
│  ├─ Yes → retain_images=true
│  └─ No → retain_images=false (default)
│
└─ Is the site known to be static HTML?
   ├─ Yes → method=ai (optional optimization)
   └─ No → method=auto (default)
```

## Common Combinations

### Blog Article (Text Only)

```
https://markdown.new/https://blog.example.com/post
```

**Why**: Default settings work well for text content

### Documentation with Diagrams

```
https://markdown.new/https://docs.example.com?retain_images=true
```

**Why**: Documentation often includes important diagrams and screenshots

### React/Vue Application

```
https://markdown.new/https://app.example.com?method=browser
```

**Why**: SPAs require browser rendering to capture content

### Visual Design Showcase

```
https://markdown.new/https://portfolio.example.com?method=browser&retain_images=true
```

**Why**: Full rendering needed, images are the primary content

### Static HTML Landing Page

```
https://markdown.new/https://landing.example.com?method=ai
```

**Why**: Optimize speed for known static content

## Parameter Validation

markdown.new validates parameters and uses defaults for invalid values:

**Invalid method values**:
```
?method=invalid → Falls back to auto
?method=chrome  → Falls back to auto
```

**Invalid retain_images values**:
```
?retain_images=yes    → Interpreted as false
?retain_images=1      → Interpreted as false
?retain_images=true   → Correct
```

**Valid values**: Only `true` or `false` (lowercase) are accepted for `retain_images`

## Best Practices

1. **Start minimal**: Use no parameters and let auto method work
2. **Add method=browser**: If content is incomplete
3. **Add retain_images=true**: Only when images are essential
4. **Avoid retain_images**: For text-focused tasks to save tokens
5. **Use method=ai**: For known static sites to optimize speed
6. **Test variations**: Try different combinations if results are unexpected

## Examples by Use Case

### Research Paper Analysis

```
WebFetch("https://markdown.new/https://arxiv.org/abs/1234?retain_images=true", "explain the methodology")
```

**Why**: Papers include important figures and equations

### News Article Summary

```
WebFetch("https://markdown.new/https://news.example.com/article", "summarize the main points")
```

**Why**: Text content is sufficient, images are decorative

### API Documentation

```
WebFetch("https://markdown.new/https://api.example.com/docs?retain_images=true", "explain the authentication flow")
```

**Why**: API docs often include sequence diagrams

### GitHub README

```
WebFetch("https://markdown.new/https://github.com/user/repo?retain_images=true", "summarize the project")
```

**Why**: READMEs often include badges, diagrams, screenshots

### E-commerce Product Page

```
WebFetch("https://markdown.new/https://shop.example.com/product?method=browser&retain_images=true", "describe the product")
```

**Why**: Product pages are often SPAs with essential product images

## Troubleshooting

**Problem**: Images are missing when they're needed

**Solution**: Add `retain_images=true`
```
https://markdown.new/https://example.com?retain_images=true
```

**Problem**: Content is incomplete or missing

**Solution**: Add `method=browser`
```
https://markdown.new/https://example.com?method=browser
```

**Problem**: Too many tokens being used

**Solution**: Remove `retain_images` (or set to `false`)
```
https://markdown.new/https://example.com?retain_images=false
```

**Problem**: Conversion is slow

**Solution**: If site is static HTML, use `method=ai`
```
https://markdown.new/https://example.com?method=ai
```

Query parameters provide fine-grained control over markdown.new's conversion behavior. Use them strategically to balance token efficiency with content completeness.
