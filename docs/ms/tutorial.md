# Tutorial — Shopee Historical Enrichment v2.0

Panduan penggunaan **Shopee Historical Enrichment v2.0** untuk menjalankan historical enrichment terhadap data pesanan daripada akaun Shopee sendiri.

> ⚠️ **Penting:** Projek ini ialah projek pihak ketiga dan tidak berafiliasi, disokong atau diluluskan oleh Shopee.

---

## 1. Sebelum Bermula

Pastikan anda:

- menggunakan akaun Shopee sendiri;
- menggunakan browser desktop moden;
- telah login ke Shopee secara normal;
- boleh membuka halaman sejarah pesanan;
- memahami bahawa data yang diproses mungkin mengandungi maklumat peribadi.

### Jangan kongsi

Jangan kongsi:

- password;
- cookies;
- session tokens;
- access tokens;
- maklumat pembayaran;
- alamat penghantaran;
- nombor telefon;
- tracking number;
- maklumat peribadi lain.

**Utility ini tidak memerlukan anda menyalin atau menerbitkan credential/session information.**

---

## 2. Dapatkan Source Code

Source code utama v2.0 berada di:

```text
src/
└── shopee_historical_enrichment_v2.js
```

Repository:

https://github.com/jayfreddy1994/shopee-historical-enrichment

Buka fail:

```text
src/shopee_historical_enrichment_v2.js
```

Kemudian gunakan kandungan source tersebut untuk menjalankan utility pada akaun anda sendiri.

---

## 3. Buka Shopee Order History

1. Buka laman Shopee menggunakan browser desktop.
2. Login menggunakan akaun sendiri.
3. Pergi ke bahagian **My Purchases / All Purchases**.
4. Pastikan sejarah pesanan anda boleh dilihat.

Utility ini menggunakan data order-history yang tersedia melalui browser untuk mengumpulkan order ID sebelum proses enrichment dilakukan.

### Nota

Paparan UI Shopee boleh berubah mengikut masa, versi laman dan akaun.

Oleh itu, nama menu atau susunan halaman mungkin tidak sama untuk semua pengguna.

---

## 4. Buka Developer Tools

Dalam browser desktop:

- buka **Developer Tools**;
- pilih tab **Console**.

Contoh shortcut yang biasa digunakan:

```text
Windows:
Ctrl + Shift + J
```

atau:

```text
F12
```

Kemudian pilih:

```text
Console
```

> ⚠️ Jangan masukkan atau kongsi password, cookie, session token atau access token ke dalam Console.

---

## 5. Jalankan v2.0

Gunakan source code:

```text
shopee_historical_enrichment_v2.js
```

Jalankan utility ketika anda berada dalam sesi browser Shopee anda sendiri.

Utility akan menjalankan workflow:

```text
Order History
      ↓
Collect Order IDs
      ↓
Order Detail
      ↓
Processing Information
      ↓
TRUE Order Creation Timestamp
      ↓
Historical Dataset
```

Utility menggunakan browser session sedia ada untuk membaca data yang tersedia kepada pengguna yang telah login.

Ia tidak direka untuk mendapatkan credential pengguna.

---

## 6. Proses Order ID Collection

Langkah pertama ialah mengumpulkan order ID daripada order-history list.

Secara konseptual:

```text
Order History List
        ↓
Pagination
        ↓
Order IDs
```

v2.0 kemudian memproses order ID yang telah dikumpulkan.

---

## 7. Proses Order Detail

Setiap order ID diproses secara berasingan untuk mendapatkan maklumat detail.

Workflow:

```text
Order ID
   ↓
Individual Order Detail
   ↓
Processing Information
```

Bahagian ini penting kerana tarikh yang diperlukan untuk historical enrichment tidak semestinya bergantung hanya kepada tarikh yang kelihatan pada order-history list.

---

## 8. TRUE Order Creation Timestamp

v2.0 membaca maklumat processing information yang tersedia pada order detail.

Antara field yang digunakan ialah:

```text
create_time
shipping_confirm_time
pay_time
delivery_time
complete_time
```

Utility turut mengenal pasti label seperti:

```text
label_odp_order_time
label_odp_payment_time
label_odp_ship_time
label_odp_completed_time
```

Fokus utama historical enrichment ialah:

```text
create_time
```

Ia digunakan sebagai **TRUE Order Creation Timestamp** bagi dataset projek ini.

---

## 9. Menunggu Proses Scan

Semasa utility berjalan, jangan tutup tab atau refresh halaman Shopee.

Jumlah masa bergantung kepada:

- jumlah order;
- response time Shopee;
- keadaan network;
- browser;
- perubahan pada endpoint consumer web.

v2.0 menggunakan delay antara request untuk mengelakkan proses dilakukan secara terlalu agresif.

---

## 10. Semak Statistik

Selepas proses selesai, semak statistik yang dipaparkan oleh utility.

Contoh hasil daripada test dataset projek:

```text
Order IDs found:             433
Details scanned successfully: 433
Detail failures:               0
True order dates found:       433
```

Keputusan sebenar pada akaun anda mungkin berbeza.

---

## 11. Historical Range

Dalam test dataset projek ini, hasil enrichment menunjukkan:

```text
Oldest order:
23 March 2019

Newest order:
7 October 2026
```

Ini menunjukkan bahawa order-history list yang diperoleh daripada browser boleh digunakan sebagai asas untuk enrichment melalui order detail.

> ⚠️ Ini ialah hasil eksperimen pada test dataset projek. Ia bukan jaminan bahawa setiap akaun Shopee akan mempunyai sejarah sehingga 2019 atau jumlah order yang sama.

---

## 12. Export Dataset

Selepas proses selesai, v2.0 menghasilkan dataset dalam dua format utama:

