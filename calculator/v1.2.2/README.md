# Shopee MY Purchase History Project v1.2.2

## What changed

### Extractor v1.2.2
- Keeps the successful v1.2.1 behavior.
- Primary all-order endpoint can finish after 433 records without falling into the broken status-list fallback.
- Missing Order Date enrichment uses Shopee order-detail data.
- Orders CSV and Items CSV are rebuilt from the same parsed order objects.
- Order IDs therefore remain directly related.

### Calculator v1.2.2
- Fixed a JavaScript CSV parser bug in v1.2/v1.2.1.
- The previous parser contained escaped `\n`/`\r` comparisons, so it could fail to split normal CSV lines and report `CSV kosong` even when the downloaded CSV was valid.
- v1.2.2 correctly handles UTF-8 BOM, CRLF/LF, quoted fields, escaped quotes, and commas inside quoted fields.
- Added a small parser preview to make future malformed/empty CSV errors easier to diagnose.

## Test result from the latest v1.2.1 extraction
The downloaded files were independently inspected:
- Orders CSV: 433 rows, 14 columns
- Items CSV: 557 rows, 13 columns
- Orders missing Order Date: 0
- Order Date sources: 258 shipping_activity, 175 order_detail.pc_processing_info.create_time
- Active/paid total: RM 27,213.06

This confirms the extractor produced readable CSV data. The `CSV kosong` shown by the calculator was caused by the calculator parser, not an empty extractor output.

## Usage
1. Log in to Shopee MY.
2. Open My Purchase / Order List.
3. F12 -> Console -> Clear.
4. Run `extractor-v1.2.2.js` once.
5. Wait until the final summary appears and both CSV files download.
6. Open `shopee-csv-calculator-v1.2.2.html`.
7. Load the Orders CSV and Items CSV.

Expected integrity checks:
- Unique Order IDs: 433
- Duplicate Order IDs: 0
- Orders with missing Order Date: 0
- Item Order IDs not found in Orders: 0

Do not treat unrelated browser warnings such as Meta Pixel or CSP report-only messages as proof of bot detection. The extraction results themselves are the stronger evidence.
