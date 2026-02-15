# Example: Fetching a Blog Post

This example demonstrates fetching and summarizing a blog article using markdown.new.

## Scenario

User wants to summarize a blog post about API design best practices.

## User Request

```
"Summarize this article about API design: https://blog.example.com/api-best-practices"
```

## Implementation

### Step 1: Construct markdown.new URL

```
Original URL: https://blog.example.com/api-best-practices
markdown.new URL: https://markdown.new/https://blog.example.com/api-best-practices
```

### Step 2: Use WebFetch

```
WebFetch(
  "https://markdown.new/https://blog.example.com/api-best-practices",
  "Summarize the main points about API design best practices. Focus on actionable recommendations."
)
```

### Step 3: Process Response

The response will be clean Markdown:

```markdown
---
title: API Design Best Practices for 2024
author: Jane Developer
date: 2024-01-15
url: https://blog.example.com/api-best-practices
---

# API Design Best Practices for 2024

Modern API design requires careful attention to...

## Key Principles

1. **RESTful Design**: Follow REST conventions...
2. **Versioning**: Always version your APIs...
3. **Documentation**: Provide comprehensive docs...

[...article content continues...]
```

## Response

```
Based on the article, here are the main API design best practices:

1. **RESTful Design**: Follow REST conventions with proper HTTP methods (GET, POST, PUT, DELETE) and meaningful resource URLs

2. **Versioning**: Implement API versioning from the start using URL path versioning (e.g., /v1/users) to avoid breaking changes

3. **Documentation**: Provide comprehensive, up-to-date documentation with examples and use cases

4. **Error Handling**: Return clear, structured error messages with appropriate HTTP status codes

5. **Authentication**: Use industry-standard auth methods like OAuth 2.0 or JWT

6. **Rate Limiting**: Implement rate limiting to prevent abuse and ensure service stability

The article emphasizes that good API design is about making it easy for developers to use your API correctly and hard to use it incorrectly.
```

## Token Comparison

### Using markdown.new

```
Request: https://markdown.new/https://blog.example.com/api-best-practices
Tokens: ~1,200 (from x-markdown-tokens header)
```

### Using direct HTML fetch

```
Request: https://blog.example.com/api-best-practices
Tokens: ~6,000 (estimated HTML with CSS, scripts, etc.)
```

**Savings**: 4,800 tokens (80% reduction)

## Why This Works Well

1. **Blog posts are mostly text**: No need for images, perfect for default settings
2. **Static content**: Auto method works efficiently
3. **Clean structure**: markdown.new preserves article hierarchy
4. **Token efficient**: 80% reduction leaves room for analysis

## Variations

### Include Publication Metadata

Extract metadata from frontmatter:

```
WebFetch(
  "https://markdown.new/https://blog.example.com/api-best-practices",
  "Summarize this article and include the author and publication date"
)
```

Response uses frontmatter:
```
This article by Jane Developer, published on January 15, 2024, discusses...
```

### Multiple Articles

Fetch several blog posts efficiently:

```
1. WebFetch("https://markdown.new/https://blog.example.com/post1", "summarize")
2. WebFetch("https://markdown.new/https://blog.example.com/post2", "summarize")
3. WebFetch("https://markdown.new/https://blog.example.com/post3", "summarize")

Total tokens: ~3,600 (vs ~18,000 for direct HTML)
```

Token efficiency makes multiple fetches practical.

## Best Practices

1. **Use default settings**: Blog posts don't need special parameters
2. **Rely on auto method**: Works well for static blog content
3. **Skip retain_images**: Blog images are usually decorative
4. **Extract metadata**: Use frontmatter for citations
5. **Batch requests**: Token efficiency enables processing multiple articles

## Common Issues

### Issue: Article truncated

**Symptom**: Summary seems incomplete

**Solution**: Check if article has pagination or "click to read more"
```
WebFetch("https://markdown.new/https://blog.example.com/full-article", ...)
```
Use the full article URL, not preview.

### Issue: Comments included

**Symptom**: Summary includes user comments

**Solution**: Comments are part of the page. Instruct in prompt:
```
"Summarize the main article content, ignoring user comments"
```

### Issue: Sidebar content included

**Symptom**: Summary includes related posts, ads

**Solution**: markdown.new captures all visible content. Instruct in prompt:
```
"Summarize the main article, ignoring sidebar and related posts"
```

## Real-World Use Cases

### Research

```
"Fetch these 5 articles about React performance and compare their recommendations"
```

Token efficiency makes fetching multiple sources practical.

### Content Curation

```
"Summarize the latest posts from this blog and identify common themes"
```

Process many articles without exceeding context window.

### Learning

```
"Explain the concepts in this tutorial and create practice exercises"
```

Clean Markdown format helps AI understand article structure.

## Summary

Blog posts are an ideal use case for markdown.new:
- Mostly text content (no images needed)
- Static HTML (fast conversion)
- Structured format (headings, lists)
- 80% token reduction enables processing multiple articles

Always use markdown.new for blog content fetching to optimize token usage.
