// ===== CUSTOM CURSOR =====
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursorRing");
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });

(function animateCursor() {
  cursor.style.left = mx + "px"; cursor.style.top = my + "px";
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
  ring.style.left = rx + "px"; ring.style.top = ry + "px";
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll("a,button,.filter-btn,.animal-card,.incident-card,.edu-card,.impact-card").forEach((el) => {
  el.addEventListener("mouseenter", () => { cursor.style.width="18px"; cursor.style.height="18px"; ring.style.width="52px"; ring.style.height="52px"; });
  el.addEventListener("mouseleave", () => { cursor.style.width="8px"; cursor.style.height="8px"; ring.style.width="32px"; ring.style.height="32px"; });
});

// ===== NAV SCROLL =====
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => { navbar.classList.toggle("scrolled", window.scrollY > 80); handleParallax(); handleScrollAnimations(); });

// ===== PARALLAX =====
function handleParallax() {
  const sy = window.scrollY; const winH = window.innerHeight;
  const heroBg = document.getElementById("heroBg");
  if (heroBg) heroBg.style.transform = `translateY(${sy * 0.4}px)`;
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) { let hOpacity = 1 - sy / 500; heroContent.style.opacity = Math.max(hOpacity, 0); }
  const forestSection = document.getElementById("forest-depth");
  if (forestSection) {
    const fRect = forestSection.getBoundingClientRect(); const viewIn = winH - fRect.top;
    if (fRect.top < winH && fRect.bottom > 0) {
      forestSection.style.marginTop = `0px`; const fOff = viewIn;
      const mnt = document.getElementById("fMountains"); const hls = document.getElementById("fHills");
      const trB = document.getElementById("fTreesBack"); const trF = document.getElementById("fTreesFront");
      if (mnt) mnt.style.transform = `translateY(${-fOff * 0.1}px)`;
      if (hls) hls.style.transform = `translateY(${-fOff * 0.18}px)`;
      if (trB) trB.style.transform = `translateY(${-fOff * 0.3}px)`;
      if (trF) trF.style.transform = `translateY(${-fOff * 0.45}px)`;
      const progress = Math.min(Math.max(fOff / (winH + fRect.height), 0), 1);
      document.querySelectorAll(".silhouette").forEach((s, i) => { s.classList.toggle("visible", progress > 0.2 + i * 0.15); });
    } else if (sy < 100) { forestSection.style.marginTop = "0px"; }
  }
  const impactBg = document.getElementById("impactBg");
  if (impactBg) {
    const iRect = document.getElementById("conservation-impact").getBoundingClientRect();
    if (iRect.top < winH) { impactBg.style.transform = `translateY(${-iRect.top * 0.2}px)`; }
  }
}
window.addEventListener("scroll", handleParallax);

// ===== SCROLL ANIMATIONS =====
function handleScrollAnimations() {
  document.querySelectorAll(".animal-card").forEach((card, i) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) { setTimeout(() => card.classList.add("visible"), i * 100); }
  });
  document.querySelectorAll("[data-count]:not(.counted)").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 30) { el.classList.add("counted"); animateCount(el); }
  });
}

function animateCount(el) {
  const target = parseInt(el.dataset.count); const suffix = el.dataset.suffix || "";
  const duration = 2200; const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1); const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target).toLocaleString("id-ID") + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ===== MAP INTERACTIONS =====
document.querySelectorAll(".map-region").forEach((region) => {
  const popup = document.getElementById("mapPopup"); const svg = document.getElementById("wildlife-map-svg");
  region.addEventListener("mouseenter", function () {
    const { name, pop, risk, status } = this.dataset;
    document.getElementById("popupName").textContent = name;
    document.getElementById("popupPop").textContent = "🌿 " + pop;
    document.getElementById("popupRisk").textContent = "⚠️ Tingkat Risiko: " + risk;
    const badge = document.getElementById("popupStatus"); badge.className = "status-badge status-" + status;
    const labels = { critical: "KRITIS", endangered: "TERANCAM PUNAH", vulnerable: "RENTAN", stable: "STABIL" };
    badge.textContent = labels[status] || status.toUpperCase(); popup.classList.add("visible");
    document.getElementById("mapInfoCard").innerHTML = `<h4>Wilayah Dipilih</h4><p style="font-weight:600;color:var(--white);margin-bottom:.35rem">${name}</p><p style="color:rgba(245,242,236,.45);font-size:.74rem;margin-bottom:.35rem">${pop}</p><p style="color:rgba(245,242,236,.45);font-size:.74rem">Risiko: <span style="color:var(--amber)">${risk}</span></p><span class="status-badge status-${status}" style="margin-top:.5rem;display:inline-block">${labels[status] || status}</span>`;
  });
  region.addEventListener("mouseleave", () => popup.classList.remove("visible"));
  region.addEventListener("mousemove", function (e) {
    const svgRect = svg.parentElement.getBoundingClientRect();
    let px = e.clientX - svgRect.left + 18; let py = e.clientY - svgRect.top + 12;
    if (px + 230 > svgRect.width) px -= 248; popup.style.left = px + "px"; popup.style.top = py + "px";
  });
});
function toggleLayer(btn) { btn.classList.toggle("active"); }

