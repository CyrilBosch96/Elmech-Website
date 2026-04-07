"use client";

import { useRef, useEffect } from "react";

export default function HoistDemo() {
  const wireRef = useRef<HTMLDivElement>(null);
  const hookRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  const MAX_WIRE = 480;

  useEffect(() => {
    const wire = wireRef.current;
    const hk = hookRef.current;
    if (!wire || !hk) return;

    function upd() {
      if (busyRef.current) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
      wire!.style.height = p * MAX_WIRE + "px";
    }

    function handleClick() {
      if (busyRef.current) return;
      busyRef.current = true;
      wire!.style.transition = "height 0.55s cubic-bezier(0.35,0,0.1,1)";
      wire!.style.height = "0";
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        wire!.style.transition = "";
        busyRef.current = false;
        upd();
        hk!.classList.add("hoist-swing");
        hk!.addEventListener("animationend", () => hk!.classList.remove("hoist-swing"), { once: true });
      }, 720);
    }

    window.addEventListener("scroll", upd, { passive: true });
    hk.addEventListener("click", handleClick);
    upd();

    return () => {
      window.removeEventListener("scroll", upd);
      hk.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes hoist-sw {
          0%,100% { transform: rotate(0deg); }
          28%     { transform: rotate(8deg); }
          68%     { transform: rotate(-6deg); }
          88%     { transform: rotate(2deg); }
        }
        .hoist-swing { animation: hoist-sw 0.8s ease-out; transform-origin: top center; }
        .hoist-hook-wrap { cursor: pointer; transition: filter 0.15s; }
        .hoist-hook-wrap:hover { filter: brightness(1.25); }
        .hoist-hook-wrap:hover .hoist-tip { opacity: 1 !important; }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 32,
          zIndex: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Hoist body — 1.7× scale: viewBox 76×70, rendered at 109×102 */}
        <svg width="109" height="102" viewBox="0 0 76 70">
          <rect x="0" y="0" width="76" height="5" rx="1" fill="#1a1a1a" />
          <rect x="7" y="5" width="62" height="5" fill="#222" />
          <rect x="0" y="10" width="76" height="4" rx="1" fill="#1a1a1a" />
          <circle cx="15" cy="7" r="5" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1" />
          <circle cx="15" cy="7" r="2" fill="#111" />
          <circle cx="61" cy="7" r="5" fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="1" />
          <circle cx="61" cy="7" r="2" fill="#111" />
          <rect x="4" y="14" width="68" height="13" rx="2" fill="#222" />
          <rect x="2" y="27" width="16" height="37" rx="2" fill="#222" />
          <circle cx="10" cy="46" r="6" fill="#111" stroke="#2e2e2e" strokeWidth="1.5" />
          <circle cx="10" cy="46" r="2.5" fill="#252525" />
          <rect x="18" y="25" width="48" height="40" rx="3" fill="#F5A800" />
          <rect x="18" y="57" width="48" height="8" rx="0" fill="#C8880A" opacity="0.45" />
          <rect x="20" y="28" width="14" height="10" rx="1" fill="#111" />
          <text x="27" y="36" textAnchor="middle" fill="#F5A800" fontSize="4.5" fontFamily="Arial,sans-serif" fontWeight="500">BAJAJ</text>
          <text x="52" y="36" textAnchor="middle" fill="#111" fontSize="5.5" fontFamily="Arial,sans-serif" fontWeight="500">iR HOIST</text>
          <rect x="20" y="43" width="44" height="17" rx="2" fill="#111" opacity="0.9" />
          <text x="42" y="50" textAnchor="middle" fill="#F5A800" fontSize="4" fontFamily="Arial,sans-serif">indef</text>
          <text x="27" y="57" fill="#666" fontSize="3.5" fontFamily="Arial,sans-serif">SWL 1t  LIFT 6m</text>
          <rect x="66" y="25" width="8" height="24" rx="2" fill="#222" />
          <rect x="33" y="65" width="10" height="5" rx="1" fill="#222" />
        </svg>

        {/* Wire */}
        <div
          ref={wireRef}
          style={{
            width: 3,
            background: "linear-gradient(to bottom, #555, #888)",
            height: 0,
            transition: "height 0.06s linear",
            flexShrink: 0,
          }}
        />

        {/* Hook — pointer events re-enabled */}
        <div style={{ pointerEvents: "all" }}>
          <div ref={hookRef} className="hoist-hook-wrap" style={{ position: "relative" }}>

            {/* Tooltip */}
            <div
              className="hoist-tip"
              style={{
                position: "absolute",
                right: "calc(100% + 12px)",
                top: "40%",
                transform: "translateY(-50%)",
                background: "#F5A800",
                color: "#111",
                padding: "5px 12px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap",
                opacity: 0,
                transition: "opacity 0.2s",
                pointerEvents: "none",
              }}
            >
              Back to top
              <span style={{
                position: "absolute",
                left: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                width: 0,
                height: 0,
                borderTop: "5px solid transparent",
                borderBottom: "5px solid transparent",
                borderLeft: "5px solid #F5A800",
              }} />
            </div>

            {/* Hook SVG — clean industrial crane hook, 1.7× (55×95) */}
            <svg width="55" height="95" viewBox="0 0 32 56">
              {/* Top connector / swivel block */}
              <rect x="11" y="0" width="10" height="7" rx="2" fill="#444" />
              <rect x="13" y="7" width="6" height="5" rx="1" fill="#555" />

              {/* Shank */}
              <rect x="14" y="12" width="4" height="10" fill="#666" />

              {/* Nut */}
              <rect x="11" y="21" width="10" height="5" rx="1" fill="#555" />

              {/* Hook body — thick forged shape */}
              {/* Vertical shank of hook */}
              <rect x="13" y="26" width="6" height="8" fill="#888" />

              {/* Curved hook using path */}
              <path
                d="M 16 34 C 16 34 22 34 24 38 C 26 42 24 48 20 50 C 16 52 10 50 8 46 C 6 42 8 38 12 37"
                fill="none"
                stroke="#999"
                strokeWidth="5.5"
                strokeLinecap="round"
              />

              {/* Inner curve highlight */}
              <path
                d="M 16 36 C 16 36 21 36 23 40 C 24.5 43 23 48 20 49.5"
                fill="none"
                stroke="#bbb"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.4"
              />

              {/* Safety latch */}
              <path
                d="M 12 37 C 10 39 10 42 12 43"
                fill="none"
                stroke="#F5A800"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Tip of hook */}
              <circle cx="12" cy="43" r="2" fill="#F5A800" opacity="0.9" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
