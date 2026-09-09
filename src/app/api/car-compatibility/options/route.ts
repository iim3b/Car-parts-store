import { getCarMakeOptions } from "@/lib/queries";
import { ok, handleApiError } from "@/lib/api-response";

export async function GET() {
  try {
    const makes = await getCarMakeOptions();
    return ok(makes);
  } catch (error) {
    return handleApiError(error);
  }
}
