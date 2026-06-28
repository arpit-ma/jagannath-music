"use client";

import React from "react";

export function WhatsAppWidget() {
  const phoneNumber = "917974024513"; // Store phone number
  const message = encodeURIComponent("Hello! I am interested in inquiring about your musical instruments.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <>
      <style>{`
        @keyframes whatsapp-ripple {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        @keyframes whatsapp-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes whatsapp-entrance {
          0% {
            transform: translateY(40px) scale(0.9);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes shine-sweep {
          0% {
            left: -120%;
          }
          100% {
            left: 120%;
          }
        }
        .whatsapp-widget-animated {
          animation: whatsapp-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards, whatsapp-float 4s ease-in-out infinite 0.8s;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .whatsapp-widget-animated:hover {
          animation-play-state: paused;
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          border-color: rgba(37, 211, 102, 0.3);
        }
        .whatsapp-pulse-ring-1 {
          animation: whatsapp-ripple 2s infinite ease-out;
        }
        .whatsapp-pulse-ring-2 {
          animation: whatsapp-ripple 2s infinite ease-out 0.6s;
        }
        .shine-layer {
          position: absolute;
          top: 0;
          height: 100%;
          width: 40px;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          animation: shine-sweep 6s infinite linear;
        }
        .whatsapp-widget-animated:hover .shine-layer {
          animation: shine-sweep 1.5s infinite linear;
        }
      `}</style>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-widget-animated fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-white border border-black/10 rounded-full pl-3.5 pr-5 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden cursor-pointer select-none"
        style={{ fontFamily: "'Roboto', sans-serif" }}
        id="whatsapp-floating-widget"
      >
        {/* Shine Sweep Overlay */}
        <div className="shine-layer pointer-events-none" />

        {/* WhatsApp Icon wrapper with double animated ripple rings */}
        <div className="relative w-7.5 h-7.5 flex items-center justify-center bg-[#25D366] rounded-full text-white shadow-sm transition-transform duration-300 group-hover:scale-105 z-10">
          <div className="whatsapp-pulse-ring-1 absolute inset-0 rounded-full bg-[#25D366]/40 pointer-events-none" />
          <div className="whatsapp-pulse-ring-2 absolute inset-0 rounded-full bg-[#25D366]/30 pointer-events-none" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="w-4.5 h-4.5 fill-current z-10 relative"
          >
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
        </div>

        <span className="text-[#333333] text-sm font-semibold tracking-wide z-10 relative">
          Chat with us
        </span>
      </a>
    </>
  );
}