// ===== CHARTS — FOKUS INDONESIA =====
Chart.defaults.color = "rgba(245,242,236,0.4)";
Chart.defaults.borderColor = "rgba(245,242,236,0.05)";
const chartFont = { family: "'Outfit', sans-serif" };

// ------------------------------------------------------------------
// CHART 1 — Tren Populasi 4 Satwa Kunci Indonesia (1980–2024)
// Sumber: IUCN Red List (2024), WWF Indonesia, KLHK RI, BRIN
// Catatan: nilai Orangutan & Gajah dibagi 10 agar terbaca dalam 1 skala
// ------------------------------------------------------------------
new Chart(document.getElementById("populationChart").getContext("2d"), {
  type: "line",
  data: {
    labels: ["1980","1985","1990","1995","2000","2005","2010","2015","2020","2024"],
    datasets: [
      {
        label: "Harimau Sumatera (ekor)",
        data: [1000,900,800,700,680,650,620,600,580,600],
        borderColor: "#c0392b", backgroundColor: "rgba(192,57,43,0.07)",
        fill: true, tension: 0.42, borderWidth: 1.8,
        pointBackgroundColor: "#c0392b", pointRadius: 3, pointHoverRadius: 6,
      },
      {
        label: "Orangutan Sumatera (ekor ÷10)",
        data: [5000,4500,4000,3500,3000,2500,2000,1700,1450,1385],
        borderColor: "#d4870a", backgroundColor: "rgba(212,135,10,0.06)",
        fill: true, tension: 0.42, borderWidth: 1.8,
        pointBackgroundColor: "#d4870a", pointRadius: 3, pointHoverRadius: 6,
      },
      {
        label: "Badak Jawa (ekor)",
        data: [60,58,55,52,50,55,58,63,68,76],
        borderColor: "#4a8fa8", backgroundColor: "rgba(74,143,168,0.06)",
        fill: false, tension: 0.42, borderWidth: 1.8,
        pointBackgroundColor: "#4a8fa8", pointRadius: 3, pointHoverRadius: 6,
      },
      {
        label: "Gajah Sumatera (ekor ÷10)",
        data: [500,460,420,380,330,280,240,200,180,170],
        borderColor: "#3d8b3d", backgroundColor: "rgba(61,139,61,0.06)",
        fill: false, tension: 0.42, borderWidth: 1.8,
        pointBackgroundColor: "#3d8b3d", pointRadius: 3, pointHoverRadius: 6,
      },
    ],
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { labels: { color: "rgba(245,242,236,0.5)", font: { ...chartFont, size: 10 }, boxWidth: 12, padding: 12 } },
      tooltip: { callbacks: { footer: () => "Sumber: IUCN Red List 2024 · WWF Indonesia · KLHK RI · BRIN" } },
    },
    scales: {
      x: { grid: { color: "rgba(245,242,236,0.04)" }, ticks: { color: "rgba(245,242,236,0.35)", font: { ...chartFont, size: 10 } } },
      y: { grid: { color: "rgba(245,242,236,0.04)" }, ticks: { color: "rgba(245,242,236,0.35)", font: { ...chartFont, size: 10 }, callback: (v) => v.toLocaleString("id-ID") }, title: { display: true, text: "Estimasi Populasi (Orangutan & Gajah ÷10)", color: "rgba(245,242,236,0.2)", font: { ...chartFont, size: 9 } } },
    },
  },
});

