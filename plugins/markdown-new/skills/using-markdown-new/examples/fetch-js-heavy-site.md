# Example: Fetching JavaScript-Heavy Sites

This example demonstrates using `method=browser` for single-page applications and JavaScript-dependent content.

## Scenario

User wants to analyze a modern React-based documentation site where content is loaded dynamically via JavaScript.

## User Request

```
"Analyze the component API documentation from this React framework:
https://modern-framework.dev/docs/components

I need to understand all available props and methods."
```

## Problem with Default Method

First attempt without `method=browser`:

```
WebFetch(
  "https://markdown.new/https://modern-framework.dev/docs/components",
  "list all component props and methods"
)
```

**Result**: Incomplete content
```markdown
# Components

Loading documentation...

[Minimal shell content, actual docs missing]
```

**Why it fails**: The site is a React SPA. Content is rendered client-side via JavaScript, not present in initial HTML.

## Solution: Use method=browser

### Step 1: Construct URL with method=browser

```
Original URL: https://modern-framework.dev/docs/components
markdown.new URL: https://markdown.new/https://modern-framework.dev/docs/components?method=browser
```

**Why method=browser**: Forces full page rendering in headless browser, capturing JavaScript-generated content.

### Step 2: Use WebFetch with Browser Method

```
WebFetch(
  "https://markdown.new/https://modern-framework.dev/docs/components?method=browser",
  "List all component props, methods, and provide usage examples for each."
)
```

### Step 3: Process Complete Response

Now the response includes full content:

```markdown
---
title: Component API Reference
url: https://modern-framework.dev/docs/components
---

# Component API Reference

## Button Component

### Props

- `variant`: `'primary' | 'secondary' | 'ghost'` - Button style variant
- `size`: `'sm' | 'md' | 'lg'` - Button size
- `disabled`: `boolean` - Disable button interactions
- `onClick`: `() => void` - Click event handler
- `children`: `ReactNode` - Button content

### Methods

- `focus()`: Focus the button element
- `blur()`: Remove focus from button

### Usage

```tsx
<Button variant="primary" size="md" onClick={() => console.log('clicked')}>
  Click Me
</Button>
```

## Input Component

[...complete documentation continues...]
```

## Response

```
Here's a comprehensive summary of the component API:

**Button Component**
Props:
- variant: Controls visual style (primary/secondary/ghost)
- size: Controls dimensions (sm/md/lg)
- disabled: Prevents interaction when true
- onClick: Event handler for click events
- children: Content to display inside button

Methods:
- focus(): Programmatically focus the button
- blur(): Remove focus from button

Example:
<Button variant="primary" onClick={handleClick}>Submit</Button>

**Input Component**
[...continues with full API documentation...]
```

## When Content is Incomplete

### Symptoms of Missing JavaScript Content

**Empty or minimal output**:
```markdown
# Page Title
Loading...
```

**Navigation only**:
```markdown
# Site Name
- Home
- Docs
- About

[Main content missing]
```

**Placeholder content**:
```markdown
# Documentation
This page requires JavaScript to display content.
```

**Generic error**:
```markdown
# Error
Please enable JavaScript
```

### Solution: Add method=browser

```
# First attempt (incomplete)
https://markdown.new/https://modern-framework.dev/docs

# Retry with browser method (complete)
https://markdown.new/https://modern-framework.dev/docs?method=browser
```

## Token and Performance Comparison

### method=browser (Complete Content)

```
Request: https://markdown.new/https://modern-framework.dev/docs?method=browser
Processing time: 5-8 seconds
Tokens: ~3,000
Result: Complete, all JavaScript-rendered content captured
```

### method=auto (Incomplete)

```
Request: https://markdown.new/https://modern-framework.dev/docs
Processing time: 1-2 seconds
Tokens: ~500
Result: Incomplete, only HTML shell without JS content
```

### Direct HTML Fetch (Also Incomplete)

```
Request: https://modern-framework.dev/docs
Tokens: ~2,500
Result: Incomplete, plus token waste on CSS/scripts
```

**Best approach**: Use `method=browser` for SPAs, even though it's slower. Complete content is worth the wait.

## Sites That Need method=browser

### Single Page Applications (SPAs)

**React, Vue, Angular apps**:
```
https://markdown.new/https://react-app.example.com?method=browser
```

**Modern documentation sites**:
```
https://markdown.new/https://docs.modern-framework.dev?method=browser
```

**Web dashboards**:
```
https://markdown.new/https://dashboard.example.com?method=browser
```

### Dynamic Content Loading

**Infinite scroll pages**:
```
https://markdown.new/https://feed.example.com?method=browser
```
Note: Only captures initial viewport, not infinite scroll content.

**AJAX-loaded content**:
```
https://markdown.new/https://search.example.com?method=browser
```

**Client-side routing**:
```
https://markdown.new/https://app.example.com/page?method=browser
```

### Heavy JavaScript Frameworks

Sites built with:
- React / Next.js
- Vue / Nuxt.js
- Angular
- Svelte / SvelteKit
- Solid.js
- Remix

All typically need `method=browser`.

## Combining with retain_images

