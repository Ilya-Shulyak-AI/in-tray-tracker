# Browser Test Matrix

Use this with `TEST_CHECKLIST.md`.

## Devices and browsers

| Browser or device | Priority | Check |
|---|---:|---|
| iPhone Safari | Critical | Background, scrolling, form focus, bottom spacing, swipe actions |
| iPhone Chrome | High | Background, scrolling, form focus, swipe actions |
| Desktop Safari | High | Layout, glass effect, print view |
| Desktop Chrome | High | Core actions, backup, layout |
| Desktop Edge | Medium | Core actions and layout |
| Desktop Firefox | Medium | Core actions and layout |

## iPhone checks

- Background stays visually fixed.
- Cards scroll over the background.
- Form fields are usable.
- Bottom content has enough spacing.
- Swipe actions work.
- Vertical scrolling stays smooth.
- Page does not drift sideways.

## Desktop checks

- App loads cleanly.
- Search and filters work.
- Export and import work.
- Print view is readable.
- Keyboard focus is visible.

## Before storage changes

Export a JSON backup before testing storage, import, or migration changes.
