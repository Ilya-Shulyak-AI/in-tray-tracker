# In-Tray Tracker

A single-page web app for tracking personal or work in-trays, including when each tray was last fully cleared or worked on.

## Core files

- `index.html` contains the app structure, styles, and JavaScript.
- `mobile-bg-fix.css` contains the critical fixed background layer and mobile stability overrides.
- `TEST_CHECKLIST.md` contains the manual regression checklist.
- `IMPLEMENTATION_BACKLOG.md` contains remaining deeper JS/index hardening tasks.

## Critical background behavior

The app uses `body::before` in `mobile-bg-fix.css` as a fixed full-screen background layer. This avoids the iOS Safari issue where `background-attachment: fixed` is ignored and the background stretches with page height.

Do not remove or replace the pseudo-layer background system unless the replacement is tested on iPhone Safari.

## Storage

The app stores data locally in the browser using:

- `in-tray-tracker-v1`
- `in-tray-last-undo`

## Change workflow

1. Make one small patch at a time.
2. Avoid large `index.html` rewrites from truncated content.
3. Run the manual checklist after structural, visual, or JavaScript changes.
4. Prioritize stability over animation or visual complexity.

## Manual testing

Run `TEST_CHECKLIST.md` after structural, visual, or JavaScript changes.

## Remaining work

See `IMPLEMENTATION_BACKLOG.md` before continuing deeper refactors.
