# Refactor Plan

## Completed baseline

1. Runtime files are split into `index.html`, `styles.css`, `app.js`, and targeted helper styles/scripts.
2. `index.html` is markup only apart from external stylesheet and script references.
3. Exact text preservation, tags, backup reminders, import cleanup, and swipe fixes are consolidated in `app.js`.

## Phase 1: Clean CSS cascade

1. Load `styles.css` before `mobile-bg-fix.css`.
2. Remove unnecessary `!important` rules.
3. Consolidate duplicate glass/card styles.
4. Keep the fixed background layer intact.

## Phase 2: Clean JavaScript events

1. Keep list click and keyboard handling delegated.
2. Replace repeated card touch attachment after render with delegated pointer events.
3. Preserve iPhone Safari scroll/swipe behavior.

## Phase 3: Harden data

1. Add a formal backup JSON schema document.
2. Add versioned storage support.
3. Improve undo metadata.

## Phase 4: Improve exactness and accessibility

1. Optimize business-day calculation.
2. Improve month/year date math.
3. Make cards keyboard-operable.
4. Add ARIA labels for actions and stats.

## Phase 5: Final verification

1. Run `TEST_CHECKLIST.md`.
2. Test on iPhone Safari.
3. Test export/import.
4. Test print preview.
5. Update `CHANGELOG.md`.
