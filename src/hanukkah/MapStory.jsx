import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MAP_STOPS } from '../data/hanukkahNights.js'

export default function MapStory({ unlockedThrough, lightCandle, markDone, done }) {
  const openStops = useMemo(
    () => MAP_STOPS.filter((s) => s.night <= unlockedThrough),
    [unlockedThrough],
  )
  const [activeId, setActiveId] = useState(openStops[0]?.id || null)
  const active = MAP_STOPS.find((s) => s.id === activeId) || openStops[0]

  // Rough Levant-centered projection for the SVG
  const project = (lat, lng) => {
    const x = ((lng - 34.5) / 2.2) * 280 + 40
    const y = ((33.2 - lat) / 2.0) * 320 + 30
    return { x: Math.max(20, Math.min(300, x)), y: Math.max(20, Math.min(340, y)) }
  }

  const complete = () => {
    markDone('map', { stops: openStops.length })
    if (unlockedThrough >= 2) lightCandle(2)
  }

  return (
    <div>
      <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
      <div className="hk-panel">
        <h2>Hanukkah map story</h2>
        <p className="hk-note">
          Stops unlock with the candles. Tonight you can visit {openStops.length} of {MAP_STOPS.length}.
        </p>
        <div className="hk-map-wrap">
          <svg className="hk-map-svg" viewBox="0 0 340 360" role="img" aria-label="Map of Hanukkah places">
            <rect x="0" y="0" width="340" height="360" fill="#f5f5f4" />
            <text x="12" y="22" fontSize="12" fill="#7a7a7a">Eastern Mediterranean · schematic</text>
            {MAP_STOPS.map((stop) => {
              const { x, y } = project(stop.lat, stop.lng)
              const open = stop.night <= unlockedThrough
              const isActive = active?.id === stop.id
              return (
                <g key={stop.id}>
                  <circle
                    className={`hk-map-stop${open ? ' hk-map-stop--open' : ' hk-map-stop--locked'}${isActive ? ' hk-map-stop--active' : ''}`}
                    cx={x}
                    cy={y}
                    r={isActive ? 11 : 8}
                    onClick={() => open && setActiveId(stop.id)}
                  />
                  {open && (
                    <text x={x + 12} y={y + 4} fontSize="11" fill="#2c2c2c">
                      {stop.name.split('—')[0].trim()}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
          {active && (
            <div>
              <p className="hk-card-kicker">{active.year}</p>
              <h3 style={{ marginTop: 0 }}>{active.name}</h3>
              <p>{active.text}</p>
              {active.source?.url && (
                <p>
                  <a href={active.source.url} target={active.source.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                    {active.source.label}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
        <div className="hk-actions">
          <button type="button" className="primary" onClick={complete}>
            {done.map ? 'Visited — candle ready' : 'Mark tonight’s map done'}
          </button>
        </div>
      </div>
    </div>
  )
}
