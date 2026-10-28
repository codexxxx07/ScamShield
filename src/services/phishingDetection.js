const SHORTENERS = new Set(['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'rebrand.ly', 'ow.ly', 'is.gd', 'buff.ly', 'cutt.ly', 'shorturl.at', 'tiny.cc', 'rb.gy', 'clck.ru', 'bl.ink', 'shorte.st']);
const SUSPICIOUS_TLDS = new Set(['xyz', 'tk', 'ml', 'ga', 'cf', 'gq', 'pw', 'top', 'click', 'zip', 'mov', 'country', 'kim']);
const KEYWORDS = ['secure', 'account', 'update', 'login', 'verify', 'bank', 'paypal', 'confirm', 'password', 'signin', 'credential', 'reset', 'auth', 'webscr'];
const URGENCY = /\b(urgent|immediately|action required|account (?:locked|suspended)|verify now|limited time|act now|suspended)\b/i;
const CREDENTIALS = /\b(password|passcode|otp|2fa|mfa|sign[ -]?in|log[ -]?in|verify (?:your )?identity)\b/i;
const PAYMENT = /\b(wire transfer|gift card|payment|invoice|bank details|crypto|refund)\b/i;

export function analyzeUrl(input) {
  const raw = String(input ?? '').trim();
  if (raw.length < 4) return { status: 'invalid', score: null, confidence: 'none', reasons: ['Enter a URL or message with at least 4 characters.'] };

  const urls = raw.match(/https?:\/\/[^\s<>"')]+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<>"')]*)?/gi)?.filter(Boolean) ?? [];
  const candidate = urls[0];
  const reasons = [];
  let score = 0;

  if (candidate) {
    let url;
    try {
      url = new URL(/^https?:\/\//i.test(candidate) ? candidate : `http://${candidate}`);
    } catch {
      return { status: 'invalid', score: null, confidence: 'none', reasons: ['The URL could not be parsed; check the input format.'] };
    }
    const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
    const labels = hostname.split('.');
    const registrable = labels.slice(-2).join('.');
    const brandBases = ['microsoft.com', 'office.com', 'live.com', 'google.com', 'gmail.com', 'apple.com', 'icloud.com', 'amazon.com', 'paypal.com', 'okta.com', 'duo.com'];
    const brand = brandBases.find((entry) => hostname.includes(entry.split('.')[0]) && registrable !== entry);

    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) { score += 28; reasons.push('An IP address is used instead of a recognizable domain.'); }
    if (raw.length > 100) { score += 8; reasons.push('The URL or message contains an unusually long link.'); }
    if ([...SHORTENERS].some((host) => hostname === host || hostname.endsWith(`.${host}`))) { score += 18; reasons.push('A URL-shortening service obscures the final destination.'); }
    if (url.username || url.password || raw.includes('@')) { score += 24; reasons.push('An @ sign or embedded credentials may hide the actual host.'); }
    if (labels.length >= 5) { score += 12; reasons.push('The link uses several nested subdomains.'); }
    if (SUSPICIOUS_TLDS.has(labels.at(-1))) { score += 12; reasons.push(`The .${labels.at(-1)} top-level domain is frequently abused in deceptive links.`); }
    if (brand) { score += 28; reasons.push(`The hostname contains the brand-like name “${brand.split('.')[0]}” outside its canonical domain.`); }
    const digitCount = (labels[0].match(/\d/g) || []).length;
    if (labels[0].length > 5 && digitCount / labels[0].length > 0.4) { score += 10; reasons.push('The main domain label contains an unusual number of digits.'); }
    const urlKeywords = KEYWORDS.filter((keyword) => `${hostname}${url.pathname}`.toLowerCase().includes(keyword));
    if (urlKeywords.length) { score += Math.min(14, 6 + (urlKeywords.length - 1) * 4); reasons.push(`The link uses credential-related wording: ${urlKeywords.slice(0, 3).join(', ')}.`); }
    if (url.protocol === 'http:') { score += 8; reasons.push('The link does not use HTTPS (encryption alone would not prove legitimacy).'); }
    if (/%[0-9a-f]{2}/i.test(url.pathname + url.search)) { score += 8; reasons.push('Encoded URL characters make the destination harder to read.'); }
  }

  if (URGENCY.test(raw)) { score += 12; reasons.push('The text uses pressure or urgency to prompt quick action.'); }
  if (CREDENTIALS.test(raw)) { score += 16; reasons.push('The text refers to passwords, sign-in, or verification codes.'); }
  if (PAYMENT.test(raw)) { score += 12; reasons.push('The text requests or refers to financial transactions.'); }
  if (!candidate && !reasons.length) reasons.push('No URL or known high-signal phishing wording was found; text-only checks are limited.');

  score = Math.min(100, score);
  const status = score >= 65 ? 'high-risk' : score >= 30 ? 'suspicious' : 'low-risk';
  return { status, score, confidence: reasons.length >= 3 ? 'moderate' : 'low', reasons: reasons.length ? reasons : ['No configured suspicious patterns were detected.'] };
}

export function analyzeEmail({ from = '', subject = '', body = '', mode = 'email', targetName = '', targetRole = '', to = '' } = {}) {
  const text = `${subject} ${body}`.trim();
  if (!text && !from.trim()) return { status: 'invalid', score: null, confidence: 'none', reasons: ['Add a sender, subject, or message before scanning.'] };
  const reasons = [];
  let score = 0;
  const emailMatch = String(from).match(/^[^\s@]+@([^\s@]+\.[^\s@]+)$/);
  if (!emailMatch && from.trim()) { score += 10; reasons.push('The sender address format could not be confirmed.'); }
  const senderDomain = emailMatch?.[1].toLowerCase();
  const trusted = ['paypal.com', 'google.com', 'microsoft.com', 'apple.com', 'amazon.com'];
  if (senderDomain) {
    const impersonated = trusted.find((domain) => senderDomain.includes(domain.split('.')[0]) && senderDomain !== domain && !senderDomain.endsWith(`.${domain}`));
    if (impersonated) { score += 30; reasons.push(`The sender domain resembles ${impersonated} but is not that domain.`); }
    if (SUSPICIOUS_TLDS.has(senderDomain.split('.').at(-1))) { score += 12; reasons.push('The sender address uses a high-abuse top-level domain.'); }
  }
  const urgencyCount = (text.match(/\b(urgent|immediately|action required|verify|suspended|locked|deadline|act now)\b/gi) || []).length;
  if (urgencyCount) { score += Math.min(18, urgencyCount * 6); reasons.push('The message uses urgency or account-pressure language.'); }
  if (CREDENTIALS.test(text)) { score += 18; reasons.push('The message mentions credentials or verification codes.'); }
  if (PAYMENT.test(text)) { score += 14; reasons.push('The message contains payment or financial request language.'); }
  if (mode === 'spear' && targetName && text.toLowerCase().includes(targetName.toLowerCase())) { score += 8; reasons.push('Personal details make this message more targeted; validate the sender through another channel.'); }
  if (mode === 'whaling') {
    if (/\b(ceo|cfo|cto|coo|president|director|executive)\b/i.test(`${targetRole} ${text}`)) { score += 8; reasons.push('Executive-targeting language is present.'); }
    if (to && senderDomain && to.split('@')[1] && to.split('@')[1].toLowerCase() !== senderDomain) { score += 8; reasons.push('The sender and recipient domains differ; verify any business request independently.'); }
  }
  const links = body.match(/https?:\/\/[^\s<>"')]+/gi) || [];
  for (const link of links) {
    const result = analyzeUrl(link);
    if (result.score && result.score >= 20) { score += 25; reasons.push('A link in the message has suspicious URL patterns.'); break; }
  }
  score = Math.min(100, score);
  return { status: score >= 65 ? 'high-risk' : score >= 30 ? 'suspicious' : 'low-risk', score, confidence: reasons.length > 1 ? 'moderate' : 'low', reasons: reasons.length ? reasons : ['No configured suspicious patterns were detected.'] };
}

const rules = {
  smishing: ({ sender = '', body = '' }) => {
    const result = analyzeEmail({ from: sender.includes('@') ? sender : '', subject: '', body });
    if (sender && !sender.includes('@') && /\b(support|bank|delivery|verify|security)\b/i.test(sender)) { result.score = Math.min(100, result.score + 10); result.reasons.push('The sender label uses a generic authority or service name.'); }
    return { ...result, status: result.score >= 65 ? 'high-risk' : result.score >= 30 ? 'suspicious' : 'low-risk' };
  },
  vishing: ({ claimed = '', purpose = '', details = '', caller = '' }) => {
    const text = `${purpose} ${details}`;
    if (!text.trim() && !claimed.trim()) return { status: 'invalid', score: null, confidence: 'none', reasons: ['Describe the call or the caller’s claim before scanning.'] };
    let score = 0; const reasons = [];
    if (/\b(irs|social security|police|fbi|bank|microsoft|apple|amazon|tech support)\b/i.test(claimed)) { score += 24; reasons.push('The caller claims to represent an authority or major service; caller ID can be spoofed.'); }
    if (/\b(arrest|warrant|lawsuit|disconnect|terminate|urgent|immediately)\b/i.test(text)) { score += 20; reasons.push('Threatening or urgent language pressures the recipient.'); }
    if (/\b(ssn|social security|password|pin|credit card|gift card|wire|transfer)\b/i.test(text)) { score += 28; reasons.push('The call appears to request sensitive details or payment.'); }
    if (/unknown|blocked|private|restricted/i.test(caller)) { score += 10; reasons.push('The caller ID is hidden or restricted.'); }
    return { status: score >= 65 ? 'high-risk' : score >= 30 ? 'suspicious' : 'low-risk', score, confidence: reasons.length > 1 ? 'moderate' : 'low', reasons: reasons.length ? reasons : ['No configured call-scam patterns were detected.'] };
  },
  clone: (input) => analyzeEmail({ ...input, subject: `${input.subject || ''} ${/\b(re|fw|fwd):/i.test(input.subject || '') ? 'forwarded reply' : ''}` }),
  quishing: (input) => {
    const result = analyzeEmail(input);
    const text = `${input.subject || ''} ${input.body || ''}`;
    if (/\b(qr|qr code|scan to|use your camera)\b/i.test(text)) { result.score = Math.min(100, (result.score || 0) + 18); result.reasons.push('The message refers to a QR code; inspect its decoded destination before opening it.'); }
    return { ...result, status: result.score >= 65 ? 'high-risk' : result.score >= 30 ? 'suspicious' : 'low-risk' };
  },
  angler: ({ handle = '', claim = '', message = '' }) => {
    const result = analyzeEmail({ subject: claim, body: message });
    if (/support|help|customer service/i.test(handle) && /\b(dm|private message|password|verify)\b/i.test(message)) { result.score = Math.min(100, (result.score || 0) + 20); result.reasons.push('A support-like account moves the conversation to private messages or asks for verification.'); }
    return { ...result, status: result.score >= 65 ? 'high-risk' : result.score >= 30 ? 'suspicious' : 'low-risk' };
  },
  https: ({ url = '', context = '' }) => {
    if (!url.trim()) return { status: 'invalid', score: null, confidence: 'none', reasons: ['Enter a URL before scanning.'] };
    const result = analyzeUrl(url);
    if (result.status === 'invalid') return result;
    const note = /^https:/i.test(url) ? 'HTTPS encrypts a connection but does not prove that a site is legitimate.' : 'This URL does not use HTTPS.';
    const contextual = context ? analyzeEmail({ body: context }) : null;
    const score = Math.max(result.score || 0, contextual?.score || 0);
    return { ...result, score, status: score >= 65 ? 'high-risk' : score >= 30 ? 'suspicious' : 'low-risk', reasons: [note, ...result.reasons, ...(contextual?.score >= 18 ? contextual.reasons : [])] };
  },
  evilTwin: ({ ssid = '', security = '', signal = '', duplicate = '', publicPlace = '', details = '' }) => {
    if (!ssid.trim()) return { status: 'invalid', score: null, confidence: 'none', reasons: ['Enter the Wi-Fi network name before scanning.'] };
    let score = 0; const reasons = [];
    if (security === 'open') { score += 25; reasons.push('The network is open and does not require a password.'); }
    if (security === 'wep') { score += 22; reasons.push('WEP is outdated and weak.'); }
    if (duplicate === 'yes') { score += 30; reasons.push('A duplicate network name is visible, a possible rogue access point indicator.'); }
    if (duplicate === 'unsure') { score += 8; reasons.push('Duplicate access points have not been ruled out.'); }
    if (publicPlace === 'yes') { score += 8; reasons.push('Public locations can have untrusted lookalike hotspots.'); }
    if (signal === 'strong' && duplicate === 'yes') { score += 10; reasons.push('A much stronger duplicate network could be an impostor.'); }
    if (/password|credit card|payment|verify identity|captive portal/i.test(details)) { score += 18; reasons.push('The connection or portal requests sensitive details.'); }
    return { status: score >= 65 ? 'high-risk' : score >= 30 ? 'suspicious' : 'low-risk', score, confidence: reasons.length > 1 ? 'moderate' : 'low', reasons: reasons.length ? reasons : ['No strong rogue-network indicators were entered; this check cannot inspect nearby radio networks.'] };
  },
};

export function analyzeScan(mode, input) {
  if (mode === 'url') return analyzeUrl(input.text || '');
  if (mode === 'email') return analyzeEmail({ ...input, mode });
  if (mode === 'spear' || mode === 'whaling') {
    const result = analyzeEmail({ ...input, mode });
    if (result.status !== 'invalid') {
      if (mode === 'spear' && !input.targetName) result.reasons.push('No personalization details were supplied; targeted context cannot be evaluated.');
      if (mode === 'whaling' && !input.targetRole) result.reasons.push('No executive role was supplied; executive-specific context cannot be evaluated.');
      const extra = String(input.from ?? '').trim() && String(input.body ?? '').trim() ? 0 : 8;
      if (extra) {
        result.score = Math.min(100, result.score + extra);
        result.reasons.push('Only partial message details were supplied.');
        result.status = result.score >= 65 ? 'high-risk' : result.score >= 30 ? 'suspicious' : 'low-risk';
      }
    }
    return result;
  }
  if (mode === 'clone') {
    const result = analyzeEmail(input);
    const copySignals = /\b(re|fw|fwd):|original message|on .+ wrote:|forwarded message/i.test(`${input.subject || ''} ${input.body || ''}`);
    const links = input.body?.match(/https?:\/\/[^\s<>"')]+/gi) || [];
    if (copySignals) {
      result.score = Math.min(100, result.score + 18);
      result.reasons.push('Reply or forward markers make a cloned message plausible; verify the original sender.');
    } else result.reasons.push('No reply/forward markers were found in the supplied text.');
    if (links.length) {
      const senderDomain = String(input.from || '').split('@')[1]?.toLowerCase();
      const linkHost = (() => { try { return new URL(links[0]).hostname.toLowerCase(); } catch { return ''; } })();
      if (senderDomain && linkHost && !linkHost.endsWith(senderDomain)) {
        result.score = Math.min(100, result.score + 12);
        result.reasons.push('A link destination differs from the sender domain; verify it against the original message.');
      }
    }
    if (links.length > 0) result.reasons.push(`Found ${links.length} link(s); compare each destination with the original message.`);
    return { ...result, status: result.score >= 65 ? 'high-risk' : result.score >= 30 ? 'suspicious' : 'low-risk' };
  }
  if (mode === 'quishing') {
    if (!input.body?.trim() && !input.subject?.trim()) return { status: 'invalid', score: null, confidence: 'none', reasons: ['Enter the QR-related message or a manually decoded URL.'] };
    const result = rules.quishing(input);
    const links = input.body?.match(/https?:\/\/[^\s<>"')]+/gi) || [];
    if (!links.length) result.reasons.push('No decoded URL was provided; image-based QR destinations cannot be inspected here.');
    return result;
  }
  if (mode === 'angler' && !input.message?.trim() && !input.handle?.trim() && !input.claim?.trim()) return { status: 'invalid', score: null, confidence: 'none', reasons: ['Enter the account, claim, or message details before scanning.'] };
  if (!rules[mode]) return { status: 'error', score: null, confidence: 'none', reasons: ['This scan mode is unavailable.'] };
  const values = { ...input };
  const choiceMap = { security: { 'open (no password)': 'open', wep: 'wep', wpa: 'wpa', wpa2: 'wpa2', wpa3: 'wpa3' }, duplicate: { yes: 'yes', no: 'no', 'not sure': 'unsure' }, publicPlace: { yes: 'yes', no: 'no' }, signal: { weak: 'weak', medium: 'medium', strong: 'strong' } };
  Object.entries(choiceMap).forEach(([key, mapping]) => {
    if (values[key]) values[key] = mapping[String(values[key]).toLowerCase()] || values[key].toLowerCase();
  });
  const result = rules[mode](values);
  return { ...result, status: result.score == null ? result.status : result.score >= 65 ? 'high-risk' : result.score >= 30 ? 'suspicious' : 'low-risk' };
}

export const scannerModes = [
  { id: 'email', title: 'Email Phishing', description: 'Inspect sender, subject and message content for impersonation, pressure and credential lures.', icon: 'fa-envelope' },
  { id: 'spear', title: 'Spear Phishing', description: 'Review targeted email context and personalization signals.', icon: 'fa-crosshairs' },
  { id: 'whaling', title: 'Whaling', description: 'Check executive-oriented email for financial urgency and impersonation cues.', icon: 'fa-fish' },
  { id: 'smishing', title: 'Smishing', description: 'Review text messages, sender labels, links and requests for sensitive data.', icon: 'fa-mobile-screen-button' },
  { id: 'vishing', title: 'Vishing', description: 'Assess a phone caller’s claimed identity, threats and requests.', icon: 'fa-phone-volume' },
  { id: 'clone', title: 'Clone Phishing', description: 'Look for altered reply or forwarded messages with suspicious links or attachments.', icon: 'fa-clone' },
  { id: 'quishing', title: 'Quishing', description: 'Assess QR-code messages and manually decoded destinations without opening them.', icon: 'fa-qrcode' },
  { id: 'angler', title: 'Angler Phishing', description: 'Review social support accounts and direct-message tactics.', icon: 'fa-fish-fins' },
  { id: 'https', title: 'HTTPS Phishing', description: 'Inspect a URL; HTTPS is not treated as proof of legitimacy.', icon: 'fa-lock' },
  { id: 'evilTwin', title: 'Evil Twin', description: 'Assess Wi-Fi observations; this form cannot inspect nearby access points.', icon: 'fa-wifi' },
];
