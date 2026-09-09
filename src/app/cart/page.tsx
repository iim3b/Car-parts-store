"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, loading, initialized, subtotal, fetchCart, updateItem, removeItem } =
    useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (initialized && items.length === 0) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-xl font-bold text-graphite-800">سلتك فارغة</h1>
        <p className="mt-2 text-graphite-500">لم تُضِف أي منتجات إلى سلتك بعد.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-sm bg-graphite-800 px-6 py-2.5 font-medium text-white hover:bg-graphite-900"
        >
          تصفّح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-graphite-800">سلة المشتريات</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {loading && !initialized && (
            <p className="text-graphite-400">جارٍ تحميل السلة...</p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-lg border border-graphite-200 bg-white p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-graphite-100">
                <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/products/${item.product.slug}`} className="font-medium text-graphite-800 hover:text-graphite-950">
                    {item.product.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-graphite-400 hover:text-danger-500"
                  >
                    حذف
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-sm border border-graphite-200">
                    <button
                      onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2.5 py-1 text-graphite-600 hover:bg-graphite-50"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateItem(item.id, Math.min(item.product.stock, item.quantity + 1))
                      }
                      className="px-2.5 py-1 text-graphite-600 hover:bg-graphite-50"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-amber-600">
                    {formatPrice(Number(item.product.price) * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-lg border border-graphite-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-graphite-800">ملخص الطلب</h2>
          <div className="flex justify-between text-sm text-graphite-600">
            <span>المجموع الفرعي</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-graphite-400">
            الشحن يُحسب في صفحة الدفع (شحن مجاني فوق 300 ر.س)
          </p>
          <Link
            href="/checkout"
            className="mt-4 block rounded-sm bg-amber-400 px-4 py-2.5 text-center font-semibold text-graphite-900 hover:bg-amber-300"
          >
            إتمام الشراء
          </Link>
        </div>
      </div>
    </div>
  );
}
