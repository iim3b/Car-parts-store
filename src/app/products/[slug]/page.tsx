import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductActions } from "@/components/ProductActions";
import { Price } from "@/components/Price";
import { StockBadge } from "@/components/StockBadge";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product || !product.isActive) notFound();

  const images = [product.imageUrl, ...product.images.map((i) => i.url)];

  return (
    <div className="container-page py-8">
      <nav className="mb-6 text-sm text-graphite-500">
        <Link href="/" className="hover:text-graphite-800">الرئيسية</Link>
        <span className="mx-2">/</span>
        <Link href={`/categories/${product.category.slug}`} className="hover:text-graphite-800">
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-graphite-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={images} name={product.name} />

        <div>
          {product.brand && (
            <span className="text-sm font-medium text-graphite-400">{product.brand}</span>
          )}
          <h1 className="mt-1 text-2xl font-bold text-graphite-900">{product.name}</h1>
          <p className="mt-1 text-sm text-graphite-400">رقم القطعة (SKU): {product.sku}</p>

          <div className="mt-4 flex items-center gap-3">
            <Price value={product.price} compareAt={product.compareAtPrice} size="lg" />
            <StockBadge stock={product.stock} />
          </div>

          <div className="mt-6">
            <ProductActions productId={product.id} stock={product.stock} />
          </div>

          <div className="mt-8 border-t border-graphite-200 pt-6">
            <h2 className="mb-2 font-semibold text-graphite-800">الوصف</h2>
            <p className="whitespace-pre-line leading-relaxed text-graphite-600">
              {product.description}
            </p>
          </div>

          {product.compatibilities.length > 0 && (
            <div className="mt-8 border-t border-graphite-200 pt-6">
              <h2 className="mb-3 font-semibold text-graphite-800">متوافقة مع السيارات التالية</h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {product.compatibilities.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-sm border border-graphite-200 bg-graphite-50 px-3 py-2 text-sm text-graphite-700"
                  >
                    {c.make} {c.model} ({c.yearFrom}–{c.yearTo})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
