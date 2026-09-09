import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-key-for-vitest-only";
});

describe("hashPassword / verifyPassword", () => {
  it("يُنتج تجزئة مختلفة عن كلمة المرور الأصلية ويتحقق منها بنجاح", async () => {
    const { hashPassword, verifyPassword } = await import("@/lib/auth");
    const hash = await hashPassword("MySecret123");
    expect(hash).not.toBe("MySecret123");
    expect(await verifyPassword("MySecret123", hash)).toBe(true);
  });

  it("يرفض كلمة مرور خاطئة", async () => {
    const { hashPassword, verifyPassword } = await import("@/lib/auth");
    const hash = await hashPassword("MySecret123");
    expect(await verifyPassword("WrongPassword", hash)).toBe(false);
  });
});

describe("signSession / verifySessionToken", () => {
  it("يُنشئ توكن JWT صالحًا يمكن التحقق منه واستخراج البيانات منه", async () => {
    const { signSession, verifySessionToken } = await import("@/lib/auth");
    const payload = {
      sub: "user_123",
      name: "أحمد",
      email: "ahmed@example.com",
      role: "CUSTOMER" as const,
    };
    const token = await signSession(payload);
    const decoded = await verifySessionToken(token);

    expect(decoded?.sub).toBe(payload.sub);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe("CUSTOMER");
  });

  it("يرفض توكن غير صالح ويعيد null بدل رمي استثناء", async () => {
    const { verifySessionToken } = await import("@/lib/auth");
    const decoded = await verifySessionToken("this-is-not-a-valid-jwt");
    expect(decoded).toBeNull();
  });
});
