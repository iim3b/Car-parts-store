"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CategoryForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      setError(json.error ?? "تعذّر إضافة القسم");
      setSubmitting(false);
      return;
    }
    setForm({ name: "", description: "", imageUrl: "" });
    setSubmitting(false);
    router.refresh();
  }

  const inputClass = "w-full rounded-sm border border-onyx-200 px-3 py-2 text-sm focus:border-gold-400";

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-4">
      <input
        required
        placeholder="اسم القسم"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        className={inputClass}
      />
      <input
        placeholder="وصف مختصر (اختياري)"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        className={inputClass}
      />
      <input
        type="url"
        placeholder="رابط صورة (اختياري)"
        value={form.imageUrl}
        onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
        className={inputClass}
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-sm bg-onyx-800 px-4 py-2 text-sm font-medium text-white hover:bg-onyx-900 disabled:bg-onyx-300"
      >
        {submitting ? "جارٍ الإضافة..." : "+ إضافة قسم"}
      </button>
      {error && <p className="col-span-full text-sm text-danger-500">{error}</p>}
    </form>
  );
}
