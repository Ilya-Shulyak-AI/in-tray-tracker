# Import Validation Plan

## Goal

Make backup imports safer and more predictable.

## Current risk areas

- Import validation is limited.
- Bad fields may be normalized too loosely.
- Duplicate IDs may not be handled safely.
- Import replaces the active list.

## Step-by-step plan

1. Parse JSON inside a try/catch.
2. Confirm the parsed data is either an array or a supported backup object.
3. Validate every imported item before replacing current data.
4. Enforce max item count.
5. Enforce max name length.
6. Enforce max notes length.
7. Require or regenerate safe IDs.
8. Detect duplicate IDs and regenerate duplicates.
9. Validate cadence number as a finite number greater than or equal to 1.
10. Validate cadence unit against the supported unit list.
11. Validate date fields as ISO dates or null.
12. Show a clear error if validation fails.
13. Confirm before replacing current data.
14. Set undo state before replacing current data.
15. Run import/export checklist tests.

## Supported cadence units

- `days`
- `business-days`
- `weeks`
- `months`
- `years`

## Rules

- Do not silently discard imported items.
- Do not import malformed data.
- Do not replace current data until the full import passes validation.
