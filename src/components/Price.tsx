import { formatPrice, toNumber, type PriceValue } from "@/lib/utils";

export function Price({
  value,
  compareAt,
  size = "md",
}: {
  value: PriceValue;
  compareAt?: PriceValue | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-bold text-gold-600 ${sizeClasses[size]}`}>
        {formatPrice(value)}
      </span>
      {compareAt && toNumber(compareAt) > toNumber(value) && (
        <span className="text-sm text-onyx-400 line-through">
          {formatPrice(compareAt)}
        </span>
      )}
    </div>
  );
}
