const services = [
  "Hoist servicing and repair",
  "Preventive maintenance",
  "Spare parts replacement",
  "Equipment inspection",
  "Breakdown service support",
];

export default function IndefSection() {
  return (
    <section id="services" className="py-20 bg-[#1e3a5f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Left – content */}
          <div>
            <p className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3">
              Certified Service Center
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
              Indef Clinic —<br />
              <span className="text-amber-400">Authorized Service &amp; Repair</span>
            </h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Elmech Equipment Company operates an{" "}
              <strong className="text-white">Indef Clinic</strong>, an Indef-certified
              service center for maintenance and repair of Indef equipment. Our service
              team ensures that equipment operates safely and reliably in demanding
              industrial environments.
            </p>
            <a
              href="/enquiry"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-[#1e3a5f] font-bold px-6 py-3 rounded text-sm transition-colors"
            >
              Schedule a Service Enquiry →
            </a>
          </div>

          {/* Right – capabilities */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Service Capabilities</h3>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-[#1e3a5f]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-slate-200 font-medium">{service}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 bg-[#152b47] border border-[#2a4f7c] rounded-xl p-5">
              <p className="text-amber-400 font-bold text-sm mb-1">
                Why use the Indef Clinic?
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                Certified technicians, genuine Indef spare parts, and service standards
                aligned with manufacturer requirements — keeping your equipment running
                safely and efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
