import { useEffect, useRef, useState } from 'react';
import { analyzeScan, scannerModes } from '../services/phishingDetection.js';
import ScanResult from './ScanResult.jsx';

const scannerFields = {
  url: [{ id: 'text', label: 'URL or message', placeholder: 'Paste a link or suspicious message; it will not be opened or shared.', type: 'textarea', rows: 5 }],
  email: [{ id: 'from', label: 'From email', placeholder: 'support@example.com', type: 'email' }, { id: 'subject', label: 'Subject', placeholder: 'Email subject' }, { id: 'body', label: 'Email body', placeholder: 'Paste message content — analysis stays in this browser.', type: 'textarea', rows: 5 }],
  spear: [{ id: 'from', label: 'From email', placeholder: 'sender@company.com', type: 'email' }, { id: 'to', label: 'To email', placeholder: 'recipient@company.com', type: 'email' }, { id: 'targetName', label: 'Recipient name', placeholder: 'Name mentioned in the email' }, { id: 'subject', label: 'Subject', placeholder: 'Email subject' }, { id: 'body', label: 'Email body', placeholder: 'Paste targeted message content.', type: 'textarea', rows: 5 }],
  whaling: [{ id: 'from', label: 'From email', placeholder: 'sender@company.com', type: 'email' }, { id: 'to', label: 'Executive email', placeholder: 'recipient@company.com', type: 'email' }, { id: 'targetName', label: 'Executive name', placeholder: 'Target name' }, { id: 'targetRole', label: 'Executive role', placeholder: 'CEO, CFO, director…' }, { id: 'subject', label: 'Subject', placeholder: 'Email subject' }, { id: 'body', label: 'Email body', placeholder: 'Paste the message content.', type: 'textarea', rows: 5 }],
  smishing: [{ id: 'sender', label: 'Sender', placeholder: 'Phone number or sender name' }, { id: 'body', label: 'SMS message', placeholder: 'Paste the text message.', type: 'textarea', rows: 5 }],
  vishing: [{ id: 'caller', label: 'Caller ID', placeholder: 'Number, blocked, or unknown' }, { id: 'claimed', label: 'Caller claims to be', placeholder: 'Bank, government office, support…' }, { id: 'purpose', label: 'Call purpose', placeholder: 'Why did they contact you?' }, { id: 'details', label: 'Call details', placeholder: 'Describe threats, requests, or behavior.', type: 'textarea', rows: 5 }],
  clone: [{ id: 'from', label: 'From email', placeholder: 'colleague@company.com', type: 'email' }, { id: 'subject', label: 'Subject', placeholder: 'Original or forwarded subject' }, { id: 'body', label: 'Email body', placeholder: 'Paste the message and any links as plain text.', type: 'textarea', rows: 5 }],
  quishing: [{ id: 'from', label: 'From email (optional)', placeholder: 'sender@example.com', type: 'email' }, { id: 'subject', label: 'Subject', placeholder: 'QR message subject' }, { id: 'body', label: 'Message / decoded URL', placeholder: 'Paste the QR-related text or manually decoded URL. Do not open it.', type: 'textarea', rows: 5 }],
  angler: [{ id: 'platform', label: 'Platform', type: 'select', options: ['Twitter / X', 'Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'Other'] }, { id: 'handle', label: 'Account handle', placeholder: '@brand_support' }, { id: 'claim', label: 'Claimed identity', placeholder: 'Brand or service being impersonated' }, { id: 'message', label: 'Message', placeholder: 'Paste the direct message.', type: 'textarea', rows: 5 }],
  https: [{ id: 'url', label: 'URL to inspect', placeholder: 'https://example.com/login' }, { id: 'context', label: 'Message context (optional)', placeholder: 'Why was this link sent to you?', type: 'textarea', rows: 4 }],
  evilTwin: [{ id: 'ssid', label: 'Wi-Fi network name (SSID)', placeholder: 'Cafe Wi-Fi' }, { id: 'security', label: 'Security type', type: 'select', options: ['Open (no password)', 'WEP', 'WPA', 'WPA2', 'WPA3', 'Unknown'] }, { id: 'duplicate', label: 'Duplicate network name seen?', type: 'select', options: ['Yes', 'No', 'Not sure'] }, { id: 'publicPlace', label: 'Public location?', type: 'select', options: ['Yes', 'No'] }, { id: 'signal', label: 'Signal strength', type: 'select', options: ['Weak', 'Medium', 'Strong'] }, { id: 'details', label: 'Additional observations', placeholder: 'Captive portal behavior or other relevant observations.', type: 'textarea', rows: 4 }],
};

const modeLabels = { 'low-risk': 'LOWER RISK', suspicious: 'SUSPICIOUS', 'high-risk': 'HIGH RISK', invalid: 'INPUT NEEDED', error: 'SCAN ERROR' };

function Progress({ progress, scanning }) {
  return <div className={`scan-progress ${scanning ? 'is-scanning' : ''}`} aria-live="polite">
    <div className="progress-heading"><span>{scanning ? 'Running local rule checks…' : 'Local rule checks complete'}</span><span>{progress}%</span></div>
    <div className="progress" role="progressbar" aria-label="Local scan progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><div className="cyber-progress-fill" style={{ width: `${progress}%` }} /></div>
    <p className="loading-text">{scanning ? 'Frontend-only analysis. No network lookups are performed.' : 'No external threat-intelligence lookup was performed.'}</p>
  </div>;
}

export default function Scanner({ mode, onResult }) {
  const activeMode = mode === 'url' ? { title: 'URL & Message Scanner', description: 'Check visible links and message text using transparent rules that run locally in this browser.' } : scannerModes.find((item) => item.id === mode);
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const scanLock = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  if (!activeMode) return null;

  const update = (id, value) => setValues((current) => ({ ...current, [id]: value }));
  // Textareas swallow Enter as a newline; in URL mode the hint promises Enter scans,
  // so submit there (Shift+Enter still inserts a newline). Other modes keep native newlines.
  const handleKeyDown = (event) => {
    if (mode === 'url' && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };
  const finish = (outcome) => {
    setProgress(100);
    setResult(outcome);
    onResult?.(outcome, mode, values);
    setScanning(false);
    scanLock.current = false;
  };
  const submit = (event) => {
    event.preventDefault();
    if (scanLock.current) return;
    const relevant = Object.entries(values).filter(([key]) => key !== 'platform' && key !== 'security' && key !== 'duplicate' && key !== 'publicPlace' && key !== 'signal').some(([, value]) => String(value || '').trim());
    if (!relevant) {
      const invalid = { status: 'invalid', score: null, confidence: 'none', reasons: ['Enter the content required for this scan mode.'] };
      setResult(invalid);
      onResult?.(invalid, mode, values);
      return;
    }
    scanLock.current = true;
    setScanning(true);
    setProgress(0);
    setResult(null);
    // The rule check itself is synchronous; step the progress briefly so the
    // loading state is visible, then reveal the outcome. The timer is cleared
    // on unmount, so a pending step can never update a gone component.
    let current = 0;
    window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      current = Math.min(90, current + 18);
      setProgress(current);
      if (current >= 90) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
        try {
          finish(analyzeScan(mode, values));
        } catch {
          finish({ status: 'error', score: null, confidence: 'none', reasons: ['The local rule check encountered an unexpected error.'] });
        }
      }
    }, 110);
  };

  return <div className="scanner-box">
    {mode !== 'url' && <p className="section-sub scanner-mode-description">{activeMode.description}</p>}
    <form onSubmit={submit} noValidate>
      <div className={`scanner-fields ${mode === 'url' ? 'url-fields' : ''}`}>
        {scannerFields[mode].map((field) => <label className={`scanner-field ${field.type === 'textarea' ? 'field-wide' : ''}`} htmlFor={`${mode}-${field.id}`} key={field.id}>
          <span>{field.label}</span>
          {field.type === 'textarea' ? <textarea id={`${mode}-${field.id}`} value={values[field.id] || ''} onChange={(event) => update(field.id, event.target.value)} onKeyDown={handleKeyDown} placeholder={field.placeholder} rows={field.rows} /> : field.type === 'select' ? <select id={`${mode}-${field.id}`} value={values[field.id] || ''} onChange={(event) => update(field.id, event.target.value)}><option value="">Choose an option…</option>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : <input id={`${mode}-${field.id}`} type={field.type || 'text'} value={values[field.id] || ''} onChange={(event) => update(field.id, event.target.value)} placeholder={field.placeholder} autoComplete="off" spellCheck={false} />}
        </label>)}
      </div>
      <div className="scanner-actions"><button className="btn-scan" type="submit" disabled={scanning}><i className="fas fa-magnifying-glass" aria-hidden="true" /> {scanning ? 'Checking…' : mode === 'url' ? 'Scan Locally' : `Scan ${activeMode.title}`}</button>{mode === 'url' && <span className="scanner-hint">Press <kbd>Enter</kbd> in a text field to scan.</span>}</div>
    </form>
    {progress > 0 && <Progress progress={progress} scanning={scanning} />}
    <ScanResult result={result} />
  </div>;
}
