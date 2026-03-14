import { listDepreciationEntries } from "./actions";
import { DepreciationList } from "./depreciation-list";

export default async function DepreciationPage() {
  const data = await listDepreciationEntries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Depreciation</h1>
        <p className="text-sm text-muted-foreground">
          View depreciation entries for fixed assets.
        </p>
      </div>
      <DepreciationList data={data} />
    </div>
  );
}
