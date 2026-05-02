# Known Limitations

## Local-only storage

The app stores data in browser LocalStorage only. Data does not sync across devices or browsers.

## Browser data risk

Clearing site data, changing browsers, using private browsing, or some mobile storage cleanup behaviors may delete saved In-Trays.

Use Export Backup regularly if the data matters.

## Single-user app

There is no account system, login, sharing, or multi-user support.

## Import validation

Import handling needs stronger validation before it should be considered hardened. See `IMPLEMENTATION_BACKLOG.md`.

## Undo behavior

Undo is currently limited and should not be treated as a full history system.

## Date math

Business-day, month, and year calculations need refinement. Current behavior is acceptable for simple tracking but should be improved before relying on exact calendar precision.

## Accessibility

Keyboard and screen-reader support needs deeper work. See `IMPLEMENTATION_BACKLOG.md`.

## Architecture

The main app is still largely contained in `index.html`. Future work should split structure, styles, and JavaScript into separate files before deeper refactoring.

## iPhone background constraint

The fixed background layer in `mobile-bg-fix.css` is intentional. Do not remove it without testing on iPhone Safari.
