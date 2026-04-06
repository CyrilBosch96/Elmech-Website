import Link from "next/link";

const categories = [
  {
    title: "Hoists",
    icon: "⛓️",
    items: ["Electric Chain Hoists", "Wire Rope Hoists", "Hoist Spare Parts"],
    description:
      "Industrial-grade hoists for continuous duty applications in demanding environments.",
  },
  {
    title: "Lifting Equipment",
    icon: "🔧",
    items: ["Chain Pulley Blocks", "Lifting Accessories"],
    description:
      "Reliable lifting solutions designed for safe and efficient load handling.",
  },
  {
    title: "Crane Components",
    icon: "🏗️",
    items: ["Brake Drums", "Thruster Brakes", "Limit Switches", "Anti-Collision Devices"],
    description:
      "Genuine crane components that ensure safe, controlled overhead crane operation.",
  },
  {
    title: "Control Systems",
    icon: "🎛️",
    items: ["Radio Remote Controls", "Pendant Switches"],
    description:
      "Operator control systems for precise, safe management of lifting and crane equipment.",
  },
  {
    title: "Safety Equipment",
    icon: "🛡️",
    items: [
      "Crane Safety Devices",
      "Anti-Collision Systems",
      "Industrial Safety Equipment",
    ],
    description:
      "Safety systems that protect personnel and equipment in industrial environments.",
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
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-amber-300 transition-all group"
            >
              <div className="text-3xl mb-4">{cat.icon}</div>
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
            </article>
          ))}

          {/* CTA Card */}
          <div className="bg-[#1e3a5f] rounded-xl p-6 flex flex-col justify-between">
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
