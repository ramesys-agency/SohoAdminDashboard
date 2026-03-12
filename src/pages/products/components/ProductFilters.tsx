import type { Collection } from "../../../api/collections";

interface ParentCategory {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
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
  categories: ParentCategory[];
  collections: Collection[];
}

export default function ProductFilters({
  search,
  onSearchChange,
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
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1325ec]/20 text-slate-900"
          />
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
        </select>

        {/* Category */}
        <select
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="text-sm border border-slate-200 bg-white rounded-lg focus:outline-none py-2 px-3 text-slate-700"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
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
          <option value="">Sort By</option>
          <option value="createdAt_desc">Newest First</option>
          <option value="createdAt_asc">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A–Z</option>
          <option value="name_desc">Name: Z–A</option>
        </select>
      </div>
    </div>
  );
}
