# Edge Cases and Troubleshooting

While markdown.new handles most websites effectively, certain scenarios require special handling or fallback strategies.

## When markdown.new Won't Help

### Authenticated Sites

**Problem**: Sites requiring login cannot be accessed by markdown.new.

**Examples**:
- Private GitHub repositories
- Google Docs (private documents)
- Corporate intranets
- Subscription-based content
- Admin dashboards

**Solution**: Use direct WebFetch or authenticated API access instead.

**Why it fails**: markdown.new cannot pass authentication credentials or session cookies.

**Workaround**: If the content is available publicly (e.g., public GitHub repo), ensure you're using the public URL.

### API Endpoints Returning JSON

**Problem**: markdown.new is designed for HTML-to-Markdown conversion, not JSON parsing.

**Examples**:
- REST API responses
- GraphQL endpoints
- JSON data feeds

**Solution**: Use direct WebFetch for JSON APIs.

**Example**:
```
❌ Bad:  WebFetch("https://markdown.new/https://api.example.com/data", "parse this")
✅ Good: WebFetch("https://api.example.com/data", "parse this JSON")
```

**Why**: JSON is already structured data and doesn't benefit from Markdown conversion.

### Binary Content

**Problem**: PDFs, images, videos, and other binary files cannot be converted to Markdown.

**Examples**:
- PDF documents
- Image files (JPG, PNG)
- Video files
- Audio files
- ZIP archives

**Solution**: Use appropriate tools for binary content (PDF parsers, image analysis, etc.).

**Why it fails**: markdown.new expects HTML content.

### Dynamic Content Requiring Interaction

**Problem**: Content that requires user interaction may not render fully.

**Examples**:
- Infinite scroll pagination
- Click-to-reveal content
- Modal dialogs
- Interactive forms
- Dynamically loaded comments

**Solution**: Use `method=browser` for better coverage, but some interactive content may still be missed.

**Limitation**: Even browser rendering captures initial page state, not all possible interactions.

## Incomplete Content Scenarios

### JavaScript-Heavy Single Page Applications

**Problem**: Default conversion may miss content loaded via JavaScript.

**Symptoms**:
- Empty or minimal Markdown output
- Missing main content
- Only navigation or header visible

**Solution**: Use `method=browser` parameter:
```
WebFetch("https://markdown.new/https://app.example.com?method=browser", "extract content")
```

**Examples of affected sites**:
- React/Vue/Angular applications
- Modern web dashboards
- Interactive documentation sites
- Progressive web apps (PWAs)

### Lazy-Loaded Images

**Problem**: Images loaded on scroll may not appear in output.

**Symptoms**:
- Broken image links
- Placeholder images instead of actual content
- Missing diagrams or screenshots

**Solution**: Use `method=browser` to allow page to load:
```
WebFetch("https://markdown.new/https://example.com?method=browser&retain_images=true", "analyze images")
```

**Note**: Browser method waits for initial render but doesn't scroll to trigger lazy loading.

### AJAX-Loaded Content

**Problem**: Content loaded after initial page load may be missed.

**Symptoms**:
- Incomplete articles
- Missing comments or user-generated content
- Partial product listings

**Solution**: Use `method=browser`:
```
WebFetch("https://markdown.new/https://example.com?method=browser", "get full content")
```

**Limitation**: Only content loaded automatically is captured, not content requiring user actions.

## Conversion Quality Issues

### Malformed HTML

**Problem**: Pages with broken HTML may produce poor Markdown.

**Symptoms**:
- Odd formatting
- Broken heading hierarchy
- Malformed lists or tables

**Solution**: Try different conversion methods:
```
1. Start with auto (default)
2. Try method=ai
3. Try method=browser
```

**Note**: If all methods produce poor output, the source HTML may be too malformed.

### Complex Table Layouts

**Problem**: Tables used for layout (not data) may convert poorly.

**Symptoms**:
- Excessive table markup in Markdown
- Unreadable table structures
- Content arranged oddly

**Solution**: No perfect solution, but `method=browser` may help.

**Workaround**: If tables are unreadable, extract specific text sections manually.

### Embedded Media

**Problem**: YouTube embeds, tweets, and other media may not convert cleanly.

**Symptoms**:
- Missing video embeds
- Broken social media embeds
- Placeholder content

**Solution**: Expect media to be omitted or converted to links.

**Note**: markdown.new focuses on text content; rich media is outside scope.

## Rate Limiting and Performance

### Request Limits

**Problem**: Excessive requests may trigger rate limiting.

**Symptoms**:
- 429 Too Many Requests errors
- Temporary blocks

**Solution**: Respect rate limits and implement backoff:
```
If response is 429:
  Wait 60 seconds
  Retry request
```

