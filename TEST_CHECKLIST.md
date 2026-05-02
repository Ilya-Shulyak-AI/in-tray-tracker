# In-Tray Tracker Manual Test Checklist

Run this checklist after each structural or behavior patch.

## Core app load

- [ ] App opens without a blank screen.
- [ ] Black hole background displays.
- [ ] Background stays fixed while scrolling on iPhone.
- [ ] In-Trays scroll over the background.
- [ ] Header remains visible.

## In-Tray actions

- [ ] Add a new In-Tray.
- [ ] Edit an existing In-Tray.
- [ ] Delete an In-Tray.
- [ ] Tap an In-Tray to expand.
- [ ] Tap an expanded In-Tray to collapse.

## Status tracking

- [ ] Mark an In-Tray as Fully Cleared.
- [ ] Mark an In-Tray as Worked On.
- [ ] Confirm status badge updates correctly.
- [ ] Confirm Last Fully Cleared updates correctly.
- [ ] Confirm Last Worked On updates correctly.

## Swipe actions

- [ ] Swipe left marks Fully Cleared.
- [ ] Swipe right marks Worked On.
- [ ] Partial swipe returns card to normal.
- [ ] Normal vertical scrolling still works.

## Search and filter

- [ ] Search filters results by name.
- [ ] Search filters results by notes.
- [ ] Good filter works.
- [ ] Needs Attention filter works.
- [ ] Overdue filter works.
- [ ] All filter restores full list.

## Backup and restore

- [ ] Export Backup downloads JSON.
- [ ] Import Backup accepts valid JSON.
- [ ] Import Backup rejects invalid JSON.
- [ ] Undo works after import.

## Undo

- [ ] Undo works after add.
- [ ] Undo works after edit.
- [ ] Undo works after delete.
- [ ] Undo works after Fully Cleared.
- [ ] Undo works after Worked On.

## Mobile checks

- [ ] iPhone Safari background does not stretch.
- [ ] iPhone Safari scrolling is smooth.
- [ ] Buttons are tappable.
- [ ] Inputs are usable.
- [ ] No header flicker.
