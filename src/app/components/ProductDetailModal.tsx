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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
    }
  }, [product]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  // Escape key handler
  useEffect(() => {
    if (!product) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [product, isFullscreen, onClose]);

  if (!product) return null;

  const allImages = [product.image, ...(product.images || [])];

  const similarProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-800" onClick={onClose} />

      {/* Sheet */}
      <div
        ref={modalRef}
        className="relative bg-white w-full sm:max-w-4xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[95dvh] overflow-y-auto animate-in fade-in slide-in-from-bottom-12 sm:slide-in-from-bottom-8 sm:zoom-in-[0.98] duration-300 ease-out"
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
            <div
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/5 shadow-inner cursor-pointer group"
              onClick={() => setIsFullscreen(true)}
            >
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className={`bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full border border-black/8 ${product.stock > 0 ? "text-emerald-700" : "text-red-700"}`}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
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
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${(activeImage || product.image) === img
                      ? "border-[#c9963e]"
                      : "border-black/5 hover:border-black/20"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} preview ${idx}`}
                      className="w-full h-full object-contain p-1"
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
              style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: "1.4rem" }}
            >
              {product.name}
            </h2>
            <div className="mb-4">
              <span
                className="text-foreground"
                style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: "1.75rem" }}
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
                className="group/call relative flex-1 flex items-center justify-center gap-1.5 px-2 border border-black/15 bg-white/50 backdrop-blur-sm text-[#111] rounded-xl py-3 text-sm font-bold uppercase tracking-wide overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10 hover:border-black active:translate-y-0 active:scale-95"
              >
                <div className="absolute inset-0 bg-black translate-y-[100%] group-hover/call:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[45deg] group-hover/call:left-[100%] transition-all duration-700 ease-in-out z-10 pointer-events-none" />
                <Phone className="w-4 h-4 shrink-0 transition-colors duration-500 group-hover/call:text-white relative z-20" />
                <span className="whitespace-nowrap transition-colors duration-500 group-hover/call:text-white relative z-20">Call Now</span>
              </a>
              <a
                href={`https://wa.me/917974024513?text=${encodeURIComponent(`Hi, I'm interested in the *${product.name}* (Price: ₹${product.price.toLocaleString("en-IN")}). Could you provide more details?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/wa relative flex-1 flex items-center justify-center gap-1.5 px-2 bg-[#25D366] text-white rounded-xl py-3 text-sm font-bold uppercase tracking-wide overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#25D366]/40 active:translate-y-0 active:scale-95"
              >
                <div className="absolute inset-0 bg-[#128C7E] translate-y-[100%] group-hover/wa:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-[45deg] group-hover/wa:left-[100%] transition-all duration-700 ease-in-out delay-75 z-10 pointer-events-none" />
                <MessageCircle className="w-4 h-4 shrink-0 transition-transform duration-500 group-hover/wa:scale-110 group-hover/wa:-rotate-12 relative z-20" />
                <span className="whitespace-nowrap relative z-20">WhatsApp</span>
              </a>
            </div>

            {/* Specs */}
            {product.specs.length > 0 && (
              <div className="mb-5">
                <h4
                  className="text-foreground mb-3"
                  style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em" }}
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
                  style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em" }}
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
              style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: "1.1rem" }}
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
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black/[0.02] mb-3 flex items-center justify-center p-2">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
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
              className={`p-4 border-black/6 ${i % 2 === 0 ? "border-r" : ""
                } ${i < 2 ? "border-b" : ""
                } md:border-b-0 md:border-r md:last:border-r-0`}
            >
              <div className="text-foreground text-sm font-semibold mb-0.5" style={{ fontFamily: "'Roboto', sans-serif" }}>
                {b.label}
              </div>
              <div className="text-muted-foreground text-xs leading-relaxed">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Image Preview */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/95 backdrop-blur-md p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-3 bg-black/5 hover:bg-black/10 text-foreground rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImage || product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain animate-fade-in drop-shadow-xl"
          />
        </div>
      )}
    </div>
  );
}
