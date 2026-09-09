import type { Product, Category, ProductImage, CarCompatibility, Order, OrderItem } from "@prisma/client";

export type ProductWithCategory = Product & { category: Category };

export type ProductWithDetails = Product & {
  category: Category;
  images: ProductImage[];
  compatibilities: CarCompatibility[];
};

export type OrderWithItems = Order & { items: OrderItem[] };

export type CategoryWithCount = Category & { _count: { products: number } };
