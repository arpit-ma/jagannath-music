export type Category = string;

export interface CategoryItem {
  id: string;
  name: string;
}


export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  stock: number;
  image: string;
  images?: string[];
  shortDescription: string;
  fullDescription: string;
  specs: { label: string; value: string }[];
  features: string[];
}

export const products: Product[] = [];

export const featuredCategories: { id: string; name: string; description: string; image: string; category: Category }[] = [];

export const brands = ["All Brands", "Yamaha", "Roland", "Casio", "Behringer", "Shure", "JBL", "AKG", "Audio-Technica", "Focusrite", "Other Brands"];

export const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000–₹15,000", min: 5000, max: 15000 },
  { label: "₹15,000–₹30,000", min: 15000, max: 30000 },
  { label: "₹30,000–₹50,000", min: 30000, max: 50000 },
  { label: "₹50,000+", min: 50000, max: Infinity },
];

export const allCategories: Category[] = [
  "All",
  "Guitar",
  "Tabla",
  "Harmonium",
  "Keyboard",
  "Octapad",
  "Drum Set",
  "Studio Monitors",
  "Headphones",
  "Microphones",
  "Audio Interfaces",
  "Mixers",
  "Accessories",
];
