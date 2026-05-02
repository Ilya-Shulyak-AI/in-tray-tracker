# Text Normalization Plan

## Goal

Preserve user-entered text while still keeping In-Tray names clean and readable.

## Current risk areas

- Names are automatically title-cased.
- Notes are automatically title-cased.
- Acronyms such as IT, PDF, LLC, IRS, CRM, URL, and HR may be changed incorrectly.
- User-entered note capitalization may be lost.

## Target behavior

- Preserve notes exactly as typed.
- Trim leading and trailing whitespace.
- Collapse excessive whitespace in names if needed.
- Preserve common acronyms in names.
- Avoid changing punctuation unexpectedly.

## Suggested acronym allowlist

- IT
- PDF
- LLC
- IRS
- CRM
- URL
- HR
- API
- JSON
- UI
- UX

## Step-by-step plan

1. Stop calling title-case logic on notes.
2. Replace generic title-case logic with a safer name formatter.
3. Add an acronym allowlist.
4. Preserve words that are already fully uppercase and short.
5. Add manual test cases for acronyms.
6. Confirm search still works for names and notes.
7. Confirm import normalization uses the same safe formatter.

## Rules

- Do not alter notes except trimming if clearly intended.
- Do not lowercase known acronyms.
- Do not mutate imported data until validation passes.
