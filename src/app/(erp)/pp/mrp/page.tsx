import { getMrpData } from "./actions";
import { MrpReport } from "./mrp-report";

export default async function MRPPage() {
  const data = await getMrpData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Material Requirements Planning</h1>
        <p className="text-sm text-muted-foreground">
          Supply and demand analysis for each product.
        </p>
      </div>
      <MrpReport data={data} />
    </div>
  );
}
