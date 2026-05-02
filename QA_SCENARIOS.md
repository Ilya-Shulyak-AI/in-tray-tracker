# QA Scenarios

Use these scenarios with `TEST_CHECKLIST.md` and `BROWSER_TEST_MATRIX.md`.

## Scenario 1: First load

1. Open the app in a browser with no existing LocalStorage data.
2. Confirm seed In-Trays appear.
3. Confirm the background displays.
4. Confirm the header is small and stable.

## Scenario 2: Daily use

1. Add a new In-Tray.
2. Mark it Worked On.
3. Mark it Fully Cleared.
4. Confirm status and timestamps update.
5. Use Undo after each action.

## Scenario 3: Search and filter

1. Search for an existing In-Tray by name.
2. Search by notes text.
3. Toggle status filters.
4. Clear search and return to all results.

## Scenario 4: Backup and restore

1. Export a backup.
2. Delete or edit one In-Tray.
3. Import the backup.
4. Confirm the restored list is correct.
5. Confirm Undo after import behaves acceptably.

## Scenario 5: Bad import

1. Try importing non-JSON text.
2. Try importing JSON with the wrong shape.
3. Try importing duplicate IDs.
4. Confirm bad imports do not replace current data.

## Scenario 6: Mobile gesture

1. Open on iPhone Safari.
2. Scroll vertically through the list.
3. Partially swipe a card and release.
4. Swipe left past threshold.
5. Swipe right past threshold.
6. Confirm undo works after each action.

## Scenario 7: Accessibility

1. Navigate with keyboard only.
2. Confirm visible focus on controls.
3. Confirm actions can be reached.
4. Confirm cards become keyboard-operable after that feature is implemented.

## Scenario 8: Print

1. Open print preview.
2. Confirm no background image prints.
3. Confirm cards are readable.
4. Confirm controls are hidden.
