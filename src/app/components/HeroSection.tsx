import { useState, useEffect, useRef } from "react";
import { ArrowDown, Tag } from "lucide-react";

interface AnimatedCounterProps {
  value: string;
  index: number;
}

function AnimatedCounter({ value, index }: AnimatedCounterProps) {
  const [count, setCount] = useState<string>(" ");

  useEffect(() => {
    const numericPart = value.match(/\d+/);
    if (!numericPart) {
      // Typewriter effect for text values
      let currentText = "";
      let charIndex = 0;
      let intervalId: NodeJS.Timeout;

      const delayTimeout = setTimeout(() => {
        intervalId = setInterval(() => {
          if (charIndex < value.length) {
            currentText += value[charIndex];
            setCount(currentText);
            charIndex++;
          } else {
            clearInterval(intervalId);
          }
        }, 80); // 80ms per character
      }, index * 150); // Delay typing based on staggered card entrance

      return () => {
        clearTimeout(delayTimeout);
        if (intervalId) clearInterval(intervalId);
      };
    }

    const targetNumber = parseInt(numericPart[0], 10);
    const suffix = value.replace(numericPart[0], "");
    const start = 0;
    const end = targetNumber;
    if (start === end) return;

    const totalDuration = 1500; // 1.5 seconds animation
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      // Easing curve (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + (end - start) * ease);

      setCount(`${current}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, index]);

  return <span>{count}</span>;
}

interface HeroSectionProps {
  onBrowse: () => void;
  onContact: () => void;
}

export function HeroSection({ onBrowse, onContact }: HeroSectionProps) {
  const [animate, setAnimate] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [isFading, setIsFading] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const englishRef = useRef<HTMLHeadingElement>(null);
  const hindiRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setAnimate(true);

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setLang((prev) => (prev === "en" ? "hi" : "en"));
        setIsFading(false);
      }, 500); // Wait for fade-out to complete (500ms)
    }, 6000); // Switch every 6 seconds (6000ms)

    return () => clearInterval(interval);
  }, []);

  // Measure dynamic heights of both elements to set container height precisely
  useEffect(() => {
    const handleResize = () => {
      const enHeight = englishRef.current?.getBoundingClientRect().height || 0;
      const hiHeight = hindiRef.current?.getBoundingClientRect().height || 0;
      setContainerHeight(Math.max(enHeight, hiHeight));
    };

    // Calculate immediately and also after images/fonts might render
    handleResize();
    const timeoutId = setTimeout(handleResize, 150);

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [lang]); // Re-measure on state toggles and resizing

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#0a0a0a]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1800&h=1200&fit=crop&auto=format"
          alt="Musician playing guitar in dim light"
          className="w-full h-full object-cover opacity-30"
          style={{ objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 lg:px-8 pt-32 pb-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 w-fit mb-10">
          <Tag className="w-3.5 h-3.5 text-[#c9963e] flex-shrink-0" />
          <span className="text-white/90 text-[10px] sm:text-xs font-medium tracking-wider sm:tracking-widest uppercase">
            Exclusive Store Discounts Available
          </span>
        </div>

        {/* Headline Container with dynamic heights to prevent layout shifts */}
        <div 
          className="relative w-full transition-all duration-300 ease-out" 
          style={{ height: containerHeight ? `${containerHeight}px` : "auto" }}
        >
          {/* English Version */}
          <h1
            ref={englishRef}
            className={`absolute top-0 left-0 w-full text-white max-w-3xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
              lang === "en" && !isFading ? "opacity-100 translate-y-0 blur-none pointer-events-auto" : "opacity-0 -translate-y-2 blur-[2px] pointer-events-none"
            }`}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(1.8rem, 4.8vw, 3.8rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Chhattisgarh’s Most Trusted Destination for Musical Instruments &{" "}
            <span className="text-[#c9963e]">Pro Audio</span>
          </h1>

          {/* Hindi Version */}
          <h1
            ref={hindiRef}
            className={`absolute top-0 left-0 w-full text-white max-w-3xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
              lang === "hi" && !isFading ? "opacity-100 translate-y-0 blur-none pointer-events-auto" : "opacity-0 -translate-y-2 blur-[2px] pointer-events-none"
            }`}
            style={{
              fontFamily: "'Noto Sans Devanagari', 'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(1.6rem, 4.2vw, 3.4rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            श्री जगन्नाथ म्यूजिक: वाद्य यंत्रों और{" "}
            <span className="text-[#c9963e]">प्रोफेशनल ऑडियो</span> के लिए छत्तीसगढ़ का सबसे भरोसेमंद नाम।
          </h1>
        </div>

        <p className="mt-6 text-white/60 max-w-xl text-lg leading-relaxed">
          Explore premium instruments, studio gear, live sound equipment, and
          exclusive in-store offers — all under one roof.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-10 w-full sm:w-auto">
          <button
            onClick={onBrowse}
            className="bg-white text-[#0a0a0a] px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#c9963e] hover:text-white transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Browse Products
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={onContact}
            className="border border-white/30 text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:border-white/60 hover:bg-white/5 transition-all duration-200 text-center w-full sm:w-auto"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Contact Store
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mt-20 pt-10 border-t border-white/10">
          {[
            { value: "500+", label: "Products in Store" },
            { value: "15+", label: "Top Brands" },
            { value: "Expert", label: "Guidance Available" },
            { value: "Genuine", label: "Products, Warranty Support" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="transition-all duration-1000 ease-out transform"
              style={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div
                className="text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.5rem", fontWeight: 700 }}
              >
                <AnimatedCounter value={stat.value} index={i} />
              </div>
              <div className="text-white/40 text-sm mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
