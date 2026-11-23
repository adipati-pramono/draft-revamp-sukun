# API Aplikasi SWI Sales

Dokumen ini adalah hasil ekstraksi statis dari APK `com.muham.a25_03_pt_swi_sales` (SWI Sales v11.0, versionCode 110). Seluruh endpoint, parameter, status respons, dan alur pemanggilan diambil dari source hasil decompile di `jadx/sources/...` (kode identik juga tersedia di `gradle-project/` dan `screens/`).

## 1. Identitas dan konfigurasi

| Item | Nilai | Sumber |
|---|---|---|
| Package | `com.muham.a25_03_pt_swi_sales` | `apktool/AndroidManifest.xml:1` |
| Versi aplikasi | `11.0` / `110` | `apktool/apktool.yml:15-16` |
| Base URL | `https://mobile.sukun-adm.com/v110/` | `apktool/res/values/strings.xml:177` (`my_url`) |
| Protokol | HTTPS | resource `my_url` |
| HTTP client | Android Volley (`StringRequest`, `RequestQueue`, `DefaultRetryPolicy`) | seluruh kelas network |
| Format request | `application/x-www-form-urlencoded` | Volley `getParams()` |
| Format respons | JSON object | semua listener memakai `JSONObject` |
| Jumlah endpoint | 28 file PHP | lihat tabel bagian 3 |

### Model autentikasi

- Login mengirim `username` + `password` ke `login.php`.
- Server membalas seluruh master data yang kemudian **menggantikan isi SQLite lokal**.
- Setelah login, tidak ada token, cookie, atau header `Authorization` yang disetel aplikasi. Identitas petugas dikirim ulang sebagai field `kdptg` pada hampir setiap request.
- `logout.php` mengirim `kdptg`, `kdjlr`, `kma`, `kmz` lalu menghapus tabel `log` lokal jika berhasil.

## 2. Konvensi request dan respons

- Aplikasi hanya memakai **POST**. Konstruktor `StringRequest(1, url, ...)` berarti method HTTP `POST` (Volley `Request.Method.POST`).
- Semua parameter dikirim sebagai form field. Payload kumpulan data (array) dikirim sebagai **satu field berisi JSON string**, misalnya `bontmp=[{"id":"1",...}]`.
- Respons normal selalu berupa JSON object dengan field `"status"`.
- Nilai status yang ditemukan:

| Status | Arti / penanganan |
|---|---|
| `berhasil` | Login/master download/`save_area` sukses |
| `tersimpan` | Upload data sukses |
| `denied` | Username/password salah (`"Username atau Password salah"`) |
| `lock` | Hari/transaksi sudah terkunci (`"Maaf sudah terkunci"`) |
| `400` | Download gagal (`"Download Gagal"`) |
| `penuh` | Login ditolak sementara, diminta mengulang (`"Ulangi beberapa saat lagi"`) |
| `gagal` | Riwayat login hilang saat logout (`"History Login hilang"`) |

- Retry policy: 1 kali retry, timeout ±10 detik. Pengecualian: `Download_Komitmen.php` 2 detik, `save_area.php` 5 detik.
- Pesan error koneksi yang sama dipakai di banyak layar: `"No connection internet"`, `"Server is not responding"`, `"Your device is not connected to internet"`, `"Parse Error"`.

## 3. Ringkasan endpoint

