import { getTenantContext } from "@/lib/auth/tenant";
import { listPeriods } from "./actions";
import { PeriodList } from "./period-list";

export default async function AccountingPeriodsPage() {
  const ctx = await getTenantContext();
  const defaultCompany = ctx.defaultCompanyCode;
  const periods = await listPeriods(defaultCompany);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Accounting Periods</h1>
        <p className="text-sm text-muted-foreground">
          Manage fiscal years and accounting period open/close status.
        </p>
      </div>
      <PeriodList initialData={periods} initialCompanyCode={defaultCompany} />
    </div>
  );
}
