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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-black/8 shadow-sm"
          : "bg-white/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("top")}
          className="flex items-center gap-2.5 group"
        >
          <ImageWithFallback
            src={logoSrc.src}
            alt="Shree Jagannath Music logo"
            className="w-10 h-10 object-contain"
          />
          <div className="flex flex-col leading-none">
            <span
              className="text-foreground font-semibold tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.9rem" }}
            >
              Shree Jagannath
            </span>
            <span
              className="text-muted-foreground"
              style={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase" }}
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
              className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium tracking-wide"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+917974024513"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            +91 79740 24513
          </a>
          <button
            onClick={() => onNavigate("inquiry")}
            className="bg-foreground text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-accent transition-colors cursor-pointer"
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
          menuOpen ? "max-h-[300px] py-4 opacity-100" : "max-h-0 py-0 opacity-0 border-t-0"
        }`}
      >
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <button
              key={link.section}
              onClick={() => { onNavigate(link.section); setMenuOpen(false); }}
              className="text-left text-foreground font-medium py-1"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { onNavigate("inquiry"); setMenuOpen(false); }}
            className="bg-foreground text-white px-5 py-2.5 rounded-full text-sm font-medium w-full mt-1 cursor-pointer"
          >
            Get a Quote
          </button>
        </div>
      </div>
    </header>
  );
}
