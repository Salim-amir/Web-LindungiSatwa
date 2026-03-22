// ============================================================
//  WILDGUARD — PROFESSIONAL EDITION
//  JavaScript · Interactions & Visualizations
// ============================================================

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursorRing");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});

(function animateCursor() {
  cursor.style.left = mx + "px";
  cursor.style.top = my + "px";
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animateCursor);
})();

document
  .querySelectorAll(
    "a,button,.filter-btn,.animal-card,.incident-card,.edu-card,.impact-card",
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "18px";
      cursor.style.height = "18px";
      ring.style.width = "52px";
      ring.style.height = "52px";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.width = "8px";
      cursor.style.height = "8px";
      ring.style.width = "32px";
      ring.style.height = "32px";
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
  const sy = window.scrollY; // Posisi scroll global
  const winH = window.innerHeight; // Tinggi layar

  // --- 1. HERO SECTION (Background & Fade Out) ---
  const heroBg = document.getElementById("heroBg");
  if (heroBg) heroBg.style.transform = `translateY(${sy * 0.4}px)`;

  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    let hOpacity = 1 - sy / 500;
    heroContent.style.opacity = Math.max(hOpacity, 0);
  }

  // --- 2. FOREST DEPTH (Dynamic Margin & Internal Parallax) ---
  const forestSection = document.getElementById("forest-depth");
  if (forestSection) {
    const fRect = forestSection.getBoundingClientRect();

    // Hitung kapan elemen mulai muncul dari bawah (0 = tepat di bawah, winH = tepat di atas)
    const viewIn = winH - fRect.top;

    if (fRect.top < winH && fRect.bottom > 0) {
      // A. DINAMIK MARGIN (Ini inti permintaanmu)
      // Begitu forestSection masuk layar, kita tarik margin-top ke atas.
      // Multiplier 0.25 berarti setiap scroll 100px, margin naik 25px ekstra.
      forestSection.style.marginTop = `0px`;

      // B. INTERNAL LAYER PARALLAX (Efek kedalaman di dalam hutan)
      // Kita gunakan viewIn sebagai basis agar sinkron dengan tarikan margin
      const fOff = viewIn;

      const mnt = document.getElementById("fMountains");
      const hls = document.getElementById("fHills");
      const trB = document.getElementById("fTreesBack");
      const trF = document.getElementById("fTreesFront");

      if (mnt) mnt.style.transform = `translateY(${-fOff * 0.1}px)`;
      if (hls) hls.style.transform = `translateY(${-fOff * 0.18}px)`;
      if (trB) trB.style.transform = `translateY(${-fOff * 0.3}px)`;
      if (trF) trF.style.transform = `translateY(${-fOff * 0.45}px)`;

      // C. SILHOUETTE ANIMATION
      const progress = Math.min(Math.max(fOff / (winH + fRect.height), 0), 1);
      document.querySelectorAll(".silhouette").forEach((s, i) => {
        s.classList.toggle("visible", progress > 0.2 + i * 0.15);
      });
    } else if (sy < 100) {
      // Reset margin jika user balik ke paling atas (biar gak ada gap)
      forestSection.style.marginTop = "0px";
    }
  }

  // --- 3. IMPACT SECTION BACKGROUND ---
  const impactBg = document.getElementById("impactBg");
  if (impactBg) {
    const iRect = document
      .getElementById("conservation-impact")
      .getBoundingClientRect();
    if (iRect.top < winH) {
      impactBg.style.transform = `translateY(${-iRect.top * 0.2}px)`;
    }
  }
}

// Pastikan fungsi dipanggil saat scroll
window.addEventListener("scroll", handleParallax);

// ===== SCROLL ANIMATIONS =====
function handleScrollAnimations() {
  document.querySelectorAll(".animal-card").forEach((card, i) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      setTimeout(() => card.classList.add("visible"), i * 100);
    }
  });
  document.querySelectorAll("[data-count]:not(.counted)").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 30) {
      el.classList.add("counted");
      animateCount(el);
    }
  });
}

