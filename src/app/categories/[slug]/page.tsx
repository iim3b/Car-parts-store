import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { Pagination } from "@/components/Pagination";

export const dynamic = "force-dynamic";

type SearchParams = {
  minPrice?: string;
  maxPrice?: string;
  make?: string;
  model?: string;
  year?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: string;
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: SearchParams;
}) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const [categories, { products, pagination }] = await Promise.all([
    getCategories(),
    getProducts({
      category: params.slug,
      make: searchParams.make,
      model: searchParams.model,
      year: searchParams.year ? Number(searchParams.year) : undefined,
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      sort: searchParams.sort,
      page: searchParams.page ? Number(searchParams.page) : undefined,
    }),
  ]);

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-onyx-800">{category.name}</h1>
        {category.description && (
          <p className="mt-1 text-sm text-onyx-500">{category.description}</p>
        )}
        <p className="mt-1 text-sm text-onyx-400">{pagination.total} منتج</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <ProductFilters categories={categories} />

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="rounded-lg border border-dashed border-onyx-300 py-16 text-center text-onyx-500">
              لا توجد منتجات في هذا القسم حاليًا.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            searchParams={searchParams}
            basePath={`/categories/${params.slug}`}
          />
        </div>
      </div>
    </div>
  );
}
