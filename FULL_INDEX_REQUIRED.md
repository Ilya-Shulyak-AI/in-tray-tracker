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

## First runtime refactor

After the full file is verified:

1. Extract the inline CSS into `styles.css`.
2. Extract the inline JavaScript into `app.js`.
3. Keep `index.html` as markup only.
4. Load styles in this order:
   - `styles.css`
   - `mobile-bg-fix.css`
5. Load `app.js` after the markup.

## Guardrails

- Preserve `mobile-bg-fix.css` and the fixed `body::before` background layer.
- Do not remove `!important` until stylesheet order is verified.
- Do not change UI behavior during the split.
- Test the app after each extraction step.
