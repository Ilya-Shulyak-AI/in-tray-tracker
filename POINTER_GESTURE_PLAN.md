# Pointer Gesture Plan

## Goal

Replace touch-only swipe handling with pointer events so gestures are cleaner across iPhone, desktop, mouse, trackpad, and stylus.

## Current risk areas

- Swipe behavior is touch-specific.
- Handlers may be reattached after render.
- Desktop pointer behavior is limited.
- Swipe state is stored directly on DOM dataset values.

## Target behavior

- Tap expands or collapses cards.
- Swipe left marks Fully Cleared.
- Swipe right marks Worked On.
- Vertical scroll remains smooth.
- Partial swipe returns the card to normal.
- Mouse/trackpad behavior does not trigger accidental actions.

## Step-by-step plan

1. Add one delegated pointerdown listener on the list container.
2. Track starting X/Y coordinates.
3. Add pointermove handling only after movement crosses threshold.
4. Ignore horizontal gesture if vertical movement dominates.
5. Clamp horizontal movement to the existing visual limit.
6. On pointerup, trigger action only if threshold is crossed.
7. Reset transform if threshold is not crossed.
8. Preserve existing thresholds unless intentionally changing behavior.
9. Remove touchstart/touchmove/touchend listeners.
10. Re-test on iPhone Safari and desktop browsers.

## Suggested thresholds

- Start swipe after horizontal movement is greater than 12px.
- Trigger action after horizontal movement is greater than 85px.
- Clamp visual movement around 135px.

## Rules

- Do not break normal vertical scrolling.
- Do not trigger actions from small accidental movements.
- Keep actions reversible through undo.
