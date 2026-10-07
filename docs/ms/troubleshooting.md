# Troubleshooting — Shopee Historical Enrichment v2.0

Panduan ini membantu mengenal pasti masalah biasa ketika menjalankan Shopee Historical Enrichment v2.0.

> ⚠️ **Penting:** Jangan kongsi password, cookies, session tokens, access tokens atau maklumat peribadi untuk tujuan troubleshooting.

---

# 1. Utility Tidak Berjalan

Jika utility tidak menghasilkan output yang dijangka, periksa dahulu:

1. Anda masih login ke Shopee.
2. Halaman Shopee boleh dibuka secara normal.
3. Browser mempunyai sambungan internet.
4. Developer Tools dibuka pada tab **Console**.
5. Source code yang digunakan ialah versi yang betul.
6. Tiada extension browser yang mengganggu page execution.

Jika terdapat error, simpan mesej error yang tidak mengandungi maklumat peribadi.

---

# 2. Console Menunjukkan Error

Error dalam Console boleh berlaku atas beberapa sebab.

Contohnya:

```text
JavaScript error
Network error
Unexpected response
Request failed
Parsing error
```

Jangan cuba menyelesaikan masalah dengan menyalin:

```text
Cookies
Session tokens
Authentication headers
Access tokens
Passwords
```

Sebaliknya, dokumentasikan:

```text
Browser
Operating system
Tarikh ujian
Langkah yang sedang dilakukan
Mesej error yang telah disamarkan
```

---

# 3. Order ID Tidak Ditemui

Jika utility tidak menemukan order ID, periksa:

- halaman order history boleh dimuatkan;
- anda menggunakan akaun sendiri;
- order history masih mempunyai data;
- Shopee tidak mengubah struktur response;
- network connection stabil.

Jika order history pada UI masih berfungsi tetapi utility tidak menemukan data, ada kemungkinan struktur consumer web telah berubah.

---

# 4. Jumlah Order Berbeza Daripada 433

**433 bukan nilai tetap.**

Ia ialah jumlah yang diperoleh daripada test dataset projek.

Akaun lain mungkin mempunyai:

```text
100 orders
500 orders
1,000+ orders
```

atau jumlah yang berbeza.

Oleh itu jangan anggap:

```text
433 = semua akaun Shopee
```

Sebaliknya:

```text
433 = observed test dataset
```

---

# 5. Detail Request Gagal

Jika sebahagian order detail gagal:

```text
Order IDs:        433
Successful:       420
Failed:            13
```

jangan terus anggap 13 order tersebut tidak wujud.

Possible causes termasuk:

- temporary network failure;
- response timeout;
- platform-side change;
- endpoint behaviour change;
- rate limiting;
- order detail tidak lagi tersedia;
- browser/session state berubah.

Catat jumlah:

```text
Total IDs
Successful details
Failed details
Missing create_time
```

Ini membantu menentukan sama ada masalah berlaku pada list stage atau detail stage.

---

# 6. `create_time` Tidak Ditemui

Jika order detail berjaya diperoleh tetapi `create_time` tidak ditemui, periksa sama ada response structure telah berubah.

Versi lama mungkin menggunakan:

```text
data.pc_processing_info.create_time
```

atau field/struktur berkaitan.

Jika Shopee mengubah nama field atau struktur JSON, parser v2.0 mungkin tidak lagi dapat mengenal pasti timestamp.

Dalam keadaan ini, jangan membuat kesimpulan bahawa order tersebut tiada tarikh.

Mungkin:

```text
Response changed
```

bukannya:

```text
Order has no creation time
```

---

# 7. Label Order Time Berubah

v2.0 menggunakan label seperti:

```text
label_odp_order_time
label_odp_payment_time
label_odp_ship_time
label_odp_completed_time
```

Jika label tersebut berubah atau tidak lagi wujud, extraction logic mungkin memerlukan kemas kini.

Bandingkan:

```text
Expected structure
        ↓
Current response
        ↓
Changed field / label
```

Jangan berkongsi response yang mengandungi maklumat peribadi.

---

# 8. Proses Terhenti Di Tengah Jalan

Jika proses berhenti sebelum semua order selesai, kemungkinan termasuk:

- network interruption;
- browser tab ditutup;
- page refresh;
- temporary server error;
- response timeout;
- platform-side change.

Langkah asas:

1. Pastikan browser masih connected.
2. Pastikan tab Shopee tidak ditutup.
3. Jangan refresh ketika proses sedang berjalan.
4. Jalankan semula selepas keadaan stabil.
5. Bandingkan statistik run baru dengan run sebelumnya.

---

# 9. Browser Terlalu Lambat

Jumlah request meningkat mengikut jumlah order.

Contohnya:

```text
100 orders
    ↓
100 detail requests

433 orders
    ↓
433 detail requests
```

Oleh itu proses boleh mengambil masa lebih lama apabila dataset lebih besar.

Jangan mengurangkan delay secara agresif semata-mata untuk mempercepatkan proses.

---

# 10. Hasil Tidak Lengkap

Jika dataset nampak tidak lengkap, bezakan dahulu antara:

### Extraction failure

```text
Order ID tidak dikumpulkan
```

### Detail failure

```text
Order ID ada
tetapi detail gagal
```

### Parsing failure

```text
Detail berjaya
tetapi field tidak dikenali
```

### Historical coverage limitation

```text
Order memang tidak terdapat dalam source list
```

Empat keadaan ini tidak sama.

---

# 11. Oldest Order Bukan 23 March 2019

