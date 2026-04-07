import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HoistDemo from "@/components/landing/HoistDemo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Elmech Equipment Company | Material Handling Equipment Specialists Since 1992",
    template: "%s | Elmech Equipment Company",
  },
  description:
    "Elmech Equipment Company – Authorized Indef distributor and certified service center. Supplying hoists, crane components, lifting equipment, and safety systems to industrial clients since 1992.",
  keywords: [
    "material handling equipment",
    "electric chain hoist",
    "wire rope hoist",
    "chain pulley block",
    "crane components",
    "Indef authorized distributor",
    "lifting equipment supplier India",
    "brake drums",
    "thruster brakes",
    "radio remote controls pendant switches",
    "industrial safety equipment",
    "Indef clinic service center",
  ],
  metadataBase: new URL("https://elmechequipment.com"),
  authors: [{ name: "Elmech Equipment Company" }],
  creator: "Elmech Equipment Company",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://elmechequipment.com",
    siteName: "Elmech Equipment Company",
    title:
      "Elmech Equipment Company | Material Handling Equipment Specialists",
    description:
      "Authorized Indef distributor supplying hoists, crane components, and lifting equipment to industrial customers since 1992.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Elmech Equipment Company – Material Handling Equipment Specialists",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elmech Equipment Company | Material Handling Equipment",
    description:
      "Authorized Indef distributor. Hoists, crane components, lifting equipment. Serving industry since 1992.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://elmechequipment.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <HoistDemo />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
