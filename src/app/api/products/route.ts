import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { productSchema, productQuerySchema } from "@/lib/validators";
import { getProducts } from "@/lib/queries";
import { ok, handleApiError } from "@/lib/api-response";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = productQuerySchema.parse(searchParams);
    const result = await getProducts(query);
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug || slugify(data.name),
        description: data.description,
        sku: data.sku,
        brand: data.brand,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        stock: data.stock,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        images: data.images
          ? { create: data.images.map((url, i) => ({ url, sortOrder: i })) }
          : undefined,
        compatibilities: data.compatibilities
          ? { create: data.compatibilities }
          : undefined,
      },
      include: { images: true, compatibilities: true, category: true },
    });

    return ok(product, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
