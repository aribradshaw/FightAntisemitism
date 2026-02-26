export default function Stylesheet() {
  return (
    <div className="stylesheet-page">
      <h1>Style guide</h1>
      <p className="stylesheet-intro">Design tokens and component previews for About Jews.</p>

      <section className="stylesheet-section">
        <h2>Colors</h2>
        <div className="stylesheet-swatch-grid">
          <div className="stylesheet-swatch" style={{ background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
            <span>--bg-main</span>
          </div>
          <div className="stylesheet-swatch" style={{ background: 'var(--bg-off)' }}>
            <span>--bg-off</span>
          </div>
          <div className="stylesheet-swatch" style={{ background: 'var(--bg-card)' }}>
            <span>--bg-card</span>
          </div>
          <div className="stylesheet-swatch" style={{ background: 'var(--bg-elevated)' }}>
            <span>--bg-elevated</span>
          </div>
          <div className="stylesheet-swatch" style={{ background: 'var(--text-primary)', color: 'white' }}>
            <span>--text-primary</span>
          </div>
          <div className="stylesheet-swatch" style={{ background: 'var(--text-secondary)', color: 'white' }}>
            <span>--text-secondary</span>
          </div>
          <div className="stylesheet-swatch" style={{ background: 'var(--text-muted)', color: 'white' }}>
            <span>--text-muted</span>
          </div>
          <div className="stylesheet-swatch" style={{ background: 'var(--accent-blue)', color: 'white' }}>
            <span>--accent-blue</span>
          </div>
          <div className="stylesheet-swatch" style={{ background: 'var(--accent-blue-light)', color: 'white' }}>
            <span>--accent-blue-light</span>
          </div>
          <div className="stylesheet-swatch" style={{ background: 'var(--accent-gold)', color: 'white' }}>
            <span>--accent-gold</span>
          </div>
          <div className="stylesheet-swatch" style={{ background: 'var(--accent-gold-light)', color: 'white' }}>
            <span>--accent-gold-light</span>
          </div>
          <div className="stylesheet-swatch" style={{ background: 'var(--accent-gold-muted)' }}>
            <span>--accent-gold-muted</span>
          </div>
          <div className="stylesheet-swatch" style={{ background: 'var(--accent-blue-muted)' }}>
            <span>--accent-blue-muted</span>
          </div>
        </div>
      </section>

      <section className="stylesheet-section">
        <h2>Typography</h2>
        <p><strong>Headings:</strong></p>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <p><strong>Body:</strong> The quick brown fox jumps over the lazy dog. Default body text uses --text-primary with comfortable line height.</p>
        <p className="stylesheet-muted">Muted text (--text-secondary or --text-muted) for supporting copy.</p>
      </section>

      <section className="stylesheet-section">
        <h2>Buttons</h2>
        <div className="stylesheet-buttons">
          <button type="button">Default</button>
          <button type="button" className="primary">Primary</button>
          <button type="button" className="ghost">Ghost</button>
        </div>
      </section>

      <section className="stylesheet-section">
        <h2>Links</h2>
        <p><a href="#link">Default link</a> and <a href="#link" className="stylesheet-link-muted">in context</a>.</p>
      </section>

      <section className="stylesheet-section">
        <h2>Cards</h2>
        <div className="stylesheet-cards">
          <div className="stylesheet-card">Card (--bg-card, --border)</div>
          <div className="stylesheet-card hub-card">Hub-style card with hover</div>
        </div>
      </section>

      <section className="stylesheet-section">
        <h2>Borders & radius</h2>
        <p>--radius: 10px, --radius-sm: 6px</p>
        <div className="stylesheet-radius-demo" style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>Large radius</div>
        <div className="stylesheet-radius-demo" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>Small radius</div>
      </section>
    </div>
  )
}
