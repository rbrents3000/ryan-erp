import { getAgingReport } from "./actions";
import { AgingReport } from "./aging-report";

interface Props {
  searchParams: Promise<{ asOfDate?: string }>;
}

export default async function ARAgingPage({ searchParams }: Props) {
  const { asOfDate } = await searchParams;
  const data = await getAgingReport(asOfDate);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">AR Aging Report</h1>
        <p className="text-sm text-muted-foreground">
          Outstanding receivables by aging bucket.
        </p>
      </div>
      <AgingReport data={data} />
    </div>
  );
}
