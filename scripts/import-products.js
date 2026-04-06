/**
 * Elmech Equipment Company – Indef Price List Importer
 *
 * Reads INDEF_PriceList.csv and batch-uploads all products to Firebase Firestore.
 *
 * Run ONCE after Firebase is configured:
 *   node scripts/import-products.js
 *
 * Requires .env.local to be set up with Firebase Admin credentials.
 */

require("dotenv").config({ path: ".env.local" });

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ── Firebase Admin init ─────────────────────────────────────────────────────

const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
if (
  !process.env.FIREBASE_ADMIN_PROJECT_ID ||
  !process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
  !privateKey
) {
  console.error(
    "❌  Missing Firebase Admin credentials in .env.local.\n" +
      "    Please set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL,\n" +
      "    and FIREBASE_ADMIN_PRIVATE_KEY before running this script."
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

// ── CSV parser (handles quoted fields containing commas) ────────────────────

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// ── Category derivation ─────────────────────────────────────────────────────

function deriveCategory(section, description) {
  if (!section) {
    const d = description.toUpperCase();
    if (d.includes("CHAIN PULLEY") || d.includes("CPB")) return "Chain Pulley Blocks";
    if (d.includes("HOIST")) return "Hoists";
    if (d.includes("TROLLEY")) return "Trolleys";
    if (d.includes("BRAKE")) return "Brake Components";
    if (d.includes("LIMIT SWITCH")) return "Limit Switches";
    if (d.includes("REMOTE") || d.includes("PENDANT")) return "Control Systems";
    if (d.includes("BUFFER")) return "Spare Parts";
    return "General";
  }

  const s = section.toUpperCase();
  if (s.includes("CHAIN PULLEY")) return "Chain Pulley Blocks";
  if (s.includes("WIRE ROPE") || s.includes("WRH") || s.includes("SMD")) return "Wire Rope Hoists";
  if (s.includes("ELECTRIC") || s.includes("GLACIER") || s.includes("HOIST")) return "Electric Chain Hoists";
  if (s.includes("TROLLEY")) return "Trolleys";
  if (s.includes("SAFETY")) return "Safety Equipment";
  if (s.includes("VFD")) return "VFD Charges";
  if (s.includes("CHAIN")) return "Chain & Accessories";
  return "General";
}

// ── Main import ─────────────────────────────────────────────────────────────

async function importProducts() {
  const csvPath = path.resolve("/Users/cyrilbosch/Desktop/INDEF_PriceList.csv");

  if (!fs.existsSync(csvPath)) {
    console.error(`❌  CSV file not found at: ${csvPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);

  // Skip header row
  const dataLines = lines.slice(1);

  const products = [];
  let skipped = 0;

  for (const line of dataLines) {
    const parts = parseCSVLine(line);
    if (parts.length < 5) { skipped++; continue; }

    const [section, description, capacity, code, mrpStr, lift] = parts;

    const desc = description?.trim();
    const mrp = parseFloat(mrpStr?.trim());

    if (!desc || isNaN(mrp) || mrp <= 0) { skipped++; continue; }

    // Build a clear display name
    const capTrimmed = capacity?.trim();
    const name = capTrimmed ? `${desc} (${capTrimmed})` : desc;

    products.push({
      name,
      description: desc,
      section: section?.trim() || "",
      category: deriveCategory(section?.trim() || "", desc),
      code: code?.trim() || "",
      capacity: capTrimmed || "",
      mrp,
      lift: lift?.trim() || "",
      unit: "per piece",
      active: true,
    });
  }

  console.log(`\n📋  Parsed ${products.length} products (${skipped} rows skipped)\n`);

  if (products.length === 0) {
    console.log("Nothing to import.");
    process.exit(0);
  }

  // Batch upload – Firestore max 500 writes per batch
  const BATCH_SIZE = 499;
  let imported = 0;
  let batchNum = 1;
  const totalBatches = Math.ceil(products.length / BATCH_SIZE);

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const chunk = products.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    for (const product of chunk) {
      // Use product code as doc ID when available; otherwise auto-generate
      const docRef = product.code
        ? db.collection("products").doc(product.code)
        : db.collection("products").doc();

      batch.set(docRef, product);
    }

    await batch.commit();
    imported += chunk.length;
    console.log(`  ✓  Batch ${batchNum}/${totalBatches} — ${imported}/${products.length} products imported`);
    batchNum++;
  }

  console.log(`\n✅  Done! ${imported} products successfully imported to Firestore.\n`);
  console.log("   Next: go to Firebase Console → Firestore → 'products' collection to verify.\n");
  process.exit(0);
}

importProducts().catch((err) => {
  console.error("❌  Import failed:", err.message);
  process.exit(1);
});
