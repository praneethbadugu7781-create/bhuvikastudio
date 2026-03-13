import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(process.cwd(), ".env.local") });

import { PrismaClient, StockStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "owner@bhuvikastudio.com" },
    update: {},
    create: {
      name: "Bhuvika Studio Owner",
      email: "owner@bhuvikastudio.com",
      mobile: "+919391781748",
      role: "ADMIN",
    },
  });

  const products = [
    {
      slug: "rose-drape-coord",
      name: "Rose Drape Co-ord Set",
      description: "Elegant rose pink co-ord set perfect for festive and evening outings.",
      category: "Co-ords",
      featured: true,
      isNewArrival: true,
      isBestSeller: false,
      stockStatus: StockStatus.IN_STOCK,
      images: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"],
      variants: [
        { sku: "COORD-ROSE-S", size: "S", color: "Rose Pink", price: "2699.00", salePrice: "3199.00", stockQuantity: 12 },
        { sku: "COORD-ROSE-M", size: "M", color: "Rose Pink", price: "2699.00", salePrice: "3199.00", stockQuantity: 15 },
        { sku: "COORD-ROSE-L", size: "L", color: "Rose Pink", price: "2699.00", salePrice: "3199.00", stockQuantity: 10 },
        { sku: "COORD-ROSE-XL", size: "XL", color: "Rose Pink", price: "2699.00", salePrice: "3199.00", stockQuantity: 8 },
      ],
    },
    {
      slug: "ivory-festive-lehenga",
      name: "Ivory Festive Lehenga",
      description: "Statement lehenga with detailed embroidery for wedding functions.",
      category: "Lehengas",
      featured: true,
      isNewArrival: false,
      isBestSeller: true,
      stockStatus: StockStatus.IN_STOCK,
      images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"],
      variants: [
        { sku: "LEH-IVR-M", size: "M", color: "Ivory Gold", price: "6499.00", salePrice: null, stockQuantity: 5 },
        { sku: "LEH-IVR-L", size: "L", color: "Ivory Gold", price: "6499.00", salePrice: null, stockQuantity: 7 },
        { sku: "LEH-IVR-XL", size: "XL", color: "Ivory Gold", price: "6499.00", salePrice: null, stockQuantity: 3 },
      ],
    },
    {
      slug: "lilac-kids-party-frock",
      name: "Lilac Kids Party Frock",
      description: "Adorable lilac party frock with tulle layers and sparkle details.",
      category: "Kids Wear",
      featured: false,
      isNewArrival: true,
      isBestSeller: false,
      stockStatus: StockStatus.IN_STOCK,
      images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=80"],
      variants: [
        { sku: "KIDS-LIL-S", size: "S", color: "Lilac", price: "1499.00", salePrice: null, stockQuantity: 20 },
        { sku: "KIDS-LIL-M", size: "M", color: "Lilac", price: "1499.00", salePrice: null, stockQuantity: 18 },
        { sku: "KIDS-LIL-L", size: "L", color: "Lilac", price: "1499.00", salePrice: null, stockQuantity: 15 },
      ],
    },
    {
      slug: "sunset-fusion-anarkali",
      name: "Sunset Fusion Anarkali",
      description: "Where tradition meets trend — coral anarkali with modern flair.",
      category: "Fusion Wear",
      featured: true,
      isNewArrival: false,
      isBestSeller: false,
      stockStatus: StockStatus.IN_STOCK,
      images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"],
      variants: [
        { sku: "FUS-COR-S", size: "S", color: "Coral", price: "3499.00", salePrice: null, stockQuantity: 9 },
        { sku: "FUS-COR-M", size: "M", color: "Coral", price: "3499.00", salePrice: null, stockQuantity: 12 },
        { sku: "FUS-COR-L", size: "L", color: "Coral", price: "3499.00", salePrice: null, stockQuantity: 7 },
        { sku: "FUS-COR-XL", size: "XL", color: "Coral", price: "3499.00", salePrice: null, stockQuantity: 5 },
      ],
    },
    {
      slug: "teal-handloom-saree",
      name: "Teal Handloom Saree",
      description: "Handloom elegance in a stunning teal drape with contemporary border.",
      category: "Sarees",
      featured: false,
      isNewArrival: false,
      isBestSeller: true,
      stockStatus: StockStatus.OUT_OF_STOCK,
      images: ["https://images.unsplash.com/photo-1616161560417-66d4db5892ec?auto=format&fit=crop&w=1200&q=80"],
      variants: [
        { sku: "SAR-TEA-FREE", size: "Free Size", color: "Teal", price: "2899.00", salePrice: null, stockQuantity: 0 },
      ],
    },
    {
      slug: "urban-western-midi",
      name: "Urban Western Midi Dress",
      description: "Chic crimson midi dress with a flattering A-line cut for any occasion.",
      category: "Western Wear",
      featured: false,
      isNewArrival: true,
      isBestSeller: false,
      stockStatus: StockStatus.IN_STOCK,
      images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"],
      variants: [
        { sku: "WEST-CRM-S", size: "S", color: "Crimson", price: "2199.00", salePrice: null, stockQuantity: 14 },
        { sku: "WEST-CRM-M", size: "M", color: "Crimson", price: "2199.00", salePrice: null, stockQuantity: 11 },
        { sku: "WEST-CRM-L", size: "L", color: "Crimson", price: "2199.00", salePrice: null, stockQuantity: 9 },
      ],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { name: product.name, description: product.description, category: product.category, featured: product.featured, isNewArrival: product.isNewArrival, isBestSeller: product.isBestSeller, stockStatus: product.stockStatus },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        category: product.category,
        featured: product.featured,
        isNewArrival: product.isNewArrival,
        isBestSeller: product.isBestSeller,
        stockStatus: product.stockStatus,
        images: { create: product.images.map((url, i) => ({ imageUrl: url, displayRank: i })) },
        variants: { create: product.variants.map((v) => ({ sku: v.sku, size: v.size, color: v.color, price: v.price, salePrice: v.salePrice, stockQuantity: v.stockQuantity })) },
      },
    });
  }

  console.log(`Seeded admin: ${admin.email}`);
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
