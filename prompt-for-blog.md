# Content Generation Prompt for Blog Posts from Scraped HTML

You are tasked with creating an SEO-heavy blog post based on the provided HTML article content. Follow these exact steps:

## Step 1: File Creation & Structure
- Create file as: `data/blog/[seo-title].mdx` (NOT in subfolder with index.mdx)
- Use hyphens (-) instead of colons (:) throughout the entire article

## Step 2: Frontmatter (EXACT ORDER REQUIRED)
```
---
title: '[Compelling Title]'
date: '[YYYY-MM-DD]'
tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6']
draft: false
images: []
summary: [Plain text summary, no quotes]
---
```

## Step 3: Content Creation
- Write original, engaging content (NOT copy/paste from HTML)
- Maintain journalistic analysis and review style
- Cover key elements: premise, themes, strengths, weaknesses
- Use SEO-friendly headings and structure

## Step 4: Multimedia Extraction
- Extract YouTube trailer URL from HTML if present
- Add at end: `<YouTube url="https://www.youtube.com/watch?v=[VIDEO_ID]" title="[Descriptive Title]" />`

## Step 5: Final Formatting Check
- Ensure no single quotes in summary string
- Frontmatter order: title → date → tags → draft → images → summary
- Use proper <YouTube> component format
- All content uses hyphens instead of colons

## Example File Structure:
✅ `data/blog/example-movie-review.mdx`
❌ `data/blog/example-movie-review/index.mdx`

## Key Lessons Learned:
- Always use direct `.mdx` files, never `index.mdx` in subfolders
- Frontmatter order must be: title, date, tags, draft, images, summary
- Extract YouTube trailers from original HTML when available
- Summary field must have no quotes around the text
- Replace all colons (:) with hyphens (-) in content
- Content should be SEO-heavy but original, not copied
- use existing tags from tag-data.json file

**Content must be original analysis, not copied text. Extract key plot points and themes from HTML but rewrite in your own words to create engaging blog content.**
