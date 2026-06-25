import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Sparkles, Folder, Tag, AlertCircle, Eye, LogOut, CheckCircle2, Search, RefreshCw, Mail, PhoneCall, MapPin, Calendar, Check, Loader2 } from "lucide-react";
import type { Product, Category, Availability } from "../data/products";
import { allCategories, brands } from "../data/products";
import { db, storage } from "../lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, "id">) => Promise<void>;
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onBackToStore: () => void;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=600&fit=crop&auto=format";

export function AdminDashboard({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onBackToStore
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"products" | "inquiries">("products");
  
  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [inquirySearch, setInquirySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Contacted">("All");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMultiple, setUploadingMultiple] = useState(false);

  const compressImage = (file: File): Promise<Blob | File> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const MAX_SIZE = 1200;
          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                  type: "image/jpeg",
                  lastModified: Date.now()
                }));
              } else {
                resolve(file);
              }
            },
            "image/jpeg",
            0.8
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async (file: File | Blob): Promise<string> => {
    const name = (file as File).name || "image.jpg";
    const cleanedName = name.replace(/[^a-zA-Z0-9.-]/g, "_");

    try {
      const formData = new FormData();
      formData.append("file", file, cleanedName);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Upload failed (Status ${res.status})`);
      }
      const data = await res.json();
      return data.url;
    } catch (apiErr: any) {
      console.warn("API upload failed, falling back to Firebase Storage:", apiErr);
      const storageRef = ref(storage, `products/${Date.now()}-${cleanedName}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const compressedFile = await compressImage(file);
      const url = await uploadFile(compressedFile);
      setForm(prev => ({ ...prev, image: url }));
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(`Failed to upload the image: ${err.message || err}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMultiple(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const compressedFile = await compressImage(file);
        return await uploadFile(compressedFile);
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
    } catch (err: any) {
      console.error("Multiple upload error:", err);
      alert(`Failed to upload some images: ${err.message || err}`);
    } finally {
      setUploadingMultiple(false);
    }
  };

  const removeAdditionalImage = (indexToRemove: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setInquiries(list);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (activeTab === "inquiries") {
      fetchInquiries();
    }
  }, [activeTab]);

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const docRef = doc(db, "inquiries", id);
      await updateDoc(docRef, { status: newStatus });
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const docRef = doc(db, "inquiries", id);
      await deleteDoc(docRef);
      setInquiries(prev => prev.filter(inq => inq.id !== id));
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
      alert("Failed to delete inquiry.");
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchStatus = statusFilter === "All" || inq.status === statusFilter;
    const matchSearch = inq.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                        (inq.product && inq.product.toLowerCase().includes(inquirySearch.toLowerCase()));
    return matchStatus && matchSearch;
  });

  // Form State
  const [form, setForm] = useState({
    name: "",
    brand: "Yamaha",
    otherBrand: "",
    category: "Guitar" as Category,
    price: 0,
    availability: "In Stock" as Availability,
    image: "",
    images: [] as string[],
    shortDescription: "",
    fullDescription: "",
    featuresText: "",
    specsText: ""
  });

  const resetForm = () => {
    setForm({
      name: "",
      brand: "Yamaha",
      otherBrand: "",
      category: "Guitar",
      price: 0,
      availability: "In Stock",
      image: "",
      images: [],
      shortDescription: "",
      fullDescription: "",
      featuresText: "",
      specsText: ""
    });
    setEditingProduct(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      brand: brands.includes(p.brand) ? p.brand : "Other Brands",
      otherBrand: brands.includes(p.brand) ? "" : p.brand,
      category: p.category,
      price: p.price,
      availability: p.availability,
      image: p.image === DEFAULT_IMAGE ? "" : p.image,
      images: p.images || [],
      shortDescription: p.shortDescription || "",
      fullDescription: p.fullDescription || "",
      featuresText: p.features ? p.features.join(", ") : "",
      specsText: p.specs ? p.specs.map(s => `${s.label}: ${s.value}`).join("\n") : ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.price <= 0) {
      alert("Please provide a valid product name and price.");
      return;
    }

    setSaving(true);
    try {
      const finalBrand = form.brand === "Other Brands" ? (form.otherBrand || "Other Brands") : form.brand;
      const parsedFeatures = form.featuresText
        ? form.featuresText.split(",").map(f => f.trim()).filter(Boolean)
        : [];
      
      const parsedSpecs = form.specsText
        ? form.specsText.split("\n").map(line => {
            const parts = line.split(":");
            if (parts.length >= 2) {
              return { label: parts[0].trim(), value: parts.slice(1).join(":").trim() };
            }
            return null;
          }).filter(Boolean) as { label: string; value: string }[]
        : [];

      const payload = {
        name: form.name,
        brand: finalBrand,
        category: form.category,
        price: Number(form.price),
        availability: form.availability,
        image: form.image.trim() || DEFAULT_IMAGE,
        images: form.images,
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        features: parsedFeatures,
        specs: parsedSpecs
      };

      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, payload);
      } else {
        await onAddProduct(payload);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving the product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await onDeleteProduct(id);
      setIsDeletingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete the product.");
    } finally {
      setSaving(false);
    }
  };

  // Calculations
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalCatalogValue = products.reduce((acc, p) => acc + p.price, 0);
  const categoriesCount = new Set(products.map(p => p.category)).size;

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-foreground flex flex-col font-sans select-none">
      {/* Admin Navbar */}
      <header className="bg-[#0a0a0a] text-white py-4 px-6 lg:px-8 shadow-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#c9963e] rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base md:text-lg leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Shree Jagannath Music
            </h1>
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Store Management Portal</span>
          </div>
        </div>

        <button
          onClick={onBackToStore}
          className="flex items-center gap-2 border border-white/20 hover:border-white/50 text-white/80 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-[#121212] text-white border-t border-white/5 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "products" ? "border-[#c9963e] text-[#c9963e]" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Products Catalog
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "inquiries" ? "border-[#c9963e] text-[#c9963e]" : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Customer Inquiries
          </button>
        </div>
      </div>

      {/* Main Admin Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-8 py-10 flex flex-col gap-8">
        {activeTab === "products" ? (
          <>
            {/* Page title and add button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Products Dashboard
            </h2>
            <p className="text-muted-foreground text-sm">Add, remove, or edit products and prices in real-time.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#c9963e] text-white hover:bg-[#b8852e] px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#c9963e]/10 transition-all cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-[#c9963e]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{products.length}</div>
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Total Products</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center">
              <Folder className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{categoriesCount}</div>
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Categories</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <span className="text-emerald-600 text-lg font-bold">₹</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">₹{totalCatalogValue.toLocaleString("en-IN")}</div>
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Total Catalog Value</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {products.filter(p => p.availability === "In Stock").length}
              </div>
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider">In Stock Items</div>
            </div>
          </div>
        </div>

        {/* Filters and List */}
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden flex flex-col">
          {/* Table Toolbar */}
          <div className="p-5 border-b border-black/5 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products by name or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f6f6f6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-muted-foreground transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Filter:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as Category)}
                className="bg-[#f6f6f6] border border-transparent rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {allCategories.filter(c => c !== "All").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfcfc] text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-black/5">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Availability</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#fcfcfc] transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-black/5 border border-black/5 flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0 max-w-[280px]">
                          <span className="font-semibold text-foreground truncate">{p.name}</span>
                          <span className="text-muted-foreground text-xs font-medium truncate uppercase">{p.brand}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
                      <td className="px-6 py-4 font-bold text-foreground">
                        ₹{p.price.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            p.availability === "In Stock"
                              ? "bg-emerald-50 text-emerald-700"
                              : p.availability === "Limited Stock"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {p.availability}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="inline-flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-[#c9963e] hover:bg-[#c9963e]/10 rounded-xl transition-all cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setIsDeletingId(p.id)}
                          className="inline-flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-muted-foreground">
                      <div className="text-3xl mb-3">📦</div>
                      <div className="font-semibold text-foreground mb-1">No Products Found</div>
                      <div>Try resetting your search query or category filters.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Customer Inquiries
                </h2>
                <p className="text-muted-foreground text-sm">View and manage contact inquiries and requests from the storefront.</p>
              </div>
              <button
                onClick={fetchInquiries}
                className="flex items-center gap-2 border border-black/10 hover:border-black/25 bg-white text-foreground px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loadingInquiries ? "animate-spin" : ""}`} />
                Refresh Inquiries
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden flex flex-col p-5">
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by customer name or product..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f6f6f6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 placeholder:text-muted-foreground transition-all"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-[#f6f6f6] border border-transparent rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Inquiries</option>
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inquiries List */}
            {loadingInquiries ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-black/5">
                <Loader2 className="w-8 h-8 text-[#c9963e] animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-semibold">Loading inquiries...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-black/5">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-bold text-foreground text-base mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>No Inquiries Found</h3>
                <p className="text-muted-foreground text-sm font-medium">No contact inquiries exist matching the filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredInquiries.map((inq) => {
                  const dateStr = inq.createdAt?.seconds 
                    ? new Date(inq.createdAt.seconds * 1000).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "Recently";

                  return (
                    <div key={inq.id} className="bg-white rounded-3xl border border-black/5 p-6 shadow-sm flex flex-col justify-between gap-5 relative group overflow-hidden">
                      {/* Status pill */}
                      <div className="absolute top-6 right-6">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                          inq.status === "Contacted" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {inq.status}
                        </span>
                      </div>

                      {/* Header details */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-lg text-foreground pr-24" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {inq.name}
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          <a href={`tel:${inq.phone}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium">
                            <PhoneCall className="w-3.5 h-3.5 text-[#c9963e]" />
                            {inq.phone}
                          </a>
                          {inq.email && (
                            <a href={`mailto:${inq.email}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium truncate">
                              <Mail className="w-3.5 h-3.5 text-[#c9963e]" />
                              {inq.email}
                            </a>
                          )}
                          {inq.city && (
                            <div className="flex items-center gap-1.5 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-[#c9963e]" />
                              {inq.city}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#c9963e]" />
                            {dateStr}
                          </div>
                        </div>

                        {inq.product && (
                          <div className="inline-block bg-black/5 text-foreground text-xs font-semibold px-3 py-1.5 rounded-lg">
                            Interested in: <span className="text-[#c9963e]">{inq.product}</span>
                          </div>
                        )}

                        {inq.message && (
                          <div className="bg-[#fcfcfc] border border-black/5 p-4 rounded-2xl mt-2">
                            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line italic">
                              "{inq.message}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex gap-2.5 border-t border-black/5 pt-4">
                        {inq.status === "Pending" ? (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, "Contacted")}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm animate-none"
                          >
                            <Check className="w-4 h-4" />
                            Mark Contacted
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, "Pending")}
                            className="flex-1 flex items-center justify-center gap-1.5 border border-black/10 hover:border-black/25 bg-white text-muted-foreground hover:text-foreground py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm animate-none"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Mark Pending
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 w-11 h-11 rounded-xl transition-all cursor-pointer"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform scale-100 transition-all select-text">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between bg-white sticky top-0">
              <h3 className="font-bold text-foreground text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {editingProduct ? "Edit Product Details" : "Add New Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg bg-[#f6f6f6] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
              {/* Product Name */}
              <div>
                <label className="block text-muted-foreground text-xs font-semibold uppercase mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yamaha F310 Acoustic Guitar"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#f6f6f6] border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9963e]/20"
                />
              </div>

              {/* Brand and Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-muted-foreground text-xs font-semibold uppercase mb-1.5">Brand</label>
                  <select
                    value={form.brand}
                    onChange={(e) => setForm(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full bg-[#f6f6f6] border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9963e]/20 cursor-pointer"
                  >
                    {brands.filter(b => b !== "All Brands").map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-muted-foreground text-xs font-semibold uppercase mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as Category }))}
                    className="w-full bg-[#f6f6f6] border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9963e]/20 cursor-pointer"
                  >
                    {allCategories.filter(c => c !== "All").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Other Brand Input (if Other Brands is selected) */}
              {form.brand === "Other Brands" && (
                <div>
                  <label className="block text-muted-foreground text-xs font-semibold uppercase mb-1.5">Custom Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fender, Ibanez"
                    value={form.otherBrand}
                    onChange={(e) => setForm(prev => ({ ...prev, otherBrand: e.target.value }))}
                    className="w-full bg-[#f6f6f6] border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9963e]/20"
                  />
                </div>
              )}

              {/* Price and Availability Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-muted-foreground text-xs font-semibold uppercase mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 8500"
                    value={form.price || ""}
                    onChange={(e) => setForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full bg-[#f6f6f6] border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9963e]/20"
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-muted-foreground text-xs font-semibold uppercase mb-1.5">Availability</label>
                  <select
                    value={form.availability}
                    onChange={(e) => setForm(prev => ({ ...prev, availability: e.target.value as Availability }))}
                    className="w-full bg-[#f6f6f6] border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9963e]/20 cursor-pointer"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Available on Order">Available on Order</option>
                  </select>
                </div>
              </div>

              {/* Product Image File Upload */}
              <div>
                <label className="block text-muted-foreground text-xs font-semibold uppercase mb-1.5">Product Image</label>
                <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#f6f6f6] p-4 rounded-xl border border-dashed border-black/10">
                  <div className="w-16 h-16 rounded-lg bg-black/5 flex items-center justify-center overflow-hidden border border-black/5 flex-shrink-0">
                    <img
                      src={form.image || DEFAULT_IMAGE}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      id="image-file-input"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="image-file-input"
                      className="inline-flex items-center justify-center bg-white border border-black/10 hover:border-black/20 text-foreground px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer select-none transition-all disabled:opacity-50"
                    >
                      {uploadingImage ? "Uploading..." : "Upload Image File"}
                    </label>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      Supports PNG, JPG, JPEG. Saved locally to public/uploads/.
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Preview Images (List Upload Grid) */}
              <div>
                <label className="block text-muted-foreground text-xs font-semibold uppercase mb-2 flex items-center gap-1">
                  Additional Preview Images
                </label>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl bg-black/5 overflow-hidden border border-black/5 group">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(idx)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                        title="Remove Image"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload Card */}
                  <label className="aspect-square rounded-xl bg-[#f6f6f6] border border-dashed border-black/10 hover:border-black/25 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors select-none text-muted-foreground hover:text-foreground">
                    <Plus className="w-5 h-5" />
                    <span className="text-[10px] font-semibold">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImagesUpload}
                      className="hidden"
                      disabled={uploadingMultiple}
                    />
                  </label>
                </div>
                
                {uploadingMultiple && (
                  <p className="text-[10px] text-[#c9963e] font-semibold animate-pulse">
                    Uploading previews... Please wait.
                  </p>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-muted-foreground text-xs font-semibold uppercase mb-1.5">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="A brief product summary displayed on cards..."
                  value={form.shortDescription}
                  onChange={(e) => setForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full bg-[#f6f6f6] border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9963e]/20 resize-none"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-muted-foreground text-xs font-semibold uppercase mb-1.5">Full Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed review, ideal use cases, build materials, etc."
                  value={form.fullDescription}
                  onChange={(e) => setForm(prev => ({ ...prev, fullDescription: e.target.value }))}
                  className="w-full bg-[#f6f6f6] border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9963e]/20 resize-none"
                />
              </div>

              {/* Features (bullet points) */}
              <div>
                <label className="block text-muted-foreground text-xs font-semibold uppercase mb-1.5 flex items-center gap-1">
                  Key Features <span className="text-[10px] text-muted-foreground normal-case">(separated by commas)</span>
                </label>
                <input
                  type="text"
                  placeholder="Warm sound, Easy playability, Solid construction"
                  value={form.featuresText}
                  onChange={(e) => setForm(prev => ({ ...prev, featuresText: e.target.value }))}
                  className="w-full bg-[#f6f6f6] border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9963e]/20"
                />
              </div>

              {/* Technical Specifications */}
              <div>
                <label className="block text-muted-foreground text-xs font-semibold uppercase mb-1.5 flex items-center gap-1">
                  Specifications <span className="text-[10px] text-muted-foreground normal-case">(Label: Value, one per line)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Body Type: Dreadnought&#10;Top: Spruce&#10;Back & Sides: Nato"
                  value={form.specsText}
                  onChange={(e) => setForm(prev => ({ ...prev, specsText: e.target.value }))}
                  className="w-full bg-[#f6f6f6] border border-transparent rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9963e]/20 font-mono resize-none"
                />
              </div>

              {/* Submit / Cancel Footer */}
              <div className="pt-4 border-t border-black/5 flex gap-3 justify-end bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-[#f6f6f6] hover:bg-[#eeeeee] text-foreground rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-[#c9963e] hover:bg-[#b8852e] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#c9963e]/10 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-center transform scale-100 transition-all">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Confirm Deletion
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Are you sure you want to delete this product? This action will remove it permanently from Firestore database and cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                disabled={saving}
                onClick={() => setIsDeletingId(null)}
                className="flex-1 bg-[#f6f6f6] hover:bg-[#eeeeee] text-foreground text-xs font-bold py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                onClick={() => handleDelete(isDeletingId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
