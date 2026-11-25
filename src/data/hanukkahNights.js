// Eight nights of HaShem.Faith (Hanukkah 2026). Unlock times are America/Phoenix.
// Preview: ?preview=all or ?preview=3 (unlock through night N) — for UAT only.

export const HANUKKAH_TZ = 'America/Phoenix'

/** @type {Array<{
 *  night: number,
 *  unlockAt: string,
 *  dateLabel: string,
 *  postTime: string,
 *  title: string,
 *  slug: string,
 *  path: string,
 *  blurb: string,
 *  xPost: string,
 *  featureKind: string,
 * }>} */
export const HANUKKAH_NIGHTS = [
  {
    night: 1,
    unlockAt: '2026-12-04T15:00:00-07:00',
    dateLabel: 'Fri Dec 4',
    postTime: 'Before sundown',
    title: 'Light the menorah',
    slug: 'menorah',
    path: '/hanukkah',
    blurb: 'Eight nights. One new experience each evening. Light the first candle and open the hub.',
    featureKind: 'hub',
    xPost:
      'Hanukkah starts tonight. For the next eight nights, HaShem.Faith unlocks something new each evening.\n\nNight 1: the menorah is lit. Visit the hub — one candle tonight, seven more to come.\n\nhttps://antisemitism.hashem.faith/hanukkah',
  },
  {
    night: 2,
    unlockAt: '2026-12-05T18:30:00-07:00',
    dateLabel: 'Sat Dec 5',
    postTime: 'After Shabbat ends',
    title: 'Hanukkah map story',
    slug: 'map',
    path: '/hanukkah/map',
    blurb: 'Walk the places of the story — Modi\'in, Jerusalem, the Temple — one stop unlocked each night.',
    featureKind: 'map',
    xPost:
      'Night 2: a map of the Hanukkah story.\n\nModi\'in, Jerusalem, the desecrated Temple, and the places the revolt moved through. Tonight the first stops open.\n\nhttps://antisemitism.hashem.faith/hanukkah/map',
  },
  {
    night: 3,
    unlockAt: '2026-12-06T17:30:00-07:00',
    dateLabel: 'Sun Dec 6',
    postTime: 'Early evening',
    title: 'Candle of the night quiz',
    slug: 'quiz',
    path: '/hanukkah/quiz',
    blurb: 'Three sourced questions each night. Light another candle when you finish.',
    featureKind: 'quiz',
    xPost:
      'Night 3: Candle of the night.\n\nThree short, sourced questions about Hanukkah and Jewish history. Finish the quiz to light tonight\'s candle.\n\nhttps://antisemitism.hashem.faith/hanukkah/quiz',
  },
  {
    night: 4,
    unlockAt: '2026-12-07T17:30:00-07:00',
    dateLabel: 'Mon Dec 7',
    postTime: 'Early evening',
    title: 'Definition flashcards',
    slug: 'flashcards',
    path: '/hanukkah/flashcards',
    blurb: 'Swipe or press keys through plain-language cards for words that get weaponized online.',
    featureKind: 'flashcards',
    xPost:
      'Night 4: definition flashcards.\n\nJew, Goy, Talmud, Zionism, Antisemitism and more — short cards, sourced, keyboard and swipe.\n\nhttps://antisemitism.hashem.faith/hanukkah/flashcards',
  },
  {
    night: 5,
    unlockAt: '2026-12-08T17:30:00-07:00',
    dateLabel: 'Tue Dec 8',
    postTime: 'Early evening',
    title: 'Dreidel match',
    slug: 'dreidel',
    path: '/hanukkah/dreidel',
    blurb: 'Spin the dreidel, then match a circulating Talmud claim to the right context.',
    featureKind: 'dreidel',
    xPost:
      'Night 5: dreidel match.\n\nSpin, then match a common Talmud claim to what the passage actually says. Sources on every card.\n\nhttps://antisemitism.hashem.faith/hanukkah/dreidel',
  },
  {
    night: 6,
    unlockAt: '2026-12-09T17:30:00-07:00',
    dateLabel: 'Wed Dec 9',
    postTime: 'Early evening',
    title: 'Source hunt',
    slug: 'hunt',
    path: '/hanukkah/hunt',
    blurb: 'Find the citation. A claim appears; pick the real source from the decoys.',
    featureKind: 'hunt',
    xPost:
      'Night 6: source hunt.\n\nA claim appears. Four sources. Only one is real. Train the habit of checking citations.\n\nhttps://antisemitism.hashem.faith/hanukkah/hunt',
  },
  {
    night: 7,
    unlockAt: '2026-12-10T17:30:00-07:00',
    dateLabel: 'Thu Dec 10',
    postTime: 'Early evening',
    title: 'Ask tonight\'s question',
    slug: 'ask',
    path: '/hanukkah/ask',
    blurb: 'Send a question tied to tonight\'s theme. Accounts are 13+. Progress and answers live on your profile.',
    featureKind: 'ask',
    xPost:
      'Night 7: ask a question.\n\nFree accounts track what you\'ve read and let you send a question. Accounts are for ages 13 and up.\n\nhttps://antisemitism.hashem.faith/hanukkah/ask',
  },
  {
    night: 8,
    unlockAt: '2026-12-11T15:00:00-07:00',
    dateLabel: 'Fri Dec 11',
    postTime: 'Before sundown',
    title: 'Eight-nights scrapbook',
    slug: 'scrapbook',
    path: '/hanukkah/scrapbook',
    blurb: 'All eight candles. Build a share card from the nights you finished and download it.',
    featureKind: 'scrapbook',
    xPost:
      'Night 8: the scrapbook.\n\nAll eight candles are lit. Make a share card from the nights you finished — Chag sameach.\n\nhttps://antisemitism.hashem.faith/hanukkah/scrapbook',
  },
]

