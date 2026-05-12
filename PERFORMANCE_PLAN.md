# Performance Plan

## Goal

Make the app smoother and lighter without changing user-facing behavior.

## Current risk areas

- The app appears to fully re-render the list after many actions.
- Event handlers may be reattached after every render.
- Swipe handlers are attached directly to cards.
- Date/status calculations run during render.

## Step-by-step plan

1. Continue replacing repeated card gesture attachment with delegated or pointer-event handling.
2. Keep click and keyboard handling delegated from the list container.
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
