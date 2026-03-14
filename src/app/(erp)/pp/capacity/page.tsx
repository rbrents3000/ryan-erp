import { getCapacityData } from "./actions";
import { CapacityReport } from "./capacity-report";

export default async function CapacityPlanningPage() {
  const data = await getCapacityData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Capacity Planning</h1>
        <p className="text-sm text-muted-foreground">
          Labor hours and cost summary by week.
        </p>
      </div>
      <CapacityReport data={data} />
    </div>
  );
}
