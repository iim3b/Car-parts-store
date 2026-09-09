import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-graphite-200 bg-graphite-900 text-graphite-300">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">
            مستودع <span className="text-amber-400">القطع</span>
          </h3>
          <p className="text-sm leading-relaxed text-graphite-400">
            قطع غيار أصلية وبديلة لجميع أنواع السيارات، مع ضمان التوافق وسرعة الشحن.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">تسوّق</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-white">كل المنتجات</Link></li>
            <li><Link href="/products?sort=newest" className="hover:text-white">وصل حديثًا</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">حسابي</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/account/orders" className="hover:text-white">طلباتي</Link></li>
            <li><Link href="/cart" className="hover:text-white">سلة المشتريات</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">لماذا نحن؟</h4>
          <ul className="space-y-2 text-sm text-graphite-400">
            <li>ضمان مطابقة القطعة لسيارتك</li>
            <li>دفع إلكتروني آمن</li>
            <li>شحن لجميع المناطق</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-graphite-800 py-4 text-center text-xs text-graphite-500">
        © {new Date().getFullYear()} مستودع القطع. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
