"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MakeOption = { make: string; models: string[]; minYear: number; maxYear: number };

export function CarFitmentSelector() {
  const [options, setOptions] = useState<MakeOption[]>([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/car-compatibility/options")
      .then((res) => res.json())
      .then((json) => setOptions(json.data ?? []))
      .catch(() => setOptions([]));
  }, []);

  const selectedMake = options.find((o) => o.make === make);
  const years = selectedMake
    ? Array.from(
        { length: selectedMake.maxYear - selectedMake.minYear + 1 },
        (_, i) => selectedMake.maxYear - i
      )
    : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (year) params.set("year", year);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border-t-2 border-gold-400 bg-white p-4 shadow-card sm:flex-row sm:items-end sm:gap-3 sm:p-5"
    >
      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-onyx-500">
          الشركة المصنّعة
        </label>
        <select
          value={make}
          onChange={(e) => {
            setMake(e.target.value);
            setModel("");
            setYear("");
          }}
          className="w-full rounded-sm border border-onyx-200 bg-white px-3 py-2.5 text-onyx-800 focus:border-gold-400"
        >
          <option value="">اختر الشركة</option>
          {options.map((o) => (
            <option key={o.make} value={o.make}>
              {o.make}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-onyx-500">الموديل</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={!selectedMake}
          className="w-full rounded-sm border border-onyx-200 bg-white px-3 py-2.5 text-onyx-800 focus:border-gold-400 disabled:bg-onyx-50 disabled:text-onyx-300"
        >
          <option value="">اختر الموديل</option>
          {selectedMake?.models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="mb-1 block text-xs font-medium text-onyx-500">سنة الصنع</label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          disabled={!selectedMake}
          className="w-full rounded-sm border border-onyx-200 bg-white px-3 py-2.5 text-onyx-800 focus:border-gold-400 disabled:bg-onyx-50 disabled:text-onyx-300"
        >
          <option value="">اختر السنة</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-sm bg-gold-400 px-6 py-2.5 font-semibold text-onyx-900 transition-colors hover:bg-gold-300 sm:w-auto"
      >
        عرض القطع المتوافقة
      </button>
    </form>
  );
}
