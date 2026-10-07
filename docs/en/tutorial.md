# Tutorial — Shopee Historical Enrichment v2.0

A practical guide for using **Shopee Historical Enrichment v2.0** to perform historical enrichment on order data from your own Shopee account.

> ⚠️ **Important:** This is an independent third-party project and is not affiliated with, endorsed by, or officially supported by Shopee.

---

## 1. Before You Start

Make sure you:

- are using your own Shopee account;
- are using a modern desktop browser;
- are normally logged in to Shopee;
- can open the order-history page;
- understand that processed data may contain personal information.

### Do not share

Do not share:

- passwords;
- cookies;
- session tokens;
- access tokens;
- payment information;
- shipping addresses;
- phone numbers;
- tracking numbers;
- other personal information.

**This utility does not require you to copy or publish credential/session information.**

---

## 2. Get the Source Code

The main v2.0 source code is located at:

```text
src/
└── shopee_historical_enrichment_v2.js
```

Repository:

https://github.com/jayfreddy1994/shopee-historical-enrichment

Open:

```text
src/shopee_historical_enrichment_v2.js
```

Then use the source code to run the utility against your own account.

---

## 3. Open Shopee Order History

1. Open Shopee using a desktop browser.
2. Log in using your own account.
3. Go to **My Purchases / All Purchases**.
4. Make sure your order history is accessible.

The utility uses order-history data available through the browser to collect order IDs before performing the enrichment process.

### Note

Shopee's UI may change over time, between site versions, or between accounts.

Menu names and page layouts may therefore differ.

---

## 4. Open Developer Tools

In a desktop browser:

- open **Developer Tools**;
- select the **Console** tab.

Common shortcuts include:

```text
Windows:
Ctrl + Shift + J
```

or:

```text
F12
```

Then select:

```text
Console
```

> ⚠️ Never enter or share passwords, cookies, session tokens, or access tokens in the Console.

---

## 5. Run v2.0

Use the source code:

```text
shopee_historical_enrichment_v2.js
```

Run the utility while you are in your own authenticated Shopee browser session.

The utility follows this workflow:

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

The utility uses the browser session already available to the logged-in user to read data available to that user.

It is not designed to obtain user credentials.

---

## 6. Order ID Collection

The first stage collects order IDs from the order-history list.

Conceptually:

```text
Order History List
        ↓
Pagination
        ↓
Order IDs
```

v2.0 then processes the collected order IDs.

---

## 7. Order Detail Processing

Each order ID is processed separately to obtain its individual details.

Workflow:

```text
Order ID
   ↓
Individual Order Detail
   ↓
Processing Information
```

This step is important because the timestamps needed for historical enrichment do not necessarily depend only on the timestamp visible in the order-history list.

---

## 8. TRUE Order Creation Timestamp

v2.0 reads processing information available in the order detail.

Fields include:

```text
create_time
shipping_confirm_time
pay_time
delivery_time
complete_time
```

The utility also recognizes labels such as:

```text
label_odp_order_time
label_odp_payment_time
label_odp_ship_time
label_odp_completed_time
```

The main focus of historical enrichment is:

```text
create_time
```

This is used as the **TRUE Order Creation Timestamp** for the project's dataset.

---

## 9. Wait for the Scan to Finish

While the utility is running, do not close the tab or refresh the Shopee page.

Processing time depends on:

- number of orders;
- Shopee response time;
- network conditions;
- browser;
- changes to the consumer-web endpoint.

v2.0 uses delays between requests to avoid performing requests too aggressively.

---

## 10. Check the Statistics

After processing finishes, review the statistics displayed by the utility.

Example from the project's test dataset:

```text
Order IDs found:              433
Details scanned successfully: 433
Detail failures:                0
True order dates found:        433
```

Actual results for your account may differ.

---

## 11. Historical Range

In the project's test dataset, enrichment produced:

```text
Oldest order:
23 March 2019

Newest order:
7 October 2026
```

This shows that the order-history list obtained by the browser can serve as a starting point for enrichment through individual order details.

> ⚠️ This is an experimental result from the project's test dataset. It is not a guarantee that every Shopee account will have history reaching back to 2019 or the same number of orders.

---

## 12. Export the Dataset

After processing finishes, v2.0 produces datasets in two main formats:

```text
JSON
CSV
```

Example:

