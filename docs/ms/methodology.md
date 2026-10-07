# Methodology — Shopee Historical Enrichment v2.0

Dokumen ini menerangkan perjalanan eksperimen yang membawa kepada **Shopee Historical Enrichment v2.0**, daripada pemerhatian awal terhadap order-history list sehingga pengesahan bahawa order detail mengandungi maklumat tarikh pesanan yang lebih bersejarah.

> ⚠️ **Penting:** Semua keputusan angka dalam dokumen ini merujuk kepada **test dataset projek ini**. Ia bukan jaminan bahawa semua akaun Shopee akan menghasilkan jumlah atau julat sejarah yang sama.

---

## 1. Objektif

Objektif utama projek ialah mengkaji sama ada data order-history yang tersedia melalui browser boleh diperkayakan menggunakan maklumat daripada individual order detail.

Soalan utama eksperimen:

> Bolehkah order-history yang tersedia kepada browser digunakan sebagai asas untuk membina dataset sejarah pesanan yang mempunyai tarikh order sebenar yang lebih lengkap?

Daripada sini, eksperimen berkembang secara berperingkat:

```text
E1-A
  ↓
E1-B
  ↓
E1-C
  ↓
v2.0
```

---

# 2. E1-A — Order History List

Eksperimen pertama memberi fokus kepada endpoint order-history list yang digunakan oleh consumer web.

Hasil utama:

```text
Order records returned: 433
```

Pagination diuji menggunakan offset.

Secara keseluruhan, offset daripada `0` sehingga sekitar `420` menghasilkan rekod, manakala offset seterusnya tidak lagi menghasilkan batch tambahan.

Hasil ini memberikan asas awal:

```text
Shopee Order History
        ↓
Order ID Collection
        ↓
433 order records
```

---

# 3. E1-B — Fallback Comparison

Eksperimen seterusnya membandingkan hasil daripada fallback order-list endpoint.

Endpoint alternatif memberikan:

```text
433 unique orders
```

Tiada order ID tambahan yang unik ditemui berbanding primary list.

Ini penting kerana ia menunjukkan bahawa fallback tersebut, dalam test dataset ini, tidak memperluaskan jumlah order yang berjaya dikumpulkan.

Ringkasan:

| Eksperimen | Hasil |
|---|---:|
| Primary order list | 433 |
| Fallback order list | 433 |
| Order IDs tambahan | 0 |

Oleh itu, eksperimen diteruskan ke individual order detail.

---

# 4. E1-C — Individual Order Detail

E1-C merupakan bahagian paling penting dalam historical enrichment.

Daripada individual order detail, response mengandungi:

```text
data.pc_processing_info
```

Antara maklumat yang tersedia termasuk:

```text
create_time
shipping_confirm_time
pay_time
delivery_time
complete_time
```

Response juga mengandungi label seperti:

```text
label_odp_order_time
label_odp_payment_time
label_odp_ship_time
label_odp_completed_time
```

Ini menunjukkan bahawa order detail mengandungi maklumat temporal yang lebih terperinci berbanding sekadar timestamp yang digunakan untuk listing.

---

# 5. Full Detail Scan

Semua order ID daripada dataset diuji menggunakan individual order detail.

Keputusan:

```text
Order IDs found:              433
Details successfully scanned: 433
Detail request failures:        0
create_time found:             433
Missing create_time:             0
```

Ringkasnya:

> **433 daripada 433 order berjaya diperkayakan dengan `create_time` dalam test dataset.**

Ini menjadi asas kepada v2.0.

---

# 6. Oldest Observed Order

Hasil paling penting daripada E1-C ialah penemuan order lama yang tidak jelas daripada pemerhatian timestamp list sahaja.

Oldest observed order dalam test dataset:

```text
23 March 2019
```

Timestamp:

```text
23/03/2019 15:39:25 MYT
```

Ini memberikan bukti eksperimen bahawa individual order detail boleh mendedahkan **order creation timestamp yang jauh lebih lama** daripada julat yang pada awalnya kelihatan daripada order-history listing.

---

# 7. TRUE Order Creation Timestamp

Daripada hasil E1-C, v2.0 memberi fokus kepada:

```text
create_time
```

Field ini digunakan sebagai asas kepada konsep:

> **TRUE Order Creation Timestamp**

Dalam konteks projek ini, istilah tersebut merujuk kepada timestamp penciptaan order yang diperoleh daripada order detail processing information.

Ia bukan bermaksud projek telah membuktikan bahawa timestamp tersebut ialah rekod arkib mutlak untuk semua kemungkinan sejarah Shopee.

---

# 8. v2.0 — Historical Enrichment

Selepas E1-A hingga E1-C, workflow v2.0 dibentuk:

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

Berbanding extractor baseline, v2.0 tidak berhenti pada data order-history list.

Ia melakukan enrichment menggunakan detail setiap order.

---

# 9. v2.0 Full Test Result

