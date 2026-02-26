/**
 * Further reading from Hashem.Faith (https://hashem.faith).
 * Post sitemap: https://hashem.faith/post-sitemap.xml
 */

const BASE = 'https://hashem.faith'

const POSTS = {
  'what-is-the-talmud': { label: 'What is the Talmud?', path: '/what-is-the-talmud/' },
  'is-the-talmud-more-holy-than-the-bible': { label: 'Is the Talmud more holy than the Bible?', path: '/is-the-talmud-more-holy-than-the-bible/' },
  'is-judaism-a-religion-or-race': { label: 'Is Judaism a religion or race?', path: '/is-judaism-a-religion-or-race/' },
  'are-jews-commanded-to-lie-about-the-talmud': { label: 'Are Jews commanded to lie about the Talmud?', path: '/are-jews-commanded-to-lie-about-the-talmud/' },
  'where-do-gentiles-fit-into-the-jewish-world-view': { label: 'Where do gentiles fit into the Jewish world view?', path: '/where-do-gentiles-fit-into-the-jewish-world-view/' },
  'christianity-in-the-talmud': { label: 'Christianity in the Talmud', path: '/christianity-in-the-talmud/' },
  'gentiles-are-human': { label: 'Gentiles are human', path: '/gentiles-are-human/' },
  'gentiles-are-not-animals': { label: 'Gentiles are not animals', path: '/gentiles-are-not-animals/' },
  'the-jesus-narrative-in-the-talmud': { label: 'The Jesus narrative in the Talmud', path: '/the-jesus-narrative-in-the-talmud/' },
  'is-jewish-a-language': { label: 'Is Jewish a language?', path: '/is-jewish-a-language/' },
  'jesus-in-the-talmud': { label: 'Jesus in the Talmud', path: '/jesus-in-the-talmud/' },
  'what-does-israel-mean': { label: 'What does Israel mean?', path: '/what-does-israel-mean/' },
  'should-aipac-be-registered-under-fara': { label: 'Should AIPAC be registered under FARA?', path: '/should-aipac-be-registered-under-fara/' },
  'does-aipac-fall-under-22-usc-611': { label: 'Does AIPAC fall under 22 USC 611?', path: '/does-aipac-fall-under-22-usc-611/' },
  'did-the-jews-kill-jesus': { label: 'Did the Jews kill Jesus?', path: '/did-the-jews-kill-jesus/' },
}

function url(path) {
  return `${BASE}${path}`
}

/** Further reading for definition slugs */
export const DEFINITION_SOURCES = {
  jew: [
    POSTS['is-judaism-a-religion-or-race'],
    POSTS['is-jewish-a-language'],
  ].map((p) => ({ label: p.label, url: url(p.path) })),
  talmud: [
    POSTS['what-is-the-talmud'],
    POSTS['is-the-talmud-more-holy-than-the-bible'],
    POSTS['are-jews-commanded-to-lie-about-the-talmud'],
    POSTS['christianity-in-the-talmud'],
    POSTS['gentiles-are-human'],
    POSTS['gentiles-are-not-animals'],
    POSTS['the-jesus-narrative-in-the-talmud'],
    POSTS['jesus-in-the-talmud'],
  ].map((p) => ({ label: p.label, url: url(p.path) })),
  genocide: [],
  antisemitism: [
    POSTS['should-aipac-be-registered-under-fara'],
    POSTS['does-aipac-fall-under-22-usc-611'],
  ].map((p) => ({ label: p.label, url: url(p.path) })),
  zionism: [
    POSTS['what-does-israel-mean'],
  ].map((p) => ({ label: p.label, url: url(p.path) })),
  agitprop: [
    { label: 'Anti-Israel Agitprop in The Australian', url: 'https://honestreporting.com/anti-israel-agitprop-in-the-australian/' },
    { label: "DIRCO's Descent into Palestinian Agitprop (Politicsweb)", url: 'https://www.politicsweb.co.za/opinion/dircos-descent-into-palestinian-agitprop' },
    { label: 'Holocaust Agitprop in Berlin (Tablet)', url: 'https://www.tabletmag.com/sections/news/articles/holocaust-agitprop-in-berlin' },
    { label: 'From Soviet Agitprop to Potemkin Scholarship (Times of Israel)', url: 'https://blogs.timesofisrael.com/from-soviet-agitprop-to-potemkin-scholarship-the-long-life-of-a-genocide-smear/' },
  ],
  goy: [
    POSTS['where-do-gentiles-fit-into-the-jewish-world-view'],
    POSTS['gentiles-are-human'],
    POSTS['gentiles-are-not-animals'],
  ].map((p) => ({ label: p.label, url: url(p.path) })),
  israel: [
    POSTS['what-does-israel-mean'],
  ].map((p) => ({ label: p.label, url: url(p.path) })),
  zog: [],
  holocaust: [],
  'axis-of-evil': [],
  fara: [
    POSTS['should-aipac-be-registered-under-fara'],
    POSTS['does-aipac-fall-under-22-usc-611'],
  ].map((p) => ({ label: p.label, url: url(p.path) })),
  torah: [
    POSTS['what-is-the-talmud'],
  ].map((p) => ({ label: p.label, url: url(p.path) })),
  tanakh: [],
}

/** Further reading for misconception topic slugs */
export const MISCONCEPTION_SOURCES = {
  israel: [
    POSTS['what-does-israel-mean'],
  ].map((p) => ({ label: p.label, url: url(p.path) })),
  talmud: [
    POSTS['what-is-the-talmud'],
    POSTS['are-jews-commanded-to-lie-about-the-talmud'],
    POSTS['gentiles-are-human'],
    POSTS['gentiles-are-not-animals'],
    POSTS['christianity-in-the-talmud'],
  ].map((p) => ({ label: p.label, url: url(p.path) })),
  'jewish-race': [
    POSTS['is-judaism-a-religion-or-race'],
    POSTS['where-do-gentiles-fit-into-the-jewish-world-view'],
    POSTS['gentiles-are-human'],
    POSTS['gentiles-are-not-animals'],
  ].map((p) => ({ label: p.label, url: url(p.path) })),
  conspiracy: [
    POSTS['did-the-jews-kill-jesus'],
    POSTS['should-aipac-be-registered-under-fara'],
  ].map((p) => ({ label: p.label, url: url(p.path) })),
}

export const HASHEM_FAITH_LABEL = 'Hashem.Faith'
