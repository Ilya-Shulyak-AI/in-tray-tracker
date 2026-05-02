# Data Model Plan

## Goal

Make app data safer to import, store, migrate, and recover.

## Current storage keys

- `in-tray-tracker-v1`
- `in-tray-last-undo`

## Current risk areas

- Stored data is mostly a raw array.
- Import validation is limited.
- Duplicate imported IDs may not be handled safely.
- Notes and names are automatically title-cased.
- Undo stores only one previous state.

## Target storage shape

Future storage should support a versioned wrapper:

```json
{
  "version": 2,
  "intrays": [],
  "updatedAt": "ISO_DATE"
}
```

Existing raw-array storage should still be supported during migration.

## Validation rules

Each In-Tray should have:

- `id`: non-empty string, unique
- `name`: non-empty string with length limit
- `notes`: string with length limit
- `cadenceNumber`: finite number greater than or equal to 1
- `cadenceUnit`: one of `days`, `business-days`, `weeks`, `months`, `years`
- `createdAt`: valid ISO date or regenerated date
- `lastClearedAt`: valid ISO date or null
- `lastWorkedOnAt`: valid ISO date or null

## Step-by-step plan

1. Add a normalizer for one In-Tray object.
2. Add a validator for imported backup data.
3. Regenerate duplicate or missing IDs.
4. Preserve notes exactly as typed.
5. Preserve known acronyms in names.
6. Add storage wrapper support while reading current raw-array data.
7. Write migrated data back only after successful validation.
8. Improve undo to store action metadata.
9. Re-run export/import and undo checklist items.

## Rules

- Never silently discard user data during import.
- Confirm before replacing current data.
- Keep backward compatibility with existing LocalStorage data.
