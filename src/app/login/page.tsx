"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "تعذّر تسجيل الدخول");
        setLoading(false);
        return;
      }
      router.push(searchParams.get("redirect") || "/");
      router.refresh();
    } catch {
      setError("تعذّر الاتصال بالخادم");
      setLoading(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-sm rounded-lg border border-graphite-200 bg-white p-6">
        <h1 className="mb-6 text-center text-xl font-bold text-graphite-800">تسجيل الدخول</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-graphite-700">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-sm border border-graphite-200 px-3 py-2.5 focus:border-amber-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-graphite-700">كلمة المرور</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full rounded-sm border border-graphite-200 px-3 py-2.5 focus:border-amber-400"
            />
          </div>

          {error && <p className="text-sm text-danger-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-graphite-800 px-4 py-2.5 font-medium text-white hover:bg-graphite-900 disabled:bg-graphite-300"
          >
            {loading ? "جارٍ الدخول..." : "دخول"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-graphite-500">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="font-medium text-amber-600 hover:text-amber-700">
            أنشئ حسابًا جديدًا
          </Link>
        </p>
      </div>
    </div>
  );
}
