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
document.addEventListener("DOMContentLoaded", () => {
  const points = document.querySelectorAll('.map-point');
  const popup = document.getElementById('mapPopup');
  const container = document.getElementById('mapContainer');
  const popupName = document.getElementById('popupName');
  const popupPop = document.getElementById('popupPop');
  const popupRisk = document.getElementById('popupRisk');

  if (points.length && popup && container) {
    points.forEach(point => {
      point.addEventListener('mouseenter', () => {
        popup.style.opacity = 1;
        popupName.innerText = point.dataset.name;
        popupPop.innerText = "Satwa: " + point.dataset.pop;
        popupRisk.innerText = "Status: " + point.dataset.risk;
      });
      point.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        popup.style.left = (e.clientX - rect.left) + 'px';
        popup.style.top = (e.clientY - rect.top) + 'px';
      });
      point.addEventListener('mouseleave', () => { popup.style.opacity = 0; });
    });
  }
});

// ===== CHARTS =====
Chart.defaults.color = "rgba(245,242,236,0.4)";
Chart.defaults.borderColor = "rgba(245,242,236,0.05)";
const chartFont = { family: "'Outfit', sans-serif" };

new Chart(document.getElementById("populationChart").getContext("2d"), {
  type: "line",
  data: {
    labels: ["1980","1985","1990","1995","2000","2005","2010","2015","2020","2024"],
    datasets: [
      { label: "Harimau Sumatera (ekor)", data: [1000,900,800,700,680,650,620,600,580,600], borderColor: "#c0392b", backgroundColor: "rgba(192,57,43,0.07)", fill: true, tension: 0.42, borderWidth: 1.8, pointBackgroundColor: "#c0392b", pointRadius: 3, pointHoverRadius: 6 },
      { label: "Orangutan Sumatera (ekor ÷10)", data: [5000,4500,4000,3500,3000,2500,2000,1700,1450,1385], borderColor: "#d4870a", backgroundColor: "rgba(212,135,10,0.06)", fill: true, tension: 0.42, borderWidth: 1.8, pointBackgroundColor: "#d4870a", pointRadius: 3, pointHoverRadius: 6 },
      { label: "Badak Jawa (ekor)", data: [60,58,55,52,50,55,58,63,68,76], borderColor: "#4a8fa8", backgroundColor: "rgba(74,143,168,0.06)", fill: false, tension: 0.42, borderWidth: 1.8, pointBackgroundColor: "#4a8fa8", pointRadius: 3, pointHoverRadius: 6 },
      { label: "Gajah Sumatera (ekor ÷10)", data: [500,460,420,380,330,280,240,200,180,170], borderColor: "#3d8b3d", backgroundColor: "rgba(61,139,61,0.06)", fill: false, tension: 0.42, borderWidth: 1.8, pointBackgroundColor: "#3d8b3d", pointRadius: 3, pointHoverRadius: 6 },
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

// ===== PHOTO UPLOAD PREVIEW =====
document.addEventListener("DOMContentLoaded", () => {
  const uploadArea = document.querySelector(".upload-area");
  if (!uploadArea) return;
  const fileInput = uploadArea.querySelector("input[type='file']");
  if (!fileInput) return;

  // Buat container preview setelah upload-area
  const previewContainer = document.createElement("div");
  previewContainer.className = "upload-preview";
  uploadArea.parentNode.insertBefore(previewContainer, uploadArea.nextSibling);

  fileInput.addEventListener("change", handleFiles);

  function handleFiles() {
    const files = Array.from(fileInput.files);
    previewContainer.innerHTML = "";
    if (files.length === 0) { updateLabel(0); return; }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const item = document.createElement("div");
        item.className = "preview-item";

        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "preview-img";
        img.alt = file.name;

        const overlay = document.createElement("div");
        overlay.className = "preview-overlay";

        const info = document.createElement("div");
        info.className = "preview-info";
        info.innerHTML = `
          <span class="preview-name">${file.name.length > 18 ? file.name.substring(0,16)+"…" : file.name}</span>
          <span class="preview-size">${file.size > 1048576 ? (file.size/1048576).toFixed(1)+" MB" : (file.size/1024).toFixed(0)+" KB"}</span>
        `;

        const removeBtn = document.createElement("button");
        removeBtn.className = "preview-remove";
        removeBtn.type = "button";
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          item.classList.add("preview-exit");
          setTimeout(() => {
            item.remove();
            updateLabel(previewContainer.children.length);
            if (previewContainer.children.length === 0) fileInput.value = "";
          }, 220);
        });

        overlay.appendChild(info);
        overlay.appendChild(removeBtn);
        item.appendChild(img);
        item.appendChild(overlay);
        previewContainer.appendChild(item);
        requestAnimationFrame(() => item.classList.add("preview-visible"));
      };
      reader.readAsDataURL(file);
    });

    updateLabel(files.length);
  }

  // Drag & drop
  uploadArea.addEventListener("dragover", (e) => { e.preventDefault(); uploadArea.classList.add("upload-drag"); });
  uploadArea.addEventListener("dragleave", () => uploadArea.classList.remove("upload-drag"));
  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("upload-drag");
    const dt = new DataTransfer();
    Array.from(e.dataTransfer.files).forEach(f => { if (f.type.startsWith("image/")) dt.items.add(f); });
    fileInput.files = dt.files;
    handleFiles();
  });

  function updateLabel(count) {
    const textEl = uploadArea.querySelector(".upload-text");
    if (!textEl) return;
    if (count === 0) {
      textEl.innerHTML = `Klik untuk unggah foto atau seret &amp; lepas<br/><span style="color:rgba(245,242,236,0.25);font-size:.72rem">PNG, JPG hingga 10MB</span>`;
    } else {
      textEl.innerHTML = `<span style="color:var(--sage);font-weight:500">${count} foto dipilih</span> &nbsp;·&nbsp; Klik untuk tambah<br/><span style="color:rgba(245,242,236,0.25);font-size:.72rem">PNG, JPG hingga 10MB</span>`;
    }
  }
});

