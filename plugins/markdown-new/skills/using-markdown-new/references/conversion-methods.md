# Conversion Methods

markdown.new uses a three-tier conversion pipeline that automatically selects the best method based on the site's characteristics. Each tier offers a different balance of speed and completeness.

## Three-Tier Pipeline

### Tier 1: Markdown for Agents (Primary)

**How it works**: Fetches the URL with `Accept: text/markdown` header. Cloudflare-enabled sites return clean Markdown directly from the edge.

**Characteristics**:

- Fastest method (no parsing needed)
- Zero overhead
- Works only with Cloudflare-enabled sites
- Returns pre-converted Markdown from the edge

**Technical details**:

```javascript
fetch(url, {
  headers: { Accept: "text/markdown" },
});
```

**When used**: Automatically attempted first for all requests. If the server returns `text/markdown` content type, this method succeeds.

### Tier 2: Workers AI (Fallback 1)

**How it works**: If content negotiation returns HTML, passes it through Cloudflare Workers AI `toMarkdown()` function.

**Characteristics**:

- Fast HTML-to-Markdown conversion
- No re-fetch needed (uses HTML from Tier 1 attempt)
- Good for static HTML pages
- May miss JavaScript-rendered content

**Technical details**:

```javascript
env.AI.toMarkdown([
  {
    name: "page.html",
    blob: htmlBlob,
  },
]);
```

**When used**: Automatically when Tier 1 returns HTML instead of Markdown. Handles most static websites effectively.

### Tier 3: Browser Rendering (Fallback 2)

**How it works**: Renders the page in a headless browser via Cloudflare's Browser Rendering API.

**Characteristics**:

- Slowest method (full page render)
- Captures JavaScript-rendered content
- Complete page content extraction
- Handles single-page applications (SPAs)

**Technical details**:

```javascript
POST /browser-rendering/markdown
{
  "url": "https://..."
}
```

**When used**: Automatically for JS-heavy pages, or explicitly via `method=browser` parameter.

## Method Selection

### Automatic (Default)

The default behavior tries methods in order:

1. Try Tier 1 (native Markdown)
2. If HTML returned, try Tier 2 (Workers AI)
3. If content is incomplete or JS-heavy, try Tier 3 (Browser Rendering)

**Use automatic mode when**: You don't know the site's architecture and want the best result automatically.

**URL format**: `https://markdown.new/https://example.com`

### AI Method (Explicit)

Force Workers AI conversion, skipping native Markdown attempt:

**Use AI method when**:

- You know the site returns HTML
- You want fast conversion
- The site doesn't require JavaScript rendering

**URL format**: `https://markdown.new/https://example.com?method=ai`

### Browser Method (Explicit)

Force browser rendering, bypassing faster methods:

**Use browser method when**:

- The site is a single-page application (React, Vue, Angular)
- Content is heavily JavaScript-dependent
- Automatic mode returns incomplete content
- You need the full rendered DOM

**URL format**: `https://markdown.new/https://example.com?method=browser`

**Examples of sites requiring browser method**:

- Modern dashboards (e.g., React admin panels)
- Interactive web applications
- Sites with client-side routing
- Content loaded via AJAX/fetch

## Performance Comparison

| Method           | Speed   | Completeness         | Use Case                 |
| ---------------- | ------- | -------------------- | ------------------------ |
| Tier 1 (Native)  | Fastest | Complete             | Cloudflare-enabled sites |
| Tier 2 (AI)      | Fast    | Good for static HTML | Most websites            |
| Tier 3 (Browser) | Slow    | Complete             | JavaScript-heavy SPAs    |

## Choosing the Right Method

### Use Auto (Default)

For most cases, rely on automatic method selection:

```
https://markdown.new/https://example.com
```

The service intelligently selects the best method.

### Use method=ai

When you know the site is static HTML and want to skip native Markdown attempt:

```
https://markdown.new/https://static-blog.example.com?method=ai
```

Saves a potential round-trip for non-Cloudflare sites.

### Use method=browser

When you know the site requires JavaScript or automatic mode returns incomplete results:

```
https://markdown.new/https://app.example.com?method=browser
```

Guarantees complete content at the cost of speed.

## Combining with retain_images

All methods support the `retain_images` parameter:

```
https://markdown.new/https://example.com?method=browser&retain_images=true
```

This uses browser rendering AND keeps images in the Markdown output.

## Troubleshooting Method Selection

**Problem**: Content is incomplete or missing sections

**Solution**: Try `method=browser` to force full rendering:

```
WebFetch("https://markdown.new/https://example.com?method=browser", "analyze content")
```

**Problem**: Conversion is too slow

**Solution**: If the site is static HTML, use `method=ai`:

```
WebFetch("https://markdown.new/https://example.com?method=ai", "summarize")
```

**Problem**: Images are missing but needed

**Solution**: Add `retain_images=true`:

```
WebFetch("https://markdown.new/https://example.com?retain_images=true", "analyze diagrams")
```

## Best Practices

1. **Start with auto**: Let markdown.new choose the best method
2. **Upgrade to browser**: If content is incomplete, retry with `method=browser`
3. **Use ai for known static sites**: Optimize speed for simple HTML pages
4. **Combine parameters**: Use both `method` and `retain_images` as needed
5. **Monitor response time**: Browser rendering takes longer, use only when necessary

The three-tier pipeline ensures you get clean Markdown with optimal speed and completeness for any website.
