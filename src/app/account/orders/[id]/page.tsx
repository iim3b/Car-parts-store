import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order || !user || order.userId !== user.sub) notFound();

  return (
    <div className="container-page max-w-2xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-graphite-800">طلب {order.orderNumber}</h1>
          <p className="text-sm text-graphite-400">
            {new Date(order.createdAt).toLocaleString("ar-SA")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="rounded-lg border border-graphite-200 bg-white p-5">
        <h2 className="mb-3 font-semibold text-graphite-800">المنتجات</h2>
        <ul className="space-y-2 text-sm text-graphite-600">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.productName} × {item.quantity}</span>
              <span>{formatPrice(Number(item.price) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-graphite-200 pt-3 text-sm">
          <div className="flex justify-between text-graphite-600">
            <span>المجموع الفرعي</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-graphite-600">
            <span>الشحن</span>
            <span>{Number(order.shippingFee) === 0 ? "مجاني" : formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-graphite-200 pt-2 font-bold text-graphite-900">
            <span>الإجمالي</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-graphite-200 bg-white p-5">
        <h2 className="mb-2 font-semibold text-graphite-800">عنوان الشحن</h2>
        <p className="text-sm text-graphite-600">{order.shippingName} — {order.shippingPhone}</p>
        <p className="text-sm text-graphite-600">{order.shippingCity}، {order.shippingAddress}</p>
        {order.notes && <p className="mt-1 text-sm text-graphite-400">ملاحظات: {order.notes}</p>}
      </div>
    </div>
  );
}
