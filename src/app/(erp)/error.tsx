"use client";

export default function ErpError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("ERP error:", error);

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          An error occurred while loading this page.
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
