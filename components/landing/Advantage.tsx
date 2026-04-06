const advantages = [
  {
    title: "Genuine Equipment",
    description:
      "Every product is sourced directly as an authorized Indef distributor — no counterfeits, no compromise.",
  },
  {
    title: "Technical Guidance",
    description:
      "Our team provides expert advice to help you select the right equipment for your specific application.",
  },
  {
    title: "Fast Supply",
    description:
      "Efficient order processing and delivery to minimize disruption to your operations.",
  },
  {
    title: "Reliable Servicing",
    description:
      "Certified service through the Indef Clinic keeps your equipment running safely and on schedule.",
  },
  {
    title: "Long-Term Support",
    description:
      "Spare parts availability and servicing throughout the product lifecycle — we don't disappear after the sale.",
  },
];

export default function Advantage() {
  return (
    <section className="py-20 bg-[#1e3a5f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          {/* Left */}
          <div>
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">
              The Elmech Advantage
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
              Practical Solutions That Keep
              <span className="block text-amber-400">Operations Running</span>
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Industrial buyers choose Elmech because we provide the equipment,
              expertise, and ongoing support that keeps material handling systems
              operating safely and efficiently — year after year.
            </p>
          </div>

          {/* Right – advantage list */}
          <div className="space-y-5">
            {advantages.map((adv, i) => (
              <div key={adv.title} className="flex gap-4 items-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-[#1e3a5f] text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{adv.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {adv.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
