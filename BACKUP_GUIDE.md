# Backup Guide

The app stores In-Trays in browser LocalStorage. Export a JSON backup before making changes that affect storage, import, export, or migrations.

## When to export

Export a backup before:

- testing import changes
- changing LocalStorage keys
- changing the data shape
- clearing browser data
- testing on a new browser or device
- reverting commits after app data has changed

## How to export

1. Open the app.
2. Select `Export Backup`.
3. Save the JSON file somewhere safe.
4. Keep the newest backup after every major data change.

## How to import

1. Open the app.
2. Select `Import Backup`.
3. Choose the JSON backup file.
4. Confirm the import only if the file is trusted.

## Caution

Import currently replaces the active list. It should be treated as a destructive action until stronger import validation and safer restore behavior are implemented.

## Recommended habit

Keep at least one recent JSON backup outside the browser if the app data matters.
