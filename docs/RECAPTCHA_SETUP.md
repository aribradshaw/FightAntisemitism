# reCAPTCHA setup (contact form)

This app uses **reCAPTCHA v3** (invisible; no checkbox). The contact form gets a token when the user submits and the server verifies it with Google and checks the score.

## Keys

- **Site key** → `VITE_RECAPTCHA_SITE_KEY` (frontend; used at build time).
- **Secret key** → `RECAPTCHA_SECRET_KEY` (backend only; never in the client).

In [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin), create or use a **reCAPTCHA v3** key and add your domains (e.g. `antisemitism.hashem.faith`, `localhost` for dev). Set both keys in `.env` and in Railway (or your host).

## Console messages you may see

- **`POST ... recaptcha/api2/pat 401 (Unauthorized)`** — Google’s reCAPTCHA script sometimes does a first request that returns 401 as part of the Private Access Token (PAT) flow; it then retries with a token. This does not necessarily mean reCAPTCHA is broken; the form can still get a valid token. If the form stays on “Sending…” we fall back with a timeout and an error message.
- **`Unrecognized feature: 'private-token'`** — Comes from reCAPTCHA’s script when the browser doesn’t fully support the Private State Token API. We set a Permissions-Policy in `index.html` for Google/recaptcha origins to allow it where supported; the warning may still appear in some browsers and is harmless.
- **`GET ... cloudflareinsights.com/beacon.min.js net::ERR_BLOCKED_BY_CLIENT`** — Usually an ad blocker blocking Cloudflare’s beacon; not related to reCAPTCHA.
- **`WebSocket connection to 'ws://localhost:8081/' failed`** — From Vite’s dev client (HMR). It should not appear on a production build. If you see it on the live site, try a hard refresh or confirm the deployed site is built with `npm run build` and not serving the dev bundle.
