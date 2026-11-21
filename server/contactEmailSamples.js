// Synthetic samples for the contact alert snapshots (contactEmail.test.js) and
// the preview page (scripts/email-preview.js). No real submissions.
import { contactAlertEmail } from './contactEmail.js'

export const contactEmailSamples = [
  {
    id: 'contact-alert',
    label: 'Contact question alert',
    render: () => contactAlertEmail({ fullName: 'Pat Example', email: 'pat@example.test', category: 'history', question: 'Where can I read more about the Second Temple period?\n\nThanks for the site.' }),
  },
  {
    id: 'contact-alert-other',
    label: 'Contact question alert (default category)',
    render: () => contactAlertEmail({ fullName: 'pat@example.test', email: 'pat@example.test', category: 'other', question: 'Short question.' }),
  },
]
