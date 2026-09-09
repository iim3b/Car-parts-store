import Link from "next/link";
import Image from "next/image";
import type { ProductWithCategory } from "@/types";
import { Price } from "./Price";
import { StockBadge } from "./StockBadge";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-graphite-200 bg-white transition-colors hover:border-graphite-300">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-graphite-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs text-graphite-500">{product.category.name}</span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] font-semibold text-graphite-800 hover:text-graphite-950">
            {product.name}
          </h3>
        </Link>

        {product.brand && (
          <span className="text-xs text-graphite-400">{product.brand}</span>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <Price value={product.price} compareAt={product.compareAtPrice} />
          <StockBadge stock={product.stock} />
        </div>

        <AddToCartButton
          productId={product.id}
          disabled={product.stock <= 0}
          className="mt-2 w-full"
        />
      </div>
    </div>
  );
}
