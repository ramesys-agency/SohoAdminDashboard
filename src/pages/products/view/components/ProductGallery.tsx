import { useState } from "react";

export interface ProductVariantImageData {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  colorRef: string | null;
  file?: File;
}

interface ProductGalleryProps {
  images: ProductVariantImageData[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  const displayImages =
    images.length > 0
      ? images
      : [{ id: "1", imageUrl: "", isPrimary: true, colorRef: "#f1f5f9" }];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        className={`aspect-[3/4] rounded-xl flex items-center justify-center relative overflow-hidden`}
        style={{
          backgroundColor: displayImages[active].imageUrl
            ? "transparent"
            : displayImages[active].colorRef || "#f1f5f9",
        }}
      >
        {displayImages[active].imageUrl ? (
          <img
            src={displayImages[active].imageUrl}
            alt="Product"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="material-symbols-outlined text-slate-300 text-[80px]">
            checkroom
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {displayImages.map((img, i) => (
          <button
            key={img.id || i}
            onClick={() => setActive(i)}
            className={`aspect-[3/4] rounded-lg flex items-center justify-center transition-all overflow-hidden ${
              active === i
                ? "ring-2 ring-primary ring-offset-2"
                : "opacity-60 hover:opacity-100"
            }`}
            style={{
              backgroundColor: img.imageUrl
                ? "transparent"
                : img.colorRef || "#f1f5f9",
            }}
          >
            {img.imageUrl ? (
              <img
                src={img.imageUrl}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-slate-300 text-2xl">
                checkroom
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