export const MAP_STOPS = [
  {
    id: 'modiin',
    night: 2,
    name: 'Modi\'in',
    year: 'c. 167 BCE',
    lat: 31.89,
    lng: 35.01,
    text: 'The revolt begins in the hill country of Modi\'in when Mattathias refuses to offer pagan sacrifice and the family flees to the wilderness.',
    source: { label: '1 Maccabees 2', url: 'https://www.sefaria.org/I_Maccabees.2' },
  },
  {
    id: 'jerusalem-desecration',
    night: 2,
    name: 'Jerusalem — Temple desecrated',
    year: '167 BCE',
    lat: 31.778,
    lng: 35.235,
    text: 'Seleucid forces outlaw Jewish practice, place a pagan altar in the Temple, and make Torah possession a capital offense.',
    source: { label: 'Jewish Virtual Library: Maccabean Revolt', url: 'https://www.jewishvirtuallibrary.org/the-maccabees-jewish-virtual-library' },
  },
  {
    id: 'emmaus',
    night: 3,
    name: 'Emmaus',
    year: '165 BCE',
    lat: 31.839,
    lng: 34.989,
    text: 'Judah Maccabee defeats a larger Seleucid force near Emmaus — one of the early victories that opens the road back to Jerusalem.',
    source: { label: '1 Maccabees 4', url: 'https://www.sefaria.org/I_Maccabees.4' },
  },
  {
    id: 'temple-rededication',
    night: 4,
    name: 'Jerusalem — Temple rededicated',
    year: '164 BCE',
    lat: 31.778,
    lng: 35.235,
    text: 'The Temple is cleansed and rededicated. Tradition remembers a small cruse of pure oil lasting eight days — the origin of Hanukkah\'s lights.',
    source: { label: 'Jewish Virtual Library: Hanukkah', url: 'https://www.jewishvirtuallibrary.org/hanukkah' },
  },
  {
    id: 'beth-zur',
    night: 5,
    name: 'Beth Zur',
    year: '164 BCE',
    lat: 31.583,
    lng: 35.095,
    text: 'A fortress south of Jerusalem. Holding it helps secure Judea after the rededication.',
    source: { label: '1 Maccabees 4:29–61', url: 'https://www.sefaria.org/I_Maccabees.4' },
  },
  {
    id: 'hasmonean',
    night: 6,
    name: 'Hasmonean Judea',
    year: '142 BCE',
    lat: 31.778,
    lng: 35.235,
    text: 'Independence from the Seleucids is secured. A Jewish kingdom is restored until Roman takeover.',
    source: { label: 'Jewish Virtual Library', url: 'https://www.jewishvirtuallibrary.org/' },
  },
  {
    id: 'diaspora-light',
    night: 7,
    name: 'Lights in the diaspora',
    year: 'Tonight',
    lat: 33.45,
    lng: -112.07,
    text: 'From Judea the custom of lighting menorahs spreads with Jewish communities worldwide — including here in Phoenix tonight.',
    source: { label: 'My Jewish Learning: Hanukkah', url: 'https://www.myjewishlearning.com/article/hanukkah-101/' },
  },
  {
    id: 'today',
    night: 8,
    name: 'HaShem.Faith',
    year: '2026',
    lat: 31.778,
    lng: 35.235,
    text: 'Eight nights of new tools on this site — menorah, map, quiz, flashcards, dreidel, source hunt, questions, scrapbook.',
    source: { label: 'HaShem.Faith hub', url: '/hanukkah' },
  },
]

