# Rollback Guide

Use this guide if a patch causes the app to break or behave incorrectly.

## Before rollback

If the app still opens and the current data matters, export a JSON backup first.

## Basic rollback approach

1. Identify the last commit that changed the broken file.
2. Revert that commit.
3. Test the app using `TEST_CHECKLIST.md`.
4. If the issue remains, inspect the previous commit in the same file.

## Stabilization checkpoints

Known useful checkpoints:

- Full app restored and stylesheet placement fixed: `2a314a37560ccfe70c1100c74896edbd633c69c9`
- Header simplified: `2a3f0c75b36e507638f47f92d3ad8a4f752e6657`
- `index.html` formatted: `d58ac738d8f832f9f3099cc2fc511b14c1e08154`
- Stabilization summary added: `629f9b6c768f3d9118f42a6e5d45b1b55b2d68c1`

## Do not do this

Do not restore `index.html` from partial or truncated content.

## After rollback

Run:

- `TEST_CHECKLIST.md`
- `BROWSER_TEST_MATRIX.md`

Then update `CHANGELOG.md` if the rollback is kept.
