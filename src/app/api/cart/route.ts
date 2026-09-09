import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { addToCartSchema } from "@/lib/validators";
import { ok, fail, handleApiError } from "@/lib/api-response";

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: {
      items: {
        include: { product: { include: { category: true } } },
        orderBy: { id: "asc" },
      },
    },
  });
}

export async function GET() {
  try {
    const session = await requireUser();
    const cart = await getOrCreateCart(session.sub);
    return ok(cart);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const data = addToCartSchema.parse(body);

    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product || !product.isActive) return fail("المنتج غير متاح", 404);
    if (product.stock < data.quantity) {
      return fail(`الكمية المتوفرة في المخزون: ${product.stock} فقط`, 409);
    }

    const cart = await prisma.cart.upsert({
      where: { userId: session.sub },
      update: {},
      create: { userId: session.sub },
    });

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId: data.productId } },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + data.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId: data.productId, quantity: data.quantity },
      });
    }

    const updatedCart = await getOrCreateCart(session.sub);
    return ok(updatedCart, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