export const QUIZ_BY_NIGHT = {
  3: [
    {
      q: 'What does the Hebrew word Hanukkah mean?',
      options: ['Dedication', 'Victory', 'Oil', 'Light'],
      correct: 0,
      explain: 'Hanukkah means dedication — the rededication of the Temple in Jerusalem.',
      source: { label: 'My Jewish Learning', url: 'https://www.myjewishlearning.com/article/hanukkah-101/' },
    },
    {
      q: 'About when did the Maccabean revolt begin?',
      options: ['c. 167 BCE', '70 CE', '1492 CE', '1948 CE'],
      correct: 0,
      explain: 'Seleucid persecution and the revolt begin around 167 BCE.',
      source: { label: 'Jewish Virtual Library', url: 'https://www.jewishvirtuallibrary.org/the-maccabees-jewish-virtual-library' },
    },
    {
      q: 'Why do Jewish communities light candles for eight nights?',
      options: [
        'Tradition remembers the Temple oil lasting eight days',
        'There are eight books of Maccabees',
        'Roman law required it',
        'It matches the eight days of Passover',
      ],
      correct: 0,
      explain: 'The Talmud and later tradition remember a small amount of pure oil lasting eight days during the rededication.',
      source: { label: 'Jewish Virtual Library: Hanukkah', url: 'https://www.jewishvirtuallibrary.org/hanukkah' },
    },
  ],
  4: [
    {
      q: 'In Jewish usage, what does "goy" primarily mean?',
      options: ['A non-Jew / nation', 'A secret insult', 'A priest', 'A holiday'],
      correct: 0,
      explain: 'Goy means nation or people; it is the standard word for a non-Jew, not inherently a slur.',
      source: { label: 'Definitions: Goy', url: '/definitions/goy' },
    },
    {
      q: 'What is Zionism, in mainstream Jewish definition?',
      options: [
        'Jewish self-determination in the ancestral homeland',
        'A racial supremacy ideology',
        'A conspiracy to control banks',
        'A Christian missionary movement',
      ],
      correct: 0,
      explain: 'Zionism is the movement for Jewish self-determination and a national home in the land of Israel.',
      source: { label: 'Definitions: Zionism', url: '/definitions/zionism' },
    },
    {
      q: 'The IHRA working definition of antisemitism…',
      options: [
        'Describes hatred of Jews and lists contemporary examples',
        'Bans all criticism of Israeli policy',
        'Was written by the Israeli Knesset as binding law',
        'Only covers Holocaust denial',
      ],
      correct: 0,
      explain: 'IHRA defines antisemitism as a certain perception of Jews that may be expressed as hatred, with illustrative examples. Criticism of Israel like that of any other country is not antisemitic under the definition.',
      source: { label: 'Definitions: Antisemitism', url: '/definitions/antisemitism' },
    },
  ],
  5: [
    {
      q: 'When a shocking "Talmud quote" circulates online, the first check is…',
      options: [
        'Find the tractate, page, and surrounding debate',
        'Assume every quote is authentic and final law',
        'Ignore Jewish sources as biased',
        'Trust anonymous image macros',
      ],
      correct: 0,
      explain: 'The Talmud is debate literature. Isolated lines are often one side of an argument, a rejected view, or a technical category.',
      source: { label: 'Talmud section', url: '/talmud' },
    },
    {
      q: 'Does mainstream Halacha permit lying about the contents of the Torah or Talmud?',
      options: ['No — authorities forbid falsifying Torah even under threat', 'Yes, always', 'Only on Shabbat', 'Only to Romans'],
      correct: 0,
      explain: 'Authorities such as the Shlah and Yam Shel Shlomo forbid lying about Torah contents; Bava Kamma 38a shows rabbis teaching Romans the truth.',
      source: { label: 'To Tell The Truth', url: '/talmud/to-tell-the-truth' },
    },
    {
      q: 'Bava Metzia 114b\'s use of "Adam" in a ritual-impurity context…',
      options: [
        'Is a technical category — other passages call gentiles human',
        'Proves Jews view gentiles as animals',
        'Is the only Talmudic statement on the topic',
        'Appears only in medieval forgeries',
      ],
      correct: 0,
      explain: 'Other passages (Gittin 47a, Avodah Zarah 3a) include gentiles as human. The "Adam" language in 114b is about a specific ritual category.',
      source: { label: 'Gentiles Are Human', url: '/talmud/gentiles-are-human' },
    },
  ],
  6: [
    {
      q: 'Blood libel claims that Jews…',
      options: [
        'Murder non-Jews for ritual purposes — a medieval falsehood',
        'Were first documented by Roman tax records as true',
        'Are required by the Torah to use blood in Passover',
        'Only appear after 1948',
      ],
      correct: 0,
      explain: 'Blood libel is a medieval accusation with no basis in Jewish law or practice; it fueled massacres for centuries.',
      source: { label: 'Conspiracies', url: '/conspiracies' },
    },
    {
      q: 'Holocaust denial is…',
      options: [
        'A form of antisemitism that rejects overwhelming evidence',
        'A legitimate open historical debate with equal sides',
        'Only about the exact death toll within 1%',
        'Invented after 2000',
      ],
      correct: 0,
      explain: 'German documents, perpetrator testimony, demographics, and physical sites establish the genocide of European Jewry.',
      source: { label: 'Definitions: Holocaust', url: '/definitions/holocaust' },
    },
    {
      q: 'What does "ZOG" stand for in hate literature?',
      options: [
        'Zionist Occupied Government — a conspiracy myth',
        'Zionist Outreach Group — a real lobby registry',
        'Zone of Galilee — a 1948 map term',
        'Zealot Order Guard — a Second Temple militia',
      ],
      correct: 0,
      explain: 'ZOG is a white-supremacist acronym claiming Jews secretly control the U.S. government. It has no factual basis.',
      source: { label: 'Definitions: ZOG', url: '/definitions/zog' },
    },
  ],
  7: [
    {
      q: 'Reader accounts on this site are for ages…',
      options: ['13 and up', '18 and up only', 'Any age with no check', '21 and up'],
      correct: 0,
      explain: 'Sign-up requires a 13+ age screen. Birth dates are checked and not stored on the profile.',
      source: { label: 'Profile / sign-up', url: '/profile' },
    },
    {
      q: 'What can a free account track?',
      options: [
        'Reading progress per section and questions you send',
        'Other users\' private messages',
        'Payment card numbers',
        'Nothing — accounts are decorative',
      ],
      correct: 0,
      explain: 'Profiles show read/unread lists and the status of questions you submit.',
      source: { label: 'Profile', url: '/profile' },
    },
    {
      q: 'Where do questions go?',
      options: [
        'To the site operators, tied to your account when signed in',
        'Straight onto a public wall with no review',
        'Only to Instagram DMs',
        'Into an anonymous blockchain',
      ],
      correct: 0,
      explain: 'The contact form delivers questions for review; signed-in users can follow status from the profile.',
      source: { label: 'Ask tonight', url: '/hanukkah/ask' },
    },
  ],
  8: [
    {
      q: 'How many nights does this HaShem.Faith campaign run?',
      options: ['Eight', 'Seven', 'Nine', 'Twelve'],
      correct: 0,
      explain: 'Eight nights, matching Hanukkah — Dec 4 through Dec 11, 2026.',
      source: { label: 'Hanukkah hub', url: '/hanukkah' },
    },
    {
      q: 'Which new tools unlocked this week?',
      options: [
        'Menorah, map, quiz, flashcards, dreidel, hunt, ask, scrapbook',
        'Only a blog post',
        'Only Instagram filters',
        'A paywalled course',
      ],
      correct: 0,
      explain: 'Each night unlocked a different experience on antisemitism.hashem.faith/hanukkah.',
      source: { label: 'Scrapbook', url: '/hanukkah/scrapbook' },
    },
    {
      q: 'What does "Chag sameach" mean?',
      options: ['Happy holiday', 'Good Sabbath', 'Next year in Jerusalem only', 'Thank you'],
      correct: 0,
      explain: 'A common Hebrew greeting for festivals: happy holiday.',
      source: { label: 'My Jewish Learning', url: 'https://www.myjewishlearning.com/article/hanukkah-101/' },
    },
  ],
}