// ===== SUBMIT REPORT WITH VALIDATION =====
function submitReport(btn) {
  const form = btn.closest(".report-form");
  const inputs = form.querySelectorAll(".form-input[required], .form-select[required], .form-textarea[required]");

  let allValid = true;
  inputs.forEach((input) => {
    const val = input.value.trim();
    if (!val || val === "") {
      allValid = false;
      input.classList.add("field-error");
      input.addEventListener("input", () => input.classList.remove("field-error"), { once: true });
    } else {
      input.classList.remove("field-error");
    }
  });

  if (!allValid) {
    btn.classList.add("btn-shake");
    setTimeout(() => btn.classList.remove("btn-shake"), 600);
    showToast("error", "⚠️ Semua field wajib diisi sebelum mengirim laporan.");
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Mengirim...';

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Laporan Terkirim';
    btn.style.background = "var(--forest-mid)";

    // Generate random report ID
    const randId = "#WG-2026-" + Math.floor(1000 + Math.random() * 9000);
    const genId = document.getElementById("generatedId");
    if (genId) genId.textContent = randId;

    showSuccessPopup();

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Laporan';
      btn.style.background = "";
      btn.disabled = false;
      // Reset form
      form.querySelectorAll(".form-input, .form-textarea").forEach((el) => (el.value = ""));
      form.querySelectorAll(".form-select").forEach((el) => (el.selectedIndex = 0));
      // Reset preview
      const preview = document.querySelector(".upload-preview");
      if (preview) preview.innerHTML = "";
      const fi = document.querySelector(".upload-area input[type='file']");
      if (fi) fi.value = "";
      const ut = document.querySelector(".upload-text");
      if (ut) ut.innerHTML = `Klik untuk unggah foto atau seret &amp; lepas<br/><span style="color:rgba(245,242,236,0.25);font-size:.72rem">PNG, JPG hingga 10MB</span>`;
    }, 3500);
  }, 1400);
}

function showToast(type, message) {
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast-visible"));
  setTimeout(() => { toast.classList.remove("toast-visible"); setTimeout(() => toast.remove(), 400); }, 3500);
}

function showSuccessPopup() {
  const overlay = document.getElementById("successOverlay");
  overlay.classList.add("popup-visible");
  document.body.style.overflow = "hidden";
}

function closeSuccessPopup() {
  const overlay = document.getElementById("successOverlay");
  overlay.classList.remove("popup-visible");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("successOverlay");
  if (overlay) overlay.addEventListener("click", (e) => { if (e.target === overlay) closeSuccessPopup(); });
});

