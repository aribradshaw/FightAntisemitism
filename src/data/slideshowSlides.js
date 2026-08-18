/**
 * Later slideshow chapters, from imperial conquest through Jewish life today.
 * Chapter one is defined separately in slideshowChapterOne.js.
 */

export const SLIDESHOW_SOURCES = [
  {
    label: 'A Two-Page History of the Jewish People',
    url: 'https://history.as.uky.edu/two-page-history-jewish-people',
    note: 'University of Kentucky College of Arts & Sciences, broad chronology',
  },
  {
    label: 'The Eastern Mediterranean and Syria, 1000 BCE–1 CE',
    url: 'https://www.metmuseum.org/toah/ht/04/wae.html',
    note: 'The Metropolitan Museum of Art, Heilbrunn Timeline of Art History',
  },
  {
    label: 'The Cyrus Cylinder and Ancient Persia',
    url: 'https://www.metmuseum.org/exhibitions/listings/2013/cyrus-cylinder',
    note: 'The Metropolitan Museum of Art on Persian rule and return from exile',
  },
  {
    label: 'Introduction to Judaism',
    url: 'https://encyclopedia.ushmm.org/content/en/article/introduction-to-judaism',
    note: 'United States Holocaust Memorial Museum',
  },
  {
    label: 'Introduction to the Holocaust',
    url: 'https://encyclopedia.ushmm.org/content/en/article/introduction-to-the-holocaust',
    note: 'United States Holocaust Memorial Museum',
  },
]

export const SLIDES = [
  {
    timelineYear: 500,
    chapter: 'Judaism transformed',
    eyebrow: 'Rabbinic Judaism',
    title: 'A tradition carried in words',
    paragraphs: [
      'Between roughly 200 and 600 CE, generations of rabbis compiled the Mishnah and the two Talmuds.',
      'Their debates shaped Jewish law, ethics, ritual, and learning. Major centers flourished in the land of Israel and Babylonia.',
    ],
  },
  {
    timelineYear: 1100,
    chapter: 'Jewish worlds',
    eyebrow: 'Across the Mediterranean',
    title: 'Sephardi life and culture',
    paragraphs: [
      'Jewish communities in Iberia lived under changing Muslim and Christian rulers, producing influential poetry, philosophy, science, and religious scholarship.',
      'The term Sephardi comes from the Hebrew name for Spain and later described communities whose traditions spread across North Africa, the Ottoman world, and beyond.',
    ],
  },
  {
    timelineYear: 1200,
    chapter: 'Jewish worlds',
    eyebrow: 'Northern and central Europe',
    title: 'Ashkenazi communities',
    paragraphs: [
      'Jewish communities developed distinct religious customs and the Yiddish language across northern and central Europe.',
      'They built durable institutions while facing legal restrictions, expulsions, blood libels, and periodic violence, including massacres during the Crusades.',
    ],
  },
  {
    timelineYear: 1492,
    chapter: 'Expulsion and renewal',
    eyebrow: 'The Alhambra Decree',
    title: 'Expelled from Spain',
    paragraphs: [
      'In 1492, the Spanish monarchy ordered practicing Jews to convert or leave. Portugal imposed forced conversion several years later.',
      'Sephardi refugees rebuilt communities in the Ottoman Empire, North Africa, Italy, the Netherlands, and the Americas.',
    ],
  },
  {
    timelineYear: 1789,
    chapter: 'Emancipation',
    eyebrow: 'Citizenship and modernity',
    title: 'New rights, new questions',
    paragraphs: [
      'From the late eighteenth century, Jews in parts of Europe gradually gained civil and political rights.',
      'Emancipation opened public life while raising difficult questions about assimilation, religious reform, community authority, and national belonging.',
    ],
  },
  {
    timelineYear: 1881,
    chapter: 'Migration',
    eyebrow: 'A world in motion',
    title: 'Millions build new homes',
    paragraphs: [
      'Pogroms, poverty, and political repression drove mass Jewish migration from the Russian Empire and eastern Europe between the 1880s and the First World War.',
      'Most went to the United States. Others moved within Europe, to Latin America, South Africa, and to Ottoman Palestine.',
    ],
  },
  {
    timelineYear: 1897,
    chapter: 'Zionism',
    eyebrow: 'A modern national movement',
    title: 'The call for self-determination',
    paragraphs: [
      'Modern political Zionism emerged in nineteenth-century Europe amid nationalism, emancipation, and persistent antisemitism.',
      'Zionists disagreed about religion, culture, economics, and politics, but shared the goal of renewing Jewish collective life in the ancestral homeland.',
    ],
  },
  {
    timelineYear: 1933,
    chapter: 'The Holocaust',
    eyebrow: 'Nazi persecution',
    title: 'Rights stripped away',
    paragraphs: [
      'After taking power in 1933, Nazi Germany excluded Jews from public life, stripped them of citizenship, seized property, and drove hundreds of thousands to seek refuge abroad.',
      'Germany’s invasion of Poland in 1939 placed millions more Jews under Nazi rule and began a war that enabled increasingly radical persecution.',
    ],
  },
  {
    timelineYear: 1942,
    chapter: 'The Holocaust',
    eyebrow: 'Systematic mass murder',
    title: 'Six million lives',
    paragraphs: [
      'Nazi Germany and its allies and collaborators murdered six million Jews through mass shootings, ghettos, starvation, forced labor, and killing centers.',
      'The Holocaust destroyed centuries-old communities across Europe. Survivors carried their histories into new lives around the world.',
    ],
  },
  {
    timelineYear: 1948,
    chapter: 'Statehood',
    eyebrow: 'Israel declares independence',
    title: 'A Jewish state, a regional war',
    paragraphs: [
      'In 1947, the United Nations proposed partitioning British-ruled Palestine into Jewish and Arab states. Jewish leaders accepted the plan; Arab leaders rejected it.',
      'Israel declared independence on May 14, 1948. War secured the new state and displaced a large Palestinian population, beginning a conflict that remains unresolved.',
    ],
  },
  {
    timelineYear: new Date().getFullYear(),
    chapter: 'Jewish life today',
    eyebrow: 'One people, many communities',
    title: 'The story is still being written',
    paragraphs: [
      'More than 15 million Jews live around the world today, with the largest communities in Israel and the United States.',
      'Jewish life spans many languages, ethnic backgrounds, religious practices, political views, and cultural traditions, connected by overlapping histories and an enduring conversation about identity.',
    ],
  },
]
