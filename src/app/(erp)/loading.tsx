export default function ErpLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}
