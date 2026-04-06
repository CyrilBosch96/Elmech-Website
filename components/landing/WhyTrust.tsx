const reasons = [
  {
    icon: "🏆",
    title: "30+ Years Experience",
    description: "Serving industrial customers since 1992 with consistent reliability.",
  },
  {
    icon: "✅",
    title: "Genuine Equipment",
    description:
      "Authorized distributor of Indef products — every item is factory genuine.",
  },
  {
    icon: "🔬",
    title: "Technical Expertise",
    description:
      "Strong understanding of crane and hoist systems, backed by decades in the field.",
  },
  {
    icon: "🛠️",
    title: "Reliable Service",
    description:
      "Certified service support through the Indef Clinic ensures minimal downtime.",
  },
  {
    icon: "🔄",
    title: "Long-Term Support",
    description:
      "Spare parts and servicing available throughout the entire product life cycle.",
  },
];

export default function WhyTrust() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Why Choose Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-4">
            Why Industries Trust Elmech
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex gap-4 p-6 rounded-xl border border-slate-100 bg-slate-50 hover:border-amber-200 hover:bg-amber-50/30 transition-all"
            >
              <span className="text-3xl shrink-0">{reason.icon}</span>
              <div>
                <h3 className="font-bold text-[#1e3a5f] mb-1.5">{reason.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
