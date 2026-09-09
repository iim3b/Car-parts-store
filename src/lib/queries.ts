import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { clampPage } from "./utils";

const PAGE_SIZE = 12;

export function getAllProductsForAdmin() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export function getAllCategoriesForAdmin() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getAdminStats() {
  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    lowStockProducts,
    paidOrders,
    totalUsers,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
    prisma.order.findMany({ where: { paymentStatus: "PAID" }, select: { total: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);

  return { totalProducts, totalOrders, pendingOrders, lowStockProducts, totalRevenue, totalUsers };
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export function getFeaturedProducts(take = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    take,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export type ProductFilters = {
  category?: string;
  search?: string;
  make?: string;
  model?: string;
  year?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: number;
};

export async function getProducts(filters: ProductFilters) {
  const page = clampPage(filters.page);
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (filters.category) where.category = { slug: filters.category };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { brand: { contains: filters.search, mode: "insensitive" } },
      { sku: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      ...(filters.minPrice ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
    };
  }

  if (filters.make || filters.model || filters.year) {
    where.compatibilities = {
      some: {
        ...(filters.make ? { make: { equals: filters.make, mode: "insensitive" } } : {}),
        ...(filters.model
          ? { model: { equals: filters.model, mode: "insensitive" } }
          : {}),
        ...(filters.year
          ? { yearFrom: { lte: filters.year }, yearTo: { gte: filters.year } }
          : {}),
      },
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price_asc"
      ? { price: "asc" }
      : filters.sort === "price_desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    },
  };
}

export function getProductBySlug(slugOrId: string) {
  return prisma.product.findFirst({
    where: { OR: [{ id: slugOrId }, { slug: slugOrId }] },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      compatibilities: true,
    },
  });
}

export async function getCarMakeOptions() {
  const rows = await prisma.carCompatibility.findMany({
    select: { make: true, model: true, yearFrom: true, yearTo: true },
    distinct: ["make", "model"],
    orderBy: [{ make: "asc" }, { model: "asc" }],
  });

  const makesMap = new Map<
    string,
    { models: Set<string>; minYear: number; maxYear: number }
  >();

  for (const row of rows) {
    if (!makesMap.has(row.make)) {
      makesMap.set(row.make, {
        models: new Set(),
        minYear: row.yearFrom,
        maxYear: row.yearTo,
      });
    }
    const entry = makesMap.get(row.make)!;
    entry.models.add(row.model);
    entry.minYear = Math.min(entry.minYear, row.yearFrom);
    entry.maxYear = Math.max(entry.maxYear, row.yearTo);
  }

  return Array.from(makesMap.entries()).map(([make, info]) => ({
    make,
    models: Array.from(info.models).sort(),
    minYear: info.minYear,
    maxYear: info.maxYear,
  }));
}
