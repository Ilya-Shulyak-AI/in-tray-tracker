# Contribution Guardrails

## Patch size

Make one small patch at a time. Avoid bundling unrelated changes.

## Testing

Run `TEST_CHECKLIST.md` after changes that affect structure, style, data, gestures, or behavior.

## iPhone background

The fixed background layer in `mobile-bg-fix.css` is intentional. Preserve it unless a replacement has been tested on iPhone Safari.

## Large file edits

Do not rewrite `index.html` from partial or truncated content.

## Data safety

Before testing import, export, or storage changes, create a JSON backup from the app.

## Priority

Prefer stability and readability over visual complexity or animation.