| # | Method | Endpoint | Fungsi | Pemanggil utama | Parameter |
|---|---|---|---|---|---|
| 1 | POST | `login.php` | Autentikasi + unduh seluruh master data | `LoginActivity` | `username`, `password`, `login` |
| 2 | POST | `logout.php` | Tutup sesi/hari | `UploadActivity` | `kdptg`, `kdjlr`, `kma`, `kmz`, `logout` |
| 3 | POST | `save_area.php` | Simpan area/rute persiapan | `PersiapanActivity` | `kdptg`, `kdjlr`, `driver`, `nopol`, `kma`, `jalur` |
| 4 | POST | `Download_Komitmen.php` | Unduh target komitmen | `DistribusiActivity` | `kdptg`, `komitmen` |
| 5 | POST | `Download_BonTmp.php` | Unduh bon/sisa/BonAndroid | `BonActivity` | `kdptg`, `download_bon` |
| 6 | POST | `Download_BonPiutang.php` | Unduh status bon piutang | `BonPiutangActivity` | `kdptg`, `download_bon` |
| 7 | POST | `Download_KembaliPiutang.php` | Unduh status kembali piutang | `KembaliPiutActivity` | `kdptg`, `download_kembaliPiut` |
| 8 | POST | `Upload_BonTmp.php` | Upload bon baru | `UploadActivity`, `BonActivity` | `bontmp`, `kdptg` |
| 9 | POST | `Upload_Plgn.php` | Upload outlet baru/perubahan | `UploadActivity` | `plgntmp`, `kdptg` |
| 10 | POST | `Upload_Kunjungan.php` | Upload kunjungan | `UploadActivity` | `kunjtmp`, `kdptg` |
| 11 | POST | `Upload_Stoko.php` | Upload stok opname | `UploadActivity` | `stokotmp`, `kdptg` |
| 12 | POST | `Upload_Penjualan.php` | Upload penjualan | `UploadActivity` | `jualtmp`, `kdptg` |
| 13 | POST | `Upload_Retur.php` | Upload retur | `UploadActivity` | `returtmp`, `kdptg` |
| 14 | POST | `Upload_Sisa.php` | Upload sisa | `UploadActivity` | `sisatmp`, `kdptg` |
| 15 | POST | `Upload_Langgan.php` | Upload piutang langganan | `UploadActivity` | `langgantmp`, `kdptg` |
| 16 | POST | `Upload_Langgan_Bon.php` | Upload bon langganan | `UploadActivity` | `langganbontmp`, `kdptg` |
| 17 | POST | `Upload_Langgan_Kembali.php` | Upload pengembalian langganan | `UploadActivity` | `langgankembalitmp`, `kdptg` |
| 18 | POST | `Upload_Saur.php` | Upload setoran/saur | `UploadActivity` | `saurtmp`, `kdptg` |
| 19 | POST | `Upload_KasKecil.php` | Upload kas kecil/operasional | `UploadActivity` | `kaskeciltmp`, `kdptg` |
| 20 | POST | `Upload_Master.php` | Upload konfigurasi printer | `UploadActivity` | `mastertmp`, `kdptg` |
| 21 | POST | `Upload_BonPiutang.php` | Upload bon piutang | `BonPiutangActivity` | `bonpiutang`, `kdptg` |
| 22 | POST | `Upload_KembaliPiutang.php` | Upload kembali piutang | `KembaliPiutActivity` | `kmpiutang`, `kdptg` |
| 23 | POST | `Upload_Rec_Kunjungan.php` | Upload kunjungan via receiver | `MyReceiver` | `kunjtmp`, `kdptg` |
| 24 | POST | `Upload_Rec_Stoko.php` | Upload stok via receiver | `MyReceiver` | `stokotmp`, `kdptg` |
| 25 | POST | `Upload_Rec_Penjualan.php` | Upload penjualan via receiver | `MyReceiver` | `jualtmp`, `kdptg` |
| 26 | POST | `Upload_Rec_Langgan.php` | Upload langganan via receiver | `MyReceiver` | `langgantmp`, `kdptg` |
| 27 | POST | `Upload_Rec_Saur.php` | Upload saur via receiver | `MyReceiver` | `saurtmp`, `kdptg` |
| 28 | POST | `Upload_Rec_Plgn.php` | Upload outlet via receiver | `MyReceiver` | `plgntmp`, `kdptg` |

Referensi source memakai prefiks `jadx/sources/com/muham/a25_03_pt_swi_sales/`.

## 4. Autentikasi dan bootstrap

### 4.1 `POST login.php`

- Pemanggil: `LoginActivity.postLogin()` — `LoginActivity.java:71-473`
- URL: `baseUrl + "login.php"`
- Body:

| Field | Tipe | Keterangan |
|---|---|---|
| `username` | string | Input pengguna |
| `password` | string | Input pengguna |
| `login` | string kosong | Penanda aksi login |

Contoh:

```http
POST /v110/login.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=AGUS&password=rahasia&login=
```

Respons sukses:

