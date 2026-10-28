import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeScan, analyzeUrl } from './phishingDetection.js';

test('URL analysis separates low, suspicious, high-risk and invalid submissions', () => {
  const low = analyzeUrl('https://example.com/about');
  const suspicious = analyzeUrl('http://bit.ly/verify-account');
  const high = analyzeUrl('http://paypal-login-update.xyz@192.168.1.3/secure');
  const invalid = analyzeUrl('bad');
  assert.equal(low.status, 'low-risk');
  assert.ok(low.score < 30);
  assert.equal(suspicious.status, 'suspicious');
  assert.equal(high.status, 'high-risk');
  assert.equal(invalid.status, 'invalid');
  assert.equal(invalid.score, null);
});

test('message rules explain urgency, credential, and suspicious-link indicators without networking', () => {
  const result = analyzeScan('email', {
    from: 'security@paypa1.xyz',
    subject: 'Urgent action required',
    body: 'Verify your password immediately at http://bit.ly/reset',
  });
  assert.equal(result.status, 'high-risk');
  assert.ok(result.reasons.length >= 3);
});

test('all phishing modes return an explicit and bounded result state', () => {
  const samples = {
    spear: { from: 'sender@outside.example', to: 'jane@company.example', targetName: 'Jane', subject: 'Action required', body: 'Jane, sign in to confirm your password at http://bit.ly/login' },
    whaling: { from: 'sender@outside.example', to: 'ceo@company.example', targetRole: 'CEO', subject: 'Urgent wire transfer', body: 'Send a gift card immediately.' },
    smishing: { sender: 'Bank Support', body: 'Urgent verify your account immediately: http://bit.ly/verify' },
    vishing: { caller: 'unknown', claimed: 'IRS', purpose: 'urgent arrest warrant', details: 'Pay fine with gift cards now' },
    clone: { from: 'user@paypal-login.xyz', subject: 'Re: account', body: 'verify now http://paypal-login.xyz' },
    quishing: { from: '', subject: 'Scan QR code now', body: 'Use your camera to scan the QR' },
    angler: { handle: '@brand_support', claim: 'Account help', message: 'DM me and verify your password immediately' },
    https: { url: 'https://secure-paypal-login.xyz/account/verify', context: 'Urgent verification' },
    evilTwin: { ssid: 'Cafe Wi-Fi', security: 'open', duplicate: 'yes', publicPlace: 'yes', signal: 'strong', details: 'Captive portal asks for password' },
  };
  for (const [mode, input] of Object.entries(samples)) {
    const result = analyzeScan(mode, input);
    assert.ok(['low-risk', 'suspicious', 'high-risk', 'invalid', 'error'].includes(result.status), `${mode} status`);
    if (result.score != null) assert.ok(result.score >= 0 && result.score <= 100, `${mode} score`);
    assert.ok(Array.isArray(result.reasons) && result.reasons.length > 0, `${mode} findings`);
  }
  assert.equal(analyzeScan('evilTwin', {}).status, 'invalid');
  assert.equal(analyzeScan('evilTwin', { ssid: 'Office Guest', security: 'Open (no password)', duplicate: 'Yes', publicPlace: 'Yes', signal: 'Strong' }).status, 'high-risk');
  assert.equal(analyzeScan('clone', { from: 'coworker@work.example', subject: 'Re: last item', body: 'See the forwarded message at https://outside.example/update' }).status, 'suspicious');
  assert.ok(analyzeScan('quishing', { subject: 'Scan this QR code', body: 'Use your camera' }).reasons.some((reason) => reason.includes('No decoded URL')));
  assert.equal(analyzeScan('quishing', {}).status, 'invalid');
  assert.ok(analyzeScan('spear', { from: 'sender@company.example', subject: 'Hello', body: 'Please see details' }).reasons.some((reason) => reason.includes('No personalization')));
  assert.ok(analyzeScan('whaling', { from: 'sender@company.example', subject: 'Hello', body: 'Please see details' }).reasons.some((reason) => reason.includes('No executive role')));
  assert.equal(analyzeScan('angler', {}).status, 'invalid');
});

test('untrusted markup stays plain data in rule findings', () => {
  const result = analyzeUrl('https://example.com/<img src=x onerror=alert(1)>');
  assert.equal(result.status, 'low-risk');
  assert.ok(!result.reasons.some((reason) => reason.includes('<img')));
});
