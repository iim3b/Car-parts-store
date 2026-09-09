import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/api-response";
import type { OrderStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const status = request.nextUrl.searchParams.get("status") as OrderStatus | null;

    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      include: { items: true, user: { select: { name: true, email: true, phone: true } } },
    });

    return ok(orders);
  } catch (error) {
    return handleApiError(error);
  }
}
