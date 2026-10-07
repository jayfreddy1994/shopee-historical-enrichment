# Getting Started — Shopee Historical Enrichment

**Shopee Historical Enrichment v2.0**

A read-only browser-based research utility for inspecting and enriching a user's own Shopee order-history data.

> ⚠️ **Penting:** Projek ini ialah projek pihak ketiga dan tidak berafiliasi, disokong atau diluluskan oleh Shopee.

---

## 1. Tentang Projek

Shopee Historical Enrichment ialah utility berasaskan browser yang direka untuk tujuan:

- penyelidikan teknikal;
- pembelajaran;
- analisis data sejarah;
- pemeriksaan data pesanan milik pengguna sendiri.

Workflow utama:

```text
Shopee Order History
        ↓
Order ID Collection
        ↓
Individual Order Detail
        ↓
Processing Information
        ↓
TRUE Order Creation Timestamp
        ↓
Historical Enriched Dataset
        ↓
JSON + CSV
```

Utility ini tidak bertujuan untuk mengubah, menghantar atau memanipulasi pesanan pengguna.

---

## 2. Siapa Yang Patut Menggunakan Projek Ini?

Projek ini sesuai untuk pengguna yang ingin:

- mengkaji sejarah pembelian Shopee sendiri;
- mendapatkan tarikh pesanan yang lebih lengkap;
- membina dataset sejarah pembelian;
- membuat analisis CSV/JSON;
- menjalankan eksperimen data menggunakan JavaScript;
- memahami bagaimana data pesanan consumer web diproses oleh browser.

Projek ini **bukan** direka untuk:

- mendapatkan data pengguna lain;
- mengakses akaun orang lain;
- memintas authentication;
- mendapatkan password, cookie atau session token;
- mengubah pesanan;
- melakukan transaksi secara automatik;
- mengganggu sistem Shopee.

---

## 3. Keperluan

Anda memerlukan:

- akaun Shopee sendiri;
- browser desktop moden;
- akses kepada halaman Shopee Order History;
- JavaScript enabled;
- ruang untuk menyimpan fail JSON dan CSV yang dihasilkan.

Browser seperti Chrome, Edge atau browser Chromium moden biasanya sesuai untuk workflow ini.

---

## 4. Sebelum Bermula

Pastikan anda menggunakan **akaun Shopee milik sendiri**.

Jangan berkongsi atau menerbitkan:

- password;
- cookies;
- session tokens;
- access tokens;
- maklumat kad pembayaran;
- nama penuh;
- nombor telefon;
- alamat penghantaran;
- tracking number;
- maklumat peribadi lain.

Dataset yang dihasilkan oleh utility ini boleh mengandungi maklumat peribadi bergantung kepada data yang tersedia pada akaun pengguna.

**Jangan upload dataset peribadi anda ke GitHub.**

---

## 5. Versi Projek

| Versi | Fungsi |
|---|---|
| v1.2.2 | Baseline extractor + CSV calculator |
| v2.0 | Historical enrichment menggunakan order detail |

Versi `v1.2.2` digunakan sebagai baseline untuk eksperimen terdahulu.

Versi `v2.0` menambah proses enrichment berdasarkan maklumat detail setiap order.

---

## 6. Cara Mendapatkan Source Code

Source code utama v2.0 tersedia dalam repository:

https://github.com/jayfreddy1994/shopee-historical-enrichment

Fail utama v2.0:

```text
src/
└── shopee_historical_enrichment_v2.js
```

---

## 7. Gambaran Keseluruhan Workflow

Secara ringkas, proses v2.0 adalah:

### Step 1 — Akses Order History

Pengguna membuka sejarah pesanan Shopee menggunakan akaun sendiri.

### Step 2 — Collect Order IDs

Utility mengumpulkan order ID yang tersedia melalui consumer web order-history endpoint yang digunakan oleh browser.

### Step 3 — Request Order Detail

Setiap order ID diproses untuk mendapatkan maklumat detail pesanan.

### Step 4 — Extract Processing Information

Utility membaca maklumat seperti:

- order creation time;
- payment time;
- shipping time;
- completed time.

### Step 5 — Historical Enrichment

Tarikh order sebenar digunakan untuk memperkayakan dataset sejarah.

### Step 6 — Export

Data boleh dihasilkan dalam format:

```text
JSON
CSV
```

---

## 8. Hasil Eksperimen

Dalam test dataset projek ini:

```text
Order IDs collected:        433
Successful detail scans:    433
Failed detail requests:       0
TRUE order dates found:     433
```

Order paling lama yang berjaya dikenal pasti dalam dataset ujian ialah:

```text
23 March 2019
```

Order paling baru dalam dataset ujian ialah:

```text
7 October 2026
```

> ⚠️ Nilai di atas ialah keputusan **test dataset projek ini**, bukan jaminan bahawa semua akaun Shopee akan mempunyai jumlah atau julat sejarah yang sama.

---

## 9. Privasi Data

Utility ini direka untuk digunakan terhadap data akaun pengguna sendiri.

Namun begitu, pengguna bertanggungjawab terhadap data yang mereka eksport dan simpan.

Jika anda ingin berkongsi screenshot atau dataset untuk tujuan research:

### Redact terlebih dahulu

Contohnya:

```text
Nama              → REDACTED
Telefon           → REDACTED
Alamat            → REDACTED
Tracking Number   → REDACTED
Email             → REDACTED
Order ID          → REDACTED jika tidak diperlukan
```

Untuk screenshot GitHub atau tutorial awam, gunakan data yang telah disamarkan.

---

## 10. Had Projek

Shopee boleh mengubah:

- struktur halaman;
- endpoint;
- response format;
- parameter;
- pagination;
- field names;
- authentication behaviour;
- availability of historical data.

Oleh itu, utility ini mungkin berhenti berfungsi atau menghasilkan keputusan berbeza selepas perubahan pada platform.

Projek ini tidak menjamin akses kepada keseluruhan sejarah akaun.

---

## 11. Status Projek

**Shopee Historical Enrichment v2.0**

Status:

```text
Research / Experimental
```

Projek ini masih boleh berubah berdasarkan hasil eksperimen dan perubahan pada Shopee consumer web.

---

## Next

Untuk panduan penggunaan penuh, lihat:

- [Tutorial](tutorial.md)
- [Methodology](methodology.md)
- [Troubleshooting](troubleshooting.md)

Untuk disclaimer projek:

- [DISCLAIMER.md](../../DISCLAIMER.md)