For SPAs with important visual content:

```
WebFetch(
  "https://markdown.new/https://design-system.example.com?method=browser&retain_images=true",
  "Describe the component gallery and visual design patterns"
)
```

**Use case**: Design system documentation with component screenshots.

## Progressive Approach

Try methods in order of speed:

### 1. Start with Auto (Fastest)

```
WebFetch("https://markdown.new/https://example.com", "summarize")
```

**Check**: Is content complete?
- Yes → Done, optimal speed
- No → Continue to step 2

### 2. Upgrade to Browser (Slower but Complete)

```
WebFetch("https://markdown.new/https://example.com?method=browser", "summarize")
```

**Check**: Is content now complete?
- Yes → Use browser method going forward
- No → Site may require interaction or authentication

### 3. Fallback if Needed

If `method=browser` still fails:
- Site requires authentication
- Content behind interaction (clicks, forms)
- Infinite scroll not captured
- Consider alternative approaches

## Best Practices

### 1. Detect SPA Characteristics

**Indicators a site needs method=browser**:
- URL has no file extension or hash routing (#/page)
- Site feels like an "app" rather than pages
- View Source shows minimal HTML with `<div id="root">`
- Console shows "React", "Vue", or framework messages

### 2. Be Patient

Browser rendering takes 5-10 seconds:
- Don't assume it failed if it's slow
- Expect longer response times
- Worth the wait for complete content

### 3. Cache Results Mentally

If you fetch a site with `method=browser` once:
- Remember it's an SPA
- Use `method=browser` for subsequent fetches from same site
- Don't retry with auto method

### 4. Batch Requests Carefully

```
# Don't overwhelm with parallel browser renders
❌ Bad: 10 simultaneous method=browser requests

# Fetch sequentially or in small batches
✅ Good: 2-3 at a time, wait for completion
```

### 5. Document Requirements

When sharing URLs that need browser method:
```
"Fetch this React docs site (requires method=browser):
https://example.com/docs"
```

Helps future requests succeed immediately.

## Common Issues

### Issue: Still incomplete with method=browser

**Possible causes**:
1. Content requires user interaction (click, scroll)
2. Content behind authentication
3. Content loads after delays longer than render timeout

**Solutions**:
- Check if public content exists
- Look for alternative documentation
- Use direct API if available

### Issue: method=browser is too slow

**Symptom**: 10+ second waits for each page

**Solutions**:
- Accept the slowness for accurate content
- Fetch once and process thoroughly
- Consider if faster alternatives exist (API, static docs)
- Use `method=ai` for known static sections

### Issue: Mixing methods for same site

**Symptom**: Some pages work with auto, others need browser

**Solution**: Use `method=browser` consistently for that site
```
# Consistent approach for SPA documentation
https://markdown.new/https://spa-docs.example.com/intro?method=browser
https://markdown.new/https://spa-docs.example.com/api?method=browser
https://markdown.new/https://spa-docs.example.com/examples?method=browser
```

## Real-World Examples

### React Documentation

```
❌ Incomplete:
WebFetch("https://markdown.new/https://react.dev", ...)

✅ Complete:
WebFetch("https://markdown.new/https://react.dev?method=browser", ...)
```

React's docs are a modern SPA requiring full rendering.

### GitHub SPA Pages

```
❌ Incomplete:
WebFetch("https://markdown.new/https://github.com/user/repo/issues", ...)

✅ Complete:
WebFetch("https://markdown.new/https://github.com/user/repo/issues?method=browser", ...)
```

GitHub's issue pages load content dynamically.

### Vue.js Official Docs

```
✅ May work with auto:
WebFetch("https://markdown.new/https://vuejs.org/guide/...", ...)
```

Vue docs use SSR (server-side rendering), so auto method often works. Test first.

### Next.js App Router Docs

```
❌ Incomplete:
WebFetch("https://markdown.new/https://nextjs-app.example.com", ...)

✅ Complete:
WebFetch("https://markdown.new/https://nextjs-app.example.com?method=browser", ...)
```

Client-side Next.js apps need browser rendering.

## Performance Optimization

### Selective Browser Rendering

Use `method=browser` only for pages that need it:

```
# Landing page is static
WebFetch("https://markdown.new/https://example.com", "summarize")

# Docs are SPA
WebFetch("https://markdown.new/https://example.com/docs?method=browser", "analyze")

# Blog is static
WebFetch("https://markdown.new/https://example.com/blog/post", "summarize")
```

Mix methods based on content type.

### Cache Rendered Results

If processing same SPA multiple times:
```
1. Fetch once with method=browser
2. Store the Markdown result
3. Process stored result multiple times
4. Avoids repeated 5-10 second renders
```

## Summary

Use `method=browser` when:
- Site is a single-page application (React, Vue, Angular)
- Content is missing with default auto method
- Page shows "Loading..." or JavaScript requirement
- Site has client-side routing or heavy JavaScript

Accept the slower performance (5-10 seconds) for complete, accurate content. The token efficiency and content completeness make it worthwhile for JavaScript-heavy sites.

**Quick decision**: If content seems incomplete, retry with `method=browser`.
