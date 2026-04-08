export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            About Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-4">
            Built for industry.<br />Proven by three decades.
          </h2>
          <div className="w-12 h-0.5 bg-amber-500"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-5 text-slate-600 leading-relaxed">
            <p className="text-lg font-medium text-slate-700">
              When a hoist fails mid-shift, your line stops, your workers are at risk,
              and your production targets don't wait. Elmech was built to make sure
              that doesn't happen.
            </p>
            <p>
              Founded in 1992, we are Coimbatore's authorized distributor for Indef
              material handling equipment — the most trusted name in Indian industrial
              lifting. Every product we supply is factory-genuine. Every service we
              perform meets Indef's certified standards.
            </p>
            <p>
              Over 30 years, we've supported foundries, textile mills, fabrication units,
              and manufacturing plants across Tamil Nadu. Not with one-time sales — but
              with long-term equipment relationships that keep operations safe, compliant,
              and running.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-0 border border-slate-200 rounded-xl overflow-hidden">
            {[
              {
                value: "1992",
                label: "Year Elmech was founded.",
                sub: "Three decades of field experience in Tamil Nadu's industrial heartland.",
              },
              {
                value: "Indef",
                label: "India's most specified lifting equipment brand.",
                sub: "Elmech is its authorized distributor in Coimbatore.",
              },
              {
                value: "Certified",
                label: "Indef Clinic status.",
                sub: "The highest level of factory-authorized service recognition.",
              },
            ].map((stat, i) => (
              <div
                key={stat.value}
                className={`flex gap-5 items-start px-6 py-5 ${i !== 0 ? "border-t border-slate-200" : ""}`}
              >
                <p className="text-2xl font-extrabold text-amber-500 shrink-0 w-24">{stat.value}</p>
                <div>
                  <p className="font-semibold text-[#1e3a5f] text-sm">{stat.label}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
