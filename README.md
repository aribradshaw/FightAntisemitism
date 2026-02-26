# About Jews

**Who Are They And Why Is Everyone Talking About Them?**

A React website to teach about the history of Jews, Israel, and antisemitism.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

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
- **Agitators** (`/agitators`) — List by photo/name/subtitle; click for description and source timeline (e.g. Tucker Carlson, Thomas Massie, David Duke, Nick Fuentes, Ilhan Omar).
- **Misconceptions** (`/misconceptions`) — Sub-modules: Israel, the Talmud, the Jewish race, Conspiracy.

## Customization

- **Colors**: Edit CSS variables in `src/index.css` (white/off-white/gray, blue and gold accents).
- **Content**: Edit `src/data/definitions.js`, `src/data/agitators.js`, and the content objects in `DefinitionDetail.jsx`, `MisconceptionTopic.jsx`.
- **Agitator images**: Add images under `public/agitators/` and set `image: '/agitators/name.jpg'` in `src/data/agitators.js`.
