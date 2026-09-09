import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { updateCartItemSchema } from "@/lib/validators";
import { ok, fail, handleApiError } from "@/lib/api-response";

async function assertOwnership(itemId: string, userId: string) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true, product: true },
  });
  if (!item || item.cart.userId !== userId) {
    return null;
  }
  return item;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const data = updateCartItemSchema.parse(body);

    const item = await assertOwnership(params.itemId, session.sub);
    if (!item) return fail("العنصر غير موجود في سلتك", 404);

    if (item.product.stock < data.quantity) {
      return fail(`الكمية المتوفرة في المخزون: ${item.product.stock} فقط`, 409);
    }

    await prisma.cartItem.update({
      where: { id: params.itemId },
      data: { quantity: data.quantity },
    });

    return ok({ message: "تم تحديث الكمية" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await requireUser();
    const item = await assertOwnership(params.itemId, session.sub);
    if (!item) return fail("العنصر غير موجود في سلتك", 404);

    await prisma.cartItem.delete({ where: { id: params.itemId } });
    return ok({ message: "تم حذف المنتج من السلة" });
  } catch (error) {
    return handleApiError(error);
  }
}
