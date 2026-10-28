import { scannerModes } from '../services/phishingDetection.js';

export default function PhishingTypes({ onSelect }) {
  return <section id="phishing" className="content-section fade-section">
    <div className="section-header"><span className="section-tag"><i className="fas fa-bug" aria-hidden="true" /> THREAT LIBRARY</span><h2>Ten ways phishing can reach you</h2><p className="section-sub">Choose a focused checklist. Each one runs local rules against text you enter; no external service is connected.</p></div>
    <div className="card-container">{scannerModes.map((mode, index) => <button className="card" type="button" key={mode.id} onClick={() => onSelect(mode.id)} aria-label={`Open ${mode.title} scanner`}>
      <span className="card-index">{String(index + 1).padStart(2, '0')}</span><span className="card-icon"><i className={`fas ${mode.icon}`} aria-hidden="true" /></span><span className="card-title">{mode.title}</span><span className="card-desc">{mode.description}</span><span className="card-cta">Open checklist <i className="fas fa-arrow-right" aria-hidden="true" /></span>
    </button>)}</div>
  </section>;
}
