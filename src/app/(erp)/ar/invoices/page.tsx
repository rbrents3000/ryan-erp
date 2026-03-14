import { listArInvoices } from "./actions";
import { InvoiceList } from "./invoice-list";

export default async function ARInvoicesPage() {
  const invoices = await listArInvoices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">AR Invoices</h1>
        <p className="text-sm text-muted-foreground">
          Manage accounts receivable invoices.
        </p>
      </div>
      <InvoiceList data={invoices} />
    </div>
  );
}
