import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, user: { select: { name: true, phone: true } } },
  });

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-graphite-800">الطلبات ({orders.length})</h1>

      <div className="overflow-x-auto rounded-lg border border-graphite-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-graphite-200 bg-graphite-50 text-right text-graphite-500">
            <tr>
              <th className="p-3 font-medium">رقم الطلب</th>
              <th className="p-3 font-medium">العميل</th>
              <th className="p-3 font-medium">المدينة</th>
              <th className="p-3 font-medium">الإجمالي</th>
              <th className="p-3 font-medium">الدفع</th>
              <th className="p-3 font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-graphite-100 last:border-0">
                <td className="p-3 font-medium text-graphite-800">{order.orderNumber}</td>
                <td className="p-3 text-graphite-600">
                  {order.shippingName}
                  <div className="text-xs text-graphite-400">{order.shippingPhone}</div>
                </td>
                <td className="p-3 text-graphite-500">{order.shippingCity}</td>
                <td className="p-3 font-medium text-graphite-800">{formatPrice(order.total)}</td>
                <td className="p-3">
                  <span className={`rounded-sm px-2 py-0.5 text-xs ${order.paymentStatus === "PAID" ? "bg-success-50 text-success-600" : "bg-graphite-100 text-graphite-500"}`}>
                    {order.paymentStatus === "PAID" ? "مدفوع" : "غير مدفوع"}
                  </span>
                </td>
                <td className="p-3">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-graphite-400">لا توجد طلبات بعد.</p>
        )}
      </div>
    </div>
  );
}
