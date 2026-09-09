"use client";

import { create } from "zustand";

export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  price: string;
  imageUrl: string;
  stock: number;
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: CartProduct;
};

type ActionResult = { ok: true } | { ok: false; error: string };

type CartState = {
  items: CartItem[];
  loading: boolean;
  initialized: boolean;
  count: number;
  subtotal: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<ActionResult>;
  updateItem: (itemId: string, quantity: number) => Promise<ActionResult>;
  removeItem: (itemId: string) => Promise<ActionResult>;
};

function computeTotals(items: CartItem[]) {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  return { count, subtotal };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  initialized: false,
  count: 0,
  subtotal: 0,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (res.status === 401) {
        set({ items: [], count: 0, subtotal: 0, initialized: true, loading: false });
        return;
      }
      const json = await res.json();
      const items: CartItem[] = json.data?.items ?? [];
      const { count, subtotal } = computeTotals(items);
      set({ items, count, subtotal, initialized: true, loading: false });
    } catch {
      set({ loading: false, initialized: true });
    }
  },

  addItem: async (productId, quantity = 1) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        return { ok: false, error: json.error ?? "تعذّرت إضافة المنتج" };
      }
      const items: CartItem[] = json.data.items;
      const { count, subtotal } = computeTotals(items);
      set({ items, count, subtotal });
      return { ok: true };
    } catch {
      return { ok: false, error: "تعذّر الاتصال بالخادم" };
    }
  },

  updateItem: async (itemId, quantity) => {
    const prevItems = get().items;
    // تحديث متفائل للواجهة قبل تأكيد الخادم
    const optimistic = prevItems.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    set({ items: optimistic, ...computeTotals(optimistic) });

    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        set({ items: prevItems, ...computeTotals(prevItems) });
        return { ok: false, error: json.error ?? "تعذّر تحديث الكمية" };
      }
      return { ok: true };
    } catch {
      set({ items: prevItems, ...computeTotals(prevItems) });
      return { ok: false, error: "تعذّر الاتصال بالخادم" };
    }
  },

  removeItem: async (itemId) => {
    const prevItems = get().items;
    const optimistic = prevItems.filter((item) => item.id !== itemId);
    set({ items: optimistic, ...computeTotals(optimistic) });

    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        set({ items: prevItems, ...computeTotals(prevItems) });
        return { ok: false, error: json.error ?? "تعذّر حذف المنتج" };
      }
      return { ok: true };
    } catch {
      set({ items: prevItems, ...computeTotals(prevItems) });
      return { ok: false, error: "تعذّر الاتصال بالخادم" };
    }
  },
}));
