import { useParams, Link } from 'react-router-dom'
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
        <p>Questions like whether Judaism is a religion or a race, or whether “Jewish” refers to a language (Hebrew or Yiddish), are addressed in depth at Hashem.Faith with sourced explanations.</p>
      </>
    ),
  },
  talmud: {
    title: 'Talmud',
    body: (
      <>
        <p>The Talmud is the central text of Rabbinic Judaism—comprising the Mishnah (oral law, redacted around 200 CE) and the Gemara (commentaries and discussions). It is not a single book but a vast body of law, narrative, and debate.</p>
        <p>It is often misquoted or taken out of context by antisemites. Understanding it requires study and context; isolated quotes are easily weaponized.</p>
        <p>Common antisemitic myths—that the Talmud is “more holy” than the Bible, that Jews are commanded to lie about it, that it dehumanizes gentiles or attacks Christianity—are refuted with primary-source context in articles at Hashem.Faith.</p>
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
        <p>Claims that groups like AIPAC should register as “foreign agents” (FARA) often overlap with conspiracy tropes; Hashem.Faith examines the legal and factual basis for such claims.</p>
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
        <p>Agitprop (from “agitation” + “propaganda”) is political messaging designed to agitate and mobilize people rather than to inform. It uses slogans, imagery, and one-sided framing to provoke strong emotion and action.</p>
        <p>Antisemitic and anti-Israel narratives are often spread through agitprop: memes, chants, and distorted claims that bypass critical thinking. Recognizing agitprop helps you separate emotional manipulation from factual argument.</p>
      </>
    ),
  },
}

export default function DefinitionDetail() {
  const { slug } = useParams()
  const def = DEFINITIONS.find((d) => d.slug === slug)
  const content = slug ? CONTENT[slug] : null

  if (!def || !content) {
    return (
      <div className="definition-detail">
        <p>Definition not found.</p>
        <Link to="/definitions">Back to Definitions</Link>
      </div>
    )
  }

  const furtherReading = DEFINITION_SOURCES[slug]

  return (
    <div className="definition-detail">
      <Link to="/definitions" className="definition-back">← Back to Definitions</Link>
      <h1>{content.title}</h1>
      {slug === 'genocide' ? (
        <GenocideInteractive />
      ) : (
        <div className="definition-body">{content.body}</div>
      )}
      {furtherReading && furtherReading.length > 0 && (
        <section className="definition-sources" aria-label="Further reading">
          <h2>Further reading</h2>
          <p className="definition-sources-attribution">From <a href="https://hashem.faith/" target="_blank" rel="noopener noreferrer">{HASHEM_FAITH_LABEL}</a>:</p>
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
  )
}
