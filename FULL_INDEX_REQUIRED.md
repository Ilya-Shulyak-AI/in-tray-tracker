# Full Index Required

## Purpose

Runtime refactor work must start from a complete verified copy of `index.html`.

Do not split, rewrite, or partially reconstruct `index.html` from truncated connector output.

## Why this file exists

The current app still stores markup, CSS, and JavaScript inside `index.html`. Some connector fetch paths truncate the file, which makes runtime edits unsafe.

## Required source

Use one of these sources before editing runtime files:

1. A local clone of the repository.
2. GitHub web editor with the full `index.html` visible.
3. A complete uploaded copy of `index.html` verified from top to bottom.

## Verification checklist

Before editing, confirm the full file includes:

- `<!DOCTYPE html>` at the top.
- The complete `<head>` section.
- The complete inline `<style>` block.
- The complete app markup inside `<body>`.
- The complete inline `<script>` block.
- Closing `</script>`, `</body>`, and `</html>` tags.

## Runtime refactor status

The runtime split has been completed:

1. `index.html` contains markup and external file references.
2. `styles.css` contains base styles.
3. `mobile-bg-fix.css` preserves the fixed background layer.
4. `app.js` contains core app behavior.

Continue to avoid large `index.html` rewrites from truncated content.

## Guardrails

- Preserve `mobile-bg-fix.css` and the fixed `body::before` background layer.
- Do not remove `!important` until mobile behavior is verified.
- Keep UI behavior changes intentionally scoped.
- Test the app after each runtime change.
