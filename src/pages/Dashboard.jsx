import { useEffect, useState } from 'react';
import ThreatDashboard from '../components/ThreatDashboard.jsx';
import { loadScanHistory, saveScanHistory } from '../services/scanHistory.js';

export default function Dashboard() {
  const [history, setHistory] = useState(loadScanHistory);

  useEffect(() => {
    // Persists sanitized history back, migrating any outdated stored entries.
    saveScanHistory(history);
  }, [history]);

  const onClear = () => {
    setHistory([]);
  };

  return (
    <div>
      <section style={{ paddingTop: '90px' }}>
        <ThreatDashboard history={history} onClear={onClear} />
      </section>
    </div>
  );
}
