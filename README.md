# Shopee Historical Enrichment

**Independent read-only research project for Shopee order-history extraction, historical enrichment, and personal data analysis.**

> ⚠️ **Important:** This is an independent third-party project. It is not affiliated with, endorsed by, sponsored by, or officially supported by Shopee.

---

## 🌏 Language

- 🇲🇾 Bahasa Malaysia
- 🇬🇧 English

---

# 🇲🇾 Bahasa Malaysia

## Pengenalan

**Shopee Historical Enrichment** ialah projek pihak ketiga untuk penyelidikan, pembelajaran teknikal dan analisis data order Shopee milik pengguna sendiri.

Projek ini berkembang daripada **Shopee MY CSV Calculator v1.2.2** kepada **Historical Enrichment v2.0**.

Versi v1.2.2 berfungsi sebagai baseline untuk menganalisis data Orders CSV dan Items CSV, manakala v2.0 memberi fokus kepada enrichment data sejarah melalui individual order details.

---

## Versi Projek

| Versi | Nama | Fungsi | Status |
|---|---|---|---|
| **v1.2.2** | Shopee MY CSV Calculator | Analisis CSV order/item | Stable baseline |
| **v2.0** | Shopee Historical Enrichment | Historical order-data enrichment | Research |
| Future | TBD | Penambahbaikan seterusnya | Planned |

---

## v1.2.2 — Shopee MY CSV Calculator

Calculator v1.2.2 ialah analytical layer yang beroperasi secara **local-only**.

Ia boleh membaca:

- Orders CSV
- Items CSV
- atau kedua-duanya

Antara analisis yang disediakan:

- Unique Orders
- Paid / Active Orders
- Total Spent
- Average Order
- Gross Units
- Returned Units
- Net Units
- Item Rows
- Status Breakdown
- Data Integrity
- Analisis mengikut tahun
- Item/product analytics

Calculator ini digunakan sebagai **baseline analytical layer** untuk projek.

---

## v2.0 — Historical Enrichment

v2.0 menggunakan pendekatan yang berbeza daripada calculator.

Workflow utamanya ialah:

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

---

## ☕ Optional Support

If this project is useful for your research, learning, or data-analysis work, optional support is appreciated.

### ☕ Ko-fi

[Support on Ko-fi](https://ko-fi.com/jayfreddy)

Other links:

- [🌐 Solo.to](https://solo.to/jayfreddy)
- [💬 Sociabuzz](https://sociabuzz.com/jayfreddy)

Support is completely optional and is not required to use the project.

---

## ⚠️ Disclaimer

This is an independent third-party research project.

[Read the full Disclaimer](disclaimer)

---

## Project Status

**Research / Experimental**

The project may change as research continues and as Shopee's consumer web changes.

`shopee-historical-enrichment` is maintained by `jayfreddy1994`.

---

### Acknowledgement

This project was developed by JF-CCTV-X7, with assistance from ChatGPT for research, analysis, documentation, problem-solving, and development support.

---
