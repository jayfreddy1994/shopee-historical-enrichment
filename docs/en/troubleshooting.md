# Troubleshooting — Shopee Historical Enrichment v2.0

This guide helps identify common problems when running Shopee Historical Enrichment v2.0.

> ⚠️ **Important:** Do not share passwords, cookies, session tokens, access tokens, or personal information for troubleshooting purposes.

---

# 1. The Utility Does Not Run

If the utility does not produce the expected output, first check:

1. You are still logged in to Shopee.
2. The Shopee page can be opened normally.
3. The browser has an internet connection.
4. Developer Tools is open on the **Console** tab.
5. You are using the correct source-code version.
6. No browser extension is interfering with page execution.

If there is an error, save the error message without including personal information.

---

# 2. The Console Shows an Error

Console errors can occur for several reasons.

Examples include:

```text
JavaScript error
Network error
Unexpected response
Request failed
Parsing error
```

Do not try to resolve the problem by copying:

```text
Cookies
Session tokens
Authentication headers
Access tokens
Passwords
```

Instead, document:

```text
Browser
Operating system
Test date
Step being performed
Sanitized error message
```

---

# 3. No Order IDs Are Found

If the utility does not find order IDs, check:

- whether the order-history page loads;
- whether you are using your own account;
- whether the order history still contains data;
- whether Shopee changed the response structure;
- whether the network connection is stable.

If the order history still works in the UI but the utility finds no data, the consumer-web response structure may have changed.

---

# 4. The Order Count Is Different From 433

**433 is not a fixed value.**

It is the count obtained from the project's test dataset.

Another account may have:

```text
100 orders
500 orders
1,000+ orders
```

or a different number.

Therefore, do not assume:

```text
433 = every Shopee account
```

Instead:

```text
433 = observed test dataset
```

---

# 5. Some Detail Requests Fail

If some order details fail:

```text
Order IDs:        433
Successful:       420
Failed:            13
```

do not immediately assume that the 13 orders do not exist.

Possible causes include:

- temporary network failure;
- response timeout;
- platform-side changes;
- endpoint behavior changes;
- rate limiting;
- order detail no longer being available;
- browser/session state changes.

Record:

```text
Total IDs
Successful details
Failed details
Missing create_time
```

This helps determine whether the problem occurred during the list stage or the detail stage.

---

# 6. `create_time` Is Missing

If the order detail is successfully retrieved but `create_time` cannot be found, check whether the response structure has changed.

An earlier structure may use:

```text
data.pc_processing_info.create_time
```

or a related field/structure.

If Shopee changes the field name or JSON structure, the v2.0 parser may no longer recognize the timestamp.

In that situation, do not conclude that the order has no creation date.

It may be:

```text
Response changed
```

rather than:

```text
Order has no creation time
```

---

# 7. Order-Time Labels Have Changed

v2.0 uses labels such as:

```text
label_odp_order_time
label_odp_payment_time
label_odp_ship_time
label_odp_completed_time
```

If these labels change or disappear, the extraction logic may require an update.

Compare:

```text
Expected structure
        ↓
Current response
        ↓
Changed field / label
```

Do not share responses containing personal information.

---

# 8. The Process Stops Halfway

If processing stops before all orders are completed, possible causes include:

- network interruption;
- browser tab closed;
- page refresh;
- temporary server error;
- response timeout;
- platform-side change.

Basic steps:

1. Make sure the browser is still connected.
2. Keep the Shopee tab open.
3. Do not refresh while processing is running.
4. Run again after the environment is stable.
5. Compare the new run's statistics with the previous run.

---

# 9. The Browser Is Very Slow

The number of requests increases with the number of orders.

For example:

```text
100 orders
    ↓
100 detail requests

433 orders
    ↓
433 detail requests
```

Therefore, larger datasets can take longer to process.

Do not aggressively reduce delays simply to make the process faster.

---

# 10. The Result Is Incomplete

If the dataset appears incomplete, first distinguish between:

### Extraction failure

```text
Order ID was not collected
```

