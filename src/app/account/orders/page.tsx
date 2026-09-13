import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const orders = user
    ? await prisma.order.findMany({
        where: { userId: user.sub },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      })
    : [];

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-bold text-onyx-800">طلباتي</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-onyx-300 py-16 text-center text-onyx-500">
          لا توجد طلبات بعد.
          <div>
            <Link href="/products" className="mt-3 inline-block font-medium text-gold-600 hover:text-gold-700">
              ابدأ التسوّق
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex flex-col gap-2 rounded-lg border border-onyx-200 bg-white p-4 hover:border-onyx-300 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-onyx-800">{order.orderNumber}</p>
                <p className="text-sm text-onyx-400">
                  {new Date(order.createdAt).toLocaleDateString("ar-SA")} · {order.items.length} منتج
                </p>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <span className="font-semibold text-onyx-800">{formatPrice(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
