const services = [
  {
    icon: "🏥",
    title: "Indef Clinic — Certified Repair",
    description:
      "Factory-authorized service and repair for all Indef hoists and crane systems. Genuine parts. Manufacturer-aligned procedures. Fast turnaround.",
    tag: "Indef certified center",
  },
  {
    icon: "⚙️",
    title: "Preventive Maintenance",
    description:
      "Scheduled AMC and inspection programs that catch failures before they stop your line. Reduce unplanned downtime. Stay audit-ready.",
    tag: null,
  },
  {
    icon: "🔩",
    title: "Genuine Spare Parts",
    description:
      "100% authentic Indef spare parts — no substitutes, no grey-market components. The right part, fitted right, the first time.",
    tag: null,
  },
  {
    icon: "🚨",
    title: "Breakdown Support",
    description:
      "When equipment fails mid-shift, response time is everything. Our service team supports rapid breakdown recovery to get your operation back up.",
    tag: null,
  },
  {
    icon: "📋",
    title: "Equipment Inspection",
    description:
      "Formal inspection and certification reports for statutory compliance, insurance audits, and internal safety reviews.",
    tag: null,
  },
  {
    icon: "🏗️",
    title: "New Equipment Supply",
    description:
      "Supply of electric chain hoists, wire rope hoists, EOT cranes, gantry cranes, and crane components — specified right for your application.",
    tag: null,
  },
];

export default function IndefSection() {
  return (
    <section id="services" className="py-20 bg-[#1e3a5f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Services
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Equipment supply is one part.<br />
            <span className="text-amber-400">Keeping it running is everything.</span>
          </h2>
          <div className="w-12 h-0.5 bg-amber-500 mb-4"></div>
          <p className="text-slate-300 max-w-2xl leading-relaxed">
            From new hoist supply to emergency breakdown response — Elmech provides
            complete lifecycle support for your material handling equipment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-amber-400/40 transition-all"
            >
              <span className="text-3xl block mb-4">{service.icon}</span>
              <div className="flex items-start gap-3 mb-3">
                <h3 className="font-bold text-white text-base leading-snug">{service.title}</h3>
              </div>
              {service.tag && (
                <span className="inline-block bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 tracking-wide">
                  {service.tag}
                </span>
              )}
              <p className="text-slate-300 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href="/enquiry"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-[#1e3a5f] font-bold px-7 py-3.5 rounded text-sm transition-colors text-center"
          >
            Schedule a Service Enquiry →
          </a>
        </div>
      </div>
    </section>
  );
}
