---
mode: "agent"
description: "Generate a LinkedIn/Instagram carousel as JSON for Carousel Magic V2"
tools: [""]
---

# Generate Carousel

Generate a professional LinkedIn/Instagram carousel presentation as a JSON file for: **{{ topic }}**

## Your Task

Output a single JSON code block (```json ... ```) — no other text — with the exact structure below. Follow ALL rules strictly.

## JSON Structure

```json
{
  "$schema": "carousel-magic-v2",
  "config": {
    "format": "1080x1080",
    "themeId": "<pick from available themes>",
    "fontSetId": "inter-jetbrains",
    "authorName": "Andrii Shevchenko",
    "authorHandle": "@andriy-shevchenko-dev",
    "authorInitials": "AS",
    "showNavDots": true,
    "showSlideNumbers": true,
    "showAuthorBadge": true,
    "showSwipeHint": true
  },
  "slides": [
    { "type": "hook", "title": "2-Line Hook Title\nWith Line Break", "subtitle": "Short subtitle" },
    { "type": "code", "code": "// max 12-15 lines", "codeLang": "typescript", "codeTextAbove": "# Heading\n- Bullet one\n- Bullet two" },
    { "type": "content", "title": "Title", "body": "• Bullet with **bold**\n• Bullet with `code`\n• Max 4-5 bullets" },
    { "type": "cta", "title": "Follow for more\nTopic content", "body": "Save this for later ↗" }
  ]
}
```

## Rules

**Slide structure:**
- 5-8 slides total. Slide 1 = "hook", last = "cta"
- Alternate "code" and "content" in between — never two same types in a row

**Content limits (overflow prevention):**
- Hook title: max 6 words/line, 2 lines
- Bullets: max 4-5 per slide, max 8 words each, start with •
- Code: max 12-15 lines, realistic working code, trimmed boilerplate
- codeTextAbove: 1 heading + 2-3 short bullets

**Field names (exact):**
- `type`, `title`, `subtitle`, `body`, `code`, `codeLang`, `codeTextAbove`
- Do NOT use: `language`, `text`, `content`, `heading`, `bullets`

**Rich text:** Use **bold** for key terms, `backticks` for code terms

**Available themes (dark):** one-dark-pro, github-dark, dracula, monokai, nord, tokyo-night, catppuccin-mocha, gruvbox-dark, rose-pine, synthwave-84
**Available themes (light):** github-light, solarized-light, catppuccin-latte
**Fonts:** inter-jetbrains, poppins-fira, space-source, geist, ibm-plex
**Languages:** javascript, typescript, python, csharp, java, go, rust, bash, json, yaml, sql, html, css

## Checklist
- [ ] Hook first, CTA last
- [ ] Code ≤15 lines, bullets ≤5 items
- [ ] Correct field names
- [ ] Valid JSON
