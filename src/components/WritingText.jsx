/**
 * Word-by-word text reveal: each word fades in and slides up with staggered delay.
 * Use for hero lines, quotes, or any measured text entrance (writing-style).
 */
const DEFAULT_STAGGER_MS = 80

export function WritingWord({ children, index = 0, staggerMs = DEFAULT_STAGGER_MS }) {
  const delaySec = (index * staggerMs) / 1000
  return (
    <span
      className="writing-word"
      style={{ animationDelay: `${delaySec}s` }}
    >
      {children}
    </span>
  )
}

export default function WritingText({ children, staggerMs = DEFAULT_STAGGER_MS, startIndex = 0, className = '' }) {
  if (typeof children !== 'string') return children
  const words = children.trim().split(/\s+/)
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <WritingWord index={startIndex + i} staggerMs={staggerMs}>
            {word}
          </WritingWord>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  )
}
