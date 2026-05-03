# Refactor Plan

## Phase 0: Hard gate before runtime edits

1. Obtain a verified complete copy of `index.html`.
2. Confirm the file includes the full `<head>` section.
3. Confirm the file includes the complete inline `<style>` block.
4. Confirm the file includes the complete app markup.
5. Confirm the file includes the complete inline `<script>` block.
6. Confirm the file ends with `</script>`, `</body>`, and `</html>`.

Do not perform runtime refactors from truncated content.

## Phase 1: Make files editable safely

1. Extract inline CSS into `styles.css`.
2. Extract inline JavaScript into `app.js`.
3. Keep `index.html` as markup only.
4. Confirm the app still loads after each extraction.

## Phase 2: Clean CSS cascade

1. Load `styles.css` before `mobile-bg-fix.css`.
2. Remove unnecessary `!important` rules.
3. Consolidate duplicate glass/card styles.
4. Keep the fixed background layer intact.

## Phase 3: Clean JavaScript events

1. Replace inline `onclick` handlers.
2. Remove global function exports.
3. Replace repeated event attachment after render with delegated listeners.
4. Convert touch-only swipe handling to pointer events.

## Phase 4: Harden data

1. Preserve acronyms in names.
2. Preserve note capitalization.
3. Validate imported backup schema.
4. Regenerate duplicate imported IDs.
5. Add versioned storage support.
6. Improve undo metadata.

## Phase 5: Improve exactness and accessibility

1. Optimize business-day calculation.
2. Improve month/year date math.
3. Make cards keyboard-operable.
4. Add ARIA labels for actions and stats.

## Phase 6: Final verification

1. Run `TEST_CHECKLIST.md`.
2. Test on iPhone Safari.
3. Test export/import.
4. Test print preview.
5. Update `CHANGELOG.md`.
