# Undo Plan

## Goal

Make undo behavior clearer and safer while keeping the app simple.

## Current risk areas

- Undo is single-level only.
- Undo stores a previous list state but limited action metadata.
- Import, delete, edit, and swipe actions all overwrite the same undo slot.
- Users may assume undo is a full history system.

## Target behavior

Undo should remain simple but explicit:

```json
{
  "action": "edit",
  "before": [],
  "after": [],
  "expandedId": null,
  "timestamp": "ISO_DATE"
}
```

## Step-by-step plan

1. Rename the undo label field to `action`.
2. Store `before` state before each mutating action.
3. Optionally store `after` state after the mutation.
4. Preserve `expandedId` when useful.
5. Show a clearer undo button label only if it does not clutter the UI.
6. Keep single-level undo unless multi-step undo becomes necessary.
7. Ensure import creates an undo state before replacing current data.
8. Test undo after add, edit, delete, Fully Cleared, Worked On, and import.

## Rules

- Keep undo predictable.
- Do not present single-level undo as full history.
- Do not skip undo state before destructive actions.
