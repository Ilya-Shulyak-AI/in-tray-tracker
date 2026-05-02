# In-Tray Tracker Manual Test Checklist

Run this checklist after each structural or behavior patch.

## Core app load

- [ ] App opens without a blank screen.
- [ ] Black hole background displays.
- [ ] Background stays fixed while scrolling on iPhone.
- [ ] In-Trays scroll over the background.
- [ ] Header remains visible.
- [ ] Header does not animate or resize on scroll.

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
- [ ] Confirm Never Cleared items display intentionally.

## Swipe actions

- [ ] Swipe left marks Fully Cleared.
- [ ] Swipe right marks Worked On.
- [ ] Partial swipe returns card to normal.
- [ ] Normal vertical scrolling still works.
- [ ] Desktop mouse or trackpad interaction does not break card behavior.

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
- [ ] Import does not silently accept malformed data.
- [ ] Import handles duplicate IDs safely.
- [ ] Undo works after import.

## Undo

- [ ] Undo works after add.
- [ ] Undo works after edit.
- [ ] Undo works after delete.
- [ ] Undo works after Fully Cleared.
- [ ] Undo works after Worked On.
- [ ] Undo restores expanded/collapsed state acceptably.

## Text handling

- [ ] Acronyms such as IT, PDF, LLC, IRS, CRM, URL, and HR are preserved.
- [ ] Notes preserve the user's intended capitalization.
- [ ] Special characters render safely.

## Accessibility

- [ ] Buttons show a visible keyboard focus outline.
- [ ] Form fields show a visible keyboard focus outline.
- [ ] Cards can be operated without a mouse or touch after keyboard support is added.
- [ ] Screen-reader labels are clear after ARIA support is added.

## Mobile checks

- [ ] iPhone Safari background does not stretch.
- [ ] iPhone Safari scrolling is smooth.
- [ ] Buttons are tappable.
- [ ] Inputs are usable.
- [ ] Inputs do not trigger unwanted zoom.
- [ ] Bottom content is not hidden by the iPhone home indicator.
- [ ] No horizontal page drift.
- [ ] No header flicker.

## Reduced motion

- [ ] Reduced-motion mode disables smooth scrolling.
- [ ] Reduced-motion mode minimizes transitions.
- [ ] App remains usable with reduced motion enabled.

## Print

- [ ] Print preview has no black hole background.
- [ ] Print preview hides toolbar, backup controls, and footer note.
- [ ] Printed cards are readable on a white background.
