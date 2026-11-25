export default function Menorah({ litNights = [], unlockedThrough = 0, onLight, shamashLit = false }) {
  // Visual order L→R: candles 1–4, shamash, 5–8 (common diaspora layout)
  const left = [1, 2, 3, 4]
  const right = [5, 6, 7, 8]

  const renderCandle = (n) => {
    const unlocked = n <= unlockedThrough
    const lit = litNights.includes(n)
    const canLight = unlocked && !lit && typeof onLight === 'function'
    return (
      <button
        key={n}
        type="button"
        className={`hk-candle${lit ? ' hk-candle--lit' : ''}${!unlocked ? ' hk-candle--locked' : ''}${canLight ? ' hk-candle--clickable' : ''}`}
        onClick={() => canLight && onLight(n)}
        disabled={!canLight}
        aria-label={
          lit
            ? `Night ${n} candle lit`
            : unlocked
              ? `Light night ${n} candle`
              : `Night ${n} locked`
        }
      >
        <span className="hk-flame" aria-hidden />
        <span className="hk-candle-body" aria-hidden />
        <span>{n}</span>
      </button>
    )
  }

  return (
    <div className="hk-menorah" role="group" aria-label="Hanukkah menorah">
      {left.map(renderCandle)}
      <div
        className={`hk-candle hk-candle--shamash${shamashLit || litNights.length > 0 ? ' hk-candle--lit' : ''}`}
        aria-label="Shamash"
      >
        <span className="hk-flame" aria-hidden />
        <span className="hk-candle-body" aria-hidden />
        <span>ש</span>
      </div>
      {right.map(renderCandle)}
    </div>
  )
}
