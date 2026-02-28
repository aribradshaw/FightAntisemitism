# reCAPTCHA setup (contact form)

This app uses **reCAPTCHA v3** (invisible; no checkbox). The contact form gets a token when the user submits and the server verifies it with Google and checks the score.

## Keys

- **Site key** → `VITE_RECAPTCHA_SITE_KEY` (frontend; used at build time).
- **Secret key** → `RECAPTCHA_SECRET_KEY` (backend only; never in the client).

In [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin), create or use a **reCAPTCHA v3** key and add your domains (e.g. `antisemitism.hashem.faith`, `localhost` for dev). Set both keys in `.env` and in Railway (or your host).
