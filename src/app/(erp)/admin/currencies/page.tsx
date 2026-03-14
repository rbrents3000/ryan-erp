import { listCurrencies } from "./actions";
import { CurrencyList } from "./currency-list";

export default async function CurrenciesPage() {
  const currencies = await listCurrencies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Currencies</h1>
        <p className="text-sm text-muted-foreground">
          Manage currency codes and exchange rates.
        </p>
      </div>
      <CurrencyList data={currencies} />
    </div>
  );
}
