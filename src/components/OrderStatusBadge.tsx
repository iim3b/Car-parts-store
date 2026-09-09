import type { OrderStatus } from "@prisma/client";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "بانتظار الدفع",
  PAID: "تم الدفع",
  PROCESSING: "قيد التجهيز",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التسليم",
  CANCELLED: "ملغي",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-graphite-100 text-graphite-600",
  PAID: "bg-success-50 text-success-600",
  PROCESSING: "bg-amber-50 text-amber-600",
  SHIPPED: "bg-graphite-800 text-white",
  DELIVERED: "bg-success-500 text-white",
  CANCELLED: "bg-danger-50 text-danger-600",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block rounded-sm px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
