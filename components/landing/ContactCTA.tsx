import Link from "next/link";

export default function ContactCTA() {
  return (
    <section id="contact" className="py-20 bg-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-[#1e3a5f]/80 text-lg max-w-2xl mx-auto mb-8 font-medium">
          Fill out our quick enquiry form and we will prepare a detailed product
          quotation for you — delivered directly to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/enquiry"
            className="inline-block bg-[#1e3a5f] hover:bg-[#152b47] text-white font-bold px-10 py-4 rounded text-base transition-colors"
          >
            Request a Quotation
          </Link>
          <a
            href="mailto:elmechin@gmail.com"
            className="inline-block bg-white hover:bg-slate-50 text-[#1e3a5f] font-bold px-10 py-4 rounded text-base transition-colors border border-[#1e3a5f]/20"
          >
            Email Us Directly
          </a>
        </div>
      </div>
    </section>
  );
}
