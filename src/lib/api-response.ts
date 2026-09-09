import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError } from "./auth";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/** يحوّل أي خطأ متوقع (تحقق صحة، مصادقة) إلى استجابة JSON مناسبة، ويسجّل الأخطاء غير المتوقعة */
export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: "بيانات غير صالحة",
        details: error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  if (error instanceof AuthError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    // خطأ Prisma لانتهاك قيد فريد (مثل بريد إلكتروني مكرر)
    if ("code" in error && (error as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { success: false, error: "هذه القيمة مستخدمة بالفعل" },
        { status: 409 }
      );
    }
    console.error("[API Error]", error.message);
  } else {
    console.error("[API Error]", error);
  }

  return NextResponse.json(
    { success: false, error: "حدث خطأ غير متوقع، الرجاء المحاولة لاحقًا" },
    { status: 500 }
  );
}
