import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  productSchema,
  checkoutSchema,
  addToCartSchema,
  productQuerySchema,
} from "@/lib/validators";

describe("registerSchema", () => {
  it("يقبل بيانات تسجيل صحيحة", () => {
    const result = registerSchema.safeParse({
      name: "أحمد محمد",
      email: "ahmed@example.com",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });

  it("يرفض بريدًا إلكترونيًا غير صالح", () => {
    const result = registerSchema.safeParse({
      name: "أحمد",
      email: "not-an-email",
      password: "12345678",
    });
    expect(result.success).toBe(false);
  });

  it("يرفض كلمة مرور أقصر من 8 أحرف", () => {
    const result = registerSchema.safeParse({
      name: "أحمد",
      email: "ahmed@example.com",
      password: "123",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("يرفض كلمة مرور فارغة", () => {
    const result = loginSchema.safeParse({ email: "a@b.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("productSchema", () => {
  const validProduct = {
    name: "فلتر زيت",
    description: "فلتر زيت أصلي",
    sku: "ENG-001",
    price: 45,
    stock: 10,
    imageUrl: "https://example.com/image.png",
    categoryId: "cat_123",
  };

  it("يقبل منتجًا ببيانات كاملة وصحيحة", () => {
    expect(productSchema.safeParse(validProduct).success).toBe(true);
  });

  it("يرفض سعرًا سالبًا أو صفرًا", () => {
    expect(productSchema.safeParse({ ...validProduct, price: 0 }).success).toBe(false);
    expect(productSchema.safeParse({ ...validProduct, price: -10 }).success).toBe(false);
  });

  it("يرفض رابط صورة غير صالح", () => {
    expect(productSchema.safeParse({ ...validProduct, imageUrl: "not-a-url" }).success).toBe(false);
  });

  it("يرفض عدم وجود قسم", () => {
    expect(productSchema.safeParse({ ...validProduct, categoryId: "" }).success).toBe(false);
  });

  it("يقبل قائمة توافق سيارات صحيحة", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      compatibilities: [{ make: "تويوتا", model: "كامري", yearFrom: 2015, yearTo: 2020 }],
    });
    expect(result.success).toBe(true);
  });
});

describe("checkoutSchema", () => {
  it("يرفض عنوان شحن ناقص البيانات", () => {
    const result = checkoutSchema.safeParse({ shippingName: "خالد" });
    expect(result.success).toBe(false);
  });

  it("يقبل بيانات شحن كاملة", () => {
    const result = checkoutSchema.safeParse({
      shippingName: "خالد العتيبي",
      shippingPhone: "0501234567",
      shippingCity: "الرياض",
      shippingAddress: "حي النخيل، شارع الملك فهد",
    });
    expect(result.success).toBe(true);
  });
});

describe("addToCartSchema", () => {
  it("تكون الكمية الافتراضية 1 عند عدم تحديدها", () => {
    const result = addToCartSchema.parse({ productId: "prod_1" });
    expect(result.quantity).toBe(1);
  });

  it("يرفض كمية أكبر من 50", () => {
    const result = addToCartSchema.safeParse({ productId: "prod_1", quantity: 100 });
    expect(result.success).toBe(false);
  });
});

describe("productQuerySchema", () => {
  it("يحوّل قيم النصوص القادمة من searchParams إلى أرقام", () => {
    const result = productQuerySchema.parse({ year: "2018", minPrice: "50", page: "2" });
    expect(result.year).toBe(2018);
    expect(result.minPrice).toBe(50);
    expect(result.page).toBe(2);
  });

  it("يرفض قيمة sort غير معروفة", () => {
    const result = productQuerySchema.safeParse({ sort: "random" });
    expect(result.success).toBe(false);
  });
});
