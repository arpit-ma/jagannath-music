"use client";

import { useState } from "react";
import { MapPin, Phone, MessageCircle, Clock, Navigation, ExternalLink, Copy, Check } from "lucide-react";

export function StoreInfo() {
  const [copied, setCopied] = useState(false);

  const hours = [
    { day: "Monday – Saturday", time: "10:30 AM – 8:30 PM" },
    { day: "Sunday", time: "Closed" },
  ];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(
      "Shop No., EG 19, Rajiv Plaza, Old Bus Stand Road, Bus Stand Road, Bilaspur, Chhattisgarh – 495001"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine if store is currently open
  const getStoreStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const hours24 = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours24 * 60 + minutes;

    if (day === 0) return { open: false, label: "Closed Today" };

    const openTime = 10 * 60 + 30;  // 10:30 AM
    const closeTime = 20 * 60 + 30; // 8:30 PM

    if (currentMinutes >= openTime && currentMinutes < closeTime) {
      const minsLeft = closeTime - currentMinutes;
      if (minsLeft <= 60) return { open: true, label: `Closing soon · ${minsLeft}m left` };
      return { open: true, label: "Open Now" };
    }
    if (currentMinutes < openTime) return { open: false, label: "Opens at 10:30 AM" };
    return { open: false, label: "Closed · Opens Tomorrow" };
  };

  const status = getStoreStatus();

  return (
    <section id="store" className="relative py-16 md:py-24 lg:py-28 bg-[#0a0a0a] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#c9963e]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#c9963e]/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#c9963e] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Visit Us In Store
          </p>
          <h2
            className="text-white mb-4"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 700, lineHeight: 1.15 }}
          >
            Find Our Store
          </h2>
          <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
            Visit us for a hands-on experience with our full range of instruments and professional audio gear.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Embedded Google Map */}
          <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-white/8 relative group min-h-[350px] md:min-h-[460px] bg-[#141414]">
            <iframe
              src="https://maps.google.com/maps?q=Shree+Jagannath+Music,+Rajiv+Plaza,+Bilaspur,+Chhattisgarh+495001&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "350px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shree Jagannath Music Location"
              className="absolute inset-0 w-full h-full"
            />

            {/* Floating status badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      status.open ? "bg-emerald-400 animate-ping" : "bg-red-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      status.open ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                </span>
                <span className="text-white text-xs font-semibold">{status.label}</span>
              </div>
            </div>

            {/* Open in Maps button */}
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href="https://maps.app.goo.gl/PQwEgyWEyrNg3FNd7?g_st=ac"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#c9963e] hover:bg-[#b8852e] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-[#c9963e]/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                Open in Google Maps
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Info cards column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Address card */}
            <div className="bg-[#141414] rounded-2xl p-6 border border-white/6 hover:border-white/12 transition-all group/card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#c9963e]/10 border border-[#c9963e]/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-4.5 h-4.5 text-[#c9963e]" />
                  </div>
                  <span className="font-semibold text-white text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>
                    Store Address
                  </span>
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                  title="Copy address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Shop No., EG 19, Rajiv Plaza,<br />
                Old Bus Stand Road, Bus Stand Road,<br />
                Bilaspur, Chhattisgarh – 495001<br />
                <span className="text-white/30">India</span>
              </p>
              {copied && (
                <p className="text-emerald-400/70 text-xs mt-2 font-medium">Address copied to clipboard!</p>
              )}
            </div>

            {/* Contact card */}
            <div className="bg-[#141414] rounded-2xl p-6 border border-white/6 hover:border-white/12 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#c9963e]/10 border border-[#c9963e]/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-4.5 h-4.5 text-[#c9963e]" />
                </div>
                <span className="font-semibold text-white text-sm" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  Get in Touch
                </span>
              </div>
              <div className="space-y-2.5">
                <a
                  href="tel:+917974024513"
                  className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-all group/link px-3 py-2.5 rounded-xl hover:bg-white/5 -mx-3"
                >
                  <div className="w-8 h-8 bg-white/5 group-hover/link:bg-white/10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-medium">+91 79740 24513</div>
                    <div className="text-[11px] text-white/25 mt-0.5">Tap to call</div>
                  </div>
                </a>
                <a
                  href="https://wa.me/917974024513"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-all group/link px-3 py-2.5 rounded-xl hover:bg-[#25D366]/5 -mx-3"
                >
                  <div className="w-8 h-8 bg-[#25D366]/10 group-hover/link:bg-[#25D366]/15 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  </div>
                  <div>
                    <div className="font-medium">+91 79740 24513</div>
                    <div className="text-[11px] text-white/25 mt-0.5">Chat on WhatsApp</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Hours card */}
            <div className="bg-[#141414] rounded-2xl p-6 border border-white/6 hover:border-white/12 transition-all flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#c9963e]/10 border border-[#c9963e]/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-4.5 h-4.5 text-[#c9963e]" />
                </div>
                <div>
                  <span className="font-semibold text-white text-sm block" style={{ fontFamily: "'Roboto', sans-serif" }}>
                    Business Hours
                  </span>
                  <span className={`text-[11px] font-semibold ${status.open ? "text-emerald-400/80" : "text-red-400/80"}`}>
                    {status.label}
                  </span>
                </div>
              </div>
              <div className="space-y-0">
                {hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between text-sm gap-4 py-2.5 border-b border-white/5 last:border-0"
                  >
                    <span className="text-white/40">{h.day}</span>
                    <span className={`font-medium whitespace-nowrap ${h.time === "Closed" ? "text-red-400/70" : "text-white/80"}`}>
                      {h.time}
                    </span>
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