**Best practice**: Don't fetch more than 10 pages per minute.

### Slow Conversions

**Problem**: Browser rendering can take 5-10 seconds.

**Symptoms**:
- Long wait times
- Timeout errors

**Solution**:
- Use `method=browser` only when necessary
- Use `method=ai` for static sites
- Be patient with complex pages

**Optimization**: Prefer `auto` or `ai` methods for faster responses.

## Character Encoding Issues

### Non-UTF-8 Content

**Problem**: Pages using legacy encodings may have garbled text.

**Symptoms**:
- Strange characters
- Mojibake (文字化け)
- Missing special characters

**Solution**: markdown.new attempts to handle various encodings, but some legacy pages may fail.

**Workaround**: If encoding is critical, use direct WebFetch and specify encoding.

## Fallback Strategies

### When to Fall Back to Direct WebFetch

Use direct WebFetch instead of markdown.new when:

1. **Authenticated content**: Login required
2. **JSON APIs**: Structured data, not HTML
3. **Binary files**: PDFs, images, etc.
4. **Repeatedly failing**: All conversion methods fail

**Example fallback**:
```
Try: WebFetch("https://markdown.new/https://example.com", "summarize")
If fails: WebFetch("https://example.com", "summarize")
```

### Progressive Enhancement

Start simple and add parameters as needed:

```
1. Try: https://markdown.new/https://example.com
2. If incomplete: Add method=browser
3. If images needed: Add retain_images=true
4. If still failing: Fall back to direct fetch
```

## Common Error Messages

### "Invalid URL format"

**Cause**: Malformed URL
**Solution**: Verify URL is valid and properly encoded

### "Target URL returned 404"

**Cause**: Page doesn't exist
**Solution**: Check URL and verify page exists

### "Conversion failed"

**Cause**: Various conversion issues
**Solution**: Try `method=browser` or fallback to direct fetch

### "Timeout during browser rendering"

**Cause**: Page took too long to load
**Solution**: Retry or use simpler conversion method

## Best Practices for Edge Cases

### 1. Test Before Assuming Failure

Don't assume a site won't work:
```
1. Try default (auto method)
2. Check output quality
3. Upgrade to browser if needed
4. Only then fallback to direct fetch
```

### 2. Inspect Partial Results

Even if conversion seems incomplete:
```
1. Check what content was captured
2. Determine if it's sufficient for the task
3. Retry with better parameters if needed
```

### 3. Provide Context in Errors

When conversion fails, note:
- Target URL
- Parameters used
- Error message
- Expected vs actual output

This helps diagnose issues.

### 4. Use Appropriate Tools

Don't force markdown.new for unsuitable content:
- PDFs → Use PDF parsers
- APIs → Use direct requests
- Authenticated → Use proper credentials
- Binary → Use appropriate handlers

### 5. Monitor Token Counts

Even with `retain_images=false`, some pages are massive:
```
If x-markdown-tokens > 10,000:
  Consider if content is too large
  Maybe fetch specific sections instead
  Or summarize in chunks
```

## Troubleshooting Decision Tree

```
Content missing or incomplete?
├─ Yes
│  ├─ Is site JavaScript-heavy (SPA)?
│  │  ├─ Yes → Try method=browser
│  │  └─ No → Continue
│  ├─ Does site require authentication?
│  │  ├─ Yes → Use direct WebFetch
│  │  └─ No → Continue
│  └─ Try method=browser anyway
│
└─ No (content looks good)
   └─ Are images needed?
      ├─ Yes → Add retain_images=true
      └─ No → Done

```

## Real-World Examples

### GitHub Private Repo (Fails)

```
❌ Won't work: WebFetch("https://markdown.new/https://github.com/private/repo", ...)
✅ Alternative: Use GitHub API with authentication
```

### React Documentation (Works with browser)

```
❌ Incomplete: WebFetch("https://markdown.new/https://react.dev", ...)
✅ Complete: WebFetch("https://markdown.new/https://react.dev?method=browser", ...)
```

### API Endpoint (Wrong tool)

```
❌ Wrong: WebFetch("https://markdown.new/https://api.stripe.com/v1/charges", ...)
✅ Right: WebFetch("https://api.stripe.com/v1/charges", ...)
```

### Static Blog (Perfect use case)

```
✅ Ideal: WebFetch("https://markdown.new/https://blog.example.com/post", ...)
```

## Summary

Most websites work well with markdown.new, but know when to:
1. **Use browser method**: JavaScript-heavy sites
2. **Skip markdown.new**: Authenticated content, APIs, binary files
3. **Fall back**: When all methods fail
4. **Add images**: Only when visual content is essential

Understanding these edge cases ensures effective use of markdown.new while knowing when alternative approaches are needed.
