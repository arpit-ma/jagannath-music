import { ShieldCheck, Headphones, Music, BadgePercent, HelpCircle, HeartHandshake } from "lucide-react";

export function WhyChoose() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Genuine Products",
      desc: "Authentic musical instruments and professional audio equipment from authorized global brands.",
    },
    {
      icon: Headphones,
      title: "Expert Assistance",
      desc: "Professional recommendations and support from our experienced team of musicians and audio engineers.",
    },
    {
      icon: Music,
      title: "Wide Product Range",
      desc: "An extensive inventory of traditional Indian instruments and modern studio gear under one roof.",
    },
    {
      icon: HeartHandshake,
      title: "Competitive Pricing",
      desc: "Guaranteed excellent value, transparent pricing, and flexible EMI payment options.",
    },
    {
      icon: BadgePercent,
      title: "Store Discounts",
      desc: "Exclusive discounts and promotional offers available in-store throughout the year.",
    },
    {
      icon: HelpCircle,
      title: "Customer Support",
      desc: "Dedicated assistance before, during, and after your purchase to ensure complete satisfaction.",
    },
  ];

  return (
    <section id="why-choose" className="py-24 bg-white border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-[#c9963e] text-xs font-semibold tracking-[0.15em] uppercase mb-3">
            Why Choose Us
          </p>
          <h2
            className="text-foreground"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            The Trusted Choice for Musicians & Audio Professionals
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="group p-8 bg-[#f6f6f6] hover:bg-white rounded-3xl border border-transparent hover:border-[#c9963e]/20 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 flex flex-col items-start"
              >
                <div className="w-12 h-12 bg-white group-hover:bg-[#c9963e] rounded-2xl flex items-center justify-center border border-black/5 group-hover:border-[#c9963e] shadow-sm mb-6 transition-all duration-300">
                  <Icon className="w-6 h-6 text-[#c9963e] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3
                  className="text-foreground font-semibold text-lg mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {b.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
