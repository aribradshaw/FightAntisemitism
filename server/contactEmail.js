// The contact-form alert to the site owner, rendered with OneMail and the
// hashem.faith brand in emailBrand.js. The plain-text part and the subject are
// the same as before.
import { render, formatFrom } from '@aribradshaw/onemail'
import { hashemFaithBrand, SITE_ORIGIN } from './emailBrand.js'

const oneLine = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

/** Default From when EMAIL_FROM is unset: "hashem.faith" <no-reply@hashem.faith> (quoted because of the dot). */
export const DEFAULT_EMAIL_FROM = formatFrom(hashemFaithBrand)

/** { subject, html, text } for a submitted question. Typed values stay text. */
export function contactAlertEmail({ fullName, email, category, question }) {
  const subject = oneLine(`[Site contact] ${category}: ${String(fullName ?? '').slice(0, 50)}`)
  const rendered = render({
    brand: hashemFaithBrand,
    subject,
    preheader: oneLine(`${category}: ${question}`).slice(0, 140),
    blocks: [
      { type: 'heading', text: 'New question from the site' },
      {
        type: 'keyValue',
        rows: [
          { label: 'Name', value: oneLine(fullName), bold: true },
          { label: 'Email', value: oneLine(email) },
          { label: 'Category', value: oneLine(category) },
        ],
      },
      { type: 'heading', level: 2, text: 'Question' },
      { type: 'paragraph', text: String(question ?? '') },
      { type: 'button', text: 'Open admin', href: `${SITE_ORIGIN}/admin` },
      { type: 'small', text: `Reply to this email to answer ${oneLine(fullName)} directly.` },
    ],
  })
  return {
    subject: rendered.subject,
    html: rendered.html,
    text: `Name: ${fullName}\nEmail: ${email}\nCategory: ${category}\n\nQuestion:\n${question}`,
  }
}
