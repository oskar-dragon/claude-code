# Response Format

markdown.new returns clean Markdown with metadata headers that provide useful information about the conversion process and content.

## HTTP Response Structure

### Status Code

```
HTTP/2 200
```

Successful conversions return `200 OK`. Failed conversions return appropriate error codes:
- `400 Bad Request`: Invalid URL or parameters
- `404 Not Found`: Target URL not found
- `500 Internal Server Error`: Conversion failure
- `503 Service Unavailable`: markdown.new service issues

### Response Headers

#### content-type

```
content-type: text/markdown; charset=utf-8
```

**Description**: Indicates the response body is Markdown formatted as UTF-8 text.

**Usage**: Confirms successful conversion to Markdown format.

#### x-markdown-tokens

```
x-markdown-tokens: 725
```

**Description**: Estimated token count for the returned Markdown content.

**Usage**:
- Compare against HTML token count to see reduction
- Estimate context window usage before processing
- Optimize requests based on token budget

**Calculation**: Based on Claude's tokenization algorithm (approximate).

#### vary

```
vary: accept
```

**Description**: Indicates response varies based on the `Accept` header sent in the request.

**Usage**: Informs caching layers that the same URL may return different formats (HTML vs Markdown) based on headers.

### Response Body

The response body contains clean Markdown with optional frontmatter metadata.

#### With Frontmatter

```markdown
---
title: Page Title
url: https://example.com/page
---

# Page Title

Content starts here...
```

**Frontmatter fields**:
- `title`: Page title extracted from `<title>` tag or `<h1>`
- `url`: Original URL that was converted
- `description`: Meta description if available
- `author`: Article author if available
- `date`: Publication date if available

**Note**: Frontmatter is optional and depends on the source page's metadata.

#### Without Frontmatter

```markdown
# Page Title

Content starts here...
```

Some pages may not have frontmatter if metadata extraction fails.

## Example Responses

### Blog Post

**Request**:
```
GET https://markdown.new/https://blog.example.com/post
```

**Response**:
```
HTTP/2 200
content-type: text/markdown; charset=utf-8
x-markdown-tokens: 1250
vary: accept

---
title: How to Build Better APIs
url: https://blog.example.com/post
author: Jane Smith
date: 2024-01-15
---

# How to Build Better APIs

Modern API design requires careful consideration...
```

### Documentation Page

**Request**:
```
GET https://markdown.new/https://docs.example.com/guide?retain_images=true
```

**Response**:
```
HTTP/2 200
content-type: text/markdown; charset=utf-8
x-markdown-tokens: 2100
vary: accept

---
title: Getting Started Guide
url: https://docs.example.com/guide
---

# Getting Started Guide

## Installation

![Installation diagram](https://docs.example.com/img/install.png)

Follow these steps...
```

### Simple Web Page

**Request**:
```
GET https://markdown.new/https://example.com
```

**Response**:
```
HTTP/2 200
content-type: text/markdown; charset=utf-8
x-markdown-tokens: 450
vary: accept

# Example Domain

This domain is for use in illustrative examples...
```

## Token Count Header Usage

### Estimating Context Usage

Use `x-markdown-tokens` to estimate how much context window the content will consume:

```
WebFetch returns:
x-markdown-tokens: 3500

Remaining context: 200,000 - 3,500 = 196,500 tokens
```

**Planning**: If you need to fetch multiple pages, sum the token estimates to ensure you stay within limits.

### Comparing to HTML

HTML token counts are typically 5x higher:

```
Markdown (from x-markdown-tokens): 725 tokens
HTML (estimated): 725 × 5 = 3,625 tokens
Savings: 2,900 tokens (80%)
```

**Validation**: Confirms the ~80% token reduction claim.

### Optimization Decisions

Use token counts to make informed decisions:

**High token count** (>5,000):
- Consider using `retain_images=false` if images are included
- Summarize content rather than processing in full
- Split request into multiple smaller pages

**Low token count** (<1,000):
- Safe to process multiple pages
- Can retain images without concern
- Plenty of room for analysis

## Markdown Quality Indicators

### Clean Formatting

Good conversion produces:
- Proper heading hierarchy (`#`, `##`, `###`)
- List formatting (`-`, `1.`)
- Code blocks with language hints
- Link preservation
- Table formatting

### Degraded Formatting

Poor conversion may show:
- Excessive blank lines
- Broken code blocks
- Malformed tables
- Missing links

**Solution**: Try `method=browser` for better extraction.

## Content Metadata

### Title Extraction

markdown.new attempts to extract the page title from:
1. `<title>` tag
2. `<h1>` tag
3. OpenGraph `og:title` meta tag
4. First heading in content

If extraction fails, frontmatter may omit the `title` field.

### URL Preservation

The `url` field always contains the original target URL, useful for:
- Citation and referencing
- Debugging conversion issues
- Tracking source of content

### Optional Metadata

Additional fields depend on source page:
- `description`: From meta description tag
- `author`: From article author meta tags
- `date`: From publication date meta tags
- `keywords`: From meta keywords

**Note**: Not all pages provide this metadata.

## Error Responses

### Invalid URL

**Request**:
```
GET https://markdown.new/invalid-url
```

**Response**:
```
HTTP/2 400 Bad Request
content-type: application/json

{
  "error": "Invalid URL format"
}
```

### Target Not Found

**Request**:
```
GET https://markdown.new/https://example.com/nonexistent
```

**Response**:
```
HTTP/2 404 Not Found
content-type: application/json

{
  "error": "Target URL returned 404"
}
```

### Conversion Failure

**Request**:
```
GET https://markdown.new/https://problematic-site.com
```

**Response**:
```
HTTP/2 500 Internal Server Error
content-type: application/json

{
  "error": "Conversion failed",
  "details": "Timeout during browser rendering"
}
```

## Best Practices

### Check x-markdown-tokens

Before processing large amounts of content:
```
1. Fetch the page
2. Check x-markdown-tokens header
3. Decide if content fits in context budget
4. Proceed or adjust strategy
```

### Use Frontmatter

Extract metadata from frontmatter for:
- Citation: Use `title`, `author`, `url`
- Validation: Confirm correct page was fetched
- Organization: File content by title or date

### Handle Missing Metadata

Not all pages have complete frontmatter:
```
If frontmatter.title exists:
  Use frontmatter.title
Else:
  Extract from first heading in Markdown
```

### Expect Clean Markdown

markdown.new produces clean, well-formatted Markdown. If formatting is poor:
- Retry with `method=browser`
- Check if target page has unusual structure
- Consider if page is suitable for conversion

## Integration with WebFetch

When using WebFetch with markdown.new, the response format is passed through:

```
WebFetch("https://markdown.new/https://example.com", "summarize this")
```

WebFetch receives:
- Markdown body
- Headers (including x-markdown-tokens)
- Frontmatter metadata

Use this information to:
- Validate content before analysis
- Track token usage
- Extract metadata for citations

## Response Caching

markdown.new includes a 15-minute cache:
- Same URL within 15 minutes returns cached response
- Faster responses for repeated requests
- No need to implement client-side caching

**Note**: Cache applies to exact URL matches including parameters. Changing parameters (e.g., adding `retain_images=true`) creates a new cache entry.

Understanding the response format helps validate conversions, track token usage, and integrate markdown.new effectively into content processing workflows.
