import { MapPin, Phone, MessageCircle, Clock, Navigation } from "lucide-react";

export function StoreInfo() {
  const hours = [
    { day: "Monday – Friday", time: "10:00 AM – 8:00 PM" },
    { day: "Saturday", time: "9:00 AM – 9:00 PM" },
    { day: "Sunday", time: "11:00 AM – 6:00 PM" },
  ];

  return (
    <section id="store" className="py-12 md:py-20 lg:py-24 bg-[#f6f6f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[#c9963e] text-xs font-semibold tracking-[0.15em] uppercase mb-3">
            Visit Us
          </p>
          <h2
            className="text-foreground"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, lineHeight: 1.15 }}
          >
            Store Information
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map placeholder */}
          <div className="lg:col-span-2 bg-white rounded-3xl overflow-hidden border border-black/8 relative min-h-[250px] md:min-h-[360px]">
            <img
              src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&h=500&fit=crop&auto=format"
              alt="City map view"
              className="w-full h-full object-cover opacity-60"
            />
            {/* Map overlay pin */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-xs text-center">
                <div className="w-12 h-12 bg-[#0a0a0a] rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-[#c9963e]" />
                </div>
                <div
                  className="text-foreground font-semibold mb-1"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  Shree Jagannath Music
                </div>
                <div className="text-muted-foreground text-xs mb-4">
                  Shop No., EG 19, Rajiv Plaza,<br />
                  Old Bus Stand Road, Bus Stand Road,<br />
                  Bilaspur, Chhattisgarh – 495001
                </div>
                <a
                  href="https://maps.app.goo.gl/PQwEgyWEyrNg3FNd7?g_st=ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-foreground text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#c9963e] transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="flex flex-col gap-4">
            {/* Address */}
            <div className="bg-white rounded-2xl p-5 border border-black/8">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-[#f6f6f6] rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#c9963e]" />
                </div>
                <span className="font-semibold text-foreground text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>Address</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Shop No., EG 19, Rajiv Plaza,<br />
                Old Bus Stand Road, Bus Stand Road,<br />
                Bilaspur, Chhattisgarh – 495001<br />
                India
              </p>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl p-5 border border-black/8">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-[#f6f6f6] rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#c9963e]" />
                </div>
                <span className="font-semibold text-foreground text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>Contact</span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="tel:+917974024513" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Phone className="w-3.5 h-3.5" /> +91 79740 24513
                </a>
                <a
                  href="https://wa.me/917974024513"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> +91 79740 24513 (WhatsApp)
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-5 border border-black/8 flex-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-[#f6f6f6] rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#c9963e]" />
                </div>
                <span className="font-semibold text-foreground text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>Business Hours</span>
              </div>
              <div className="space-y-2">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-sm gap-4">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className="text-foreground font-medium whitespace-nowrap">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
