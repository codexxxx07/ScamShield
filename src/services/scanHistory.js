// Shared local scan-history storage used by the scanner page and the dashboard.
// Only generic labels, scores and timestamps are persisted — never submitted content.
export const HISTORY_KEY = 'cyberShieldHistory';
const MAX_ENTRIES = 200;
const VALID_STATUS = new Set(['low-risk', 'suspicious', 'high-risk']);

// Defensive parse: older or hand-edited localStorage data must never crash the UI.
const sanitizeScan = (entry) => {
  if (!entry || typeof entry !== 'object') return null;
  const status = VALID_STATUS.has(entry.status) ? entry.status : null;
  if (!status) return null;
  const score = Number.isFinite(entry.score) ? Math.min(100, Math.max(0, Math.round(entry.score))) : null;
  return {
    id: typeof entry.id === 'string' && entry.id ? entry.id : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: typeof entry.type === 'string' && entry.type ? entry.type : 'Unknown mode',
    status,
    score,
    confidence: typeof entry.confidence === 'string' && entry.confidence ? entry.confidence : 'low',
    timestamp: entry.timestamp && !Number.isNaN(Date.parse(entry.timestamp)) ? entry.timestamp : new Date().toISOString(),
    label: typeof entry.label === 'string' && entry.label ? entry.label : 'Submitted content (not retained)',
  };
};

export function loadScanHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeScan).filter(Boolean).slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

export function saveScanHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_ENTRIES)));
  } catch {
    // Storage unavailable or quota exceeded — history simply stays in memory.
  }
}
