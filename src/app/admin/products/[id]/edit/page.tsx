import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProductBySlug } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const [categories, product] = await Promise.all([
    db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    }),
    getProductBySlug(params.id),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-onyx-800">تعديل المنتج: {product.name}</h1>
      <div className="rounded-lg border border-onyx-200 bg-white p-5">
        <ProductForm
          categories={categories}
          initial={{
            id: product.id,
            name: product.name,
            description: product.description,
            sku: product.sku,
            brand: product.brand ?? "",
            price: Number(product.price),
            compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
            stock: product.stock,
            imageUrl: product.imageUrl,
            categoryId: product.categoryId,
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            images: product.images.map((i) => i.url),
            compatibilities: product.compatibilities.map((c) => ({
              make: c.make,
              model: c.model,
              yearFrom: c.yearFrom,
              yearTo: c.yearTo,
            })),
          }}
        />
      </div>
    </div>
  );
}
