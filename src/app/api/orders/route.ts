import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await requireUser();
    const orders = await prisma.order.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return ok(orders);
  } catch (error) {
    return handleApiError(error);
  }
}
