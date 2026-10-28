import TeamSection from '../components/TeamSection.jsx';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      <section className="content-section fade-section show" style={{ paddingTop: '110px' }}>
        <div className="section-header">
          <span className="section-tag">
            <i className="fas fa-info-circle" aria-hidden="true" /> ABOUT
          </span>
          <h2>CODEX AI Cyber Shield</h2>
          <p className="section-sub">An educational cybersecurity awareness platform built to help users recognize and understand phishing threats.</p>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#9ca9a3', fontSize: '15px', lineHeight: '1.85' }}>
            CODEX AI Cyber Shield is a frontend-only, rule-based phishing-awareness tool. It explains common scam tactics across URLs, emails, SMS, phone calls, QR codes, social media, and network scenarios. All analysis runs locally in your browser — no submitted content is sent to external servers, and results are heuristic indicators for learning and awareness.
          </p>
        </div>
      </section>

      <section className="content-section fade-section show">
        <div className="section-header">
          <span className="section-tag">
            <i className="fas fa-bullseye" aria-hidden="true" /> MISSION
          </span>
          <h2>Our Mission</h2>
        </div>
        <div className="card-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-title">Awareness First</span>
            <span className="card-desc">Empower everyday users to pause and question suspicious requests.</span>
          </article>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-title">Explainable Security</span>
            <span className="card-desc">Show why something looks suspicious with clear, understandable reasons.</span>
          </article>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-title">Privacy by Design</span>
            <span className="card-desc">Local analysis with minimal data retention and transparent behavior.</span>
          </article>
        </div>
      </section>

      <TeamSection />

      <section className="content-section fade-section show">
        <div style={{ textAlign: 'center' }}>
          <Link to="/scanner" className="btn-primary">
            <i className="fas fa-magnifying-glass" aria-hidden="true" /> Try the Threat Scanner
          </Link>
        </div>
      </section>
    </div>
  );
}
