"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "تعذّر إنشاء الحساب");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("تعذّر الاتصال بالخادم");
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-lg border border-onyx-200 bg-white p-6">
        <h1 className="mb-6 text-center text-xl font-bold text-onyx-800">إنشاء حساب جديد</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-onyx-700">الاسم الكامل</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-sm border border-onyx-200 px-3 py-2.5 focus:border-gold-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-onyx-700">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-sm border border-onyx-200 px-3 py-2.5 focus:border-gold-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-onyx-700">رقم الجوال (اختياري)</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="05xxxxxxxx"
              className="w-full rounded-sm border border-onyx-200 px-3 py-2.5 focus:border-gold-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-onyx-700">كلمة المرور</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full rounded-sm border border-onyx-200 px-3 py-2.5 focus:border-gold-400"
            />
            <p className="mt-1 text-xs text-onyx-400">8 أحرف على الأقل</p>
          </div>

          {error && <p className="text-sm text-danger-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-onyx-800 px-4 py-2.5 font-medium text-white hover:bg-onyx-900 disabled:bg-onyx-300"
          >
            {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-onyx-500">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-medium text-gold-600 hover:text-gold-700">
            سجّل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
