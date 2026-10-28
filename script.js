document.addEventListener("DOMContentLoaded", function () {

  /* ── Hamburger menu ── */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  hamburgerBtn.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── URL input: Enter key + clear button ── */
  const urlInput = document.getElementById("urlInput");
  const urlClear = document.getElementById("urlClear");

  urlInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); scanThreat(); }
  });
  urlInput.addEventListener("input", function () {
    urlClear.style.display = this.value ? "block" : "none";
  });
  if (urlClear) {
    urlClear.addEventListener("click", function () {
      urlInput.value = "";
      urlClear.style.display = "none";
      document.getElementById("result").innerHTML = "";
      const pc = document.getElementById("mainProgressContainer");
      if (pc) pc.style.display = "none";
      urlInput.focus();
    });
  }

  /* ================= MATRIX RAIN ================= */

  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  let letters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let fontSize = 14;
  let columns = canvas.width / fontSize;
  let drops = [];

  for (let i = 0; i < columns; i++) drops[i] = 1;

  function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff99";
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
      let text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  setInterval(drawMatrix, 33);

  window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });

  /* ================= WELCOME TYPING EFFECT ================= */

  const welcomeElement = document.getElementById("welcomeTyping");
  const welcomeText = "WELCOME TO CYBER SHIELD...";
  let welcomeIndex = 0;

  function typeWelcome() {
    if (welcomeIndex < welcomeText.length) {
      welcomeElement.innerHTML += welcomeText.charAt(welcomeIndex);
      welcomeIndex++;
      setTimeout(typeWelcome, 80);
    }
  }
  typeWelcome();

  /* ================= ENTER BUTTON ================= */

  document.getElementById("enterBtn").addEventListener("click", function () {
    const ms = document.getElementById("matrixScreen");
    ms.style.transition = "opacity 0.6s ease";
    ms.style.opacity = "0";
    setTimeout(() => {
      ms.style.display = "none";
      const mc = document.getElementById("mainContent");
      mc.style.display = "flex";
      mc.style.flexDirection = "column";
      document.body.classList.add("main-bg");
      typeHomeText();
    }, 600);
  });

  function typeHomeText() {
    const text = "Protecting College Students in Real-Time";
    const element = document.getElementById("homeTyping");
    let index = 0;
    element.innerHTML = "";
    function typing() {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
        setTimeout(typing, 60);
      }
    }
    typing();
  }

  /* ================= TEAM SECTION ================= */

  const teamNames = document.querySelectorAll(".team-name");
  const card = document.querySelector(".profile-card");
  const profileImage = document.querySelector(".profile-img img");

  teamNames.forEach((member) => {
    member.addEventListener("mouseenter", () => activateMember(member));
    member.addEventListener("click", () => activateMember(member));
    member.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activateMember(member); }
    });
  });

  const sidebar = document.getElementById("dashboardSidebar");
  const sidebarToggle = document.getElementById("dashboardSidebarToggle");
  if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  function activateMember(member) {
    const image = document.getElementById("memberImage");
    const name = document.getElementById("memberName");
    const role = document.getElementById("memberRole");
    const desc = document.getElementById("memberDesc");
    const insta = document.getElementById("instaLink");
    const linkedin = document.getElementById("linkedinLink");
    const github = document.getElementById("githubLink");

    [image, name, role, desc].forEach((el) => el.classList.add("blur-out"));
    card.classList.add("animate");

    setTimeout(() => {
      image.src = member.dataset.img;
      name.innerText = member.dataset.name;
      role.innerText = member.dataset.role;
      desc.innerText = member.dataset.desc;
      insta.href = member.dataset.insta || "#";
      linkedin.href = member.dataset.linkedin || "#";
      github.href = member.dataset.github || "#";

      [image, name, role, desc].forEach((el) => {
        el.classList.remove("blur-out");
        el.classList.add("blur-in");
      });

      profileImage.style.animation = "none";
      card.style.animation = "none";
      void profileImage.offsetWidth;
      void card.offsetWidth;
      profileImage.style.animation = "shakeBeat 0.5s ease";
      card.style.animation = "shakeBeat 0.5s ease";
    }, 250);

    teamNames.forEach((n) => n.classList.remove("active"));
    member.classList.add("active");
  }

  /* ================= RESTORE LOCALSTORAGE ON LOAD ================= */
  restoreFromStorage();

});

/* ================= TOAST NOTIFICATION ================= */

function showToast(msg) {
  let toast = document.getElementById("cyberToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "cyberToast";
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.classList.add("visible");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.classList.remove("visible"); }, 2400);
}

/* ================= INLINE ERROR HELPER ================= */

function showInlineError(elementId, msg) {
  let el = document.getElementById(elementId);
  if (!el) return;
  let err = el.parentElement.querySelector(".inline-scan-error");
  if (!err) {
    err = document.createElement("p");
    err.className = "inline-scan-error";
    err.style.cssText = "color:#ff3355; font-family:monospace; font-size:13px; margin:6px 0 0 0; letter-spacing:1px;";
    el.parentElement.insertBefore(err, el.nextSibling);
  }
  err.innerText = msg;
  clearTimeout(err._timer);
  err._timer = setTimeout(() => { err.innerText = ""; }, 3500);
}

/* ================= SCROLL + LOOP TYPING ================= */

const typingElement = document.getElementById("typingTitle");
const teamSection = document.getElementById("teamSection");

const texts = [
  "MEET THE SQUAD !!!",
  "WE HACK IDEAS,CRAFT CODES,CONQUER SYSTEMS...",
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingStarted = false;

function typeLoop() {
  const currentText = texts[textIndex];
  if (!isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentText.length) setTimeout(() => (isDeleting = true), 1500);
  } else {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }
  }
  let speed = isDeleting ? 50 : 120;
  setTimeout(typeLoop, speed);
}

window.addEventListener("scroll", function () {
  const sectionTop = teamSection.getBoundingClientRect().top;
  if (sectionTop < window.innerHeight - 100 && !typingStarted) {
    typingStarted = true;
    typeLoop();
  }
});

/* ================= LOCALSTORAGE HELPERS ================= */

const LS_KEY = "cyberShieldHistory";

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch (e) { return []; }
}

function saveHistory(history) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(history)); } catch (e) {}
}

function pushScanRecord(input, scanType, riskScore, verdict, timestamp) {
  const history = loadHistory();
  history.unshift({ input, scanType, riskScore, verdict, timestamp });
  // Keep at most 200 records
  if (history.length > 200) history.length = 200;
  saveHistory(history);
}

function restoreFromStorage() {
  const history = loadHistory();
  if (history.length === 0) return;

  // Recalculate counters from stored history
  let safe = 0, risk = 0, total = history.length;
  let riskSum = 0;
  history.forEach(r => {
    if (r.verdict === "Safe") safe++;
    else risk++;
    riskSum += r.riskScore || 0;
  });

  totalScans = total;
  safeCount = safe;
  riskCount = risk;

  // Average risk for the meter
  const avgRisk = total > 0 ? Math.round(riskSum / total) : 0;
  lastRiskLevelPercent = avgRisk;

  // Update displays
  animateCounter("totalScans", totalScans);
  animateCounter("safeCountDisplay", safeCount);
  animateCounter("riskCountDisplay", riskCount);

  if (totalScans > 0) {
    const noData = document.getElementById("noDataText");
    if (noData) noData.style.display = "none";
  }

  // Determine last risk status from most recent scan
  if (history.length > 0) {
    const last = history[0];
    lastRiskStatus = last.verdict;
    lastRiskLevelPercent = last.riskScore || 0;
  }

  updateChart();
  updateRiskUI();

  // Populate logs table (latest first, already stored newest-first)
  const tbody = document.getElementById("logsBody");
  if (tbody) {
    tbody.innerHTML = "";
    history.forEach(r => {
      const tr = document.createElement("tr");
      const cls = r.verdict === "Safe" ? "safe" : r.verdict === "Suspicious" ? "suspicious" : "phishing";
      tr.className = cls;
      tr.innerHTML = `<td>${escapeHtml(r.input)}</td><td>${escapeHtml(r.verdict)}</td><td>${r.riskScore}%</td><td>${escapeHtml(r.timestamp)}</td>`;
      tbody.appendChild(tr);
    });
  }

  // Ensure clear history button exists
  ensureClearHistoryButton();
}

function ensureClearHistoryButton() {
  if (document.getElementById("clearHistoryBtn")) return;
  const logsPanel = document.querySelector(".logs-panel");
  if (!logsPanel) return;

  const btn = document.createElement("button");
  btn.id = "clearHistoryBtn";
  btn.innerHTML = '<i class="fas fa-trash"></i> Clear History';
  btn.style.cssText = `
    background:transparent; border:1px solid #ff3355; color:#ff3355;
    font-family:monospace; font-size:12px; letter-spacing:1px;
    padding:8px 18px; cursor:pointer; margin-top:14px; border-radius:8px;
    display:inline-flex; align-items:center; gap:6px;
    transition:background 0.25s ease, color 0.25s ease;
  `;
  btn.addEventListener("mouseenter", () => { btn.style.background="#ff3355"; btn.style.color="#000"; });
  btn.addEventListener("mouseleave", () => { btn.style.background="transparent"; btn.style.color="#ff3355"; });
  btn.addEventListener("click", clearAllHistory);
  logsPanel.appendChild(btn);
}

