# Methodology — Shopee Historical Enrichment v2.0

This document describes the experimental path that led to **Shopee Historical Enrichment v2.0**, from the initial observation of the order-history list through confirmation that individual order details contain more historical order-date information.

> ⚠️ **Important:** All numerical results in this document refer to the project's **test dataset**. They are not a guarantee that all Shopee accounts will produce the same number or historical range.

---

## 1. Objective

The main objective was to investigate whether order-history data available through the browser could be enriched using information from individual order details.

The central question was:

> Can the order history available to the browser be used as the foundation for a historical order dataset with more complete order-creation timestamps?

The experiment developed in stages:

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

The first experiment focused on the order-history list endpoint used by the consumer web.

Main result:

```text
Order records returned: 433
```

Pagination was tested using offsets.

Overall, offsets from `0` through approximately `420` returned records, while the following offset no longer produced another batch.

This provided the initial foundation:

```text
Shopee Order History
        ↓
Order ID Collection
        ↓
433 order records
```

---

# 3. E1-B — Fallback Comparison

The next experiment compared the result with a fallback order-list endpoint.

The alternative endpoint returned:

```text
433 unique orders
```

No additional unique order IDs were found compared with the primary list.

This is important because, in the test dataset, the fallback did not expand the number of successfully collected orders.

Summary:

| Experiment | Result |
|---|---:|
| Primary order list | 433 |
| Fallback order list | 433 |
| Additional order IDs | 0 |

The experiment therefore continued to individual order details.

---

# 4. E1-C — Individual Order Detail

E1-C was the most important stage of the historical enrichment research.

Individual order details contained:

```text
data.pc_processing_info
```

Available information included:

```text
create_time
shipping_confirm_time
pay_time
delivery_time
complete_time
```

The response also contained labels such as:

```text
label_odp_order_time
label_odp_payment_time
label_odp_ship_time
label_odp_completed_time
```

This indicated that individual order details contained more detailed temporal information than the timestamp used for listing.

---

# 5. Full Detail Scan

All order IDs from the dataset were tested using individual order details.

Results:

```text
Order IDs found:              433
Details successfully scanned: 433
Detail request failures:        0
create_time found:             433
Missing create_time:             0
```

In short:

> **433 out of 433 orders were successfully enriched with `create_time` in the test dataset.**

This became the foundation of v2.0.

---

# 6. Oldest Observed Order

The most important result from E1-C was the discovery of an old order that was not obvious from the initial list-timestamp observations.

Oldest observed order in the test dataset:

```text
23 March 2019
```

Timestamp:

```text
23/03/2019 15:39:25 MYT
```

This provided experimental evidence that individual order details can expose an **order creation timestamp much older** than the range initially observed from the order-history listing.

---

# 7. TRUE Order Creation Timestamp

Based on E1-C, v2.0 focuses on:

```text
create_time
```

This field is used as the basis for the concept:

> **TRUE Order Creation Timestamp**

Within this project, the term refers to the order-creation timestamp obtained from the order-detail processing information.

It does not mean that the project has proven that this timestamp is an absolute archive record for every possible historical order.

---

# 8. v2.0 — Historical Enrichment

After E1-A through E1-C, the v2.0 workflow was established:

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

Unlike the baseline extractor, v2.0 does not stop at the order-history list.

It performs enrichment using the detail of each order.

---

# 9. v2.0 Full Test Result

The full test dataset produced:

| Metric | Result |
|---|---:|
| Order IDs | 433 |
| Detail scans successful | 433 |
| Detail failures | 0 |
| `create_time` found | 433 |
| Missing `create_time` | 0 |

Observed historical range:

```text
Oldest observed:
23 March 2019

Newest observed:
7 October 2026
```

Again, these are **results from the project's test dataset**.

---

# 10. What the Experiment Demonstrates

The experiment supports several conclusions:

### 10.1 The order list can serve as the basis for enrichment

The order-history list successfully provided order IDs that could then be processed individually.

### 10.2 Individual order details contain additional time information

Order details provide `pc_processing_info` and several related timestamps.

### 10.3 `create_time` can be used for historical enrichment

In the test dataset, all 433 orders provided `create_time`.

### 10.4 Old orders can be discovered through details

The oldest observed order in the test dataset was:

```text
23 March 2019
```

---

# 11. What the Experiment Does Not Prove

This is important.

The experiment **does not prove** that:

- 433 is the total number of orders that ever existed;
- there were no orders before 23 March 2019;
- all old orders are always available through the order-history list;
- all Shopee accounts will produce the same result;
- the endpoint and response structure will remain unchanged;
- the generated dataset is an absolute historical archive.

The key open question is:

> **Could there be older orders that were never included in the 433-order list?**

That requires a separate experiment to establish **TRUE Historical Completeness**.

---

# 12. Historical Enrichment vs Historical Completeness

These two concepts must be distinguished.

## Historical Enrichment

```text
Orders available to browser
        ↓
Individual order detail
        ↓
Historical timestamps
```

The goal is to enrich orders that were successfully collected.

## TRUE Historical Completeness

```text
All orders that ever existed
        ↓
Compared against
        ↓
All orders successfully collected
```

The second is much harder to prove.

Therefore, the project name:

> **Shopee Historical Enrichment**

is more accurate than claiming it is a complete historical archive.

---

# 13. Why v2.0 Is Not Called an "Official API"

The endpoints observed through the browser should not be described as:

```text
Official Shopee API
Shopee Public API
Shopee-approved API
```

The project instead uses the terminology:

> **Shopee consumer web endpoints observed by the browser**

This is more accurate for the research context and avoids claiming that the project is an official Shopee API.

---

# 14. Reproducibility

The v2.0 experiment can be described using the same pipeline:

```text
1. Collect order IDs
2. Retrieve individual order details
3. Read processing information
4. Extract order creation timestamp
5. Build enriched dataset
6. Export JSON / CSV
```

However, future results may change if Shopee changes its consumer web.

---

# 15. Limitations

The experiment depends on the state of the platform at the time of testing.

Potentially changing elements include:

- endpoints;
- parameters;
- pagination;
- response structure;
- field names;
- UI;
- authentication behavior;
- historical data availability.

Therefore, experimental results should be treated as:

```text
Observed result
```

rather than:

```text
Permanent platform guarantee
```

---

# 16. Conclusion

E1-A through E1-C led to one main finding:

> **The order-history list can serve as a starting point, while individual order details can provide more historical order-creation information for enrichment.**

In the project's test dataset:

```text
433 / 433
```

orders were successfully processed and had `create_time`.

Oldest observed order:

```text
23 March 2019
```

This finding forms the basis of:

> **Shopee Historical Enrichment v2.0**

However, the project clearly distinguishes between **historical enrichment** and **TRUE historical completeness**.

---

## Next

For usage instructions:

- [Getting Started](getting-started.md)
- [Tutorial](tutorial.md)

If something does not work:

- [Troubleshooting](troubleshooting.md)

For the disclaimer:

- [DISCLAIMER.md](../../DISCLAIMER.md)
