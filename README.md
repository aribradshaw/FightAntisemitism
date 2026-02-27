# About Jews

**Who Are They And Why Is Everyone Talking About Them?**

A React website to teach about the history of Jews, Israel, and antisemitism.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app expects a MySQL database; see `.env.example` or `.env` for connection details.

## Build

```bash
npm run build
```

Output is in `dist/`.

## Structure

- **Landing** (`/`) — Enter button leads to Explore.
- **Explore** (`/explore`) — Hub with four modules: Timeline, Definitions, Agitators, Misconceptions.
- **Timeline** (`/timeline`) — Map (left), content (right), draggable year slider and date input.
- **Definitions** (`/definitions`) — List of terms; click for detail. **Genocide** has an interactive: definition + quiz comparing Gaza war vs. Holocaust/Inquisition.
- **Agitators** (`/agitators`) — List by photo/name/subtitle; click for description, sources, and timeline (e.g. Tucker Carlson, Thomas Massie, David Duke, Nick Fuentes, Ilhan Omar). Tucker’s page includes a link to **36 Falsehoods** from the Huckabee interview.
- **Misconceptions** (`/misconceptions`) — Four topics with icons: **Israel**, **The Talmud**, **The Jewish Race**, **Conspiracy Theories**. Israel and Jewish Race load entry lists from the API; each entry has a detail page with sources and internal links to Conspiracies and Definitions where relevant. Terminology uses **Judea and Samaria** (not “West Bank”).
- **Conspiracies** (`/conspiracies`) — Masonry list of conspiracy myths; click for full article and sources. Linked from misconception entries (e.g. Khazar myth, Israel did 9/11, Israel controls America, AIPAC).

## Database & seeding

Content for definitions, agitators, timeline, conspiracies, and misconceptions is stored in `database/data/` and seeded into MySQL:

```bash
npm run db:seed              # all
npm run db:seed:definitions
npm run db:seed:agitators
npm run db:seed:timeline
npm run db:seed:conspiracies
npm run db:seed:misconceptions
```

## Customization

- **Colors**: Edit CSS variables in `src/index.css` (white/off-white/gray, blue and gold accents).
- **Content**: Definitions, agitators, timeline, conspiracies, and misconception entries live in `database/data/*.js`. Some frontend copies exist in `src/data/` (e.g. agitators list for the hub). After editing data, re-run the relevant seed(s).
- **Agitator images**: Add images under `public/agitators/` and set `image_url` in `database/data/agitators.js` (and `src/data/agitators.js` if used on the client).
