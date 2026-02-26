import { useParams } from 'react-router-dom'
import { MISCONCEPTION_SOURCES, HASHEM_FAITH_LABEL } from '../data/hashemFaithSources'

const TOPIC_CONTENT = {
  israel: {
    title: 'Israel',
    body: (
      <>
        <p><strong>“Israel is a colonial project.”</strong> Jews have had a continuous presence in the land for millennia. Modern Zionism sought self-determination in the ancestral homeland after persecution in Europe and elsewhere. The state was established with international recognition (UN 1947–48). Calling it “colonial” erases Jewish indigeneity and history.</p>
        <p><strong>“Israel has no right to exist.”</strong> Israel is a sovereign state and a member of the UN. Denying only the Jewish state’s right to exist, while accepting others, is a form of antisemitism (see IHRA definition).</p>
        <p><strong>“Israel is committing genocide.”</strong> As covered in Definitions, genocide requires intent to destroy a group. Israel is fighting Hamas; its aim is not to eliminate Palestinians as a people. Casualties of war are not by themselves genocide.</p>
        <p>The name "Israel" and its biblical and historical meaning are explained in depth at Hashem.Faith.</p>
      </>
    ),
  },
  talmud: {
    title: 'The Talmud',
    body: (
      <>
        <p><strong>“The Talmud says X about non-Jews.”</strong> The Talmud is a vast legal and narrative corpus. Isolated lines are often taken out of context, mistranslated, or from passages that are debated or obsolete. Serious understanding requires scholarship and context.</p>
        <p><strong>“The Talmud is secret or evil.”</strong> The Talmud is studied openly and is the basis of Jewish law and tradition. Antisemites have long weaponized fake or distorted “quotes” to portray Jews as hostile to non-Jews.</p>
        <p>Hashem.Faith addresses myths that the Talmud commands lying, dehumanizes gentiles, or is hostile to Christianity—with citations and context.</p>
      </>
    ),
  },
  'jewish-race': {
    title: 'The Jewish “Race”',
    body: (
      <>
        <p><strong>“Are Jews a race?”</strong> Jews are an ethnoreligious group. Identity is passed through family and community; there is genetic diversity but also shared ancestry among many Jews. Nazis racialized Jews to justify genocide; today, many Jews identify as both an ethnicity and a religion.</p>
        <p><strong>“Jews are white / not white.”</strong> Jewish identity predates modern racial categories. Jews have been classified differently in different times and places. Reducing Jews to a single “race” ignores this history and diversity.</p>
        <p>Hashem.Faith discusses whether Judaism is a religion or race, where gentiles fit in the Jewish worldview, and refutes the myth that Jewish texts dehumanize non-Jews.</p>
      </>
    ),
  },
  conspiracy: {
    title: 'Conspiracy Theories',
    body: (
      <>
        <p><strong>“Jews control the media / banks / government.”</strong> Classic antisemitic conspiracy with no evidence. It has been used for centuries to blame Jews for societal problems and to justify violence.</p>
        <p><strong>“The Holocaust didn’t happen” or “was exaggerated.”</strong> Holocaust denial is false and antisemitic. The evidence—documentation, testimony, sites—is overwhelming.</p>
        <p><strong>“Israel did 9/11” or “Jews knew in advance.”</strong> Baseless conspiracy theories that recycle antisemitic tropes about Jewish power and malice.</p>
        <p>The claim that "the Jews killed Jesus" and conspiracy narratives about Jewish lobbying (e.g. AIPAC/FARA) are addressed with historical and legal context at Hashem.Faith.</p>
      </>
    ),
  },
}

export default function MisconceptionTopic() {
  const { topic } = useParams()
  const content = topic ? TOPIC_CONTENT[topic] : null

  if (!content) {
    return (
      <div className="misconception-topic">
        <p>Topic not found.</p>
      </div>
    )
  }

  const furtherReading = topic ? MISCONCEPTION_SOURCES[topic] : null

  return (
    <div className="misconception-topic">
      <h1>{content.title}</h1>
      <div className="misconception-body">{content.body}</div>
      {furtherReading && furtherReading.length > 0 && (
        <section className="misconception-sources" aria-label="Further reading">
          <h2>Further reading</h2>
          <p className="misconception-sources-attribution">From <a href="https://hashem.faith/" target="_blank" rel="noopener noreferrer">{HASHEM_FAITH_LABEL}</a>:</p>
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
