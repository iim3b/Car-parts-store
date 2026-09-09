import { clearSessionCookie } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/api-response";

export async function POST() {
  try {
    await clearSessionCookie();
    return ok({ message: "تم تسجيل الخروج" });
  } catch (error) {
    return handleApiError(error);
  }
}
