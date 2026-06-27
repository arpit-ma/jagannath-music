import { MessageCircle, Eye } from "lucide-react";
import type { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onContact: (product: Product) => void;
}



export function ProductCard({ product, onViewDetails, onContact }: ProductCardProps) {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-black/8 hover:border-black/16 hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-[#f6f6f6]" style={{ aspectRatio: "4/3" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${product.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-1">
          <span className="text-xs text-[#c9963e] font-semibold tracking-wide uppercase">{product.brand}</span>
        </div>
        <h3
          className="text-foreground mb-2 leading-snug"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.95rem" }}
        >
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="mb-4">
          <span
            className="text-foreground"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.25rem" }}
          >
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onViewDetails(product)}
            className="group/details relative flex-1 flex items-center justify-center gap-1.5 px-2 border border-black/15 bg-white/50 backdrop-blur-sm text-[#111] rounded-full py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 hover:border-black active:translate-y-0 active:scale-95 cursor-pointer"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <div className="absolute inset-0 bg-black translate-y-[100%] group-hover/details:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[45deg] group-hover/details:left-[100%] transition-all duration-700 ease-in-out z-10 pointer-events-none" />
            <Eye className="w-3.5 h-3.5 shrink-0 transition-colors duration-500 group-hover/details:text-white relative z-20" />
            <span className="whitespace-nowrap transition-colors duration-500 group-hover/details:text-white relative z-20">View Details</span>
          </button>
          
          <button
            onClick={() => onContact(product)}
            className="group/contact relative flex-1 flex items-center justify-center gap-1.5 px-2 bg-[#111] text-white rounded-full py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#c9963e]/40 active:translate-y-0 active:scale-95 cursor-pointer"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#c9963e] to-[#e6bc73] translate-y-[100%] group-hover/contact:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-[45deg] group-hover/contact:left-[100%] transition-all duration-700 ease-in-out delay-75 z-10 pointer-events-none" />
            <MessageCircle className="w-3.5 h-3.5 shrink-0 transition-transform duration-500 group-hover/contact:scale-110 group-hover/contact:-rotate-12 relative z-20" />
            <span className="whitespace-nowrap relative z-20">Contact Store</span>
          </button>
        </div>
      </div>
    </article>
  );
}
