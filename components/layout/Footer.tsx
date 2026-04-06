import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1f36] text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2">
              Elmech Equipment Company
            </h3>
            <p className="text-amber-400 text-sm font-medium mb-4">
              Material Handling Equipment Specialists Since 1992
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Authorized Indef Distributor &amp; Indef Certified Service Center.
              Supplying genuine equipment and technical support to industry since 1992.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/#products" },
                { label: "Services", href: "/#services" },
                { label: "About Us", href: "/#about" },
                { label: "Request Quotation", href: "/enquiry" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <address className="not-italic text-sm space-y-2 text-slate-400">
              <p className="font-medium text-white">Elmech Equipment Company</p>
              <p>📍 [Address – To Be Updated]</p>
              <p>
                📞{" "}
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="hover:text-amber-400 transition-colors"
                >
                  +91 XXXXXXXXXX
                </a>
              </p>
              <p>
                ✉️{" "}
                <a
                  href="mailto:elmechin@gmail.com"
                  className="hover:text-amber-400 transition-colors"
                >
                  elmechin@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {year} Elmech Equipment Company. All rights reserved.</p>
          <p>
            Authorized Distributor &amp; Indef Certified Service Center
          </p>
        </div>
      </div>
    </footer>
  );
}
