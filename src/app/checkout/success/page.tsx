import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!searchParams.order) notFound();

  const order = await prisma.order.findUnique({
    where: { id: searchParams.order },
    include: { items: true },
  });

  if (!order || order.userId !== user.sub) notFound();

  return (
    <div className="container-page max-w-xl py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-success-500">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-onyx-900">تم استلام طلبك بنجاح</h1>
      <p className="mt-2 text-onyx-500">
        رقم الطلب: <span className="font-semibold text-onyx-800">{order.orderNumber}</span>
      </p>
      <p className="mt-1 text-sm text-onyx-400">
        {order.paymentStatus === "PAID"
          ? "تم تأكيد الدفع، وسنبدأ بتجهيز طلبك قريبًا."
          : "بانتظار تأكيد الدفع، سيصلك إشعار عند التأكيد."}
      </p>

      <div className="mt-6 rounded-lg border border-onyx-200 bg-white p-5 text-right">
        <ul className="space-y-2 text-sm text-onyx-600">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.productName} × {item.quantity}</span>
              <span>{formatPrice(Number(item.price) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-onyx-200 pt-3 font-bold text-onyx-900">
          <span>الإجمالي</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/products" className="rounded-sm border border-onyx-300 px-5 py-2.5 font-medium text-onyx-700 hover:bg-onyx-50">
          متابعة التسوّق
        </Link>
        <Link href="/account/orders" className="rounded-sm bg-onyx-800 px-5 py-2.5 font-medium text-white hover:bg-onyx-900">
          طلباتي
        </Link>
      </div>
    </div>
  );
}
