/**
 * Seed database from wiki sources (references/*.wiki) and app data.
 * Requires: npm install mysql2 dotenv
 * Copy .env.example to .env and set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.
 * Run: node database/seed.js
 */

import mysql from 'mysql2/promise'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env')
    const content = readFileSync(envPath, 'utf8')
    content.split('\n').forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
    })
  } catch (_) {}
}

loadEnv()

const config = {
  host: process.env.DB_HOST || '192.232.249.125',
  user: process.env.DB_USER || 'redsaber_antisemitism',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'redsaber_antisemitism',
}

if (!config.password) {
  console.error('Set DB_PASSWORD in .env (e.g. copy .env.example to .env)')
  process.exit(1)
}

// Timeline events: sources = cited URLs/publications from the .wiki reference files (not the wiki files themselves)
const TIMELINE_EVENTS = [
  { year: -2000, label: 'Origins of Judaism', region: 'levant', description: 'Judaism dates back to around 2000 B.C.; first Abrahamic faith, tracing to Abraham.', source_label: 'Judaism 101', source_url: 'http://www.jewfaq.org/index.htm' },
  { year: -1446, label: 'Exodus from Egypt', region: 'levant', description: 'Moses leads the Hebrews from Egypt; Ten Commandments at Mount Sinai.', source_label: 'Internet Jewish History Sourcebook', source_url: 'http://www.fordham.edu/halsall/jewish/jewishsbook.html' },
  { year: -1050, label: 'Saul, first king of Israel', region: 'levant', description: 'First monarchy under King Saul; Hebrews unite under a king after the period of the Judges.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: -1010, label: 'Kingdom under David', region: 'levant', description: 'David expands the kingdom (c. 1010–970 B.C.); Jerusalem becomes capital.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: -1000, label: 'Kingdom of Israel', region: 'levant', description: 'United monarchy under David and Solomon.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: -930, label: 'Split: Judah and Israel', region: 'levant', description: 'After Solomon, the kingdom splits: Judah (south) and Israel (north) with capital at Samaria.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: -722, label: 'Fall of Northern Kingdom', region: 'levant', description: 'Assyrians conquer northern Kingdom of Israel (721/722 B.C.); exile of northern tribes; "Lost Ten Tribes."', source_label: 'Jewfaq – What Is Judaism?', source_url: 'http://www.jewfaq.org/judaism.htm' },
  { year: -586, label: 'Babylonian conquest of Judah', region: 'levant', description: 'Southern Kingdom conquered by Babylonians; population exiled to Babylon (586/7 B.C.).', source_label: 'Jewfaq – What Is Judaism?', source_url: 'http://www.jewfaq.org/judaism.htm' },
  { year: -538, label: 'Cyrus allows return', region: 'levant', description: 'Cyrus of Persia allows Jews to return to ancestral homeland; Babylonian Talmud develops.', source_label: 'Jewfaq – What Is Judaism?', source_url: 'http://www.jewfaq.org/judaism.htm' },
  { year: -516, label: 'Second Temple built', region: 'levant', description: 'Second Temple completed (520–516 B.C.) under Persian rule.', source_label: 'An Encyclopedia of World History (Kingsport Press, 1948)', source_url: null },
  { year: -445, label: 'Nehemiah rebuilds Jerusalem', region: 'levant', description: 'Nehemiah rebuilds the walls of Jerusalem under Persian approval; opposition from other peoples in the land.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: -332, label: 'Alexander the Great', region: 'levant', description: 'Alexander sweeps through Israel; Persian rule replaced by Greek (Hellenism).', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: -198, label: 'Seleucids take Israel', region: 'levant', description: 'Seleucid (Syrian) Greeks push back Ptolemies and take control of Judah and Galilee.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: -168, label: 'Maccabean revolt', region: 'levant', description: 'Judaism declared illegal; Temple desecrated; revolt under Maccabees; Hanukkah.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: -142, label: 'Hasmonean independence', region: 'levant', description: 'Full independence from Seleucids (with Roman pressure); Jewish kingdom restored until Roman takeover.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: -63, label: 'Roman rule', region: 'levant', description: 'Pompey and Rome take control; Israel under Roman rule as province of Palestine.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 66, label: 'First Jewish–Roman War', region: 'levant', description: 'First major revolt against Rome; leads to siege of Jerusalem and eventual destruction of the Temple.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 70, label: 'Destruction of Second Temple', region: 'levant', description: 'Romans destroy the Temple in Jerusalem; Jews dispersed to Rome, Rhine (Ashkenaz), and beyond.', source_label: 'Jewfaq – What Is Judaism?', source_url: 'http://www.jewfaq.org/judaism.htm' },
  { year: 90, label: 'Council of Jamnia', region: 'levant', description: 'Jewish canon of Scripture defined at Yavneh; Hebrew Scriptures elevated; basis for later Masoretic tradition.', source_label: 'Jewfaq – What Is Judaism?', source_url: 'http://www.jewfaq.org/judaism.htm' },
  { year: 135, label: 'Bar Kokhba revolt', region: 'levant', description: 'Third revolt against Rome fails; Romans force Jews to leave; diaspora widens.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 200, label: 'Mishna period', region: 'levant', description: 'Mishna developed (200 B.C.–200 A.D.); Talmudic literature begins; Halakha and Aggadah.', source_label: 'Jewfaq – What Is Judaism?', source_url: 'http://www.jewfaq.org/judaism.htm' },
  { year: 500, label: 'Gemara / Talmud', region: 'levant', description: 'Gemara (200–500 A.D.) with Mishna comprises Talmud; regulates Jewish life until modern times.', source_label: 'Jewfaq – What Is Judaism?', source_url: 'http://www.jewfaq.org/judaism.htm' },
  { year: 635, label: 'Muslim conquest of Israel', region: 'levant', description: 'Muslim armies conquer the land; Jews become dhimmis (second-class citizens) in their own land.', source_label: 'Emmanuel Navon, The Star and the Scepter (JPS, 2020)', source_url: 'https://books.google.com/books?id=kOT8DwAAQBAJ&pg=PA54' },
  { year: 1009, label: 'Leningrad Codex', region: 'europe', description: 'Oldest complete copy of the Hebrew Bible (Masoretic Text); manuscript from 1009 A.D.', source_label: 'Judaism 101', source_url: 'http://www.jewfaq.org/index.htm' },
  { year: 1096, label: 'First Crusade', region: 'europe', description: 'Pogroms against Jewish communities in Europe and in the Holy Land.', source_label: 'Internet Jewish History Sourcebook', source_url: 'http://www.fordham.edu/halsall/jewish/jewishsbook.html' },
  { year: 1290, label: 'End of Crusader states', region: 'levant', description: 'Last Crusader state in the Holy Land falls; region under Mameluke then later Ottoman control.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 1492, label: 'Expulsion from Spain', region: 'europe', description: 'Alhambra Decree; Jews expelled from Spain (Golden Age ended); Sephardim disperse to Mediterranean and Americas.', source_label: 'Jewfaq – What Is Judaism?', source_url: 'http://www.jewfaq.org/judaism.htm' },
  { year: 1517, label: 'Ottoman rule', region: 'levant', description: 'Ottoman Turks control region (1517–1917); Mizrahi designation for non-European Jews.', source_label: 'Jewfaq – What Is Judaism?', source_url: 'http://www.jewfaq.org/judaism.htm' },
  { year: 1834, label: 'Safed pogrom', region: 'levant', description: 'Arabs of Galilee attack Jews of Safed; 33 days of rape, looting, and murder; Jewish property destroyed.', source_label: 'Hanan Amior, Presspectiva (2015)', source_url: 'https://presspectiva.org.il/%D7%91%D7%94%D7%90%D7%A8%D7%A5-%D7%A0%D7%98%D7%A2%D7%9F-%D7%A9%D7%94%D7%9B%D7%99%D7%91%D7%95%D7%A9-%D7%94%D7%95%D7%90-%D7%91%D7%99%D7%AA-%D7%94%D7%99%D7%95%D7%A6%D7%A8-%D7%A9%D7%9C-%D7%94%D7%98/' },
  { year: 1894, label: 'Dreyfus affair', region: 'europe', description: 'French Jewish officer Alfred Dreyfus wrongly convicted; socialist press denounced philo-Semitic defense; galvanized Zionism.', source_label: 'Joseph Telushkin, Jewish Literacy (HarperCollins, 2008)', source_url: 'https://books.google.com/books?id=bIHtJzYCkqEC' },
  { year: 1897, label: 'First Zionist Congress', region: 'europe', description: 'Basel; founding of modern political Zionism under Herzl.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 1917, label: 'Balfour Declaration', region: 'europe', description: 'British government support for a Jewish homeland in Palestine.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 1920, label: 'British Mandate', region: 'levant', description: 'Palestine under British mandate; Jewish immigration increases.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 1921, label: 'Jaffa riots', region: 'levant', description: 'Arab riots begin in Jaffa and spread; dozens of Jews murdered (46 years before 1967).', source_label: 'CET – 1921 riots', source_url: 'http://lib.cet.ac.il/pages/item.asp?item=2039' },
  { year: 1929, label: 'Hebron massacre', region: 'levant', description: 'Arab riots; massacre of Jewish community in Hebron and Safed; hundreds killed and wounded.', source_label: 'Hanan Amior, Presspectiva (2015)', source_url: 'https://presspectiva.org.il/%D7%91%D7%94%D7%90%D7%A8%D7%A5-%D7%A0%D7%98%D7%A2%D7%9F-%D7%A9%D7%94%D7%9B%D7%99%D7%91%D7%95%D7%A9-%D7%94%D7%95%D7%90-%D7%91%D7%99%D7%AA-%D7%94%D7%99%D7%95%D7%A6%D7%A8-%D7%A9%D7%9C-%D7%94%D7%98/' },
  { year: 1936, label: 'Arab revolt', region: 'levant', description: 'Arab revolt 1936–39; British restrict Jewish immigration (White Paper 1939).', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 1939, label: 'White Paper of 1939', region: 'levant', description: 'British limit Jewish immigration to Palestine at a time of dire need for Jews fleeing Europe.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 1947, label: 'UN partition plan', region: 'levant', description: 'UN proposes partition of Palestine into Jewish and Arab states; Arab states reject; violence escalates.', source_label: "Jeffrey Herf, Israel's Moment (Cambridge, 2022)", source_url: 'https://books.google.com/books?id=8YlZEAAAQBAJ&pg=PA235' },
  { year: 1948, label: 'State of Israel', region: 'levant', description: 'Declaration of independence May 14, 1948; immediately invaded by neighboring Arab states.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 1967, label: 'Six-Day War', region: 'levant', description: 'Israel gains Sinai, Gaza, West Bank, Golan, East Jerusalem; East German Communists use former Nazi propagandists for anti-Israel propaganda.', source_label: 'Jeffrey Herf, Divided Memory (Harvard, 1997)', source_url: 'https://books.google.com/books?id=yahqnBEEbQEC' },
  { year: 1973, label: 'Yom Kippur War', region: 'levant', description: 'Egypt and Syria attack on Yom Kippur; Israel pushes back with U.S./Soviet diplomacy.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 1976, label: 'Entebbe raid', region: 'europe', description: 'PFLP and German leftists hijack Air France flight; Jewish passengers singled out for murder; Israeli rescue at Entebbe.', source_label: 'Stephen E. Atkins, Encyclopedia of modern worldwide extremists (Greenwood, 2004)', source_url: 'https://books.google.com/books?id=b8k4rEPvq_8C' },
  { year: 1979, label: 'Israel–Egypt peace', region: 'levant', description: 'Camp David; peace treaty between Israel and Egypt.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 1979, label: 'Sandinistas target Jews', region: 'americas', description: 'Marxist Sandinistas seize Nicaragua; synagogue bombed and confiscated; many of ~250 Jews flee.', source_label: 'U.S. State Dept., International Religious Freedom Report – Nicaragua (2001)', source_url: 'http://www.state.gov/g/drl/rls/irf/2001/5681.htm' },
  { year: 1985, label: 'Achille Lauro / Klinghoffer', region: 'europe', description: 'PLF (Communist) hijacks cruise ship; Leon Klinghoffer murdered and dumped overboard because he was Jewish.', source_label: 'Sun-Sentinel / ADL – Achille Lauro', source_url: 'https://articles.sun-sentinel.com/2003-04-17/news/0304161228_1_achille-lauro-abul-abbas-palestinian-authority' },
  { year: 1991, label: 'Madrid Conference', region: 'europe', description: 'Landmark conference; Israel, Palestinians, and Arab states in direct talks; basis for later Oslo.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 1993, label: 'Oslo Accords', region: 'levant', description: 'Israel and PLO sign Declaration of Principles.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 1995, label: 'Rabin assassinated', region: 'levant', description: 'Prime Minister Yitzhak Rabin assassinated by right-wing Jewish radical; Peres continues peace efforts.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 2017, label: 'US recognizes Jerusalem', region: 'levant', description: 'U.S. recognizes Jerusalem as capital of Israel and moves embassy from Tel Aviv.', source_label: 'Jewish Virtual Library', source_url: 'http://www.jewishvirtuallibrary.org/' },
  { year: 2020, label: 'Abraham Accords', region: 'levant', description: 'UAE, Bahrain normalize relations with Israel; later Kosovo, Serbia.', source_label: 'UPI / USA Today (Sept 2020)', source_url: 'https://www.upi.com/Top_News/US/2020/09/15/UAE-Bahrain-Israel-normalize-relations-in-White-House-ceremony/1331600180371/' },
  { year: 2023, label: 'Oct 7 attacks', region: 'levant', description: 'Hamas attack on Israel; war in Gaza.', source_label: null, source_url: null },
]

// Hashem.Faith further-reading links (https://hashem.faith/post-sitemap.xml) — stored in DB and used for definitions/misconceptions
const HASHEM = 'https://hashem.faith'
const DEFINITION_FURTHER_READING = {
  jew: [
    { label: 'Is Judaism a religion or race?', url: `${HASHEM}/is-judaism-a-religion-or-race/` },
    { label: 'Is Jewish a language?', url: `${HASHEM}/is-jewish-a-language/` },
  ],
  talmud: [
    { label: 'What is the Talmud?', url: `${HASHEM}/what-is-the-talmud/` },
    { label: 'Is the Talmud more holy than the Bible?', url: `${HASHEM}/is-the-talmud-more-holy-than-the-bible/` },
    { label: 'Are Jews commanded to lie about the Talmud?', url: `${HASHEM}/are-jews-commanded-to-lie-about-the-talmud/` },
    { label: 'Christianity in the Talmud', url: `${HASHEM}/christianity-in-the-talmud/` },
    { label: 'Gentiles are human', url: `${HASHEM}/gentiles-are-human/` },
    { label: 'Gentiles are not animals', url: `${HASHEM}/gentiles-are-not-animals/` },
    { label: 'The Jesus narrative in the Talmud', url: `${HASHEM}/the-jesus-narrative-in-the-talmud/` },
    { label: 'Jesus in the Talmud', url: `${HASHEM}/jesus-in-the-talmud/` },
  ],
  genocide: [],
  antisemitism: [
    { label: 'Should AIPAC be registered under FARA?', url: `${HASHEM}/should-aipac-be-registered-under-fara/` },
    { label: 'Does AIPAC fall under 22 USC 611?', url: `${HASHEM}/does-aipac-fall-under-22-usc-611/` },
  ],
  zionism: [
    { label: 'What does Israel mean?', url: `${HASHEM}/what-does-israel-mean/` },
  ],
  agitprop: [],
  goy: [
    { label: 'Where do gentiles fit into the Jewish world view?', url: `${HASHEM}/where-do-gentiles-fit-into-the-jewish-world-view/` },
    { label: 'Gentiles are human', url: `${HASHEM}/gentiles-are-human/` },
    { label: 'Gentiles are not animals', url: `${HASHEM}/gentiles-are-not-animals/` },
  ],
  israel: [{ label: 'What does Israel mean?', url: `${HASHEM}/what-does-israel-mean/` }],
  zog: [],
  holocaust: [],
  'axis-of-evil': [],
  fara: [
    { label: 'Should AIPAC be registered under FARA?', url: `${HASHEM}/should-aipac-be-registered-under-fara/` },
    { label: 'Does AIPAC fall under 22 USC 611?', url: `${HASHEM}/does-aipac-fall-under-22-usc-611/` },
  ],
  torah: [{ label: 'What is the Talmud?', url: `${HASHEM}/what-is-the-talmud/` }],
  tanakh: [],
}
const MISCONCEPTION_FURTHER_READING = {
  israel: [{ label: 'What does Israel mean?', url: `${HASHEM}/what-does-israel-mean/` }],
  talmud: [
    { label: 'What is the Talmud?', url: `${HASHEM}/what-is-the-talmud/` },
    { label: 'Are Jews commanded to lie about the Talmud?', url: `${HASHEM}/are-jews-commanded-to-lie-about-the-talmud/` },
    { label: 'Gentiles are human', url: `${HASHEM}/gentiles-are-human/` },
    { label: 'Gentiles are not animals', url: `${HASHEM}/gentiles-are-not-animals/` },
    { label: 'Christianity in the Talmud', url: `${HASHEM}/christianity-in-the-talmud/` },
  ],
  'jewish-race': [
    { label: 'Is Judaism a religion or race?', url: `${HASHEM}/is-judaism-a-religion-or-race/` },
    { label: 'Where do gentiles fit into the Jewish world view?', url: `${HASHEM}/where-do-gentiles-fit-into-the-jewish-world-view/` },
    { label: 'Gentiles are human', url: `${HASHEM}/gentiles-are-human/` },
    { label: 'Gentiles are not animals', url: `${HASHEM}/gentiles-are-not-animals/` },
  ],
  conspiracy: [
    { label: 'Did the Jews kill Jesus?', url: `${HASHEM}/did-the-jews-kill-jesus/` },
    { label: 'Should AIPAC be registered under FARA?', url: `${HASHEM}/should-aipac-be-registered-under-fara/` },
  ],
}

// Definitions (from app); body_text enriched with context that Hashem.Faith articles address
const DEFINITIONS = [
  { slug: 'jew', title: 'Jew', summary: 'Who is a Jew? Religion, people, and identity.', body_text: 'A Jew is someone who belongs to the Jewish people—either by religion (Judaism), ancestry, or both. Judaism is both an ethnoreligion and a tradition. Many Jews identify as a people or nation (am Yisrael) as well as a religion. Conversion to Judaism is possible; converts are fully Jewish. Jewish identity has been passed down for millennia through family and community, often in the face of persecution. Questions like whether Judaism is a religion or a race, or whether "Jewish" refers to a language (Hebrew or Yiddish), are addressed in depth at Hashem.Faith with sourced explanations.' },
  { slug: 'goy', title: 'Goy', summary: 'Hebrew/Yiddish term for a non-Jew; meaning and misuse.', body_text: 'Goy (Hebrew גוי, plural goyim) is the Hebrew and Yiddish word for a non-Jew—equivalent to "gentile" in English. It literally means "nation" or "people" and in Jewish usage is neutral, not derogatory. Antisemites sometimes claim that Jews use the word to demean non-Jews. In Jewish texts and everyday speech, goy is simply the term for someone who is not Jewish. Hashem.Faith has articles on how gentiles are viewed in Jewish tradition.' },
  { slug: 'talmud', title: 'Talmud', summary: 'What is the Talmud? Central text of Rabbinic Judaism.', body_text: 'The Talmud is the central text of Rabbinic Judaism—comprising the Mishnah (oral law, redacted around 200 CE) and the Gemara (commentaries and discussions). It is not a single book but a vast body of law, narrative, and debate. It is often misquoted or taken out of context by antisemites. Understanding it requires study and context; isolated quotes are easily weaponized. Common antisemitic myths—that the Talmud is "more holy" than the Bible, that Jews are commanded to lie about it, that it dehumanizes gentiles or attacks Christianity—are refuted with primary-source context in articles at Hashem.Faith.' },
  { slug: 'torah', title: 'Torah', summary: 'The first five books of the Hebrew Bible and Jewish teaching.', body_text: 'The Torah is the first five books of the Hebrew Bible: Genesis, Exodus, Leviticus, Numbers, and Deuteronomy. It is the foundational scripture of Judaism. In broader Jewish usage, "Torah" can mean the entire body of Jewish teaching and law, including the Talmud. The Torah is read in synagogue and studied as the core of Jewish life.' },
  { slug: 'tanakh', title: 'Tanakh', summary: 'The Hebrew Bible: Torah, Prophets, and Writings.', body_text: 'The Tanakh is the Hebrew Bible—the canonical scripture of Judaism. The name is an acronym: Torah (Teaching), Nevi\'im (Prophets), and Ketuvim (Writings). It corresponds to what Christianity calls the Old Testament. The Tanakh is the written foundation of Jewish belief and practice.' },
  { slug: 'israel', title: 'Israel', summary: 'The state, the people, and the name.', body_text: 'Israel can mean: (1) the modern State of Israel, established in 1948; (2) the ancient kingdoms of Israel and Judah; (3) the biblical name for the Jewish people (literally "one who wrestles with God," from the story of Jacob). Jewish ties to the land are ancient and continuous. Hashem.Faith explores what "Israel" means biblically and historically.' },
  { slug: 'genocide', title: 'Genocide', summary: 'Legal and historical definition—and when it applies.', body_text: 'Under international law (UN Genocide Convention, 1948), genocide means acts committed with intent to destroy, in whole or in part, a national, ethnical, racial or religious group. The key is intent to destroy the group as such. The Holocaust and Inquisition are clear cases; the Gaza war is not.' },
  { slug: 'holocaust', title: 'Holocaust', summary: 'The Nazi genocide of European Jewry (1933–1945).', body_text: 'The Holocaust (Hebrew Shoah) was the systematic genocide of European Jewry by Nazi Germany and its collaborators, roughly 1933–1945. Approximately six million Jews were murdered—two-thirds of European Jewry. Holocaust denial or minimization is antisemitic. The evidence—documentation, testimony, sites, and scholarship—is overwhelming.' },
  { slug: 'antisemitism', title: 'Antisemitism', summary: 'Hatred or prejudice against Jews.', body_text: 'Antisemitism is prejudice, hatred, or discrimination against Jews as Jews. The term was coined in the 19th century but the phenomenon is ancient. It includes stereotypes, conspiracy theories, denial of Jewish rights (including to a state), and violence. The IHRA working definition is widely used for identifying antisemitism in policy and education. Claims that groups like AIPAC should register as "foreign agents" (FARA) often overlap with conspiracy tropes; Hashem.Faith examines the legal and factual basis for such claims.' },
  { slug: 'zionism', title: 'Zionism', summary: 'Jewish self-determination and the state of Israel.', body_text: 'Zionism is the movement for Jewish self-determination and a national home in the ancestral homeland, Israel. Modern political Zionism emerged in the late 19th century in response to antisemitism and the desire for a sovereign Jewish state. Support for Israel\'s right to exist is not "colonialism"; Jewish ties to the land are ancient and continuous. The meaning of the name "Israel" and its biblical and historical significance are explored at Hashem.Faith.' },
  { slug: 'zog', title: 'ZOG', summary: '"Zionist Occupied Government"—antisemitic conspiracy term.', body_text: 'ZOG stands for "Zionist Occupied Government." It is a conspiracy term used by white supremacists and antisemites to claim that Jews secretly control the U.S. government—and by extension, media, finance, and culture. There is no evidence for this. The idea recycles centuries-old antisemitic conspiracy myths.' },
  { slug: 'axis-of-evil', title: 'Axis of Evil', summary: 'U.S. phrase for state sponsors of terrorism; sometimes misused.', body_text: '"Axis of Evil" was a phrase used by U.S. President George W. Bush in 2002 to describe governments that sponsor terrorism: Iraq, Iran, and North Korea. The term is sometimes misused in antisemitic or anti-Israel rhetoric to suggest that Israel or "Zionists" are part of a global evil conspiracy.' },
  { slug: 'fara', title: 'FARA', summary: 'Foreign Agents Registration Act and how it is weaponized against Jews.', body_text: 'FARA is the U.S. Foreign Agents Registration Act. It requires people and groups acting as agents of foreign principals to register and disclose their activities. Antisemitic rhetoric often demands that pro-Israel advocacy groups (e.g. AIPAC) register under FARA, implying they are "foreign agents." Hashem.Faith examines whether such groups fall under the law.' },
  { slug: 'agitprop', title: 'Agitprop', summary: 'Agitation and propaganda—how political messaging is used to sway opinion.', body_text: 'Agitprop (from "agitation" + "propaganda") is political messaging designed to agitate and mobilize people rather than to inform. It uses slogans, imagery, and one-sided framing to provoke strong emotion and action. Antisemitic and anti-Israel narratives are often spread through agitprop: memes, chants, and distorted claims that bypass critical thinking. Recognizing agitprop helps you separate emotional manipulation from factual argument.' },
]

// Agitators (from app). image_url = Wikimedia Commons (CC/PD) direct link via Special:FilePath.
const AGITATORS = [
  { slug: 'tucker-carlson', name: 'Tucker Carlson', subtitle: 'Mainstreaming antisemitic tropes and white-nationalist talking points', description: 'Former Fox News host who has repeatedly platformed antisemitic guests, promoted replacement theory, and used dog whistles about "globalists" and "cosmopolitan elites" that antisemites interpret as Jews.', image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tucker_Carlson_2020_%28cropped%29.jpg', sources: [
    { date_label: '2022', text: 'Platformed white nationalist Nick Fuentes and Ye (Kanye West) after antisemitic outbursts.', url: null },
    { date_label: '2023', text: 'Suggested Jewish influence over media and "why do I have to love the Holocaust?" rhetoric.', url: null },
    { date_label: '2024', text: 'Continued rhetoric about "globalist" elites and opposition to Israel aid.', url: null },
  ]},
  { slug: 'thomas-massie', name: 'Thomas Massie', subtitle: 'Voting against Holocaust remembrance and Israel support', description: 'U.S. Representative who has voted against Holocaust education funding and aid to Israel, and made statements that critics say downplay antisemitism or align with isolationist, anti-Israel narratives.', image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Thomas_Massie_1.jpg', sources: [
    { date_label: '2024', text: 'Voted against Holocaust Education Act and Israel aid package.', url: null },
    { date_label: 'Various', text: 'Consistent "America First" votes against foreign aid including to Israel.', url: null },
  ]},
  { slug: 'david-duke', name: 'David Duke', subtitle: 'Former KKK leader and open white supremacist', description: 'Former Ku Klux Klan leader and white nationalist who has run for office repeatedly. Openly antisemitic, promoting conspiracy theories about Jewish control and Holocaust minimization.', image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/David_Duke.jpg', sources: [
    { date_label: 'Decades', text: 'Public speeches and writings blaming Jews for societal ills and promoting white supremacy.', url: null },
  ]},
  { slug: 'nick-fuentes', name: 'Nick Fuentes', subtitle: 'White nationalist streamer and Holocaust denier', description: 'Far-right streamer and activist who promotes white nationalism, Holocaust denial, and open antisemitism. Has been deplatformed from major services; continues to reach audiences via alternative platforms.', image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Nick_Fuentes_screencap_from_July_2022_virtual_debate_%283x4_cropped%29.png', sources: [
    { date_label: '2022', text: 'Dinner with Ye and Donald Trump; Fuentes has repeatedly denied the Holocaust.', url: null },
    { date_label: 'Ongoing', text: 'Streams and rallies promoting antisemitic and white nationalist ideology.', url: null },
  ]},
  { slug: 'ilhan-omar', name: 'Ilhan Omar', subtitle: 'Tropes about Jewish money and dual loyalty', description: 'U.S. Representative who has been criticized for statements invoking antisemitic tropes—e.g., that U.S. support for Israel is "all about the Benjamins," and suggestions of dual loyalty—which draw on classic antisemitic canards.', image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ilhan_Omar%2C_official_portrait%2C_116th_Congress_%28cropped%29_A.jpg', sources: [
    { date_label: '2019', text: '"It\'s all about the Benjamins" tweet about AIPAC; dual loyalty tropes.', url: null },
    { date_label: 'Later', text: 'Additional statements on Israel and lobbying that critics say repeat tropes.', url: null },
  ]},
  { slug: 'candace-owens', name: 'Candace Owens', subtitle: 'Downplaying antisemitism and defending antisemitic figures', description: 'Commentator and host who has repeatedly downplayed antisemitism and defended figures who made antisemitic statements. She has suggested that discussion of the Holocaust is overemphasized and defended Kanye West after his antisemitic outbursts, framing criticism as political rather than a response to hate speech.', image_url: null, sources: [
    { date_label: '2022', text: 'Defended Ye (Kanye West) after antisemitic comments; suggested the issue was being weaponized.', url: null },
    { date_label: '2023', text: 'Remarks that critics say minimize the significance of Holocaust education and antisemitism.', url: null },
  ]},
  { slug: 'marjorie-taylor-greene', name: 'Marjorie Taylor Greene', subtitle: 'Jewish space lasers, Soros tropes, and Holocaust comparisons', description: 'U.S. Representative who has promoted antisemitic conspiracy imagery and tropes. She suggested that a Jewish family (Rothschilds) and space-based lasers were behind wildfires; has invoked George Soros in conspiratorial ways; and compared COVID safety measures to the Holocaust, trivializing the genocide of Jews.', image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rep._Marjorie_Taylor_Greene_Official_Portrait_117th_Congress.jpg', sources: [
    { date_label: '2018', text: 'Facebook post linking Rothschild Inc. and space lasers to wildfires; later deleted.', url: null },
    { date_label: '2021–present', text: 'Holocaust comparisons (masks, vaccines) and Soros tropes.', url: null },
  ]},
  { slug: 'greta-thunberg', name: 'Greta Thunberg', subtitle: 'Antisemitic imagery and tropes in Israel–Gaza activism', description: 'Climate activist who has been criticized for sharing and endorsing content that used antisemitic imagery and tropes in the context of Israel and Gaza. She posted an image of an octopus as a symbol of "colonization" that echoed classic antisemitic "Jewish control" imagery, and has repeated one-sided "genocide" framing that conflates Jews and the State of Israel.', image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Greta_Thunberg_2024.jpg', sources: [
    { date_label: '2023', text: 'Shared octopus image with antisemitic connotations; later removed after criticism.', url: null },
    { date_label: '2024', text: 'Continued rhetoric that critics say demonizes Israel and blurs Jews with Israeli policy.', url: null },
  ]},
  { slug: 'cenk-uygur', name: 'Cenk Uygur', subtitle: '"Jewish lobby" and dual-loyalty tropes', description: 'Founder and host of The Young Turks who has been criticized for rhetoric that invokes antisemitic tropes about Jewish or "Israel lobby" control of U.S. policy and media. Critics point to language that suggests dual loyalty and secret influence, which echoes classic antisemitic canards.', image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cenk_Uygur_2014.jpg', sources: [
    { date_label: 'Various', text: 'Statements about "Jewish lobby," AIPAC, and U.S. policy that critics say use dual-loyalty tropes.', url: null },
  ]},
  { slug: 'ana-kasparian', name: 'Ana Kasparian', subtitle: 'Tropes about Jewish influence and lobbying', description: 'Host and commentator at The Young Turks who has made statements about Israel and pro-Israel advocacy that critics say rely on antisemitic tropes—including suggestions of undue Jewish or "lobby" influence over politics and media, and framing that echoes dual-loyalty and control narratives.', image_url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ana_Kasparian_2016.jpg', sources: [
    { date_label: 'Various', text: 'Comments on Israel, AIPAC, and "lobby" influence that critics say invoke antisemitic tropes.', url: null },
  ]},
  { slug: 'ms-rachel', name: 'Ms. Rachel', subtitle: 'Controversy over Gaza letter and perceived one-sidedness', description: 'Children\'s educator and internet personality who faced criticism for signing an open letter related to Israel and Gaza that some Jewish and pro-Israel groups said was one-sided, downplayed Hamas terrorism, or contributed to an environment where antisemitic rhetoric flourishes. The controversy centers on the framing of the conflict and the impact of such statements on Jewish families and educators.', image_url: null, sources: [
    { date_label: '2023–2024', text: 'Signed open letter on Gaza that drew criticism from Jewish organizations and parents.', url: null },
  ]},
  { slug: 'stew-peters', name: 'Stew Peters', subtitle: 'Antisemitic conspiracy theories and Great Replacement', description: 'Far-right host and podcaster who has promoted antisemitic conspiracy theories, including Great Replacement rhetoric and tropes about "globalists" and elite control that antisemites interpret as Jews. His show has platformed guests who spread Holocaust denial and other antisemitic content.', image_url: null, sources: [
    { date_label: 'Ongoing', text: 'Show content and guests promoting replacement theory and antisemitic conspiracy tropes.', url: null },
  ]},
  { slug: 'dan-bilzerian', name: 'Dan Bilzerian', subtitle: 'Antisemitic posts and memes on social media', description: 'Social media personality and poker player who has posted antisemitic memes and comments online. His posts have included classic antisemitic imagery and conspiracy tropes, contributing to normalization of Jew-hatred in online spaces.', image_url: null, sources: [
    { date_label: 'Various', text: 'Social media posts containing antisemitic imagery and conspiracy rhetoric.', url: null },
  ]},
  { slug: 'lucas-gage', name: 'Lucas Gage', subtitle: 'Antisemitic rhetoric and Holocaust minimization', description: 'Streamer and online commentator who has promoted antisemitic rhetoric and Holocaust minimization. He has used "globalist" and "Zionist" conspiracy language and made statements that downplay or distort the Holocaust and Jewish experience.', image_url: null, sources: [
    { date_label: 'Ongoing', text: 'Streams and posts featuring antisemitic tropes and Holocaust minimization.', url: null },
  ]},
  { slug: 'jackson-hinkle', name: 'Jackson Hinkle', subtitle: 'Anti-Israel rhetoric that crosses into antisemitic tropes', description: 'Social media commentator known for virulent anti-Israel content who has repeatedly used rhetoric that critics say crosses into antisemitic tropes: conspiracy framing about "Zionist" control of media and government, and content that blurs Jews with the Israeli state and dehumanizes Israelis.', image_url: null, sources: [
    { date_label: '2023–2024', text: 'Posts and commentary invoking "Zionist" control and conspiracy tropes; millions of followers.', url: null },
  ]},
  { slug: 'jake-shields', name: 'Jake Shields', subtitle: 'Antisemitic conspiracy posts and "globalist" rhetoric', description: 'MMA fighter and social media figure who has posted antisemitic conspiracy content online, including references to George Soros and "globalists" in ways that echo classic antisemitic tropes about Jewish power and control.', image_url: null, sources: [
    { date_label: 'Various', text: 'Social media posts promoting antisemitic conspiracy theories and "globalist" tropes.', url: null },
  ]},
  { slug: 'ian-carroll', name: 'Ian Carroll', subtitle: 'Antisemitic and extreme anti-Israel conspiracy content', description: 'Commentator and podcaster who has promoted or platformed antisemitic and extreme anti-Israel conspiracy content. His rhetoric and guests have included tropes about "Zionist" or Jewish control and narratives that demonize Israel and blur distinctions between Jews and Israeli policy.', image_url: null, sources: [
    { date_label: 'Ongoing', text: 'Content and guests that critics say promote antisemitic and conspiracy tropes.', url: null },
  ]},
  { slug: 'james-fishback', name: 'James Fishback', subtitle: 'Rhetoric that invokes antisemitic conspiracy tropes', description: 'Commentator and writer who has been criticized for rhetoric that invokes antisemitic conspiracy tropes—including framing of "Zionist" or Jewish influence over media and institutions in ways that echo classic antisemitic narratives about secret control and dual loyalty.', image_url: null, sources: [
    { date_label: 'Various', text: 'Statements and writing that critics say rely on antisemitic conspiracy framing.', url: null },
  ]},
]

