import { useMemo, useState } from 'react';

const segmentColors = ['#00ff99', '#ffc46b', '#ff6078'];

function DistributionChart({ counts, total }) {
  const [hovered, setHovered] = useState(null);
  const chart = useMemo(() => {
    let cursor = 0;
    const segments = counts.map((count, index) => {
      const start = cursor;
      cursor += total ? (count / total) * 100 : 0;
      return { count, index, start, dash: total ? (count / total) * 100 : 0 };
    });
    return segments;
  }, [counts, total]);

  return (
    <div className="chart-content">
      <div className="donut-wrap">
        <svg className="donut" viewBox="0 0 120 120" role="img" aria-label={`Scan distribution: ${counts[0]} lower-risk, ${counts[1]} suspicious, ${counts[2]} high-risk scans`}>
          <circle className="donut-track" cx="60" cy="60" r="43" />
          {chart.map(({ index, dash, start }) => (
            <circle
              key={index}
              className="donut-segment"
              cx="60"
              cy="60"
              r="43"
              pathLength="100"
              stroke={segmentColors[index]}
              strokeDasharray={`${dash} ${100 - dash}`}
              strokeDashoffset={-start}
              transform="rotate(-90 60 60)"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <text className="donut-total" x="60" y="57" textAnchor="middle">
            {hovered == null ? total : counts[hovered]}
          </text>
          <text className="donut-caption" x="60" y="71" textAnchor="middle">
            {hovered == null ? 'SCANS' : ['LOWER RISK', 'SUSPICIOUS', 'HIGH RISK'][hovered]}
          </text>
        </svg>
      </div>
      <ul className="chart-legend">
        {['Lower risk', 'Suspicious', 'High risk'].map((label, index) => (
          <li key={label}>
            <span className="legend-dot" style={{ '--dot': segmentColors[index] }} />
            <span>{label}</span>
            <strong>{counts[index]}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ThreatDashboard({ history, onClear }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const safeCount = history.filter((scan) => scan.status === 'low-risk').length;
  const suspiciousCount = history.filter((scan) => scan.status === 'suspicious').length;
  const highCount = history.filter((scan) => scan.status === 'high-risk').length;
  const counts = [safeCount, suspiciousCount, highCount];
  const latest = history[0];
  const riskClass = latest?.status === 'high-risk' ? 'status-phishing' : latest?.status === 'suspicious' ? 'status-suspicious' : 'status-safe';
  const average = history.length ? Math.round(history.reduce((sum, scan) => sum + (scan.score || 0), 0) / history.length) : 0;

  return (
    <section id="dashboard" className="content-section fade-section show">
      <div className="section-header">
        <span className="section-tag">
          <i className="fas fa-chart-line" aria-hidden="true" /> ANALYTICS
        </span>
        <h2>Security Dashboard</h2>
        <p className="section-sub">Persistent local scan activity. Submitted content is not stored; only labels and results are kept on this device.</p>
      </div>
      <div className="dashboard-grid">
        <div className="stats-container">
          <article className="stat-card">
            <span className="stat-icon-wrap">
              <i className="fas fa-database" aria-hidden="true" />
            </span>
            <h3>Total scans</h3>
            <p>{history.length}</p>
            <span className="stat-sub">Recorded on this device</span>
          </article>
          <article className="stat-card">
            <span className="stat-icon-wrap danger">
              <i className="fas fa-triangle-exclamation" aria-hidden="true" />
            </span>
            <h3>Threats detected</h3>
            <p>{highCount + suspiciousCount}</p>
            <span className="stat-sub">High-risk or suspicious</span>
          </article>
          <article className="stat-card">
            <span className="stat-icon-wrap safe">
              <i className="fas fa-circle-check" aria-hidden="true" />
            </span>
            <h3>Lower-risk results</h3>
            <p>{safeCount}</p>
            <span className="stat-sub">No strong configured signals</span>
          </article>
          <article className="stat-card">
            <span className="stat-icon-wrap warn">
              <i className="fas fa-gauge-high" aria-hidden="true" />
            </span>
            <h3>Latest risk score</h3>
            <div className="risk-pill">{latest?.score == null ? '—' : `${latest.score}/100`}</div>
            <span className="stat-sub">Mean score: {history.length ? average : '—'}</span>
          </article>
        </div>
        <article className="panel analysis-panel">
          <div className="meter-backdrop" />
          <div className="risk-meter" style={{ '--risk': latest?.score || 0, '--accent': latest?.status === 'high-risk' ? '#ff6078' : latest?.status === 'suspicious' ? '#ffc46b' : '#00ff99' }}>
            <div className="meter-ring" />
            <div className="meter-center">
              <span className="meter-value">{latest?.score == null ? '—' : `${latest.score}%`}</span>
              <small>Latest heuristic</small>
            </div>
          </div>
          <div className="status-block">
            <span className={`status-badge ${riskClass}`}>{latest ? latest.status.replace('-', ' ') : 'No scans yet'}</span>
            <p className="status-detail">{latest ? `${latest.type} · ${latest.confidence || 'low'} evidence strength` : 'Run a scan to populate the dashboard.'}</p>
            <p className="meter-disclaimer">Risk scores are rule-based indicators, not a guarantee of safety or a live threat verdict.</p>
          </div>
        </article>
        <article className="panel chart-panel">
          <h3 className="panel-title">
            <i className="fas fa-chart-pie" aria-hidden="true" /> Risk distribution
          </h3>
          {history.length ? <DistributionChart counts={counts} total={history.length} /> : <p className="no-data-text"><i className="fas fa-circle-info" aria-hidden="true" /> No scan history yet.</p>}
        </article>
        <article className="panel logs-panel">
          <div className="logs-heading">
            <h3 className="panel-title">
              <i className="fas fa-list-check" aria-hidden="true" /> Recent scan activity
            </h3>
            {history.length > 0 &&
              (confirmClear ? (
                <span className="clear-confirm">
                  <button type="button" onClick={() => { onClear(); setConfirmClear(false); }}>
                    Confirm clear
                  </button>
                  <button type="button" onClick={() => setConfirmClear(false)}>
                    Cancel
                  </button>
                </span>
              ) : (
                <button className="btn-clear" type="button" onClick={() => setConfirmClear(true)}>
                  <i className="fas fa-trash" aria-hidden="true" /> Clear history
                </button>
              ))}
          </div>
          {history.length === 0 ? (
            <p className="no-data-text">No scans recorded yet. Results appear here after a completed check.</p>
          ) : (
            <div className="logs-wrap">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Input label</th>
                    <th>Mode</th>
                    <th>Result</th>
                    <th>Score</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 30).map((scan) => (
                    <tr className={scan.status === 'high-risk' ? 'phishing' : scan.status === 'suspicious' ? 'suspicious' : 'safe'} key={scan.id}>
                      <td title={scan.label}>{scan.label}</td>
                      <td>{scan.type}</td>
                      <td>{scan.status.replace('-', ' ')}</td>
                      <td>{scan.score == null ? '—' : `${scan.score}/100`}</td>
                      <td>{new Date(scan.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
