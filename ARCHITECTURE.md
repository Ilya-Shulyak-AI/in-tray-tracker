# Architecture Notes

## Current structure

The app currently runs from a mostly single-file structure:

- `index.html` contains markup, inline CSS, and inline JavaScript.
- `mobile-bg-fix.css` contains the fixed background layer and mobile stability overrides.

This structure works, but it makes deeper edits harder because a small change can require replacing a large file.

## Current constraint

Do not perform large `index.html` rewrites unless the full file is available without truncation.

## Target structure

The preferred future structure is:

- `index.html` for markup only.
- `styles.css` for base app styles.
- `mobile-bg-fix.css` for the fixed background layer or a carefully merged equivalent.
- `app.js` for app behavior.

## CSS order

Final stylesheet order should be:

1. `styles.css`
2. `mobile-bg-fix.css`

This allows the mobile/background/glass fixes to win through normal cascade order instead of `!important`.

## JavaScript direction

Future JavaScript should be organized by responsibility:

- storage
- state
- status calculation
- rendering
- form actions
- import/export
- gesture handling

## Guardrail

Keep each refactor small and test after each patch.
