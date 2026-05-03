# Next Code Tasks

These are the next runtime code tasks in safe executable order.

## First task: obtain verified full index

1. Obtain a complete verified copy of `index.html`.
2. Confirm it includes the full `<style>` block.
3. Confirm it includes the full app markup.
4. Confirm it includes the full `<script>` block.
5. Do not continue runtime refactor work from truncated connector output.

See `FULL_INDEX_REQUIRED.md`.

## Second task: split files

1. Extract inline CSS from `index.html` into `styles.css`.
2. Extract inline JavaScript from `index.html` into `app.js`.
3. Keep `index.html` as markup only.
4. Load files in this order:
   - `styles.css`
   - `mobile-bg-fix.css`
   - `app.js`

## Third task: CSS cleanup

1. Remove unnecessary `!important` rules after cascade order is fixed.
2. Consolidate duplicate glass/card/status styles.
3. Keep `body::before` background behavior intact.
4. Test iPhone Safari background behavior.

## Fourth task: event cleanup

1. Replace inline `onclick` handlers with `data-action` attributes.
2. Add delegated click handling from the list container.
3. Remove global function exports.
4. Replace touch-only swipe with pointer events.

## Fifth task: data cleanup

1. Preserve acronyms in names.
2. Preserve note capitalization.
3. Validate imports strictly.
4. Add storage migration support.
5. Improve undo metadata.

## Guardrail

Do not rewrite `index.html` from truncated content.
