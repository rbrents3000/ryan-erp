import { listParameters } from "./actions";
import { ParameterList } from "./parameter-list";

export default async function SystemParametersPage() {
  const params = await listParameters();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">System Parameters</h1>
        <p className="text-sm text-muted-foreground">
          Configure system-wide settings and defaults.
        </p>
      </div>
      <ParameterList data={params} />
    </div>
  );
}
