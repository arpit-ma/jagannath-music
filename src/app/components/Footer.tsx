import { Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoSrc from "@/imports/IMG_0835.png";

interface FooterProps {
  onNavigate: (section: string) => void;
  onSelectCategory: (category: string) => void;
  categories: string[];
}

export function Footer({ onNavigate, onSelectCategory, categories }: FooterProps) {

  const quickLinks = [
    { label: "Product Catalog", section: "catalog" },
    { label: "Why Choose Us", section: "why-choose" },
    { label: "Featured Categories", section: "categories" },
    { label: "Get a Quote", section: "inquiry" },
    { label: "Store Location", section: "store" },
  ];

  return (
    <footer className="bg-[#0f0f0f] pt-12 pb-6 md:pt-16 md:pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <ImageWithFallback
                src={logoSrc.src}
                alt="Shree Jagannath Music logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <div className="text-white font-semibold text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  Shree Jagannath
                </div>
                <div className="text-white/30 text-[0.6rem] tracking-widest uppercase">Music</div>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              Your complete destination for musical instruments and professional audio equipment.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 bg-white/8 hover:bg-[#c9963e] rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4" style={{ fontFamily: "'Roboto', sans-serif" }}>
              Product Categories
            </h4>
            <ul className="space-y-2">
              {categories.filter(c => c !== "All").slice(0, 6).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className="text-white/40 hover:text-white text-sm transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4" style={{ fontFamily: "'Roboto', sans-serif" }}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.section)}
                    className="text-white/40 hover:text-white text-sm transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4" style={{ fontFamily: "'Roboto', sans-serif" }}>
              Contact Information
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c9963e] mt-0.5 flex-shrink-0" />
                <span className="text-white/40 text-sm leading-relaxed">
                  Shop No., EG 19, Rajiv Plaza, Old Bus Stand Road, Bus Stand Road, Bilaspur, Chhattisgarh – 495001
                </span>
              </li>
              <li>
                <a href="tel:+917974024513" className="flex items-center gap-2.5 text-white/40 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4 text-[#c9963e]" />
                  +91 79740 24513
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/917974024513"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-white/40 hover:text-white text-sm transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  +91 79740 24513
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Shree Jagannath Music. All rights reserved.
          </p>
          <p className="text-white/20 text-xs transition-colors select-none font-medium flex items-center gap-1.5">
            <span>Designed by</span>
            <a 
              href="https://wolfix.dev" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold text-white/35 hover:text-[#c9963e] transition-all duration-300 underline decoration-white/5 hover:decoration-transparent"
            >
              Wolfix.dev
            </a>
            <span className="text-white/10">•</span>
            <span>Managed by</span>
            <a 
              href="#" 
              className="font-semibold text-white/35 hover:text-[#c9963e] transition-all duration-300 underline decoration-white/5 hover:decoration-transparent"
            >
              cognitoo
            </a>
          </p>
          <p className="text-white/25 text-xs">
            Prices shown are indicative. Contact store for latest pricing.
          </p>
        </div>
      </div>
    </footer>
  );
}
