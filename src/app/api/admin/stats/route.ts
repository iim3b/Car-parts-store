import { requireAdmin } from "@/lib/auth";
import { getAdminStats } from "@/lib/queries";
import { ok, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    await requireAdmin();
    const stats = await getAdminStats();
    return ok(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
