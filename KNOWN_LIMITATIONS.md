# Known Limitations

## Local-only storage

The app stores data in browser LocalStorage only. Data does not sync across devices or browsers.

## Browser data risk

Clearing site data, changing browsers, using private browsing, or some mobile storage cleanup behaviors may delete saved In-Trays.

Use Export Backup regularly if the data matters.

## Single-user app

There is no account system, login, sharing, or multi-user support.

## Import validation

Import handling now normalizes in-tray shape, cadence fields, dates, tags, and duplicate IDs. It still does not enforce a formal JSON schema document.

## Undo behavior

Undo is currently limited and should not be treated as a full history system.

## Date math

Business-day, month, and year calculations need refinement. Current behavior is acceptable for simple tracking but should be improved before relying on exact calendar precision.

## Accessibility

Cards are keyboard-expandable and core controls have labels, but full screen-reader QA and deeper interaction review are still pending. See `IMPLEMENTATION_BACKLOG.md`.

## Architecture

Runtime code is split across markup, CSS, and JavaScript files. Future work should continue reducing duplication and adding automated browser coverage.

## iPhone background constraint

The fixed background layer in `mobile-bg-fix.css` is intentional. Do not remove it without testing on iPhone Safari.
