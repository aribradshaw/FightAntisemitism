<p align="center">
  <img src="public/Star_of_David.svg" alt="Star of David" width="72" />
</p>

<h1 align="center">Fight Antisemitism</h1>

<p align="center">
  An interactive educational resource about Jewish history, identity, Israel, and modern antisemitism.
</p>

<p align="center">
  <a href="https://antisemitism.hashem.faith"><strong>Visit the live site</strong></a>
  &nbsp;|&nbsp;
  <a href="https://antisemitism.hashem.faith/explore">Explore the topics</a>
</p>

<p align="center">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
  <img alt="Vite 7" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img alt="Express 4" src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" />
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white" />
</p>

## About the project

Fight Antisemitism, presented publicly as **About Jews**, is a source-oriented learning platform built to make a difficult and often distorted subject easier to explore. It combines historical context, clear definitions, interactive experiences, and links to supporting material in one accessible application.

The project is designed for readers who want to understand Jewish history and identity, examine common misconceptions, and recognize how antisemitic narratives develop and spread.

## What you can explore

- **Interactive timeline:** Browse historical events through a synchronized timeline, map, and date controls.
- **Definitions:** Learn the meaning and context of terms frequently used in discussions about Jews, Judaism, Israel, Zionism, and antisemitism.
- **Misconceptions:** Review common claims and follow the supporting context and source links.
- **Conspiracy theories:** Examine recurring antisemitic narratives, their framing, and their historical patterns.
- **Public rhetoric:** Read source-linked profiles and examples of rhetoric that contributes to antisemitism.
- **Talmud references:** Explore responses to frequently circulated claims about Jewish texts.
- **Guided presentations:** Move through visual, structured lessons on Jewish history.
- **Reader accounts:** Track reading progress, manage a profile, and submit questions to the project.

## Technology

The application uses a React and Vite frontend with an Express API. MySQL stores editorial content, accounts, reading progress, questions, and page-view data. In production, Express serves both the compiled frontend and the API from a single service.

```text
Browser
  |-- React 19 + React Router + Vite
  |-- Leaflet maps and interactive learning components
  |
Express API
  |-- Content, authentication, progress, and contact endpoints
  |
MySQL
  |-- Source-backed content and application data
```

## Run locally

### Prerequisites

- Node.js 20.19 or newer
- npm
- A MySQL database

### Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/aribradshaw/FightAntisemitism.git
   cd FightAntisemitism
   npm install
   ```

2. Copy `.env.example` to `.env`, then add your MySQL credentials:

   ```dotenv
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   ```

3. Create and seed the database:

   ```bash
   npm run db:schema
   npm run db:seed
   ```

4. Start the frontend and API together:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173). The API runs on port `3001` by default and Vite proxies `/api` requests to it.

Contact-form email and reCAPTCHA configuration are optional for basic local development. See [reCAPTCHA setup](docs/RECAPTCHA_SETUP.md) and [contact email setup](docs/CONTACT_EMAIL_HOSTGATOR.md) when working on those features.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the Vite frontend and Express API |
| `npm run build` | Create a production frontend build in `dist/` |
| `npm start` | Start the Express server |
| `npm run lint` | Run ESLint across the project |
| `npm run db:schema` | Create the database schema |
| `npm run db:seed` | Seed all editorial content |
| `npm run db:seed:<section>` | Seed one content section, such as `timeline` or `definitions` |

## Project structure

```text
database/   Schema, migrations, source data, and seed scripts
docs/       Configuration guides for integrated services
public/     Static images, maps, and geographic data
server/     Express API, authentication, and production server
src/        React pages, components, contexts, and client data
```

Most database-backed editorial content lives in `database/data/`. After editing a content file, run the matching seed command to update the database. Some interface-specific data also lives in `src/data/`.

## Deployment

The production application is deployed as a Node.js service and is available at [antisemitism.hashem.faith](https://antisemitism.hashem.faith). Railway configuration is included in `railway.toml`, with `/api/healthz` used as the service health check.

See [DEPLOY.md](DEPLOY.md) for required environment variables, Railway setup, production checks, and database connectivity troubleshooting.

## Contributing responsibly

This repository addresses sensitive historical, religious, and political subjects. Contributions should be precise, respectful, and supported by credible sources. When proposing content changes:

- Preserve the context of quotations and historical claims.
- Prefer primary sources and reputable scholarship where available.
- Include clear source labels and working URLs.
- Separate factual corrections from commentary or interpretation.
- Test relevant routes and database seeds before submitting changes.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the review and development workflow.

## Educational purpose

This project is provided for educational purposes. External sources are linked so readers can review supporting material and reach their own informed conclusions.

Copyright © 2026 Ari Daniel Bradshaw. All rights reserved.