function animateCount(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const duration = 2200;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent =
      Math.floor(eased * target).toLocaleString("id-ID") + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ===== MAP INTERACTIONS =====
document.querySelectorAll(".map-region").forEach((region) => {
  const popup = document.getElementById("mapPopup");
  const svg = document.getElementById("wildlife-map-svg");

  region.addEventListener("mouseenter", function () {
    const { name, pop, risk, status } = this.dataset;
    document.getElementById("popupName").textContent = name;
    document.getElementById("popupPop").textContent = "🌿 " + pop;
    document.getElementById("popupRisk").textContent =
      "⚠️ Tingkat Risiko: " + risk;
    const badge = document.getElementById("popupStatus");
    badge.className = "status-badge status-" + status;
    const labels = {
      critical: "KRITIS",
      endangered: "TERANCAM PUNAH",
      vulnerable: "RENTAN",
      stable: "STABIL",
    };
    badge.textContent = labels[status] || status.toUpperCase();
    popup.classList.add("visible");
    document.getElementById("mapInfoCard").innerHTML = `
      <h4>Wilayah Dipilih</h4>
      <p style="font-weight:600;color:var(--white);margin-bottom:.35rem">${name}</p>
      <p style="color:rgba(245,242,236,.45);font-size:.74rem;margin-bottom:.35rem">${pop}</p>
      <p style="color:rgba(245,242,236,.45);font-size:.74rem">Risiko: <span style="color:var(--amber)">${risk}</span></p>
      <span class="status-badge status-${status}" style="margin-top:.5rem;display:inline-block">${labels[status] || status}</span>`;
  });

  region.addEventListener("mouseleave", () =>
    popup.classList.remove("visible"),
  );
  region.addEventListener("mousemove", function (e) {
    const svgRect = svg.parentElement.getBoundingClientRect();
    let px = e.clientX - svgRect.left + 18;
    let py = e.clientY - svgRect.top + 12;
    if (px + 230 > svgRect.width) px -= 248;
    popup.style.left = px + "px";
    popup.style.top = py + "px";
  });
});
function toggleLayer(btn) {
  btn.classList.toggle("active");
}

// ===== CHARTS =====
Chart.defaults.color = "rgba(245,242,236,0.4)";
Chart.defaults.borderColor = "rgba(245,242,236,0.05)";

const chartFont = { family: "'Outfit', sans-serif" };

// Population trend
new Chart(document.getElementById("populationChart").getContext("2d"), {
  type: "line",
  data: {
    labels: [
      "1970",
      "1975",
      "1980",
      "1985",
      "1990",
      "1995",
      "2000",
      "2005",
      "2010",
      "2015",
      "2020",
      "2024",
    ],
    datasets: [
      {
        label: "Indeks Populasi Satwa Liar",
        data: [100, 95, 89, 83, 78, 72, 66, 60, 54, 45, 28, 27],
        borderColor: "#c0392b",
        backgroundColor: "rgba(192,57,43,0.06)",
        fill: true,
        tension: 0.45,
        borderWidth: 1.5,
        pointBackgroundColor: "#c0392b",
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: "Cakupan Kawasan Lindung %",
        data: [2, 3, 4, 5, 6, 8, 9, 11, 13, 15, 17, 17],
        borderColor: "#3d8b3d",
        backgroundColor: "rgba(61,139,61,0.06)",
        fill: true,
        tension: 0.45,
        borderWidth: 1.5,
        pointBackgroundColor: "#3d8b3d",
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "rgba(245,242,236,0.5)",
          font: { ...chartFont, size: 11 },
          boxWidth: 12,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(245,242,236,0.04)" },
        ticks: {
          color: "rgba(245,242,236,0.35)",
          font: { ...chartFont, size: 10 },
        },
      },
      y: {
        grid: { color: "rgba(245,242,236,0.04)" },
        ticks: {
          color: "rgba(245,242,236,0.35)",
          font: { ...chartFont, size: 10 },
        },
      },
    },
  },
});

// Causes doughnut — Sumber: IPBES Global Assessment 2019 + IUCN
new Chart(document.getElementById("causesChart").getContext("2d"), {
  type: "doughnut",
  data: {
    labels: [
      "Hilangnya Habitat",
      "Eksploitasi Berlebihan",
      "Perubahan Iklim",
      "Spesies Invasif",
      "Polusi & Penyakit",
    ],
    datasets: [
      {
        data: [50, 24, 13, 9, 4],
        backgroundColor: [
          "#2d6e2d",
          "#c0392b",
          "#1e6080",
          "#d4870a",
          "#6d4c41",
        ],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "rgba(245,242,236,0.5)",
          font: { ...chartFont, size: 10 },
          padding: 14,
          boxWidth: 10,
        },
      },
    },
  },
});

