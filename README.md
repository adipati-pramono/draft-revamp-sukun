# SWI Sales 2.0 — Draft Revamp UI/UX

Konsep desain ulang untuk aplikasi lapangan **PT. SUKUN WARTONO INDONESIA** (APK `com.muham.a25_03_pt_swi_sales`). Seluruh **37 layar** dari folder `screenshots/` dirancang ulang menjadi prototipe HTML/CSS interaktif yang lebih modern, jelas, dan ramah penggunaan.

> Data pada prototipe adalah contoh (dummy) yang konsisten antar layar: Agus Susanto, DJO-01 Malang Kota, Senin 23 November 2026, dan outlet seperti Toko Sinar Jaya.

---

## Cara membuka

**Paling mudah** — buka `index.html` langsung di browser.

Untuk hasil terbaik (iframe & font), jalankan server lokal dari folder ini:

```bash
cd draft-revamp
python3 -m http.server 8080
# lalu buka http://localhost:8080
```

Halaman utama:

| Halaman | Isi |
| --- | --- |
| `index.html` | Galeri 37 layar dengan pencarian, filter modul, dan pratinjau penuh |
| `design-system.html` | Token warna, tipografi, komponen, dan ikon |
| `screens/01-login.html` | Titik masuk prototipe — seluruh navigasi saling terhubung |

---

## Struktur folder

```
draft-revamp/
├── index.html                 # Galeri layar (desktop)
├── design-system.html         # Dokumentasi visual
├── README.md
├── assets/
│   ├── theme.css              # Token & seluruh komponen
│   ├── sprite.js              # Sprite ikon SVG
│   └── app.js                 # Status bar, bottom nav, interaksi demo
├── screens/                   # 37 layar standalone (390 × 844)
└── screenshots/               # Render PNG setiap layar (1080 × 2338)
```

---

## Bahasa desain

- **Warna** — navy–indigo (`#2E4BC6 → #0B1437`) sebagai identitas, dengan aksen semantik: hijau (berhasil), teal (lunas/setor), amber (peringatan), rose (piutang/bahaya), violet (promo).
- **Tipografi** — Inter, angka tabular untuk nominal; hierarki tegas antara judul, nilai, dan keterangan.
- **Bentuk** — kartu putih radius 20 px, latar `#F4F6FB`, bayangan lembut; hero gradien untuk informasi utama.
- **Navigasi** — bottom nav 5 tab (Beranda, Rute, Jual, Piutang, Lainnya) konsisten di seluruh layar bertab.
- **Aksesibilitas** — target sentuh ≥ 44 px, label form eksplisit, status tidak hanya dibedakan lewat warna (selalu ada teks/ikon).

---

## Pemetaan 37 layar

