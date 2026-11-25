import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { HANUKKAH_NIGHTS } from '../data/hanukkahNights.js'

export default function Scrapbook({ unlockedThrough, lit, done, lightCandle, markDone }) {
  const cardRef = useRef(null)

  if (unlockedThrough < 8) {
    return (
      <div>
        <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
        <div className="hk-panel">
          <p>The scrapbook unlocks on Night 8, when all eight candles can be lit.</p>
        </div>
      </div>
    )
  }

  const finished = HANUKKAH_NIGHTS.filter((n) => lit.includes(n.night) || done[n.slug] || n.night === 1)

  const download = async () => {
    const node = cardRef.current
    if (!node) return
    // SVG foreignObject export via canvas
    const width = 720
    const height = 600
    const lines = finished.map((n) => `Night ${n.night}: ${n.title}`).join('\n')
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#1a1520"/>
  <text x="40" y="64" fill="#fde68a" font-family="Georgia, serif" font-size="32">HaShem.Faith · Eight nights</text>
  <text x="40" y="100" fill="#fef3c7" font-family="system-ui, sans-serif" font-size="16">Hanukkah 2026 · Chag sameach</text>
  ${finished
    .map(
      (n, i) =>
        `<text x="40" y="${150 + i * 36}" fill="#fef3c7" font-family="system-ui, sans-serif" font-size="18">Night ${n.night}: ${n.title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`,
    )
    .join('\n')}
  <text x="40" y="${560}" fill="#a8a29e" font-family="system-ui, sans-serif" font-size="14">antisemitism.hashem.faith/hanukkah</text>
</svg>`
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hashem-faith-eight-nights.svg'
    a.click()
    URL.revokeObjectURL(url)
    markDone('scrapbook', { nights: finished.map((n) => n.night) })
    lightCandle(8)
    void lines
  }

  return (
    <div>
      <Link to="/hanukkah" className="hk-back">← Eight nights</Link>
      <div className="hk-panel">
        <h2>Eight-nights scrapbook</h2>
        <p className="hk-note">Build a share card from the nights you lit, then download it.</p>
        <div className="hk-scrapbook-preview" ref={cardRef} aria-label="Scrapbook preview">
          <h3>HaShem.Faith · Eight nights</h3>
          <p style={{ margin: 0, opacity: 0.85 }}>Hanukkah 2026 · Chag sameach</p>
          <ul>
            {finished.map((n) => (
              <li key={n.night}>
                Night {n.night}: {n.title}
              </li>
            ))}
          </ul>
          <div className="hk-scrapbook-candles" aria-hidden>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <span key={n} className={lit.includes(n) || n === 1 ? 'on' : ''} />
            ))}
          </div>
        </div>
        <div className="hk-actions">
          <button type="button" className="primary" onClick={download}>
            Download share card (SVG)
          </button>
        </div>
      </div>
    </div>
  )
}
