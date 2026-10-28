const labels = { 'low-risk': 'LOWER RISK', suspicious: 'SUSPICIOUS', 'high-risk': 'HIGH RISK', invalid: 'INPUT NEEDED', error: 'SCAN ERROR' };

export default function ScanResult({ result }) {
  if (!result) return null;
  return <section className={`scan-result result-${result.status}`} aria-live="polite" role="status">
    <header className="result-heading"><span>{labels[result.status] || 'SCAN RESULT'}</span>{result.score != null && <strong>Rule score · {result.score}/100</strong>}</header>
    <p className="result-summary">{result.status === 'invalid' ? 'Unable to analyze this submission.' : result.status === 'high-risk' ? 'Several configured indicators warrant treating this input with caution.' : result.status === 'suspicious' ? 'Some indicators merit independent verification.' : result.status === 'low-risk' ? 'No strong configured indicators were found; this is not a guarantee of safety.' : 'The local analysis could not be completed.'}</p>
    {result.score != null && <p className="result-confidence">Rule evidence strength: {result.confidence} · This is a heuristic score, not a probability.</p>}
    <ul>{result.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
  </section>;
}
