import { getTrialBalance } from "./actions";
import { TrialBalanceReport } from "./trial-balance-report";

interface Props {
  searchParams: Promise<{ asOfDate?: string }>;
}

export default async function TrialBalancePage({ searchParams }: Props) {
  const { asOfDate } = await searchParams;
  const data = await getTrialBalance(asOfDate);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Trial Balance</h1>
        <p className="text-sm text-muted-foreground">
          View account balances from posted journal entries.
        </p>
      </div>
      <TrialBalanceReport data={data} />
    </div>
  );
}
