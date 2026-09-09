import { getCategories, getProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { Pagination } from "@/components/Pagination";

export const dynamic = "force-dynamic";

type SearchParams = {
  category?: string;
  search?: string;
  make?: string;
  model?: string;
  year?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [categories, { products, pagination }] = await Promise.all([
    getCategories(),
    getProducts({
      category: searchParams.category,
      search: searchParams.search,
      make: searchParams.make,
      model: searchParams.model,
      year: searchParams.year ? Number(searchParams.year) : undefined,
      minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      sort: searchParams.sort,
      page: searchParams.page ? Number(searchParams.page) : undefined,
    }),
  ]);

  const activeFitment = [searchParams.make, searchParams.model, searchParams.year]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-graphite-800">
          {searchParams.search ? `نتائج البحث عن "${searchParams.search}"` : "كل المنتجات"}
        </h1>
        {activeFitment && (
          <p className="mt-1 text-sm text-graphite-500">
            القطع المتوافقة مع: <span className="font-medium text-graphite-700">{activeFitment}</span>
          </p>
        )}
        <p className="mt-1 text-sm text-graphite-400">{pagination.total} منتج</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <ProductFilters categories={categories} />

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="rounded-lg border border-dashed border-graphite-300 py-16 text-center text-graphite-500">
              لا توجد منتجات مطابقة لهذا البحث أو الفلاتر المحددة.
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
          />
        </div>
      </div>
    </div>
  );
}
