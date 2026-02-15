# Example: Fetching Content with Images

This example demonstrates using `retain_images=true` to preserve visual content.

## Scenario

User wants to analyze API documentation that includes sequence diagrams and architecture diagrams.

## User Request

```
"Analyze the authentication flow from this API documentation: https://docs.example.com/auth-guide
The docs include sequence diagrams that are important for understanding the flow."
```

## Implementation

### Step 1: Construct markdown.new URL with retain_images

```
Original URL: https://docs.example.com/auth-guide
markdown.new URL: https://markdown.new/https://docs.example.com/auth-guide?retain_images=true
```

**Why retain_images=true**: Sequence diagrams are essential for understanding the authentication flow.

### Step 2: Use WebFetch

```
WebFetch(
  "https://markdown.new/https://docs.example.com/auth-guide?retain_images=true",
  "Explain the authentication flow described in this documentation. Pay attention to the sequence diagrams."
)
```

### Step 3: Process Response

The response includes Markdown with image references:

```markdown
---
title: Authentication Guide
url: https://docs.example.com/auth-guide
---

# Authentication Guide

Our API uses OAuth 2.0 for authentication. The flow works as follows:

## Authentication Flow

![OAuth 2.0 Sequence Diagram](https://docs.example.com/images/oauth-sequence.png)

The diagram above shows the complete flow:

1. Client requests authorization
2. User grants permission
3. Authorization server returns code
4. Client exchanges code for token
5. Client uses token for API requests

## Implementation Example

![Architecture Diagram](https://docs.example.com/images/auth-architecture.png)

[...documentation continues...]
```

## Response

```
Based on the documentation and diagrams, here's how the authentication flow works:

**Overview**: The API implements OAuth 2.0 authorization code flow with the following steps:

1. **Authorization Request**: The client redirects the user to the authorization server with:
   - client_id
   - redirect_uri
   - scope
   - state (for CSRF protection)

2. **User Consent**: The user reviews the requested permissions and grants or denies access

3. **Authorization Code**: Upon approval, the authorization server redirects back to the client with:
   - authorization code (single-use, short-lived)
   - state parameter (verified against original)

4. **Token Exchange**: The client makes a server-to-server request to exchange the code for:
   - access_token (for API requests)
   - refresh_token (for obtaining new access tokens)
   - expires_in (token lifetime)

5. **API Access**: The client includes the access token in API requests via the Authorization header:
   ```
   Authorization: Bearer {access_token}
   ```

The sequence diagram shows this is a standard OAuth 2.0 flow, and the architecture diagram indicates that the authorization server is separate from the resource server, following best practices for security.

**Key Security Points**:
- State parameter prevents CSRF attacks
- Authorization codes are single-use and short-lived
- Token exchange happens server-to-server (code never exposed to browser)
- Refresh tokens allow obtaining new access tokens without re-authentication
```

## Token Comparison

### With retain_images=true

```
Request: https://markdown.new/https://docs.example.com/auth-guide?retain_images=true
Tokens: ~2,500 (including image URL references)
```

### Without retain_images (default)

```
Request: https://markdown.new/https://docs.example.com/auth-guide
Tokens: ~2,300 (images stripped)
```

**Image token cost**: ~200 tokens (10-15 images × ~15 tokens each)

### Direct HTML fetch

```
Request: https://docs.example.com/auth-guide
Tokens: ~12,000 (HTML with styling, scripts, navigation)
```

**Savings vs HTML**: 9,500 tokens (79% reduction)

## Why Images Matter Here

1. **Sequence diagrams**: Show message flow and timing
2. **Architecture diagrams**: Illustrate component relationships
3. **Visual examples**: Screenshots of auth screens
4. **Flowcharts**: Decision trees for error handling

These visuals are essential for understanding the authentication system.

## When to Use retain_images=true

### Use Cases

**Technical Documentation**:
```
WebFetch("https://markdown.new/https://docs.example.com?retain_images=true", "explain the architecture")
```

**Design Mockups**:
```
WebFetch("https://markdown.new/https://figma.com/file/ABC?retain_images=true", "describe the UI design")
```

**Tutorial with Screenshots**:
```
WebFetch("https://markdown.new/https://tutorial.com/setup-guide?retain_images=true", "follow this setup guide")
```

