import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAllCategoriesForAdmin } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const categories = await getAllCategoriesForAdmin();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-onyx-800">منتج جديد</h1>
      <div className="rounded-lg border border-onyx-200 bg-white p-5">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
