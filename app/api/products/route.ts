import { NextRequest, NextResponse } from "next/server";
import rawProducts from "@/data/products.json";
import { ProductItem } from "@/types";

export const runtime = "nodejs";

const ALL = rawProducts as ProductItem[];

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)].filter((v) => v !== null && v !== undefined) as T[];
}

function filtered(params: {
  category?: string;
  series?: string;
  capacity?: string;
  suspension?: string;
  trolleyRange?: string;
  speedType?: string;
}): ProductItem[] {
  let list = ALL;
  if (params.category)    list = list.filter((p) => p.category === params.category);
  if (params.series)      list = list.filter((p) => p.series === params.series);
  if (params.capacity)    list = list.filter((p) => String(p.capacity_tonnes) === params.capacity);
  if (params.suspension)  list = list.filter((p) => p.suspension_type === params.suspension);
  if (params.trolleyRange) list = list.filter((p) => p.trolley_range === params.trolleyRange);
  if (params.speedType)   list = list.filter((p) => p.speed_type === params.speedType);
  return list;
}

export async function GET(req: NextRequest) {
  const sp = new URL(req.url).searchParams;

  // Step 1 — categories
  if (sp.get("categories") === "true") {
    return NextResponse.json(unique(ALL.map((p) => p.category)).sort());
  }

  const category   = sp.get("category")    ?? undefined;
  const series     = sp.get("series")      ?? undefined;
  const capacity   = sp.get("capacity")    ?? undefined;
  const suspension = sp.get("suspension")  ?? undefined;
  const trolleyRange = sp.get("trolleyRange") ?? undefined;

  // Step 2 — series for a category
  if (sp.get("series") === "true") {
    const list = filtered({ category });
    return NextResponse.json(unique(list.map((p) => p.series)).sort());
  }

  // Step 3 — capacities for category + series
  if (sp.get("capacities") === "true") {
    const list = filtered({ category, series });
    const caps = unique(list.map((p) => p.capacity_tonnes))
      .sort((a, b) => (a ?? 0) - (b ?? 0));
    return NextResponse.json(caps);
  }

  // Step 4 — suspension types for category + series + capacity
  if (sp.get("suspensions") === "true") {
    const list = filtered({ category, series, capacity });
    return NextResponse.json(unique(list.map((p) => p.suspension_type)).sort());
  }

  // Step 4b — trolley ranges (only relevant when suspension is a trolley type)
  if (sp.get("trolleyRanges") === "true") {
    const list = filtered({ category, series, capacity, suspension });
    const ranges = unique(list.map((p) => p.trolley_range)).sort();
    return NextResponse.json(ranges);
  }

  // Step 5 — lift heights
  if (sp.get("lifts") === "true") {
    const list = filtered({ category, series, capacity, suspension, trolleyRange });
    const lifts = unique(list.map((p) => p.lift_height_metres))
      .sort((a, b) => (a ?? 0) - (b ?? 0));
    return NextResponse.json(lifts);
  }

  // Step 5b — speed types (HC series only)
  if (sp.get("speedTypes") === "true") {
    const lift = sp.get("lift") ?? undefined;
    let list = filtered({ category, series, capacity, suspension, trolleyRange });
    if (lift) list = list.filter((p) => String(p.lift_height_metres) === lift);
    const speeds = unique(list.map((p) => p.speed_type)).filter(Boolean).sort() as string[];
    return NextResponse.json(speeds);
  }

  // Step 6 — resolve single product by full spec
  if (sp.get("resolve") === "true") {
    const lift = sp.get("lift") ?? undefined;
    const speedType = sp.get("speedType") ?? undefined;
    let list = filtered({ category, series, capacity, suspension, trolleyRange, speedType });
    if (lift) list = list.filter((p) => String(p.lift_height_metres) === lift);
    if (list.length === 1) {
      const p = list[0];
      return NextResponse.json({
        id: p.id,
        product_name: p.product_name,
        series: p.series,
        capacity_tonnes: p.capacity_tonnes,
        lift_height_metres: p.lift_height_metres,
        suspension_type: p.suspension_type,
        trolley_range: p.trolley_range,
        duty_class: p.duty_class,
        speed_type: p.speed_type,
        indef_code: p.indef_code,
        notes: p.notes,
      });
    }
    // Multiple variants share the same spec — return them for the user to choose
    if (list.length > 1) {
      return NextResponse.json({
        variants: list.map((p) => ({
          id: p.id,
          product_name: p.product_name,
          notes: p.notes,
        })),
      });
    }
    return NextResponse.json(null);
  }

  return NextResponse.json({ error: "Invalid query" }, { status: 400 });
}
