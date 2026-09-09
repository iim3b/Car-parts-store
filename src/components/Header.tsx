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
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#0a0a0c]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0 text-lg font-extrabold text-white tracking-wide">
          مستودع <span className="text-amber-400">القطع</span>
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-medium text-zinc-400 md:flex">
          <Link href="/" className="hover:text-amber-400 transition-colors">الرئيسية</Link>
          <Link href="/products" className="hover:text-amber-400 transition-colors">كل المنتجات</Link>
        </nav>

        <form onSubmit={handleSearch} className="mx-auto hidden max-w-sm flex-1 md:block">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن قطعة، ماركة، أو رقم القطعة..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:border-amber-500/50 focus:bg-zinc-900 focus:outline-none transition-all"
          />
        </form>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 transition-colors">
            <CartIcon />
            <span className="hidden text-xs sm:inline">السلة</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-black">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              {user.role === "ADMIN" && (
                <Link href="/admin" className="text-xs font-medium text-zinc-300 hover:text-amber-400 transition-colors">
                  لوحة التحكم
                </Link>
              )}
              <Link href="/account/orders" className="text-xs font-medium text-zinc-300 hover:text-amber-400 transition-colors">
                طلباتي
              </Link>
              <button onClick={handleLogout} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors">
                خروج
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/50 px-3.5 py-1.5 text-xs font-medium text-zinc-200 transition-all sm:block"
            >
              تسجيل الدخول
            </Link>
          )}

          <button
            className="text-zinc-300 hover:text-white md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="فتح القائمة"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-zinc-800 bg-[#0a0a0c] p-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن قطعة..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200"
            />
          </form>
          <nav className="flex flex-col gap-3 text-xs font-medium text-zinc-300">
            <Link href="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
            <Link href="/products" onClick={() => setMenuOpen(false)}>كل المنتجات</Link>
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)}>لوحة التحكم</Link>
                )}
                <Link href="/account/orders" onClick={() => setMenuOpen(false)}>طلباتي</Link>
                <button onClick={handleLogout} className="text-right text-red-400">
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L20.5 8H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}