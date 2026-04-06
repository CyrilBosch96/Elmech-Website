import { QuotationProduct } from "@/types";

// Formats a sequential quotation ref from a Firestore-sourced counter
export function formatQuotationRef(year: number, count: number): string {
  const yy = String(year).slice(-2);
  return `${yy}-EECQuote-${String(count).padStart(3, "0")}`;
}

// Fallback when Firestore is unavailable
export function fallbackQuotationRef(): string {
  const yy = String(new Date().getFullYear()).slice(-2);
  const rand = String(Math.floor(100 + Math.random() * 900));
  return `${yy}-EECQuote-${rand}`;
}

export function formatDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildProductTable(products: QuotationProduct[]): string {
  const rows = products
    .map(
      (p, i) => `
      <tr style="background: ${i % 2 === 0 ? "#f8fafc" : "#ffffff"};">
        <td style="padding: 10px 12px; border: 1px solid #e2e8f0;">${i + 1}</td>
        <td style="padding: 10px 12px; border: 1px solid #e2e8f0;">${p.productName}</td>
        <td style="padding: 10px 12px; border: 1px solid #e2e8f0; text-align: center;">${p.quantity}</td>
        <td style="padding: 10px 12px; border: 1px solid #e2e8f0; text-align: right;">${formatINR(p.mrpEach)}</td>
        <td style="padding: 10px 12px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${formatINR(p.subtotal)}</td>
      </tr>`
    )
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 16px;">
      <thead>
        <tr style="background: #1e3a5f; color: #ffffff;">
          <th style="padding: 10px 12px; border: 1px solid #1e3a5f; text-align: left;">#</th>
          <th style="padding: 10px 12px; border: 1px solid #1e3a5f; text-align: left;">Product</th>
          <th style="padding: 10px 12px; border: 1px solid #1e3a5f; text-align: center;">Qty</th>
          <th style="padding: 10px 12px; border: 1px solid #1e3a5f; text-align: right;">MRP Each</th>
          <th style="padding: 10px 12px; border: 1px solid #1e3a5f; text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr style="background: #1e3a5f; color: #ffffff;">
          <td colspan="4" style="padding: 12px; border: 1px solid #1e3a5f; text-align: right; font-weight: 700;">Total MRP</td>
          <td style="padding: 12px; border: 1px solid #1e3a5f; text-align: right; font-weight: 700; font-size: 16px;">
            ${formatINR(products.reduce((sum, p) => sum + p.subtotal, 0))}
          </td>
        </tr>
      </tfoot>
    </table>`;
}