```json
{
  "status": "berhasil",
  "kdptg": "DJO-01",
  "kdjlr": "DJO-01",
  "nmptg": "AGUS",
  "jalur": "Malang Kota",
  "tanggal": "2026-11-23",
  "driver": "SUGIANTO",
  "nopol": "N 9012 XY",
  "kma": "45210",
  "kmz": "0",
  "edit": "1",
  "idperwkl": "SWI",
  "apk": "11.0",
  "btname": "RPP02N",
  "dotprint": "...",
  "mac": "00:11:22:33:44:55",
  "petugas": [],
  "kendaraan": [],
  "area": [],
  "office": [],
  "kecamatan": [],
  "kecil": [],
  "kecilsub": [],
  "kaskecil": [],
  "bank": [],
  "bandrol": [],
  "rokok": [],
  "sisa_min": [],
  "komitmen": [],
  "bon": [],
  "sisa": [],
  "BonAndroid": [],
  "stoko": [],
  "katplgn": [],
  "plgn": [],
  "langgan": [],
  "langgan_min": [],
  "langgan_bon": [],
  "langgan_posisi": [],
  "langgan_kembali": [],
  "saur": [],
  "kunj": [],
  "retur": [],
  "jual": [],
  "hisjual": []
}
```

Field top-level yang dibaca (`LoginActivity.java:103-123`):

`status`, `katplgn`, `kdptg`, `kdjlr`, `nmptg`, `edit`, `jalur`, `tanggal`, `driver`, `nopol`, `idperwkl`, `kma`, `kmz`, `apk`, `btname`, `dotprint`, `mac`.

Array respons dan kolom yang dipakai (`LoginActivity.java:130-421`):

| Key JSON | Tabel SQLite | Field |
|---|---|---|
| `petugas` | `petugas` | `kdptg`, `nmptg`, `kdjab`, `idperwkl` |
| `kendaraan` | `kendaraan` | `nopol`, `jenis`, `idperwkl` |
| `area` | `djo` | `kdjlr`, `jalur`, `idperwkl`, `mode` |
| `office` | `office` | `idperwkl`, `ho`, `perwakilan`, `alamat` |
| `kecamatan` | `kecamatan` | `idperwkl`, `kota`, `kec`, `desa` |
| `kecil` | `kecil` | `kdkecil`, `keterangan` |
| `kecilsub` | `kecilsub` | `kdkecil`, `kdsub`, `keterangansub` |
| `kaskecil` | `kaskecil` | `tanggal`, `jam`, `kdptg`, `kdkecil`, `kdsub`, `ket`, `jumlah`, `km`, `volume` |
| `bank` | `bank` | `kdbank`, `nmbank` |
| `bandrol` | `bandrol` | `kdrkk`, `tahun`, `harga` |
| `rokok` | `rokok` | `urut`, `kdrkk`, `nmrkk`, `singkatan`, `pres`, `pak`, `jnrkk`, `hgagen`, `hgdrb`, `hgdrk`, `hgkuf`, `hguser`, `cang`, `tukar`, `jum`, `bonus`, `moster`, `sample`, `retur`, `editharga` |
| `sisa_min` | `sisa_min` | `tanggal`, `kdptg`, `kdrkk`, `noorder`, `noorder1`, `jumlah`, `harga` |
| `komitmen` | `komitmen` | `tanggal`, `kdptg`, `kdjlr`, `scc`, `ecc`, `ket`, `kdrkk`, `jumlah` |
| `bon` | `bon` | `tanggal`, `kdptg`, `kdrkk`, `noorder`, `jumlah`, `harga` |
| `sisa` | `sisa` | `tanggal`, `kdptg`, `kdrkk`, `noorder`, `noorder1`, `jumlah`, `harga` |
| `BonAndroid` | `android_bon` | `tanggal`, `kdptg`, `noorder`, `kdrkk`, `jumlah`, `idperwkl`, `acc`, `tglacc`, `mode` |
| `stoko` | `stoko` | `tanggal`, `kdptg`, `kdjlr`, `kdplg`, `kdrkk`, `jumlah`, `lat`, `lng`, `akurat`, `jam`, `idperwkl`, `alasan` |
| `katplgn` | `katplgn` | `kategori`, `kdkg`, `nmkat` |
| `plgn` | `plgn` | `kdplg`, `kdsmt`, `nmplg`, `pemilik`, `almplg`, `almrmh`, `telepon`, `kdjlr`, `kategori`, `desa`, `kec`, `kota`, `lat`, `lng`, `akurat`, `idperwkl`, `mode`, `ubah`, `urut`, `lock` |
| `langgan` | `langgan` | `tanggal`, `kdkg`, `nota`, `kdrkk`, `kdjlr`, `kdplg`, `piut`, `tgnota`, `tgtempo`, `idperwkl`, `mode` |
| `langgan_min` | `langgan_min` | `tanggal`, `kdkg`, `nota`, `kdrkk`, `kdjlr`, `kdplg`, `piut`, `tgnota`, `tgtempo`, `idperwkl` |
| `langgan_bon` | `langgan_bon` | `tanggal`, `jam`, `nota`, `kdptg`, `acc`, `jamacc`, `mode` |
| `langgan_posisi` | `langgan_posisi` | `tanggal`, `nota`, `kdptg`, `mode` |
| `langgan_kembali` | `langgan_kembali` | `tanggal`, `jam`, `nota`, `kdptg`, `acc`, `jamacc`, `mode` |
| `saur` | `saur` | `tanggal`, `kdkg`, `nota`, `kdjlr`, `kdplg`, `saur`, `tgtempo`, `tgnota`, `piut`, `nobg`, `kdbank`, `jumlah`, `kdptg`, `kdrkk`, `idperwkl` |
| `kunj` | `kunjungan` | `tanggal`, `kdptg`, `kdjlr`, `kdplg`, `lat`, `lng`, `akurat`, `jam`, `idperwkl` |
| `retur` | `retur` | `tanggal`, `kdjlr`, `kdplg`, `kdptg`, `kredit`, `hgbks`, `kdrkk`, `jumlah`, `tothg`, `ket`, `idperwkl` |
| `jual` | `jual` | `id_jual`, `tanggal`, `jam`, `noorder`, `kdkg`, `nota`, `kdptg`, `kdjlr`, `kdplg`, `tgtempo`, `kdrkk`, `cang`, `jumlah`, `hgkirim`, `hgjual`, `total`, `alebih`, `tlebih`, `lat`, `lng`, `akurat`, `idperwkl` |
| `hisjual` | `hisjual` | `tanggal`, `kdjlr`, `kdplg`, `kdrkk`, `jumlah` |

