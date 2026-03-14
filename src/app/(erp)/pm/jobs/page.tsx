import { listJobs } from "./actions";
import { JobList } from "./job-list";

export default async function JobsPage() {
  const jobs = await listJobs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Production Jobs</h1>
        <p className="text-sm text-muted-foreground">
          Manage production job orders and work orders.
        </p>
      </div>
      <JobList data={jobs} />
    </div>
  );
}
