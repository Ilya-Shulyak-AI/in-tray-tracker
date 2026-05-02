# Local Development Setup

## Goal

Make it easier to safely inspect and refactor the full app outside connector output limits.

## Recommended setup

1. Clone the repository locally.
2. Open the folder in a code editor.
3. Create a backup branch before large refactors.
4. Open `index.html` directly in a browser for simple testing.
5. For a local server, use any basic static server.

## Example static server options

Python:

```bash
python3 -m http.server 8000
```

Node:

```bash
npx serve .
```

Then open:

```text
http://localhost:8000
```

## Safe refactor workflow

1. Export a JSON backup from the app.
2. Create a branch.
3. Split one file at a time.
4. Test after each change.
5. Commit after each verified step.

## First local refactor target

Extract inline CSS from `index.html` into `styles.css`, then load files in this order:

1. `styles.css`
2. `mobile-bg-fix.css`

After that, extract inline JavaScript into `app.js`.

## Required checks

Run:

- `TEST_CHECKLIST.md`
- `BROWSER_TEST_MATRIX.md`
- `QA_SCENARIOS.md`

Also test on iPhone Safari before treating the refactor as stable.
