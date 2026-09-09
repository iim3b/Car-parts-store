import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, fail, handleApiError } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireUser();
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order) return fail("الطلب غير موجود", 404);
    if (order.userId !== session.sub && session.role !== "ADMIN") {
      return fail("لا تملك صلاحية عرض هذا الطلب", 403);
    }

    return ok(order);
  } catch (error) {
    return handleApiError(error);
  }
}
