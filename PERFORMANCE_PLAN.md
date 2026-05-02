# Performance Plan

## Goal

Make the app smoother and lighter without changing user-facing behavior.

## Current risk areas

- The app appears to fully re-render the list after many actions.
- Event handlers may be reattached after every render.
- Swipe handlers are attached directly to cards.
- Large inline CSS and JavaScript make changes harder to isolate.
- Date/status calculations run during render.

## Step-by-step plan

1. Split inline JavaScript into `app.js` after full `index.html` access is available.
2. Replace repeated event attachment with delegated listeners.
3. Cache status calculations during a render pass if needed.
4. Avoid unnecessary full-list re-renders for simple timestamp changes if complexity stays low.
5. Keep DOM updates simple and predictable.
6. Use pointer events for swipe handling.
7. Test on iPhone Safari after gesture and render changes.

## Rules

- Do not optimize at the cost of stability.
- Do not introduce complex state management unless the app clearly needs it.
- Prefer readable code over clever code.
- Measure perceived smoothness on iPhone, not only desktop.
