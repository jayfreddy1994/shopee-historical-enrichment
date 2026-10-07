(async () => {
  const BASE = location.origin;

  const LIST_LIMIT = 20;
  const DETAIL_DELAY_MS = 400;
  const LIST_DELAY_MS = 300;

  const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

  const money = value =>
    typeof value === "number"
      ? value / 100000
      : null;

  const formatMYT = unix => {
    if (!unix || !Number.isFinite(Number(unix))) {
      return "";
    }

    return new Date(Number(unix) * 1000)
      .toLocaleString("en-MY", {
        timeZone: "Asia/Kuala_Lumpur",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
  };

  const getJSON = async url => {
    const response = await fetch(url, {
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  };

  console.clear();

  console.log("==============================================");
  console.log(" SHOPEE HISTORICAL ENRICHMENT v2.0");
  console.log(" TRUE HISTORICAL ANALYSIS 2019 → 2026");
  console.log(" READ ONLY");
  console.log("==============================================");

  // ==================================================
  // STEP 1 — RETRIEVE THE 433 ORDER IDs
  // ==================================================

  const orderMap = new Map();

  let offset = 0;
  let page = 0;

  while (true) {
    page++;

    const url =
      `${BASE}/api/v4/order/get_all_order_and_checkout_list` +
      `?oft=2048&limit=${LIST_LIMIT}&offset=${offset}`;

    console.log(
      `[LIST ${page}] offset=${offset}`
    );

    const json = await getJSON(url);

    const data = json?.new_data;
    const entries =
      data?.order_or_checkout_data || [];

    let added = 0;

    for (const entry of entries) {
      const detail =
        entry?.order_list_detail;

      const orderId =
        detail?.info_card?.order_id;

      if (orderId) {
        const id = String(orderId);

        if (!orderMap.has(id)) {
          orderMap.set(id, {
            order_id: id,
            list_type:
              detail?.list_type ?? null
          });

          added++;
        }
      }
    }

    console.log(
      `   received=${entries.length}` +
      ` | new=${added}` +
      ` | total=${orderMap.size}`
    );

    const nextOffset = data?.next_offset;

    if (
      nextOffset === -1 ||
      nextOffset == null ||
      entries.length === 0
    ) {
      break;
    }

    offset = Number(nextOffset);

    await sleep(LIST_DELAY_MS);
  }

  const orderIds = [...orderMap.keys()];

  console.log("----------------------------------------------");
  console.log(
    `TOTAL UNIQUE ORDER IDS: ${orderIds.length}`
  );
  console.log("----------------------------------------------");

  // ==================================================
  // STEP 2 — DETAIL ENRICHMENT
  // ==================================================

  const orders = [];
  const failed = [];

  for (let i = 0; i < orderIds.length; i++) {

    const orderId = orderIds[i];

    console.log(
      `[DETAIL ${i + 1}/${orderIds.length}] ${orderId}`
    );

    try {

      const url =
        `${BASE}/api/v4/order/get_order_detail` +
        `?oft=2048&order_id=${encodeURIComponent(orderId)}`;

      const json = await getJSON(url);
      const data = json?.data;

      if (!data) {
        throw new Error("Missing data");
      }

      // ------------------------------------------------
      // TRUE TIMELINE
      // ------------------------------------------------

      const infoRows =
        data?.processing_info?.info_rows || [];

      const timeline = {};

      for (const row of infoRows) {

        const label =
          row?.info_label?.text || "";

        const rawValue =
          row?.info_value?.value;

        const value =
          rawValue !== undefined &&
          rawValue !== null &&
          rawValue !== ""
            ? Number(rawValue)
            : null;

        if (
          label === "label_odp_order_time"
        ) {
          timeline.order_time = value;
        }

        else if (
          label === "label_odp_payment_time"
        ) {
          timeline.payment_time = value;
        }

        else if (
          label === "label_odp_ship_time"
        ) {
          timeline.ship_time = value;
        }

        else if (
          label === "label_odp_completed_time"
        ) {
          timeline.completed_time = value;
        }
      }

      // ------------------------------------------------
      // INFO CARD
      // ------------------------------------------------

      const infoCard =
        data?.info_card || {};

      // ------------------------------------------------
      // SHOP + PRODUCTS
      // ------------------------------------------------

      const products = [];

      for (
        const parcel of
        infoCard.parcel_cards || []
      ) {

        const shop =
          parcel?.shop_info || {};

        for (
          const group of
          parcel?.product_info?.item_groups || []
        ) {

          for (
            const item of group?.items || []
          ) {

            products.push({
              shop_id:
                shop.shop_id ?? "",

              shop_name:
                shop.shop_name ?? "",

              item_id:
                item.item_id ?? "",

              model_id:
                item.model_id ?? "",

              product_name:
                item.name ?? "",

              variation:
                item.model_name ?? "",

              quantity:
                item.amount ?? 0,

              item_price_rm:
                money(item.item_price),

              order_price_rm:
                money(item.order_price)
            });
          }
        }
      }

      // ------------------------------------------------
      // SHIPPING / TRACKING
      // ------------------------------------------------

      let trackingNumber = "";
      let carrier = "";

      const shippingList =
        data?.pc_shipping
          ?.forder_shipping_info_list || [];

      if (shippingList.length) {

        const shipment =
          shippingList[0];

        trackingNumber =
          shipment?.tracking_number || "";

        carrier =
          shipment
            ?.fulfilment_carrier
            ?.text || "";
      }

      // ------------------------------------------------
      // PAYMENT
      // ------------------------------------------------

      const payment =
        data?.payment_method || {};

      // ------------------------------------------------
      // MAIN RECORD
      // ------------------------------------------------

      const record = {

        order_id:
          orderId,

        order_sn:
          data?.processing_info
            ?.order_sn || "",

        // TRUE historical timestamps
        order_time_unix:
          timeline.order_time || null,

        payment_time_unix:
          timeline.payment_time || null,

        ship_time_unix:
          timeline.ship_time || null,

        completed_time_unix:
          timeline.completed_time || null,

        // Human-readable MYT
        order_date:
          formatMYT(
            timeline.order_time
          ),

        payment_date:
          formatMYT(
            timeline.payment_time
          ),

        ship_date:
          formatMYT(
            timeline.ship_time
          ),

        completed_date:
          formatMYT(
            timeline.completed_time
          ),

        status:
          data?.status
            ?.status_label
            ?.text || "",

        list_type:
          data?.list_type ?? "",

        product_count:
          infoCard.product_count ?? 0,

        subtotal_rm:
          money(infoCard.subtotal),

        final_total_rm:
          money(infoCard.final_total),

        amount_paid_rm:
          money(infoCard.amount_paid),

        currency:
          infoCard.currency || "MYR",

        payment_method:
          payment
            ?.payment_channel_name
            ?.text || "",

        tracking_number:
          trackingNumber,

        carrier,

        products
      };

      orders.push(record);

    }

    catch (error) {

      console.error(
        `[FAILED] ${orderId}`,
        error
      );

      failed.push({
        order_id: orderId,
        error: String(error)
      });
    }

    await sleep(DETAIL_DELAY_MS);
  }

  // ==================================================
  // STEP 3 — SORT BY TRUE ORDER DATE
  // ==================================================

  orders.sort((a, b) =>
    (a.order_time_unix || 0) -
    (b.order_time_unix || 0)
  );

  // ==================================================
  // STEP 4 — FLATTEN TO CSV
  // ==================================================

  const csvRows = [];

  for (const order of orders) {

    if (!order.products.length) {

      csvRows.push({
        order_id:
          order.order_id,

        order_sn:
          order.order_sn,

        order_date:
          order.order_date,

        payment_date:
          order.payment_date,

        ship_date:
          order.ship_date,

        completed_date:
          order.completed_date,

        status:
          order.status,

        list_type:
          order.list_type,

        shop_name: "",

        item_id: "",

        model_id: "",

        product_name: "",

        variation: "",

        quantity: "",

        item_price_rm: "",

        order_price_rm: "",

        product_count:
          order.product_count,

        subtotal_rm:
          order.subtotal_rm,

        final_total_rm:
          order.final_total_rm,

        amount_paid_rm:
          order.amount_paid_rm,

        currency:
          order.currency,

        payment_method:
          order.payment_method,

        tracking_number:
          order.tracking_number,

        carrier:
          order.carrier
      });

      continue;
    }

    for (
      const product of order.products
    ) {

      csvRows.push({

        order_id:
          order.order_id,

        order_sn:
          order.order_sn,

        order_date:
          order.order_date,

        payment_date:
          order.payment_date,

        ship_date:
          order.ship_date,

        completed_date:
          order.completed_date,

        status:
          order.status,

        list_type:
          order.list_type,

        shop_name:
          product.shop_name,

        item_id:
          product.item_id,

        model_id:
          product.model_id,

        product_name:
          product.product_name,

        variation:
          product.variation,

        quantity:
          product.quantity,

        item_price_rm:
          product.item_price_rm,

        order_price_rm:
          product.order_price_rm,

        product_count:
          order.product_count,

        subtotal_rm:
          order.subtotal_rm,

        final_total_rm:
          order.final_total_rm,

        amount_paid_rm:
          order.amount_paid_rm,

        currency:
          order.currency,

        payment_method:
          order.payment_method,

        tracking_number:
          order.tracking_number,

        carrier:
          order.carrier
      });
    }
  }

  // ==================================================
  // STEP 5 — CSV
  // ==================================================

  const escapeCSV = value => {

    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    const text = String(value);

    if (
      text.includes(",") ||
      text.includes('"') ||
      text.includes("\n")
    ) {
      return `"${text.replaceAll('"', '""')}"`;
    }

    return text;
  };

  const headers =
    Object.keys(csvRows[0] || {});

  const csv = [
    headers.join(","),
    ...csvRows.map(row =>
      headers
        .map(h => escapeCSV(row[h]))
        .join(",")
    )
  ].join("\r\n");

  // ==================================================
  // STEP 6 — JSON
  // ==================================================

  const outputJSON = {

    generated_at:
      new Date().toISOString(),

    methodology:
      "Shopee consumer API get_all_order_and_checkout_list + get_order_detail",

    canonical_order_date:
      "data.processing_info.info_rows[label_odp_order_time]",

    total_order_ids:
      orderIds.length,

    successful_details:
      orders.length,

    failed_details:
      failed.length,

    orders,

    failed
  };

  const jsonBlob =
    new Blob(
      [JSON.stringify(
        outputJSON,
        null,
        2
      )],
      { type: "application/json" }
    );

  const jsonURL =
    URL.createObjectURL(jsonBlob);

  const jsonLink =
    document.createElement("a");

  jsonLink.href = jsonURL;

  jsonLink.download =
    "shopee_historical_2019_2026_v2.json";

  document.body.appendChild(jsonLink);

  jsonLink.click();

  jsonLink.remove();

  URL.revokeObjectURL(jsonURL);

  // ==================================================
  // STEP 7 — CSV DOWNLOAD
  // ==================================================

  const csvBlob =
    new Blob(
      [csv],
      { type: "text/csv;charset=utf-8" }
    );

  const csvURL =
    URL.createObjectURL(csvBlob);

  const csvLink =
    document.createElement("a");

  csvLink.href = csvURL;

  csvLink.download =
    "shopee_historical_2019_2026_v2.csv";

  document.body.appendChild(csvLink);

  csvLink.click();

  csvLink.remove();

  URL.revokeObjectURL(csvURL);

  // ==================================================
  // STEP 8 — FINAL REPORT
  // ==================================================

  const validDates =
    orders
      .map(x => x.order_time_unix)
      .filter(
        x =>
          Number.isFinite(x) &&
          x > 0
      );

  let oldest = null;
  let newest = null;

  if (validDates.length) {

    oldest =
      new Date(
        Math.min(...validDates) * 1000
      );

    newest =
      new Date(
        Math.max(...validDates) * 1000
      );
  }

  const formatReportDate = date =>
    date
      ? date.toLocaleString("en-MY", {
          timeZone:
            "Asia/Kuala_Lumpur",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        })
      : "N/A";

  console.log("");
  console.log("==============================================");
  console.log(" EXTRACTION COMPLETE — v2.0");
  console.log("==============================================");

  console.log(
    "Order IDs found:",
    orderIds.length
  );

  console.log(
    "Successful details:",
    orders.length
  );

  console.log(
    "Failed details:",
    failed.length
  );

  console.log(
    "Orders with TRUE order date:",
    validDates.length
  );

  console.log(
    "Oldest order:",
    formatReportDate(oldest)
  );

  console.log(
    "Newest order:",
    formatReportDate(newest)
  );

  console.log("");

  console.log(
    "Files downloaded:"
  );

  console.log(
    "shopee_historical_2019_2026_v2.json"
  );

  console.log(
    "shopee_historical_2019_2026_v2.csv"
  );

  console.log("==============================================");

})();