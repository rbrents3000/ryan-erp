import { ModulePlaceholder } from "@/components/erp/module-placeholder";

export default function TrialBalancePage() {
  return (
    <ModulePlaceholder
      title="Trial Balance"
      description="View account balances for the selected accounting period."
      moduleCode="GL"
    />
  );
}
