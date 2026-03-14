import { listTimeCards } from "./actions";
import { TimeCardList } from "./time-card-list";

export default async function TimeCardsPage() {
  const data = await listTimeCards();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Time Cards</h1>
        <p className="text-sm text-muted-foreground">
          Record and post labor time against production jobs.
        </p>
      </div>
      <TimeCardList data={data} />
    </div>
  );
}
