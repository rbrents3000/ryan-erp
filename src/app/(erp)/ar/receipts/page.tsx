import { listReceipts } from "./actions";
import { ReceiptList } from "./receipt-list";

export default async function CashReceiptsPage() {
  const receipts = await listReceipts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Cash Receipts</h1>
        <p className="text-sm text-muted-foreground">
          Manage customer payments and cash receipts.
        </p>
      </div>
      <ReceiptList data={receipts} />
    </div>
  );
}
