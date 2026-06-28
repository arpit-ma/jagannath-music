import { ArrowRight } from "lucide-react";
import type { Category, Product } from "../data/products";

interface FeaturedCategoriesProps {
  products: Product[];
  onSelectCategory: (category: Category) => void;
}

export function FeaturedCategories({ products, onSelectCategory }: FeaturedCategoriesProps) {
  // Dynamically determine the top 3 categories directly from actual product data
  const categoryMap = new Map<string, { count: number; image: string }>();
  
  products.forEach((p) => {
    if (!p.category) return;
    const existing = categoryMap.get(p.category);
    if (existing) {
      existing.count += 1;
    } else {
      categoryMap.set(p.category, { count: 1, image: p.image || "" });
    }
  });

  const topCategories = Array.from(categoryMap.entries())
    .map(([name, data]) => ({ name, count: data.count, image: data.image }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  if (topCategories.length === 0) return null;

  return (
    <section id="categories" className="py-12 md:py-20 lg:py-24 bg-[#f6f6f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16">
          <div className="max-w-2xl">
            <p className="text-[#c9963e] text-xs font-semibold tracking-[0.15em] uppercase mb-3">
              Shop by Category
            </p>
            <h2
              className="text-foreground"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              Featured Categories
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
            From classical Indian instruments to premium studio audio gear — explore our curated collections.
          </p>
        </div>

        {/* Grid Layout: 3 columns on desktop, 2 columns on tablet, 1 column on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {topCategories.map((cat, idx) => {
            const isFirst = idx === 0;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`group relative overflow-hidden rounded-3xl text-left w-full shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer ${
                  isFirst
                    ? "sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2 min-h-[350px] md:min-h-[500px]"
                    : "col-span-1 row-span-1 min-h-[220px]"
                }`}
                style={{ aspectRatio: isFirst ? undefined : "4/3" }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:via-black/50 transition-all duration-300" />

                {/* Card highlight border on hover */}
                <div className="absolute inset-0 border border-transparent group-hover:border-[#c9963e]/40 rounded-3xl pointer-events-none transition-all duration-300" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 flex flex-col justify-end h-full">
                  <h3
                    className="text-white mb-2 tracking-tight group-hover:text-[#c9963e] transition-colors duration-300"
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: isFirst ? "1.75rem" : "1.2rem",
                      fontWeight: 700,
                    }}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-white/60 text-sm leading-normal max-w-md">
                    Explore our collection of {cat.count} {cat.name} {cat.count === 1 ? 'product' : 'products'} and accessories.
                  </p>
                  <div className="flex items-center gap-1.5 mt-4 text-[#c9963e] text-sm font-semibold opacity-90 group-hover:opacity-100 transition-opacity">
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* View All Categories Button */}
        <div className="flex justify-center">
          <button
            onClick={() => onSelectCategory("All")}
            className="group flex items-center justify-center gap-2 bg-white text-foreground border border-black/10 px-6 py-3.5 rounded-full text-sm font-semibold hover:border-black/30 hover:bg-[#f6f6f6] transition-all w-full sm:w-auto"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            View All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
