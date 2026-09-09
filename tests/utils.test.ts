import { describe, it, expect } from "vitest";
import {
  formatPrice,
  slugify,
  clampPage,
  generateOrderNumber,
  calculateOrderTotals,
} from "@/lib/utils";

describe("formatPrice", () => {
  it("يُنسّق رقمًا صحيحًا كعملة سعودية", () => {
    const result = formatPrice(150);
    expect(result).toContain("150");
  });

  it("يقبل قيمة نصية ويحوّلها بنجاح", () => {
    const result = formatPrice("99.5");
    expect(result).toContain("99.50") ;
  });
});

describe("slugify", () => {
  it("يحوّل النص الإنجليزي إلى رابط صالح بأحرف صغيرة وشرطات", () => {
    expect(slugify("Brake Pads Set")).toBe("brake-pads-set");
  });

  it("يحافظ على الأحرف العربية", () => {
    expect(slugify("تيل فرامل")).toBe("تيل-فرامل");
  });

  it("يزيل الرموز غير المسموحة ويدمج المسافات المتكررة", () => {
    expect(slugify("Product!!  Name??")).toBe("product-name");
  });
});

describe("clampPage", () => {
  it("يعيد 1 عند عدم تمرير قيمة", () => {
    expect(clampPage(undefined)).toBe(1);
  });

  it("يعيد 1 عند قيمة سالبة أو صفر", () => {
    expect(clampPage(0)).toBe(1);
    expect(clampPage(-5)).toBe(1);
  });

  it("يعيد نفس الرقم عند قيمة صحيحة موجبة", () => {
    expect(clampPage(3)).toBe(3);
  });

  it("يُقرّب الأرقام العشرية لأسفل", () => {
    expect(clampPage(2.9)).toBe(2);
  });
});

describe("generateOrderNumber", () => {
  it("يبدأ بالبادئة ORD- ويحتوي على التاريخ الحالي", () => {
    const orderNumber = generateOrderNumber();
    const year = new Date().getFullYear();
    expect(orderNumber.startsWith("ORD-")).toBe(true);
    expect(orderNumber).toContain(String(year));
  });

  it("يولّد أرقامًا مختلفة عند الاستدعاء المتكرر (احتمال تصادم ضئيل جدًا)", () => {
    const numbers = new Set(Array.from({ length: 20 }, () => generateOrderNumber()));
    expect(numbers.size).toBeGreaterThan(1);
  });
});

describe("calculateOrderTotals", () => {
  it("يضيف رسوم شحن ثابتة عند عدم بلوغ حد الشحن المجاني", () => {
    const { shippingFee, total } = calculateOrderTotals(100);
    expect(shippingFee).toBe(25);
    expect(total).toBe(125);
  });

  it("يجعل الشحن مجانيًا عند بلوغ الحد الأدنى بالضبط", () => {
    const { shippingFee, total } = calculateOrderTotals(300);
    expect(shippingFee).toBe(0);
    expect(total).toBe(300);
  });

  it("يجعل الشحن مجانيًا لما فوق الحد", () => {
    const { shippingFee } = calculateOrderTotals(500);
    expect(shippingFee).toBe(0);
  });

  it("لا يضيف رسوم شحن لسلة فارغة (subtotal = 0)", () => {
    const { shippingFee, total } = calculateOrderTotals(0);
    expect(shippingFee).toBe(0);
    expect(total).toBe(0);
  });
});
