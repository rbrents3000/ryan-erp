import { listAssets } from "./actions";
import { AssetList } from "./asset-list";

export default async function AssetRegisterPage() {
  const data = await listAssets();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Asset Register</h1>
        <p className="text-sm text-muted-foreground">
          Manage fixed assets, locations, and book values.
        </p>
      </div>
      <AssetList data={data} />
    </div>
  );
}
