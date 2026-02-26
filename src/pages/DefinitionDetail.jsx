import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { DEFINITIONS } from '../data/definitions'
import { DEFINITION_SOURCES, HASHEM_FAITH_LABEL } from '../data/hashemFaithSources'
import GenocideInteractive from '../components/GenocideInteractive'

const CONTENT = {
  jew: {
    title: 'Jew',
    body: (
      <>
        <p>A Jew is someone who belongs to the Jewish people—either by religion (Judaism), ancestry, or both. Judaism is both an ethnoreligion and a tradition. Many Jews identify as a people or nation (am Yisrael) as well as a religion.</p>
        <p>Conversion to Judaism is possible; converts are fully Jewish. Jewish identity has been passed down for millennia through family and community, often in the face of persecution.</p>
        <p>Questions like whether Judaism is a religion or a race, or whether “Jewish” refers to a language (Hebrew or Yiddish), are addressed in depth at <a href="https://hashem.faith/is-judaism-a-religion-or-race/" target="_blank" rel="noopener noreferrer">Hashem.Faith</a> with sourced explanations.</p>
      </>
    ),
  },
  talmud: {
    title: 'Talmud',
    body: (
      <>
        <p>The Talmud is the central text of Rabbinic Judaism—comprising the Mishnah (oral law, redacted around 200 CE) and the Gemara (commentaries and discussions). It is not a single book but a vast body of law, narrative, and debate.</p>
        <p>It is often misquoted or taken out of context by antisemites. Understanding it requires study and context; isolated quotes are easily weaponized.</p>
        <p>Common antisemitic myths—that the Talmud is “more holy” than the Bible, that Jews are commanded to lie about it, that it dehumanizes gentiles or attacks Christianity—are refuted with primary-source context in articles at <a href="https://hashem.faith/what-is-the-talmud/" target="_blank" rel="noopener noreferrer">Hashem.Faith</a>.</p>
      </>
    ),
  },
  genocide: {
    title: 'Genocide',
    body: null, // uses GenocideInteractive component
  },
  antisemitism: {
    title: 'Antisemitism',
    body: (
      <>
        <p>Antisemitism is prejudice, hatred, or discrimination against Jews as Jews. The term was coined in the 19th century but the phenomenon is ancient. It includes stereotypes, conspiracy theories, denial of Jewish rights (including to a state), and violence.</p>
        <p>The IHRA working definition is widely used for identifying antisemitism in policy and education.</p>
        <p>Claims that groups like AIPAC should register as “foreign agents” (FARA) often overlap with conspiracy tropes; <a href="https://hashem.faith/should-aipac-be-registered-under-fara/" target="_blank" rel="noopener noreferrer">Hashem.Faith</a> examines the legal and factual basis for such claims.</p>
      </>
    ),
  },
  zionism: {
    title: 'Zionism',
    body: (
      <>
        <p>Zionism is the movement for Jewish self-determination and a national home in the ancestral homeland, Israel. Modern political Zionism emerged in the late 19th century in response to antisemitism and the desire for a sovereign Jewish state.</p>
        <p>Support for Israel’s right to exist is not “colonialism”; Jewish ties to the land are ancient and continuous.</p>
        <p>The meaning of the name “Israel” and its biblical and historical significance are explored at Hashem.Faith.</p>
      </>
    ),
  },
  agitprop: {
    title: 'Agitprop',
    body: (
      <>
        <p>Agitprop (from “agitation” + “propaganda”) is political messaging designed to agitate and mobilize people rather than to inform. It uses slogans, imagery, and one-sided framing to provoke strong emotion and action. The term has Soviet origins; the techniques are still used to spread antisemitic and anti-Israel narratives.</p>
        <p>Common tactics include false historical claims (e.g. that Israel was “founded upon the mass displacement of Palestinians” while ignoring the 1948 war launched by Arab armies, the Balfour Declaration, and UN partition); the apartheid/Bantustan libel (false analogies to South African Bantustans when the legal and historical context is entirely different); and one-sided “peace” rhetoric that demands only Israeli concessions while ignoring Palestinian rejectionism and Hamas’s charter.</p>
        <p>As Simon Plosker wrote in HonestReporting, opinion pieces that present themselves as critique can be “thinly veiled attack[s] on Israel” full of “anti-Israel propaganda and falsehoods.” South African DIRCO’s posture at the ICJ has been described as a “descent into what eerily looks like old Soviet Agitprop”—misusing terms like apartheid, colonialism, and genocide while ignoring South Africa’s own failure to arrest Omar al-Bashir for genocide, and Hamas’s atrocities and rejection of international law.</p>
        <p>The “genocide” charge against Israel has a long agitprop pedigree: it originated with Soviet propagandists after 1967, resurfaced at Durban 2001, was amplified by Norman Finkelstein and others, and has been codified in resolutions and media headlines that present Potemkin consensus rather than sober legal or factual analysis. Recognizing agitprop helps you separate emotional manipulation and one-sided narrative from factual argument and international law.</p>
      </>
    ),
  },
  goy: {
    title: 'Goy',
    body: (
      <>
        <p><em>Goy</em> (Hebrew גוי, plural <em>goyim</em>) is the Hebrew and Yiddish word for a non-Jew—equivalent to "gentile" in English. It literally means "nation" or "people" and in Jewish usage is neutral, not derogatory.</p>
        <p>Antisemites sometimes claim that Jews use the word to demean non-Jews. In Jewish texts and everyday speech, <em>goy</em> is simply the term for someone who is not Jewish. <a href="https://hashem.faith/gentiles-are-human/" target="_blank" rel="noopener noreferrer">Hashem.Faith</a> has articles on how gentiles are viewed in Jewish tradition.</p>
      </>
    ),
  },
  israel: {
    title: 'Israel',
    body: (
      <>
        <p>The name “Israel” comes from the Hebrew Bible. In Genesis 32:29, Jacob—the third patriarch—wrestles with a divine being and is given a new name: “Your name will no longer be Jacob, but Israel, for you have struggled with God and with humans and have prevailed.” The Hebrew <em>Yisrael</em> combines <em>sarah</em> (to strive or struggle) and <em>El</em> (God): “one who struggles with God.” That name was passed to the nation descended from him: the Israelites, the Jewish people.</p>
        <p>Jacob’s life was marked by struggle: with his brother Esau, with his father-in-law Laban, and in that night with the angel. He emerges from each encounter changed. Jewish tradition treats the name Israel as a definition of the people: not as those who have won, but as those who strive—with God, with others, and with themselves. The emphasis is on the wrestling, not the outcome. As commentators like Rabbi Leibel Eiger (in <em>Torat Emet</em>, on the portion Vayishlach) stress, the essence of Israel is the act of grappling: pursuing goodness, justice, and moral growth in this world, regardless of whether the struggle ends in triumph. Judaism does not rest on a promise of serenity or a guaranteed happy ending; it values the effort and the commitment to improve.</p>
        <p>That ethos runs through Jewish history and the modern State of Israel. From ancient kingdoms and exile to statehood and its challenges, the Jewish people have faced external threats, internal debate, and spiritual and moral questions. The name Israel captures this: a people and a place defined by resilience and by the refusal to accept the world as it is without working to make it better.</p>
        <p>So Israel is more than a country or a label. It is an identity and a mission: to strive for truth and righteousness, to wrestle with hard questions, and to keep engaging with the world rather than turning away. For more on the biblical and historical meaning of the name, see <a href="https://hashem.faith/what-does-israel-mean/" target="_blank" rel="noopener noreferrer">Hashem.Faith</a>.</p>
      </>
    ),
  },
  zog: {
    title: 'ZOG',
    body: (
      <>
        <p>ZOG stands for "Zionist Occupied Government." It is a conspiracy term used by white supremacists and antisemites to claim that Jews secretly control the U.S. government—and by extension, media, finance, and culture.</p>
        <p>There is no evidence for this. The idea recycles centuries-old antisemitic conspiracy myths.</p>
      </>
    ),
  },
  holocaust: {
    title: 'Holocaust',
    body: (
      <>
        <p>The Holocaust (Hebrew <em>Shoah</em>) was the systematic genocide of European Jewry by Nazi Germany and its collaborators, roughly 1933–1945. Approximately six million Jews were murdered—two-thirds of European Jewry.</p>
        <p>Holocaust denial or minimization is antisemitic. The evidence—documentation, testimony, sites, and scholarship—is overwhelming.</p>
      </>
    ),
  },
  'axis-of-evil': {
    title: 'Axis of Evil',
    body: (
      <>
        <p>"Axis of Evil" was a phrase used by U.S. President George W. Bush in 2002 to describe governments that sponsor terrorism: Iraq, Iran, and North Korea.</p>
        <p>The term is sometimes misused in antisemitic or anti-Israel rhetoric to suggest that Israel or "Zionists" are part of a global evil conspiracy.</p>
      </>
    ),
  },
  fara: {
    title: 'FARA',
    body: (
      <>
        <p>FARA is the U.S. Foreign Agents Registration Act. It requires people and groups acting as agents of foreign principals to register and disclose their activities.</p>
        <p>Antisemitic rhetoric often demands that pro-Israel advocacy groups (e.g. AIPAC) register under FARA, implying they are "foreign agents." <a href="https://hashem.faith/should-aipac-be-registered-under-fara/" target="_blank" rel="noopener noreferrer">Hashem.Faith</a> examines whether such groups fall under the law.</p>
      </>
    ),
  },
  torah: {
    title: 'Torah',
    body: (
      <>
        <p>The Torah is the first five books of the Hebrew Bible: Genesis, Exodus, Leviticus, Numbers, and Deuteronomy. It is the foundational scripture of Judaism.</p>
        <p>In broader Jewish usage, "Torah" can mean the entire body of Jewish teaching and law, including the Talmud. The Torah is read in synagogue and studied as the core of Jewish life.</p>
      </>
    ),
  },
  tanakh: {
    title: 'Tanakh',
    body: (
      <>
        <p>The Tanakh is the Hebrew Bible—the canonical scripture of Judaism. The name is an acronym: <strong>T</strong>orah (Teaching), <strong>N</strong>evi'im (Prophets), and <strong>K</strong>etuvim (Writings).</p>
        <p>It corresponds to what Christianity calls the Old Testament. The Tanakh is the written foundation of Jewish belief and practice.</p>
      </>
    ),
  },
}

