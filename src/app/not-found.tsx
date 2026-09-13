import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold text-gold-500">خطأ 404</p>
      <h1 className="mt-2 text-2xl font-bold text-onyx-800">
        لم نعثر على هذه الصفحة
      </h1>
      <p className="mt-2 max-w-sm text-onyx-500">
        ربما تم حذف المنتج أو الصفحة، أو أن الرابط غير صحيح.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-sm bg-onyx-800 px-6 py-2.5 font-medium text-white hover:bg-onyx-900"
      >
        العودة للصفحة الرئيسية
      </Link>
    </div>
  );
}
