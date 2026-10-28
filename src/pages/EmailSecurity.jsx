import Scanner from '../components/Scanner.jsx';
import { Link } from 'react-router-dom';

export default function EmailSecurity() {
  return (
    <div>
      <section className="content-section fade-section show" style={{ paddingTop: '110px' }}>
        <div className="section-header">
          <span className="section-tag">
            <i className="fas fa-envelope" aria-hidden="true" /> EMAIL SECURITY
          </span>
          <h2>Email Threat Analysis</h2>
          <p className="section-sub">Analyze sender, subject, and message content for impersonation, urgency, credential lures, and suspicious links.</p>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="scanner-main">
            <div className="scanner-title-row">
              <div>
                <p className="eyebrow">EMAIL PHISHING CHECK</p>
                <h3>Email Phishing</h3>
              </div>
              <span className="local-badge">
                <i className="fas fa-circle" aria-hidden="true" /> LOCAL ONLY
              </span>
            </div>
            <Scanner mode="email" onResult={() => {}} />
          </div>
        </div>
        <div className="method-note" style={{ maxWidth: '900px' }}>
          <i className="fas fa-circle-info" aria-hidden="true" />
          <p>
            <b>Note:</b> This checks for patterns in the text you provide. It does not verify email headers, sender authenticity, attachments, or external reputation unless the application has access to those details — which it does not in this local rule-based version.
          </p>
        </div>
      </section>

      <section className="content-section fade-section show">
        <div className="section-header">
          <span className="section-tag">
            <i className="fas fa-shield-virus" aria-hidden="true" /> WHAT WE CHECK
          </span>
          <h2>Email Threat Indicators</h2>
        </div>
        <div className="card-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-title">Impersonation</span>
            <span className="card-desc">Lookalike domains and trusted brand mimicking</span>
          </article>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-title">Urgency & Pressure</span>
            <span className="card-desc">Account locked, verify now, limited time tactics</span>
          </article>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-title">Credential Theft</span>
            <span className="card-desc">Requests for passwords, OTPs, or login details</span>
          </article>
          <article className="card" style={{ cursor: 'default' }}>
            <span className="card-title">Suspicious Links</span>
            <span className="card-desc">Links that differ from sender domain or look deceptive</span>
          </article>
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link to="/threat-detection" className="btn-ghost">
            <i className="fas fa-bug" aria-hidden="true" /> Try Specialized Detections
          </Link>
        </div>
      </section>
    </div>
  );
}
