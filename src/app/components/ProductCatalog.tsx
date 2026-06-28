import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, X, ChevronRight } from "lucide-react";
import { priceRanges } from "../data/products";
import type { Product, Category } from "../data/products";
import { ProductCard } from "./ProductCard";

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
  initialCategory?: Category;
  onViewDetails: (product: Product) => void;
  onContact: (product: Product) => void;
}

export function ProductCatalog({ products, categories, initialCategory, onViewDetails, onContact }: ProductCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory ?? "All");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [selectedStockStatus, setSelectedStockStatus] = useState("All");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(6);
  }, [search, selectedCategory, selectedBrand, selectedPriceIdx, selectedStockStatus]);

  const availableBrands = useMemo(() => {
    const brandsSet = new Set(products.map(p => p.brand).filter(Boolean));
    return ["All Brands", ...Array.from(brandsSet).sort()];
  }, [products]);

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchBrand = selectedBrand === "All Brands" || p.brand === selectedBrand;
    const range = priceRanges[selectedPriceIdx];
    const matchPrice = p.price >= range.min && p.price <= range.max;
    const matchAvail = selectedStockStatus === "All" || (selectedStockStatus === "In Stock" ? p.stock > 0 : p.stock === 0);
    const searchTerms = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matchSearch =
      searchTerms.length === 0 ||
      searchTerms.every((term) =>
        p.name.toLowerCase().includes(term) ||
        (p.brand && p.brand.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(term)) ||
        (p.fullDescription && p.fullDescription.toLowerCase().includes(term)) ||
        (p.features && p.features.some((f) => f.toLowerCase().includes(term)))
      );
    return matchCat && matchBrand && matchPrice && matchAvail && matchSearch;
  });

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedBrand("All Brands");
    setSelectedPriceIdx(0);
    setSelectedStockStatus("All");
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedBrand !== "All Brands" ||
    selectedPriceIdx !== 0 ||
    selectedStockStatus !== "All" ||
    search !== "";

  const getCategoryCount = (cat: Category) => {
    if (cat === "All") return products.length;
    return products.filter((p) => p.category === cat).length;
  };

  // Helper to render filter options inside sidebar/mobile drawer
  const FilterContent = () => (
    <div className="space-y-8">
      {/* Category List */}
      <div>
        <h4 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider">
          Categories
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => {
            const count = getCategoryCount(cat);
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-foreground text-white font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-[#f6f6f6]"
                }`}
              >
                <span className="truncate">{cat}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-black/5 text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand List */}
      <div>
        <h4 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider">
          Brand
        </h4>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer"
        >
          {availableBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Price Ranges */}
      <div>
        <h4 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider">
          Price Range
        </h4>
        <div className="space-y-2">
          {priceRanges.map((range, idx) => {
            const isSelected = selectedPriceIdx === idx;
            return (
              <button
                key={range.label}
                onClick={() => setSelectedPriceIdx(idx)}
                className="w-full flex items-center gap-3 text-left py-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-[#c9963e] bg-[#c9963e]"
                      : "border-black/20 group-hover:border-black/40"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className={isSelected ? "font-medium text-foreground" : ""}>
                  {range.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-foreground mb-4 uppercase tracking-wider">
          Stock Status
        </h4>
        <div className="space-y-2">
          {["All", "In Stock", "Out of Stock"].map((status) => {
            const isSelected = selectedStockStatus === status;
            return (
              <button
                key={status}
                onClick={() => setSelectedStockStatus(status)}
                className="w-full flex items-center gap-3 text-left py-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-[#c9963e] bg-[#c9963e]"
                      : "border-black/20 group-hover:border-black/40"
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className={isSelected ? "font-medium text-foreground" : ""}>
                  {status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters (if active) */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 bg-[#f6f6f6] hover:bg-[#eeeeee] text-foreground text-sm font-semibold py-3 rounded-xl transition-all"
        >
          <X className="w-4 h-4" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <section id="catalog" className="py-12 md:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <p className="text-[#c9963e] text-xs font-semibold tracking-[0.15em] uppercase mb-3">
            Our Inventory
          </p>
          <h2
            className="text-foreground animate-fade-in"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            Product Catalog
          </h2>
        </div>

        {/* 2-Column Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT: Filter Sidebar (Desktop Only) */}
          <aside className="col-span-1 hidden lg:block border-r border-black/5 pr-8 select-none">
            {FilterContent()}
          </aside>

          {/* RIGHT: Search + Mobile Filter Button + Product Grid */}
          <div className="col-span-1 lg:col-span-3 flex flex-col">
            {/* Search and control bar */}
            <div className="flex flex-col md:flex-row gap-3 mb-8">
              <div className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search products, brands…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.currentTarget.blur();
                      }
                    }}
                    className="w-full pl-11 pr-4 py-3.5 bg-[#f6f6f6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-muted-foreground transition-all duration-200"
                  />
                </div>
                {/* Explicit Search Button for Mobile */}
                <button
                  onClick={() => {
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                  className="md:hidden bg-foreground text-white px-5 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#c9963e] transition-colors flex-shrink-0"
                >
                  Search
                </button>
              </div>

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex lg:hidden items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold border border-black/10 bg-white hover:bg-[#f6f6f6] transition-all w-full md:w-auto flex-shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-[#c9963e] text-white text-xs px-1.5 py-0.5 rounded-full">
                    {[
                      selectedCategory !== "All",
                      selectedBrand !== "All Brands",
                      selectedPriceIdx !== 0,
                      selectedStockStatus !== "All",
                      search !== "",
                    ].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Selected category pill (Mobile scroll tabs) */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
                    selectedCategory === cat
                      ? "bg-foreground text-white"
                      : "bg-[#f6f6f6] text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results count & Active Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <p className="text-muted-foreground text-sm font-medium">
                Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </p>

              {/* Filter feedback chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 items-center">
                  {selectedCategory !== "All" && (
                    <span className="inline-flex items-center gap-1 bg-[#c9963e]/10 text-[#b8852e] text-xs font-semibold px-2.5 py-1 rounded-full">
                      {selectedCategory}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedCategory("All")}
                      />
                    </span>
                  )}
                  {selectedBrand !== "All Brands" && (
                    <span className="inline-flex items-center gap-1 bg-black/5 text-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                      {selectedBrand}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedBrand("All Brands")}
                      />
                    </span>
                  )}
                  {selectedPriceIdx !== 0 && (
                    <span className="inline-flex items-center gap-1 bg-black/5 text-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                      {priceRanges[selectedPriceIdx].label}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedPriceIdx(0)} />
                    </span>
                  )}
                  {selectedStockStatus !== "All" && (
                    <span className="inline-flex items-center gap-1 bg-black/5 text-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                      {selectedStockStatus}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedStockStatus("All")}
                      />
                    </span>
                  )}
                  {search !== "" && (
                    <span className="inline-flex items-center gap-1 bg-black/5 text-foreground text-xs font-semibold px-2.5 py-1 rounded-full truncate max-w-[150px]">
                      "{search}"
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSearch("")} />
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Product Grid */}
            {filtered.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.slice(0, visibleCount).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={onViewDetails}
                      onContact={onContact}
                    />
                  ))}
                </div>
                
                {/* Load More Button */}
                {visibleCount < filtered.length && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="group flex items-center justify-center gap-2 bg-white text-foreground border border-black/10 px-8 py-3.5 rounded-full text-sm font-semibold hover:border-black/30 hover:bg-[#f6f6f6] transition-all w-full sm:w-auto"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Load More Products
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-[#f6f6f6]/50 rounded-3xl border border-dashed border-black/10">
                <div className="text-5xl mb-4">🎵</div>
                <h3
                  className="text-foreground font-bold mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  No products found
                </h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                  We couldn't find any products matching your search filters. Try clearing some.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-foreground text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#c9963e] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-out mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden select-none">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Drawer container */}
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
              <span
                className="font-bold text-foreground text-base"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Filters
              </span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-1 overflow-y-auto p-5">{FilterContent()}</div>

            {/* Footer actions */}
            <div className="p-4 border-t border-black/5 flex gap-3">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 bg-foreground text-white py-3 rounded-xl text-sm font-bold hover:bg-[#c9963e] transition-colors text-center"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
