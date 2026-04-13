import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

import { z } from "zod";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { fallbackQuotationRef, formatDate, formatINR } from "@/lib/quotation";
import { QuotationProduct, ProductItem } from "@/types";
import productsData from "@/data/products.json";

const ALL_PRODUCTS = productsData as unknown as ProductItem[];

const bodySchema = z.object({
  customerName: z.string().min(2),
  companyName: z.string().min(2),
  email: z.string().email(),
  city: z.string().min(2),
  phone: z.string().min(7),
  products: z
    .array(z.object({ productId: z.string().min(1), quantity: z.coerce.number().int().min(1) }))
    .min(1),
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid request data" }, { status: 400 });
    }
    const { customerName, companyName, email, city, phone, products } = parsed.data;

    const quotationProducts: QuotationProduct[] = [];
    for (const item of products) {
      const product = ALL_PRODUCTS.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ success: false, error: `Product not found: ${item.productId}` }, { status: 400 });
      }
      quotationProducts.push({
        productId: item.productId,
        productName: product.product_name,
        capacityTonnes: product.capacity_tonnes,
        liftHeightMetres: product.lift_height_metres,
        suspensionType: product.suspension_type,
        indefCode: product.indef_code,
        quantity: item.quantity,
        mrpEach: product.mrp_inr,
        subtotal: product.mrp_inr * item.quantity,
      });
    }

    const quotationRef = fallbackQuotationRef();
    const totalMRP = quotationProducts.reduce((sum, p) => sum + p.subtotal, 0);

    // ── Load header image ─────────────────────────────────────────────────────
    const headerImagePath = path.join(process.cwd(), "public", "letterhead-header.jpeg");
    const headerImageBuffer = fs.readFileSync(headerImagePath);

    // ── Build PDF ─────────────────────────────────────────────────────────────
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const chunks: Buffer[] = [];
      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageW = doc.page.width;
      const marginL = 40;
      const marginR = 40;
      const contentW = pageW - marginL - marginR;

      // ── GSTIN + Contact line ────────────────────────────────────────────
      doc.font("Helvetica").fontSize(7.5).fillColor("#000000");
      doc.text("GSTIN No. 33AAAFE5063D1Z0", marginL, 36);
      doc.text(
        "Ph : 0422 \u2013 2380075   Cell : 98429 - 04848, 98658 26661   E-mail : elmechin@gmail.com",
        marginL, 36, { align: "right", width: contentW }
      );

      // ── Header image (letterhead banner) ────────────────────────────────
      const imgY = 47;
      const imgH = contentW * (369 / 1520);
      doc.image(headerImageBuffer, marginL, imgY, { width: contentW, height: imgH });

      // ── Address bar ─────────────────────────────────────────────────────
      const addrY = imgY + imgH + 4;
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#000000");
      doc.text(
        "Shop No.9, Corporation Shopping Complex, Avanashi Road, Upplipalayam, Coimbatore - 641 018.",
        marginL, addrY, { align: "center", width: contentW }
      );

      // ── Divider ──────────────────────────────────────────────────────────
      const divY = addrY + 14;
      doc.moveTo(marginL, divY).lineTo(marginL + contentW, divY).lineWidth(1).strokeColor("#000000").stroke();

      // ── QUOTATION title ──────────────────────────────────────────────────
      let y = divY + 14;
      doc.font("Helvetica-Bold").fontSize(13).fillColor("#000000");
      doc.text("QUOTATION", marginL, y, { align: "center", width: contentW, underline: true });

      // ── REF + Date ───────────────────────────────────────────────────────
      y += 26;
      doc.font("Helvetica-Bold").fontSize(10);
      doc.text(`REF: EEC/QTN/${quotationRef}`, marginL, y);
      doc.text(`Date: ${formatDate()}`, marginL, y, { align: "right", width: contentW });

      // ── Customer block ───────────────────────────────────────────────────
      y += 20;
      doc.font("Helvetica-Bold").fontSize(10);
      doc.text(customerName.toUpperCase(), marginL, y);
      y += 13;
      doc.text(companyName.toUpperCase(), marginL, y);
      y += 13;
      doc.font("Helvetica").fontSize(10);
      doc.text(city, marginL, y);
      y += 13;
      doc.text(phone, marginL, y);
      y += 13;
      doc.text(email, marginL, y);

      // ── Subject line ─────────────────────────────────────────────────────
      y += 20;
      const productNames = quotationProducts
        .map((p) => p.productName)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(", ");
      doc.font("Helvetica-Bold").fontSize(10);
      doc.text(
        `SUB: SUPPLY OF \u201cINDEF\u201d ${productNames.toUpperCase()}`,
        marginL, y, { align: "center", width: contentW }
      );

      // ── Salutation + body ─────────────────────────────────────────────────
      y += 22;
      doc.font("Helvetica").fontSize(10);
      doc.text("Dear Sir,", marginL, y);
      y += 16;
      doc.text(
        "We thankfully acknowledge the receipt of your enquiry and are pleased to introduce ourselves as leading Authorised Business Partner for \u201cINDEF\u201d Material Handling Equipments (scanned copy of Dealership Certificate attached) and have pleasure in submitting our offer subject to the below mentioned terms and conditions:",
        marginL, y, { width: contentW, lineGap: 2 }
      );

      // ── Product table ─────────────────────────────────────────────────────
      y += 62;
      const col = { sl: marginL, desc: marginL + 36, qty: marginL + 360, price: marginL + 410 };
      const colW = { sl: 36, desc: 324, qty: 50, price: contentW - 370 };
      const rowH = 30;

      // Header row
      doc.font("Helvetica-Bold").fontSize(9.5);
      doc.rect(col.sl, y, contentW, rowH).stroke();
      doc.moveTo(col.desc,  y).lineTo(col.desc,  y + rowH).stroke();
      doc.moveTo(col.qty,   y).lineTo(col.qty,   y + rowH).stroke();
      doc.moveTo(col.price, y).lineTo(col.price, y + rowH).stroke();
      doc.text("Sl.No",            col.sl    + 4, y + 9, { width: colW.sl   - 8, align: "center" });
      doc.text("Item Description", col.desc  + 4, y + 9, { width: colW.desc - 8, align: "center" });
      doc.text("Qty",              col.qty   + 2, y + 9, { width: colW.qty  - 4, align: "center" });
      doc.text("Price",            col.price + 2, y + 9, { width: colW.price - 4, align: "center" });
      y += rowH;

      // Data rows
      doc.font("Helvetica").fontSize(9.5);
      quotationProducts.forEach((p, i) => {
        const desc = [
          p.productName,
          p.capacityTonnes    ? `${p.capacityTonnes} Tonne Capacity` : null,
          p.liftHeightMetres  ? `${p.liftHeightMetres} Mtrs Lift`    : null,
          p.suspensionType    ? p.suspensionType                      : null,
          p.indefCode         ? `[${p.indefCode}]`                   : null,
        ].filter(Boolean).join(", ");

        const descLines = Math.ceil(doc.widthOfString(desc) / (colW.desc - 8)) + 1;
        const rH = Math.max(rowH, descLines * 13 + 8);

        doc.rect(col.sl, y, contentW, rH).stroke();
        doc.moveTo(col.desc,  y).lineTo(col.desc,  y + rH).stroke();
        doc.moveTo(col.qty,   y).lineTo(col.qty,   y + rH).stroke();
        doc.moveTo(col.price, y).lineTo(col.price, y + rH).stroke();

        doc.text(String(i + 1) + ".",         col.sl    + 4, y + 8, { width: colW.sl   - 8 });
        doc.text(desc,                         col.desc  + 4, y + 8, { width: colW.desc - 8 });
        doc.text(`${p.quantity} No`,           col.qty   + 2, y + 8, { width: colW.qty  - 4, align: "center" });
        doc.text(`${formatINR(p.mrpEach)}/- Each`, col.price + 2, y + 8, { width: colW.price - 4 });
        y += rH;
      });

      // Total row
      doc.font("Helvetica-Bold").fontSize(9.5);
      doc.rect(col.sl, y, contentW, 24).stroke();
      doc.moveTo(col.price, y).lineTo(col.price, y + 24).stroke();
      doc.text("Total MRP (excl. GST)", col.sl + 4, y + 7, { width: colW.sl + colW.desc + colW.qty - 8, align: "right" });
      doc.text(`${formatINR(totalMRP)}/-`, col.price + 2, y + 7, { width: colW.price - 4 });
      y += 24 + 16;

      // ── Terms & Conditions ────────────────────────────────────────────────
      doc.font("Helvetica-Bold").fontSize(10);
      doc.text("TERMS & CONDITIONS:", marginL, y, { underline: true });
      y += 16;

      const terms: [string, string][] = [
        ["Prices",   "GST @18% be extra."],
        ["F.O.R",    "Ex \u2013 our Godown, Coimbatore."],
        ["Delivery", "Ready Stock Subject to Prior Sales."],
        ["Payment",  "100% against Proforma Invoice"],
        ["Validity", "30 days from today."],
      ];
      doc.font("Helvetica").fontSize(10);
      const termLabelX = marginL + 8;
      const termColon  = marginL + 115;
      const termValueX = termColon + 14;
      terms.forEach(([label, value]) => {
        doc.text(label, termLabelX, y, { width: 100 });
        doc.text(":", termColon, y);
        doc.text(value, termValueX, y, { width: contentW - termValueX + marginL });
        y += 15;
      });

      // ── Closing ───────────────────────────────────────────────────────────
      y += 8;
      doc.text(
        "We trust you will find our offer more suitable and look forward to receive your valued orders at an early date, which will receive our prompt attention.",
        marginL, y, { width: contentW, lineGap: 2 }
      );
      y += 36;
      doc.text("Thanking you once again,", marginL, y);
      y += 18;
      doc.text("Yours faithfully,", marginL, y);
      y += 13;
      doc.font("Helvetica-Bold").text("for ELMECH EQUIPMENT COMPANY", marginL, y);
      y += 36;
      doc.font("Helvetica-Bold").fontSize(10).text("T. RATHINAKUMAR", marginL, y);
      y += 13;
      doc.font("Helvetica").text("H/P: 9865826661", marginL, y);

      doc.end();
    });

    const filename = `quotation-${quotationRef}.pdf`;
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[download-quotation] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate quotation", ...(process.env.NODE_ENV === "development" && { debug: message }) },
      { status: 500 }
    );
  }
}
