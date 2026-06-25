import { MessageCircle, Eye } from "lucide-react";
import type { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onContact: (product: Product) => void;
}

const availabilityStyle: Record<string, string> = {
  "In Stock": "bg-emerald-50 text-emerald-700",
  "Order Now": "bg-amber-50 text-amber-700",
  "Limited Stock": "bg-orange-50 text-orange-700",
};

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
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${availabilityStyle[product.availability]}`}>
            {product.availability}
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
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="flex-1 flex items-center justify-center gap-1.5 border border-black/12 rounded-xl py-2.5 text-sm font-medium text-foreground hover:bg-foreground hover:text-white transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </button>
          <button
            onClick={() => onContact(product)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-foreground text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#c9963e] transition-all duration-200"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Contact Store
          </button>
        </div>
      </div>
    </article>
  );
}
