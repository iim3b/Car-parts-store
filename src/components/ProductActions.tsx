"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";

export function ProductActions({ productId, stock }: { productId: string; stock: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleAdd() {
    setStatus("loading");
    setError(null);
    const result = await addItem(productId, quantity);
    if (result.ok) {
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } else {
      setStatus("idle");
      if (result.error === "يجب تسجيل الدخول أولًا") {
        router.push("/login");
        return;
      }
      setError(result.error);
    }
  }

  if (stock <= 0) {
    return (
      <button
        disabled
        className="w-full rounded-sm bg-graphite-200 px-6 py-3 font-medium text-graphite-400"
      >
        غير متوفر حاليًا
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-sm border border-graphite-200">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-2.5 text-graphite-600 hover:bg-graphite-50"
          aria-label="إنقاص الكمية"
        >
          −
        </button>
        <span className="w-10 text-center font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
          className="px-3 py-2.5 text-graphite-600 hover:bg-graphite-50"
          aria-label="زيادة الكمية"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAdd}
        disabled={status === "loading"}
        className="flex-1 rounded-sm bg-graphite-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-graphite-900 disabled:bg-graphite-300"
      >
        {status === "loading" ? "جارٍ الإضافة..." : status === "added" ? "أُضيف للسلة ✓" : "أضف إلى السلة"}
      </button>

      {error && <p className="text-sm text-danger-500">{error}</p>}
    </div>
  );
}