Jika login sukses, aplikasi membuka `MainActivity`. Nilai lokal `versi = "9.0"` disimpan ke tabel `log`, tetapi **tidak dikirim** ke server (`LoginActivity.java:41`, `:127`).

### 4.2 `POST logout.php`

- Pemanggil: tombol Log Out di `UploadActivity.LogOut()` — `UploadActivity.java:177-256`
- Body:

| Field | Keterangan |
|---|---|
| `kdptg` | Kode petugas |
| `kdjlr` | Kode jalur |
| `kma` | KM awal dari tabel `log` |
| `kmz` | KM akhir dari tabel `log` |
| `logout` | String kosong, penanda aksi |

- Status yang ditangani: `denied`, `lock`, `400`, `gagal`, `berhasil`.
- Jika `berhasil`, aplikasi menjalankan `DELETE FROM log` lalu me-refresh tampilan.

## 5. Persiapan area

### 5.1 `POST save_area.php`

- Pemanggil: tombol simpan `PersiapanActivity` — `PersiapanActivity.java:112-216`
- Body:

| Field | Sumber |
|---|---|
| `kdptg` | Petugas login |
| `kdjlr` | Rute yang dipilih/diisi |
| `driver` | Nama driver |
| `nopol` | Nomor polisi |
| `kma` | KM awal |
| `jalur` | Selalu dikirim **string kosong** (bug/kuirk; nilai `fjalur` hanya dipakai untuk update SQLite lokal) |

- Respons sukses: `{"status":"berhasil","hisjual":[...]}`.
- Array `hisjual`: `tanggal`, `kdjlr`, `kdplg`, `kdrkk`, `jumlah`.
- Setelah sukses: tabel `hisjual` diganti, tabel `log` di-update, lalu navigasi ke `BonPiutangActivity` jika masih ada piutang atau ke `MainActivity` jika tidak ada.

