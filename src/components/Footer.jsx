import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Link className="footer-brand" to="/">
          <i className="fas fa-shield-halved" aria-hidden="true" /> CODEX AI Cyber Shield
        </Link>
        <p>Built by Team CODEX · Educational awareness tool, not a security guarantee.</p>
        <Link className="back-top" to="/">Back to top ↑</Link>
      </div>
    </footer>
  );
}