// ------------------------------------------------------------------
// CHART 2 — Ancaman Utama Satwa Liar Indonesia (Donat)
// Sumber: BKSDA RI 2023, KLHK Statistik LHK 2023, WWF Indonesia,
//          Traffic International 2022
// ------------------------------------------------------------------
new Chart(document.getElementById("causesChart").getContext("2d"), {
  type: "doughnut",
  data: {
    labels: ["Deforestasi & Alih Fungsi Lahan","Perburuan & Perdagangan Ilegal","Kebakaran Hutan & Gambut","Konflik Manusia–Satwa","Kerusakan Pesisir & Terumbu"],
    datasets: [{ data: [42,28,15,10,5], backgroundColor: ["#2d6e2d","#c0392b","#d4870a","#c9a84c","#4a8fa8"], borderWidth: 0, hoverOffset: 8 }],
  },
  options: {
    responsive: true, maintainAspectRatio: false, cutout: "68%",
    plugins: {
      legend: { position: "right", labels: { color: "rgba(245,242,236,0.5)", font: { ...chartFont, size: 9.5 }, padding: 12, boxWidth: 10 } },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.raw}% kontribusi ancaman`, footer: () => "Sumber: BKSDA RI 2023 · KLHK RI · WWF Indonesia · Traffic Intl" } },
    },
  },
});

// ------------------------------------------------------------------
// CHART 3 — Jumlah Spesies Terancam per Pulau & Kelompok Satwa
// Sumber: IUCN Red List 2024, BRIN (Biota Indonesia 2023),
//          Kementerian LHK — Buku Statistik LHK 2023
// (CR = Kritis, EN = Terancam Punah, VU = Rentan)
// ------------------------------------------------------------------
new Chart(document.getElementById("regionalChart").getContext("2d"), {
  type: "bar",
  data: {
    labels: ["Sumatera","Kalimantan","Jawa & Bali","Sulawesi","Papua","Nusa Tenggara","Maluku"],
    datasets: [
      { label: "Mamalia (CR+EN+VU)", data: [54,49,22,35,28,14,10], backgroundColor: "rgba(192,57,43,0.75)", borderRadius: 2 },
      { label: "Burung (CR+EN+VU)", data: [38,32,24,42,61,26,22], backgroundColor: "rgba(74,143,168,0.70)", borderRadius: 2 },
      { label: "Reptil & Amfibi (CR+EN+VU)", data: [22,18,16,27,19,11,8], backgroundColor: "rgba(201,168,76,0.65)", borderRadius: 2 },
    ],
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "rgba(245,242,236,0.5)", font: { ...chartFont, size: 10 }, boxWidth: 10, padding: 12 } },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.raw} spesies`, footer: () => "Sumber: IUCN Red List 2024 · BRIN · Kementerian LHK 2023" } },
    },
    scales: {
      x: { grid: { color: "rgba(245,242,236,0.03)" }, ticks: { color: "rgba(245,242,236,0.35)", font: { ...chartFont, size: 9 } } },
      y: { grid: { color: "rgba(245,242,236,0.03)" }, ticks: { color: "rgba(245,242,236,0.35)", font: { ...chartFont, size: 10 }, callback: (v) => v + " sp." }, title: { display: true, text: "Jumlah Spesies Terancam (CR + EN + VU)", color: "rgba(245,242,236,0.2)", font: { ...chartFont, size: 9 } } },
    },
  },
});

// ------------------------------------------------------------------
// CHART 4 — Tutupan Hutan Tersisa vs Kehilangan Hutan per Pulau
// Sumber: KLHK RI — Statistik LHK 2023, FWI (Forest Watch Indonesia) 2023,
//          Global Forest Watch 2024, BPS RI 2023
// ------------------------------------------------------------------
new Chart(document.getElementById("recoveryChart").getContext("2d"), {
  type: "bar",
  data: {
    labels: ["Papua","Kalimantan","Sumatera","Sulawesi","Maluku","Nusa Tenggara","Jawa & Bali"],
    datasets: [
      { label: "Tutupan Hutan Primer Tersisa (juta ha)", data: [32.5,22.8,11.4,7.8,4.2,1.6,0.7], backgroundColor: "rgba(61,139,61,0.72)", borderRadius: 2 },
      { label: "Kehilangan Hutan 2000–2023 (juta ha)", data: [3.2,9.4,8.8,1.9,0.6,0.4,0.3], backgroundColor: "rgba(192,57,43,0.65)", borderRadius: 2 },
    ],
  },
  options: {
    responsive: true, maintainAspectRatio: false, indexAxis: "y",
    plugins: {
      legend: { labels: { color: "rgba(245,242,236,0.5)", font: { ...chartFont, size: 10 }, boxWidth: 10, padding: 12 } },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.raw} juta ha`, footer: () => "Sumber: KLHK RI 2023 · FWI 2023 · Global Forest Watch 2024" } },
    },
    scales: {
      x: { grid: { color: "rgba(245,242,236,0.03)" }, ticks: { color: "rgba(245,242,236,0.35)", font: { ...chartFont, size: 10 }, callback: (v) => v + " jt ha" } },
      y: { grid: { color: "rgba(245,242,236,0.03)" }, ticks: { color: "rgba(245,242,236,0.35)", font: { ...chartFont, size: 9 } } },
    },
  },
});

// ===== SUBMIT REPORT =====
function submitReport(btn) {
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Mengirim...';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Laporan Terkirim'; btn.style.background = "var(--forest-mid)";
    setTimeout(() => { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Laporan'; btn.style.background = ""; btn.disabled = false; }, 3000);
  }, 1200);
}

// ===== INIT =====
window.addEventListener("load", () => {
  handleScrollAnimations(); handleParallax();
  document.querySelectorAll(".hero-stat-num").forEach((el) => animateCount(el));
});