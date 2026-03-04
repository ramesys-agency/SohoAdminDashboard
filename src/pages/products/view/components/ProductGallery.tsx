import { useState } from "react";

const images = [
  { bg: "bg-slate-200", label: "White T-Shirt Front" },
  { bg: "bg-slate-800", label: "Black T-Shirt" },
  { bg: "bg-blue-900", label: "Navy T-Shirt Stack" },
];

export default function ProductGallery() {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className={`aspect-square rounded-xl ${images[active].bg} flex items-center justify-center relative overflow-hidden`}
      >
        <span className="material-symbols-outlined text-white/30 text-[80px]">
          checkroom
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>
      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`aspect-square rounded-lg ${img.bg} flex items-center justify-center transition-all ${active === i ? "ring-2 ring-[#1325ec] ring-offset-2" : "opacity-60 hover:opacity-100"}`}
          >
            <span className="material-symbols-outlined text-white/40 text-2xl">
              checkroom
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