## 6. Endpoint download

Semua endpoint download memakai pola status `berhasil` / `denied` / `lock` / `400` dan menimpa tabel lokal terkait.

### 6.1 `POST Download_BonTmp.php`

- Pemanggil: `BonActivity.DownloadBonTmp()` — `BonActivity.java:226-330`
- Body: `kdptg`, `download_bon` (string kosong).
- Respons sukses:

```json
{
  "status": "berhasil",
  "bon": [],
  "sisa": [],
  "BonAndroid": []
}
```

| Array | Field | Aksi lokal |
|---|---|---|
| `bon` | `tanggal`, `kdptg`, `kdrkk`, `noorder`, `jumlah`, `harga` | Ganti tabel `bon` |
| `sisa` | `tanggal`, `kdptg`, `kdrkk`, `noorder`, `noorder1`, `jumlah`, `harga` | Ganti tabel `sisa` |
| `BonAndroid` | `tanggal`, `kdptg`, `noorder`, `kdrkk`, `jumlah`, `idperwkl`, `acc`, `tglacc`, `mode` | Ganti tabel `android_bon` |

### 6.2 `POST Download_BonPiutang.php`

- Pemanggil: `BonPiutangActivity.DownloadBonPiutang()` — `BonPiutangActivity.java:176-299`
- Body: `kdptg`, `download_bon` (string kosong).
- Respons sukses:

```json
{
  "status": "berhasil",
  "bonpiutang": [],
  "langganposisi": []
}
```

| Array | Field | Aksi lokal |
|---|---|---|
| `bonpiutang` | `tanggal`, `kdptg`, `nota`, `jam`, `acc`, `jamacc`, `mode` | Update `langgan_bon` berdasarkan `nota` + `kdptg` + `tanggal` |
| `langganposisi` | `tanggal`, `kdptg`, `nota` | Insert ke `langgan_posisi` jika belum ada |

### 6.3 `POST Download_KembaliPiutang.php`

- Pemanggil: `KembaliPiutActivity` — `KembaliPiutActivity.java:210-333`
- Body: `kdptg`, `download_kembaliPiut` (string kosong; perhatikan huruf kapital `P`).
- Respons sukses:

```json
{
  "status": "berhasil",
  "kmpiutang": [],
  "langganposisi": []
}
```

| Array | Field | Aksi lokal |
|---|---|---|
| `kmpiutang` | `tanggal`, `kdptg`, `nota`, `jam`, `acc`, `jamacc`, `mode` | Update `langgan_kembali` |
| `langganposisi` | `tanggal`, `kdptg`, `nota` | Hapus seluruh `langgan_posisi`, lalu insert ulang |

### 6.4 `POST Download_Komitmen.php`

- Pemanggil: `DistribusiActivity.DownloadKomitmen()` — `DistribusiActivity.java:96-162`
- Body: `kdptg`, `komitmen` (string kosong).
- Respons sukses: `{"status":"berhasil","komitmen":[...]}`.
- Field `komitmen`: `tanggal`, `kdptg`, `kdjlr`, `scc`, `ecc`, `ket`, `kdrkk`, `jumlah`.
- Aksi lokal: ganti tabel `komitmen`, lalu render distribusi.

## 7. Upload massal (tombol Upload di `UploadActivity`)

### 7.1 Urutan pemanggilan

Tombol **Upload Semua Data** memulai rantai berikut (`UploadActivity.java:166-173`). Setiap endpoint hanya dipanggil bila ada baris `mode = "tmp"`; respons `"tersimpan"` menghapus/menandai data lokal lalu melanjutkan ke endpoint berikutnya.

```
Upload_BonTmp
  -> Upload_Plgn
  -> Upload_Kunjungan
  -> Upload_Stoko
  -> Upload_Penjualan
  -> Upload_Retur
  -> Upload_Sisa
  -> Upload_Langgan
  -> Upload_Langgan_Bon
  -> Upload_Langgan_Kembali
  -> Upload_Saur
  -> Upload_KasKecil
  -> Upload_Master
```

Logout adalah aksi terpisah dan tidak dipanggil otomatis setelah `Upload_Master`.

### 7.2 Kontrak umum