// ===== ANIMAL SPOTLIGHT POPUP =====
const animalData = {
  "Harimau Sumatera": {
    scientific: "Panthera tigris sumatrae", status: "critical", statusLabel: "Kritis Terancam Punah",
    population: "~400–600 ekor", habitat: "Hutan dataran rendah Sumatera",
    threats: "Deforestasi, perburuan liar, konflik manusia-satwa",
    conservation: "Taman Nasional Gunung Leuser, Kerinci Seblat, Bukit Barisan Selatan",
    desc: "Harimau Sumatera adalah satu-satunya subspesies harimau yang tersisa di Indonesia dan salah satu yang paling terancam di dunia. Dengan ukuran tubuh lebih kecil dari kerabatnya di daratan Asia, harimau ini merupakan predator puncak ekosistem hutan Sumatera. Hilangnya habitat akibat konversi hutan menjadi perkebunan kelapa sawit dan perburuan ilegal adalah ancaman terbesar kelangsungan hidupnya.",
    fact: "Harimau Sumatera adalah perenang ulung dan sering mendinginkan diri di sungai dan kolam hutan.",
    iucn: "CR (Critically Endangered)", trend: "Menurun", img: "assets/img/harimau.jpg",
  },
  "Badak Jawa": {
    scientific: "Rhinoceros sondaicus", status: "critical", statusLabel: "Kritis Terancam Punah",
    population: "~76–80 ekor", habitat: "Taman Nasional Ujung Kulon, Banten",
    threats: "Populasi sangat kecil, bencana alam, ancaman penyakit",
    conservation: "Ujung Kulon adalah satu-satunya habitat tersisa di dunia",
    desc: "Badak Jawa adalah megafauna paling langka di Bumi. Tidak ada badak Jawa yang hidup di luar Taman Nasional Ujung Kulon. Dengan satu cula khas dan kulit berlipat seperti baju zirah, badak ini adalah warisan evolusi yang tidak ternilai. Ancaman terbesar kini bukan perburuan—melainkan sempitnya area habitat dan risiko bencana alam seperti tsunami dan erupsi Gunung Anak Krakatau.",
    fact: "Badak Jawa adalah hewan soliter yang menandai wilayahnya dengan kotoran dan percikan urin di pepohonan.",
    iucn: "CR (Critically Endangered)", trend: "Stabil (sangat kecil)", img: "assets/img/badakjawa.jpg",
  },
  "Orangutan Sumatera": {
    scientific: "Pongo abelii", status: "critical", statusLabel: "Kritis Terancam Punah",
    population: "~13.846 ekor", habitat: "Hutan hujan Sumatera bagian utara (Aceh & Sumatera Utara)",
    threats: "Deforestasi perkebunan kelapa sawit, perdagangan satwa ilegal, kebakaran hutan",
    conservation: "Taman Nasional Gunung Leuser, program reintroduksi SOCP",
    desc: "Orangutan Sumatera adalah kera besar Asia yang memiliki kecerdasan luar biasa—mampu menggunakan alat, belajar dari sesama, dan memiliki budaya sosial yang kompleks. Mereka menghabiskan hampir seluruh hidupnya di atas pohon. Kehilangan hutan tropis dataran rendah akibat ekspansi perkebunan dan penebangan liar telah memecah populasi mereka menjadi kelompok-kelompok terisolasi yang rentan.",
    fact: "Orangutan Sumatera memiliki masa bayi terlama di antara primata non-manusia—hingga 8 tahun.",
    iucn: "CR (Critically Endangered)", trend: "Menurun", img: "assets/img/orangutansumatera.jpg",
  },
  "Gajah Sumatera": {
    scientific: "Elephas maximus sumatranus", status: "critical", statusLabel: "Kritis Terancam Punah",
    population: "~1.700 ekor", habitat: "Hutan dataran rendah Sumatera, terutama Riau, Lampung, Aceh",
    threats: "Fragmentasi habitat, konflik dengan manusia, perburuan gading",
    conservation: "Flying Squad BKSDA, koridor satwa Tesso Nilo–Bukit Tigapuluh",
    desc: "Gajah Sumatera adalah subspesies gajah Asia terkecil dan satu-satunya gajah endemik Indonesia. Sebagai insinyur ekosistem, gajah berperan vital dalam menyebarkan biji tanaman dan membentuk struktur hutan. Konflik dengan manusia adalah ancaman paling mendesak—ketika habitat menyempit, gajah masuk ke lahan pertanian dan perkebunan, menyebabkan kerugian bagi petani dan kematian bagi gajah.",
    fact: "Seekor gajah Sumatera dewasa dapat mengonsumsi hingga 150 kg tanaman dan meminum 200 liter air sehari.",
    iucn: "CR (Critically Endangered)", trend: "Menurun pesat", img: "assets/img/gajahsumatera.jpg",
  },
  "Jalak Bali": {
    scientific: "Leucopsar rothschildi", status: "critical", statusLabel: "Kritis Terancam Punah",
    population: "~100 ekor liar (+ populasi penangkaran)", habitat: "Taman Nasional Bali Barat",
    threats: "Perburuan untuk perdagangan burung hias, habitat sempit",
    conservation: "Program penangkaran BTNBB, pelepasliaran rutin sejak 1990-an",
    desc: "Jalak Bali adalah burung endemik Pulau Bali dengan bulu putih bersih, topeng biru kobal, dan jambul memukau. Keindahannya yang ekstrem justru menjadi kutukan—permintaan tinggi sebagai burung hias mendorong perburuan masif hingga hampir memusnahkannya di alam liar. Program penangkaran intensif dan pelepasliaran telah sedikit memulihkan populasi liarnya.",
    fact: "Jalak Bali adalah satu-satunya burung endemik Pulau Bali dan menjadi lambang fauna Provinsi Bali.",
    iucn: "CR (Critically Endangered)", trend: "Sedikit membaik", img: "assets/img/jalakbali.jpg",
  },
  "Komodo": {
    scientific: "Varanus komodoensis", status: "endangered", statusLabel: "Terancam Punah",
    population: "~3.000–3.500 ekor", habitat: "Pulau Komodo, Rinca, Flores (Nusa Tenggara)",
    threats: "Kenaikan permukaan laut, penurunan mangsa, pariwisata tidak terkendali",
    conservation: "Taman Nasional Komodo (Situs Warisan Dunia UNESCO)",
    desc: "Komodo adalah kadal terbesar di dunia sekaligus satu-satunya spesies tersisa dari abad keemasan reptil raksasa. Sebagai predator puncak pulau-pulau kecil, komodo berburu rusa, babi hutan, dan bahkan kerbau dengan kombinasi gigitan kuat dan air liur berisi bakteri mematikan serta racun. Status IUCN diperbarui menjadi 'Terancam Punah' pada 2021 akibat proyeksi dampak perubahan iklim.",
    fact: "Komodo betina mampu bereproduksi secara partenogenesis—menghasilkan keturunan tanpa pejantan.",
    iucn: "EN (Endangered)", trend: "Rentan terhadap perubahan iklim", img: "assets/img/komodo.jpg",
  },
};

