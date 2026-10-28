import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="content-section fade-section show" style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <span className="section-tag">
          <i className="fas fa-triangle-exclamation" aria-hidden="true" /> 404
        </span>
        <h2>Page Not Found</h2>
        <p className="section-sub">The page you're looking for doesn't exist or has been moved.</p>
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn-primary">
          <i className="fas fa-house" aria-hidden="true" /> Go Home
        </Link>
        <Link to="/scanner" className="btn-ghost">
          <i className="fas fa-magnifying-glass" aria-hidden="true" /> Start Threat Scan
        </Link>
      </div>
    </section>
  );
}
