# Accessibility Plan

## Goal

Make the app usable with keyboard navigation and clearer for assistive technologies.

## Current risk areas

- Cards behave like buttons but are rendered as generic elements.
- Expanded/collapsed state is visual but not clearly exposed semantically.
- Swipe actions may not have keyboard equivalents.
- Stats toggle needs a clear accessible label.

## Step-by-step plan

1. Make compact cards focusable with `tabindex="0"` or convert them to button-like semantic elements.
2. Add keyboard support for Enter and Space to expand/collapse cards.
3. Add keyboard equivalents for Fully Cleared, Worked On, and Edit.
4. Add `aria-expanded` to card toggle elements.
5. Add descriptive `aria-label` values to card actions.
6. Add an accessible label for the stats count/percentage toggle.
7. Ensure focus order follows visual order.
8. Ensure focus outlines are visible on cards and actions.
9. Test with keyboard only.
10. Test with a screen reader after major semantic changes.

## Rules

- Do not remove visible focus indicators.
- Do not rely on swipe-only actions.
- Keep touch behavior intact while adding keyboard support.
