"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";

type CurrentUser = { sub: string; name: string; email: string; role: "CUSTOMER" | "ADMIN" } | null;

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser>(null);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useCartStore((s) => s.count);
  const fetchCart = useCartStore((s) => s.fetchCart);

  useEffect(() => {
    fetchCart();
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => setUser(json.data?.user ?? null))
      .catch(() => setUser(null));
  }, [fetchCart]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(search ? `/products?search=${encodeURIComponent(search)}` : "/products");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gold-600/30 bg-onyx-950/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="shrink-0 text-xl font-bold text-white">
          مستودع <span className="text-gold-400">القطع</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-onyx-300 md:flex">
          <Link href="/" className="hover:text-white">الرئيسية</Link>
          <Link href="/products" className="hover:text-white">كل المنتجات</Link>
        </nav>

        <form onSubmit={handleSearch} className="mx-auto hidden max-w-md flex-1 md:block">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن قطعة، ماركة، أو رقم القطعة..."
            className="w-full rounded-sm border border-onyx-700 bg-onyx-900/70 px-3 py-2 text-sm text-onyx-100 placeholder:text-onyx-500 focus:border-gold-400 focus:bg-onyx-900"
          />
        </form>

        <div className="mr-auto flex items-center gap-3 md:mr-0">
          <Link href="/cart" className="relative flex items-center gap-1.5 text-onyx-200 hover:text-white">
            <CartIcon />
            <span className="hidden text-sm sm:inline">السلة</span>
            {count > 0 && (
              <span className="absolute -top-2 -left-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-400 px-1 text-xs font-bold text-onyx-900">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              {user.role === "ADMIN" && (
                <Link href="/admin" className="text-sm font-medium text-onyx-300 hover:text-white">
                  لوحة التحكم
                </Link>
              )}
              <Link href="/account/orders" className="text-sm font-medium text-onyx-300 hover:text-white">
                طلباتي
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-onyx-400 hover:text-danger-400">
                خروج
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-sm bg-gold-400 px-4 py-2 text-sm font-semibold text-onyx-900 hover:bg-gold-300 sm:block"
            >
              تسجيل الدخول
            </Link>
          )}

          <button
            className="text-onyx-200 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="فتح القائمة"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-onyx-800 bg-onyx-950 p-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن قطعة..."
              className="w-full rounded-sm border border-onyx-700 bg-onyx-900 px-3 py-2 text-sm text-onyx-100"
            />
          </form>
          <nav className="flex flex-col gap-3 text-sm font-medium text-onyx-200">
            <Link href="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
            <Link href="/products" onClick={() => setMenuOpen(false)}>كل المنتجات</Link>
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)}>لوحة التحكم</Link>
                )}
                <Link href="/account/orders" onClick={() => setMenuOpen(false)}>طلباتي</Link>
                <button onClick={handleLogout} className="text-right text-danger-400">
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}>تسجيل الدخول</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L20.5 8H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}
