"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";

export function AddToCartButton({
  productId,
  disabled,
  className = "",
}: {
  productId: string;
  disabled?: boolean;
  className?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [status, setStatus] = useState<"idle" | "loading" | "added" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleClick() {
    setStatus("loading");
    setMessage(null);
    const result = await addItem(productId, 1);
    if (result.ok) {
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1500);
    } else {
      setStatus("error");
      if (result.error === "يجب تسجيل الدخول أولًا") {
        router.push("/login");
        return;
      }
      setMessage(result.error);
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || status === "loading"}
        className="w-full rounded-sm bg-graphite-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-graphite-900 disabled:cursor-not-allowed disabled:bg-graphite-200 disabled:text-graphite-400"
      >
        {status === "loading"
          ? "جارٍ الإضافة..."
          : status === "added"
          ? "أُضيف إلى السلة ✓"
          : disabled
          ? "غير متوفر"
          : "أضف إلى السلة"}
      </button>
      {message && <p className="mt-1 text-xs text-danger-500">{message}</p>}
    </div>
  );
}
