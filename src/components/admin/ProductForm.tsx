"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryWithCount } from "@/types";

type Compatibility = { make: string; model: string; yearFrom: number; yearTo: number };

export type ProductFormInitial = {
  id?: string;
  name: string;
  description: string;
  sku: string;
  brand: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string;
  categoryId: string;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  compatibilities: Compatibility[];
};

const EMPTY_FORM: ProductFormInitial = {
  name: "",
  description: "",
  sku: "",
  brand: "",
  price: 0,
  compareAtPrice: null,
  stock: 0,
  imageUrl: "",
  categoryId: "",
  isActive: true,
  isFeatured: false,
  images: [],
  compatibilities: [],
};

export function ProductForm({
  categories,
  initial,
}: {
  categories: CategoryWithCount[];
  initial?: ProductFormInitial;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState<ProductFormInitial>(initial ?? EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof ProductFormInitial>(key: K, value: ProductFormInitial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addCompatibility() {
    updateField("compatibilities", [
      ...form.compatibilities,
      { make: "", model: "", yearFrom: 2015, yearTo: 2020 },
    ]);
  }

  function updateCompatibility(index: number, patch: Partial<Compatibility>) {
    const next = form.compatibilities.map((c, i) => (i === index ? { ...c, ...patch } : c));
    updateField("compatibilities", next);
  }

  function removeCompatibility(index: number) {
    updateField("compatibilities", form.compatibilities.filter((_, i) => i !== index));
  }

  function addImage() {
    updateField("images", [...form.images, ""]);
  }

  function updateImage(index: number, value: string) {
    updateField("images", form.images.map((img, i) => (i === index ? value : img)));
  }

  function removeImage(index: number) {
    updateField("images", form.images.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      brand: form.brand || undefined,
      compareAtPrice: form.compareAtPrice || undefined,
      images: form.images.filter(Boolean),
      compatibilities: form.compatibilities.filter((c) => c.make && c.model),
    };

    try {
      const res = await fetch(isEdit ? `/api/products/${initial!.id}` : "/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "تعذّر حفظ المنتج");
        setSubmitting(false);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("تعذّر الاتصال بالخادم");
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-sm border border-graphite-200 px-3 py-2 text-sm focus:border-amber-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="اسم المنتج">
          <input required value={form.name} onChange={(e) => updateField("name", e.target.value)} className={inputClass} />
        </Field>
        <Field label="القسم">
          <select required value={form.categoryId} onChange={(e) => updateField("categoryId", e.target.value)} className={inputClass}>
            <option value="">اختر القسم</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="رقم القطعة (SKU)">
          <input required value={form.sku} onChange={(e) => updateField("sku", e.target.value)} className={inputClass} />
        </Field>
        <Field label="الماركة">
          <input value={form.brand} onChange={(e) => updateField("brand", e.target.value)} className={inputClass} />
        </Field>
        <Field label="السعر (ر.س)">
          <input type="number" step="0.01" required min={0} value={form.price} onChange={(e) => updateField("price", Number(e.target.value))} className={inputClass} />
        </Field>
        <Field label="السعر قبل الخصم (اختياري)">
          <input type="number" step="0.01" min={0} value={form.compareAtPrice ?? ""} onChange={(e) => updateField("compareAtPrice", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
        </Field>
        <Field label="الكمية في المخزون">
          <input type="number" required min={0} value={form.stock} onChange={(e) => updateField("stock", Number(e.target.value))} className={inputClass} />
        </Field>
        <Field label="رابط الصورة الرئيسية">
          <input required type="url" value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} className={inputClass} placeholder="https://..." />
        </Field>
      </div>

      <Field label="الوصف">
        <textarea required rows={4} value={form.description} onChange={(e) => updateField("description", e.target.value)} className={inputClass} />
      </Field>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-graphite-700">
          <input type="checkbox" checked={form.isActive} onChange={(e) => updateField("isActive", e.target.checked)} />
          منشور (ظاهر للعملاء)
        </label>
        <label className="flex items-center gap-2 text-sm text-graphite-700">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateField("isFeatured", e.target.checked)} />
          منتج مميز (يظهر بالصفحة الرئيسية)
        </label>
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-graphite-800">صور إضافية</h3>
          <button type="button" onClick={addImage} className="text-sm font-medium text-amber-600 hover:text-amber-700">+ إضافة صورة</button>
        </div>
        <div className="space-y-2">
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input type="url" value={img} onChange={(e) => updateImage(i, e.target.value)} placeholder="https://..." className={inputClass} />
              <button type="button" onClick={() => removeImage(i)} className="px-2 text-danger-500">حذف</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-graphite-800">توافق السيارات</h3>
          <button type="button" onClick={addCompatibility} className="text-sm font-medium text-amber-600 hover:text-amber-700">+ إضافة توافق</button>
        </div>
        <div className="space-y-2">
          {form.compatibilities.map((c, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 rounded-sm border border-graphite-200 p-3 sm:grid-cols-5 sm:items-center">
              <input placeholder="الشركة (مثال: تويوتا)" value={c.make} onChange={(e) => updateCompatibility(i, { make: e.target.value })} className={inputClass} />
              <input placeholder="الموديل (مثال: كامري)" value={c.model} onChange={(e) => updateCompatibility(i, { model: e.target.value })} className={inputClass} />
              <input type="number" placeholder="من سنة" value={c.yearFrom} onChange={(e) => updateCompatibility(i, { yearFrom: Number(e.target.value) })} className={inputClass} />
              <input type="number" placeholder="إلى سنة" value={c.yearTo} onChange={(e) => updateCompatibility(i, { yearTo: Number(e.target.value) })} className={inputClass} />
              <button type="button" onClick={() => removeCompatibility(i)} className="text-sm text-danger-500">حذف</button>
            </div>
          ))}
        </div>
      </section>

      {error && <p className="text-sm text-danger-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-sm bg-graphite-800 px-6 py-2.5 font-medium text-white hover:bg-graphite-900 disabled:bg-graphite-300"
      >
        {submitting ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إنشاء المنتج"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-graphite-700">{label}</span>
      {children}
    </label>
  );
}
