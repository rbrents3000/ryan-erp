export default function LotsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Lot Tracking</h1>
        <p className="text-sm text-muted-foreground">
          Track product lots, batches, and expiry dates.
        </p>
      </div>
      <div className="rounded-lg border bg-muted/30 p-8 text-center">
        <h2 className="text-lg font-medium mb-2">Coming Soon</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Lot tracking requires additional database fields for lot numbers, batch codes,
          and expiry dates. This feature will be available in a future update.
        </p>
      </div>
    </div>
  );
}
