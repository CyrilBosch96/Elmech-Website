import { QuotationData } from "@/types";
import { buildProductTable, formatINR, formatDate } from "@/lib/quotation";

export function renderOwnerEmail(data: QuotationData): string {
  const { ref, customerName, companyName, email, city, phone, products, totalMRP } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Quotation Sent – ${companyName}</title>
</head>
<body style="margin:0; padding:0; background:#f1f5f9; font-family: Arial, Helvetica, sans-serif; color:#1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">

          <!-- Alert Header -->
          <tr>
            <td style="background:#1e3a5f; padding: 20px 32px;">
              <p style="margin:0; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#fbbf24;">
                🔔 New Quotation Sent
              </p>
              <p style="margin:6px 0 0; font-size:20px; font-weight:800; color:#ffffff;">
                ${companyName}
              </p>
              <p style="margin:2px 0 0; font-size:13px; color:#94a3b8;">
                Ref: ${ref} &nbsp;|&nbsp; ${formatDate()}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px; font-size:14px; color:#475569; line-height:1.6;">
                A quotation has been automatically sent to <strong>${customerName}</strong>
                at <strong>${companyName}</strong>. The customer's details and product
                breakdown are below.
              </p>

              <!-- Reply CTA -->
              <div style="background:#ecfdf5; border:1px solid #6ee7b7; border-radius:8px; padding:14px 18px; margin-bottom:24px;">
                <p style="margin:0; font-size:13px; font-weight:700; color:#065f46;">
                  ✅ To reply to the customer, simply reply to this email
                </p>
                <p style="margin:4px 0 0; font-size:12px; color:#047857;">
                  Your reply will go directly to ${customerName} (${email})
                  and thread correctly in both inboxes.
                </p>
              </div>

              <!-- Customer Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:24px;">
                <tr><td style="padding:16px 20px;">
                  <p style="margin:0 0 10px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#94a3b8;">
                    Customer Details
                  </p>
                  <table width="100%" cellpadding="4" cellspacing="0" style="font-size:13px; color:#334155;">
                    <tr><td style="font-weight:600; width:120px; color:#64748b;">Name</td><td>${customerName}</td></tr>
                    <tr><td style="font-weight:600; color:#64748b;">Company</td><td>${companyName}</td></tr>
                    <tr><td style="font-weight:600; color:#64748b;">Email</td><td><a href="mailto:${email}" style="color:#1e3a5f;">${email}</a></td></tr>
                    <tr><td style="font-weight:600; color:#64748b;">Phone</td><td><a href="tel:${phone}" style="color:#1e3a5f;">${phone}</a></td></tr>
                    <tr><td style="font-weight:600; color:#64748b; vertical-align:top;">City/Address</td><td>${city}</td></tr>
                  </table>
                </td></tr>
              </table>

              <!-- Product Table -->
              <p style="margin:0 0 8px; font-size:13px; font-weight:700; color:#1e3a5f; text-transform:uppercase; letter-spacing:0.5px;">
                Quotation Breakdown
              </p>
              ${buildProductTable(products)}

              <!-- Total summary box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px; background:#1e3a5f; border-radius:8px;">
                <tr><td style="padding:16px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px; color:#94a3b8;">Total MRP Quoted</td>
                      <td align="right" style="font-size:22px; font-weight:800; color:#fbbf24;">
                        ${formatINR(totalMRP)}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="font-size:11px; color:#64748b; padding-top:6px;">
                        Indicative MRP. Taxes and final pricing subject to confirmation.
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc; border-top:1px solid #e2e8f0; padding:16px 32px; text-align:center;">
              <p style="margin:0; font-size:11px; color:#94a3b8;">
                This is an automated notification from the Elmech Equipment Company website.
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
