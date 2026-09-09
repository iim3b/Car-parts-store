import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAllProductsForAdmin } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const products = await getAllProductsForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-graphite-800">المنتجات ({products.length})</h1>
        <Link
          href="/admin/products/new"
          className="rounded-sm bg-graphite-800 px-4 py-2 text-sm font-medium text-white hover:bg-graphite-900"
        >
          + منتج جديد
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-graphite-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-graphite-200 bg-graphite-50 text-right text-graphite-500">
            <tr>
              <th className="p-3 font-medium">المنتج</th>
              <th className="p-3 font-medium">القسم</th>
              <th className="p-3 font-medium">السعر</th>
              <th className="p-3 font-medium">المخزون</th>
              <th className="p-3 font-medium">الحالة</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-graphite-100 last:border-0">
                <td className="p-3 font-medium text-graphite-800">{product.name}</td>
                <td className="p-3 text-graphite-500">{product.category.name}</td>
                <td className="p-3 text-graphite-700">{formatPrice(product.price)}</td>
                <td className={`p-3 ${product.stock <= 5 ? "text-amber-600" : "text-graphite-700"}`}>
                  {product.stock}
                </td>
                <td className="p-3">
                  <span className={`rounded-sm px-2 py-0.5 text-xs ${product.isActive ? "bg-success-50 text-success-600" : "bg-graphite-100 text-graphite-500"}`}>
                    {product.isActive ? "منشور" : "مخفي"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-sm font-medium text-graphite-600 hover:text-graphite-900">
                      تعديل
                    </Link>
                    <DeleteButton
                      endpoint={`/api/products/${product.id}`}
                      confirmMessage={`هل أنت متأكد من حذف "${product.name}"؟`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-graphite-400">لا توجد منتجات بعد.</p>
        )}
      </div>
    </div>
  );
}
