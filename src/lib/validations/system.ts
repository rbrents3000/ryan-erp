import { z } from "zod";

export const companySchema = z.object({
  companyCode: z
    .string()
    .min(1, "Company code is required")
    .max(10, "Company code must be 10 characters or less"),
  name: z.string().min(1, "Name is required"),
  baseCurrency: z.string().min(1, "Currency is required"),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  taxId: z.string().optional(),
});

export type CompanyFormData = z.infer<typeof companySchema>;

export const currencySchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(3, "Code must be 3 characters"),
  name: z.string().min(1, "Name is required"),
  symbol: z.string().min(1, "Symbol is required"),
  decimalPlaces: z.number().int().min(0).max(6),
});

export type CurrencyFormData = z.infer<typeof currencySchema>;

export const uomSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(10, "Code must be 10 characters or less"),
  name: z.string().min(1, "Name is required"),
  uomType: z.string().min(1, "Type is required"),
});

export type UomFormData = z.infer<typeof uomSchema>;

export const parameterSchema = z.object({
  companyCode: z.string().optional(),
  key: z.string().min(1, "Key is required"),
  value: z.string().optional(),
});

export type ParameterFormData = z.infer<typeof parameterSchema>;

export const periodSchema = z.object({
  companyCode: z.string().min(1, "Company is required"),
  fiscalYear: z.number().int().min(2000).max(2100),
  periodNum: z.number().int().min(1).max(13),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.string().min(1, "Status is required"),
});

export type PeriodFormData = z.infer<typeof periodSchema>;
