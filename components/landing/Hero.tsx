import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[#1e3a5f] text-white relative overflow-hidden">
      {/* Subtle industrial grid overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
            Authorized Indef Distributor &amp; Certified Service Center
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Material Handling
            <span className="block text-amber-400">Equipment Specialists</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-300 mt-2">
              Since 1992
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
            Elmech Equipment Company supplies genuine Indef hoists, crane components,
            lifting solutions, and safety systems to manufacturing industries —
            backed by 30+ years of technical expertise and certified service support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/enquiry"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-[#1e3a5f] font-bold px-8 py-4 rounded text-base transition-colors text-center"
            >
              Request a Quotation
            </Link>
            <Link
              href="#products"
              className="inline-block bg-transparent border-2 border-slate-400 hover:border-white text-white font-semibold px-8 py-4 rounded text-base transition-colors text-center"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 48L1440 48L1440 0C1200 40 960 48 720 40C480 32 240 0 0 0L0 48Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}
