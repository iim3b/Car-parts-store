import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { updateOrderStatusSchema } from "@/lib/validators";
import { ok, handleApiError } from "@/lib/api-response";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = updateOrderStatusSchema.parse(body);

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: data.status },
    });

    return ok(order);
  } catch (error) {
    return handleApiError(error);
  }
}