Full test dataset menghasilkan:

| Metric | Result |
|---|---:|
| Order IDs | 433 |
| Detail scans successful | 433 |
| Detail failures | 0 |
| `create_time` found | 433 |
| Missing `create_time` | 0 |

Historical range yang diperhatikan:

```text
Oldest observed:
23 March 2019

Newest observed:
7 October 2026
```

Sekali lagi, ini ialah **hasil test dataset projek**.

---

# 10. Apa Yang Eksperimen Ini Buktikan

Eksperimen ini menyokong beberapa kesimpulan:

### 10.1 Order list boleh menjadi asas kepada enrichment

Order-history list berjaya memberikan order ID yang kemudiannya boleh diproses satu per satu.

### 10.2 Individual order detail mengandungi maklumat masa tambahan

Order detail menyediakan `pc_processing_info` dan beberapa timestamp berkaitan.

### 10.3 `create_time` boleh digunakan untuk historical enrichment

Dalam test dataset, semua 433 order berjaya memberikan `create_time`.

### 10.4 Order lama boleh ditemui melalui detail

Oldest observed order dalam test dataset ialah:

```text
23 March 2019
```

---

# 11. Apa Yang Eksperimen Ini Belum Buktikan

Ini bahagian yang sangat penting.

Eksperimen **belum membuktikan** bahawa:

- 433 ialah jumlah semua order yang pernah wujud;
- tiada order sebelum 23 March 2019;
- semua order lama sentiasa tersedia melalui order-history list;
- semua akaun Shopee akan memberikan keputusan yang sama;
- endpoint dan response structure akan kekal sama;
- dataset yang dihasilkan merupakan arkib sejarah mutlak.

Persoalan utama yang masih terbuka ialah:

> **Adakah terdapat order yang lebih lama tetapi tidak pernah masuk ke dalam 433-order list?**

Soalan ini memerlukan eksperimen berasingan untuk membuktikan **TRUE Historical Completeness**.

---

# 12. Historical Enrichment vs Historical Completeness

Dua konsep ini perlu dibezakan.

## Historical Enrichment

```text
Orders available to browser
        ↓
Individual order detail
        ↓
Historical timestamps
```

Tujuannya ialah memperkayakan data order yang telah berjaya dikumpulkan.

## TRUE Historical Completeness

```text
Semua order yang pernah wujud
        ↓
Dibandingkan dengan
        ↓
Semua order yang berjaya dikumpulkan
```

Yang kedua jauh lebih sukar untuk dibuktikan.

Oleh itu nama projek:

> **Shopee Historical Enrichment**

adalah lebih tepat daripada mendakwa ia sebagai complete historical archive.

---

# 13. Kenapa v2.0 Tidak Dipanggil "Official API"

Endpoint yang diperhatikan melalui browser tidak sepatutnya digambarkan sebagai:

```text
Official Shopee API
Shopee Public API
Shopee-approved API
```

Projek menggunakan istilah:

> **Shopee consumer web endpoints observed by the browser**

Ini lebih tepat untuk konteks research dan mengelakkan dakwaan bahawa projek ini ialah API rasmi Shopee.

---

# 14. Reproducibility

Eksperimen v2.0 boleh diterangkan semula menggunakan pipeline yang sama:

```text
1. Collect order IDs
2. Retrieve individual order details
3. Read processing information
4. Extract order creation timestamp
5. Build enriched dataset
6. Export JSON / CSV
```

Walau bagaimanapun, keputusan masa depan mungkin berubah jika Shopee mengubah consumer web mereka.

---

# 15. Limitations

Eksperimen bergantung kepada keadaan platform semasa.

Antara perkara yang boleh berubah:

- endpoint;
- parameter;
- pagination;
- response structure;
- field names;
- UI;
- authentication behaviour;
- historical data availability.

Oleh itu hasil eksperimen perlu dianggap sebagai:

```text
Observed result
```

dan bukan:

```text
Permanent platform guarantee
```

---

# 16. Kesimpulan

E1-A hingga E1-C membawa kepada satu penemuan utama:

> **Order-history list boleh digunakan sebagai titik permulaan, manakala individual order detail boleh memberikan maklumat tarikh penciptaan order yang lebih bersejarah untuk proses enrichment.**

Dalam test dataset projek:

```text
433 / 433
```

order berjaya diproses dan mempunyai `create_time`.

Oldest observed order:

```text
23 March 2019
```

Penemuan ini membentuk asas kepada:

> **Shopee Historical Enrichment v2.0**

Namun projek masih membezakan dengan jelas antara **historical enrichment** dan **TRUE historical completeness**.

---

## Next

Untuk panduan penggunaan:

- [Getting Started](getting-started.md)
- [Tutorial](tutorial.md)

Jika proses tidak berjalan seperti yang dijangka:

- [Troubleshooting](troubleshooting.md)

Untuk disclaimer:

- [DISCLAIMER.md](../../DISCLAIMER.md)
