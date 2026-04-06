# Elmech Equipment Company – Setup Guide

Complete step-by-step setup from zero to live website.

---

## Step 1 – Gmail App Password (for sending emails)

The website sends emails FROM `elmechin@gmail.com` using Nodemailer.
Gmail requires an **App Password** instead of your regular password.

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left sidebar
3. Under "How you sign in to Google", ensure **2-Step Verification is ON**
   (If not, enable it first)
4. Search for **"App passwords"** in the search bar at the top
5. Click **App passwords**
6. Under "App name", type: `Elmech Website`
7. Click **Create**
8. Google will show you a **16-character password** like: `abcd efgh ijkl mnop`
9. Copy this password — you'll use it in the `.env.local` file

---

## Step 2 – Firebase Setup

### 2a. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → Name it `elmech-equipment`
3. Disable Google Analytics (not needed) → **Create project**

### 2b. Create Firestore Database

1. In the left sidebar, click **Firestore Database**
2. Click **Create database**
3. Choose **Production mode**
4. Select your preferred region (e.g., `asia-south1` for India)
5. Click **Enable**

### 2c. Set Firestore Security Rules

1. Click the **Rules** tab in Firestore
2. Replace the content with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{id} {
      allow read: if true;
      allow write: if false;
    }
    match /quotations/{id} {
      allow read, write: if false;
    }
  }
}
```
3. Click **Publish**

### 2d. Get Client SDK keys

1. Go to **Project Settings** (gear icon at the top left)
2. Scroll to **"Your apps"** → Click **Web** (`</>`)
3. Register app as `elmech-website`
4. Copy the `firebaseConfig` values into your `.env.local`

### 2e. Get Admin SDK keys (for server-side)

1. In **Project Settings**, click the **Service accounts** tab
2. Click **Generate new private key**
3. Download the JSON file
4. Copy these values into `.env.local`:
   - `FIREBASE_ADMIN_PROJECT_ID` = `project_id` from the JSON
   - `FIREBASE_ADMIN_CLIENT_EMAIL` = `client_email` from the JSON
   - `FIREBASE_ADMIN_PRIVATE_KEY` = `private_key` from the JSON
     (keep the quotes and `\n` characters as-is)

### 2f. Add Products to Firestore

1. In Firestore, click **Start collection**
2. Collection ID: `products`
3. For each product, create a document with these fields:

| Field | Type | Example Value |
|---|---|---|
| name | string | Chain Pulley Block |
| category | string | Lifting Equipment |
| mrp | number | 4500 |
| unit | string | per piece |
| active | boolean | true |

> **Tip:** Use the **Auto-ID** button for document IDs.

Once you provide your price list, enter each product with its MRP here.

---

## Step 3 – Create .env.local

In the project folder (`elmech-website/`), create a file called `.env.local`:

```bash
cp .env.local.example .env.local
```

Then fill in all the values from Steps 1 and 2.

---

## Step 4 – Test Locally

```bash
cd elmech-website
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Test the full quotation flow:
1. Go to `/enquiry`
2. Fill in the form
3. Submit
4. Check both email inboxes (customer email + cyrilluvsmusic@gmail.com)

---

## Step 5 – Deploy to Vercel

### 5a. Push to GitHub

```bash
git init
git add .
git commit -m "Initial Elmech website"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/elmech-website.git
git push -u origin main
```

### 5b. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import your `elmech-website` repository
4. In **Environment Variables**, add ALL the variables from `.env.local`
   (paste each key-value pair)
5. Click **Deploy**
6. Your site will be live at `elmech-equipment.vercel.app` (or similar)

---

## Step 6 – Update URLs when you get a domain

Once you have a custom domain (e.g., `elmechequipment.com`):

1. Replace `https://elmech-equipment.vercel.app` with your domain in:
   - `app/layout.tsx` → `metadata.openGraph.url` and `metadata.alternates.canonical`
   - `app/sitemap.ts` → `BASE_URL`
   - `app/robots.ts` → `sitemap` URL
   - `app/page.tsx` → `jsonLd.url`

2. In Vercel → Settings → Domains → Add your custom domain

---

## Step 7 – Submit to Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your site URL (or domain)
3. Verify via Vercel (DNS TXT record) or HTML file method
4. Submit your sitemap: `https://your-url/sitemap.xml`

---

## Updating the Price List

To update product prices later:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Open your project → Firestore Database
3. Find the `products` collection
4. Click a product → Edit the `mrp` field
5. Click Update

No code changes or redeployment needed.

---

## Adding / Updating Contact Details

Currently the phone and address are placeholders. Once you have them:

1. Open `components/layout/Footer.tsx` and `components/landing/ContactCTA.tsx`
2. Update the phone, address, and map link fields
3. Commit and push — Vercel redeploys automatically

---

## What Happens When a Quotation is Submitted

```
User fills form → Validates locally → POST /api/send-quotation
  ↓
Firebase: fetch MRP for each selected product
  ↓
Calculate subtotals + total MRP
  ↓
Log to Firestore /quotations collection
  ↓
Send Email A → customer's inbox (from elmechin@gmail.com)
  ↓
Send Email B → cyrilluvsmusic@gmail.com
    (Reply-To = customer email, so your replies go directly to them)
  ↓
Return quotation reference to browser → show success message
```