| # | Layar asli | File | Perubahan utama |
| --- | --- | --- | --- |
| 01 | Login | `01-login.html` | Layar penuh gradien, input besar, toggle sandi, biometrik |
| 02 | Main | `02-main.html` | Hero sapaan, kartu rute mengambang, 4 aksi cepat, KPI, tabel tersegmentasi |
| 03 | Persiapan | `03-persiapan.html` | Stepper progres, pilihan DJO kartu, input odometer besar |
| 04 | Jalur | `04-jalur.html` | Pencarian di atas, kartu radio DJO dengan info outlet |
| 05 | EditKma | `05-editkma.html` | Input nominal besar, chip nominal cepat |
| 06 | EditKmz | `06-editkmz.html` | Ring jarak tempuh, selisih km otomatis |
| 07 | Callsheet | `07-callsheet.html` | Ring sisa bon, rincian piutang, unduh komitmen |
| 08 | Distribusi | `08-distribusi.html` | Kartu omzet + progres, tabel brand, sorotan terbaik |
| 09 | Ops | `09-ops.html` | Total pengeluaran jelas, daftar biaya, FAB tambah |
| 10 | OpsPlus | `10-opsplus.html` | Chip jenis biaya, nominal, detail BBM |
| 11 | Hasil | `11-hasil.html` | Hero total setoran, rincian do/don't, CTA upload |
| 12 | JualPlgn | `12-jualplgn.html` | Hero kunjungan, statistik 4 status, kartu outlet |
| 13 | JualKunj | `13-jualkunj.html` | Kartu outlet, peta, akurasi GPS, satu CTA |
| 14 | JualDetail | `14-jualdetail.html` | Tab item, total menyatu, pemilihan pembayaran |
| 15 | JualRokok | `15-jualrokok.html` | Pemilih brand, stepper total live, GPS |
| 16 | JualStokoRokok | `16-jualstokorokok.html` | Daftar stok, peringatan stok menipis |
| 17 | JualStokoDetail | `17-jualstokodetail.html` | Detail stok per brand + riwayat |
| 18 | JualSample | `18-jualsample.html` | Input sample cepat dengan stepper |
| 19 | JualCangkangBeli | `19-jualcangkangbeli.html` | Stepper dengan harga otomatis |
| 20 | JualTukarCangkang | `20-jualtukarcangkang.html` | Visual konversi 20:1 |
| 21 | JualReturKas | `21-jualreturkas.html` | Limit retur, tahun cukai tersegmentasi |
| 22 | Bon | `22-bon.html` | Banner sukses, ring sisa bon, aksi unduh/unggah |
| 23 | BonRokok | `23-bonrokok.html` | Pemilih brand, stepper, sisa jatah |
| 24 | BonPiutang | `24-bonpiutang.html` | Aksi unduh/unggah, daftar nota |
| 25 | KembaliPiut | `25-kembalipiut.html` | Pencarian nota, kartu unggah |
| 26 | PiutPlgn | `26-piutplgn.html` | Hero total piutang, statistik, kartu outlet |
| 27 | BayarBG | `27-bayarbg.html` | Kartu bank, No. BG, ringkasan |
| 28 | BayarCash | `28-bayarcash.html` | Nota dengan checkbox, total dipilih, lunas |
| 29 | NotaPiutang | `29-notapiutang.html` | Pratinjau struk, cetak ASLI/COPY |
| 30 | Moster | `30-moster.html` | Kartu promo violet, progres, CTA input |
| 31 | MosterRokok | `31-mosterrokok.html` | Brand promo, stepper, pratinjau bonus |
| 32 | RegPlgn | `32-regplgn.html` | Statistik outlet, filter kategori, FAB tambah |
| 33 | RegNew | `33-regnew.html` | Form bertahap, kartu pemilik, GPS |
| 34 | RegEdit | `34-regedit.html` | Form terisi, badge terverifikasi, perbarui lokasi |
| 35 | DeviceList | `35-devicelist.html` | Radar pemindaian, daftar perangkat, status koneksi |
| 36 | Cetak | `36-cetak.html` | Status printer, mode 32/48 CHR, pratinjau struk |
| 37 | Upload | `37-upload.html` | Checklist sinkronisasi, koneksi aman, log out |

---

## Interaksi yang bisa dicoba

- **Chip filter** dan **segmented control** — klik untuk mengubah pilihan.
- **Stepper jumlah** — tombol `− / +` mengubah jumlah dan total harga (layar Jual/Bon).
- **Switch & checkbox** — aktif/nonaktif dengan animasi.
- **Tab** pada Detail Penjualan, **panel** Harga Rokok/Retur di Beranda.
- **Toggle sandi** di Login, **bottom nav** untuk berpindah modul.
- **Kartu layar** di galeri — klik untuk pratinjau penuh, `Esc` untuk menutup.

---

## Render ulang screenshot

Screenshot dihasilkan dengan Chrome headless (viewport 390×844, skala 2.77 → ±1080×2338):

```bash
cd draft-revamp
mkdir -p screenshots
google-chrome --headless=new --disable-gpu --hide-scrollbars \
  --window-size=390,844 --force-device-scale-factor=2.77 \
  --virtual-time-budget=5000 \
  --screenshot=screenshots/02-Main.png \
  "file://$PWD/screens/02-main.html"
```

## Catatan

- Prototipe ini **statis** — belum terhubung ke API/backend. Semua aksi tombol bersifat simulasi.
- Alur, istilah, dan field mengikuti layout asli (`screens/`), sehingga mudah dijadikan acuan implementasi Android.