export const DREIDEL_ROUNDS = [
  {
    claim: 'Jews must give only a false explanation of the Talmud to outsiders.',
    choices: [
      { label: 'A forged / fringe line twisted into a standing order to lie', correct: true },
      { label: 'Universal Halacha that requires lying every day', correct: false },
      { label: 'A Roman tax statute', correct: false },
    ],
    explain:
      'The "Libbre David" style claim is not mainstream law. Authorities forbid falsifying Torah; Bava Kamma 38a shows rabbis teaching Romans the truth.',
    href: '/talmud/to-tell-the-truth',
  },
  {
    claim: 'The Talmud teaches that only Jews are human.',
    choices: [
      { label: 'A misread of a ritual-category debate; other passages call gentiles human', correct: true },
      { label: 'The single uncontested dogma of all Judaism', correct: false },
      { label: 'A quote from the U.S. Constitution', correct: false },
    ],
    explain: 'Bava Metzia 114b is technical. Gittin 47a and Avodah Zarah 3a treat gentiles as human.',
    href: '/talmud/gentiles-are-human',
  },
  {
    claim: 'Jewish law permits stealing from gentiles.',
    choices: [
      { label: 'False — theft is forbidden; return of lost property is often required', correct: true },
      { label: 'True for all commerce after sunset', correct: false },
      { label: 'True only in leap years', correct: false },
    ],
    explain: 'The Yerushalmi and codes require returning Gentile lost property in most cases; stealing is prohibited.',
    href: '/talmud/stealing-from-gentiles',
  },
  {
    claim: 'Kol Nidrei lets Jews break promises to non-Jews.',
    choices: [
      { label: 'False — it concerns personal vows, not promises to other people', correct: true },
      { label: 'True for business contracts', correct: false },
      { label: 'True for courtroom oaths only', correct: false },
    ],
    explain: 'Shulchan Aruch and Maimonides: vows involving another person cannot be annulled behind their back.',
    href: '/talmud/kol-nidrei',
  },
]

