import Link from "next/link";

export default function Hero() {
  return (
    <section className="text-white relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero-crane.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(18,42,72,0.97) 0%, rgba(20,50,85,0.94) 55%, rgba(15,35,60,0.88) 100%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              Authorized Indef Distributor
            </div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              Indef Clinic — Certified Service Center
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">
              Coimbatore, Tamil Nadu
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Keep your factory
            <span className="block text-amber-400">running at full capacity.</span>
            <span className="block text-slate-300">Not waiting for parts.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
            Elmech supplies genuine Indef hoists, EOT cranes, and lifting systems to
            manufacturing plants across Tamil Nadu — with factory-certified service support
            that eliminates unplanned downtime, safety risk, and compliance failure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link
              href="/enquiry"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-[#1e3a5f] font-bold px-8 py-4 rounded text-base transition-colors text-center"
            >
              Get a Quotation
            </Link>
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 py-4 rounded text-base transition-colors text-center"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
            <Link
              href="#products"
              className="inline-block bg-transparent border-2 border-slate-400 hover:border-white text-white font-semibold px-8 py-4 rounded text-base transition-colors text-center"
            >
              View Products
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
            {[
              { value: "30+", label: "Years serving Tamil Nadu industry" },
              { value: "100%", label: "Genuine Indef products only" },
              { value: "Indef Clinic", label: "Factory-certified service center" },
              { value: "Zero", label: "Counterfeit parts. Ever." },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 px-5 py-4">
                <p className="text-amber-400 font-extrabold text-xl mb-0.5">{stat.value}</p>
                <p className="text-slate-400 text-xs leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
