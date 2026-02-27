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

This seeds all tables. To seed only specific tables (faster when you only change one area):

```bash
npm run db:seed:definitions   # definitions only
npm run db:seed:timeline      # timeline_events only
npm run db:seed:agitators     # agitators + agitator_sources
npm run db:seed:conspiracies  # conspiracies + conspiracy_sources
npm run db:seed:talmud        # talmud_entries + talmud_sources
npm run db:seed:misconceptions # misconceptions + topics + entries + entry_sources
```

Or: `node database/seed.js <table>` (e.g. `node database/seed.js definitions`).

Seed data lives in `database/data/*.js` (timeline, definitions, agitators, conspiracies, talmud, misconceptions). Edit those files to change content; each table’s seed is in `database/seeds/seed-<table>.js`.

## Tables

| Table | Purpose |
|-------|--------|
| `timeline_events` | Year, label, region, description for the timeline page |
| `definitions` | Jew, Talmud, Genocide, Antisemitism, Zionism (with `further_reading` JSON for Hashem.Faith links) |
| `agitators` | Public figures who have promoted antisemitic ideas |
| `agitator_sources` | Quotes/dates/URLs per agitator |
| `misconceptions` | Hub entries (Israel, Talmud, Jewish race, Conspiracy) |
| `misconception_topics` | Body content per misconception topic (with `further_reading` JSON for Hashem.Faith links) |
