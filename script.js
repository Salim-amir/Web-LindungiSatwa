// ============================================================
//  WILDGUARD — PROFESSIONAL EDITION
//  JavaScript · Interactions & Visualizations
// ============================================================

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById("cursor");
const ring   = document.getElementById("cursorRing");
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });

(function animateCursor() {
  cursor.style.left = mx + "px";
  cursor.style.top  = my + "px";
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + "px";
  ring.style.top  = ry + "px";
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll("a,button,.filter-btn,.animal-card,.incident-card,.edu-card,.impact-card").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.width = "18px"; cursor.style.height = "18px";
    ring.style.width = "52px";   ring.style.height = "52px";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.width = "8px";  cursor.style.height = "8px";
    ring.style.width = "32px";   ring.style.height = "32px";
  });
});

// ===== NAV SCROLL =====
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 80);
  handleParallax();
  handleScrollAnimations();
});

// ===== PARALLAX =====
function handleParallax() {
  const sy = window.scrollY;
  const heroBg = document.getElementById("heroBg");
  if (heroBg) heroBg.style.transform = `translateY(${sy * 0.45}px)`;
  const heroFg = document.getElementById("heroFg");
  if (heroFg) heroFg.style.transform = `translateY(${sy * -0.18}px)`;

  const forestSection = document.getElementById("forest-depth");
  if (forestSection) {
    const fRect = forestSection.getBoundingClientRect();
    const fOff  = -fRect.top;
    if (fRect.top < window.innerHeight && fRect.bottom > 0) {
      document.getElementById("fMountains").style.transform  = `translateY(${fOff * 0.08}px)`;
      document.getElementById("fHills").style.transform      = `translateY(${fOff * 0.18}px)`;
      document.getElementById("fTreesBack").style.transform  = `translateY(${fOff * 0.28}px)`;
      document.getElementById("fTreesFront").style.transform = `translateY(${fOff * 0.45}px)`;
      const progress = Math.min(Math.max(fOff / fRect.height, 0), 1);
      document.querySelectorAll(".silhouette").forEach((s, i) => {
        s.classList.toggle("visible", progress > 0.1 + i * 0.15);
      });
    }
  }

  const impactBg = document.getElementById("impactBg");
  if (impactBg) {
    const iRect = document.getElementById("conservation-impact").getBoundingClientRect();
    impactBg.style.transform = `translateY(${-iRect.top * 0.28}px)`;
  }
}

// ===== SCROLL ANIMATIONS =====
function handleScrollAnimations() {
  document.querySelectorAll(".animal-card").forEach((card, i) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      setTimeout(() => card.classList.add("visible"), i * 100);
    }
  });
  document.querySelectorAll("[data-count]:not(.counted)").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 30) {
      el.classList.add("counted");
      animateCount(el);
    }
  });
}

function animateCount(el) {
  const target   = parseInt(el.dataset.count);
  const duration = 2200;
  const start    = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target).toLocaleString("id-ID");
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ===== MAP INTERACTIONS =====
document.querySelectorAll(".map-region").forEach(region => {
  const popup = document.getElementById("mapPopup");
  const svg   = document.getElementById("wildlife-map-svg");

  region.addEventListener("mouseenter", function () {
    const { name, pop, risk, status } = this.dataset;
    document.getElementById("popupName").textContent = name;
    document.getElementById("popupPop").textContent  = "🌿 " + pop;
    document.getElementById("popupRisk").textContent = "⚠️ Tingkat Risiko: " + risk;
    const badge = document.getElementById("popupStatus");
    badge.className = "status-badge status-" + status;
    const labels = { critical: "KRITIS", endangered: "TERANCAM PUNAH", vulnerable: "RENTAN", stable: "STABIL" };
    badge.textContent = labels[status] || status.toUpperCase();
    popup.classList.add("visible");
    document.getElementById("mapInfoCard").innerHTML = `
      <h4>Wilayah Dipilih</h4>
      <p style="font-weight:600;color:var(--white);margin-bottom:.35rem">${name}</p>
      <p style="color:rgba(245,242,236,.45);font-size:.74rem;margin-bottom:.35rem">${pop}</p>
      <p style="color:rgba(245,242,236,.45);font-size:.74rem">Risiko: <span style="color:var(--amber)">${risk}</span></p>
      <span class="status-badge status-${status}" style="margin-top:.5rem;display:inline-block">${labels[status] || status}</span>`;
  });

  region.addEventListener("mouseleave", () => popup.classList.remove("visible"));
  region.addEventListener("mousemove", function (e) {
    const svgRect = svg.parentElement.getBoundingClientRect();
    let px = e.clientX - svgRect.left + 18;
    let py = e.clientY - svgRect.top  + 12;
    if (px + 230 > svgRect.width) px -= 248;
    popup.style.left = px + "px";
    popup.style.top  = py + "px";
  });
});

document.getElementById("timelineSlider").addEventListener("input", function () {
  document.getElementById("timelineYear").textContent = this.value;
  const pct = ((this.value - 1970) / (2024 - 1970)) * 100;
  this.style.background = `linear-gradient(90deg, var(--forest-mid) ${pct}%, rgba(245,242,236,.08) ${pct}%)`;
});

function toggleLayer(btn) { btn.classList.toggle("active"); }

// ===== CHARTS =====
Chart.defaults.color       = "rgba(245,242,236,0.4)";
Chart.defaults.borderColor = "rgba(245,242,236,0.05)";

