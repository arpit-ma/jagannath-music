"use client";

import { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  User 
} from "firebase/auth";
import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  getDoc,
  setDoc 
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { AdminDashboard } from "../components/AdminDashboard";
import type { Product, CategoryItem } from "../data/products";
import { Lock, Mail, Key, Sparkles, UserPlus, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  
  // Setup/Signup capability lock state
  const [signupDisabled, setSignupDisabled] = useState(false);
  const [checkingSignupStatus, setCheckingSignupStatus] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [authActionLoading, setAuthActionLoading] = useState(false);

  // Dashboard state & CRUD
  const [productsState, setProductsState] = useState<Product[]>([]);
  const [categoriesState, setCategoriesState] = useState<CategoryItem[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchDashboardData();
      }
    });
    return () => unsubscribe();
  }, []);

  // Check if signup is disabled (one-time signup check)
  useEffect(() => {
    const checkSignupStatus = async () => {
      try {
        const configRef = doc(db, "system", "config");
        const configSnap = await getDoc(configRef);
        if (configSnap.exists() && configSnap.data().adminCreated === true) {
          setSignupDisabled(true);
        } else {
          setSignupDisabled(false);
        }
      } catch (err) {
        console.error("Error checking signup configuration status:", err);
      } finally {
        setCheckingSignupStatus(false);
      }
    };
    checkSignupStatus();
  }, [user]);

  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    try {
      const pSnapshot = await getDocs(collection(db, "products"));
      const pList: Product[] = [];
      pSnapshot.forEach((docSnap) => {
        pList.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      setProductsState(pList);

      const cSnapshot = await getDocs(collection(db, "categories"));
      const cList: CategoryItem[] = [];
      cSnapshot.forEach((docSnap) => {
        cList.push({ id: docSnap.id, name: docSnap.data().name });
      });
      setCategoriesState(cList);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Firestore CRUD Actions for AdminDashboard
  const handleAddProduct = async (productData: Omit<Product, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "products"), productData);
      const newProduct: Product = { id: docRef.id, ...productData };
      setProductsState((prev) => [...prev, newProduct]);
    } catch (err) {
      console.error("Error adding product to Firestore:", err);
      throw err;
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, updates);
      setProductsState((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    } catch (err) {
      console.error("Error updating product in Firestore:", err);
      throw err;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const docRef = doc(db, "products", id);
      await deleteDoc(docRef);
      setProductsState((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product from Firestore:", err);
      throw err;
    }
  };

  // Category CRUD
  const handleAddCategory = async (name: string) => {
    try {
      const docRef = await addDoc(collection(db, "categories"), { name });
      const newCategory: CategoryItem = { id: docRef.id, name };
      setCategoriesState((prev) => [...prev, newCategory]);
    } catch (err) {
      console.error("Error adding category:", err);
      throw err;
    }
  };

  const handleUpdateCategory = async (id: string, newName: string) => {
    try {
      const docRef = doc(db, "categories", id);
      await updateDoc(docRef, { name: newName });
      setCategoriesState((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
      );
    } catch (err) {
      console.error("Error updating category:", err);
      throw err;
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      // Find the category name first to check if any products use it
      const categoryToDelete = categoriesState.find(c => c.id === id);
      if (categoryToDelete) {
        const inUse = productsState.some(p => p.category === categoryToDelete.name);
        if (inUse) {
          throw new Error(`Cannot delete category "${categoryToDelete.name}" because it is currently assigned to one or more products. Please update those products before deleting this category.`);
        }
      }

      const docRef = doc(db, "categories", id);
      await deleteDoc(docRef);
      setCategoriesState((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Submit Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setAuthActionLoading(true);

    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      setAuthActionLoading(false);
      return;
    }

    try {
      if (authMode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }
        // Extra client-side verification check
        const configRef = doc(db, "system", "config");
        const configSnap = await getDoc(configRef);
        if (configSnap.exists() && configSnap.data().adminCreated === true) {
          throw new Error("Signup is permanently disabled. An admin already exists.");
        }

        // Register user
        await createUserWithEmailAndPassword(auth, email, password);
        
        // Write signup lock to database
        await setDoc(configRef, { adminCreated: true }, { merge: true });
        setSignupDisabled(true);
        setSuccessMsg("Administrator account successfully created!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      setErrorMsg(err.message || "An authentication error occurred.");
    } finally {
      setAuthActionLoading(false);
    }
  };

  if (loading || checkingSignupStatus) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-[#c9963e] animate-spin mb-4" />
        <p className="text-white/50 text-sm font-semibold tracking-wide animate-pulse">
          Securing Management Portal Portal...
        </p>
      </div>
    );
  }

  // User is Logged In
  if (user) {
    if (dashboardLoading) {
      return (
        <div className="min-h-screen bg-[#f6f6f6] flex flex-col items-center justify-center font-sans">
          <div className="w-12 h-12 rounded-full border-4 border-black/5 border-t-[#c9963e] animate-spin mb-4" />
          <p className="text-muted-foreground text-sm font-semibold tracking-wide">
            Loading Shree Jagannath Music Catalog...
          </p>
        </div>
      );
    }

    return (
      <AdminDashboard
        products={productsState}
        categories={categoriesState}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onBackToStore={handleLogout}
      />
    );
  }

  // Auth UI (Login / Sign Up)
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 font-sans select-none relative overflow-hidden">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#c9963e]/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-amber-600/5 blur-[120px]" />

      <div className="w-full max-w-md bg-[#121212]/90 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-[#c9963e]/15 border border-[#c9963e]/30 rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-[#c9963e]" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Roboto', sans-serif" }}>
            {authMode === "login" ? "Admin Access Control" : "Create Administrator Account"}
          </h2>
          <p className="text-white/40 text-xs mt-1.5 leading-relaxed">
            {authMode === "login" 
              ? "Verify credentials to access store management dashboard"
              : "Register the primary administrator account for this storefront"}
          </p>
        </div>

        {/* Message banners */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-2xl text-xs mb-6 font-medium leading-relaxed">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-2xl text-xs mb-6 font-medium leading-relaxed">
            {successMsg}
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 select-text">
          <div>
            <label className="block text-white/50 text-[10px] font-bold uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                required
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/5 focus:border-[#c9963e]/40 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#c9963e]/10 placeholder:text-white/20 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/50 text-[10px] font-bold uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/5 focus:border-[#c9963e]/40 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#c9963e]/10 placeholder:text-white/20 transition-all font-medium"
              />
            </div>
          </div>

          {authMode === "signup" && (
            <div>
              <label className="block text-white/50 text-[10px] font-bold uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 focus:border-[#c9963e]/40 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#c9963e]/10 placeholder:text-white/20 transition-all font-medium"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={authActionLoading}
            className="w-full bg-[#c9963e] hover:bg-[#b8852e] text-white py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-[#c9963e]/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-6"
          >
            {authActionLoading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            ) : authMode === "login" ? (
              <>
                <LogIn className="w-4 h-4" />
                Verify and Login
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Administrator
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3 items-center text-center">
          {authMode === "login" ? (
            !signupDisabled ? (
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-xs text-[#c9963e] hover:underline font-semibold"
              >
                No administrator account? Set up now
              </button>
            ) : (
              <span className="text-[10px] text-white/20 font-bold uppercase tracking-wider">
                Registration is locked
              </span>
            )
          ) : (
            <button
              onClick={() => {
                setAuthMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1 font-semibold"
            >
              Already registered? Return to Login
            </button>
          )}

          <Link
            href="/"
            className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5 mt-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
