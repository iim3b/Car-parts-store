import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { ok, handleApiError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return handleApiError(
        Object.assign(new Error("duplicate"), { code: "P2002" })
      );
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
      },
    });

    // سلة فارغة لكل مستخدم جديد
    await prisma.cart.create({ data: { userId: user.id } });

    await createSessionCookie({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return ok(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