```text
JSON
CSV
```

Contoh:

```text
shopee_historical_2019_2026_v2.json
shopee_historical_2019_2026_v2.csv
```

### JSON

Sesuai untuk:

- data processing;
- programming;
- analisis struktur;
- penggunaan dengan tools lain.

### CSV

Sesuai untuk:

- Excel;
- Google Sheets;
- spreadsheet analysis;
- filtering;
- sorting;
- calculations.

---

## 13. Jangan Upload Dataset Peribadi ke GitHub

Dataset hasil daripada akaun sendiri boleh mengandungi maklumat sensitif atau peribadi.

**Jangan commit fail seperti:**

```text
shopee_historical_2019_2026_v2.json
shopee_historical_2019_2026_v2.csv
```

ke repository public jika ia mengandungi data sebenar akaun anda.

Repository sepatutnya mengandungi:

```text
Source Code
Documentation
Examples
Redacted Screenshots
```

bukan:

```text
Personal Order History
Personal Address
Phone Number
Tracking Information
Payment Information
```

---

## 14. Jika Ingin Berkongsi Screenshot

Sebelum screenshot dimasukkan ke GitHub atau GitHub Pages, redact maklumat seperti:

```text
Nama
Telefon
Alamat
Email
Tracking Number
Order ID
Payment Information
```

Gunakan contoh:

```text
████████████
REDACTED
```

atau blur/crop maklumat tersebut.

---

## 15. Jika Ingin Membina Dataset Demonstrasi

Untuk dokumentasi awam, gunakan dataset yang telah disamarkan.

Contoh:

```text
Order ID:
REDACTED

Shop:
Example Shop

Order Date:
23/03/2019

Payment:
REDACTED

Tracking:
REDACTED
```

Tujuannya adalah untuk menunjukkan struktur data tanpa mendedahkan data sebenar pengguna.

---

## 16. Memahami Hasil Enrichment

Historical enrichment tidak semestinya bermaksud utility berjaya mendapatkan **semua** sejarah pembelian yang pernah wujud.

Terdapat beberapa kemungkinan:

```text
Order History List
        ↓
Orders available to browser
        ↓
Order Detail
        ↓
Historical enrichment
```

Jika sesuatu order tidak wujud dalam source list yang tersedia kepada utility, utility tidak boleh membuat kesimpulan bahawa order tersebut wujud.

Oleh itu:

> **Historical enrichment ≠ guaranteed complete historical archive**

---

## 17. TRUE Historical Completeness

Eksperimen v2.0 membuktikan bahawa order detail boleh memberikan tarikh penciptaan order yang lebih lama daripada tarikh yang kelihatan pada list timestamp tertentu.

Namun begitu, terdapat satu persoalan yang berbeza:

> Adakah terdapat order yang lebih lama tetapi langsung tidak termasuk dalam 433-order list?

Ini memerlukan eksperimen tambahan.

Oleh itu projek membezakan antara:

### Historical Enrichment

```text
Order yang berjaya dikumpulkan
        +
Detail information
        ↓
Historical dates
```

dan:

### TRUE Historical Completeness

```text
Semua order yang pernah wujud
        ↓
Dibandingkan dengan
        ↓
Order yang berjaya dikumpulkan
```

v2.0 memberi asas kepada historical enrichment, tetapi **tidak mendakwa telah membuktikan absolute historical completeness**.

---

## 18. Jika Proses Gagal

Jika utility gagal, jangan cuba mendapatkan atau berkongsi:

- cookies;
- session tokens;
- authentication headers;
- password;
- access tokens.

Sebaliknya, periksa:

1. Adakah anda masih login?
2. Adakah halaman Shopee masih boleh dibuka?
3. Adakah browser mempunyai network connection?
4. Adakah Shopee baru sahaja mengubah struktur consumer web?
5. Adakah terdapat error pada Console?
6. Adakah order list masih boleh dimuatkan secara normal?

Untuk diagnosis lanjut:

→ [Troubleshooting](troubleshooting.md)

---

## 19. Perubahan Pada Shopee

Shopee boleh mengubah:

- endpoint;
- parameter;
- response structure;
- pagination;
- field names;
- UI;
- authentication behaviour;
- availability of historical records.

Jika berlaku perubahan, v2.0 mungkin:

```text
Tidak berjalan
```

atau:

```text
Menghasilkan dataset yang tidak lengkap
```

atau:

```text
Menghasilkan response structure yang berbeza
```

Ini bukan semestinya masalah pada browser atau komputer pengguna.

---

## 20. Prinsip Keselamatan

Gunakan utility ini hanya untuk:

```text
Akaun sendiri
      ↓
Data sendiri
      ↓
Research / Analysis sendiri
```

Jangan gunakan untuk:

```text
Akaun orang lain
      ↓
Data orang lain
      ↓
Credential extraction
      ↓
Authentication bypass
```

---

## 21. Ringkasan Quick Start

```text
1. Login ke Shopee
        ↓
2. Buka My Purchases / All Purchases
        ↓
3. Buka Developer Tools
        ↓
4. Pergi ke Console
        ↓
5. Jalankan shopee_historical_enrichment_v2.js
        ↓
6. Tunggu proses selesai
        ↓
7. Semak statistik
        ↓
8. Semak JSON / CSV
        ↓
9. Simpan dataset secara private
        ↓
10. Redact sebelum berkongsi screenshot
```

---

## Next

Untuk memahami bagaimana eksperimen ini dibangunkan:

- [Methodology](methodology.md)

Jika menghadapi masalah:

- [Troubleshooting](troubleshooting.md)

Untuk gambaran umum projek:

- [Getting Started](getting-started.md)

Untuk syarat dan batas penggunaan:

- [DISCLAIMER.md](../../DISCLAIMER.md)
