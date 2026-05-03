# Changelog

## Runtime refactor setup

- Created `runtime-refactor` branch.
- Added `FULL_INDEX_REQUIRED.md`.
- Added placeholder runtime files:
  - `styles.css`
  - `app.js`
- Updated runtime task ordering so full `index.html` verification is the first gate.
- Updated file map and backlog to reflect the runtime gate.
- Created GitHub issue #2 for splitting runtime files from a verified full `index.html`.

## Stabilization pass

- Restored the full app into `index.html`.
- Moved the mobile background fix stylesheet into the document head.
- Removed duplicate inline background ownership from `index.html`.
- Simplified the header into a stable, always-small version.
- Formatted `index.html` once for readability.
- Stabilized `mobile-bg-fix.css` with fixed background, mobile viewport, safe-area, tap, selection, focus, reduced-motion, dark-mode, compact-height, and print rules.
- Added project documentation:
  - `README.md`
  - `TEST_CHECKLIST.md`
  - `BROWSER_TEST_MATRIX.md`
  - `QA_SCENARIOS.md`
  - `RELEASE_CHECKLIST.md`
  - `IMPLEMENTATION_BACKLOG.md`
  - `STABILIZATION_SUMMARY.md`
  - `KNOWN_LIMITATIONS.md`
  - `CHANGELOG.md`
  - `ARCHITECTURE.md`
  - `REFACTOR_PLAN.md`
  - `CONTRIBUTING.md`
  - `BACKUP_GUIDE.md`
  - `ROLLBACK_GUIDE.md`
  - `FILE_MAP.md`
  - `LOCAL_DEV_SETUP.md`
  - `CSS_CASCADE_PLAN.md`
  - `EVENT_HANDLING_PLAN.md`
  - `DATA_MODEL_PLAN.md`
  - `STORAGE_MIGRATION_PLAN.md`
  - `IMPORT_VALIDATION_PLAN.md`
  - `TEXT_NORMALIZATION_PLAN.md`
  - `UNDO_PLAN.md`
  - `DATE_LOGIC_PLAN.md`
  - `POINTER_GESTURE_PLAN.md`
  - `ACCESSIBILITY_PLAN.md`
  - `PERFORMANCE_PLAN.md`
- Added rollback guidance to `README.md`.
- Expanded manual regression testing coverage.
- Created GitHub issue #1 for blocked deeper `index.html` and JavaScript hardening work.

## Remaining planned work

See `IMPLEMENTATION_BACKLOG.md`, `KNOWN_LIMITATIONS.md`, `REFACTOR_PLAN.md`, `FULL_INDEX_REQUIRED.md`, and GitHub issues #1 and #2.
