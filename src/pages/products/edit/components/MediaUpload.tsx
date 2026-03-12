import { useRef } from "react";
import { type ProductVariantImageData } from "../../view/components/ProductGallery";

interface MediaUploadProps {
  images: ProductVariantImageData[];
  onImagesChange: (images: ProductVariantImageData[]) => void;
}

export default function MediaUpload({
  images,
  onImagesChange,
}: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        id: crypto.randomUUID(),
        imageUrl: URL.createObjectURL(file), // create local preview URL
        file, // attach the actual file to be uploaded later
        isPrimary: images.length === 0,
        colorRef: "#" + Math.floor(Math.random() * 16777215).toString(16),
      }));
      onImagesChange([...images, ...newImages]);
    }
    // reset input so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-900">Variant Images</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-[#1325ec] text-xs font-bold flex items-center gap-1 hover:underline"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Item
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-[3/4] rounded-lg border border-slate-200 overflow-hidden group shadow-sm flex items-center justify-center"
            style={{
              backgroundColor: img.imageUrl
                ? "transparent"
                : img.colorRef || "#f1f5f9",
            }}
          >
            {img.imageUrl ? (
              <img
                src={img.imageUrl}
                alt="Variant media"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-slate-300 text-3xl drop-shadow-sm">
                checkroom
              </span>
            )}

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => removeImage(img.id)}
                className="bg-white rounded-full p-1 text-red-500 shadow-md hover:bg-red-50 transition-colors"
                title="Remove image"
              >
                <span className="material-symbols-outlined text-sm">
                  delete
                </span>
              </button>
            </div>
            {img.isPrimary && (
              <div className="absolute bottom-2 left-2 bg-slate-900/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                Primary
              </div>
            )}
          </div>
        ))}
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[3/4] rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 hover:border-[#1325ec] hover:bg-slate-50 transition-colors cursor-pointer group text-slate-500 hover:text-[#1325ec]"
        >
          <span className="material-symbols-outlined transition-transform group-hover:scale-110">
            add_a_photo
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Upload
          </span>
        </button>
      </div>
    </div>
  );
}
