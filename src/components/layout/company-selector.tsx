"use client";

import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompanyStore } from "@/lib/stores/company-store";

interface CompanySelectorProps {
  companies: { companyCode: string; name: string }[];
  defaultCode: string;
}

export function CompanySelector({
  companies,
  defaultCode,
}: CompanySelectorProps) {
  const { companyCode, setCompany } = useCompanyStore();

  useEffect(() => {
    if (!companyCode && companies.length > 0) {
      const defaultCompany =
        companies.find((c) => c.companyCode === defaultCode) ?? companies[0];
      setCompany(defaultCompany.companyCode, defaultCompany.name);
    }
  }, [companyCode, companies, defaultCode, setCompany]);

  if (companies.length === 0) return null;

  const selectedCode = companyCode ?? defaultCode;

  return (
    <Select
      value={selectedCode}
      onValueChange={(val) => {
        const company = companies.find((c) => c.companyCode === val);
        if (company) setCompany(company.companyCode, company.name);
      }}
    >
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {companies.map((c) => (
          <SelectItem key={c.companyCode} value={c.companyCode}>
            {c.companyCode} — {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
