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
import { WhatsAppWidget } from "./components/WhatsAppWidget";
import { Skeleton } from "./components/ui/skeleton";
import type { Product, Category } from "./data/products";

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [productsState, setProductsState] = useState<Product[]>([]);
  const [categoriesState, setCategoriesState] = useState<Category[]>([]);
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
        // Fetch products
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList: Product[] = [];
        querySnapshot.forEach((docSnap) => {
          productsList.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });
        setProductsState(productsList);

        // Fetch categories
        const catSnapshot = await getDocs(collection(db, "categories"));
        const catList: string[] = [];
        catSnapshot.forEach((docSnap) => {
          catList.push(docSnap.data().name);
        });

        if (catList.length === 0) {
          const { allCategories: defaultCategories } = await import("./data/products");
          const batch = writeBatch(db);
          
          // Don't save "All" as a category in the DB since it's a structural filter element
          const filteredCategories = defaultCategories.filter(c => c !== "All");
          filteredCategories.forEach((catName) => {
            const docRef = doc(collection(db, "categories"));
            batch.set(docRef, { name: catName });
          });
          await batch.commit();

          setCategoriesState(["All", ...filteredCategories]);
        } else {
          setCategoriesState(["All", ...catList]);
        }

      } catch (err) {
        console.error("Error loading data from Firestore:", err);
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
      <div className="min-h-screen bg-white">
        {/* Navbar Skeleton */}
        <div className="h-16 border-b border-black/5 px-6 lg:px-8 flex items-center justify-between">
          <Skeleton className="h-8 w-40 bg-black/5" />
          <div className="hidden md:flex gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-20 bg-black/5" />
            ))}
          </div>
        </div>

        {/* Hero Skeleton */}
        <div className="h-[70vh] bg-black/[0.02] flex flex-col items-center justify-center gap-6 p-8">
          <Skeleton className="h-12 w-3/4 max-w-2xl bg-black/5" />
          <Skeleton className="h-16 w-4/5 max-w-3xl bg-black/5" />
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-12 w-36 rounded-full bg-black/5" />
            <Skeleton className="h-12 w-36 rounded-full bg-black/5" />
          </div>
        </div>

        {/* Catalog Skeleton */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="mb-12">
            <Skeleton className="h-4 w-32 mb-3 bg-black/5" />
            <Skeleton className="h-10 w-64 bg-black/5" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="col-span-1 hidden lg:block space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-4 bg-black/5" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-10 w-full rounded-xl bg-black/5" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-1 lg:col-span-3">
              <div className="flex gap-3 mb-8">
                <Skeleton className="h-12 w-full rounded-xl bg-black/5" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-black/5 p-5 flex flex-col gap-4">
                    <Skeleton className="aspect-[4/3] w-full rounded-xl bg-black/5" />
                    <Skeleton className="h-4 w-20 bg-black/5" />
                    <Skeleton className="h-6 w-full bg-black/5" />
                    <Skeleton className="h-4 w-full bg-black/5" />
                    <Skeleton className="h-8 w-24 bg-black/5 mt-auto" />
                    <div className="flex gap-2 mt-4">
                      <Skeleton className="h-10 w-full rounded-full bg-black/5" />
                      <Skeleton className="h-10 w-full rounded-full bg-black/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
            categories={categoriesState}
            initialCategory={catalogCategory}
            onViewDetails={setSelectedProduct}
            onContact={handleContactProduct}
          />
        </div>

        <div ref={inquiryRef}>
          <InquirySection defaultProduct={inquiryProduct} categories={categoriesState} />
        </div>

        <div ref={whyChooseRef}>
          <WhyChoose />
        </div>

        <div ref={categoriesRef}>
          <FeaturedCategories 
            categories={categoriesState} 
            products={productsState} 
            onSelectCategory={handleSelectCategory} 
          />
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
        allProducts={productsState}
        onSelectProduct={setSelectedProduct}
      />

      <WhatsAppWidget />
    </div>
  );
}