- Body selalu berisi `kdptg` + satu field JSON array sesuai jenis data.
- Status sukses: `"tersimpan"`.
- Status error yang ditangani: `"lock"` (sebagian endpoint), selain itu dialog ditutup tanpa lanjut.
- Setelah sukses, baris `mode = "tmp"` dihapus atau diubah menjadi `""`, lalu lanjut ke tahap berikutnya.

### 7.3 Detail payload

| Endpoint | Field form | Field di setiap objek JSON | Aksi setelah `tersimpan` |
|---|---|---|---|
| `Upload_BonTmp.php` | `bontmp` | `id`, `tanggal`, `noorder`, `kdptg`, `kdrkk`, `jumlah`, `acc`, `mode` | `DELETE android_bon WHERE mode='tmp'` |
| `Upload_Plgn.php` | `plgntmp` | `id`, `kdplg`, `kdsmt`, `nmplg`, `pemilik`, `almplg`, `almrmh`, `telepon`, `kdjlr`, `kategori`, `desa`, `kec`, `kota`, `lat`, `lng`, `mode`, `ubah`, `akurat`, `kulak`, `almkulak` | Hapus baris `plgn` tmp |
| `Upload_Kunjungan.php` | `kunjtmp` | `id`, `tanggal`, `kdptg`, `kdjlr`, `kdplg`, `lat`, `lng`, `akurat`, `jam`, `jamend`, `mode` | Hapus baris `kunjungan` tmp |
| `Upload_Stoko.php` | `stokotmp` | `id`, `tanggal`, `kdptg`, `kdjlr`, `kdplg`, `kdrkk`, `jumlah`, `lat`, `lng`, `akurat`, `jam`, `mode`, `alasan` | Hapus baris `stoko` tmp |
| `Upload_Penjualan.php` | `jualtmp` | `id`, `tanggal`, `jam`, `kdkg`, `nota`, `kdptg`, `kdjlr`, `kdplg`, `tgtempo`, `kdrkk`, `cang`, `jumlah`, `hgkirim`, `hgjual`, `total`, `alebih`, `tlebih`, `lat`, `lng`, `akurat`, `mode` | Hapus baris `jual` tmp |
| `Upload_Retur.php` | `returtmp` | `id`, `tanggal`, `kdjlr`, `kdplg`, `kdptg`, `kredit`, `hgbks`, `kdrkk`, `jumlah`, `tothg`, `ket`, `mode` | Hapus baris `retur` tmp |
| `Upload_Sisa.php` | `sisatmp` | `id`, `tanggal`, `kdptg`, `kdrkk`, `noorder`, `jumlah`, `harga`, `mode` | Hapus baris `sisa` tmp |
| `Upload_Langgan.php` | `langgantmp` | `id`, `tanggal`, `kdkg`, `nota`, `kdrkk`, `kdjlr`, `kdplg`, `piut`, `tgnota`, `tgtempo`, `mode` | Hapus baris `langgan` tmp |
| `Upload_Langgan_Bon.php` | `langganbontmp` | `id`, `tanggal`, `nota`, `kdptg`, `acc`, `mode` | Hapus baris `langgan_bon` tmp |
| `Upload_Langgan_Kembali.php` | `langgankembalitmp` | `id`, `tanggal`, `nota`, `kdptg`, `mode` | Hapus baris `langgan_kembali` tmp |
| `Upload_Saur.php` | `saurtmp` | `id`, `tanggal`, `kdkg`, `nota`, `kdjlr`, `kdplg`, `saur`, `tgtempo`, `tgnota`, `piut`, `nobg`, `kdbank`, `jumlah`, `kdptg`, `kdrkk`, `mode` | Hapus baris `saur` tmp |
| `Upload_KasKecil.php` | `kaskeciltmp` | `id`, `tanggal`, `jam`, `kdptg`, `kdkecil`, `kdsub`, `ket`, `jumlah`, `km`, `volume`, `mode` | Hapus baris `kaskecil` tmp |
| `Upload_Master.php` | `mastertmp` | `id`, `kdptg`, `dotprint`, `mac`, `btname`, `mode` | `UPDATE log SET mode='' WHERE mode='tmp'` |

