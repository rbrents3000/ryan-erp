import { getProductionSchedule } from "./actions";
import { ScheduleList } from "./schedule-list";

export default async function ProductionSchedulePage() {
  const data = await getProductionSchedule();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Production Schedule</h1>
        <p className="text-sm text-muted-foreground">
          Active and upcoming production jobs.
        </p>
      </div>
      <ScheduleList data={data} />
    </div>
  );
}