function openAnimalModal(cardEl) {
  const nameEl = cardEl.querySelector(".animal-name");
  if (!nameEl) return;
  const name = nameEl.textContent.trim();
  const data = animalData[name];
  if (!data) return;

  const modal = document.getElementById("animalModal");
  const statusClass = data.status === "critical" ? "status-critical" : "status-endangered";

  modal.querySelector(".amodal-img").src = data.img;
  modal.querySelector(".amodal-img").alt = name;
  modal.querySelector(".amodal-status").className = `animal-status ${statusClass} amodal-status`;
  modal.querySelector(".amodal-status").textContent = data.statusLabel;
  modal.querySelector(".amodal-name").textContent = name;
  modal.querySelector(".amodal-scientific").textContent = data.scientific;
  modal.querySelector(".amodal-desc").textContent = data.desc;
  modal.querySelector(".amodal-fact").textContent = data.fact;
  modal.querySelector(".amodal-pop").textContent = data.population;
  modal.querySelector(".amodal-habitat").textContent = data.habitat;
  modal.querySelector(".amodal-threats").textContent = data.threats;
  modal.querySelector(".amodal-conservation").textContent = data.conservation;
  modal.querySelector(".amodal-iucn").textContent = data.iucn;
  modal.querySelector(".amodal-trend").textContent = data.trend;

  modal.classList.add("popup-visible");
  document.body.style.overflow = "hidden";
}

function closeAnimalModal() {
  const modal = document.getElementById("animalModal");
  modal.classList.remove("popup-visible");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("animalModal");
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeAnimalModal(); });

  document.querySelectorAll(".animal-card").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => openAnimalModal(card));
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeSuccessPopup(); closeAnimalModal(); }
});

// ===== INIT =====
window.addEventListener("load", () => {
  handleScrollAnimations(); handleParallax();
  document.querySelectorAll(".hero-stat-num").forEach((el) => animateCount(el));
});