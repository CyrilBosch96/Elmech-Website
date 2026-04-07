export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            About Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-4">
            Trusted by Industry for Over Three Decades
          </h2>
          <div className="w-12 h-0.5 bg-amber-500"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5 text-slate-600 leading-relaxed">
            <p className="text-lg">
              <strong className="text-[#1e3a5f]">Elmech Equipment Company</strong>,
              established in <strong className="text-[#1e3a5f]">1992</strong>, is a
              trusted supplier of material handling and lifting equipment for industrial
              applications.
            </p>
            <p>
              For over three decades, we have supported manufacturing industries with
              reliable equipment, genuine spare parts, and professional service support.
              We specialize in crane equipment, hoists, lifting solutions, and safety
              systems, providing dependable products backed by technical expertise.
            </p>
            <p>
              Elmech Equipment Company is an{" "}
              <strong className="text-[#1e3a5f]">
                authorized distributor of Indef material handling equipment
              </strong>{" "}
              and operates an{" "}
              <strong className="text-[#1e3a5f]">Indef-certified service center</strong>,
              ensuring genuine products and professional after-sales support.
            </p>
            <p>
              Our long-standing relationships with industrial customers are built on
              reliability, technical knowledge, and consistent service.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "30+", label: "Years in Business" },
              { value: "100%", label: "Genuine Indef Products" },
              { value: "Certified", label: "Indef Service Center" },
              { value: "Industries", label: "Served Across India" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center"
              >
                <p className="text-3xl font-extrabold text-amber-500 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Indef badge */}
        <div className="mt-14 bg-[#1e3a5f] rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Authorized Distributor of Indef Equipment
            </h3>
            <p className="text-slate-300 text-sm">
              We supply genuine Indef material handling equipment for industrial use.
            </p>
          </div>
          <a
            href="/enquiry"
            className="shrink-0 bg-amber-500 hover:bg-amber-400 text-[#1e3a5f] font-bold px-6 py-3 rounded transition-colors text-sm whitespace-nowrap"
          >
            Get a Quotation →
          </a>
        </div>
      </div>
    </section>
  );
}
