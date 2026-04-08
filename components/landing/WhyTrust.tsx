import Link from "next/link";

const reasons = [
  {
    number: "01",
    title: "Authorized. Not just available.",
    description:
      "We are the factory-authorized Indef distributor for Coimbatore. Every product carries full manufacturer backing and warranty.",
  },
  {
    number: "02",
    title: "Zero counterfeit risk.",
    description:
      "Counterfeit lifting equipment is a real problem in India. With Elmech, every hoist, part, and component is sourced direct. No exceptions.",
  },
  {
    number: "03",
    title: "Service that outlasts the sale.",
    description:
      "Our Indef Clinic certification means your equipment gets maintained to manufacturer standards — not just whoever showed up with a spanner.",
  },
  {
    number: "04",
    title: "30 years of local trust.",
    description:
      "We know Coimbatore's industries. We know their equipment. We've maintained relationships — not just transactions — since 1992.",
  },
  {
    number: "05",
    title: "Right specification, first time.",
    description:
      "Undersized or oversized hoists fail prematurely. Our technical team specifies the right equipment for your load, duty cycle, and environment.",
  },
  {
    number: "06",
    title: "Spares. Always in stock.",
    description:
      "A hoist without available spares is a liability. Elmech maintains genuine Indef spare parts availability throughout the equipment lifecycle.",
  },
];

export default function WhyTrust() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Why Choose Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-4">
            Why plant managers across Tamil Nadu choose Elmech.
          </h2>
          <div className="w-12 h-0.5 bg-amber-500 mb-4"></div>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Any dealer can sell you a hoist. Very few can guarantee what happens after —
            when the equipment is under load, every shift, for years.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden">
          {reasons.map((reason) => (
            <div
              key={reason.number}
              className="flex gap-4 p-6 bg-white hover:bg-amber-50/40 transition-colors"
            >
              <span className="shrink-0 text-3xl font-extrabold text-slate-100 leading-none select-none w-10">
                {reason.number}
              </span>
              <div>
                <h3 className="font-bold text-[#1e3a5f] mb-1.5">{reason.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-10 bg-slate-50 border border-slate-200 rounded-xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-[#1e3a5f] text-base">
            Ready to specify the right equipment for your facility?
          </p>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/enquiry"
              className="bg-amber-500 hover:bg-amber-400 text-[#1e3a5f] font-bold text-sm px-6 py-3 rounded transition-colors whitespace-nowrap"
            >
              Request a Quotation
            </Link>
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-slate-300 hover:border-[#25D366] text-slate-600 hover:text-[#25D366] font-semibold text-sm px-6 py-3 rounded transition-colors whitespace-nowrap"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
