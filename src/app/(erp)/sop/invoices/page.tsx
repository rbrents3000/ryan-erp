import { listSalesInvoices } from "./actions";
import { SalesInvoiceList } from "./sales-invoice-list";

export default async function SalesInvoicesPage() {
  const data = await listSalesInvoices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sales Invoices</h1>
        <p className="text-sm text-muted-foreground">
          Invoices generated from sales orders.
        </p>
      </div>
      <SalesInvoiceList data={data} />
    </div>
  );
}
