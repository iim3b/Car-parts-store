import { formatPrice } from "@/lib/utils";

export function Price({
  value,
  compareAt,
  size = "md",
}: {
  value: number | string;
  compareAt?: number | string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-bold text-amber-600 ${sizeClasses[size]}`}>
        {formatPrice(value)}
      </span>
      {compareAt && Number(compareAt) > Number(value) && (
        <span className="text-sm text-graphite-400 line-through">
          {formatPrice(compareAt)}
        </span>
      )}
    </div>
  );
}