const chartFont = { family: "'Outfit', sans-serif" };

// Population trend
new Chart(document.getElementById("populationChart").getContext("2d"), {
  type: "line",
  data: {
    labels: ["1970","1975","1980","1985","1990","1995","2000","2005","2010","2015","2020","2024"],
    datasets: [
      {
        label: "Indeks Populasi Satwa Liar",
        data: [100,94,88,80,73,67,61,56,52,46,38,32],
        borderColor: "#c0392b",
        backgroundColor: "rgba(192,57,43,0.06)",
        fill: true, tension: 0.45, borderWidth: 1.5,
        pointBackgroundColor: "#c0392b", pointRadius: 3, pointHoverRadius: 5,
      },
      {
        label: "Cakupan Kawasan Lindung %",
        data: [2,3,4,5,6,8,9,11,13,15,17,17],
        borderColor: "#3d8b3d",
        backgroundColor: "rgba(61,139,61,0.06)",
        fill: true, tension: 0.45, borderWidth: 1.5,
        pointBackgroundColor: "#3d8b3d", pointRadius: 3, pointHoverRadius: 5,
      },
    ],
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "rgba(245,242,236,0.5)", font: { ...chartFont, size: 11 }, boxWidth: 12 } } },
    scales: {
      x: { grid: { color: "rgba(245,242,236,0.04)" }, ticks: { color: "rgba(245,242,236,0.35)", font: { ...chartFont, size: 10 } } },
      y: { grid: { color: "rgba(245,242,236,0.04)" }, ticks: { color: "rgba(245,242,236,0.35)", font: { ...chartFont, size: 10 } } },
    },
  },
});

// Causes doughnut
new Chart(document.getElementById("causesChart").getContext("2d"), {
  type: "doughnut",
  data: {
    labels: ["Hilangnya Habitat","Perburuan Liar","Perubahan Iklim","Polusi","Spesies Invasif","Penyakit"],
    datasets: [{
      data: [38,22,18,10,7,5],
      backgroundColor: ["#2d6e2d","#c0392b","#1e6080","#d4870a","#c9a84c","#6d4c41"],
      borderWidth: 0, hoverOffset: 6,
    }],
  },
  options: {
    responsive: true, maintainAspectRatio: false, cutout: "68%",
    plugins: { legend: { position: "right", labels: { color: "rgba(245,242,236,0.5)", font: { ...chartFont, size: 10 }, padding: 14, boxWidth: 10 } } },
  },
});

// Regional bar
new Chart(document.getElementById("regionalChart").getContext("2d"), {
  type: "bar",
  data: {
    labels: ["Asia Tenggara","Afrika Sub-Sahara","Amazon","India","Am. Tengah","Mediterania","Am. Utara","Australasia"],
    datasets: [
      { label: "Kritis",      data: [312,289,245,198,167,134,98,87],  backgroundColor: "rgba(192,57,43,0.65)",  borderRadius: 2 },
      { label: "Terancam",    data: [198,234,189,156,134,112,145,98], backgroundColor: "rgba(212,135,10,0.65)", borderRadius: 2 },
      { label: "Rentan",      data: [245,178,212,134,98,167,189,145], backgroundColor: "rgba(201,168,76,0.45)", borderRadius: 2 },
    ],
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "rgba(245,242,236,0.5)", font: { ...chartFont, size: 10 }, boxWidth: 10 } } },
    scales: {
      x: { stacked: true, grid: { color: "rgba(245,242,236,0.03)" }, ticks: { color: "rgba(245,242,236,0.35)", font: { ...chartFont, size: 9 } } },
      y: { stacked: true, grid: { color: "rgba(245,242,236,0.03)" }, ticks: { color: "rgba(245,242,236,0.35)", font: { ...chartFont, size: 10 } } },
    },
  },
});

// Recovery radar
new Chart(document.getElementById("recoveryChart").getContext("2d"), {
  type: "radar",
  data: {
    labels: ["Anti-Perburuan","Pemulihan Habitat","Penangkaran","Edukasi Masy.","Advokasi","Riset"],
    datasets: [
      { label: "2020", data: [45,38,52,30,41,60], borderColor: "rgba(74,143,168,0.6)", backgroundColor: "rgba(74,143,168,0.08)", borderWidth: 1.5 },
      { label: "2024", data: [68,55,71,52,63,78], borderColor: "rgba(61,139,61,0.8)",  backgroundColor: "rgba(61,139,61,0.12)",  borderWidth: 1.5 },
    ],
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "rgba(245,242,236,0.5)", font: { ...chartFont, size: 10 }, boxWidth: 10 } } },
    scales: {
      r: {
        grid: { color: "rgba(245,242,236,0.05)" },
        pointLabels: { color: "rgba(245,242,236,0.45)", font: { ...chartFont, size: 9 } },
        ticks: { display: false },
        angleLines: { color: "rgba(245,242,236,0.05)" },
      },
    },
  },
});

// ===== SUBMIT REPORT =====
function submitReport(btn) {
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Mengirim...';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Laporan Terkirim';
    btn.style.background = "var(--forest-mid)";
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Laporan';
      btn.style.background = "";
      btn.disabled = false;
    }, 3000);
  }, 1200);
}

// ===== INIT =====
window.addEventListener("load", () => {
  handleScrollAnimations();
  handleParallax();
  document.querySelectorAll(".hero-stat-num").forEach(el => animateCount(el));
});