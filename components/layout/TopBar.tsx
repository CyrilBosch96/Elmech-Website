import Image from "next/image";

const PHONE = "+91 98430 19950";
const PHONE_RAW = "+919843019950";

export default function TopBar() {
  return (
    <div className="bg-[#152b47] border-b border-[#2a4f7c] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-center gap-6">

        {/* Phone */}
        <a
          href={`tel:${PHONE_RAW}`}
          className="flex items-center gap-2 text-slate-200 hover:text-amber-400 transition-colors"
        >
          <Image src="/icon-phone.png" alt="Phone" width={15} height={15} className="opacity-80" />
          <span>{PHONE}</span>
        </a>

        <span className="text-slate-600">|</span>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${PHONE_RAW}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-200 hover:text-amber-400 transition-colors"
        >
          <Image src="/icon-whatsapp.png" alt="WhatsApp" width={15} height={15} className="opacity-80" />
          <span>{PHONE}</span>
        </a>

      </div>
    </div>
  );
}