export const HUNT_ROUNDS = [
  {
    claim: 'Six million Jews were murdered in the Holocaust.',
    correct: { label: 'USHMM / Yad Vashem demographic & documentary consensus', url: 'https://www.ushmm.org/learn/holocaust' },
    decoys: [
      { label: 'Anonymous 4chan meme collage (no archive)', url: '#' },
      { label: 'A blog that cites only itself', url: '#' },
      { label: 'A quote attributed to "a friend who knows"', url: '#' },
    ],
  },
  {
    claim: 'Zionism is Jewish self-determination in the ancestral homeland.',
    correct: { label: 'ADL backgrounder: What is Zionism?', url: 'https://www.adl.org/resources/backgrounder/what-zionism' },
    decoys: [
      { label: 'A telegram channel with no author', url: '#' },
      { label: 'A parody account screenshot', url: '#' },
      { label: 'An unsourced Instagram carousel', url: '#' },
    ],
  },
  {
    claim: 'The UN revoked the "Zionism is racism" resolution in 1991.',
    correct: { label: 'UNGA Resolution 46/86', url: 'https://undocs.org/A/RES/46/86' },
    decoys: [
      { label: 'A fabricated "UN memo" PDF with no undocs link', url: '#' },
      { label: 'A tweet saying "everyone knows"', url: '#' },
      { label: 'A satirical Onion-style headline taken as fact', url: '#' },
    ],
  },
  {
    claim: 'Goy / goyim means nation(s); it is the ordinary word for non-Jew.',
    correct: { label: 'My Jewish Learning: Goy', url: 'https://www.myjewishlearning.com/article/goy/' },
    decoys: [
      { label: 'A dictionary entry invented in a meme', url: '#' },
      { label: 'A podcast transcript with no Hebrew citation', url: '#' },
      { label: 'A chain email from 2003', url: '#' },
    ],
  },
]

export const ASK_PROMPTS = [
  'What part of the Hanukkah story do you still have questions about?',
  'Which word from the definitions page do you want explained more clearly?',
  'What Talmud claim have you seen online that you want sourced?',
  'What myth or conspiracy should we cover next?',
]