function DefinitionDetail() {
  const { slug } = useParams()
  const [showLong, setShowLong] = useState(false)
  const def = DEFINITIONS.find((d) => d.slug === slug)
  const content = slug ? CONTENT[slug] : null

  if (!def || !content) {
    return (
      <div className="definition-detail">
        <p>Definition not found.</p>
      </div>
    )
  }

  const furtherReading = DEFINITION_SOURCES[slug]
  const hasLong = content.body != null || slug === 'genocide'

  return (
    <div className={`definition-detail ${hasLong ? 'definition-detail--expanded' : ''}`}>
      <div className="definition-detail-inner">
        <h1>{content.title}</h1>
        <p className="definition-short">{def.summary}</p>
        {hasLong && (
          <>
            <button
              type="button"
              className="definition-toggle primary"
              onClick={() => setShowLong((v) => !v)}
              aria-expanded={showLong}
            >
              {showLong ? 'Show less' : 'Read full definition'}
            </button>
            <div className={`definition-long-collapse ${showLong ? 'definition-long-collapse--open' : ''}`} aria-hidden={!showLong}>
              <div className="definition-long-collapse-inner">
                <div className="definition-long">
                  {slug === 'genocide' ? (
                    <GenocideInteractive />
                  ) : (
                    <div className="definition-body">{content.body}</div>
                  )}
                  {furtherReading && furtherReading.length > 0 && (
                    <section className="definition-sources" aria-label="Further reading">
                      <h2>Further reading</h2>
                      {slug !== 'agitprop' && (
                        <p className="definition-sources-attribution">From <a href="https://hashem.faith/" target="_blank" rel="noopener noreferrer">{HASHEM_FAITH_LABEL}</a>:</p>
                      )}
                      <ul>
                        {furtherReading.map((s) => (
                          <li key={s.url}>
                            <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DefinitionDetail
