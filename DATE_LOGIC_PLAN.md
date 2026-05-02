# Date Logic Plan

## Goal

Make status calculations clearer, faster, and more calendar-accurate.

## Current risk areas

- Business days are calculated with a day-by-day loop.
- Months use an approximate day value.
- Years use an approximate day value.
- Never-cleared items are treated as overdue without a separate state.

## Step-by-step plan

1. Keep current behavior documented before changing logic.
2. Replace the business-day loop with a formula-based calculation.
3. Add unit tests or manual test cases for weekends.
4. Add manual test cases for same-day, one-day, and multi-week differences.
5. Decide whether months and years should use true calendar dates.
6. If true calendar math is used, implement calendar-based due-date calculation.
7. Decide whether `Never Cleared` should be its own state or remain overdue.
8. Update status labels if logic changes.
9. Run the full status and date checklist.

## Suggested status model

- `never-cleared`
- `good`
- `warning`
- `overdue`

## Rules

- Do not silently change status thresholds without documenting the change.
- Keep current user data compatible.
- Test date logic around weekends and month boundaries.
