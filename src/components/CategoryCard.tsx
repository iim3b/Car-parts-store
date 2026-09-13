import Link from "next/link";
import Image from "next/image";
import type { CategoryWithCount } from "@/types";

export function CategoryCard({ category }: { category: CategoryWithCount }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-lg border border-onyx-200 bg-white p-5 text-center transition-colors hover:border-gold-300 hover:bg-gold-50/40"
    >
      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-onyx-100">
        {category.imageUrl ? (
          <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
        ) : (
          <span className="text-2xl font-bold text-onyx-400">
            {category.name.charAt(0)}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-onyx-800 group-hover:text-onyx-950">
          {category.name}
        </h3>
        <p className="text-xs text-onyx-400">{category._count.products} منتج</p>
      </div>
    </Link>
  );
}
