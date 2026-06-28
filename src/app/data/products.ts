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

export const featuredCategories: { id: string; name: string; description: string; image: string; category: Category }[] = [
  {
    id: "fc-1",
    name: "Guitars & Fretted",
    description: "Explore our collection of acoustic, electric, and bass guitars from top global brands.",
    image: "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=800&h=600&fit=crop&q=80",
    category: "Guitar",
  },
  {
    id: "fc-2",
    name: "Studio Gear",
    description: "Professional audio interfaces, studio monitors, and recording equipment for your home or pro studio.",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop&q=80",
    category: "Studio Monitors",
  },
  {
    id: "fc-3",
    name: "Indian Classical",
    description: "Authentic Tablas, Harmoniums, and traditional instruments crafted for perfection.",
    image: "https://images.unsplash.com/photo-1582236875955-f2d3d02a5c51?w=800&h=600&fit=crop&q=80",
    category: "Tabla",
  },
];

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
