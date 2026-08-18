# Contributing to Fight Antisemitism

Thank you for helping improve this educational resource. Contributions are welcome when they make the application clearer, more accessible, more reliable, or better supported by evidence.

## Before you start

- Read the project overview and setup instructions in [README.md](README.md).
- For content changes, identify the relevant source data in `database/data/` and the matching seed command.
- For application changes, confirm whether the work affects the React client, the Express API, the MySQL schema, or more than one layer.

## Development workflow

1. Create a focused branch from `master`.
2. Install dependencies and configure a local `.env` file. Never commit credentials or production data.
3. Make the smallest coherent change that addresses the issue.
4. Run the checks relevant to your change:

   ```bash
   npm run lint
   npm run build
   ```

   If database-backed content changed, also run the relevant schema or seed command against a development database.

5. Open a pull request with a clear summary, verification notes, and source links for editorial changes.

## Content and sourcing standards

Because this project covers sensitive historical, religious, and political subjects:

- Preserve the context of quotations, statistics, and historical claims.
- Prefer primary sources and reputable scholarship where available.
- Include a clear source label and a working URL for new claims.
- Distinguish documented fact, interpretation, and allegation.
- Avoid language that dehumanizes people or treats a conspiracy claim as established fact.
- Keep educational explanations readable without removing important nuance.

## Pull request checklist

- [ ] The change is limited to the stated purpose.
- [ ] No secrets, private credentials, or production records are included.
- [ ] Relevant routes, interactions, or seed scripts were tested.
- [ ] `npm run lint` and `npm run build` pass, or any limitation is explained.
- [ ] New or changed factual content includes supporting sources.
- [ ] The README or deployment documentation is updated when behavior or setup changes.

## Questions and corrections

For a factual correction, include the specific page, claim, and supporting source. For a bug report, include the route, steps to reproduce, expected behavior, actual behavior, and relevant browser or server errors.
