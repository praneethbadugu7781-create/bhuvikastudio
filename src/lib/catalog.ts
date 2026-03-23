export type ColorOption = {
  colorName: string;
  colorCode: string;
  images: string[];
};

export type CatalogItem = {
  slug: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  oldPrice?: number;
  sizes: string[];
  color: string;
  image: string;
  images?: string[];
  colorOptions?: ColorOption[];
  stock: "In Stock" | "Out of Stock";
  featured?: boolean;
};

export const categories = [
  "Western Wear",
  "Kids Wear",
  "Lehengas",
  "Fusion Wear",
  "Sarees",
  "Co-ords",
] as const;

export const catalog: CatalogItem[] = [
  {
    slug: "rose-drape-coord",
    name: "Rose Drape Co-ord Set",
    category: "Co-ords",
    price: 2699,
    oldPrice: 3199,
    sizes: ["S", "M", "L", "XL"],
    color: "Rose Pink",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    stock: "In Stock",
    featured: true,
  },
  {
    slug: "ivory-festive-lehenga",
    name: "Ivory Festive Lehenga",
    category: "Lehengas",
    price: 6499,
    sizes: ["M", "L", "XL"],
    color: "Ivory Gold",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    stock: "In Stock",
    featured: true,
  },
  {
    slug: "lilac-kids-party-frock",
    name: "Lilac Kids Party Frock",
    category: "Kids Wear",
    price: 1499,
    sizes: ["S", "M", "L"],
    color: "Lilac",
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=80",
    stock: "In Stock",
  },
  {
    slug: "sunset-fusion-anarkali",
    name: "Sunset Fusion Anarkali",
    category: "Fusion Wear",
    price: 3499,
    sizes: ["S", "M", "L", "XL"],
    color: "Coral",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    stock: "In Stock",
  },
  {
    slug: "teal-handloom-saree",
    name: "Teal Handloom Saree",
    category: "Sarees",
    price: 2899,
    sizes: ["Free Size"],
    color: "Teal",
    image: "https://images.unsplash.com/photo-1616161560417-66d4db5892ec?auto=format&fit=crop&w=1200&q=80",
    stock: "Out of Stock",
  },
  {
    slug: "urban-western-midi",
    name: "Urban Western Midi Dress",
    category: "Western Wear",
    price: 2199,
    sizes: ["S", "M", "L"],
    color: "Crimson",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    stock: "In Stock",
  },
];