// Regional bar
// Regional bar — diganti ke data per taksonomi (IUCN Red List 2024-2025)
new Chart(document.getElementById("regionalChart").getContext("2d"), {
  type: "bar",
  data: {
    labels: [
      "Amfibi",
      "Hiu & Pari",
      "Karang",
      "Konifer",
      "Mamalia",
      "Reptil",
      "Ikan Tawar",
      "Burung",
    ],
    datasets: [
      {
        label: "% Terancam dari total yang dievaluasi",
        data: [41, 37, 36, 34, 26, 21, 25, 12],
        backgroundColor: [
          "rgba(192,57,43,0.7)",
          "rgba(192,57,43,0.65)",
          "rgba(212,135,10,0.7)",
          "rgba(212,135,10,0.65)",
          "rgba(201,168,76,0.7)",
          "rgba(201,168,76,0.65)",
          "rgba(74,143,168,0.65)",
          "rgba(61,139,61,0.65)",
        ],
        borderRadius: 2,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "rgba(245,242,236,0.5)",
          font: { ...chartFont, size: 10 },
          boxWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.raw}% spesies terancam`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(245,242,236,0.03)" },
        ticks: {
          color: "rgba(245,242,236,0.35)",
          font: { ...chartFont, size: 9 },
        },
      },
      y: {
        max: 50,
        grid: { color: "rgba(245,242,236,0.03)" },
        ticks: {
          color: "rgba(245,242,236,0.35)",
          font: { ...chartFont, size: 10 },
          callback: (val) => val + "%",
        },
      },
    },
  },
});

// Penurunan per Wilayah — Sumber: WWF Living Planet Report 2024
new Chart(document.getElementById("recoveryChart").getContext("2d"), {
  type: "bar",
  data: {
    labels: [
      "Am. Latin & Karibia",
      "Afrika",
      "Asia-Pasifik",
      "Am. Utara",
      "Eropa & Asia Tengah",
    ],
    datasets: [
      {
        label: "% Penurunan Populasi Satwa sejak 1970",
        data: [95, 76, 60, 39, 35],
        backgroundColor: [
          "rgba(192,57,43,0.75)",
          "rgba(192,57,43,0.65)",
          "rgba(212,135,10,0.70)",
          "rgba(201,168,76,0.65)",
          "rgba(61,139,61,0.65)",
        ],
        borderRadius: 2,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        labels: {
          color: "rgba(245,242,236,0.5)",
          font: { ...chartFont, size: 10 },
          boxWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Turun ${ctx.raw}% sejak 1970`,
        },
      },
    },
    scales: {
      x: {
        max: 100,
        grid: { color: "rgba(245,242,236,0.03)" },
        ticks: {
          color: "rgba(245,242,236,0.35)",
          font: { ...chartFont, size: 10 },
          callback: (val) => val + "%",
        },
      },
      y: {
        grid: { color: "rgba(245,242,236,0.03)" },
        ticks: {
          color: "rgba(245,242,236,0.35)",
          font: { ...chartFont, size: 9 },
        },
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
  document.querySelectorAll(".hero-stat-num").forEach((el) => animateCount(el));
});
