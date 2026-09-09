import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCategories } from "@/lib/queries";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-graphite-800">الأقسام</h1>

      <div className="mb-6 rounded-lg border border-graphite-200 bg-white p-4">
        <CategoryForm />
      </div>

      <div className="overflow-x-auto rounded-lg border border-graphite-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-graphite-200 bg-graphite-50 text-right text-graphite-500">
            <tr>
              <th className="p-3 font-medium">القسم</th>
              <th className="p-3 font-medium">الوصف</th>
              <th className="p-3 font-medium">عدد المنتجات</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-graphite-100 last:border-0">
                <td className="p-3 font-medium text-graphite-800">{category.name}</td>
                <td className="p-3 text-graphite-500">{category.description || "—"}</td>
                <td className="p-3 text-graphite-700">{category._count.products}</td>
                <td className="p-3 text-left">
                  <DeleteButton
                    endpoint={`/api/categories/${category.id}`}
                    confirmMessage={`حذف قسم "${category.name}"؟ لن يمكن الحذف إن كان يحتوي على منتجات.`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
