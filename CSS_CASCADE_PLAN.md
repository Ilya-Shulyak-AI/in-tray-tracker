# CSS Cascade Plan

## Goal

Make the visual system easier to reason about by removing style conflicts and reducing `!important` usage.

## Current state

- `styles.css` contains the main app CSS.
- `mobile-bg-fix.css` contains the fixed background layer and several mobile-focused overrides.
- Some overrides still use `!important` pending iPhone Safari verification.

## Runtime order

The current base order is:

1. `styles.css`
2. `mobile-bg-fix.css`

This lets mobile/background/glass rules win through normal cascade order.

## Step-by-step plan

1. Confirm the fixed background layer still works on iPhone Safari.
2. Remove unnecessary `!important` declarations from `mobile-bg-fix.css`.
3. Consolidate duplicate glass/card/status styles.
4. Re-run the full visual and mobile checklist.

## Rules

- Do not remove `body::before` background behavior without iPhone Safari testing.
- Do not remove `!important` before mobile behavior is verified.
- Keep visual changes intentionally scoped.
