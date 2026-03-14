import { listDespatchNotes } from "./actions";
import { DespatchList } from "./despatch-list";

export default async function DespatchPage() {
  const data = await listDespatchNotes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Despatch</h1>
        <p className="text-sm text-muted-foreground">
          Manage order picking, packing, and despatch notes.
        </p>
      </div>
      <DespatchList data={data} />
    </div>
  );
}
