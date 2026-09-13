export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-sm bg-danger-50 px-2 py-1 text-xs font-medium text-danger-600">
        <span className="h-1.5 w-1.5 rounded-full bg-danger-500" />
        نفدت الكمية
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-sm bg-gold-50 px-2 py-1 text-xs font-medium text-gold-600">
        <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
        بقي {stock} فقط
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm bg-success-50 px-2 py-1 text-xs font-medium text-success-600">
      <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
      متوفر
    </span>
  );
}
