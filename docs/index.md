---
layout: default
title: Shopee Historical Enrichment
---

# Shopee Historical Enrichment

**A read-only browser-based research utility for inspecting and enriching a user's own Shopee order-history data.**

> ⚠️ **Independent third-party project:** This project is not affiliated with, endorsed by, sponsored by, or officially supported by Shopee.

---

## 🌐 Documentation

Choose your language:

### 🇲🇾 Bahasa Melayu

- [Getting Started](ms/getting-started)
- [Tutorial](ms/tutorial)
- [Methodology](ms/methodology)
- [Troubleshooting](ms/troubleshooting)

### 🇬🇧 English

- [Getting Started](en/getting-started)
- [Tutorial](en/tutorial)
- [Methodology](en/methodology)
- [Troubleshooting](en/troubleshooting)

---

## 🔬 Project Overview

Shopee Historical Enrichment studies how order-history data available through the browser can be enriched using individual order details.

Main workflow:

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

The project is intended for research, learning, and personal data analysis using the user's own account data.

---

## 📊 Test Dataset

The project's v2.0 test dataset produced:

| Metric | Result |
|---|---:|
| Order IDs | 433 |
| Detail scans successful | 433 |
| Detail failures | 0 |
| `create_time` found | 433 |
| Oldest observed order | 23 March 2019 |
| Newest observed order | 7 October 2026 |

> These are results from the project's **test dataset**, not a guarantee for every Shopee account.

### Important distinction

**Historical enrichment** does not mean **complete historical archive**.

The project has not claimed to prove that 433 orders represent every order that ever existed on the account, nor that 23 March 2019 is the absolute earliest possible order.

---

## 🔐 Privacy & Security

This project is designed for **your own Shopee account and your own data**.

Never publish:

- passwords;
- cookies;
- session tokens;
- access tokens;
- addresses;
- phone numbers;
- tracking numbers;
- payment information;
- raw personal order datasets.

For public screenshots and demonstrations, redact personal information first.

---

## 📚 Repository

[View the source code and full project repository](https://github.com/jayfreddy1994/shopee-historical-enrichment)

---

## ☕ Optional Support

If this project is useful for your research, learning, or data-analysis work, optional support is appreciated.

### ☕ Ko-fi

[**Support on Ko-fi**](https://ko-fi.com/jayfreddy)

Other links:

- [🌐 Solo.to](https://solo.to/jayfreddy)
- [💬 Sociabuzz](https://sociabuzz.com/jayfreddy)

Support is **completely optional** and is not required to use the project.

---

## ⚠️ Disclaimer

This is an independent third-party research project.

See the full:

[**DISCLAIMER.md**](../DISCLAIMER.md)

---

## Project Status

**Research / Experimental**

The project may change as research continues and as Shopee's consumer web changes.
