"use client";

import { useState, useRef, useEffect } from "react";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "./lib/firebase";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { FeaturedCategories } from "./components/FeaturedCategories";
import { ProductCatalog } from "./components/ProductCatalog";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { InquirySection } from "./components/InquirySection";
import { WhyChoose } from "./components/WhyChoose";
import { StoreInfo } from "./components/StoreInfo";
import { Footer } from "./components/Footer";
import type { Product, Category } from "./data/products";

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [productsState, setProductsState] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [catalogCategory, setCatalogCategory] = useState<Category | undefined>(undefined);
  const [inquiryProduct, setInquiryProduct] = useState("");

  const catalogRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const inquiryRef = useRef<HTMLDivElement>(null);
  const whyChooseRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch products from Firestore (with automatic seeding fallback)
  useEffect(() => {
    if (!mounted) return;

    const fetchAndSeed = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList: Product[] = [];
        querySnapshot.forEach((docSnap) => {
          productsList.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });

        if (productsList.length === 0) {
          // If Firestore is empty, seed it with the default list
          const { products: defaultProducts } = await import("./data/products");
          const batch = writeBatch(db);
          
          defaultProducts.forEach((p) => {
            const docRef = doc(collection(db, "products"));
            const { id, ...rest } = p; // Remove temporary client-side ID
            batch.set(docRef, { ...rest });
          });
          await batch.commit();

          // Fetch the populated database
          const seededSnapshot = await getDocs(collection(db, "products"));
          const seededList: Product[] = [];
          seededSnapshot.forEach((docSnap) => {
            seededList.push({ id: docSnap.id, ...docSnap.data() } as Product);
          });
          setProductsState(seededList);
        } else {
          setProductsState(productsList);
        }
      } catch (err) {
        console.error("Error loading products from Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSeed();
  }, [mounted]);

  const scrollSmoothTo = (targetY: number) => {
    const startPosition = window.scrollY;
    const distance = targetY - startPosition;
    const duration = 1200;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    const navbarHeight = 64;
    const extraSpacing = 16;
    const targetPosition = ref.current.getBoundingClientRect().top + window.scrollY - navbarHeight - extraSpacing;
    scrollSmoothTo(targetPosition);
  };

  const handleNavigate = (section: string) => {
    switch (section) {
      case "top":
        scrollSmoothTo(0);
        break;
      case "catalog":
        scrollTo(catalogRef);
        break;
      case "categories":
        scrollTo(categoriesRef);
        break;
      case "why-choose":
        scrollTo(whyChooseRef);
        break;
      case "inquiry":
        scrollTo(inquiryRef);
        break;
      case "store":
        scrollTo(storeRef);
        break;
    }
  };

  const handleSelectCategory = (category: Category) => {
    setCatalogCategory(category);
    setTimeout(() => scrollTo(catalogRef), 150);
  };

  const handleContactProduct = (product: Product) => {
    setSelectedProduct(null);
    setInquiryProduct(product.category);
    setTimeout(() => scrollTo(inquiryRef), 100);
  };

  if (!mounted) {
    return null;
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-[#c9963e] animate-spin mb-4" />
        <p className="text-white/50 text-sm font-semibold tracking-wide animate-pulse" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Synchronizing Shree Jagannath Music Database...
        </p>
      </div>
    );
  }

  // Default Storefront Render View
  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={handleNavigate} />

      <main>
        <HeroSection
          onBrowse={() => scrollTo(catalogRef)}
          onContact={() => scrollTo(inquiryRef)}
        />

        <div ref={catalogRef}>
          <ProductCatalog
            products={productsState}
            initialCategory={catalogCategory}
            onViewDetails={setSelectedProduct}
            onContact={handleContactProduct}
          />
        </div>

        <div ref={inquiryRef}>
          <InquirySection defaultProduct={inquiryProduct} />
        </div>

        <div ref={whyChooseRef}>
          <WhyChoose />
        </div>

        <div ref={categoriesRef}>
          <FeaturedCategories onSelectCategory={handleSelectCategory} />
        </div>

        <div ref={storeRef}>
          <StoreInfo />
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onContact={handleContactProduct}
      />
    </div>
  );
}
