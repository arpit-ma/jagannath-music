import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoSrc from "@/imports/IMG_0835.png";

interface NavbarProps {
  onNavigate: (section: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Products", section: "catalog" },
    { label: "Why Choose Us", section: "why-choose" },
    { label: "Categories", section: "categories" },
    { label: "Store Info", section: "store" },
    { label: "Contact", section: "inquiry" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.02)]"
          : "bg-white/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("top")}
          className="flex items-center gap-3 group transition-transform duration-300 active:scale-98"
        >
          <div className="relative w-10.5 h-10.5 rounded-full overflow-hidden border border-black/5 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <ImageWithFallback
              src={logoSrc.src}
              alt="Shree Jagannath Music logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight select-none">
            <span
              className="text-foreground font-bold tracking-tight text-[0.98rem] bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent group-hover:from-neutral-950 group-hover:to-[#c9963e] transition-all duration-300"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Shree Jagannath
            </span>
            <span
              className="text-[#c9963e] font-extrabold text-[0.62rem] transition-all duration-300 group-hover:letter-widest"
              style={{ letterSpacing: "0.22em", textTransform: "uppercase" }}
            >
              Music
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.section}
              onClick={() => onNavigate(link.section)}
              className="relative text-foreground/75 hover:text-[#c9963e] transition-colors text-sm font-semibold tracking-wide py-1.5 group/nav cursor-pointer"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#c9963e] transition-all duration-300 group-hover/nav:w-full" />
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href="tel:+917974024513"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#c9963e] transition-colors group/phone"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <div className="w-7 h-7 rounded-full bg-black/5 group-hover/phone:bg-[#c9963e]/10 flex items-center justify-center transition-colors">
              <Phone className="w-3.5 h-3.5 text-muted-foreground group-hover/phone:text-[#c9963e]" />
            </div>
            +91 79740 24513
          </a>
          <button
            onClick={() => onNavigate("inquiry")}
            className="bg-[#1a1a1a] hover:bg-[#c9963e] text-white px-5.5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-[#c9963e]/15 transform active:scale-95 cursor-pointer"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Get Quote
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white border-t border-border px-6 transition-all duration-300 ease-in-out overflow-hidden ${
          menuOpen ? "max-h-[340px] py-5 opacity-100 shadow-md" : "max-h-0 py-0 opacity-0 border-t-0"
        }`}
      >
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <button
              key={link.section}
              onClick={() => { onNavigate(link.section); setMenuOpen(false); }}
              className="text-left text-foreground font-semibold text-sm py-1.5 hover:text-[#c9963e] transition-colors"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { onNavigate("inquiry"); setMenuOpen(false); }}
            className="bg-[#1a1a1a] hover:bg-[#c9963e] text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider w-full mt-2 cursor-pointer transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Get a Quote
          </button>
        </div>
      </div>
    </header>
  );
}
