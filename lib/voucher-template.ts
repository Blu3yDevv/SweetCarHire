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
          "Our team will contact you within 24 hours to arrange payment details.",
          "Bring this voucher and a valid driver's license when collecting the vehicle.",
          "Contact us on WhatsApp at +248 2821182 if any details need to change.",
        ]

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sweet Car Hire - Booking Voucher</title>
  <style>
    @page { size: A4; margin: 16mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: #fdf8f3;
      color: #1f2937;
      font-family: "Segoe UI", Arial, sans-serif;
      line-height: 1.45;
    }
    .page {
      max-width: 840px;
      margin: 28px auto;
      padding: 0 16px;
    }
    .voucher {
      background: #fffdf9;
      border: 1px solid #eadfd4;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 22px 60px rgba(231, 44, 130, 0.12);
    }
    .header {
      padding: 34px;
      background: linear-gradient(135deg, #e72c82 0%, #ff6ea8 100%);
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-start;
    }
    .brand {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 0;
      margin: 0 0 8px;
    }
    .subtitle {
      color: rgba(255, 255, 255, 0.82);
      font-size: 14px;
      margin: 0;
    }
    .reference-card {
      min-width: 235px;
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.28);
      border-radius: 18px;
      padding: 16px;
      text-align: right;
      backdrop-filter: blur(18px);
    }
    .reference-label {
      color: rgba(255, 255, 255, 0.72);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .reference {
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 8px;
      word-break: break-word;
    }
    .issued {
      color: rgba(255, 255, 255, 0.72);
      font-size: 12px;
    }
    .status-bar {
      background: #fff6fb;
      border-bottom: 1px solid #f3cadb;
      padding: 14px 34px;
      color: #e72c82;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
    }
    .status-pill {
      background: #e72c82;
      border: 1px solid #e72c82;
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 12px;
      color: #ffffff;
      white-space: nowrap;
    }
    .content {
      padding: 30px 34px 34px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 18px;
    }
    .section {
      border: 1px solid #eadfd4;
      border-radius: 20px;
      padding: 20px;
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(231, 44, 130, 0.06);
    }
    .section.full {
      grid-column: 1 / -1;
    }
    .section-title {
      margin: 0 0 14px;
      color: #e72c82;
      font-size: 15px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0;
    }
    .detail-row,
    .price-row {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      padding: 10px 0;
      border-top: 1px solid #f0e7df;
      font-size: 14px;
    }
    .detail-row:first-of-type,
    .price-row:first-of-type {
      border-top: 0;
      padding-top: 0;
    }
    .detail-label,
    .price-row span {
      color: #657184;
    }
    .detail-value,
    .price-row strong {
      color: #1f2937;
      font-weight: 700;
      text-align: right;
      overflow-wrap: anywhere;
    }
    .total-box {
      margin-top: 18px;
      background: linear-gradient(135deg, #e72c82 0%, #ff6ea8 100%);
      color: #ffffff;
      border-radius: 18px;
      padding: 20px 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 18px;
    }
    .total-label {
      color: rgba(255,255,255,0.78);
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
    }
    .total-value {
      font-size: 30px;
      font-weight: 800;
      text-align: right;
    }
    .fee-note {
      margin-top: 14px;
      background: #fff8d8;
      border: 1px solid #f7d21c;
      color: #5f4a00;
      border-radius: 16px;
      padding: 13px 15px;
      font-size: 13px;
      font-weight: 700;
    }
    .steps {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .steps li {
      border-top: 1px solid #f0e7df;
      padding: 10px 0 10px 28px;
      position: relative;
      color: #38465a;
      font-size: 14px;
    }
    .steps li:first-child { border-top: 0; padding-top: 0; }
    .steps li:before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #e72c82;
      position: absolute;
      left: 6px;
      top: 17px;
    }
    .steps li:first-child:before { top: 7px; }
    .footer {
      border-top: 1px solid #eadfd4;
      padding: 18px 34px 24px;
      color: #657184;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      gap: 18px;
    }
    .footer strong {
      color: #e72c82;
    }
    @media (max-width: 680px) {
      .page { margin: 0; padding: 0; }
      .voucher { border-radius: 0; border-left: 0; border-right: 0; }
      .header,
      .status-bar,
      .footer {
        flex-direction: column;
        text-align: left;
        align-items: stretch;
      }
      .reference-card { min-width: 0; text-align: left; }
      .content { padding: 24px 18px; }
      .header,
      .status-bar,
      .footer { padding-left: 18px; padding-right: 18px; }
      .grid { grid-template-columns: 1fr; }
      .section.full { grid-column: auto; }
      .detail-row,
      .price-row,
      .total-box {
        flex-direction: column;
        gap: 4px;
      }
      .detail-value,
      .price-row strong,
      .total-value {
        text-align: left;
      }
    }
    @media print {
      body { background: #ffffff; }
      .page { max-width: none; margin: 0; padding: 0; }
      .voucher { box-shadow: none; border-radius: 0; }
      .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .total-box, .status-pill, .fee-note { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <main class="page">
    <article class="voucher">
      <header class="header">
        <div>
          <h1 class="brand">Sweet Car Hire</h1>
          <p class="subtitle">Drive Mahe your way</p>
        </div>
        <div class="reference-card">
          <div class="reference-label">Booking reference</div>
          <div class="reference">${escapeHtml(voucher.reference)}</div>
          <div class="issued">Issued ${escapeHtml(voucher.issuedDate)}</div>
        </div>
      </header>

      <div class="status-bar">
        <span>Booking received and awaiting final payment confirmation</span>
        <span class="status-pill">${escapeHtml(voucher.currency || "Selected currency")}</span>
      </div>

      <section class="content">
        <div class="grid">
          <section class="section">
            <h2 class="section-title">Customer</h2>
            ${renderRows(voucher.customer)}
          </section>

          <section class="section">
            <h2 class="section-title">Rental Details</h2>
            ${renderRows(voucher.rental)}
          </section>

          <section class="section full">
            <h2 class="section-title">Price Summary</h2>
            ${renderPriceRows(voucher.pricing)}
            <div class="total-box">
              <div>
                <div class="total-label">Total amount</div>
                <div>Payable as arranged with Sweet Car Hire</div>
              </div>
              <div class="total-value">${escapeHtml(voucher.total)}</div>
            </div>
            <div class="fee-note">${escapeHtml(voucher.lateFeeNote || "Late returns may incur an additional fee.")}</div>
          </section>

          <section class="section full">
            <h2 class="section-title">Next Steps</h2>
            <ul class="steps">
              ${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
            </ul>
          </section>
        </div>
      </section>

      <footer class="footer">
        <div>
          <strong>Sweet Car Hire</strong><br>
          Seychelles premium car rental service
        </div>
        <div>
          info@sweetcarhire.com<br>
          +248 2821182
        </div>
      </footer>
    </article>
  </main>
</body>
</html>`
}
