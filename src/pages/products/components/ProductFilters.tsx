import type { Collection } from "../../../api/collections";
import type { CategoryTreeNode } from "../../../api/categories";
import CategorySelectOptions from "../../../components/ui/CategorySelectOptions";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  /** Shows a spinner while the typed query is still settling or in flight. */
  isSearching?: boolean;
  gender: string;
  onGenderChange: (v: string) => void;
  isPublished: string;
  onIsPublishedChange: (v: string) => void;
  categoryId: string;
  onCategoryChange: (v: string) => void;
  collectionId: string;
  onCollectionChange: (v: string) => void;
  sortBy: string;
  onSortByChange: (v: string) => void;
  categories: CategoryTreeNode[];
  collections: Collection[];
}

export default function ProductFilters({
  search,
  onSearchChange,
  isSearching = false,
  gender,
  onGenderChange,
  isPublished,
  onIsPublishedChange,
  categoryId,
  onCategoryChange,
  collectionId,
  onCollectionChange,
  sortBy,
  onSortByChange,
  categories,
  collections,
}: ProductFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center gap-4">
      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape" && search) onSearchChange("");
            }}
            placeholder="Search by name, SKU, colour or category..."
            aria-label="Search products"
            className="w-full pl-10 pr-16 py-2 text-sm border border-slate-200 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 [&::-webkit-search-cancel-button]:hidden"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isSearching && (
              <span className="size-4 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
            )}
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="text-slate-400 hover:text-slate-700 flex items-center"
                title="Clear search"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Gender */}
        <select
          value={gender}
          onChange={(e) => onGenderChange(e.target.value)}
          className="text-sm border border-slate-200 bg-white rounded-lg focus:outline-none py-2 px-3 text-slate-700"
        >
          <option value="">All Genders</option>
          <option value="MEN">Men</option>
          <option value="WOMEN">Women</option>
          <option value="KIDS">Kids</option>
        </select>

        {/* Category */}
        <select
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="text-sm border border-slate-200 bg-white rounded-lg focus:outline-none py-2 px-3 text-slate-700"
        >
          <option value="">All Categories</option>
          <CategorySelectOptions categories={categories} />
        </select>

        {/* Collection */}
        <select
          value={collectionId}
          onChange={(e) => onCollectionChange(e.target.value)}
          className="text-sm border border-slate-200 bg-white rounded-lg focus:outline-none py-2 px-3 text-slate-700"
        >
          <option value="">All Collections</option>
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={isPublished}
          onChange={(e) => onIsPublishedChange(e.target.value)}
          className="text-sm border border-slate-200 bg-white rounded-lg focus:outline-none py-2 px-3 text-slate-700"
        >
          <option value="">Any Status</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="text-sm border border-slate-200 bg-white rounded-lg focus:outline-none py-2 px-3 text-slate-700"
        >
          {/* Empty = the server's default: best match when searching,
              newest first otherwise. */}
          <option value="">{search ? "Best Match" : "Sort By"}</option>
          <option value="createdAt_desc">Newest First</option>
          <option value="createdAt_asc">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A–Z</option>
          <option value="name_desc">Name: Z–A</option>
          <option value="rating">Top Rated</option>
          <option value="popularity">Most Reviewed</option>
        </select>
      </div>
    </div>
  );
}
