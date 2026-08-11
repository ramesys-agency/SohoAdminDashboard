interface MobilePreviewProps {
  pageName: string;
  sectionName: string;
  isBanner: boolean;
  imageUrl: string;
  collectionId: string;
}

export default function MobilePreview({
  pageName,
  sectionName,
  isBanner,
  imageUrl,
  collectionId,
}: MobilePreviewProps) {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex justify-center items-center flex-col">
        <h3 className="text-sm font-bold text-slate-900 mb-6 self-start">
          Mobile Preview
        </h3>

        {/* CSS Phone Frame */}
        <div className="relative w-[340px] h-[640px] border-[8px] border-slate-900 rounded-[36px] bg-slate-50 overflow-hidden shadow-xl ring-1 ring-slate-200 flex flex-col">
          {/* Top Notch */}
          <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-xl mx-auto w-32 z-10 flex justify-center items-center">
            <div className="w-12 h-1.5 bg-slate-800 rounded-full mt-1"></div>
          </div>

          {/* App Header */}
          <div className="bg-white px-4 pt-8 pb-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-0 shadow-sm">
            <span className="material-symbols-outlined text-slate-800 text-xl font-bold">
              menu
            </span>
            <h4 className="text-sm font-bold text-slate-800">
              {pageName || "App Page"}
            </h4>
            <span className="material-symbols-outlined text-slate-800 text-xl">
              search
            </span>
          </div>

          {/* App Body Content */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 relative hide-scrollbar">
            {/* Render some mock sections above if this is "Bottom Section" */}
            {sectionName === "Bottom Section" && (
              <div className="space-y-3 opacity-50">
                <div className="h-24 bg-slate-200 rounded-lg w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </div>
            )}

            {/* The actual placement preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-sm text-slate-800">
                  {sectionName || "Section"}
                </h5>
                <span className="text-[10px] text-primary font-semibold">
                  View All
                </span>
              </div>

              {/* Display based on format */}
              {!collectionId ? (
                <div className="h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-white">
                  <p className="text-xs font-medium text-slate-400">
                    Select collection mapping
                  </p>
                </div>
              ) : isBanner ? (
                // Banner mode: Landscape
                <div className="w-full aspect-[2/1] rounded-xl overflow-hidden bg-slate-200 shadow-sm">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      Banner Image
                    </div>
                  )}
                </div>
              ) : (
                // Card mode: Portrait (Horizontal Scroll Mock)
                <div className="flex gap-3 overflow-x-hidden">
                  <div className="w-32 flex-shrink-0 space-y-2">
                    <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-200 shadow-sm">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="card"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                          Portrait Image
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Collection Item
                    </p>
                  </div>
                  {/* Dummy extra item */}
                  <div className="w-32 flex-shrink-0 space-y-2 opacity-60">
                    <div className="w-full aspect-[3/4] rounded-xl bg-slate-200"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Render some mock sections below if this is "Top Section" */}
            {(sectionName === "Top Section" || sectionName === "Hero") && (
              <div className="space-y-3 opacity-50">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-24 bg-slate-200 rounded-lg w-full"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