Itu normal.

`23 March 2019` ialah:

> **oldest observed order dalam test dataset projek**

Ia bukan minimum yang dijamin oleh Shopee.

Jika akaun anda menghasilkan:

```text
Oldest order:
2021
```

itu tidak semestinya bermaksud utility gagal.

Sebaliknya, mungkin order yang lebih lama tidak termasuk dalam source list yang tersedia.

---

# 12. Adakah Ini Bermaksud Sejarah Sebelum 2019 Tidak Wujud?

Tidak.

Jika oldest observed order ialah:

```text
23 March 2019
```

kita hanya boleh mengatakan:

> Itulah order paling lama yang diperhatikan dalam dataset yang berjaya dikumpulkan.

Ia **tidak membuktikan** bahawa tiada order sebelum tarikh tersebut.

Ini merupakan perbezaan antara:

```text
Oldest observed
```

dan:

```text
Absolute oldest ever
```

---

# 13. `433/433` Tetapi Masih Tidak Lengkap?

Ya, secara teori boleh.

Contohnya:

```text
Shopee source list
        ↓
433 orders
        ↓
433/433 detail success
```

Ini bermaksud semua **433 order yang berjaya dikumpulkan** mempunyai detail yang berjaya diproses.

Ia tidak membuktikan bahawa:

```text
433 = every order ever created
```

Sebab itu projek menggunakan istilah:

> **Historical Enrichment**

dan bukan:

> **Complete Historical Archive**

---

# 14. JSON Berjaya Tetapi CSV Gagal

Jika JSON berjaya tetapi CSV tidak, periksa:

- browser download permission;
- file system permission;
- popup/download blocking;
- nama fail;
- browser extension.

Pastikan juga ruang storage mencukupi.

---

# 15. Dataset Mengandungi Maklumat Peribadi

Ini boleh berlaku kerana data berasal daripada akaun pengguna sendiri.

Jangan publish dataset mentah.

Sebelum berkongsi:

```text
Nama           → REDACT
Telefon        → REDACT
Alamat         → REDACT
Tracking       → REDACT
Email          → REDACT
Payment data   → REDACT
```

Untuk GitHub Issues atau screenshots awam, gunakan data yang telah disamarkan.

---

# 16. Jangan Gunakan Credential Untuk Troubleshooting

Projek ini tidak memerlukan anda memberikan:

```text
Password
Cookies
Session tokens
Access tokens
Authentication headers
```

Jika seseorang meminta maklumat tersebut untuk "debug", **jangan berikan**.

Gunakan maklumat non-sensitive seperti:

```text
Browser version
OS
Console error
Approximate order count
Success/failure count
```

---

# 17. Shopee Baru Mengubah Endpoint

Jika utility yang sebelum ini berfungsi tiba-tiba gagal, salah satu kemungkinan ialah perubahan pada consumer web.

Tanda-tanda termasuk:

```text
Previously:
433/433 success

Now:
0/433
```

atau:

```text
Expected field:
create_time

Current response:
field unavailable / structure changed
```

Dalam situasi ini, projek memerlukan research dan code update.

Jangan anggap perubahan tersebut sebagai masalah pada komputer anda tanpa pemeriksaan lanjut.

---

# 18. Bila Perlu Buka Issue?

GitHub Issue sesuai jika masalah boleh diterangkan tanpa mendedahkan data peribadi.

Sertakan:

```text
Browser:
Operating System:
Project Version:
Approximate Order Count:
Successful Detail Count:
Failed Detail Count:
Error Message:
```

Jangan sertakan:

```text
Password
Cookies
Session Tokens
Access Tokens
Phone
Address
Payment Details
Private Order Dataset
```

---

# 19. Template Issue

Anda boleh gunakan template berikut:

```text
## Environment

Browser:
OS:
Project Version:

## Result

Order IDs found:
Details successful:
Details failed:
create_time found:

## Problem

Describe what happened:

## Console Error

Paste only the non-sensitive error message here:

## Expected Behaviour

What did you expect?

## Actual Behaviour

What happened instead?
```

---

# 20. Quick Diagnostic Flow

```text
Utility gagal
      ↓
Adakah Shopee boleh dibuka?
      │
      ├── Tidak
      │     ↓
      │   Periksa network / Shopee availability
      │
      └── Ya
            ↓
      Order IDs ditemui?
            │
            ├── Tidak
            │     ↓
            │   Periksa order-list response / platform changes
            │
            └── Ya
                  ↓
            Detail berjaya?
                  │
                  ├── Tidak
                  │     ↓
                  │   Periksa network / response / platform changes
                  │
                  └── Ya
                        ↓
                  create_time ditemui?
                        │
                        ├── Tidak
                        │     ↓
                        │   Periksa response structure / parser
                        │
                        └── Ya
                              ↓
                         Export dataset
```

---

# 21. Kesimpulan Troubleshooting

Apabila berlaku masalah, cuba kenal pasti **stage** yang gagal:

```text
Stage 1
Order ID Collection
        ↓
Stage 2
Order Detail Retrieval
        ↓
Stage 3
Processing Information Parsing
        ↓
Stage 4
Historical Enrichment
        ↓
Stage 5
JSON / CSV Export
```

Dengan membezakan setiap stage, masalah boleh dikaji tanpa memerlukan credential atau data peribadi pengguna.

---

## Related Documentation

- [Getting Started](getting-started.md)
- [Tutorial](tutorial.md)
- [Methodology](methodology.md)
- [DISCLAIMER.md](../../DISCLAIMER.md)
