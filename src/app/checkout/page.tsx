"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { formatPrice, calculateOrderTotals } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, subtotal, fetchCart, initialized } = useCartStore();
  const router = useRouter();

  const [form, setForm] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingCity: "",
    shippingAddress: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (initialized && items.length === 0) {
      router.replace("/cart");
    }
  }, [initialized, items.length, router]);

  const { shippingFee, total } = calculateOrderTotals(subtotal);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "تعذّر إتمام الطلب");
        setSubmitting(false);
        return;
      }
      window.location.href = json.data.checkoutUrl;
    } catch {
      setError("تعذّر الاتصال بالخادم");
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-onyx-800">إتمام الطلب</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-onyx-700">الاسم الكامل</label>
            <input
              name="shippingName"
              required
              value={form.shippingName}
              onChange={handleChange}
              className="w-full rounded-sm border border-onyx-200 px-3 py-2.5 focus:border-gold-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-onyx-700">رقم الجوال</label>
            <input
              name="shippingPhone"
              required
              value={form.shippingPhone}
              onChange={handleChange}
              placeholder="05xxxxxxxx"
              className="w-full rounded-sm border border-onyx-200 px-3 py-2.5 focus:border-gold-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-onyx-700">المدينة</label>
            <input
              name="shippingCity"
              required
              value={form.shippingCity}
              onChange={handleChange}
              className="w-full rounded-sm border border-onyx-200 px-3 py-2.5 focus:border-gold-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-onyx-700">العنوان التفصيلي</label>
            <textarea
              name="shippingAddress"
              required
              rows={3}
              value={form.shippingAddress}
              onChange={handleChange}
              placeholder="الحي، الشارع، رقم المبنى..."
              className="w-full rounded-sm border border-onyx-200 px-3 py-2.5 focus:border-gold-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-onyx-700">ملاحظات (اختياري)</label>
            <textarea
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              className="w-full rounded-sm border border-onyx-200 px-3 py-2.5 focus:border-gold-400"
            />
          </div>

          {error && <p className="text-sm text-danger-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="w-full rounded-sm bg-gold-400 px-4 py-3 font-semibold text-onyx-900 hover:bg-gold-300 disabled:bg-onyx-200 disabled:text-onyx-400"
          >
            {submitting ? "جارٍ التحويل لبوابة الدفع..." : "المتابعة إلى الدفع"}
          </button>
        </form>

        <div className="h-fit rounded-lg border border-onyx-200 bg-white p-5">
          <h2 className="mb-4 font-semibold text-onyx-800">ملخص الطلب</h2>
          <ul className="mb-4 space-y-2 text-sm text-onyx-600">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(Number(item.product.price) * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-1 border-t border-onyx-200 pt-3 text-sm">
            <div className="flex justify-between text-onyx-600">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-onyx-600">
              <span>الشحن</span>
              <span>{shippingFee === 0 ? "مجاني" : formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between border-t border-onyx-200 pt-2 text-base font-bold text-onyx-900">
              <span>الإجمالي</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
