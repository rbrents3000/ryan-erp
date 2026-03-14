import { listJournals } from "./actions";
import { JournalList } from "./journal-list";

export default async function JournalEntriesPage() {
  const journals = await listJournals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Journal Entries</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage general ledger journal entries.
        </p>
      </div>
      <JournalList data={journals} />
    </div>
  );
}