function clearAllHistory() {
  localStorage.removeItem(LS_KEY);
  totalScans = 0; safeCount = 0; riskCount = 0;
  lastRiskStatus = "Safe"; lastRiskLevelPercent = 0; currentMeterPercent = 0;

  animateCounter("totalScans", 0);
  animateCounter("safeCountDisplay", 0);
  animateCounter("riskCountDisplay", 0);

  const noData = document.getElementById("noDataText");
  if (noData) noData.style.display = "block";

  const tbody = document.getElementById("logsBody");
  if (tbody) tbody.innerHTML = "";

  updateChart();
  updateRiskUI();
  showToast("History cleared");
}

/* ================= SCAN STATE ================= */

let safeCount = 0;
let riskCount = 0;
let totalScans = 0;
let lastRiskStatus = "Safe";
let lastRiskLevelPercent = 0;
let currentMeterPercent = 0;

/* ================= MAIN URL SCANNER (enhanced rule-based) ================= */

function scanThreat() {
  const input = document.getElementById("urlInput").value.trim();

  if (!input) {
    showInlineError("urlInput", "⚠ Please enter a URL or message to scan.");
    return;
  }
  if (input.length < 4) {
    showInlineError("urlInput", "⚠ Input too short to analyze.");
    return;
  }

  // Show progress container
  const pc = document.getElementById("mainProgressContainer");
  if (pc) pc.style.display = "block";

  const progress = document.getElementById("progressBar");
  progress.style.width = "0%";
  const percentEl = document.getElementById("progressPercent");
  if (percentEl) percentEl.innerText = "0%";

  const resultEl = document.getElementById("result");
  if (resultEl) resultEl.innerHTML = "";

  const analyzingText = document.getElementById("analyzingText");
  if (analyzingText) analyzingText.style.display = "flex";

  startLoadingSimulation(function () {
    const result = analyzeUrl(input);
    displayUrlResult(input, result);
  });
}

/* Rule-based URL analysis engine */
function analyzeUrl(input) {
  let score = 0;
  const triggered = [];

  const raw = input.trim();
  let hostname = "";
  let pathname = "";
  let protocol = "";

  try {
    // Normalise – add scheme if missing so URL constructor works
    const toparse = /^https?:\/\//i.test(raw) ? raw : "http://" + raw;
    const u = new URL(toparse);
    hostname = u.hostname.toLowerCase();
    pathname = u.pathname.toLowerCase();
    protocol = u.protocol;
  } catch (e) {
    hostname = raw.replace(/^https?:\/\//i, "").split("/")[0].toLowerCase();
    protocol = raw.startsWith("https") ? "https:" : "http:";
  }

  // 1. IP address instead of domain
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    score += 20;
    triggered.push("IP address used instead of domain");
  }

  // 2. URL length > 75
  if (raw.length > 75) {
    score += 10;
    triggered.push(`Long URL (${raw.length} chars)`);
  }

  // 3. URL shorteners
  const shorteners = ["bit.ly","tinyurl.com","t.co","goo.gl","rebrand.ly","ow.ly","is.gd","buff.ly","cutt.ly","shorturl.at","tiny.cc","rb.gy","clck.ru","bl.ink","shorte.st"];
  if (shorteners.some(s => hostname.includes(s))) {
    score += 15;
    triggered.push("URL shortener detected");
  }

  // 4. @ symbol
  if (raw.includes("@")) {
    score += 15;
    triggered.push('@ symbol in URL (hides real destination)');
  }

  // 5. Double-slash redirect
  if (/\/\/[^/]/.test(pathname)) {
    score += 10;
    triggered.push("Double-slash redirect in path");
  }

  // 6. Hyphen prefix/suffix in domain
  if (/(^-|-$)/.test(hostname.split(".")[0])) {
    score += 8;
    triggered.push("Hyphen at start/end of domain");
  }

  // 7. Subdomain count > 3
  const subdomainCount = hostname.split(".").length - 2;
  if (subdomainCount > 3) {
    score += 12;
    triggered.push(`Excessive subdomains (${subdomainCount})`);
  }

  // 8. Suspicious TLDs
  const suspTlds = [".xyz",".tk",".ml",".ga",".cf",".gq",".pw",".top",".click",".zip",".mov",".country",".kim"];
  const dotTld = "." + hostname.split(".").pop();
  if (suspTlds.includes(dotTld)) {
    score += 15;
    triggered.push(`Suspicious TLD (${dotTld})`);
  }

  // 9. Phishing keywords in URL
  const phishKeywords = ["secure","account","update","login","verify","bank","paypal","confirm","password","signin","credential","reset","auth","webscr"];
  const foundKeywords = phishKeywords.filter(k => raw.toLowerCase().includes(k));
  if (foundKeywords.length >= 3) {
    score += 20;
    triggered.push(`Multiple phishing keywords: ${foundKeywords.slice(0,4).join(", ")}`);
  } else if (foundKeywords.length >= 1) {
    score += 8;
    triggered.push(`Phishing keyword(s): ${foundKeywords.join(", ")}`);
  }

  // 10. HTTP instead of HTTPS
  if (protocol === "http:") {
    score += 10;
    triggered.push("No HTTPS (unencrypted connection)");
  }

  // 11. Excessive numbers in domain
  const domainPart = hostname.split(".")[0] || "";
  const digitRatio = (domainPart.match(/\d/g) || []).length / (domainPart.length || 1);
  if (digitRatio > 0.4 && domainPart.length > 3) {
    score += 10;
    triggered.push("Excessive numbers in domain name");
  }

  // 12. Hex/percent encoding
  if (/%[0-9a-fA-F]{2}/.test(raw)) {
    score += 10;
    triggered.push("Hex encoding (%XX) in URL");
  }

  // 13. Domain age indicators (newly registered patterns)
  const newDomainPats = [/\d{4,}/, /[a-z]{1,3}\d{4,}/, /xn--/];
  if (newDomainPats.some(p => p.test(domainPart)) && domainPart.length < 8) {
    score += 8;
    triggered.push("Domain appears newly registered or auto-generated");
  }

  // 14. Mismatch: HTTPS keyword in non-HTTPS URL
  if (protocol !== "https:" && foundKeywords.includes("secure")) {
    score += 5;
    triggered.push("Claims 'secure' but does not use HTTPS");
  }

  score = Math.min(100, Math.max(0, score));

  let verdict, statusKey;
  if (score >= 65) {
    verdict = "DANGEROUS";
    statusKey = "Phishing";
  } else if (score >= 35) {
    verdict = "SUSPICIOUS";
    statusKey = "Suspicious";
  } else {
    verdict = "SAFE";
    statusKey = "Safe";
  }

  return { score, triggered, verdict, statusKey };
}

