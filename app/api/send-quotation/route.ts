import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

import { z } from "zod";
import { transporter } from "@/lib/mailer";
import { formatQuotationRef, fallbackQuotationRef } from "@/lib/quotation";
import { renderCustomerEmail } from "@/emails/CustomerQuotation";
import { renderOwnerEmail } from "@/emails/OwnerNotification";
import { QuotationData, QuotationProduct, ProductItem } from "@/types";
import productsData from "@/data/products.json";

const ALL_PRODUCTS = productsData as unknown as ProductItem[];

// ── Validation schema ─────────────────────────────────────────────────────

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

// ── Route handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate body
    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }
    const { customerName, companyName, email, city, phone, products } = parsed.data;

    // 2. Look up product prices from the local price list
    const quotationProducts: QuotationProduct[] = [];

    for (const item of products) {
      const product = ALL_PRODUCTS.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }
      quotationProducts.push({
        productId: item.productId,
        productName: product.description,
        quantity: item.quantity,
        mrpEach: product.mrp,
        subtotal: product.mrp * item.quantity,
      });
    }

    // 3. Generate sequential quotation ref via Firestore counter
    //    Falls back to a random 3-digit ref if Firebase is not configured.
    const year = new Date().getFullYear();
    let quotationRef: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let adminDb: any = null;

    try {
      const { getAdminDb } = await import("@/lib/firebaseAdmin");
      adminDb = getAdminDb();
      const counterRef = adminDb.collection("counters").doc("quotations");
      quotationRef = await adminDb.runTransaction(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (tx: any) => {
          const snap = await tx.get(counterRef);
          if (!snap.exists || snap.data().year !== year) {
            tx.set(counterRef, { year, count: 1 });
            return formatQuotationRef(year, 1);
          }
          const next: number = snap.data().count + 1;
          tx.update(counterRef, { count: next });
          return formatQuotationRef(year, next);
        }
      );
    } catch {
      // Firebase not configured or transaction failed — use random fallback
      quotationRef = fallbackQuotationRef();
    }

    // 4. Build quotation data
    const totalMRP = quotationProducts.reduce((sum, p) => sum + p.subtotal, 0);
    const quotationData: QuotationData = {
      ref: quotationRef,
      date: new Date().toISOString(),
      customerName,
      companyName,
      email,
      city,
      phone,
      products: quotationProducts,
      totalMRP,
    };

    // 5. Log to Firestore (reuse adminDb if already initialised)
    if (adminDb) {
      try {
        await adminDb.collection("quotations").add({
          ...quotationData,
          submittedAt: new Date(),
          emailSent: true,
        });
      } catch {
        // Logging failed — continue without it
      }
    }

    // 6. Build and send emails
    const customerHtml = renderCustomerEmail(quotationData);
    const ownerHtml = renderOwnerEmail(quotationData);

    const messageId = `<${quotationRef}@elmech-quotation>`;
    const gmailUser = process.env.GMAIL_USER!;
    const ownerEmail = process.env.OWNER_EMAIL!;

    await transporter.sendMail({
      from: `"Elmech Equipment Company" <${gmailUser}>`,
      to: email,
      subject: `Your Quotation from Elmech Equipment Company [${quotationRef}]`,
      replyTo: gmailUser,
      html: customerHtml,
      headers: { "Message-ID": messageId },
    });

    await transporter.sendMail({
      from: `"Elmech Quotation System" <${gmailUser}>`,
      to: ownerEmail,
      subject: `Quotation Sent to ${companyName} [${quotationRef}]`,
      replyTo: email,
      html: ownerHtml,
      headers: { "In-Reply-To": messageId, References: messageId },
    });

    return NextResponse.json({ success: true, quotationRef }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[send-quotation] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process quotation",
        ...(process.env.NODE_ENV === "development" && { debug: message }),
      },
      { status: 500 }
    );
  }
}
