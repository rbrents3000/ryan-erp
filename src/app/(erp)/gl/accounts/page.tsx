import { listGlAccounts } from "./actions";
import { GlAccountList } from "./account-list";

export default async function GlAccountsPage() {
  const accounts = await listGlAccounts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Chart of Accounts</h1>
        <p className="text-sm text-muted-foreground">
          Manage general ledger accounts for financial reporting.
        </p>
      </div>
      <GlAccountList data={accounts} />
    </div>
  );
}
