import { useState } from 'react';
import { Link } from 'react-router-dom';
import Scanner from '../components/Scanner.jsx';
import { scannerModes } from '../services/phishingDetection.js';
import { loadScanHistory, saveScanHistory } from '../services/scanHistory.js';

export default function ThreatScanner() {
  const [activeScanner, setActiveScanner] = useState('url');
  const [history, setHistory] = useState(loadScanHistory);

  const modeTitle = activeScanner === 'url' ? 'URL & Message Scanner' : scannerModes.find((mode) => mode.id === activeScanner)?.title;

  const onResult = (result, mode) => {
    if (!result || !['low-risk', 'suspicious', 'high-risk'].includes(result.status)) return;
    const scan = {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: mode === 'url' ? 'URL / Message' : scannerModes.find((item) => item.id === mode)?.title || mode,
      status: result.status,
      score: result.score,
      confidence: result.confidence,
      timestamp: new Date().toISOString(),
      label: 'Submitted content (not retained)'
    };
    const next = [scan, ...history].slice(0, 200);
    setHistory(next);
    saveScanHistory(next);
  };

  const clearHistory = () => {
    setHistory([]);
    saveScanHistory([]);
  };

  return (
    <div>
      <section className="content-section scanner-section fade-section show" style={{ paddingTop: '110px' }}>
        <div className="section-header">
          <span className="section-tag">
            <i className="fas fa-magnifying-glass" aria-hidden="true" /> THREAT SCANNER
          </span>
          <h2>Inspect before interacting</h2>
          <p className="section-sub">Choose a scan mode and paste text only. Results explain which local rules matched.</p>
        </div>
        <div className="scanner-layout">
          <aside className="scanner-menu" aria-label="Scanner mode">
            <p className="menu-heading">SCAN MODE</p>
            <button type="button" className={`scanner-menu-item ${activeScanner === 'url' ? 'active' : ''}`} aria-pressed={activeScanner === 'url'} onClick={() => setActiveScanner('url')}>
              <i className="fas fa-link" aria-hidden="true" /> URL & message <i className="fas fa-chevron-right menu-chevron" aria-hidden="true" />
            </button>
            {scannerModes.map((mode) => (
              <button type="button" key={mode.id} className={`scanner-menu-item ${activeScanner === mode.id ? 'active' : ''}`} aria-pressed={activeScanner === mode.id} onClick={() => setActiveScanner(mode.id)}>
                <i className={`fas ${mode.icon}`} aria-hidden="true" />
                {mode.title}
                <i className="fas fa-chevron-right menu-chevron" aria-hidden="true" />
              </button>
            ))}
            <div className="scanner-privacy">
              <i className="fas fa-lock" aria-hidden="true" />
              <span>
                <b>Your text stays here</b>Only a generic result label and score are kept in local browser history.
              </span>
            </div>
          </aside>
          <div className="scanner-main">
            <div className="scanner-title-row">
              <div>
                <p className="eyebrow">ACTIVE CHECK</p>
                <h3>{modeTitle}</h3>
              </div>
              <span className="local-badge">
                <i className="fas fa-circle" aria-hidden="true" /> LOCAL ONLY
              </span>
            </div>
            <Scanner mode={activeScanner} onResult={onResult} />
          </div>
        </div>
        <div className="method-note">
          <i className="fas fa-circle-info" aria-hidden="true" />
          <p>
            <b>How to interpret this:</b> Lower risk means only that this small set of rules found few signals. It cannot verify reputation, content behind a URL, certificates, sender authenticity, or external threat intelligence. Confirm important requests through a known, independent channel.
          </p>
        </div>
      </section>

      {history.length > 0 && (
        <section className="content-section fade-section show">
          <div className="section-header">
            <span className="section-tag">
              <i className="fas fa-clock-rotate-left" aria-hidden="true" /> RECENT SCANS
            </span>
            <h2>Scan History (Local)</h2>
            <p className="section-sub">Stored locally in your browser. Only labels and results are saved — submitted content is not retained.</p>
          </div>
          <div className="panel logs-panel" style={{ maxWidth: '1150px', margin: '0 auto' }}>
            <div className="logs-heading">
              <h3 className="panel-title">
                <i className="fas fa-list-check" aria-hidden="true" /> Recent activity
              </h3>
              <button className="btn-clear" type="button" onClick={clearHistory}>
                <i className="fas fa-trash" aria-hidden="true" /> Clear history
              </button>
            </div>
            <div className="logs-wrap">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Mode</th>
                    <th>Result</th>
                    <th>Score</th>
                    <th>Confidence</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 20).map((scan) => (
                    <tr className={scan.status === 'high-risk' ? 'phishing' : scan.status === 'suspicious' ? 'suspicious' : 'safe'} key={scan.id}>
                      <td>{scan.type}</td>
                      <td>{scan.status.replace('-', ' ')}</td>
                      <td>{scan.score == null ? '—' : `${scan.score}/100`}</td>
                      <td>{scan.confidence || '—'}</td>
                      <td>{new Date(scan.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/dashboard" className="btn-ghost">
              <i className="fas fa-chart-line" aria-hidden="true" /> View Full Dashboard
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
