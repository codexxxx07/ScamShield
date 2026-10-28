import { useState } from 'react';
import Scanner from '../components/Scanner.jsx';
import { scannerModes } from '../services/phishingDetection.js';

export default function ThreatDetection() {
  const [activeMode, setActiveMode] = useState('spear');
  const mode = scannerModes.find((m) => m.id === activeMode);

  return (
    <div>
      <section className="content-section fade-section show" style={{ paddingTop: '110px' }}>
        <div className="section-header">
          <span className="section-tag">
            <i className="fas fa-bug" aria-hidden="true" /> SPECIALIZED THREAT DETECTION
          </span>
          <h2>Targeted Phishing Analysis</h2>
          <p className="section-sub">Organized tools for different attack types. All ten existing categories are preserved.</p>
        </div>

        <div style={{ maxWidth: '1150px', margin: '0 auto 32px' }}>
          <div className="scanner-menu" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {scannerModes.map((m) => (
              <button
                type="button"
                key={m.id}
                className={`scanner-menu-item ${activeMode === m.id ? 'active' : ''}`}
                style={{ width: 'auto', flex: '1 1 auto' }}
                onClick={() => setActiveMode(m.id)}
                aria-pressed={activeMode === m.id}
              >
                <i className={`fas ${m.icon}`} aria-hidden="true" />
                {m.title}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="scanner-main">
            <div className="scanner-title-row">
              <div>
                <p className="eyebrow">SPECIALIZED CHECK</p>
                <h3>{mode?.title || 'Scanner'}</h3>
              </div>
              <span className="local-badge">
                <i className="fas fa-circle" aria-hidden="true" /> LOCAL ONLY
              </span>
            </div>
            {mode && <p className="section-sub" style={{ padding: '12px 20px 0', margin: 0 }}>{mode.description}</p>}
            <Scanner mode={activeMode} onResult={() => {}} />
          </div>
        </div>
      </section>

      <section className="content-section fade-section show">
        <div className="section-header">
          <span className="section-tag">
            <i className="fas fa-list" aria-hidden="true" /> CATEGORIES
          </span>
          <h2>All Supported Categories</h2>
        </div>
        <div className="card-container">
          {scannerModes.map((m, idx) => (
            <button className="card" type="button" key={m.id} onClick={() => setActiveMode(m.id)}>
              <span className="card-index">{String(idx + 1).padStart(2, '0')}</span>
              <span className="card-icon">
                <i className={`fas ${m.icon}`} aria-hidden="true" />
              </span>
              <span className="card-title">{m.title}</span>
              <span className="card-desc">{m.description}</span>
              <span className="card-cta">
                Open tool <i className="fas fa-arrow-right" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
