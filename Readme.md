# CODEX AI Cyber Shield

A responsive phishing-awareness app with ten focused, **rule-based** scan modes. Analysis runs in the browser; submitted links are never opened and text is not sent to third parties.

## Tech stack

- React 19 with JavaScript ES modules
- Vite for local development and production bundling
- Tailwind CSS 4 via the official CLI, plus the existing custom cybersecurity stylesheet
- Native SVG for the small risk-distribution chart
- Node’s built-in test runner for deterministic detection checks

## Requirements and commands

Install Node.js 20.19+ or 22.12+ and npm, then run:

```sh
npm install
npm run dev
```

Vite prints the local URL. Build production files with `npm run build`; `npm run preview` serves the build locally. Run detection tests with `npm test`.

## Features

- Matrix welcome screen with an accessible Enter action and reduced-motion support
- Responsive navigation, hero, threat library, analytics, team profiles and footer
- URL/message, email, spear-phishing, whaling, smishing, vishing, clone-phishing, quishing, angler-phishing, HTTPS-link, and evil-twin checklists
- Explainable low-risk, suspicious, high-risk and invalid results with rule scores where supported
- Keyboard form submission, shared progress presentation, and session/device scan metrics
- Asset-backed original team portraits and profile links

## Privacy and interpretation

The checks use simple client-side heuristics; they are **not a trained AI model, backend, reputation feed, certificate checker, email authentication verifier, QR-image decoder, or wireless-network monitor**. Results cannot establish that a URL, sender, or Wi-Fi network is safe. Text users enter is used in memory for the current check only. Local history stores only the scan mode, risk category/score, timestamp, and a generic label; older history is migrated without retaining its prior submitted input strings.

A low-risk result means that few configured signals were found, not that a link is safe. Independently confirm payment, password-reset, and urgent requests through a known contact channel. The app does not visit links, use `eval`, call outside APIs, or contain API keys.

## Project layout

```text
src/
  App.jsx
  main.jsx
  index.css
  legacy.css
  components/
    MatrixIntro.jsx
    Navbar.jsx
    Scanner.jsx
    ScanResult.jsx
    PhishingTypes.jsx
    ThreatDashboard.jsx
    TeamSection.jsx
  services/
    phishingDetection.js
    phishingDetection.test.js
public/assets/       Original portraits and project images
```

The matrix intro, navigation, scanner forms, result cards, threat library, dashboard, and team profiles are React components. Detection rules are pure functions; form and dashboard state are controlled by React.
