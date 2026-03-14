import { listCompanies } from "./actions";
import { CompanyList } from "./company-list";

export default async function CompaniesPage() {
  const companies = await listCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Companies</h1>
        <p className="text-sm text-muted-foreground">
          Manage company records and organizational structure.
        </p>
      </div>
      <CompanyList data={companies} />
    </div>
  );
}
