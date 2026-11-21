// hashem.faith brand config for OneMail (@aribradshaw/onemail, vendored in
// vendor/), the shared email layout the contact alert uses. Brand data stays
// here, in this repo; the OneMail repo holds only the engine.
//
// Colors are the site's (src/index.css): --accent-blue buttons and links,
// --bg-off page, --text-primary text. The logo is the site icon
// (public/Star_of_David.svg) as a 128x128 transparent PNG shown at 64x64:
// public/email/hashem-faith-logo@2x.png, copied into dist/ by the Vite build
// and served by express.static. The footer is what the site shows: the
// copyright holder and the educational-purposes line. The site shows no
// postal address, so the footer has none either (this alert goes only to the
// site owner and is transactional).

export const SITE_ORIGIN = 'https://antisemitism.hashem.faith'
export const LOGO_PATH = '/email/hashem-faith-logo@2x.png'

export const hashemFaithBrand = Object.freeze({
  name: 'hashem.faith',
  logoUrl: `${SITE_ORIGIN}${LOGO_PATH}`,
  logoWidth: 64,
  logoHeight: 64,
  fontFamily: 'Arial, Helvetica, sans-serif',
  colors: {
    primary: '#2563eb',
    link: '#2563eb',
    text: '#2c2c2c',
    muted: '#5a5a5a',
    background: '#f5f5f4',
    surface: '#ffffff',
    border: '#e5e5e3',
    buttonText: '#ffffff',
    dark: { primary: '#3b82f6', link: '#93c5fd', text: '#f0f0ee', muted: '#b5b5b2', background: '#161616', surface: '#222222', border: '#3a3a38', buttonText: '#ffffff' },
  },
  from: { name: 'hashem.faith', email: 'no-reply@hashem.faith' },
  footer: {
    legalName: 'Ari Daniel Bradshaw',
    address: ['hashem.faith'],
    website: SITE_ORIGIN,
    note: 'This site is for educational purposes.',
  },
})
