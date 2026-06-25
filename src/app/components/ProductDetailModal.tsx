import { useState, useEffect } from "react";
import { X, CheckCircle2, Phone, MessageCircle } from "lucide-react";
import type { Product } from "../data/products";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onContact: (product: Product) => void;
}

const benefits = [
  { label: "Genuine Products", desc: "100% authentic from authorized distributors" },
  { label: "Expert Guidance", desc: "In-store demos and professional advice" },
  { label: "Warranty Support", desc: "Full manufacturer warranty honored" },
  { label: "Store Discounts", desc: "Exclusive pricing for walk-in customers" },
];

export function ProductDetailModal({ product, onClose, onContact }: ProductDetailModalProps) {
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (!product) return null;

  const allImages = [product.image, ...(product.images || [])];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white w-full sm:max-w-4xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[95dvh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="flex flex-col bg-[#f6f6f6] p-6 justify-center gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/5 shadow-inner">
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-black/8">
                  {product.availability}
                </span>
              </div>
            </div>
            
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1 justify-center">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      (activeImage || product.image) === img 
                        ? "border-[#c9963e]" 
                        : "border-black/5 hover:border-black/20"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} preview ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-6 lg:p-8 flex flex-col">
            <div className="mb-1">
              <span className="text-xs text-[#c9963e] font-semibold tracking-widest uppercase">{product.brand}</span>
            </div>
            <h2
              className="text-foreground mb-3 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.4rem" }}
            >
              {product.name}
            </h2>
            <div className="mb-4">
              <span
                className="text-foreground"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.75rem" }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {product.fullDescription}
            </p>

            {/* CTAs */}
            <div className="flex gap-2 mb-6">
              <a
                href="tel:+919999999999"
                className="flex-1 flex items-center justify-center gap-2 border border-black/12 rounded-xl py-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-white transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <button
                onClick={() => onContact(product)}
                className="flex-1 flex items-center justify-center gap-2 bg-foreground text-white rounded-xl py-3 text-sm font-medium hover:bg-[#c9963e] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </div>

            {/* Specs */}
            {product.specs.length > 0 && (
              <div className="mb-5">
                <h4
                  className="text-foreground mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em" }}
                >
                  Specifications
                </h4>
                <div className="space-y-2">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between text-sm py-1.5 border-b border-black/6">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="text-foreground font-medium text-right ml-4">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {product.features.length > 0 && (
              <div>
                <h4
                  className="text-foreground mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em" }}
                >
                  Key Features
                </h4>
                <ul className="space-y-1.5">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Benefits strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-black/6 bg-[#f9f9f9]">
          {benefits.map((b, i) => (
            <div
              key={b.label}
              className={`p-4 border-black/6 ${
                i % 2 === 0 ? "border-r" : ""
              } ${
                i < 2 ? "border-b" : ""
              } md:border-b-0 md:border-r md:last:border-r-0`}
            >
              <div className="text-foreground text-sm font-semibold mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {b.label}
              </div>
              <div className="text-muted-foreground text-xs leading-relaxed">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
