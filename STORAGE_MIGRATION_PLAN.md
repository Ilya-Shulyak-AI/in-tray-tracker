# Storage Migration Plan

## Goal

Move from raw LocalStorage arrays toward a versioned data shape without breaking existing users.

## Existing keys

- `in-tray-tracker-v1`
- `in-tray-last-undo`

## Current likely shape

The main app data is currently stored as a raw array of In-Tray objects.

## Target shape

```json
{
  "version": 2,
  "intrays": [],
  "updatedAt": "ISO_DATE"
}
```

## Migration steps

1. Read the existing LocalStorage value.
2. If it is a raw array, treat it as version 1 data.
3. Normalize and validate each In-Tray.
4. Wrap the normalized list in the version 2 object.
5. Save the version 2 object only after successful validation.
6. Keep read compatibility for raw arrays during the transition.
7. Export backups using the new wrapper shape.
8. Import should accept both the old raw array and the new wrapper.

## Safety rules

- Do not delete old data before the new data is successfully written.
- Do not silently drop invalid items.
- Show clear errors for invalid imports.
- Export a JSON backup before testing migration code.

## Manual tests

- Existing raw-array data loads.
- New wrapper data loads.
- Export produces versioned backup data.
- Import accepts old backups.
- Import accepts new backups.
- Invalid backup data is rejected.
