# Event Handling Plan

## Goal

Make interaction handling simpler, faster, and less fragile.

## Current risk areas

- Inline `onclick` handlers exist in rendered card HTML.
- Some functions are exposed globally because inline handlers need them.
- Event handlers are reattached after each full render.
- Swipe handling is touch-specific instead of pointer-based.

## Target direction

Use delegated event handling from stable parent elements.

## Step-by-step plan

1. Add action data attributes to rendered buttons.
2. Replace inline `onclick` attributes with `data-action` and `data-id`.
3. Add one delegated click listener on the list container.
4. Route card actions through a small action dispatcher.
5. Remove global `window.markCleared`, `window.markWorkedOn`, and `window.startEdit`.
6. Replace repeated `attachHandlers()` calls with stable delegated listeners.
7. Convert swipe handling from touch events to pointer events.
8. Verify tap, expand, collapse, edit, worked-on, fully-cleared, and swipe behavior.

## Rules

- Do not change UI behavior while replacing handlers.
- Preserve current swipe thresholds unless intentionally scoped.
- Test on iPhone Safari after gesture changes.
