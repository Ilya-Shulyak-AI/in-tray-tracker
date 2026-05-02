# CSS Cascade Plan

## Goal

Make the visual system easier to reason about by removing style conflicts and reducing `!important` usage.

## Current state

- `index.html` still contains the main app CSS inline.
- `mobile-bg-fix.css` contains the fixed background layer and several overrides.
- Some overrides still require `!important` because `mobile-bg-fix.css` is loaded before the inline `<style>` block.

## Target order

Final order should be:

1. `styles.css`
2. `mobile-bg-fix.css`

This lets mobile/background/glass rules win through normal cascade order.

## Step-by-step plan

1. Extract inline CSS from `index.html` into `styles.css` using a verified complete copy of the file.
2. Load `styles.css` first.
3. Load `mobile-bg-fix.css` second.
4. Confirm the fixed background layer still works on iPhone Safari.
5. Remove unnecessary `!important` declarations from `mobile-bg-fix.css`.
6. Consolidate duplicate glass/card/status styles.
7. Re-run the full visual and mobile checklist.

## Rules

- Do not remove `body::before` background behavior without iPhone Safari testing.
- Do not remove `!important` before stylesheet order is corrected.
- Do not make visual changes while doing extraction unless intentionally scoped.
