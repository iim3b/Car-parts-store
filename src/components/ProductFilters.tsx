"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { CategoryWithCount } from "@/types";

type MakeOption = { make: string; models: string[]; minYear: number; maxYear: number };

export function ProductFilters({ categories }: { categories: CategoryWithCount[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [makeOptions, setMakeOptions] = useState<MakeOption[]>([]);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const currentCategory = searchParams.get("category") ?? "";
  const currentMake = searchParams.get("make") ?? "";
  const currentModel = searchParams.get("model") ?? "";
  const currentYear = searchParams.get("year") ?? "";
  const currentSort = searchParams.get("sort") ?? "newest";

  useEffect(() => {
    fetch("/api/car-compatibility/options")
      .then((res) => res.json())
      .then((json) => setMakeOptions(json.data ?? []))
      .catch(() => setMakeOptions([]));
  }, []);

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page"); // أي تغيير في الفلاتر يعيدنا للصفحة الأولى
    router.push(`${pathname}?${params.toString()}`);
  }

  const selectedMake = makeOptions.find((o) => o.make === currentMake);
  const years = selectedMake
    ? Array.from(
        { length: selectedMake.maxYear - selectedMake.minYear + 1 },
        (_, i) => selectedMake.maxYear - i
      )
    : [];

  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-64">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-graphite-700">القسم</h3>
        <div className="space-y-1.5">
          <FilterOption
            label="كل الأقسام"
            active={!currentCategory}
            onClick={() => updateParams({ category: null })}
          />
          {categories.map((cat) => (
            <FilterOption
              key={cat.id}
              label={`${cat.name} (${cat._count.products})`}
              active={currentCategory === cat.slug}
              onClick={() => updateParams({ category: cat.slug })}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-graphite-700">توافق السيارة</h3>
        <div className="space-y-2">
          <select
            value={currentMake}
            onChange={(e) => updateParams({ make: e.target.value || null, model: null, year: null })}
            className="w-full rounded-sm border border-graphite-200 px-2.5 py-2 text-sm"
          >
            <option value="">كل الشركات</option>
            {makeOptions.map((o) => (
              <option key={o.make} value={o.make}>{o.make}</option>
            ))}
          </select>
          <select
            value={currentModel}
            onChange={(e) => updateParams({ model: e.target.value || null })}
            disabled={!selectedMake}
            className="w-full rounded-sm border border-graphite-200 px-2.5 py-2 text-sm disabled:bg-graphite-50"
          >
            <option value="">كل الموديلات</option>
            {selectedMake?.models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={currentYear}
            onChange={(e) => updateParams({ year: e.target.value || null })}
            disabled={!selectedMake}
            className="w-full rounded-sm border border-graphite-200 px-2.5 py-2 text-sm disabled:bg-graphite-50"
          >
            <option value="">كل السنوات</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-graphite-700">نطاق السعر (ر.س)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="من"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-sm border border-graphite-200 px-2.5 py-2 text-sm"
          />
          <span className="text-graphite-400">-</span>
          <input
            type="number"
            min={0}
            placeholder="إلى"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-sm border border-graphite-200 px-2.5 py-2 text-sm"
          />
        </div>
        <button
          onClick={() => updateParams({ minPrice: minPrice || null, maxPrice: maxPrice || null })}
          className="mt-2 w-full rounded-sm border border-graphite-300 py-1.5 text-sm font-medium text-graphite-700 hover:bg-graphite-50"
        >
          تطبيق
        </button>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-graphite-700">الترتيب</h3>
        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="w-full rounded-sm border border-graphite-200 px-2.5 py-2 text-sm"
        >
          <option value="newest">الأحدث</option>
          <option value="price_asc">السعر: من الأقل للأعلى</option>
          <option value="price_desc">السعر: من الأعلى للأقل</option>
        </select>
      </div>
    </aside>
  );
}

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full rounded-sm px-2.5 py-1.5 text-right text-sm ${
        active
          ? "bg-graphite-800 text-white"
          : "text-graphite-600 hover:bg-graphite-100"
      }`}
    >
      {label}
    </button>
  );
}
