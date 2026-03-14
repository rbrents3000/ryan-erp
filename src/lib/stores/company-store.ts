"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompanyState {
  companyCode: string | null;
  companyName: string | null;
  setCompany: (code: string, name: string) => void;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      companyCode: null,
      companyName: null,
      setCompany: (code, name) => set({ companyCode: code, companyName: name }),
    }),
    { name: "ryan-erp-company" }
  )
);
