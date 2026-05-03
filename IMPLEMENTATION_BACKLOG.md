# In-Tray Tracker Implementation Backlog

These runtime changes are gated until a complete verified copy of `index.html` is available.

See `FULL_INDEX_REQUIRED.md` before editing runtime app files.

## Blocked until full index is verified

1. Split runtime files into:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `mobile-bg-fix.css`
2. Move CSS cascade into the correct order:
   - `styles.css`
   - `mobile-bg-fix.css`
3. Remove inline `style="margin-top:8px;"` attributes and replace them with a reusable `.mt-8` class.
4. Replace inline `onclick` handlers with event delegation.
5. Remove global `window.markCleared`, `window.markWorkedOn`, and `window.startEdit` exports after inline handlers are gone.
6. Replace full re-render event reattachment with delegated listeners.
7. Remove unnecessary `!important` rules after cascade order is fixed.
8. Consolidate duplicate glass/card/status styles.

## Data hardening

9. Fix title-case behavior so acronyms such as IT, PDF, LLC, IRS, CRM, URL, and HR are preserved.
10. Preserve note capitalization instead of title-casing notes.
11. Add import schema validation for required fields, dates, cadence units, and cadence numbers.
12. Regenerate duplicate imported IDs.
13. Add a versioned storage wrapper while preserving compatibility with existing `in-tray-tracker-v1` arrays.
14. Improve undo payload shape to include action metadata.

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
