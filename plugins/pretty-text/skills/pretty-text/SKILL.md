---
name: pretty-text
description: Turns the user's text into a polished one-page web app delivered as a single self-contained HTML file that opens offline from file://, with no server. Use when the user asks to make a text look nice, turn text or notes into a web page, or says "make this pretty", "сделай красиво", "оформи текст". Prototype skill for the single-file template approach.
---

# Pretty Text

You turn the user's text into a page by filling a prebuilt template. Do not write HTML, CSS or JavaScript yourself. Write the content as JSON; `scripts/render.py` (Python 3, standard library only) puts it into `assets/template.html`. Paths are relative to the folder that contains this file.

## 1. Write the content as JSON

```json
{
  "lang": "en",
  "eyebrow": "Short label above the title",
  "title": "Page title",
  "lede": "One or two sentences that sum up the text",
  "sections": [
    {
      "heading": "Section heading",
      "paragraphs": ["First paragraph.", "Second paragraph."],
      "points": ["Optional bullet", "Another bullet"]
    }
  ]
}
```

- Required: `title`, and `sections` with at least one item. Each section needs a `heading` and at least one of `paragraphs` or `points`. Everything else is optional. Unknown fields are rejected.
- Plain text only. HTML and Markdown are shown literally, so do not use them.
- Keep the user's wording and language, and set `lang` to that language (`ru`, `en`, ...).
- You may split the text into 2–6 sections, write short headings, take the lede from the text, and turn lists in the text into `points`. Do not add facts, opinions or examples that are not in the text. A very short text can be one section.

## 2. Render

```bash
python3 <this-skill-folder>/scripts/render.py - pretty-text.html <<'JSON'
{ "title": "...", "sections": [ ... ] }
JSON
```

You can also pass a path to a JSON file instead of `-`. The script validates the content. On success it prints the absolute path of the HTML file. Otherwise it lists what to fix and exits with status 1; fix the JSON and run it again.

Save the file where the user can reach it: the current working folder in a coding agent, or `/mnt/user-data/outputs/` in Claude apps with code execution.

## 3. Show it and return it

The file needs no server. Show it with the first option your environment has:

1. A browser or preview tool that can open a local file: open `file://<absolute path>`.
2. A way to share or attach files in the chat: share the HTML file itself.
3. Neither: give the path and tell the user to open it in any browser.

Never retype, shorten or edit the HTML into a chat artifact or code block. The file is about 230 KB because code, styles and the font are inlined, and it must stay byte-identical. Tell the user the file name and that it works offline in any browser.

## What the page does

It shows the title and lede, then one section at a time in a card with Back and Next buttons (the ← → keys also work), a contents list for jumping between sections, and a light/dark theme switch.
