export default function Leadership() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Leadership
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-4">
            The People Behind Elmech
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto"></div>
        </div>

        <div className="flex justify-center">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center max-w-sm w-full">
            {/* Avatar placeholder */}
            <div className="w-24 h-24 rounded-full bg-[#1e3a5f] flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl text-amber-400 font-bold select-none">SJ</span>
            </div>

            <h3 className="text-xl font-extrabold text-[#1e3a5f] mb-1">
              S. Jyothiprakash
            </h3>
            <p className="text-amber-600 font-semibold text-sm mb-4">
              Chief Executive Officer
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              Leading Elmech Equipment Company with a commitment to genuine equipment,
              technical excellence, and reliable industrial service support since 1992.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
