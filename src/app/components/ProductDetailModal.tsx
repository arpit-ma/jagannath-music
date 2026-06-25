import { useState, useEffect, useRef } from "react";
import { X, CheckCircle2, Phone, MessageCircle } from "lucide-react";
import type { Product } from "../data/products";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onContact: (product: Product) => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

const benefits = [
  { label: "Genuine Products", desc: "100% authentic from authorized distributors" },
  { label: "Expert Guidance", desc: "In-store demos and professional advice" },
  { label: "Warranty Support", desc: "Full manufacturer warranty honored" },
  { label: "Store Discounts", desc: "Exclusive pricing for walk-in customers" },
];

export function ProductDetailModal({ 
  product, 
  onClose, 
  onContact, 
  allProducts, 
  onSelectProduct 
}: ProductDetailModalProps) {
  const [activeImage, setActiveImage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
    }
  }, [product]);

  if (!product) return null;

  const allImages = [product.image, ...(product.images || [])];

  const similarProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div 
        ref={modalRef}
        className="relative bg-white w-full sm:max-w-4xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[95dvh] overflow-y-auto"
      >
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
                href="tel:+917974024513"
                className="flex-1 flex items-center justify-center gap-2 border border-black/12 rounded-xl py-3 text-sm font-medium text-foreground hover:bg-foreground hover:text-white transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href={`https://wa.me/917974024513?text=${encodeURIComponent(`Hi, I'm interested in the *${product.name}* (Price: ₹${product.price.toLocaleString("en-IN")}). Could you provide more details?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#128C7E] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
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

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="p-6 md:p-8 border-t border-black/6 bg-[#fafafa]">
            <h3
              className="text-foreground mb-4"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem" }}
            >
              Similar Products
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {similarProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="group cursor-pointer bg-white rounded-2xl border border-black/5 hover:border-[#c9963e]/40 p-3 flex flex-col transition-all duration-300 hover:shadow-md"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black/[0.02] mb-3 flex items-center justify-center">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] text-[#c9963e] font-semibold uppercase tracking-wider mb-1">
                    {p.brand}
                  </span>
                  <h4 className="text-foreground text-xs font-semibold line-clamp-2 flex-grow mb-2 group-hover:text-[#c9963e] transition-colors leading-snug">
                    {p.name}
                  </h4>
                  <div className="text-foreground text-sm font-bold">
                    ₹{p.price.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
