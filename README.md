# In-Tray Tracker

A single-page web app for tracking personal or work in-trays, including when each tray was last fully cleared or worked on.

## Live app

Use the live In-Tray Tracker URL when you want to quickly open and test the app:

- [Open In-Tray Tracker](https://ilya-shulyak-ai.github.io/in-tray-tracker/)

## Core files

- `index.html` contains the app structure.
- `styles.css` contains the base app styles.
- `app.js` contains storage, rendering, filtering, import/export, and gesture behavior.
- `mobile-bg-fix.css` contains the critical fixed background layer and mobile stability overrides.
- `TEST_CHECKLIST.md` contains the manual regression checklist.
- `IMPLEMENTATION_BACKLOG.md` contains remaining deeper JS/index hardening tasks.
- `KNOWN_LIMITATIONS.md` documents current app limitations and risk areas.

## Critical background behavior

The app uses `body::before` in `mobile-bg-fix.css` as a fixed full-screen background layer. This avoids the iOS Safari issue where `background-attachment: fixed` is ignored and the background stretches with page height.

Do not remove or replace the pseudo-layer background system unless the replacement is tested on iPhone Safari.

## Storage

The app stores data locally in the browser using:

- `in-tray-tracker-v1`
- `in-tray-last-undo`
- `in-tray-stats-mode`
- `in-tray-tag-filter`
- `in-tray-last-backup-at`

## Change workflow

1. Make one small patch at a time.
2. Avoid large `index.html` rewrites from truncated content.
3. Run the manual checklist after structural, visual, or JavaScript changes.
4. Prioritize stability over animation or visual complexity.

## Rollback guidance

If a patch breaks the app, first revert the last commit that touched the broken file.

Known stabilization checkpoints:

- Full app restored and stylesheet placement fixed: `2a314a37560ccfe70c1100c74896edbd633c69c9`
- Header simplified: `2a3f0c75b36e507638f47f92d3ad8a4f752e6657`
- `index.html` formatted: `d58ac738d8f832f9f3099cc2fc511b14c1e08154`
- Stabilization summary added: `629f9b6c768f3d9118f42a6e5d45b1b55b2d68c1`

Before reverting, export a backup from the app if the current browser data matters.

## Manual testing

Run `TEST_CHECKLIST.md` after structural, visual, or JavaScript changes.

## Known limitations

See `KNOWN_LIMITATIONS.md` before relying on the app for critical data.

## Remaining work

See `IMPLEMENTATION_BACKLOG.md` before continuing deeper refactors.
