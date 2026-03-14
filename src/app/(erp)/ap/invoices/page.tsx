import { listApInvoices } from "./actions";
import { InvoiceList } from "./invoice-list";

export default async function APInvoicesPage() {
  const invoices = await listApInvoices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">AP Invoices</h1>
        <p className="text-sm text-muted-foreground">
          Manage accounts payable invoices.
        </p>
      </div>
      <InvoiceList data={invoices} />
    </div>
  );
}
