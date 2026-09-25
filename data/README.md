# Data

- `source/` contains the authoritative workbook used by the catalogue generator.
- Generated PostgreSQL schema and seed SQL live in `src/db/`; do not hand-edit the
  generated seed. Regenerate it with `npm run db:generate-sql` after changing the
  workbook.

The workbook is excluded from the Docker build context because the production image
uses the checked-in generated SQL and does not read the source spreadsheet.
