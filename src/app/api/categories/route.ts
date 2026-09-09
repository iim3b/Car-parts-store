import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validators";
import { getCategories } from "@/lib/queries";
import { ok, handleApiError } from "@/lib/api-response";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const categories = await getCategories();
    return ok(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = categorySchema.parse(body);

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug || slugify(data.name),
        description: data.description,
        imageUrl: data.imageUrl,
      },
    });
    return ok(category, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
