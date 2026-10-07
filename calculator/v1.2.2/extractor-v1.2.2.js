/*
 * Shopee MY Purchase History Extractor v1.2.2
 *
 * Purpose:
 *  - Extract the user's own Shopee MY purchase history into:
 *      shopee-orders-YYYY-MM-DD.csv
 *      shopee-items-YYYY-MM-DD.csv
 *  - Repair missing historical Order Date values by querying Shopee's
 *    buyer-side order detail endpoint for only orders whose date is missing.
 *
 * Run while logged in to https://shopee.com.my/user/purchase/
 * in DevTools > Console.
 *
 * No external server is used.
 */
(async () => {
  'use strict';

  const CONFIG = {
    pageLimit: 20,
    maxPages: 500,
    listDelayMs: 650,
    detailDelayMs: 500,
    retryLimit: 3,
    moneyDivisor: 100000,
    enrichMissingDates: true,
    maxDateEnrichment: 250,
    includeStatuses: [3, 7, 8, 12, 4, 9]
  };

  const STATUS = {
    3: 'Completed',
    4: 'Cancelled',
    7: 'To Ship',
    8: 'To Receive',
    9: 'To Pay',
    12: 'Return / Refund'
  };

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const text = v => v == null ? '' : String(v).trim();
  const money = n => Number.isFinite(Number(n)) ? Number(n) / CONFIG.moneyDivisor : 0;

  function getPath(obj, path) {
    return path.split('.').reduce((v, k) => v?.[k], obj);
  }

  function normalizeEpochSeconds(value) {
    if (value == null || value === '') return null;

    if (typeof value === 'string' && !/^\d+(?:\.\d+)?$/.test(value.trim())) {
      const parsed = Date.parse(value);
      return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : null;
    }

    let n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return null;

    if (n > 1e14) n /= 1e6;
    else if (n > 1e11) n /= 1000;

    const now = Math.floor(Date.now() / 1000);
    const earliest = 1420070400; // 2015-01-01
    const latest = now + 366 * 86400;

    return n >= earliest && n <= latest ? Math.floor(n) : null;
  }

  function formatDate(epoch) {
    if (!epoch) return '';
    return new Date(epoch * 1000).toLocaleString('en-MY');
  }

  function bestDate(detail) {
    // Prefer actual order/payment timestamps. Shipping activity is a fallback only.
    const paths = [
      ['info_card.order_create_time', 'order_create_time'],
      ['info_card.create_time', 'create_time'],
      ['info_card.ctime', 'ctime'],
      ['order_create_time', 'order_create_time'],
      ['create_time', 'create_time'],
      ['ctime', 'ctime'],
      ['info_card.pay_time', 'payment_time'],
      ['info_card.payment_time', 'payment_time'],
      ['info_card.paid_time', 'payment_time'],
      ['pay_time', 'payment_time'],
      ['payment_time', 'payment_time'],
      ['paid_time', 'payment_time'],
      ['shipping.tracking_info.ctime', 'shipping_activity'],
      ['shipping.tracking_info.create_time', 'shipping_activity']
    ];

    for (const [path, source] of paths) {
      const epoch = normalizeEpochSeconds(getPath(detail, path));
      if (epoch) return { epoch, source };
    }

    // Defensive fallback: inspect only time-like keys in the order object.
    const visited = new WeakSet();
    let best = null;

    function walk(value, path = '', depth = 0) {
      if (!value || typeof value !== 'object' || depth > 6 || visited.has(value)) return;
      visited.add(value);

      for (const [key, child] of Object.entries(value)) {
        const childPath = path ? `${path}.${key}` : key;
        const lower = key.toLowerCase();

        if (/^(create_time|ctime|order_create_time|pay_time|payment_time|paid_time|complete_time)$/.test(lower)) {
          const epoch = normalizeEpochSeconds(child);
          if (epoch && (!best || /create/.test(lower) || /ctime/.test(lower))) {
            best = { epoch, source: `deep:${childPath}` };
          }
        }

        if (child && typeof child === 'object') walk(child, childPath, depth + 1);
      }
    }

    walk(detail);
    return best;
  }

  async function fetchJson(url, attempt = 0) {
    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'X-API-SOURCE': 'pc'
      }
    });

    let json = null;
    try { json = await res.json(); }
    catch { throw new Error(`Shopee returned non-JSON data (HTTP ${res.status}).`); }

    if ((res.status === 429 || res.status >= 500) && attempt < CONFIG.retryLimit) {
      await sleep(1200 * (attempt + 1));
      return fetchJson(url, attempt + 1);
    }

    if (!res.ok) {
      throw new Error(`Shopee API HTTP ${res.status}: ${json?.error_msg || json?.message || res.statusText}`);
    }

    if (json?.error && json.error !== 0) {
      throw new Error(`Shopee API error: ${json.error_msg || json.message || json.error}`);
    }

    return json;
  }

  function extractPrimary(json) {
    const newer = json?.new_data?.order_or_checkout_data;
    if (Array.isArray(newer)) {
      return {
        recognized: true,
        orders: newer.map(x => x?.order_list_detail).filter(Boolean),
        nextOffset: Number.isFinite(Number(json?.new_data?.next_offset))
          ? Number(json.new_data.next_offset)
          : Number.isFinite(Number(json?.data?.order_data?.next_offset))
            ? Number(json.data.order_data.next_offset) : null
      };
    }

    const list = json?.data?.order_data?.details_list;
    if (Array.isArray(list)) {
      return {
        recognized: true,
        orders: list,
        nextOffset: Number.isFinite(Number(json?.data?.order_data?.next_offset))
          ? Number(json.data.order_data.next_offset) : null
      };
    }

    return { recognized: false, orders: [], nextOffset: null };
  }

  function extractStatusList(json) {
    const candidates = [
      json?.data?.details_list,
      json?.data?.order_data?.details_list,
      json?.new_data?.details_list,
      json?.details_list
    ];
    for (const c of candidates) {
      if (Array.isArray(c)) {
        return {
          recognized: true,
          orders: c,
          nextOffset: Number.isFinite(Number(json?.data?.next_offset))
            ? Number(json.data.next_offset) : null
        };
      }
    }
    return { recognized: false, orders: [], nextOffset: null };
  }

  function parseItems(cards) {
    const out = [];
    for (const card of (Array.isArray(cards) ? cards : [])) {
      const shop = card?.shop_info || {};
      const groups = card?.product_info?.item_groups || [];

      for (const group of groups) {
        for (const item of (group?.items || [])) {
          const qty = Math.max(0, Number(item?.amount ?? item?.quantity ?? 0) || 0);
          const unit = money(item?.item_price ?? item?.price ?? 0);

          out.push({
            shop: text(shop.shop_name || shop.username),
            shopUsername: text(shop.username),
            itemName: text(item?.name || item?.item_name),
            variant: text(item?.model_name || item?.variation || item?.variation_name),
            itemId: text(item?.item_id),
            modelId: text(item?.model_id),
            quantity: qty,
            unitPrice: unit,
            linePrice: unit * qty,
            returned: Number(item?.status) === 3
          });
        }
      }
    }
    return out;
  }

  function parseOrder(detail) {
    const info = detail?.info_card || {};
    const cards = Array.isArray(info.order_list_cards) ? info.order_list_cards : [];
    const firstCard = cards[0] || {};

    const orderId = text(
      info.order_id ?? info.order_sn ??
      detail?.order_id ?? detail?.order_sn ??
      firstCard?.order_id ?? firstCard?.order_sn
    );

    const statusCode = Number(detail?.list_type);
    const finalTotal = money(info.final_total ?? info.total_payable ?? info.subtotal ?? 0);
    const items = parseItems(cards);
    const date = bestDate(detail);

    const returnedValue = items.filter(x => x.returned).reduce((s, x) => s + x.linePrice, 0);

    return {
      orderId,
      dateEpoch: date?.epoch || null,
      dateSource: date?.source || 'missing',
      statusCode,
      status: STATUS[statusCode] || `Other (${statusCode || '?'})`,
      finalTotal,
      netPaid: finalTotal,
      shop: [...new Set(items.map(x => x.shop).filter(Boolean))].join(' | '),
      quantity: items.filter(x => !x.returned).reduce((s, x) => s + x.quantity, 0),
      itemListTotal: items.reduce((s, x) => s + x.linePrice, 0),
      returnedItemListTotal: returnedValue,
      partialReturn: returnedValue > 0 && returnedValue < items.reduce((s,x)=>s+x.linePrice,0),
      items
    };
  }

  async function scanPrimary() {
    const raw = [];
    let offset = 0;

    for (let page = 0; page < CONFIG.maxPages; page++) {
      console.log(`Scanning primary endpoint: page ${page + 1}, ${raw.length} raw records...`);

      const url = `${location.origin}/api/v4/order/get_all_order_and_checkout_list?limit=${CONFIG.pageLimit}&offset=${offset}`;
      const json = await fetchJson(url);
      const parsed = extractPrimary(json);

      if (!parsed.recognized) {
        // Shopee may return a different/empty terminal payload after the last page.
        // If we already collected records, keep them instead of discarding them and
        // incorrectly switching to the status-list endpoint.
        if (raw.length > 0) {
          console.warn(`Primary endpoint returned an unrecognized terminal response after ${raw.length} records; treating it as end-of-list.`);
          break;
        }
        return { supported: false, orders: [] };
      }
      if (!parsed.orders.length) break;

      raw.push(...parsed.orders);

      const next = parsed.nextOffset;
      if (next === -1) break;

      if (Number.isFinite(next) && next !== offset) offset = next;
      else {
        if (parsed.orders.length < CONFIG.pageLimit) break;
        offset += CONFIG.pageLimit;
      }

      await sleep(CONFIG.listDelayMs);
    }

    return { supported: true, orders: raw };
  }

  async function scanFallback() {
    const raw = [];

    for (const status of CONFIG.includeStatuses) {
      let offset = 0;

      for (let page = 0; page < CONFIG.maxPages; page++) {
        console.log(`Fallback ${STATUS[status] || status}: page ${page + 1}, ${raw.length} raw records...`);

        const url = `${location.origin}/api/v4/order/get_order_list?list_type=${status}&offset=${offset}&limit=${CONFIG.pageLimit}`;
        const json = await fetchJson(url);
        const parsed = extractStatusList(json);

        if (!parsed.recognized) throw new Error('Shopee changed the order-history response format.');
        if (!parsed.orders.length) break;

        raw.push(...parsed.orders);

        if (parsed.nextOffset === -1) break;
        if (Number.isFinite(parsed.nextOffset) && parsed.nextOffset !== offset) offset = parsed.nextOffset;
        else {
          if (parsed.orders.length < CONFIG.pageLimit) break;
          offset += CONFIG.pageLimit;
        }

        await sleep(CONFIG.listDelayMs);
      }
    }

    return raw;
  }

  function dedupeRaw(raw) {
    const map = new Map();

    for (const detail of raw) {
      const parsed = parseOrder(detail);
      if (!parsed.orderId) continue;

      const old = map.get(parsed.orderId);

      if (!old ||
          parsed.items.length > old.items.length ||
          parsed.finalTotal > old.finalTotal ||
          (!old.dateEpoch && parsed.dateEpoch)) {
        map.set(parsed.orderId, { parsed, raw: detail });
      }
    }

    return [...map.values()];
  }

  async function enrichMissingDates(records) {
    const missing = records.filter(x => !x.parsed.dateEpoch);
    if (!CONFIG.enrichMissingDates || !missing.length) return;

    console.log(`Date enrichment: ${missing.length} orders are missing Order Date.`);
    console.log('Using Shopee buyer-side order detail endpoint for missing dates only.');

    const targets = missing.slice(0, CONFIG.maxDateEnrichment);

    for (let n = 0; n < targets.length; n++) {
      const entry = targets[n];
      const id = encodeURIComponent(entry.parsed.orderId);

      try {
        const json = await fetchJson(
          `${location.origin}/api/v4/order/get_order_detail?order_id=${id}`
        );

        const pc = json?.data?.pc_processing_info;
        const create = normalizeEpochSeconds(pc?.create_time);
        const complete = normalizeEpochSeconds(pc?.complete_time);

        if (create) {
          entry.parsed.dateEpoch = create;
          entry.parsed.dateSource = 'order_detail.pc_processing_info.create_time';
        }

        entry.parsed.completeEpoch = complete || null;

      } catch (e) {
        entry.parsed.dateSource = `enrichment_failed:${String(e.message || e).slice(0,120)}`;
      }

      if ((n + 1) % 10 === 0 || n === targets.length - 1) {
        console.log(`Date enrichment: ${n + 1}/${targets.length}`);
      }

      await sleep(CONFIG.detailDelayMs);
    }

    if (missing.length > targets.length) {
      console.warn(`Date enrichment limit reached: ${targets.length}/${missing.length}.`);
    }
  }

  function csvCell(v) {
    let s = v == null ? '' : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return `"${s.replaceAll('"', '""')}"`;
  }

  function downloadCsv(name, headers, rows) {
    const csv = '\uFEFF' + [headers, ...rows]
      .map(r => r.map(csvCell).join(',')).join('\r\n');

    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  const stamp = new Date().toISOString().slice(0,10);

  console.clear();
  console.log('%cShopee MY Purchase History Extractor v1.2.2', 'font-size:18px;font-weight:bold');

  let rawOrders, mode;
  const primary = await scanPrimary();

  if (primary.supported) {
    rawOrders = primary.orders;
    mode = 'primary all-order endpoint';
  } else {
    console.warn('Primary endpoint not recognized. Switching to status-list fallback.');
    rawOrders = await scanFallback();
    mode = 'status-list fallback';
  }

  const records = dedupeRaw(rawOrders);
  await enrichMissingDates(records);

  const orders = records.map(x => x.parsed);
  const orderMap = new Map(orders.map(o => [o.orderId, o]));

  // Rebuild item rows from the same order objects: exact Order ID relationship.
  const items = orders.flatMap(o => o.items.map(i => ({order:o, item:i})));

  const orderHeaders = [
    'Order ID','Order Date','Order Date Source','Order Complete Date',
    'Order Status','Status Code','Shop','Quantity','Item List Total',
    'Order Final Total','Order Net Paid','Returned Item Value',
    'Partial Return','Products'
  ];

  const orderRows = orders.map(o => [
    o.orderId,
    formatDate(o.dateEpoch),
    o.dateSource,
    formatDate(o.completeEpoch),
    o.status,
    o.statusCode,
    o.shop,
    o.quantity,
    o.itemListTotal.toFixed(2),
    o.finalTotal.toFixed(2),
    o.netPaid.toFixed(2),
    o.returnedItemListTotal.toFixed(2),
    o.partialReturn ? 'Yes' : 'No',
    o.items.map(i => `${i.itemName}${i.variant ? ` [${i.variant}]` : ''} x${i.quantity}${i.returned ? ' [RETURNED]' : ''}`).join(' | ')
  ]);

  const itemHeaders = [
    'Order ID','Order Date','Order Status','Shop','Shop Username',
    'Item Name','Variant','Item ID','Model ID','Quantity',
    'Unit Price','Line Price','Returned'
  ];

  const itemRows = items.map(({order:o,item:i}) => [
    o.orderId,
    formatDate(o.dateEpoch),
    o.status,
    i.shop,
    i.shopUsername,
    i.itemName,
    i.variant,
    i.itemId,
    i.modelId,
    i.quantity,
    i.unitPrice.toFixed(2),
    i.linePrice.toFixed(2),
    i.returned ? 'Yes' : 'No'
  ]);

  downloadCsv(`shopee-orders-${stamp}.csv`, orderHeaders, orderRows);
  downloadCsv(`shopee-items-${stamp}.csv`, itemHeaders, itemRows);

  const missingAfter = orders.filter(o => !o.dateEpoch).length;
  const paidStatuses = new Set([3,7,8,12]);
  const total = orders
    .filter(o => paidStatuses.has(o.statusCode))
    .reduce((s,o) => s + o.netPaid, 0);

  const relationMissing = items.filter(({order}) => !orderMap.has(order.orderId)).length;

  console.log('==============================================');
  console.log(`API mode: ${mode}`);
  console.log(`Unique orders: ${orders.length}`);
  console.log(`Item rows: ${items.length}`);
  console.log(`Missing Order Date after enrichment: ${missingAfter}`);
  console.log(`Order/Item relationship errors: ${relationMissing}`);
  console.log(`Calculated active/paid total: RM ${total.toFixed(2)}`);
  console.log('Two CSV files have been downloaded.');
  console.log('==============================================');
})();
