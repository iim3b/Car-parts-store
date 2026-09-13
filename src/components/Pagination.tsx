import Link from "next/link";

export function Pagination({
  currentPage,
  totalPages,
  searchParams,
  basePath = "/products",
}: {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
  basePath?: string;
}) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page" && key !== "category") params.set(key, value);
    }
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5">
      {currentPage > 1 && (
        <Link href={buildHref(currentPage - 1)} className="rounded-sm border border-onyx-200 px-3 py-1.5 text-sm hover:bg-onyx-50">
          السابق
        </Link>
      )}

      {pages.map((page, idx) => (
        <span key={page} className="flex items-center gap-1.5">
          {idx > 0 && pages[idx - 1] !== page - 1 && <span className="text-onyx-300">…</span>}
          <Link
            href={buildHref(page)}
            className={`rounded-sm px-3 py-1.5 text-sm ${
              page === currentPage
                ? "bg-onyx-800 text-white"
                : "border border-onyx-200 hover:bg-onyx-50"
            }`}
          >
            {page}
          </Link>
        </span>
      ))}

      {currentPage < totalPages && (
        <Link href={buildHref(currentPage + 1)} className="rounded-sm border border-onyx-200 px-3 py-1.5 text-sm hover:bg-onyx-50">
          التالي
        </Link>
      )}
    </nav>
  );
}