**Research Papers**:
```
WebFetch("https://markdown.new/https://arxiv.org/abs/1234?retain_images=true", "summarize this paper")
```

### Skip Images

**Blog Articles**:
```
WebFetch("https://markdown.new/https://blog.example.com/post", "summarize")
```
Images are usually decorative.

**News Articles**:
```
WebFetch("https://markdown.new/https://news.example.com/article", "extract key points")
```
Photos add tokens without essential information.

**Text-Heavy Content**:
```
WebFetch("https://markdown.new/https://wikipedia.org/wiki/Topic", "explain this concept")
```
Wikipedia images are supplementary.

## Variations

### Combine with Browser Method

For JavaScript-heavy documentation sites:

```
WebFetch(
  "https://markdown.new/https://docs.modern-framework.com?method=browser&retain_images=true",
  "analyze the component architecture"
)
```

Use when docs are a SPA AND images are essential.

### Multiple Documentation Pages

```
1. WebFetch("https://markdown.new/https://docs.example.com/auth?retain_images=true", "auth flow")
2. WebFetch("https://markdown.new/https://docs.example.com/api?retain_images=true", "API usage")
3. WebFetch("https://markdown.new/https://docs.example.com/webhooks?retain_images=true", "webhook setup")
```

Token efficiency makes fetching multiple pages with images practical.

## Best Practices

### 1. Evaluate Image Necessity

Ask yourself:
- Are images essential for understanding?
- Do they contain information not in text?
- Are they diagrams/charts vs decorative photos?

If yes to any: Use `retain_images=true`

### 2. Check Token Budget

```
If task requires multiple pages:
  Estimate: pages × 2,500 tokens each
  Check: Total < context window budget
  If too high: Skip retain_images on less critical pages
```

### 3. Reference Images in Prompts

When images are retained, explicitly ask Claude to analyze them:

```
"Analyze this documentation. Pay special attention to the sequence diagrams and explain the flow they illustrate."
```

### 4. Understand Image Formats

markdown.new returns images as Markdown:
```markdown
![Alt text](https://example.com/image.png)
```

Claude can reference but not "see" the images. Images are URLs, not embedded content.

### 5. Balance Token Cost

```
Documentation page with 20 images:
- With retain_images: ~3,000 tokens
- Without: ~2,700 tokens
- Cost: 300 tokens

Is visual context worth 300 tokens? Often yes for technical docs.
```

## Common Issues

### Issue: Images not helping

**Symptom**: Claude's response doesn't reference images

**Solution**: Explicitly mention images in prompt:
```
"Explain the authentication flow. Reference the sequence diagram to describe each step."
```

### Issue: Too many image URLs

**Symptom**: Response cluttered with unimportant images

**Solution**: Next time, skip `retain_images` or instruct Claude:
```
"Summarize this page, focusing on text content and ignoring decorative images."
```

### Issue: Images are broken links

**Symptom**: Image URLs return 404

**Solution**: This is a source page issue, not markdown.new. Images may be:
- Lazy-loaded (try `method=browser`)
- Behind authentication
- Dynamically generated

## Real-World Use Cases

### API Documentation Analysis

```
Task: "Compare authentication methods across three API documentation sites"

Approach:
1. Fetch each with retain_images=true
2. Analyze sequence diagrams
3. Compare implementation patterns
4. Generate recommendation

Why images matter: Flow diagrams show subtle differences
```

### Tutorial Following

```
Task: "Follow this setup tutorial and identify potential issues"

Approach:
1. Fetch with retain_images=true
2. Examine screenshots of each step
3. Identify UI changes since tutorial was written
4. Suggest updates

Why images matter: Screenshots show actual UI state
```

### Research Paper Summary

```
Task: "Summarize this machine learning paper"

Approach:
1. Fetch with retain_images=true
2. Analyze architecture diagrams
3. Review performance charts
4. Explain methodology

Why images matter: Diagrams show model architecture, charts show results
```

## Summary

Use `retain_images=true` when:
- Visual content is essential for understanding
- Diagrams convey information not in text
- Screenshots show UI/UX details
- Charts display data visually

Skip `retain_images` when:
- Images are decorative
- Text alone is sufficient
- Minimizing tokens is critical
- Processing many pages

The small token cost (~10-15 tokens per image) is worthwhile when visual context enhances understanding.
