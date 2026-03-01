/**
 * Slideshow content: early Jews through modern history.
 * Primary source: A Two-Page History of the Jewish People (University of Kentucky).
 * @see https://history.as.uky.edu/two-page-history-jewish-people
 */

export const SLIDESHOW_SOURCES = [
  {
    label: 'A Two-Page History of the Jewish People',
    url: 'https://history.as.uky.edu/two-page-history-jewish-people',
    note: 'University of Kentucky College of Arts & Sciences, Department of History',
  },
  {
    label: 'Abraham and the Angels (Aert de Gelder)',
    url: 'https://en.wikipedia.org/wiki/Abraham_and_the_Angels_(De_Gelder)',
    note: 'Intro slide image',
  },
  {
    label: "Abraham's Journey and the Exodus (map)",
    url: 'https://www.britannica.com',
    note: 'Encyclopædia Britannica, Inc.',
  },
  {
    label: 'Book of Genesis, Joseph and his brothers (Bible Illustrations by Sweet Media)',
    url: 'https://en.wikipedia.org/wiki/Joseph_(Genesis)',
    note: 'Egypt slide image',
  },
]

/** Content slides (after intro slide 0 and map slide 1). Each needs: timelineYear, title, paragraphs. */
export const SLIDES = [
  {
    timelineYear: -1250,
    title: 'Exodus and the Land',
    paragraphs: [
      'Around 1250 BCE, the Israelites left Egypt and became established in the region of Palestine.',
      'Their story—Exodus, covenant, and settlement in the land that would become the kingdom of Israel—shapes Jewish identity and tradition to this day.',
    ],
  },
  {
    timelineYear: -900,
    title: 'Kingdom and First Temple',
    paragraphs: [
      'By about 900 BCE, an Israelite kingdom had its capital at Jerusalem. The First Temple was built there.',
      'Jerusalem became the spiritual and political center of the Israelite people.',
    ],
  },
  {
    timelineYear: -586,
    title: 'Destruction and Rebuild',
    paragraphs: [
      'In 586 BCE, the First Temple was destroyed. It was rebuilt in the next century.',
      'Exile and return deepened the focus on law, text, and community that would define Judaism.',
    ],
  },
  {
    timelineYear: -400,
    title: 'The Hebrew Bible',
    paragraphs: [
      'After 400 BCE, the text of the Jewish Bible (the Hebrew Bible, or what Christianity calls the Old Testament) reached its final form.',
      'Much of it had been composed earlier. It became the foundation of Jewish life and later of Christianity and Western culture.',
    ],
  },
  {
    timelineYear: 70,
    title: 'Second Temple Destroyed',
    paragraphs: [
      'In 70 CE, the Romans destroyed the Second Temple. The Jewish state in the land of Israel came to an end until 1948.',
      'Jews remained in settlements throughout the Roman Empire, beginning a long diaspora.',
    ],
  },
  {
    timelineYear: 400,
    title: 'Talmudic Period',
    paragraphs: [
      'From about 200 to 700 CE, rabbinic Judaism took shape. Orthodox Jewish law was written down in the Talmud.',
      'The main center of Jewish life was in Babylonia (present-day Iraq).',
    ],
  },
  {
    timelineYear: 1200,
    title: 'Sephardim and Spain',
    paragraphs: [
      'From about 900 to 1492, Spain became a main center of Jewish life. Spanish Jews are known as Sephardim.',
      'A wealthy community integrated into both Muslim and Christian Spanish society until Ferdinand and Isabella expelled all Jews in 1492. Sephardi Jews took refuge in the Ottoman Empire and North Africa.',
    ],
  },
  {
    timelineYear: 1400,
    title: 'Ashkenazim and the Jewish Middle Ages',
    paragraphs: [
      'From about 1000 to 1770, the "Jewish Middle Ages" in northern and central Europe. Jews there, known as Ashkenazim, led a precarious existence—tolerated but confined to certain occupations and special taxes.',
      'They developed Yiddish. They suffered periodic violence, especially during the First Crusades (around 1100) and the Black Death (1347–48). Mainz, Worms, and Speyer are remembered as the "three cities of martyrdom." Jews were expelled from England in 1290, from France in 1306. Many found refuge in Poland, which became the largest Jewish center. Hasidism began in southern Poland around 1740.',
    ],
  },
  {
    timelineYear: 1820,
    title: 'Age of Emancipation',
    paragraphs: [
      'From 1770 to 1870, small Jewish communities in western Europe and North America gained legal and civil rights, often in exchange for giving up special communal privileges.',
      'Jews sought assimilation. The Jewish Enlightenment (Haskalah) criticized traditional religion and culture and called for Jews to adopt Hebrew and national languages alongside or instead of Yiddish.',
    ],
  },
  {
    timelineYear: 1900,
    title: 'Migration and Zionism',
    paragraphs: [
      'From 1870 to 1933, rapid change. Persecution in the Russian Empire drove mass migration of Eastern European Jews to the United States and western Europe (1880–1914). The American Jewish community became the world’s largest.',
      'Rising antisemitism in Europe sparked the Zionist movement (1896), aimed at a Jewish homeland in Palestine. The Balfour Declaration (1917) endorsed the idea. Small Jewish settlements grew in Palestine from the 1880s. In the U.S., the 1924 immigration law was designed to cut off new arrivals. Jews in eastern Europe were drawn to Zionism, socialism, and Communism.',
    ],
  },
  {
    timelineYear: 1938,
    title: 'Nazi Rise and Persecution',
    paragraphs: [
      'In 1933, Hitler came to power in Germany and imposed harsh restrictions on Jews. Jews were deprived of citizenship and forbidden to marry non-Jews (1935); synagogues were destroyed and Jewish businesses confiscated (1938).',
      'In 1939, World War II began. Germany’s occupation of Poland placed the largest European Jewish community under Nazi control.',
    ],
  },
  {
    timelineYear: 1942,
    title: 'The Holocaust',
    paragraphs: [
      'In 1941, Germany invaded the Soviet Union. Large-scale massacres of Jews began.',
      'In 1942, death camps opened in eastern Europe. By 1945, Jewish casualties in the Holocaust were estimated at between 5 and 6 million; about 100,000 survivors were found in German camps.',
    ],
  },
  {
    timelineYear: 1948,
    title: 'Partition and Israel',
    paragraphs: [
      'In 1947, the United Nations voted to partition Palestine into Jewish and Arab states.',
      'On 14 May 1948, Israel declared independence. Victory in war against invading Arab armies secured the new state but created a Palestinian refugee population.',
    ],
  },
  {
    timelineYear: 1975,
    title: 'Wars, Trials, and Peace',
    paragraphs: [
      '1961: The Eichmann trial in Israel publicized the Holocaust. 1967: The Six-Day War; Israel gained control of the West Bank, Gaza, and Sinai. U.S. Jews identified more closely with Israel; Soviet Jews faced intensified harassment.',
      '1973: The Yom Kippur War. 1979: Camp David—first peace treaty between Israel and an Arab state (Egypt). The American TV miniseries Holocaust sparked debate in Germany.',
    ],
  },
  {
    timelineYear: 1995,
    title: 'After the Cold War',
    paragraphs: [
      '1989–91: The collapse of the Soviet Union allowed many Jews from the world’s third-largest Jewish community to emigrate to Israel, the U.S., and western Europe.',
      '1993: The U.S. Holocaust Memorial Museum opened; the Oslo agreement between Israel and the Palestinians raised hopes for peace. 2000: Oslo broke down; a new cycle of Israeli–Palestinian violence began. The first openly Jewish major-party candidate ran for U.S. vice president.',
    ],
  },
  {
    timelineYear: new Date().getFullYear(),
    title: 'Jewish Life Today',
    paragraphs: [
      'Centers of Jewish life today: approximately 5 million Jews in the U.S., 4.5 million in Israel, 1–2 million in the former Soviet Union, about 500,000 in France, 60,000 in Germany, and about 8,000 in Poland.',
      'A people that began with Abraham in the land we today call Israel has endured exile, diaspora, persecution, and rebirth—and remains a central thread in world history.',
    ],
  },
]