function displayUrlResult(input, result) {
  totalScans++;
  if (result.statusKey === "Safe") safeCount++;
  else riskCount++;

  lastRiskStatus = result.statusKey;
  lastRiskLevelPercent = mapStatusToPercent(result.statusKey, result.score);

  animateCounter("totalScans", totalScans);
  animateCounter("safeCountDisplay", safeCount);
  animateCounter("riskCountDisplay", riskCount);

  const noData = document.getElementById("noDataText");
  if (noData) noData.style.display = "none";

  updateChart();
  updateRiskUI();

  const analyzingText = document.getElementById("analyzingText");
  if (analyzingText) analyzingText.style.display = "none";

  // Build result HTML
  let icon = result.verdict === "DANGEROUS" ? "🚨" : result.verdict === "SUSPICIOUS" ? "⚠️" : "✅";
  let color = result.verdict === "DANGEROUS" ? "#ff3355" : result.verdict === "SUSPICIOUS" ? "#ffd166" : "#00ff99";
  let borderColor = result.verdict === "DANGEROUS" ? "rgba(255,51,85,0.35)" : result.verdict === "SUSPICIOUS" ? "rgba(255,209,102,0.35)" : "rgba(0,255,153,0.35)";
  let bg = result.verdict === "DANGEROUS" ? "rgba(255,51,85,0.06)" : result.verdict === "SUSPICIOUS" ? "rgba(255,209,102,0.06)" : "rgba(0,255,153,0.06)";

  let breakdownHtml = "";
  if (result.triggered.length > 0) {
    breakdownHtml = `<div style="margin-top:10px;font-size:12px;color:#9aa8a1;line-height:1.7;">${result.triggered.map(t => `<span style="display:inline-block;margin-right:12px;">• ${t}</span>`).join("")}</div>`;
  } else {
    breakdownHtml = `<div style="margin-top:10px;font-size:12px;color:#9aa8a1;">• No suspicious patterns detected</div>`;
  }

  const resultEl = document.getElementById("result");
  resultEl.style.background = bg;
  resultEl.style.border = `1px solid ${borderColor}`;
  resultEl.style.boxShadow = `0 0 20px ${borderColor}`;
  resultEl.innerHTML =
    `<span style="color:${color};font-size:15px;font-weight:bold;letter-spacing:1px;">${icon} ${result.verdict} — Risk Score: ${result.score}/100</span>${breakdownHtml}`;

  // Save to localStorage
  const ts = new Date().toLocaleString();
  pushScanRecord(input, "URL", lastRiskLevelPercent, result.statusKey, ts);
  addLogEntry(input, result.statusKey, lastRiskLevelPercent);

  // Auto-scroll to result
  setTimeout(() => {
    document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 300);

  ensureClearHistoryButton();
}

/* ================= PROGRESS BAR with phased steps ================= */

function startLoadingSimulation(idOrCb, callback) {
  const cb = typeof idOrCb === "function" ? idOrCb : callback;
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const progressPercent = document.getElementById("progressPercent");
  const meter = document.getElementById("riskMeter");
  const analyzingText = document.getElementById("analyzingText");
  const panel = document.getElementById("analysisPanel");

  if (meter) meter.classList.add("pulsing");
  if (analyzingText) analyzingText.style.display = "block";
  if (panel) panel.classList.add("scanning");

  // 5 analysis phases mapped to % checkpoints
  const phases = [
    { at: 20,  label: "🔍 Checking URL structure..." },
    { at: 45,  label: "🌐 Analyzing domain reputation..." },
    { at: 70,  label: "🛡 Scanning for phishing patterns..." },
    { at: 90,  label: "🧠 Running threat algorithms..." },
    { at: 100, label: "✅ Finalizing report..." },
  ];

  let width = 0;
  progressBar.style.width = "0%";
  if (progressText) progressText.innerText = phases[0].label;
  if (progressPercent) progressPercent.innerText = "0%";

  // Total duration ~2700ms across 100 steps → ~27ms per tick
  const totalDuration = 2700;
  const tickInterval = totalDuration / 100;
  let phaseIndex = 0;

  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      progressBar.style.width = "100%";
      if (progressPercent) progressPercent.innerText = "100%";
      if (progressText) progressText.innerText = "✅ Scan completed.";
      setTimeout(() => {
        if (meter) meter.classList.remove("pulsing");
        if (analyzingText) analyzingText.style.display = "none";
        if (panel) panel.classList.remove("scanning");
        if (typeof cb === "function") cb();
      }, 500);
    } else {
      width = Math.min(100, width + 1);
      progressBar.style.width = width + "%";
      if (progressPercent) progressPercent.innerText = width + "%";

      // Advance phase label at thresholds
      if (phaseIndex < phases.length && width >= phases[phaseIndex].at) {
        if (progressText) progressText.innerText = phases[phaseIndex].label;
        phaseIndex++;
      }
    }
  }, tickInterval);
}

/* ================= REUSABLE CYBER PROGRESS (sub-scanners) ================= */

function animateCyberProgress(barId, percentId, onComplete) {
  const bar = document.getElementById(barId);
  const percent = percentId ? document.getElementById(percentId) : null;
  if (!bar) {
    if (typeof onComplete === "function") onComplete();
    return;
  }
  bar.style.width = "0%";
  if (percent) percent.innerText = "0%";

  const phases = [
    { at: 20,  label: "🔍 Checking structure..." },
    { at: 45,  label: "🌐 Analyzing patterns..." },
    { at: 70,  label: "🛡 Scanning indicators..." },
    { at: 90,  label: "🧠 Evaluating risk..." },
    { at: 100, label: "✅ Done." },
  ];

  // Find the sibling loading-text element for the bar's wrapper
  const barWrapper = bar.closest(".progress");
  let textEl = null;
  if (barWrapper) {
    const section = barWrapper.closest("section");
    if (section) textEl = section.querySelector(".loading-text");
  }

  let width = 0;
  let phaseIndex = 0;
  const totalDuration = 2700;
  const tickInterval = totalDuration / 100;

  const iv = setInterval(() => {
    if (width >= 100) {
      clearInterval(iv);
      bar.style.width = "100%";
      if (percent) percent.innerText = "100%";
      if (textEl) textEl.innerText = "✅ Scan completed.";
      if (typeof onComplete === "function") setTimeout(onComplete, 400);
    } else {
      width = Math.min(100, width + 1);
      bar.style.width = width + "%";
      if (percent) percent.innerText = width + "%";
      if (phaseIndex < phases.length && width >= phases[phaseIndex].at) {
        if (textEl) textEl.innerText = phases[phaseIndex].label;
        phaseIndex++;
      }
    }
  }, tickInterval);
}

/* ================= CHART.JS ================= */

// Track suspicious count separately
let suspiciousCount = 0;

let chartCtx = document.getElementById("threatChart").getContext("2d");

let threatChart = new Chart(chartCtx, {
  type: "doughnut",
  data: {
    labels: ["Safe", "Suspicious", "Dangerous"],
    datasets: [{
      data: [1, 0, 0],
      backgroundColor: ["#00ff99", "#ffd166", "#ff3355"],
      borderColor: ["rgba(0,255,153,0.3)", "rgba(255,209,102,0.3)", "rgba(255,51,85,0.3)"],
      borderWidth: 1,
    }],
  },
  options: {
    plugins: {
      legend: {
        labels: { color: "#00ff99", font: { family: "monospace" } },
      },
    },
  },
});

function updateChart() {
  // Recount from localStorage for accuracy
  const history = loadHistory();
  let s = 0, sus = 0, d = 0;
  history.forEach(r => {
    if (r.verdict === "Safe") s++;
    else if (r.verdict === "Suspicious") sus++;
    else d++;
  });
  // If nothing stored yet, use in-memory counters
  if (history.length === 0) { s = safeCount; d = riskCount; sus = 0; }
  threatChart.data.datasets[0].data = [s, sus, d];
  threatChart.update();
}

/* ================= RISK UI ================= */

function updateRiskUI() {
  const meter = document.getElementById("riskMeter");
  const meterValue = document.getElementById("meterValue");
  const badge = document.getElementById("riskStatusBadge");
  const detail = document.getElementById("riskStatusDetail");
  const pillPercent = document.getElementById("riskLevelPercent");

  if (meter) {
    const accent = lastRiskStatus === "Phishing" ? "#ff3355" :
                   lastRiskStatus === "Suspicious" ? "#ffd166" : "#00ff99";
    meter.style.setProperty("--accent", accent);
    animateMeterTo(lastRiskLevelPercent, meter, meterValue, pillPercent);
  } else {
    if (meterValue) meterValue.textContent = lastRiskLevelPercent + "%";
    if (pillPercent) pillPercent.textContent = lastRiskLevelPercent + "%";
  }

  if (badge) {
    badge.classList.remove("status-safe", "status-suspicious", "status-phishing");
    if (lastRiskStatus === "Phishing" || lastRiskStatus === "DANGEROUS") {
      badge.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Dangerous';
      badge.classList.add("status-phishing");
      if (detail) detail.textContent = "High risk indicators detected";
    } else if (lastRiskStatus === "Suspicious" || lastRiskStatus === "SUSPICIOUS") {
      badge.innerHTML = '<i class="fas fa-circle-exclamation"></i> Suspicious';
      badge.classList.add("status-suspicious");
      if (detail) detail.textContent = "Review recommended";
    } else {
      badge.innerHTML = '<i class="fas fa-circle-check"></i> Safe';
      badge.classList.add("status-safe");
      if (detail) detail.textContent = "No active threats";
    }
  }
}

/* ================= HELPERS ================= */

function mapStatusToPercent(status, score) {
  if (status === "Phishing" || status === "DANGEROUS") {
    const base = typeof score === "number" ? Math.max(score, 75) : 85;
    return Math.min(100, base);
  }
  if (status === "Suspicious" || status === "SUSPICIOUS") {
    const base = typeof score === "number" ? score : 50;
    return Math.max(35, Math.min(70, base));
  }
  const base = typeof score === "number" ? score : 0;
  return Math.min(25, Math.max(0, base));
}

function addLogEntry(url, status, percent) {
  const tbody = document.getElementById("logsBody");
  if (!tbody) return;
  const tr = document.createElement("tr");
  const ts = new Date().toLocaleString();
  const cls = status === "Safe" ? "safe" : status === "Suspicious" ? "suspicious" : "phishing";
  tr.className = "new " + cls;
  tr.innerHTML = `<td>${escapeHtml(url)}</td><td>${escapeHtml(status)}</td><td>${percent}%</td><td>${ts}</td>`;
  tbody.prepend(tr);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

function animateMeterTo(target, meterEl, valueEl, pillEl) {
  const start = currentMeterPercent;
  const end = target;
  const duration = 600;
  const startTime = performance.now();
  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
  function frame(now) {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = start + (end - start) * easeOutCubic(t);
    meterEl.style.setProperty("--risk", eased);
    if (valueEl) valueEl.textContent = Math.round(eased) + "%";
    if (pillEl) pillEl.textContent = Math.round(eased) + "%";
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      currentMeterPercent = end;
    }
  }
  requestAnimationFrame(frame);
}