### Detail failure

```text
Order ID exists
but detail request failed
```

### Parsing failure

```text
Detail succeeded
but the field was not recognized
```

### Historical coverage limitation

```text
The order was not present in the source list
```

These four situations are not the same.

---

# 11. The Oldest Order Is Not 23 March 2019

That is normal.

`23 March 2019` is:

> **the oldest observed order in the project's test dataset**

It is not a minimum guaranteed by Shopee.

If your account produces:

```text
Oldest order:
2021
```

that does not necessarily mean the utility failed.

It may mean that older orders were not included in the source list available to the utility.

---

# 12. Does This Mean There Was No History Before 2019?

No.

If the oldest observed order is:

```text
23 March 2019
```

we can only say:

> That is the oldest order observed in the successfully collected dataset.

It **does not prove** that no order existed before that date.

This is the difference between:

```text
Oldest observed
```

and:

```text
Absolute oldest ever
```

---

# 13. 433/433 but Still Not Complete?

Yes, theoretically.

For example:

```text
Shopee source list
        ↓
433 orders
        ↓
433/433 detail success
```

This means all **433 successfully collected orders** had details that were successfully processed.

It does not prove:

```text
433 = every order ever created
```

This is why the project uses the term:

> **Historical Enrichment**

rather than:

> **Complete Historical Archive**

---

# 14. JSON Works but CSV Fails

If JSON succeeds but CSV does not, check:

- browser download permissions;
- file-system permissions;
- popup/download blocking;
- file name;
- browser extensions.

Also make sure sufficient storage space is available.

---

# 15. The Dataset Contains Personal Information

This can happen because the data comes from the user's own account.

Do not publish the raw dataset.

Before sharing:

```text
Name           → REDACT
Phone          → REDACT
Address        → REDACT
Tracking       → REDACT
Email          → REDACT
Payment data   → REDACT
```

For public GitHub Issues or screenshots, use sanitized data.

---

# 16. Do Not Use Credentials for Troubleshooting

This project does not require you to provide:

```text
Password
Cookies
Session tokens
Access tokens
Authentication headers
```

If someone asks for these details for "debugging", **do not provide them**.

Use non-sensitive information such as:

```text
Browser version
OS
Console error
Approximate order count
Success/failure count
```

---

# 17. Shopee Has Changed an Endpoint

If the utility previously worked and suddenly fails, a change to the consumer web is one possible explanation.

Signs may include:

```text
Previously:
433/433 success

Now:
0/433
```

or:

```text
Expected field:
create_time

Current response:
field unavailable / structure changed
```

In this situation, the project may require additional research and a code update.

Do not assume the change is a problem with your computer without further investigation.

---

# 18. When to Open an Issue

A GitHub Issue is appropriate when the problem can be described without exposing personal data.

Include:

```text
Browser:
Operating System:
Project Version:
Approximate Order Count:
Successful Detail Count:
Failed Detail Count:
Error Message:
```

Do not include:

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

# 19. Issue Template

You can use this template:

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
Utility fails
      ↓
Can Shopee be opened?
      │
      ├── No
      │     ↓
      │   Check network / Shopee availability
      │
      └── Yes
            ↓
      Are Order IDs found?
            │
            ├── No
            │     ↓
            │   Check order-list response / platform changes
            │
            └── Yes
                  ↓
            Did detail requests succeed?
                  │
                  ├── No
                  │     ↓
                  │   Check network / response / platform changes
                  │
                  └── Yes
                        ↓
                  Is create_time found?
                        │
                        ├── No
                        │     ↓
                        │   Check response structure / parser
                        │
                        └── Yes
                              ↓
                         Export dataset
```

---

# 21. Troubleshooting Summary

When a problem occurs, identify **which stage** failed:

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

By separating each stage, problems can be investigated without requiring user credentials or personal data.

---

## Related Documentation

- [Getting Started](getting-started.md)
- [Tutorial](tutorial.md)
- [Methodology](methodology.md)
- [DISCLAIMER.md](../../DISCLAIMER.md)
