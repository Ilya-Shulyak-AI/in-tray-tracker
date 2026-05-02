# Release Checklist

Use this before treating a refactor or stabilization pass as ready.

## Code checks

- [ ] App opens without console errors.
- [ ] App works with existing LocalStorage data.
- [ ] App works with no LocalStorage data.
- [ ] Export backup works.
- [ ] Import backup works.
- [ ] Undo works after key actions.

## Visual checks

- [ ] Background appears correctly.
- [ ] Background stays fixed on iPhone Safari.
- [ ] Header stays small and stable.
- [ ] Cards remain readable.
- [ ] Status badges are clear but not harsh.
- [ ] Print preview is readable.

## Interaction checks

- [ ] Tap expands cards.
- [ ] Tap collapses cards.
- [ ] Swipe left marks Fully Cleared.
- [ ] Swipe right marks Worked On.
- [ ] Vertical scrolling remains smooth.
- [ ] Search and filters work.

## Accessibility checks

- [ ] Keyboard focus is visible.
- [ ] Buttons are reachable by keyboard.
- [ ] Form fields are usable by keyboard.
- [ ] Cards are keyboard-operable after that feature is implemented.

## Documentation checks

- [ ] `CHANGELOG.md` is updated.
- [ ] `FILE_MAP.md` is updated if files were added or moved.
- [ ] `README.md` still reflects the current structure.
- [ ] `IMPLEMENTATION_BACKLOG.md` is updated if items are completed.

## Final checks

- [ ] Run `TEST_CHECKLIST.md`.
- [ ] Run `BROWSER_TEST_MATRIX.md`.
- [ ] Run `QA_SCENARIOS.md`.
- [ ] Test on iPhone Safari before calling the release stable.
