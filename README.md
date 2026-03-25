# 🌿 LindungiSatwa

> Platform web konservasi satwa liar Indonesia yang informatif, interaktif, dan berbasis data referensi resmi.

---

## 📋 Deskripsi

**LindungiSatwa** adalah website statis modern bertema konservasi satwa liar yang dirancang untuk meningkatkan kesadaran publik terhadap ancaman kepunahan spesies di Indonesia dan dunia. Website ini menggabungkan visualisasi data interaktif, peta habitat, sistem pelaporan kejadian, dan galeri edukasi satwa dalam satu platform yang imersif.

---

## ✨ Fitur Utama

### 🗺️ Peta Intelijen Satwa Liar Indonesia
- Peta SVG interaktif kepulauan Indonesia
- Klik wilayah untuk melihat detail spesies dan tingkat risiko
- Penanda kejadian animasi real-time per pulau
- Marker Taman Nasional (TN Ujung Kulon, TN Gunung Leuser, TN Tanjung Puting, TN Komodo, TN Lorentz)
- Label kawasan laut dan koordinat geografis

### 📊 Dasbor Intelijen Data
- **Grafik 1** — Tren populasi 4 satwa kunci Indonesia (1980–2024): Harimau Sumatera, Orangutan Sumatera, Badak Jawa, Gajah Sumatera
- **Grafik 2** — Ancaman utama satwa liar Indonesia (donat)
- **Grafik 3** — Jumlah spesies terancam per pulau & kelompok taksa
- **Grafik 4** — Tutupan hutan tersisa vs kehilangan hutan per pulau
- Blok referensi lengkap 8 sumber resmi di bawah dasbor

### 🐾 Galeri Satwa Terancam Indonesia
- Harimau Sumatera (*Panthera tigris sumatrae*)
- Badak Jawa (*Rhinoceros sondaicus*)
- Orangutan Sumatera (*Pongo abelii*)
- Gajah Sumatera (*Elephas maximus sumatranus*)
- Jalak Bali (*Leucopsar rothschildi*)
- Komodo (*Varanus komodoensis*)

### 🚨 Sistem Pelaporan Kejadian
- Form laporan: jenis kejadian, jenis hewan, lokasi, deskripsi
- Upload bukti foto
- Tracker laporan terkini dengan status: Menunggu / Ditinjau / Selesai
- Timeline progress penanganan per laporan

### 📚 Edukasi Publik
- 8 kartu tindakan nyata yang bisa dilakukan masyarakat
- Panduan wisata satwa etis
- Informasi advokasi kebijakan

### 🌿 Efek Visual & Animasi
- Parallax scrolling multi-layer (hero, hutan, dampak konservasi)
- Silhouette satwa muncul saat scroll (🦅 🐘 🐅)
- Animasi counter statistik
- Custom cursor dengan efek ring
- Grain overlay untuk nuansa sinematik
- Glassmorphism cards

---

## 🛠️ Teknologi

| Teknologi | Kegunaan |
|---|---|
| HTML5 | Struktur & konten |
| CSS3 | Styling, animasi, parallax |
| Vanilla JavaScript | Interaktivitas & logika |
| Chart.js 4.4.0 | Visualisasi data grafik |
| Font Awesome 6.4 | Ikon antarmuka |
| Google Fonts | Cormorant Garamond, Outfit, JetBrains Mono |
| SVG | Peta Indonesia interaktif |

> ⚡ Tidak menggunakan framework — murni HTML, CSS, dan JavaScript.

---

## 📊 Sumber Data & Referensi

Seluruh data yang ditampilkan bersumber dari publikasi resmi:

| No | Sumber | Data |
|---|---|---|
| 01 | **IUCN Red List 2024–2025** | Status & populasi spesies |
| 02 | **WWF Living Planet Report 2024** | Indeks populasi & penurunan per wilayah |
| 03 | **IPBES Global Assessment 2019** | Penyebab kepunahan |
| 04 | **Kementerian LHK RI 2023** | Tutupan hutan & kawasan konservasi |
| 05 | **BRIN — Biota Indonesia 2023** | Sebaran spesies endemik per pulau |
| 06 | **Forest Watch Indonesia 2023** | Kehilangan hutan per pulau |
| 07 | **Global Forest Watch 2024** | Analisis citra satelit tutupan pohon |
| 08 | **BKSDA RI 2023** | Kasus perburuan & perdagangan satwa |
| 09 | **CITES 2024** | Negara penandatangan konvensi |
| 10 | **UNEP-WCMC 2024** | Jumlah kawasan lindung global |

---

## 🚀 Demo & Instalasi

### 🌐 Live Demo
[🔗 Klik di sini untuk melihat website](https://link-deploy-kamu.com)

### 💻 Instalasi Lokal
Website ini adalah **static website** — tidak memerlukan server atau instalasi apapun.
**Cara 1 — Buka langsung:**
```
Klik dua kali file index.html
```

**Cara 2 — Menggunakan Live Server (VS Code):**
```
1. Install ekstensi Live Server di VS Code
2. Klik kanan index.html → Open with Live Server
3. Browser akan membuka http://127.0.0.1:5500
```

> 💡 Disarankan menggunakan Live Server agar favicon dan semua aset tampil dengan benar.

---

## 🎨 Desain

| Elemen | Detail |
|---|---|
| **Tema** | Dark nature · Luxury editorial |
| **Warna Utama** | Hijau hutan `#2d6e2d` · Hijau sage `#7aab7a` |
| **Warna Aksen** | Biru langit `#4a8fa8` · Amber `#d4870a` |
| **Background** | Hitam hutan `#080f08` |
| **Font Display** | Cormorant Garamond (serif elegan) |
| **Font Body** | Outfit (sans-serif modern) |
| **Font Mono** | JetBrains Mono (data & kode) |

---

## ⚠️ Catatan Data

Beberapa data dalam website merupakan **estimasi terbaik** berdasarkan rekonstruksi dari berbagai sumber resmi. Data yang bersifat estimasi diberi label **"Est."** Data operasional platform (jumlah laporan, dll.) bersifat simulasi untuk keperluan demonstrasi.

---

## 👨‍💻 Dibuat oleh

> **[Salam Titik Koma]**

---

## 📄 Lisensi

Data satwa mengacu pada sumber terbuka IUCN, WWF, dan lembaga pemerintah Indonesia. Website ini dibuat untuk keperluan edukasi dan kompetisi non-komersial.
