# In-Tray Tracker Implementation Backlog

These changes remain after the CSS/mobile stabilization pass. They should be implemented only when `index.html` can be fetched and patched without truncation.

## High priority

1. Move `mobile-bg-fix.css` after the inline `<style>` or split CSS into dedicated files so cascade order is clean.
2. Remove inline `style="margin-top:8px;"` attributes and replace them with a reusable `.mt-8` class.
3. Replace inline `onclick` handlers with event delegation.
4. Remove global `window.markCleared`, `window.markWorkedOn`, and `window.startEdit` exports after inline handlers are gone.
5. Replace full re-render event reattachment with delegated listeners.

## Data hardening

6. Fix title-case behavior so acronyms such as IT, PDF, LLC, IRS, and CRM are preserved.
7. Add import schema validation for required fields, dates, cadence units, and cadence numbers.
8. Regenerate duplicate imported IDs.
9. Add a versioned storage wrapper while preserving compatibility with existing `in-tray-tracker-v1` arrays.
10. Improve undo payload shape to include action metadata.

## Date logic

11. Replace business-day loop with a formula-based calculation.
12. Consider true calendar math for months and years instead of fixed day approximations.

## Accessibility

13. Make interactive cards keyboard-operable.
14. Add clear ARIA labels for card actions and stats toggle.

## Architecture

15. Eventually split into:

- `index.html`
- `styles.css`
- `app.js`
- `mobile-bg-fix.css` or merged equivalent

## Rule

Do not make large `index.html` replacements from truncated content. If the connector output truncates the file, patch only smaller verified files or use a safer file access method first.
