import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section id="home" className="hero-section fade-section show">
        <div className="home-content">
          <span className="home-badge">
            <i className="fas fa-shield-halved" aria-hidden="true" /> RULE-BASED AWARENESS
          </span>
          <h1>
            CODEX AI Cyber Shield <span>Threat Awareness Platform</span>
          </h1>
          <p className="hero-copy">
            Understand common phishing signals before you click. Transparent, local rule checks run in your browser — designed for education and awareness with explainable results.
          </p>
          <div className="home-actions">
            <Link to="/scanner" className="btn-primary">
              <i className="fas fa-magnifying-glass" aria-hidden="true" /> Start Threat Scan
            </Link>
            <Link to="/threat-detection" className="btn-ghost">
              <i className="fas fa-bug" aria-hidden="true" /> Explore Security Tools
            </Link>
          </div>
          <div className="home-stats">
            <div>
              <strong>10</strong>
              <span>phishing categories</span>
            </div>
            <span className="home-stat-sep" aria-hidden="true" />
            <div>
              <strong>Local</strong>
              <span>browser analysis</span>
            </div>
            <span className="home-stat-sep" aria-hidden="true" />
            <div>
              <strong>Explainable</strong>
              <span>rule-based results</span>
            </div>
          </div>
        </div>
        <div className="home-visual" aria-hidden="true">
          <div className="shield-grid" />
          <div className="shield-orbit orbit-one" />
          <div className="shield-orbit orbit-two" />
          <div className="shield-orbit orbit-three" />
          <span className="shield-mark">
            <i className="fas fa-shield-halved" />
          </span>
          <span className="visual-caption">
            LOCAL RULE ENGINE <i className="fas fa-circle" />
          </span>
        </div>
      </section>

      <section className="content-section fade-section show">
        <div className="section-header">
          <span className="section-tag">
            <i className="fas fa-layer-group" aria-hidden="true" /> CAPABILITIES
          </span>
          <h2>Core Protection Features</h2>
          <p className="section-sub">Focused tools to spot suspicious links, emails, texts, calls, and more — with clear explanations.</p>
        </div>
        <div className="card-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-index">01</span>
            <span className="card-icon">
              <i className="fas fa-link" aria-hidden="true" />
            </span>
            <span className="card-title">Phishing Detection</span>
            <span className="card-desc">Inspect URLs and messages for deception patterns with transparent rule matching.</span>
          </article>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-index">02</span>
            <span className="card-icon">
              <i className="fas fa-envelope" aria-hidden="true" />
            </span>
            <span className="card-title">Email Security</span>
            <span className="card-desc">Analyze sender, subject, and content for impersonation, urgency, and credential lures.</span>
          </article>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-index">03</span>
            <span className="card-icon">
              <i className="fas fa-mobile-screen-button" aria-hidden="true" />
            </span>
            <span className="card-title">Message & SMS Analysis</span>
            <span className="card-desc">Spot smishing and vishing tactics with explainable indicators.</span>
          </article>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-index">04</span>
            <span className="card-icon">
              <i className="fas fa-crosshairs" aria-hidden="true" />
            </span>
            <span className="card-title">Threat Intelligence</span>
            <span className="card-desc">Covers spear phishing, whaling, clone, quishing, angler, HTTPS, and evil twin checks.</span>
          </article>
        </div>
      </section>

      <section className="content-section fade-section show">
        <div className="section-header">
          <span className="section-tag">
            <i className="fas fa-route" aria-hidden="true" /> HOW IT WORKS
          </span>
          <h2>Simple. Transparent. Local.</h2>
          <p className="section-sub">A clear flow designed for awareness and education.</p>
        </div>
        <div className="card-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-index">01</span>
            <span className="card-title">Paste Content</span>
            <span className="card-desc">Enter a URL, email, message, or call details into the appropriate tool.</span>
          </article>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-index">02</span>
            <span className="card-title">Local Rule Analysis</span>
            <span className="card-desc">Heuristic rules run in your browser with no external lookups.</span>
          </article>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-index">03</span>
            <span className="card-title">Review Results</span>
            <span className="card-desc">Get a risk level, triggered indicators, and actionable recommendations.</span>
          </article>
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link to="/scanner" className="btn-primary">
            <i className="fas fa-shield-halved" aria-hidden="true" /> Get Started with Threat Scan
          </Link>
        </div>
      </section>
    </div>
  );
}
