# Deploying AntisemitismFight

The app is a Node.js server (Express + MySQL) that serves the API and, in production, the built React frontend. Set `NODE_ENV=production` and provide your MySQL credentials.

## Railway (recommended)

1. **Create a project** at [railway.app](https://railway.app) and connect your GitHub repo.
2. **Variables** (Settings → Variables): add
   - `NODE_ENV` = `production`
   - `DB_HOST` = your MySQL host (e.g. from HostGator)
   - `DB_USER` = your DB user
   - `DB_PASSWORD` = your DB password
   - `DB_NAME` = your DB name  
   Railway sets `PORT` automatically.
3. **Build & start**: in the service settings set
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
4. Deploy. Railway will build the frontend and run the server; the same process serves both the API and the site.

You can keep using your existing MySQL (e.g. on HostGator) by setting `DB_HOST` to that server and opening remote MySQL access if needed.

---

## HostGator

**Shared hosting** usually does **not** support running a Node.js server. You have two options:

- **Use Railway** (or another Node host) for the app and keep HostGator only for the MySQL database (set `DB_HOST` to your HostGator MySQL host and allow remote connections in cPanel).
- **HostGator VPS**: if you have a VPS with Node.js:
  1. Clone the repo, run `npm install && npm run build`.
  2. Set env vars: `NODE_ENV=production`, `PORT=3001`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
  3. Run with a process manager, e.g. `pm2 start server/index.js --name antisemitismfight`.
  4. Point your web server (nginx/Apache) at the app (reverse proxy to the Node port).

---

## Local production check

```bash
npm run build
NODE_ENV=production node server/index.js
```

Then open `http://localhost:3001` (or the port you set). The API and the site are served from the same origin.
