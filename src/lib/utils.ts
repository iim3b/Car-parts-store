import { Prisma } from "@prisma/client";

/** أي قيمة سعر قد تصل من الواجهة (string/number) أو مباشرة من قاعدة البيانات (Prisma.Decimal) */
export type PriceValue = number | string | Prisma.Decimal;

/** يحوّل أي قيمة سعر (رقم، نص، أو Prisma.Decimal) إلى رقم عادي بأمان */
export function toNumber(value: PriceValue): number {
  return typeof value === "number" ? value : parseFloat(value.toString());
}

/** تنسيق السعر بالريال السعودي بأرقام لاتينية واضحة (0-9) مع خانتين عشريتين */
export function formatPrice(value: PriceValue): string {
  return new Intl.NumberFormat("ar-SA-u-nu-latn", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 2,
  }).format(toNumber(value));
}

/** توليد رقم طلب فريد قابل للقراءة، مثال: ORD-20260904-4821 */
export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${y}${m}${d}-${random}`;
}

/** تحويل نص عربي/إنجليزي إلى slug صالح للروابط */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const SHIPPING_FEE = 25;
export const FREE_SHIPPING_THRESHOLD = 300;

/** يحسب رسوم الشحن والإجمالي بشكل نقي وقابل للاختبار (شحن مجاني فوق حد معيّن) */
export function calculateOrderTotals(subtotal: number) {
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  return { shippingFee, total };
}

export function clampPage(page: number | undefined): number {
  if (!page || Number.isNaN(page) || page < 1) return 1;
  return Math.floor(page);
}
