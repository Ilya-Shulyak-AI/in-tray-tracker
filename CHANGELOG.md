# Changelog

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
  - `IMPLEMENTATION_BACKLOG.md`
  - `STABILIZATION_SUMMARY.md`
  - `KNOWN_LIMITATIONS.md`
  - `CHANGELOG.md`
- Added rollback guidance to `README.md`.
- Expanded manual regression testing coverage.
- Created GitHub issue #1 for blocked deeper `index.html` and JavaScript hardening work.

## Remaining planned work

See `IMPLEMENTATION_BACKLOG.md`, `KNOWN_LIMITATIONS.md`, and GitHub issue #1.
