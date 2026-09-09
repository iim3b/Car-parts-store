import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validators";
import { ok, fail, handleApiError } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    });
    if (!category) {
      return fail("القسم غير موجود", 404);
    }
    return ok(category);
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
    const data = categorySchema.partial().parse(body);

    const category = await prisma.category.update({
      where: { id: params.id },
      data,
    });
    return ok(category);
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
    await prisma.category.delete({ where: { id: params.id } });
    return ok({ message: "تم حذف القسم" });
  } catch (error) {
    return handleApiError(error);
  }
}
