# Contact form email (HostGator / no-reply@hashem.faith)

Emails are sent **from** `no-reply@hashem.faith` **to** `aribradshawaz@gmail.com`. Submissions are also saved in the `contact_entries` table.

## 1. Create the email in cPanel

1. Log in to **cPanel** (HostGator).
2. Go to **Email Accounts** → **Create**.
3. Create **no-reply@hashem.faith** (or `no-reply` @ your hashem.faith domain).
4. Set a **password** and save it—you’ll use it as `EMAIL_PASS`.

You don’t need to check this inbox; mail is only sent *from* it to your Gmail.

## 2. Set environment variables

Use these in `.env` locally and in **Railway** (or your host):

| Variable | Value |
|----------|--------|
| `EMAIL_FROM` | `no-reply@hashem.faith` |
| `CONTACT_EMAIL_TO` | `aribradshawaz@gmail.com` |
| `SMTP_HOST` | `mail.hashem.faith` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `EMAIL_USER` | `no-reply@hashem.faith` |
| `EMAIL_PASS` | The password you set in cPanel for this account |

If your HostGator server uses a different host (e.g. `gator4xxx.hostgator.com`), use that for `SMTP_HOST` instead of `mail.hashem.faith`. Port **587** is recommended (TLS); if you use **465**, set `SMTP_SECURE=true` and `SMTP_PORT=465`.

## 3. Test

Submit the contact form on the site. You should:

- Receive an email at aribradshawaz@gmail.com **from** no-reply@hashem.faith.
- See a new row in `contact_entries` in the database.

If sending fails, check Railway (or server) logs for the nodemailer error and confirm the cPanel email password and SMTP host/port.
