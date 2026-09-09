export default function LoadingProducts() {
  return (
    <div className="container-page py-8">
      <div className="mb-6 h-7 w-48 animate-pulse rounded-sm bg-graphite-200" />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hidden w-64 shrink-0 space-y-4 lg:block">
          <div className="h-40 animate-pulse rounded-lg bg-graphite-100" />
          <div className="h-32 animate-pulse rounded-lg bg-graphite-100" />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-graphite-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
