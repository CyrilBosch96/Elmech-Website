"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";

const categories = [
  {
    title: "Electric Chain Hoists",
    image: "/iR-HOIST.png",
    catalogue: "/iR-SERIES.pdf",
    items: ["iR Hoist Series", "Electric Chain Hoists", "Variable Speed Hoists"],
    description:
      "Compact electric chain hoists with precise load control for industrial and commercial lifting applications.",
  },
  {
    title: "Wire Rope Hoists (HW)",
    image: "/HW-WIRE-ROPE-HOIST.png",
    catalogue: "/HW-WIRE-ROPE-HOIST.pdf",
    items: ["HW Hoist Series", "Wire Rope Hoists", "Heavy-Duty Lifting"],
    description:
      "Heavy-duty wire rope hoists engineered for continuous operation in demanding industrial environments.",
  },
  {
    title: "Wire Rope Hoists (WRH)",
    image: "/WRH-I-II-III.png",
    catalogue: "/WRH-I-II-III-SERIES.pdf",
    items: ["WRH I / II / III Series", "High-Capacity Hoists", "Twin Motor Hoists"],
    description:
      "High-capacity twin-motor wire rope hoists for the most demanding heavy lifting requirements.",
  },
  {
    title: "Chain Pulley Blocks",
    image: "/INDEF-P.png",
    catalogue: "/P-Block.pdf",
    items: ["INDEF-P Series", "Manual Chain Blocks", "1T – 10T Capacity"],
    description:
      "ISI-marked manual chain pulley blocks offering reliable load handling wherever power is unavailable.",
  },
  {
    title: "Manual Chain Hoists",
    image: "/INDEF-R.png",
    catalogue: "/INDEF-R.pdf",
    items: ["INDEF-R Series", "Corrosion-Resistant Hoists", "Stainless Chain"],
    description:
      "Rugged stainless-chain manual hoists designed for corrosive and washdown environments.",
  },
  {
    title: "Crane Systems",
    image: "/JIB-Crane.png",
    catalogue: "/JIB-CRANE-CATALOGUE.pdf",
    items: ["Jib Cranes", "Overhead Cranes", "Crane Components"],
    description:
      "Complete crane systems — from jib cranes to overhead gantry setups — for full facility material handling.",
  },
  {
    title: "Single Girder EOT Crane",
    image: null,
    catalogue: "/SGEOT-CATALOGUE.pdf",
    items: ["SGEOT Series", "Single Girder Overhead Cranes", "Up to 10T Capacity"],
    description:
      "Single girder electric overhead travelling cranes for efficient bay-level material movement in workshops and factories.",
  },
  {
    title: "Double Girder EOT Crane",
    image: null,
    catalogue: "/DGEOT-CATALOGUE.pdf",
    items: ["DGEOT Series", "Double Girder Overhead Cranes", "Heavy-Duty Capacity"],
    description:
      "Double girder EOT cranes built for high-capacity, long-span lifting in heavy industrial environments.",
  },
  {
    title: "Gantry Crane",
    image: null,
    catalogue: "/GANTRY-CRANE-CATALOGUE.pdf",
    items: ["Gantry Crane Series", "Floor-Running Cranes", "Indoor & Outdoor Use"],
    description:
      "Freestanding gantry cranes offering flexible overhead lifting without the need for a fixed runway structure.",
  },
  {
    title: "Crane Kit",
    image: null,
    catalogue: "/CRANE-KIT-CATALOGUE.pdf",
    items: ["Crane Kit Components", "Structural Crane Parts", "Complete Crane Kits"],
    description:
      "Ready-to-assemble crane kits supplying all structural and mechanical components for new crane installations.",
  },
  {
    title: "iStacker",
    image: null,
    catalogue: "/iSTACKER-CATALOGUE.pdf",
    items: ["iStacker Series", "Electric Stackers", "Warehouse Material Handling"],
    description:
      "Compact electric stackers designed for efficient palletised load handling in warehouses and storage facilities.",
  },
];

export default function Products() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  const total = categories.length;

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = total - visibleCount;

  const scrollTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setActiveIndex(clamped);
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[clamped] as HTMLElement;
    if (card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
  }, [maxIndex]);

  // Sync active index on scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const card = track.children[0] as HTMLElement;
      if (!card) return;
      const cardWidth = card.offsetWidth + 24; // gap-6 = 24px
      const idx = Math.round(track.scrollLeft / cardWidth);
      setActiveIndex(Math.max(0, Math.min(idx, maxIndex)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [maxIndex]);

  return (
    <section id="products" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Product Range
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1e3a5f] mb-4">
              Complete Material Handling Solutions
            </h2>
            <div className="w-12 h-0.5 bg-amber-500"></div>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-slate-500 text-sm max-w-xs sm:text-right leading-relaxed hidden sm:block">
              All equipment suitable for continuous industrial operation, backed by service support.
            </p>
            {/* Navigation arrows */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => scrollTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous"
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-[#1e3a5f] hover:text-[#1e3a5f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={() => scrollTo(activeIndex + 1)}
                disabled={activeIndex >= maxIndex}
                aria-label="Next"
                className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-[#1e3a5f] hover:text-[#1e3a5f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <article
              key={cat.title}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all group flex flex-col shrink-0"
              style={{ width: `calc((100% - ${(visibleCount - 1) * 24}px) / ${visibleCount})` }}
            >
              <a
                href={cat.catalogue}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-52 bg-white border-b border-slate-100 flex items-center justify-center p-4"
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-xs font-medium tracking-wide uppercase">Image coming soon</span>
                  </div>
                )}
              </a>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-[#1e3a5f] mb-2 group-hover:text-amber-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  {cat.description}
                </p>
                <ul className="space-y-1.5 mb-5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={cat.catalogue}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#1e3a5f] hover:text-amber-600 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  View Catalogue
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all ${
                i === activeIndex
                  ? "w-6 h-2 bg-amber-500"
                  : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-8 bg-[#1e3a5f] rounded-xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Need a specific product?</h3>
            <p className="text-slate-300 text-sm">Our team can help identify the right equipment for your application.</p>
          </div>
          <Link
            href="/enquiry"
            className="shrink-0 bg-amber-500 hover:bg-amber-400 text-[#1e3a5f] font-bold text-sm px-6 py-3 rounded text-center transition-colors whitespace-nowrap"
          >
            Request Quotation →
          </Link>
        </div>

      </div>
    </section>
  );
}