Contoh body `Upload_Penjualan.php`:

```http
POST /v110/Upload_Penjualan.php HTTP/1.1
Content-Type: application/x-www-form-urlencoded

kdptg=DJO-01&jualtmp=%5B%7B%22id%22%3A%221%22%2C%22tanggal%22%3A%222026-11-23%22%2C%22jam%22%3A%2210%3A15%3A00%22%2C%22kdkg%22%3A%22DB%22%2C%22nota%22%3A%22INV001%22%2C%22kdptg%22%3A%22DJO-01%22%2C%22kdjlr%22%3A%22DJO-01%22%2C%22kdplg%22%3A%22P001%22%2C%22kdrkk%22%3A%22DSS234%22%2C%22jumlah%22%3A%2210%22%2C%22total%22%3A%22230000%22%2C%22mode%22%3A%22tmp%22%7D%5D
```

Respons:

```json
{"status": "tersimpan"}
```

## 8. Upload khusus piutang

### 8.1 `POST Upload_BonPiutang.php`

- Pemanggil: tombol upload `BonPiutangActivity` — `BonPiutangActivity.java:413-479`
- Body: `bonpiutang` (JSON array), `kdptg`.
- Field objek: `id`, `tanggal`, `kdptg`, `nota`, `mode`.
- Sukses: `{"status":"tersimpan"}`. Aplikasi mengubah `langgan_bon.mode` dari `tmp` menjadi `up`, lalu menampilkan daftar dan tombol download.
- Pesan terkunci: `"Maaf sudah terkunci"`.

### 8.2 `POST Upload_KembaliPiutang.php`

- Pemanggil: tombol upload `KembaliPiutActivity` — `KembaliPiutActivity.java:336-401`
- Body: `kmpiutang` (JSON array), `kdptg`.
- Field objek: `id`, `tanggal`, `kdptg`, `nota`, `mode`.
- Sukses: `{"status":"tersimpan"}`. Aplikasi mengubah `langgan_kembali.mode` dari `tmp` menjadi `up`.
- Status `"lock"` menampilkan `"Maaf Sudah terkunci"`.

## 9. Upload latar belakang (`MyReceiver`)

- `MyReceiver` terdaftar di manifest dengan action kustom **`MyAction`** (`AndroidManifest.xml:15-19`).
- Broadcast dikirim dari `RegPlgnActivity.onCreate()` — `RegPlgnActivity.java:58` — sehingga receiver berjalan saat layar registrasi outlet dibuka, bukan otomatis setiap perubahan konektivitas.
- `onReceive()` mengecek `ConnectivityManager`; jika ada jaringan, pekerjaan dijalankan di `HandlerThread`.
- Prioritas data yang di-upload hanya **satu** per broadcast:
  1. `plgn` tmp → `Upload_Rec_Plgn.php`
  2. jika tidak ada, `kunjungan` tmp → `Upload_Rec_Kunjungan.php`
  3. jika tidak ada, `stoko` tmp → `Upload_Rec_Stoko.php`
- Metode `Upload_Rec_Penjualan`, `Upload_Rec_Langgan`, dan `Upload_Rec_Saur` beserta helper `DbJualTmp`, `DblangganTmp`, `DbSaurTmp` ada di source, tetapi **tidak dipanggil** dari `onReceive()` pada versi ini (dead code / sisa fitur).
- Semua endpoint `Upload_Rec_*` memakai body `kdptg` + field JSON yang sama dengan endpoint `Upload_*` pasangannya. Sukses = `{"status":"tersimpan"}`; baris tmp kemudian diubah menjadi `mode = ""`.

Contoh pemetaan:

| Endpoint | Field array | Field objek |
|---|---|---|
| `Upload_Rec_Kunjungan.php` | `kunjtmp` | `id`, `tanggal`, `kdptg`, `kdjlr`, `kdplg`, `lat`, `lng`, `akurat`, `jam`, `jamend`, `mode` |
| `Upload_Rec_Stoko.php` | `stokotmp` | `id`, `tanggal`, `kdptg`, `kdjlr`, `kdplg`, `kdrkk`, `jumlah`, `lat`, `lng`, `akurat`, `jam`, `mode`, `alasan` |
| `Upload_Rec_Penjualan.php` | `jualtmp` | sama dengan `Upload_Penjualan.php` |
| `Upload_Rec_Langgan.php` | `langgantmp` | sama dengan `Upload_Langgan.php` |
| `Upload_Rec_Saur.php` | `saurtmp` | sama dengan `Upload_Saur.php` |
| `Upload_Rec_Plgn.php` | `plgntmp` | sama dengan `Upload_Plgn.php` |

