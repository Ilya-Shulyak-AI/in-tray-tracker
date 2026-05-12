# In-Tray Tracker Implementation Backlog

This backlog tracks completed stabilization work and remaining cleanup after the runtime split. See `FULL_INDEX_REQUIRED.md` before making any large `index.html` edits.

## Completed stabilization items

1. Runtime files are split across `index.html`, `styles.css`, `app.js`, and `mobile-bg-fix.css`.
2. CSS cascade order is established as `styles.css`, `mobile-bg-fix.css`, `readability.css`, then targeted component CSS.
3. Inline spacing and click handlers have been replaced with reusable classes and event listeners.
4. Deprecated patch scripts for exact text, gestures, and tags have been consolidated into `app.js`.

## Remaining cleanup

5. Replace per-render touch listener attachment with broader delegated or pointer-event handling.
6. Remove unnecessary `!important` rules after targeted mobile/iPhone testing.
7. Consolidate duplicate glass/card/status styles.

## Data hardening

8. Exact name and note capitalization is preserved for new saves and imports.
9. Import normalization validates cadence units, cadence numbers, dates, tags, and duplicate IDs.
10. Add a formal JSON schema document for backups.
11. Add a versioned storage wrapper while preserving compatibility with existing `in-tray-tracker-v1` arrays.
12. Improve undo payload shape to include richer action metadata.

## Date logic

15. Replace business-day loop with a formula-based calculation.
16. Consider true calendar math for months and years instead of fixed day approximations.
17. Decide whether Never Cleared should be a separate status or remain overdue.

## Accessibility

18. Make interactive cards keyboard-operable.
19. Add clear ARIA labels for card actions and stats toggle.
20. Add visible focus state for interactive cards.

## Verification

21. Run `TEST_CHECKLIST.md`.
22. Run `BROWSER_TEST_MATRIX.md`.
23. Run `QA_SCENARIOS.md`.
24. Test iPhone Safari before calling the runtime refactor stable.

## Rule

Do not make large `index.html` replacements from truncated content. Patch runtime files only from a complete verified copy of `index.html`.