```text
shopee_historical_2019_2026_v2.json
shopee_historical_2019_2026_v2.csv
```

### JSON

Suitable for:

- data processing;
- programming;
- structural analysis;
- use with other tools.

### CSV

Suitable for:

- Excel;
- Google Sheets;
- spreadsheet analysis;
- filtering;
- sorting;
- calculations.

---

## 13. Do Not Upload Personal Datasets to GitHub

Datasets generated from your own account may contain sensitive or personal information.

**Do not commit files such as:**

```text
shopee_historical_2019_2026_v2.json
shopee_historical_2019_2026_v2.csv
```

to a public repository if they contain real account data.

The repository should contain:

```text
Source Code
Documentation
Examples
Redacted Screenshots
```

not:

```text
Personal Order History
Personal Address
Phone Number
Tracking Information
Payment Information
```

---

## 14. Sharing Screenshots

Before adding screenshots to GitHub or GitHub Pages, redact information such as:

```text
Name
Phone
Address
Email
Tracking Number
Order ID
Payment Information
```

Use examples such as:

```text
████████████
REDACTED
```

or blur/crop the information.

---

## 15. Building a Demonstration Dataset

For public documentation, use sanitized demonstration data.

Example:

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

The purpose is to demonstrate the data structure without exposing real user data.

---

## 16. Understanding the Enrichment Result

Historical enrichment does not necessarily mean that the utility successfully obtained **every** purchase that has ever existed.

Possible flow:

```text
Order History List
        ↓
Orders available to browser
        ↓
Order Detail
        ↓
Historical enrichment
```

If an order is not present in the source list available to the utility, the utility cannot conclude that the order exists.

Therefore:

> **Historical enrichment ≠ guaranteed complete historical archive**

---

## 17. TRUE Historical Completeness

The v2.0 experiment demonstrates that order details can provide order-creation timestamps that are older than timestamps observed from certain list views.

However, a different question remains:

> Could older orders exist that are not included in the 433-order list at all?

That requires a separate experiment to establish **TRUE Historical Completeness**.

The project therefore distinguishes between:

### Historical Enrichment

```text
Orders successfully collected
        +
Detail information
        ↓
Historical dates
```

and:

### TRUE Historical Completeness

```text
All orders that ever existed
        ↓
Compared against
        ↓
All orders successfully collected
```

v2.0 provides a foundation for historical enrichment, but **does not claim to have proven absolute historical completeness**.

---

## 18. If the Process Fails

If the utility fails, do not attempt to obtain or share:

- cookies;
- session tokens;
- authentication headers;
- passwords;
- access tokens.

Instead, check:

1. Are you still logged in?
2. Can the Shopee page still be opened?
3. Does the browser have a network connection?
4. Has Shopee recently changed its consumer-web structure?
5. Is there an error in the Console?
6. Can the order list still load normally?

For further diagnosis:

→ [Troubleshooting](troubleshooting.md)

---

## 19. Changes to Shopee

Shopee may change:

- endpoints;
- parameters;
- response structures;
- pagination;
- field names;
- UI;
- authentication behavior;
- availability of historical records.

If changes occur, v2.0 may:

```text
Stop working
```

or:

```text
Produce an incomplete dataset
```

or:

```text
Produce a different response structure
```

This does not necessarily mean that there is a problem with the user's browser or computer.

---

## 20. Security Principles

Use this utility only for:

```text
Your own account
      ↓
Your own data
      ↓
Your own research / analysis
```

Do not use it for:

```text
Other people's accounts
      ↓
Other people's data
      ↓
Credential extraction
      ↓
Authentication bypass
```

---

## 21. Quick Start

```text
1. Log in to Shopee
        ↓
2. Open My Purchases / All Purchases
        ↓
3. Open Developer Tools
        ↓
4. Go to Console
        ↓
5. Run shopee_historical_enrichment_v2.js
        ↓
6. Wait for the process to finish
        ↓
7. Review the statistics
        ↓
8. Review the JSON / CSV
        ↓
9. Keep the dataset private
        ↓
10. Redact before sharing screenshots
```

---

## Next

To understand how the experiment was developed:

- [Methodology](methodology.md)

If you encounter problems:

- [Troubleshooting](troubleshooting.md)

For the project overview:

- [Getting Started](getting-started.md)

For terms and limitations:

- [DISCLAIMER.md](../../DISCLAIMER.md)
