import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Electric Chain Hoists",
    image: "/iR-HOIST.png",
    items: ["iR Hoist Series", "Electric Chain Hoists", "Variable Speed Hoists"],
    description:
      "Compact electric chain hoists with precise load control for industrial and commercial lifting applications.",
  },
  {
    title: "Wire Rope Hoists (HW)",
    image: "/HW-WIRE-ROPE-HOIST.png",
    items: ["HW Hoist Series", "Wire Rope Hoists", "Heavy-Duty Lifting"],
    description:
      "Heavy-duty wire rope hoists engineered for continuous operation in demanding industrial environments.",
  },
  {
    title: "Wire Rope Hoists (WRH)",
    image: "/WRH-I-II-III.png",
    items: ["WRH I / II / III Series", "High-Capacity Hoists", "Twin Motor Hoists"],
    description:
      "High-capacity twin-motor wire rope hoists for the most demanding heavy lifting requirements.",
  },
  {
    title: "Chain Pulley Blocks",
    image: "/INDEF-P.png",
    items: ["INDEF-P Series", "Manual Chain Blocks", "1T – 10T Capacity"],
    description:
      "ISI-marked manual chain pulley blocks offering reliable load handling wherever power is unavailable.",
  },
  {
    title: "Manual Chain Hoists",
    image: "/INDEF-R.png",
    items: ["INDEF-R Series", "Corrosion-Resistant Hoists", "Stainless Chain"],
    description:
      "Rugged stainless-chain manual hoists designed for corrosive and washdown environments.",
  },
  {
    title: "Crane Systems",
    image: "/JIB-Crane.png",
    items: ["Jib Cranes", "Overhead Cranes", "Crane Components"],
    description:
      "Complete crane systems — from jib cranes to overhead gantry setups — for full facility material handling.",
  },
];

export default function Products() {
  return (
    <section id="products" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Product Range
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-4">
            Complete Material Handling Solutions
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base">
            All equipment supplied by us is suitable for continuous industrial operation
            and supported with service assistance.
          </p>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-6"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <article
              key={cat.title}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all group"
            >
              <div className="relative h-52 bg-slate-100 flex items-center justify-center p-4">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#1e3a5f] mb-2 group-hover:text-amber-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  {cat.description}
                </p>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          {/* CTA Card */}
          <div className="bg-[#1e3a5f] rounded-xl p-6 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Need a specific product?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our team can help you identify the right equipment for your application.
                Request a quotation today.
              </p>
            </div>
            <Link
              href="/enquiry"
              className="mt-6 inline-block bg-amber-500 hover:bg-amber-400 text-[#1e3a5f] font-bold text-sm px-5 py-3 rounded text-center transition-colors"
            >
              Request Quotation →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
