import { NextRequest, NextResponse } from "next/server";
import productsData from "@/data/products.json";

export const runtime = "nodejs";

interface Product {
  id: string;
  description: string;
  groupCategory: string;
  section: string;
  code: string;
  capacity: string;
  mrp: number;
  lift: string;
  unit: string;
  active: boolean;
}

const ALL = (productsData as unknown as Product[]).filter((p) => p.active);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Level 1 — distinct groupCategory names
  if (searchParams.get("groupCategories") === "true") {
    const cats = [...new Set(ALL.map((p) => p.groupCategory))].sort();
    return NextResponse.json(cats);
  }

  const groupCategory = searchParams.get("groupCategory") ?? "";
  const inCat = groupCategory ? ALL.filter((p) => p.groupCategory === groupCategory) : ALL;

  // Level 2 — distinct product descriptions within a groupCategory
  if (searchParams.get("productNames") === "true") {
    const names = [...new Set(inCat.map((p) => p.description))].sort();
    return NextResponse.json(names);
  }

  // Level 3 — variants for a specific description (id + capacity + code + mrp)
  const productName = searchParams.get("productName") ?? "";
  if (productName) {
    const variants = inCat
      .filter((p) => p.description === productName)
      .map(({ id, capacity, code, mrp }) => ({ id, capacity, code, mrp }));
    return NextResponse.json(variants);
  }

  // Fallback — full list
  return NextResponse.json(ALL);
}