// Misconceptions (hub) and topic content
const MISCONCEPTIONS = [
  { slug: 'israel', title: 'Israel', summary: 'Myths about Israel\'s founding, "colonialism," and the conflict.' },
  { slug: 'talmud', title: 'The Talmud', summary: 'Misquotes and false claims about what the Talmud says.' },
  { slug: 'jewish-race', title: 'The Jewish "Race"', summary: 'Facts about Jewish identity: ethnicity, religion, and race.' },
  { slug: 'conspiracy', title: 'Conspiracy Theories', summary: 'Classic antisemitic conspiracy myths and why they\'re false.' },
]

// Topic body_text enriched with context that Hashem.Faith articles address
const MISCONCEPTION_TOPICS = [
  { topic_slug: 'israel', title: 'Israel', body_text: '<p><strong>"Israel is a colonial project."</strong> Jews have had a continuous presence in the land for millennia. Modern Zionism sought self-determination in the ancestral homeland after persecution in Europe and elsewhere. The state was established with international recognition (UN 1947–48). Calling it "colonial" erases Jewish indigeneity and history.</p><p><strong>"Israel has no right to exist."</strong> Israel is a sovereign state and a member of the UN. Denying only the Jewish state\'s right to exist, while accepting others, is a form of antisemitism (see IHRA definition).</p><p><strong>"Israel is committing genocide."</strong> As covered in Definitions, genocide requires intent to destroy a group. Israel is fighting Hamas; its aim is not to eliminate Palestinians as a people. Casualties of war are not by themselves genocide.</p><p>The name "Israel" and its biblical and historical meaning are explained in depth at Hashem.Faith.</p>', sort_order: 1 },
  { topic_slug: 'talmud', title: 'The Talmud', body_text: '<p><strong>"The Talmud says X about non-Jews."</strong> The Talmud is a vast legal and narrative corpus. Isolated lines are often taken out of context, mistranslated, or from passages that are debated or obsolete. Serious understanding requires scholarship and context.</p><p><strong>"The Talmud is secret or evil."</strong> The Talmud is studied openly and is the basis of Jewish law and tradition. Antisemites have long weaponized fake or distorted "quotes" to portray Jews as hostile to non-Jews.</p><p>Hashem.Faith addresses myths that the Talmud commands lying, dehumanizes gentiles, or is hostile to Christianity—with citations and context.</p>', sort_order: 2 },
  { topic_slug: 'jewish-race', title: 'The Jewish "Race"', body_text: '<p><strong>"Are Jews a race?"</strong> Jews are an ethnoreligious group. Identity is passed through family and community; there is genetic diversity but also shared ancestry among many Jews. Nazis racialized Jews to justify genocide; today, many Jews identify as both an ethnicity and a religion.</p><p><strong>"Jews are white / not white."</strong> Jewish identity predates modern racial categories. Jews have been classified differently in different times and places. Reducing Jews to a single "race" ignores this history and diversity.</p><p>Hashem.Faith discusses whether Judaism is a religion or race, where gentiles fit in the Jewish worldview, and refutes the myth that Jewish texts dehumanize non-Jews.</p>', sort_order: 3 },
  { topic_slug: 'conspiracy', title: 'Conspiracy Theories', body_text: '<p><strong>"Jews control the media / banks / government."</strong> Classic antisemitic conspiracy with no evidence. It has been used for centuries to blame Jews for societal problems and to justify violence.</p><p><strong>"The Holocaust didn\'t happen" or "was exaggerated."</strong> Holocaust denial is false and antisemitic. The evidence—documentation, testimony, sites—is overwhelming.</p><p><strong>"Israel did 9/11" or "Jews knew in advance."</strong> Baseless conspiracy theories that recycle antisemitic tropes about Jewish power and malice.</p><p>The claim that "the Jews killed Jesus" and conspiracy narratives about Jewish lobbying (e.g. AIPAC/FARA) are addressed with historical and legal context at Hashem.Faith.</p>', sort_order: 4 },
]

