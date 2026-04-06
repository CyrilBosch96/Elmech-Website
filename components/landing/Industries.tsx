const industries = [
  { name: "Engineering Industries", icon: "⚙️" },
  { name: "Manufacturing Plants", icon: "🏭" },
  { name: "Textile Mills", icon: "🧵" },
  { name: "Foundries", icon: "🔥" },
  { name: "Warehouses", icon: "📦" },
  { name: "Fabrication Units", icon: "🔩" },
];

export default function Industries() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Who We Serve
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-4">
            Industries We Serve
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            Elmech supplies material handling and lifting equipment across a wide
            range of industrial sectors.
          </p>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {industries.map((ind) => (
            <div
              key={ind.name}
              className="bg-white border border-slate-200 rounded-xl px-4 py-6 text-center hover:border-amber-300 hover:shadow-md transition-all group"
            >
              <span className="text-4xl block mb-3">{ind.icon}</span>
              <p className="text-sm font-semibold text-[#1e3a5f] group-hover:text-amber-600 transition-colors leading-snug">
                {ind.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
