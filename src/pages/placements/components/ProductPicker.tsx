import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts, type ApiProduct } from "../../../api/products";
import { getFullImageUrl } from "../../../lib/imageUrl";

const RESULT_LIMIT = 20;

interface ProductPickerProps {
  /** Currently linked product, or "" when nothing is picked yet. */
  value: string;
  onChange: (productId: string) => void;
}

/**
 * Type-to-search replacement for a plain product dropdown: the catalogue is far
 * too long to scroll, so the search runs server-side and only the matches are
 * listed. The picked product is resolved by id on open so editing an existing
 * link shows a name rather than a bare uuid.
 */
export default function ProductPicker({ value, onChange }: ProductPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  /** Kept so the chosen product keeps its label after the results change. */
  const [selected, setSelected] = useState<ApiProduct | null>(null);

  // Clicking anywhere else closes the list — the dialog behind it stays usable.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  // Editing an existing link starts with an id and nothing else, so fetch the
  // one product to label it.
  const { data: selectedData } = useQuery({
    queryKey: ["placement-product-picker-selected", value],
    queryFn: () => getProductById(value),
    enabled: Boolean(value) && selected?.id !== value,
  });

  useEffect(() => {
    if (!selectedData) return;
    const raw = selectedData as { data?: ApiProduct } & ApiProduct;
    const product = raw?.data ?? raw;
    if (product?.id === value) setSelected(product);
  }, [selectedData, value]);

  const { data, isFetching } = useQuery({
    queryKey: ["placement-product-picker", debouncedSearch],
    queryFn: () =>
      getProducts({
        limit: RESULT_LIMIT,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      }),
    enabled: isOpen,
  });

  const raw = data as unknown as { products?: ApiProduct[]; data?: ApiProduct[] };
  const results: ApiProduct[] = Array.isArray(raw?.products)
    ? raw.products
    : Array.isArray(raw?.data)
      ? raw.data
      : [];

  const handleSearchChange = (next: string) => {
    setSearch(next);
    setIsOpen(true);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(next), 400);
  };

  const pick = (product: ApiProduct) => {
    setSelected(product);
    onChange(product.id);
    setIsOpen(false);
    setSearch("");
    setDebouncedSearch("");
  };

  const clear = () => {
    setSelected(null);
    onChange("");
    setSearch("");
    setDebouncedSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      {value && selected ? (
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-2">
          <div className="w-9 h-9 shrink-0 rounded-md bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
            {selected.primaryImage ? (
              <img
                src={getFullImageUrl(selected.primaryImage)}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-slate-300 text-[18px]">image</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate">{selected.name}</p>
            <p className="text-[11px] text-slate-500 truncate">
              {selected.sku ? `${selected.sku} · ` : ""}৳{selected.price}
            </p>
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-slate-400 hover:text-red-500 p-1 shrink-0"
            title="Pick a different product"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      ) : (
        <div className="relative">
          <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search products by name or SKU..."
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </div>
      )}

      {isOpen && !value && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {isFetching && results.length === 0 ? (
            <p className="px-3 py-3 text-[11px] text-slate-500">Searching...</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-3 text-[11px] text-slate-500">
              No products match &ldquo;{debouncedSearch}&rdquo;.
            </p>
          ) : (
            <>
              {results.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => pick(product)}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                >
                  <div className="w-8 h-8 shrink-0 rounded-md bg-slate-100 overflow-hidden flex items-center justify-center">
                    {product.primaryImage ? (
                      <img
                        src={getFullImageUrl(product.primaryImage)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-300 text-[16px]">
                        image
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">{product.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {product.sku ? `${product.sku} · ` : ""}৳{product.price}
                      {product.isPublished ? "" : " · unpublished"}
                    </p>
                  </div>
                </button>
              ))}
              {/* Only the first page is fetched, so say so instead of implying
                  these are all the matches. */}
              {results.length === RESULT_LIMIT && (
                <p className="px-3 py-2 text-[11px] text-slate-500 bg-slate-50">
                  Showing the first {RESULT_LIMIT} matches — keep typing to narrow it down.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
