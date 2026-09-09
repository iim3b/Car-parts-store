import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validators";
import { ok, fail, handleApiError } from "@/lib/api-response";
import { generateOrderNumber, calculateOrderTotals } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const shipping = checkoutSchema.parse(body);

    const cart = await prisma.cart.findUnique({
      where: { userId: session.sub },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return fail("السلة فارغة، أضف منتجات أولًا", 400);
    }

    // تحقق نهائي من توفر المخزون قبل إنشاء الطلب
    for (const item of cart.items) {
      if (!item.product.isActive) {
        return fail(`المنتج "${item.product.name}" لم يعد متاحًا`, 409);
      }
      if (item.product.stock < item.quantity) {
        return fail(
          `الكمية المتوفرة من "${item.product.name}": ${item.product.stock} فقط`,
          409
        );
      }
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const { shippingFee, total } = calculateOrderTotals(subtotal);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.sub,
        subtotal,
        shippingFee,
        total,
        shippingName: shipping.shippingName,
        shippingPhone: shipping.shippingPhone,
        shippingCity: shipping.shippingCity,
        shippingAddress: shipping.shippingAddress,
        notes: shipping.notes,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "sar",
        product_data: { name: item.product.name },
        unit_amount: Math.round(Number(item.product.price) * 100),
      },
      quantity: item.quantity,
    }));

    if (shippingFee > 0) {
      lineItems.push({
        price_data: {
          currency: "sar",
          product_data: { name: "رسوم الشحن" },
          unit_amount: Math.round(shippingFee * 100),
        },
        quantity: 1,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${siteUrl}/checkout/success?order=${order.id}`,
      cancel_url: `${siteUrl}/cart`,
      client_reference_id: order.id,
      metadata: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return ok({ checkoutUrl: checkoutSession.url, orderId: order.id }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
