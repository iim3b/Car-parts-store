import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { ok, handleApiError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    const passwordOk = user
      ? await verifyPassword(data.password, user.passwordHash)
      : false;

    if (!user || !passwordOk) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    await createSessionCookie({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return ok({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    return handleApiError(error);
  }
}
