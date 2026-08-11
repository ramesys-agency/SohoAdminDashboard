import { useState } from "react";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import CollectionsTable from "./components/CollectionsTable";
import InteractiveCanvas from "./components/InteractiveCanvas";
import { AppPage } from "./types";

export default function Placements() {
  const [viewMode, setViewMode] = useState<"canvas" | "table">("canvas");
  const [activePage, setActivePage] = useState<AppPage>(AppPage.HOME);

  return (
    <PageWrapper>
      <PageHeader
        title="App Placements & Homepage Promos"
        description="Visually structure and manage your collections, hero banners, and homepage promotions on mobile app and website."
        actions={
          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setViewMode("canvas")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "canvas"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">smartphone</span>
                Canvas Editor
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "table"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">table_rows</span>
                Table View
              </button>
            </div>
          </div>
        }
      />

      <div className="mt-4">
        {viewMode === "canvas" ? (
          <InteractiveCanvas
            activePage={activePage}
            setActivePage={setActivePage}
          />
        ) : (
          <CollectionsTable />
        )}
      </div>
    </PageWrapper>
  );
}
