"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({
  endpoint,
  confirmMessage,
}: {
  endpoint: string;
  confirmMessage: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(confirmMessage)) return;
    setLoading(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const json = await res.json().catch(() => null);
      alert(json?.error ?? "تعذّر الحذف");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm font-medium text-danger-500 hover:text-danger-600 disabled:opacity-50"
    >
      {loading ? "جارٍ الحذف..." : "حذف"}
    </button>
  );
}
