type VoucherRow = {
  label: string
  value?: string | number | null
}

type VoucherData = {
  reference: string
  issuedDate: string
  currency?: string
  customer: VoucherRow[]
  rental: VoucherRow[]
  pricing: VoucherRow[]
  total: string
  lateFeeNote?: string
  nextSteps?: string[]
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function renderRows(rows: VoucherRow[]) {
  return rows
    .filter((row) => row.value !== undefined && row.value !== null && String(row.value).trim() !== "")
    .map(
      (row) => `
        <div class="detail-row">
          <span class="detail-label">${escapeHtml(row.label)}</span>
          <span class="detail-value">${escapeHtml(row.value)}</span>
        </div>`,
    )
    .join("")
}

function renderPriceRows(rows: VoucherRow[]) {
  return rows
    .filter((row) => row.value !== undefined && row.value !== null && String(row.value).trim() !== "")
    .map(
      (row) => `
        <div class="price-row">
          <span>${escapeHtml(row.label)}</span>
          <strong>${escapeHtml(row.value)}</strong>
        </div>`,
    )
    .join("")
}

export function generateVoucherHtml(voucher: VoucherData) {
  const steps =
    voucher.nextSteps && voucher.nextSteps.length > 0
      ? voucher.nextSteps
      : [
          "The team will confirm availability, the final price, and the applicable rental terms.",
          "Any deposit or payment arrangements will be shared separately by the team.",
          "Wait for written confirmation and pickup instructions before travelling.",
        ]

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>Request summary ${escapeHtml(voucher.reference)} | Sweet Car Hire</title>
  <style>
    :root {
      color-scheme: light;
      --navy: #123064;
      --ink: #263246;
      --muted: #687487;
      --line: #e4e8ee;
      --paper: #ffffff;
      --canvas: #f1f3f6;
      --pink: #e72c82;
      --pink-soft: #fff3f8;
      --notice: #fbf8ef;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 28px 16px;
      background: var(--canvas);
      color: var(--ink);
      font: 14px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .page { width: 100%; max-width: 820px; margin: 0 auto; }
    .actions { display: flex; justify-content: flex-end; margin: 0 0 12px; }
    .print-button {
      appearance: none;
      border: 1px solid var(--navy);
      border-radius: 6px;
      background: var(--navy);
      color: #fff;
      font: inherit;
      font-size: 13px;
      font-weight: 650;
      padding: 9px 14px;
      cursor: pointer;
    }
    .print-button:hover { background: #1c427e; }
    .document {
      background: var(--paper);
      border: 1px solid #e2e5e9;
      border-top: 4px solid var(--pink);
      box-shadow: 0 12px 36px rgba(22, 39, 67, .08);
    }
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 24px;
      padding: 30px 36px 26px;
      border-bottom: 1px solid var(--line);
    }
    .eyebrow {
      margin: 0 0 7px;
      color: var(--pink);
      font-size: 10px;
      font-weight: 750;
      letter-spacing: .15em;
      text-transform: uppercase;
    }
    .brand {
      margin: 0;
      color: var(--navy);
      font-size: 25px;
      font-weight: 760;
      letter-spacing: -.035em;
      line-height: 1.2;
    }
    .tagline { margin: 6px 0 0; color: var(--muted); font-size: 13px; }
    .reference { min-width: 185px; text-align: right; }
    .reference-label, .issued-label {
      color: var(--muted);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .09em;
      text-transform: uppercase;
    }
    .reference-value {
      margin: 3px 0 5px;
      color: var(--navy);
      font-size: 18px;
      font-weight: 750;
      letter-spacing: .02em;
      overflow-wrap: anywhere;
    }
    .issued { color: var(--muted); font-size: 12px; }
    .status {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 13px 36px;
      background: var(--pink-soft);
      border-bottom: 1px solid #f4d5e3;
      color: #74234a;
      font-size: 12px;
      font-weight: 650;
    }
    .status-mark {
      width: 7px;
      height: 7px;
      flex: 0 0 7px;
      border-radius: 50%;
      background: var(--pink);
    }
    .content { padding: 26px 36px 30px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px 28px; }
    .section { min-width: 0; }
    .section.full { grid-column: 1 / -1; }
    .section-title {
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 0 9px;
      color: var(--navy);
      font-size: 13px;
      font-weight: 750;
    }
    .section-title::before {
      width: 3px;
      height: 15px;
      border-radius: 2px;
      background: var(--pink);
      content: "";
    }
    .detail-row, .price-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 8px 0;
      border-top: 1px solid var(--line);
      font-size: 12px;
    }
    .detail-label, .price-row span { color: var(--muted); }
    .detail-value, .price-row strong {
      color: var(--ink);
      font-weight: 650;
      text-align: right;
      overflow-wrap: anywhere;
    }
    .price-row { padding: 9px 0; }
    .total {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-top: 8px;
      padding: 14px 0 0;
      border-top: 1px solid #cbd3df;
    }
    .total-label { color: var(--navy); font-size: 12px; font-weight: 700; }
    .total-value { color: var(--navy); font-size: 22px; font-weight: 760; }
    .note {
      margin: 13px 0 0;
      padding: 11px 13px;
      border-left: 3px solid #d9b863;
      background: var(--notice);
      color: #5d533d;
      font-size: 11px;
      line-height: 1.55;
    }
    .steps { margin: 0; padding: 0; list-style: none; counter-reset: step; }
    .steps li {
      position: relative;
      padding: 8px 0 8px 29px;
      border-top: 1px solid var(--line);
      color: var(--ink);
      font-size: 12px;
      counter-increment: step;
    }
    .steps li::before {
      position: absolute;
      left: 0;
      top: 8px;
      color: var(--pink);
      font-size: 11px;
      font-weight: 750;
      content: counter(step, decimal-leading-zero);
    }
    .footer {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding: 16px 36px 20px;
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 10px;
    }
    .footer strong { color: var(--navy); font-size: 11px; }
    .contact { text-align: right; }
    @media (max-width: 620px) {
      body { padding: 0; background: var(--paper); }
      .actions { padding: 12px 16px 0; }
      .document { border-right: 0; border-left: 0; box-shadow: none; }
      .header { flex-direction: column; gap: 16px; padding: 24px 20px; }
      .reference { min-width: 0; text-align: left; }
      .status { padding: 12px 20px; }
      .content { padding: 22px 20px 26px; }
      .grid { grid-template-columns: 1fr; gap: 21px; }
      .section.full { grid-column: auto; }
      .footer { padding: 16px 20px 20px; }
    }
    @page { size: A4; margin: 14mm; }
    @media print {
      body { padding: 0; background: #fff; font-size: 11px; }
      .page { max-width: none; }
      .actions { display: none; }
      .document { border: 0; border-top: 3px solid var(--pink); box-shadow: none; }
      .header { padding: 18px 22px 16px; }
      .status { padding: 9px 22px; }
      .content { padding: 18px 22px 20px; }
      .grid { gap: 15px 24px; }
      .section, .total, .note, .steps li { break-inside: avoid; }
      .footer { padding: 12px 22px 14px; }
      .status, .status-mark, .section-title::before, .note {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <main class="page">
    <div class="actions">
      <button class="print-button" type="button" onclick="window.print()">Print / Save as PDF</button>
    </div>
    <article class="document">
      <header class="header">
        <div>
          <p class="eyebrow">Rental request summary</p>
          <h1 class="brand">Sweet Car Hire</h1>
          <p class="tagline">Mahé, Seychelles</p>
        </div>
        <div class="reference">
          <div class="reference-label">Request reference</div>
          <div class="reference-value">${escapeHtml(voucher.reference)}</div>
          <div class="issued"><span class="issued-label">Prepared</span> &nbsp;${escapeHtml(voucher.issuedDate)}</div>
        </div>
      </header>

      <div class="status">
        <span class="status-mark" aria-hidden="true"></span>
        <span>Request received · awaiting availability confirmation</span>
      </div>

      <section class="content">
        <div class="grid">
          <section class="section">
            <h2 class="section-title">Customer</h2>
            ${renderRows(voucher.customer)}
          </section>

          <section class="section">
            <h2 class="section-title">Rental details</h2>
            ${renderRows(voucher.rental)}
          </section>

          <section class="section full">
            <h2 class="section-title">Estimated price</h2>
            ${renderPriceRows(voucher.pricing)}
            <div class="total">
              <span class="total-label">Estimated rental charges</span>
              <strong class="total-value">${escapeHtml(voucher.total)}</strong>
            </div>
            <p class="note">${escapeHtml(voucher.lateFeeNote || "Estimate only. Insurance is not included. The team will confirm availability, the final price, and applicable rental terms before the reservation is confirmed.")}</p>
          </section>

          <section class="section full">
            <h2 class="section-title">What happens next</h2>
            <ol class="steps">
              ${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
            </ol>
          </section>
        </div>
      </section>

      <footer class="footer">
        <div>
          <strong>Sweet Car Hire</strong><br>
          Keep this summary with your travel details.
        </div>
        <div class="contact">
          sweetcarhirebooking@gmail.com<br>
          +248 282 1182
        </div>
      </footer>
    </article>
  </main>
</body>
</html>`
}
