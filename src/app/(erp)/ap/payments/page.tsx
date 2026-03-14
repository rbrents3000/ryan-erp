import { listPayments } from "./actions";
import { PaymentList } from "./payment-list";

export default async function PaymentsPage() {
  const paymentData = await listPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Manage vendor payment records.
        </p>
      </div>
      <PaymentList data={paymentData} />
    </div>
  );
}