## 10. Alur aplikasi yang memakai API

```text
Login
  login.php
    -> simpan master ke SQLite
    -> MainActivity

Persiapan
  save_area.php
    -> update log + hisjual
    -> BonPiutangActivity / MainActivity

Bon
  Download_BonTmp.php  (unduh)
  Upload_BonTmp.php    (unggah bon baru)

Bon Piutang
  Download_BonPiutang.php
  Upload_BonPiutang.php

Kembali Piutang
  Download_KembaliPiutang.php
  Upload_KembaliPiutang.php

Distribusi
  Download_Komitmen.php

Upload / Logout
  Upload_BonTmp.php -> Upload_Plgn.php -> Upload_Kunjungan.php
  -> Upload_Stoko.php -> Upload_Penjualan.php -> Upload_Retur.php
  -> Upload_Sisa.php -> Upload_Langgan.php -> Upload_Langgan_Bon.php
  -> Upload_Langgan_Kembali.php -> Upload_Saur.php
  -> Upload_KasKecil.php -> Upload_Master.php
  logout.php

Registrasi Outlet (RegPlgnActivity)
  broadcast MyAction
    -> MyReceiver
       -> Upload_Rec_Plgn.php | Upload_Rec_Kunjungan.php | Upload_Rec_Stoko.php
```

## 11. Catatan implementasi dan keamanan

1. **Tidak ada autentikasi per-request.** Selain login, tidak ada header token, cookie, atau signature. Otorisasi sepenuhnya bergantung pada parameter `kdptg` yang dapat diganti klien.
2. **Semua endpoint memakai POST form-urlencoded.** Tidak ditemukan pemakaian GET, multipart, atau JSON body mentah.
3. **Payload array dikirim sebagai string JSON** di dalam form field; server harus melakukan `json_decode` pada field tersebut.
4. **Endpoint upload bersifat idempoten secara rancangan** (`mode` tmp/`up`/kosong), tetapi tidak ada mekanisme idempoten eksplisit seperti kunci unik di sisi API.
5. **`save_area.php` mengirim `jalur` kosong** meskipun nilai jalur tersedia di klien. Nilai sebenarnya hanya disimpan lokal. Ini perlu dikonfirmasi ke backend.
6. **`Upload_KembaliPiutang.php` tidak mengirim `acc`/`jamacc`** pada payload (hanya `id`, `tanggal`, `kdptg`, `nota`, `mode`), berbeda dengan tabel lokal `langgan_kembali`.
7. **Beberapa endpoint latar belakang tidak terjangkau** pada versi 11.0 karena `MyReceiver.onReceive()` hanya memanggil tiga dari enam uploader.
8. Base URL ditanam sebagai resource string, bukan konfigurasi runtime; perubahan lingkungan server memerlukan rebuild APK.
9. Tidak ditemukan pemakaian OkHttp, Retrofit, WebSocket, Firebase, atau HTTP client lain di package aplikasi. Seluruh trafik melewati Volley.

## 12. Peta cepat file sumber

| File | Endpoint |
|---|---|
| `LoginActivity.java` | `login.php` |
| `PersiapanActivity.java` | `save_area.php` |
| `DistribusiActivity.java` | `Download_Komitmen.php` |
| `BonActivity.java` | `Download_BonTmp.php`, `Upload_BonTmp.php` |
| `BonPiutangActivity.java` | `Download_BonPiutang.php`, `Upload_BonPiutang.php` |
| `KembaliPiutActivity.java` | `Download_KembaliPiutang.php`, `Upload_KembaliPiutang.php` |
| `UploadActivity.java` | `logout.php` + 13 endpoint `Upload_*` |
| `MyReceiver.java` | 6 endpoint `Upload_Rec_*` |
| `apktool/res/values/strings.xml` | `my_url` (base URL) |
