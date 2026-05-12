# Next Code Tasks

These are the next runtime code tasks in safe executable order.

## Completed baseline

1. Runtime files are split into `index.html`, `styles.css`, `app.js`, and targeted CSS/JS helpers.
2. `index.html` is markup only apart from external stylesheet and script references.
3. CSS loads in a stable order with `mobile-bg-fix.css` after base styles.
4. Exact text preservation, tags, backup reminders, import cleanup, and swipe fixes are consolidated in `app.js`.

## First task: CSS cleanup

1. Remove unnecessary `!important` rules after cascade order is fixed.
2. Consolidate duplicate glass/card/status styles.
3. Keep `body::before` background behavior intact.
4. Test iPhone Safari background behavior.

## Second task: event cleanup

1. Keep delegated click and keyboard handling from the list container.
2. Replace per-card touch listener attachment with pointer events or a delegated gesture layer.
3. Preserve iPhone Safari scroll/swipe behavior.

## Third task: data cleanup

1. Add a formal backup JSON schema.
2. Add versioned storage migration support.
3. Improve undo metadata.

## Guardrail

Do not rewrite `index.html` from truncated content.
