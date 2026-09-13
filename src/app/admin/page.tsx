import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAdminStats } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const stats = await getAdminStats();

  const cards = [
    { label: "إجمالي الإيرادات", value: formatPrice(stats.totalRevenue) },
    { label: "إجمالي الطلبات", value: stats.totalOrders },
    { label: "طلبات بانتظار الدفع", value: stats.pendingOrders },
    { label: "عدد المنتجات", value: stats.totalProducts },
    { label: "منتجات منخفضة المخزون", value: stats.lowStockProducts, warn: stats.lowStockProducts > 0 },
    { label: "عدد العملاء", value: stats.totalUsers },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-onyx-800">نظرة عامة</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg border border-onyx-200 bg-white p-4">
            <p className="text-xs text-onyx-500">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold ${card.warn ? "text-gold-600" : "text-onyx-900"}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
