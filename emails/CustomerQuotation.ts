import { QuotationData } from "@/types";
import { buildProductTable, formatINR, formatDate } from "@/lib/quotation";

export function renderCustomerEmail(data: QuotationData): string {
  const { ref, customerName, companyName, email, city, phone, products, totalMRP } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Quotation – Elmech Equipment Company</title>
</head>
<body style="margin:0; padding:0; background:#f1f5f9; font-family: Arial, Helvetica, sans-serif; color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#1e3a5f; padding: 28px 32px;">
              <p style="margin:0; font-size:22px; font-weight:800; color:#ffffff; letter-spacing:-0.5px;">
                Elmech Equipment Company
              </p>
              <p style="margin:4px 0 0; font-size:13px; color:#fbbf24; font-weight:600;">
                Material Handling Equipment Specialists Since 1992
              </p>
            </td>
          </tr>

          <!-- Quotation badge -->
          <tr>
            <td style="background:#fef3c7; padding: 14px 32px; border-bottom: 2px solid #f59e0b;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0; font-size:13px; color:#92400e; font-weight:700; text-transform:uppercase; letter-spacing:1px;">
                      Quotation
                    </p>
                    <p style="margin:2px 0 0; font-size:18px; font-weight:800; color:#1e3a5f; font-family: monospace;">
                      ${ref}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0; font-size:12px; color:#78350f;">Date</p>
                    <p style="margin:2px 0 0; font-size:13px; font-weight:700; color:#1e293b;">
                      ${formatDate()}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 28px 32px;">
              <p style="margin:0 0 20px; font-size:15px; color:#334155;">
                Dear <strong>${customerName}</strong>,
              </p>
              <p style="margin:0 0 20px; font-size:14px; color:#475569; line-height:1.6;">
                Thank you for your enquiry. Please find below the indicative quotation
                based on the products you requested. Our team will reach out shortly
                to discuss your requirements further.
              </p>

              <!-- Customer Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:24px;">
                <tr><td style="padding:16px 20px;">
                  <p style="margin:0 0 8px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#94a3b8;">
                    Bill To
                  </p>
                  <p style="margin:0; font-size:15px; font-weight:700; color:#1e293b;">${companyName}</p>
                  <p style="margin:2px 0; font-size:13px; color:#475569;">${customerName}</p>
                  <p style="margin:2px 0; font-size:13px; color:#475569;">${city}</p>
                  <p style="margin:2px 0; font-size:13px; color:#475569;">${phone}</p>
                  <p style="margin:2px 0; font-size:13px; color:#475569;">${email}</p>
                </td></tr>
              </table>

              <!-- Product Table -->
              <p style="margin:0 0 8px; font-size:13px; font-weight:700; color:#1e3a5f; text-transform:uppercase; letter-spacing:0.5px;">
                Product Quotation
              </p>
              ${buildProductTable(products)}

              <!-- Notes -->
              <div style="margin-top:24px; background:#fef3c7; border-left:4px solid #f59e0b; padding:14px 18px; border-radius:4px;">
                <p style="margin:0; font-size:12px; font-weight:700; color:#92400e;">Important Note</p>
                <p style="margin:6px 0 0; font-size:12px; color:#78350f; line-height:1.5;">
                  This is an indicative quotation based on current MRP. Final pricing,
                  delivery timelines, and terms are subject to confirmation by our team.
                  GST and taxes as applicable. Validity: 30 days from the date of this quotation.
                </p>
              </div>

              <!-- CTA -->
              <div style="margin-top:28px; text-align:center;">
                <p style="margin:0 0 12px; font-size:14px; color:#475569;">
                  To proceed with this order or for any queries, simply
                  <strong>reply to this email</strong> and our team will assist you.
                </p>
                <a href="mailto:elmechin@gmail.com"
                   style="display:inline-block; background:#1e3a5f; color:#ffffff; font-weight:700; font-size:14px; padding:12px 28px; border-radius:6px; text-decoration:none;">
                  Reply to Enquiry →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 32px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#64748b; font-weight:700;">
                Elmech Equipment Company
              </p>
              <p style="margin:4px 0; font-size:11px; color:#94a3b8;">
                Authorized Indef Distributor | Indef Certified Service Center
              </p>
              <p style="margin:4px 0; font-size:11px; color:#94a3b8;">
                📧 elmechin@gmail.com | [Phone – To Be Updated] | [Address – To Be Updated]
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
