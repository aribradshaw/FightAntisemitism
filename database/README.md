# Database setup

MySQL database for timeline, definitions, agitators, and misconceptions.

## 1. Create tables

Copy `.env.example` to `.env` and set `DB_PASSWORD`. Then run the schema (from project root):

```bash
npm install
npm run db:schema
```

Alternatively, with the MySQL CLI:  
`mysql -h 192.232.249.125 -u redsaber_antisemitism -p redsaber_antisemitism < database/schema.sql`

If you already have the tables and only need to add Hashem.Faith further-reading support, run  
`database/migrate-add-further-reading.sql` (adds `further_reading` JSON to `definitions` and `misconception_topics`).

## 2. Seed data

With `.env` already set:

```bash
npm run db:seed
```

The seed script truncates existing rows then inserts timeline events (from the Jews/Israel wikis), definitions, agitators with sources, and misconceptions with topic content. You can re-run `npm run db:seed` to reset and re-seed.

## Tables

| Table | Purpose |
|-------|--------|
| `timeline_events` | Year, label, region, description for the timeline page |
| `definitions` | Jew, Talmud, Genocide, Antisemitism, Zionism (with `further_reading` JSON for Hashem.Faith links) |
| `agitators` | Public figures who have promoted antisemitic ideas |
| `agitator_sources` | Quotes/dates/URLs per agitator |
| `misconceptions` | Hub entries (Israel, Talmud, Jewish race, Conspiracy) |
| `misconception_topics` | Body content per misconception topic (with `further_reading` JSON for Hashem.Faith links) |
