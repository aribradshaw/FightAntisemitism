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

### 13+ age screen on sign-up

Reader sign-up starts with a neutral date-of-birth step (`server/ageGate.js`). The server works out the age, keeps only a signed result cookie (30 minutes if accepted, 24 hours if refused, so the same browser can't retry with another date), and `/api/auth/register` refuses to create an account without an accepted result. Birth dates are never stored.

Before or with the deploy that ships it, run the additive migration once against the production database:

```bash
npm run db:migrate:age-verified
```

It adds `users.age_verified_at` (set when a new account passed the screen; existing accounts stay empty). Sign-up keeps working if the migration hasn't run yet, but the server logs a warning and the time isn't recorded. Set `SESSION_SECRET` in Variables: it signs the age cookie as well as sessions.

### Database not loading (500 on /api/*, blank pages)

If the app deploys but API calls return **500** and pages are blank, the server cannot reach MySQL.

1. **Railway Variables**  
   In the service → **Variables**, set exactly:  
   `NODE_ENV`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.  
   No typos; values must match your MySQL server.

2. **Allow remote MySQL**  
   Your MySQL host (e.g. HostGator cPanel) must allow connections **from Railway**:
   - In cPanel open **Remote MySQL®** (or “Remote MySQL Access”).
   - Add a **Host** so the app can connect. Railway’s IP is not fixed; use `%` to allow any host (or check Railway docs for a static egress IP).
   - Ensure the **DB_USER** you use is allowed to connect from that host (same user you use in phpMyAdmin locally is often restricted to `localhost`; you may need a separate user for “remote” or `%`).

3. **Check deploy logs**  
   In Railway → your service → **Deployments** → open the latest deploy → **View logs**.  
   When a 500 occurs you should see the DB error (e.g. `ECONNREFUSED`, `ER_ACCESS_DENIED_ERROR`). That tells you whether it’s “host not allowed” or “wrong password”.

4. **Firewall**  
   If your DB host has a firewall, allow outbound MySQL (port 3306) or allow traffic from Railway’s region.

### WebSocket to localhost:8081 (console warning)

If the browser console shows `WebSocket connection to 'ws://localhost:8081/' failed` and a `refresh.js` script, that script is **not** from our app. The production build (`npm run build`) does not include it; it is injected by the **host** (e.g. Cloudflare Pages live-reload for preview) or a **browser extension**. It does not affect production data or reCAPTCHA.

- Confirm **Build** is `npm install && npm run build` and **Start** is `npm start` (not `npm run dev`).
- If using Cloudflare (or similar), turn off any “Development” or “Live reload” option for the production deployment.
- To confirm it’s external: test in an incognito/private window with extensions disabled; the message may disappear.

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