async function run() {
  const conn = await mysql.createConnection(config)
  console.log('Connected to MySQL.')

  await conn.execute('SET FOREIGN_KEY_CHECKS = 0')
  await conn.execute('TRUNCATE TABLE agitator_sources')
  await conn.execute('TRUNCATE TABLE misconception_topics')
  await conn.execute('TRUNCATE TABLE agitators')
  await conn.execute('TRUNCATE TABLE misconceptions')
  await conn.execute('TRUNCATE TABLE definitions')
  await conn.execute('TRUNCATE TABLE timeline_events')
  await conn.execute('SET FOREIGN_KEY_CHECKS = 1')
  console.log('Cleared existing data.')

  // Timeline events
  console.log('Inserting timeline_events...')
  for (const e of TIMELINE_EVENTS) {
    await conn.execute(
      'INSERT INTO timeline_events (year, label, region, description, source_label, source_url) VALUES (?, ?, ?, ?, ?, ?)',
      [e.year, e.label, e.region || null, e.description || null, e.source_label || null, e.source_url || null]
    )
  }
  console.log(`  ${TIMELINE_EVENTS.length} events.`)

  // Definitions (with Hashem.Faith further_reading)
  console.log('Inserting definitions...')
  for (const d of DEFINITIONS) {
    const furtherReading = DEFINITION_FURTHER_READING[d.slug] || []
    await conn.execute(
      'INSERT INTO definitions (slug, title, summary, body_text, further_reading) VALUES (?, ?, ?, ?, ?)',
      [d.slug, d.title, d.summary, d.body_text || null, furtherReading.length ? JSON.stringify(furtherReading) : null]
    )
  }
  console.log(`  ${DEFINITIONS.length} definitions.`)

  // Agitators + sources
  console.log('Inserting agitators and agitator_sources...')
  for (const a of AGITATORS) {
    const [r] = await conn.execute(
      'INSERT INTO agitators (slug, name, subtitle, description, image_url) VALUES (?, ?, ?, ?, ?)',
      [a.slug, a.name, a.subtitle, a.description, a.image_url || null]
    )
    const agitatorId = r.insertId
    let order = 0
    for (const s of a.sources) {
      await conn.execute(
        'INSERT INTO agitator_sources (agitator_id, date_label, text, url, sort_order) VALUES (?, ?, ?, ?, ?)',
        [agitatorId, s.date_label, s.text, s.url || null, order++]
      )
    }
  }
  console.log(`  ${AGITATORS.length} agitators with sources.`)

  // Misconceptions + topics (one topic per misconception, matched by slug)
  console.log('Inserting misconceptions and misconception_topics...')
  const topicBySlug = Object.fromEntries(MISCONCEPTION_TOPICS.map((t) => [t.topic_slug, t]))
  for (const m of MISCONCEPTIONS) {
    const [r] = await conn.execute(
      'INSERT INTO misconceptions (slug, title, summary) VALUES (?, ?, ?)',
      [m.slug, m.title, m.summary]
    )
    const misId = r.insertId
    const t = topicBySlug[m.slug]
    if (t) {
      const furtherReading = MISCONCEPTION_FURTHER_READING[t.topic_slug] || []
      await conn.execute(
        'INSERT INTO misconception_topics (misconception_id, topic_slug, title, body_text, further_reading, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        [misId, t.topic_slug, t.title, t.body_text, furtherReading.length ? JSON.stringify(furtherReading) : null, t.sort_order]
      )
    }
  }
  console.log(`  ${MISCONCEPTIONS.length} misconceptions with topics.`)

  await conn.end()
  console.log('Seed done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
