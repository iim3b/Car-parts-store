import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/categories", label: "الأقسام" },
  { href: "/admin/orders", label: "الطلبات" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page grid gap-6 py-8 lg:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-lg border border-onyx-200 bg-white p-3">
        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium text-onyx-600 hover:bg-onyx-100 hover:text-onyx-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div>{children}</div>
    </div>
  );
}
