import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Products from "@/components/landing/Products";
import IndefSection from "@/components/landing/IndefSection";
import WhyTrust from "@/components/landing/WhyTrust";
import Industries from "@/components/landing/Industries";
import Leadership from "@/components/landing/Leadership";
import Advantage from "@/components/landing/Advantage";
import ContactCTA from "@/components/landing/ContactCTA";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Elmech Equipment Company",
  description:
    "Authorized Indef distributor and certified service center supplying material handling equipment, hoists, crane components, and lifting solutions to industrial customers since 1992.",
  url: "https://elmech-equipment.vercel.app",
  email: "elmechin@gmail.com",
  telephone: "+91XXXXXXXXXX",
  foundingDate: "1992",
  areaServed: "India",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Material Handling Equipment",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Electric Chain Hoists" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Wire Rope Hoists" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Chain Pulley Blocks" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Crane Components" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Radio Remote Controls" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Safety Equipment" } },
    ],
  },
  sameAs: [],
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />
      <About />
      <Products />
      <IndefSection />
      <WhyTrust />
      <Industries />
      <Leadership />
      <Advantage />
      <ContactCTA />
    </>
  );
}
