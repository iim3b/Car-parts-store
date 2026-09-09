import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { getProductBySlug } from "@/lib/queries";
import { ok, fail, handleApiError } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductBySlug(params.id);
    if (!product) return fail("المنتج غير موجود", 404);
    return ok(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = productSchema.partial().parse(body);

    const { images, compatibilities, ...productFields } = data;

    const product = await prisma.$transaction(async (tx) => {
      if (images) {
        await tx.productImage.deleteMany({ where: { productId: params.id } });
      }
      if (compatibilities) {
        await tx.carCompatibility.deleteMany({ where: { productId: params.id } });
      }

      return tx.product.update({
        where: { id: params.id },
        data: {
          ...productFields,
          images: images
            ? { create: images.map((url, i) => ({ url, sortOrder: i })) }
            : undefined,
          compatibilities: compatibilities ? { create: compatibilities } : undefined,
        },
        include: { images: true, compatibilities: true, category: true },
      });
    });

    return ok(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    await prisma.product.delete({ where: { id: params.id } });
    return ok({ message: "تم حذف المنتج" });
  } catch (error) {
    return handleApiError(error);
  }
}
