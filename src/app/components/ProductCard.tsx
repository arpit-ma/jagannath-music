import { useState } from "react";
import { Eye } from "lucide-react";
import type { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onContact?: (product: Product) => void;
}



export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article 
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-black/8 hover:border-black/16 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      {/* Image — compact on mobile */}
      <div className="relative overflow-hidden bg-[#f6f6f6]" style={{ aspectRatio: "1/1" }}>
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-black/5 animate-pulse" />
        )}
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain p-2 sm:p-4 group-hover:scale-105 transition-all duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3">
          <span className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${product.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Content — compact on mobile */}
      <div className="p-2.5 sm:p-5 flex flex-col flex-1">
        <div className="mb-0.5 sm:mb-1">
          <span className="text-[10px] sm:text-xs text-[#c9963e] font-semibold tracking-wide uppercase">{product.brand}</span>
        </div>
        <h3
          className="text-foreground mb-1 sm:mb-2 leading-snug line-clamp-2"
          style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: "clamp(0.72rem, 2.5vw, 0.95rem)" }}
        >
          {product.name}
        </h3>
        {/* Description hidden on mobile for compact cards */}
        <p className="hidden sm:block text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="mb-2 sm:mb-4">
          <span
            className="text-foreground"
            style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: "clamp(0.85rem, 3vw, 1.25rem)" }}
          >
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* View Details button */}
        <div className="mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="group/details relative w-full flex items-center justify-center gap-1 sm:gap-1.5 px-2 border border-black/15 bg-white/50 backdrop-blur-sm text-[#111] rounded-full py-2 sm:py-2.5 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 hover:border-black active:translate-y-0 active:scale-95 cursor-pointer"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            <div className="absolute inset-0 bg-black translate-y-[100%] group-hover/details:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[45deg] group-hover/details:left-[100%] transition-all duration-700 ease-in-out z-10 pointer-events-none" />
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-colors duration-500 group-hover/details:text-white relative z-20" />
            <span className="whitespace-nowrap transition-colors duration-500 group-hover/details:text-white relative z-20">View Details</span>
          </button>
        </div>
      </div>
    </article>
  );
}