function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let count = 0;
  const speed = 20;
  const increment = Math.max(1, Math.ceil(target / 30));
  const interval = setInterval(() => {
    count += increment;
    if (count >= target) {
      el.innerText = target;
      clearInterval(interval);
    } else {
      el.innerText = count;
    }
  }, speed);
}

/* ================= SHARED DISPLAY HELPERS ================= */

function normalizeEmail(addr) {
  const m = String(addr).match(/<?([A-Z0-9._%+-]+)@([A-Z0-9.-]+\.[A-Z]{2,})>?/i);
  if (!m) return null;
  return { local: m[1].toLowerCase(), domain: m[2].toLowerCase() };
}

function getBaseDomain(host) {
  if (!host) return null;
  const parts = host.split(".").filter(Boolean);
  if (parts.length <= 2) return host;
  return parts.slice(-2).join(".");
}

function tokenSimilarity(a, b) {
  a = (a || "").toLowerCase();
  b = (b || "").toLowerCase();
  if (!a || !b) return 0;
  if (a === b) return 1;
  const bigrams = (s) => {
    const set = new Set();
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
    return set;
  };
  const A = bigrams(a), B = bigrams(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union ? inter / union : 0;
}

const HIGH_VALUE_BRANDS = [
  "microsoft.com", "office.com", "live.com", "google.com", "gmail.com",
  "apple.com", "icloud.com", "amazon.com", "paypal.com", "okta.com", "duo.com",
];

/* Generic result displayer used by all sub-scanners */
function displayGenericResult(resultElId, logPrefix, result) {
  totalScans += 1;
  if (result.safeInc) safeCount++;
  if (result.riskInc) riskCount++;

  lastRiskStatus = result.label.includes("HIGH RISK") ? "Phishing" :
                   result.label.includes("SUSPICIOUS") ? "Suspicious" : "Safe";
  lastRiskLevelPercent = mapStatusToPercent(lastRiskStatus, result.score);

  animateCounter("totalScans", totalScans);
  animateCounter("safeCountDisplay", safeCount);
  animateCounter("riskCountDisplay", riskCount);

  const noData = document.getElementById("noDataText");
  if (noData) noData.style.display = "none";

  updateChart();
  updateRiskUI();

  const resultEl = document.getElementById(resultElId);
  if (resultEl) {
    const isHigh = result.label.includes("HIGH RISK");
    const isSusp = result.label.includes("SUSPICIOUS");
    const color  = isHigh ? "#ff3355" : isSusp ? "#ffd166" : "#00ff99";
    const border = isHigh ? "rgba(255,51,85,0.35)" : isSusp ? "rgba(255,209,102,0.35)" : "rgba(0,255,153,0.35)";
    const bg     = isHigh ? "rgba(255,51,85,0.06)"  : isSusp ? "rgba(255,209,102,0.06)" : "rgba(0,255,153,0.06)";
    resultEl.style.background  = bg;
    resultEl.style.border      = `1px solid ${border}`;
    resultEl.style.boxShadow   = `0 0 20px ${border}`;
    const reasonsHtml = result.reasons.length
      ? `<div style="margin-top:10px;font-size:12px;color:#9aa8a1;line-height:1.7;">${result.reasons.map(r => `<span style="display:inline-block;margin-right:12px;">• ${r}</span>`).join("")}</div>`
      : "";
    resultEl.innerHTML = `<span style="color:${color};font-size:15px;font-weight:bold;letter-spacing:1px;">${result.label} (Score: ${result.score})</span>${reasonsHtml}`;
    setTimeout(() => { resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 300);
  }

  addLogEntry(logPrefix, lastRiskStatus, lastRiskLevelPercent);

  const ts = new Date().toLocaleString();
  pushScanRecord(logPrefix, result.scanType || "Scan", lastRiskLevelPercent, lastRiskStatus, ts);
  ensureClearHistoryButton();
}

/* ================= CARD CLICK EVENT LISTENERS ================= */

const scannerMap = {
  "Email Phishing": "emailScanner",
  "Spear Phishing": "spearScanner",
  "Whaling": "whalingScanner",
  "Smishing": "smishingScanner",
  "Vishing": "vishingScanner",
  "Clone Phishing": "cloneScanner",
  "Quishing": "quishingScanner",
  "Angler Phishing": "anglerScanner",
  "HTTPS Phishing": "httpsScanner",
  "Evil Twin": "evilTwinScanner",
};

document.querySelectorAll(".card").forEach((card) => {
  const key = (card.dataset.type || card.textContent).trim();
  if (scannerMap[key]) {
    card.addEventListener("click", () => {
      hideAllScanners();
      const target = document.getElementById(scannerMap[key]);
      if (target) {
        target.style.display = "block";
        setTimeout(() => { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 80);
      }
    });
  }
});

/* ================= MASTER showUrlScanner ================= */

window.showUrlScanner = function () {
  hideAllScanners();
  const s = document.getElementById("scanner");
  if (s) {
    s.style.display = "block";
    setTimeout(() => { s.scrollIntoView({ behavior: "smooth", block: "start" }); }, 80);
  }
};

function hideAllScanners() {
  const ids = ["emailScanner","spearScanner","whalingScanner","smishingScanner",
                "vishingScanner","cloneScanner","quishingScanner","anglerScanner",
                "httpsScanner","evilTwinScanner"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
  document.getElementById("scanner").style.display = "none";
}

/* ================= EMAIL ANALYSIS ENGINE ================= */

function scanEmail() {
  const from = document.getElementById("emailFrom").value.trim();
  const subject = document.getElementById("emailSubject").value.trim();
  const body = document.getElementById("emailBody").value.trim();
  if (!from && !subject && !body) {
    showInlineError("emailFrom", "⚠ Please fill in at least one field.");
    return;
  }
  animateCyberProgress("emailProgressBar", "emailProgressPercent", function () {
    const result = analyzeEmailContent(from, subject, body);
    result.scanType = "Email";
    displayGenericResult("emailResult", "email://" + (normalizeEmail(from)?.domain || from || "-"), result);
  });
}

function analyzeEmailContent(from, subject, body) {
  let score = 0;
  const reasons = [];

  const fromParsed = normalizeEmail(from);
  if (!fromParsed) { score += 15; reasons.push("Invalid or missing From address"); }

  if (fromParsed) {
    const fromBase = getBaseDomain(fromParsed.domain);
    for (const brand of HIGH_VALUE_BRANDS) {
      const brandBase = getBaseDomain(brand);
      const sim = tokenSimilarity(fromBase, brandBase);
      if (sim > 0.55 && fromBase !== brandBase) {
        score += 20;
        reasons.push(`From domain mimics ${brandBase} (actually ${fromBase})`);
        break;
      }
    }
    const tld = fromParsed.domain.split(".").pop();
    if (["zip","mov","top","xyz","click","country","kim","gq","tk","cf"].includes(tld)) {
      score += 8; reasons.push(`Risky TLD .${tld}`);
    }
    // Mismatched reply-to (simulated)
    if (fromParsed.local.includes("noreply") || fromParsed.local.includes("no-reply")) {
      score += 6; reasons.push("No-reply sender — reply-to mismatch risk");
    }
  }

  const urgentPats = [/\burgent\b/i,/\bimmediately\b/i,/\baction required\b/i,/\baccount (?:locked|suspended)\b/i,/\bverify\b/i,/\breset\b/i,/\bsecurity alert\b/i,/\bunauthorized\b/i,/\bact now\b/i,/\bverify immediately\b/i];
  const urgentHits = urgentPats.filter(r => r.test(subject) || r.test(body)).length;
  if (urgentHits >= 2) { score += 12; reasons.push(`Urgent language (${urgentHits} indicators)`); }
  else if (urgentHits === 1) { score += 6; reasons.push("Some urgency language"); }

  const credPats = [/\bpassword\b/i,/\bpasscode\b/i,/\bOTP\b/i,/\b2fa\b/i,/\bmfa\b/i,/\blog\s*in\b/i,/\bsign\s*in\b/i,/\bverify (?:your )?identity\b/i];
  const credHits = credPats.filter(r => r.test(subject) || r.test(body)).length;
  if (credHits >= 2) { score += 18; reasons.push(`Credential/OTP language (${credHits})`); }
  else if (credHits === 1) { score += 10; reasons.push("Possible credential language"); }

  const payPats = [/\binvoice\b/i,/\bwire\b/i,/\bACH\b/i,/\bpayment\b/i,/\bgift card\b/i,/\bcrypto\b/i];
  const payHits = payPats.filter(r => r.test(subject) || r.test(body)).length;
  if (payHits >= 2) { score += 10; reasons.push(`Payment/invoice lure (${payHits})`); }
  else if (payHits === 1) { score += 5; reasons.push("Possible payment lure"); }

  const urlRegex = /\bhttps?:\/\/[^\s<>"')]+/gi;
  const urls = body.match(urlRegex) || [];
  if (urls.length >= 3) score += 5;
  for (const u of urls) {
    try {
      const url = new URL(u);
      const base = getBaseDomain(url.hostname.toLowerCase());
      if (fromParsed && base && getBaseDomain(fromParsed.domain) !== base) {
        score += 6; reasons.push(`Link domain (${base}) differs from sender`); break;
      }
    } catch (e) {}
  }

  score = Math.min(100, Math.max(0, score));
  let label, safeInc = 0, riskInc = 0;
  if (score >= 50) { label = "⚠ HIGH RISK – Phishing Indicators Found"; riskInc = 1; }
  else if (score >= 20) { label = "⚠ SUSPICIOUS – Review Carefully"; riskInc = 1; }
  else { label = "✅ SAFE – No obvious signs"; safeInc = 1; }
  return { score, reasons, label, safeInc, riskInc };
}

/* ================= SPEAR PHISHING ================= */

function scanSpear() {
  const from = document.getElementById("spearFrom").value.trim();
  const to = document.getElementById("spearTo").value.trim();
  const recipientName = document.getElementById("spearName").value.trim().toLowerCase();
  const subject = document.getElementById("spearSubject").value.trim();
  const body = document.getElementById("spearBody").value.trim();
  if (!from && !body) { showInlineError("spearFrom", "⚠ Please fill in the sender and body."); return; }
  animateCyberProgress("spearProgressBar", "spearProgressPercent", function () {
    const result = analyzeSpearContent(from, to, recipientName, subject, body);
    result.scanType = "Spear Phishing";
    displayGenericResult("spearResult", "spear://" + (normalizeEmail(from)?.domain || from || "-"), result);
  });
}

function analyzeSpearContent(from, to, recipientName, subject, body) {
  let score = 0;
  const reasons = [];
  const fromParsed = normalizeEmail(from);
  if (!fromParsed) { score += 15; reasons.push("Invalid or missing From address"); }

  if (fromParsed) {
    const fromBase = getBaseDomain(fromParsed.domain);
    for (const brand of HIGH_VALUE_BRANDS) {
      const brandBase = getBaseDomain(brand);
      const sim = tokenSimilarity(fromBase, brandBase);
      if (sim > 0.55 && fromBase !== brandBase) { score += 20; reasons.push(`From domain mimics ${brandBase}`); break; }
    }
    const tld = fromParsed.domain.split(".").pop();
    if (["zip","mov","top","xyz","click","country","kim","gq","tk","cf"].includes(tld)) { score += 8; reasons.push(`Risky TLD .${tld}`); }
  }

  const fullText = (subject + " " + body).toLowerCase();
  if (recipientName && fullText.includes(recipientName)) {
    reasons.push("Email includes recipient's name (personalized — higher spear risk)");
    score += 8;
  } else if (recipientName) {
    score += 5; reasons.push("Recipient name not found in email body");
  }

  const urgentPats = [/\burgent\b/i,/\bimmediately\b/i,/\baction required\b/i,/\bverify\b/i,/\breset\b/i,/\bsecurity alert\b/i,/\bunauthorized\b/i];
  const urgentHits = urgentPats.filter(r => r.test(subject) || r.test(body)).length;
  if (urgentHits >= 2) { score += 12; reasons.push(`Urgency language (${urgentHits})`); }
  else if (urgentHits === 1) { score += 6; reasons.push("Some urgency language"); }

  const credPats = [/\bpassword\b/i,/\bOTP\b/i,/\b2fa\b/i,/\bsign\s*in\b/i,/\bverify (?:your )?identity\b/i];
  const credHits = credPats.filter(r => r.test(subject) || r.test(body)).length;
  if (credHits >= 2) { score += 18; reasons.push(`Credential language (${credHits})`); }
  else if (credHits === 1) { score += 10; reasons.push("Possible credential language"); }

  const urlRegex = /\bhttps?:\/\/[^\s<>"')]+/gi;
  const urls = body.match(urlRegex) || [];
  for (const u of urls) {
    try {
      const url = new URL(u);
      const base = getBaseDomain(url.hostname.toLowerCase());
      if (fromParsed && base && getBaseDomain(fromParsed.domain) !== base) { score += 6; reasons.push(`Link domain (${base}) differs from sender`); break; }
    } catch (e) {}
  }

  score = Math.min(100, Math.max(0, score));
  let label, safeInc = 0, riskInc = 0;
  if (score >= 60) { label = "⚠ HIGH RISK – Spear Phishing Indicators Strong"; riskInc = 1; }
  else if (score >= 30) { label = "⚠ SUSPICIOUS – Targeted Email? Review Carefully"; riskInc = 1; }
  else { label = "✅ SAFE – Low Risk of Spear Phishing"; safeInc = 1; }
  return { score, reasons, label, safeInc, riskInc };
}

/* ================= WHALING ================= */

function scanWhaling() {
  const from = document.getElementById("whaleFrom").value.trim();
  const to = document.getElementById("whaleTo").value.trim();
  const targetName = document.getElementById("whaleTargetName").value.trim().toLowerCase();
  const targetRole = document.getElementById("whaleTargetRole").value.trim().toLowerCase();
  const subject = document.getElementById("whaleSubject").value.trim();
  const body = document.getElementById("whaleBody").value.trim();
  if (!from && !body) { showInlineError("whaleFrom", "⚠ Please fill in the sender and body."); return; }
  animateCyberProgress("whaleProgressBar", "whaleProgressPercent", function () {
    const result = analyzeWhalingContent(from, to, targetName, targetRole, subject, body);
    result.scanType = "Whaling";
    displayGenericResult("whaleResult", "whale://" + (normalizeEmail(from)?.domain || from || "-"), result);
  });
}

function analyzeWhalingContent(from, to, targetName, targetRole, subject, body) {
  let score = 0;
  const reasons = [];
  const fromParsed = normalizeEmail(from);
  if (!fromParsed) { score += 15; reasons.push("Invalid or missing From address"); }

  if (fromParsed) {
    const fromBase = getBaseDomain(fromParsed.domain);
    for (const brand of HIGH_VALUE_BRANDS) {
      const brandBase = getBaseDomain(brand);
      const sim = tokenSimilarity(fromBase, brandBase);
      if (sim > 0.55 && fromBase !== brandBase) { score += 20; reasons.push(`From domain mimics ${brandBase}`); break; }
    }
    const tld = fromParsed.domain.split(".").pop();
    if (["zip","mov","top","xyz","click","country","kim","gq","tk","cf"].includes(tld)) { score += 8; reasons.push(`Risky TLD .${tld}`); }
  }

  const toParsed = normalizeEmail(to);
  if (fromParsed && toParsed && getBaseDomain(fromParsed.domain) !== getBaseDomain(toParsed.domain)) {
    score += 15; reasons.push("External sender targeting internal executive");
  }

  const fullText = (subject + " " + body).toLowerCase();
  const execRoles = ["ceo","cfo","cto","coo","president","director","executive","vp","vice president"];
  const roleHits = execRoles.filter(r => fullText.includes(r)).length;
  if (roleHits > 0) { score += 10; reasons.push(`Executive role mentioned (${roleHits}x)`); }

  if (targetName && fullText.includes(targetName)) { reasons.push("Target's name present (personalized)"); }
  else if (targetName) { score += 8; reasons.push("Target's name not in email body"); }

  const urgentPats = [/\burgent\b/i,/\bimmediately\b/i,/\bmandatory\b/i,/\bdeadline\b/i,/\bconfidential\b/i,/\bwire\b/i,/\btransfer\b/i];
  const urgentHits = urgentPats.filter(r => r.test(subject) || r.test(body)).length;
  if (urgentHits >= 2) { score += 15; reasons.push(`Urgent/financial language (${urgentHits})`); }
  else if (urgentHits === 1) { score += 7; reasons.push("Some urgency/financial language"); }

  const payPats = [/\bwire\b/i,/\btransfer\b/i,/\bgift card\b/i,/\binvoice\b/i,/\bpayment\b/i];
  const payHits = payPats.filter(r => r.test(subject) || r.test(body)).length;
  if (payHits >= 2) { score += 15; reasons.push(`Financial request keywords (${payHits})`); }
  else if (payHits === 1) { score += 8; reasons.push("Possible financial request"); }

  if (/\battach/i.test(fullText)) { score += 5; reasons.push("Attachment mentioned"); }

  score = Math.min(100, Math.max(0, score));
  let label, safeInc = 0, riskInc = 0;
  if (score >= 65) { label = "⚠ HIGH RISK – Whaling Indicators Strong"; riskInc = 1; }
  else if (score >= 35) { label = "⚠ SUSPICIOUS – Potential Executive Targeting"; riskInc = 1; }
  else { label = "✅ SAFE – Low Risk of Whaling"; safeInc = 1; }
  return { score, reasons, label, safeInc, riskInc };
}

/* ================= SMISHING ================= */

function scanSmishing() {
  const sender = document.getElementById("smsSender").value.trim();
  const body = document.getElementById("smsBody").value.trim();
  if (!body) { showInlineError("smsBody", "⚠ Please enter the SMS message content."); return; }
  animateCyberProgress("smsProgressBar", "smsProgressPercent", function () {
    const result = analyzeSmishingContent(sender, "", body);
    result.scanType = "Smishing";
    displayGenericResult("smsResult", "sms://" + (sender || "-"), result);
  });
}

function analyzeSmishingContent(sender, recipient, body) {
  let score = 0;
  const reasons = [];

  if (sender) {
    const genericNames = ["bank","amazon","paypal","apple","google","microsoft","netflix","irs","fedex","ups","dhl"];
    if (genericNames.some(n => sender.toLowerCase().includes(n))) {
      score += 10; reasons.push("Sender uses a generic brand name");
    }
    const brandNames = ["paypal","amazon","apple","google","microsoft","netflix","bank","irs"];
    const senderLower = sender.toLowerCase();
    for (const brand of brandNames) {
      if (senderLower.includes(brand) && senderLower !== brand) {
        score += 15; reasons.push(`Sender impersonates "${brand}"`); break;
      }
    }
  } else { score += 5; reasons.push("No sender information"); }

  const urgentPats = [/\burgent\b/i,/\bimmediately\b/i,/\blocked\b/i,/\bsuspended\b/i,/\bverify\b/i,/\bconfirm\b/i,/\bclaim\b/i,/\bprize\b/i,/\bwon\b/i,/\bgift\b/i,/\bOTP\b/i,/\bbank\b/i];
  const urgentHits = urgentPats.filter(r => r.test(body)).length;
  if (urgentHits >= 3) { score += 18; reasons.push(`Multiple urgency/bait keywords (${urgentHits})`); }
  else if (urgentHits >= 1) { score += 9; reasons.push(`Urgency/bait keywords (${urgentHits})`); }

  const urlRegex = /\bhttps?:\/\/[^\s<>"')]+/gi;
  const urls = body.match(urlRegex) || [];
  if (urls.length > 0) {
    score += 10; reasons.push("Message contains a link");
    const shorteners = ["bit.ly","tinyurl.com","t.co","goo.gl","rebrand.ly","ow.ly","is.gd","buff.ly","cutt.ly","shorturl.at"];
    for (const u of urls) {
      try {
        const url = new URL(u);
        const host = url.hostname.toLowerCase();
        if (shorteners.some(s => host.includes(s))) { score += 12; reasons.push(`URL shortener (${host}) in SMS`); break; }
      } catch (e) {}
    }
  } else { reasons.push("No links detected (less typical for smishing)"); }

  const sensitivePats = [/\bpassword\b/i,/\bssn\b/i,/\bcredit card\b/i,/\bpin\b/i,/\baccount number\b/i,/\bclick here\b/i];
  const sensitiveHits = sensitivePats.filter(r => r.test(body)).length;
  if (sensitiveHits >= 2) { score += 15; reasons.push(`Sensitive info requested (${sensitiveHits})`); }
  else if (sensitiveHits === 1) { score += 8; reasons.push("Possible sensitive info request"); }

  score = Math.min(100, Math.max(0, score));
  let label, safeInc = 0, riskInc = 0;
  if (score >= 60) { label = "⚠ HIGH RISK – Smishing Indicators Strong"; riskInc = 1; }
  else if (score >= 30) { label = "⚠ SUSPICIOUS – Potential SMS Scam"; riskInc = 1; }
  else { label = "✅ SAFE – Low Risk of Smishing"; safeInc = 1; }
  return { score, reasons, label, safeInc, riskInc };
}

/* ================= VISHING ================= */

function scanVishing() {
  const callerId = document.getElementById("vishCallerId").value.trim();
  const claimedIdentity = document.getElementById("vishClaimedIdentity").value.trim();
  const callPurpose = document.getElementById("vishCallPurpose").value.trim();
  const details = document.getElementById("vishDetails").value.trim();
  if (!claimedIdentity && !callPurpose && !details) { showInlineError("vishCallerId", "⚠ Please describe the call details."); return; }
  animateCyberProgress("vishProgressBar", "vishProgressPercent", function () {
    const result = analyzeVishingContent(callerId, claimedIdentity, callPurpose, details);
    result.scanType = "Vishing";
    displayGenericResult("vishResult", "call://" + (callerId || claimedIdentity || "-"), result);
  });
}

function analyzeVishingContent(callerId, claimedIdentity, callPurpose, details) {
  let score = 0;
  const reasons = [];
  const fullText = (callPurpose + " " + details).toLowerCase();

  if (callerId) {
    if (/^\+|^00/.test(callerId)) { score += 10; reasons.push("International prefix — common in vishing"); }
    if (/unknown|blocked|private|restricted/i.test(callerId)) { score += 12; reasons.push("Caller ID is hidden/spoofed"); }
  } else { score += 5; reasons.push("No caller ID provided"); }

  const authorityList = ["irs","tax","social security","ssa","fbi","police","sheriff","bank","credit union","paypal","amazon","apple","microsoft","utility","tech support"];
  const claimedLower = (claimedIdentity || "").toLowerCase();
  let impersonated = false;
  for (const auth of authorityList) {
    if (claimedLower.includes(auth)) { impersonated = true; score += 20; reasons.push(`Caller claims to be from "${auth}" — high risk`); break; }
  }
  if (!impersonated && claimedIdentity) { score += 5; reasons.push("Caller claims an unrecognized identity"); }

  const urgencyPats = [/\burgent\b/i,/\bimmediately\b/i,/\barrest\b/i,/\bwarrant\b/i,/\blawsuit\b/i,/\bdisconnect\b/i,/\bterminate\b/i,/\bvirus\b/i];
  const urgencyHits = urgencyPats.filter(r => r.test(fullText)).length;
  if (urgencyHits >= 2) { score += 15; reasons.push(`Urgency/threat language (${urgencyHits})`); }
  else if (urgencyHits === 1) { score += 7; reasons.push("Some urgency/threat language"); }

  const sensitivePats = [/\bsocial security\b/i,/\bssn\b/i,/\bcredit card\b/i,/\bbank account\b/i,/\bpin\b/i,/\bpassword\b/i,/\bgift card\b/i,/\bitunes card\b/i];
  const sensitiveHits = sensitivePats.filter(r => r.test(fullText)).length;
  if (sensitiveHits >= 2) { score += 20; reasons.push(`Sensitive info requested (${sensitiveHits})`); }
  else if (sensitiveHits === 1) { score += 10; reasons.push("Possible sensitive info request"); }

  const paymentPats = [/\bwire\b/i,/\btransfer\b/i,/\bgift card\b/i,/\bfine\b/i,/\btax\b/i,/\bbill\b/i];
  const paymentHits = paymentPats.filter(r => r.test(fullText)).length;
  if (paymentHits >= 2) { score += 15; reasons.push(`Payment demands (${paymentHits})`); }
  else if (paymentHits === 1) { score += 7; reasons.push("Possible payment demand"); }

  const lurePats = ["suspended","locked","compromised","fraud","virus","refund","prize","won","lottery"];
  for (const lure of lurePats) {
    if (fullText.includes(lure)) { score += 8; reasons.push(`Call purpose mentions "${lure}" — common lure`); break; }
  }

  score = Math.min(100, Math.max(0, score));
  let label, safeInc = 0, riskInc = 0;
  if (score >= 65) { label = "⚠ HIGH RISK – Vishing Indicators Strong"; riskInc = 1; }
  else if (score >= 35) { label = "⚠ SUSPICIOUS – Potential Voice Scam"; riskInc = 1; }
  else { label = "✅ SAFE – Low Risk of Vishing"; safeInc = 1; }
  return { score, reasons, label, safeInc, riskInc };
}

/* ================= CLONE PHISHING ================= */

function scanClone() {
  const from = document.getElementById("cloneFrom").value.trim();
  const subject = document.getElementById("cloneSubject").value.trim();
  const body = document.getElementById("cloneBody").value.trim();
  if (!from && !body) { showInlineError("cloneFrom", "⚠ Please fill in the sender and body."); return; }
  animateCyberProgress("cloneProgressBar", "cloneProgressPercent", function () {
    const result = analyzeCloneContent(from, subject, body);
    result.scanType = "Clone Phishing";
    displayGenericResult("cloneResult", "clone://" + (normalizeEmail(from)?.domain || from || "-"), result);
  });
}

function analyzeCloneContent(from, subject, body) {
  let score = 0;
  const reasons = [];
  const fullText = (subject + " " + body).toLowerCase();

  const fromParsed = normalizeEmail(from);
  if (!fromParsed) { score += 15; reasons.push("Invalid or missing From address"); }
  else {
    const fromBase = getBaseDomain(fromParsed.domain);
    for (const brand of HIGH_VALUE_BRANDS) {
      const brandBase = getBaseDomain(brand);
      const sim = tokenSimilarity(fromBase, brandBase);
      if (sim > 0.55 && fromBase !== brandBase) { score += 20; reasons.push(`From domain mimics ${brandBase}`); break; }
    }
    const tld = fromParsed.domain.split(".").pop();
    if (["zip","mov","top","xyz","click","country","kim","gq","tk","cf"].includes(tld)) { score += 8; reasons.push(`Risky TLD .${tld}`); }
  }

  const replyIndicators = [/^re:/i,/^fwd:/i,/^fw:/i,/>.*wrote:/i,/on.*wrote:/i,/---original message---/i,/from:.*sent:/i];
  if (replyIndicators.some(p => p.test(subject) || p.test(body))) { score += 15; reasons.push("Reply/forward markers (clone indicator)"); }
  else { reasons.push("No reply/forward markers detected"); }

  const urlRegex = /\bhttps?:\/\/[^\s<>"')]+/gi;
  const urls = body.match(urlRegex) || [];
  if (urls.length > 0) {
    score += 10; reasons.push(`Contains ${urls.length} link(s) — verify authenticity`);
    for (const u of urls) {
      try {
        const url = new URL(u);
        const base = getBaseDomain(url.hostname.toLowerCase());
        if (fromParsed && base && getBaseDomain(fromParsed.domain) !== base) { score += 8; reasons.push(`Link domain (${base}) differs from sender`); break; }
      } catch (e) {}
    }
  } else { reasons.push("No links found"); }

  if (/\battach/i.test(fullText)) { score += 8; reasons.push("Attachment mentioned"); }

  const urgentPats = [/\burgent\b/i,/\bimmediately\b/i,/\bverify\b/i,/\bupdate\b/i,/\bsecurity\b/i];
  const urgentHits = urgentPats.filter(r => r.test(fullText)).length;
  if (urgentHits >= 2) { score += 10; reasons.push(`Urgency language (${urgentHits})`); }
  else if (urgentHits === 1) { score += 5; reasons.push("Some urgency language"); }

  // Slight URL variation patterns (clone phishing hallmark)
  for (const u of urls) {
    try {
      const parsed = new URL(u);
      const host = parsed.hostname.toLowerCase();
      for (const brand of HIGH_VALUE_BRANDS) {
        const brandBase = getBaseDomain(brand);
        const sim = tokenSimilarity(getBaseDomain(host), brandBase);
        if (sim > 0.4 && sim < 1 && getBaseDomain(host) !== brandBase) {
          score += 12; reasons.push(`Link URL resembles ${brandBase} with slight variation`); break;
        }
      }
    } catch (e) {}
  }

  score = Math.min(100, Math.max(0, score));
  let label, safeInc = 0, riskInc = 0;
  if (score >= 60) { label = "⚠ HIGH RISK – Clone Phishing Indicators Strong"; riskInc = 1; }
  else if (score >= 30) { label = "⚠ SUSPICIOUS – Potential Clone Email"; riskInc = 1; }
  else { label = "✅ SAFE – Low Risk of Clone Phishing"; safeInc = 1; }
  return { score, reasons, label, safeInc, riskInc };
}

/* ================= QUISHING ================= */

function scanQuishing() {
  const from = document.getElementById("quishFrom").value.trim();
  const subject = document.getElementById("quishSubject").value.trim();
  const body = document.getElementById("quishBody").value.trim();
  if (!body && !subject) { showInlineError("quishBody", "⚠ Please enter the message or email content."); return; }
  animateCyberProgress("quishProgressBar", "quishProgressPercent", function () {
    const result = analyzeQuishingContent(from, subject, body);
    result.scanType = "Quishing";
    displayGenericResult("quishResult", "quish://" + (normalizeEmail(from)?.domain || from || "-"), result);
  });
}

function analyzeQuishingContent(from, subject, body) {
  let score = 0;
  const reasons = [];
  const fullText = (subject + " " + body).toLowerCase();

  // QR code references — key indicator
  const qrPats = [/\bqr\b/i,/\bqr code\b/i,/\bscan\s*(?:the\s*)?(?:code|qr)\b/i,/\buse your camera\b/i,/\bscan to\b/i];
  const qrHits = qrPats.filter(p => p.test(fullText)).length;
  if (qrHits >= 2) { score += 30; reasons.push(`Multiple QR code references (${qrHits}) — high quishing risk`); }
  else if (qrHits === 1) { score += 15; reasons.push("Contains QR code reference — verify source before scanning"); }
  else { reasons.push("No QR code reference detected — if a QR was in an image, check the URL manually"); }

  const fromParsed = normalizeEmail(from);
  if (!fromParsed && from) { score += 15; reasons.push("Invalid From address"); }
  else if (fromParsed) {
    const fromBase = getBaseDomain(fromParsed.domain);
    for (const brand of HIGH_VALUE_BRANDS) {
      const brandBase = getBaseDomain(brand);
      const sim = tokenSimilarity(fromBase, brandBase);
      if (sim > 0.55 && fromBase !== brandBase) { score += 20; reasons.push(`From domain mimics ${brandBase}`); break; }
    }
  }

  const urlRegex = /\bhttps?:\/\/[^\s<>"')]+/gi;
  const urls = body.match(urlRegex) || [];
  if (urls.length > 0) {
    score += 10; reasons.push(`${urls.length} link(s) found — could be QR destination`);
    const shorteners = ["bit.ly","tinyurl.com","t.co","goo.gl","rebrand.ly","ow.ly","is.gd"];
    for (const u of urls) {
      try {
        const url = new URL(u);
        const host = url.hostname.toLowerCase();
        if (shorteners.some(s => host.includes(s))) { score += 12; reasons.push(`URL shortener (${host}) hides QR destination`); break; }
      } catch (e) {}
    }
  }

  const urgentPats = [/\burgent\b/i,/\bimmediately\b/i,/\bverify\b/i,/\bsecurity alert\b/i];
  const urgentHits = urgentPats.filter(r => r.test(fullText)).length;
  if (urgentHits >= 2) { score += 12; reasons.push(`Urgency language (${urgentHits})`); }
  else if (urgentHits === 1) { score += 6; reasons.push("Some urgency language"); }

  score = Math.min(100, Math.max(0, score));
  let label, safeInc = 0, riskInc = 0;
  if (score >= 60) { label = "⚠ HIGH RISK – Quishing Indicators Strong"; riskInc = 1; }
  else if (score >= 30) { label = "⚠ SUSPICIOUS – Potential QR Code Scam"; riskInc = 1; }
  else { label = "✅ SAFE – Low Risk of Quishing"; safeInc = 1; }
  return { score, reasons, label, safeInc, riskInc };
}

/* ================= ANGLER PHISHING ================= */

function scanAngler() {
  const platform = document.getElementById("anglerPlatform").value;
  const handle = document.getElementById("anglerHandle").value.trim();
  const claim = document.getElementById("anglerClaim").value.trim();
  const message = document.getElementById("anglerMessage").value.trim();
  if (!message && !handle) { showInlineError("anglerHandle", "⚠ Please fill in the handle and message."); return; }
  animateCyberProgress("anglerProgressBar", "anglerProgressPercent", function () {
    const result = analyzeAnglerContent(platform, handle, claim, message);
    result.scanType = "Angler Phishing";
    displayGenericResult("anglerResult", "social://" + (platform || "unknown") + "/" + (handle || "-"), result);
  });
}

function analyzeAnglerContent(platform, handle, claim, message) {
  let score = 0;
  const reasons = [];
  const fullText = (claim + " " + message).toLowerCase();

  if (!platform) { score += 5; reasons.push("No platform selected"); }

  // Platform-specific fake handle patterns
  const platformPatterns = {
    twitter:   [/^@?(?:twitter|twtr|tw1tter)/i],
    facebook:  [/^@?(?:facebook|faceb00k|fb_support)/i],
    instagram: [/^@?(?:instagram|insta_gram|ig_support)/i],
    linkedin:  [/^@?(?:linkedin|linked_in|li_support)/i],
    tiktok:    [/^@?(?:tiktok|tik_tok|tt_support)/i],
  };
  if (platform && platformPatterns[platform]) {
    if (platformPatterns[platform].some(p => p.test(handle))) {
      score += 15; reasons.push(`Handle mimics official ${platform} account`);
    }
  }

  const knownBrands = ["amazon","paypal","apple","google","microsoft","netflix","support","customer service","help"];
  const handleLower = handle.toLowerCase();
  for (const brand of knownBrands) {
    if (handleLower.includes(brand) && handleLower !== brand) {
      score += 20; reasons.push(`Handle "${handle}" impersonates "${brand}"`); break;
    }
  }

  // Urgency
  const urgencyPats = [/\burgent\b/i,/\bproblem\b/i,/\blocked\b/i,/\bsuspended\b/i,/\bunauthorized\b/i,/\bsecurity breach\b/i];
  const urgencyHits = urgencyPats.filter(r => r.test(message)).length;
  if (urgencyHits >= 2) { score += 12; reasons.push(`Urgency language (${urgencyHits})`); }
  else if (urgencyHits === 1) { score += 6; reasons.push("Some urgency language"); }

  // Sensitive requests
  const sensitivePats = [/\bpassword\b/i,/\bcredit card\b/i,/\bpin\b/i,/\bverify your account\b/i,/\bsign in\b/i,/\bclick here\b/i];
  const sensitiveHits = sensitivePats.filter(r => r.test(message)).length;
  if (sensitiveHits >= 2) { score += 18; reasons.push(`Sensitive info requested (${sensitiveHits})`); }
  else if (sensitiveHits === 1) { score += 10; reasons.push("Possible sensitive info request"); }

  // DM redirect (social engineering tactic)
  if (/\bdm\b/i.test(message) || /\bprivate message\b/i.test(message) || /\bpm me\b/i.test(message)) {
    score += 15; reasons.push("Asks to move to DM/private chat — common tactic");
  }

  const urlRegex = /\bhttps?:\/\/[^\s<>"')]+/gi;
  const urls = message.match(urlRegex) || [];
  if (urls.length > 0) {
    score += 10; reasons.push(`Message contains ${urls.length} link(s)`);
    const shorteners = ["bit.ly","tinyurl.com","t.co","goo.gl","rebrand.ly","ow.ly","is.gd"];
    for (const u of urls) {
      try {
        const url = new URL(u);
        const host = url.hostname.toLowerCase();
        if (shorteners.some(s => host.includes(s))) { score += 10; reasons.push(`URL shortener (${host})`); break; }
      } catch (e) {}
    }
  }

  score = Math.min(100, Math.max(0, score));
  let label, safeInc = 0, riskInc = 0;
  if (score >= 60) { label = "⚠ HIGH RISK – Angler Phishing Indicators Strong"; riskInc = 1; }
  else if (score >= 30) { label = "⚠ SUSPICIOUS – Potential Social Media Scam"; riskInc = 1; }
  else { label = "✅ SAFE – Low Risk of Angler Phishing"; safeInc = 1; }
  return { score, reasons, label, safeInc, riskInc };
}

/* ================= HTTPS PHISHING ================= */

function scanHttps() {
  const url = document.getElementById("httpsUrl").value.trim();
  const context = document.getElementById("httpsContext").value.trim();
  if (!url) { showInlineError("httpsUrl", "⚠ Please enter a URL to scan."); return; }
  animateCyberProgress("httpsProgressBar", "httpsProgressPercent", function () {
    const result = analyzeHttpsContent(url, context);
    result.scanType = "HTTPS Phishing";
    displayGenericResult("httpsResult", url, result);
  });
}

function analyzeHttpsContent(url, context) {
  let score = 0;
  const reasons = [];

  let parsedUrl;
  try { parsedUrl = new URL(url); }
  catch (e) { return { score: 50, reasons: ["Invalid URL format"], label: "⚠ SUSPICIOUS – Invalid URL", safeInc: 0, riskInc: 1 }; }

  const protocol = parsedUrl.protocol;
  const hostname = parsedUrl.hostname.toLowerCase();
  const path = parsedUrl.pathname.toLowerCase();
  const tld = hostname.split(".").pop();

  if (protocol !== "https:") { score += 20; reasons.push("URL does not use HTTPS"); }
  else { score += 5; reasons.push("Uses HTTPS (note: phishing sites also use HTTPS)"); }

  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipRegex.test(hostname)) { score += 25; reasons.push("Hostname is an IP address"); }

  const suspTlds = ["zip","mov","top","xyz","click","country","kim","gq","tk","cf","pw","ml","ga","cf"];
  if (suspTlds.includes(tld)) { score += 10; reasons.push(`Suspicious TLD .${tld}`); }

  const fromBase = getBaseDomain(hostname);
  for (const brand of HIGH_VALUE_BRANDS) {
    const brandBase = getBaseDomain(brand);
    const sim = tokenSimilarity(fromBase, brandBase);
    if (sim > 0.55 && fromBase !== brandBase) { score += 25; reasons.push(`Domain resembles ${brandBase} (actually ${fromBase})`); break; }
  }

  const shorteners = ["bit.ly","tinyurl.com","t.co","goo.gl","rebrand.ly","ow.ly","is.gd"];
  if (shorteners.some(s => hostname.includes(s))) { score += 15; reasons.push("URL shortener used"); }

  const suspKeywords = ["login","signin","verify","secure","account","update","reset","auth","webscr","confirm"];
  const pathHits = suspKeywords.filter(k => path.includes(k));
  if (pathHits.length > 0) { score += Math.min(20, pathHits.length * 5); reasons.push(`Suspicious path keywords: ${pathHits.join(", ")}`); }

  if (url.includes("@")) { score += 15; reasons.push("@ symbol in URL"); }

  const subdomainCount = hostname.split(".").length - 2;
  if (subdomainCount > 2) { score += 10; reasons.push(`Many subdomains (${subdomainCount})`); }

  if (/%[0-9a-fA-F]{2}/.test(url)) { score += 10; reasons.push("Hex encoding in URL"); }

  if (context) {
    const urgentPats = [/\burgent\b/i,/\bverify\b/i,/\bsecurity alert\b/i,/\bimmediately\b/i];
    const urgentHits = urgentPats.filter(r => r.test(context)).length;
    if (urgentHits >= 1) { score += 8; reasons.push("Context contains urgency language"); }
  }

  score = Math.min(100, Math.max(0, score));
  let label, safeInc = 0, riskInc = 0;
  if (score >= 65) { label = "⚠ HIGH RISK – HTTPS Phishing Indicators Strong"; riskInc = 1; }
  else if (score >= 30) { label = "⚠ SUSPICIOUS – Potential HTTPS Scam"; riskInc = 1; }
  else { label = "✅ SAFE – Low Risk of HTTPS Phishing"; safeInc = 1; }
  return { score, reasons, label, safeInc, riskInc };
}

/* ================= EVIL TWIN ================= */

function scanEvilTwin() {
  const ssid = document.getElementById("evilSsid").value.trim();
  const security = document.getElementById("evilSecurity").value;
  const signal = document.getElementById("evilSignal").value;
  const duplicate = document.getElementById("evilDuplicate").value;
  const publicPlace = document.getElementById("evilPublicPlace").value;
  const details = document.getElementById("evilDetails").value.trim();
  if (!ssid) { showInlineError("evilSsid", "⚠ Please enter the Wi-Fi SSID."); return; }
  animateCyberProgress("evilProgressBar", "evilProgressPercent", function () {
    const result = analyzeEvilTwinContent(ssid, security, signal, duplicate, publicPlace, details);
    result.scanType = "Evil Twin";
    displayGenericResult("evilResult", "wifi://" + ssid, result);
  });
}

function analyzeEvilTwinContent(ssid, security, signal, duplicate, publicPlace, details) {
  let score = 0;
  const reasons = [];
  const ssidLower = ssid.toLowerCase();
  const detailsLower = (details || "").toLowerCase();

  const commonSsids = ["starbucks","att","xfinity","google","free wifi","public wifi","airport","hotel","cafe","coffee","guest","customer","telstra","bt","sky"];
  if (commonSsids.some(c => ssidLower.includes(c))) { score += 10; reasons.push(`SSID matches common public name — often spoofed`); }

  if (security === "open") { score += 25; reasons.push("Open network (no password) — typical for evil twins"); }
  else if (security === "wep") { score += 20; reasons.push("WEP security — outdated and easily cracked"); }
  else if (security === "wpa" || security === "wpa2") {
    if (publicPlace === "yes") { score += 5; reasons.push("WPA/WPA2 in public place — still possible evil twin"); }
  } else if (security === "wpa3") { reasons.push("WPA3 — strong security protocol"); }

  if (duplicate === "yes") { score += 30; reasons.push("Duplicate SSID visible — classic evil twin indicator"); }
  else if (duplicate === "unsure") { score += 10; reasons.push("Unsure about duplicate SSIDs — check carefully"); }

  if (publicPlace === "yes") { score += 10; reasons.push("Public location — evil twins are common here"); }

  if (signal === "strong" && duplicate === "yes") { score += 10; reasons.push("Strong signal + duplicate SSID — possible rogue AP nearby"); }
  else if (signal === "weak" && publicPlace === "yes") { score += 5; reasons.push("Weak signal in public place — possible distant fake AP"); }

  const sensitivePats = [/login page/i,/enter password/i,/credit card/i,/payment/i,/verify identity/i,/billing/i];
  if (sensitivePats.some(p => p.test(detailsLower))) { score += 15; reasons.push("Sensitive info requested after connecting"); }

  if (/captive portal|sign in to network|accept terms/i.test(detailsLower)) { score += 10; reasons.push("Captive portal detected — could steal credentials"); }

  score = Math.min(100, Math.max(0, score));
  let label, safeInc = 0, riskInc = 0;
  if (score >= 60) { label = "⚠ HIGH RISK – Evil Twin Indicators Strong"; riskInc = 1; }
  else if (score >= 30) { label = "⚠ SUSPICIOUS – Potential Rogue Wi-Fi"; riskInc = 1; }
  else { label = "✅ SAFE – Low Risk of Evil Twin"; safeInc = 1; }
  return { score, reasons, label, safeInc, riskInc };
}

/* ================= SCROLLING FADE EFFECT ================= */

const fadeSections = document.querySelectorAll(".fade-section");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.2 }
);

fadeSections.forEach((section) => { observer.observe(section); });
