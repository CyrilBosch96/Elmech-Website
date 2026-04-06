import type { Metadata } from "next";
import EnquiryForm from "@/components/enquiry/EnquiryForm";

export const metadata: Metadata = {
  title: "Request a Quotation",
  description:
    "Fill our quick enquiry form to receive a detailed product quotation from Elmech Equipment Company — delivered directly to your email inbox.",
  alternates: {
    canonical: "https://elmech-equipment.vercel.app/enquiry",
  },
  robots: { index: true, follow: true },
};

export default function EnquiryPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="text-center mb-12">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Get in Touch
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-4">
            Request a Quotation
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
            Fill in the details below. We will prepare a detailed product quotation
            based on your requirements and email it directly to you.
          </p>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-6"></div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            "✅ Authorized Indef Distributor",
            "⚡ Fast Response",
            "💰 Competitive MRP Pricing",
          ].map((badge) => (
            <span
              key={badge}
              className="bg-white border border-slate-200 text-slate-600 text-xs font-medium px-4 py-2 rounded-full shadow-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        <EnquiryForm />

        {/* Alternative contact */}
        <div className="mt-10 text-center text-sm text-slate-500">
          Prefer to contact us directly?{" "}
          <a
            href="mailto:elmechin@gmail.com"
            className="text-[#1e3a5f] font-semibold hover:text-amber-600 transition-colors"
          >
            elmechin@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
