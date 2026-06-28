"use client";

import { useState } from "react";
import { Phone, MessageCircle, Send, CheckCircle2, Loader2 } from "lucide-react";
import type { Category } from "../data/products";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface InquirySectionProps {
  defaultProduct?: string;
  categories: Category[];
}

export function InquirySection({ defaultProduct = "", categories }: InquirySectionProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    product: defaultProduct,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        ...form,
        createdAt: serverTimestamp(),
        status: "Pending", // Pending, Contacted
      });
      setSubmitted(true);
      setForm({
        name: "",
        phone: "",
        email: "",
        city: "",
        product: defaultProduct,
        message: "",
      });
    } catch (err) {
      console.error("Failed to write inquiry to Firestore:", err);
      alert("Something went wrong. Please try calling or sending a WhatsApp message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="inquiry" className="py-12 md:py-20 lg:py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #c9963e 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left */}
          <div>
            <p className="text-[#c9963e] text-xs font-semibold tracking-[0.15em] uppercase mb-4">
              Get in Touch
            </p>
            <h2
              className="text-white mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.75rem)", fontWeight: 700, lineHeight: 1.1 }}
            >
              Get the Best Price & Store Discounts
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-10 max-w-md">
              Contact us for exclusive pricing, product availability, EMI options, and personalized recommendations from our music experts.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <a
                href="tel:+917974024513"
                className="flex items-center justify-center gap-2.5 bg-white text-[#0a0a0a] px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-[#c9963e] hover:text-white transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href={`https://wa.me/917974024513?text=${encodeURIComponent("Hello! I am interested in inquiring about your musical instruments.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#25D366] text-white px-6 py-3.5 rounded-full text-sm font-semibold hover:bg-[#128C7E] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Inquiry
              </a>
            </div>

            {/* Why reach out */}
            <div className="space-y-4">
              {[
                { title: "Best Price Guarantee", desc: "We match or beat any genuine quote" },
                { title: "EMI Options Available", desc: "Easy financing on select products" },
                { title: "Home Delivery", desc: "Pan-India shipping for select items" },
                { title: "In-Store Demos", desc: "Try before you buy at our store" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#c9963e] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {item.title}
                    </div>
                    <div className="text-white/40 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-5 md:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#c9963e]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#c9963e]" />
                </div>
                <h3
                  className="text-white mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "1.25rem" }}
                >
                  Inquiry Sent!
                </h3>
                <p className="text-white/50 text-sm mb-6">
                  We'll get back to you within a few hours. For urgent queries, please call or WhatsApp us directly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[#c9963e] text-sm font-medium hover:text-white transition-colors"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3
                  className="text-white mb-6"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "1.1rem" }}
                >
                  Send an Inquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 font-medium">Name *</label>
                    <input
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9963e]/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 font-medium">Phone *</label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9963e]/60 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-medium">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9963e]/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-medium">City</label>
                  <input
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9963e]/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-medium">Product Interested In</label>
                  <select
                    name="product"
                    value={form.product}
                    onChange={handleChange}
                    className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9963e]/60 transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    <option value="" className="bg-[#1a1a1a]">Select a category</option>
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-medium">Message</label>
                  <textarea
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what you're looking for, your budget, or any questions…"
                    className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9963e]/60 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#c9963e] text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#b8852e] transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {loading ? "Sending Inquiry..." : "Send Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
