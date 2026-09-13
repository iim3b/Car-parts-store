import Link from "next/link";
import { getCategories, getFeaturedProducts } from "@/lib/queries";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { CarFitmentSelector } from "@/components/CarFitmentSelector";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
  ]);

  return (
    <div>
      <section className="bg-onyx-950">
        <div className="container-page grid gap-8 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <p className="mb-3 text-sm font-semibold tracking-wide text-gold-400">
              أصالة · دقة · ثقة
            </p>
            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              القطعة الصحيحة لسيارتك، من أول مرة
            </h1>
            <p className="mt-4 max-w-md text-onyx-300">
              حدّد شركة سيارتك وموديلها وسنة صنعها لنعرض لك فقط القطع المضمونة التوافق —
              فرامل، تعليق، كهرباء، زيوت، إكسسوارات وأكثر.
            </p>
          </div>
          <CarFitmentSelector />
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="mb-6 text-xl font-bold text-onyx-800">تسوّق حسب القسم</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="container-page py-4 pb-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-onyx-800">منتجات مميزة</h2>
            <Link href="/products" className="text-sm font-medium text-gold-600 hover:text-gold-700">
              عرض الكل
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-onyx-200 bg-white py-10">
        <div className="container-page grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
          <TrustItem title="ضمان التوافق" desc="كل قطعة محددة بدقة حسب الموديل والسنة" />
          <TrustItem title="دفع آمن" desc="معالجة الدفع مشفّرة بالكامل" />
          <TrustItem title="شحن سريع" desc="توصيل لجميع مناطق المملكة" />
        </div>
      </section>
    </div>
  );
}

function TrustItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h3 className="font-semibold text-onyx-800">{title}</h3>
      <p className="mt-1 text-sm text-onyx-500">{desc}</p>
    </div>
  );
}
