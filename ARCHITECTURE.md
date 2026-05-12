# Architecture Notes

## Current structure

The app now runs from separated runtime files:

- `index.html` contains the markup and script/style loading order.
- `styles.css` contains the base visual system.
- `mobile-bg-fix.css` contains the fixed background layer and mobile stability overrides.
- `readability.css` and `help-panel.css` contain targeted presentation refinements.
- `app.js` contains the core application behavior.
- `help-panel.js` contains the help dialog behavior.

## Current constraint

Do not perform large `index.html` rewrites unless the full file is available without truncation. Keep the fixed-background behavior in `mobile-bg-fix.css` intact unless it has been tested on iPhone Safari.

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
