import { z } from "zod";

export const glAccountSchema = z.object({
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .max(20, "Account number must be 20 characters or less"),
  name: z.string().min(1, "Name is required"),
  accountType: z.string().min(1, "Account type is required"),
  isHeader: z.boolean(),
  isPosting: z.boolean(),
  parentId: z.string().uuid().optional().or(z.literal("")),
  normalBalance: z.string().min(1, "Normal balance is required"),
  status: z.string().min(1, "Status is required"),
});

export type GlAccountFormData = z.infer<typeof glAccountSchema>;

export const journalHeaderSchema = z.object({
  journalDate: z.string().min(1, "Journal date is required"),
  periodId: z.string().uuid().optional().or(z.literal("")),
  description: z.string().optional(),
  source: z.string().optional(),
});

export type JournalHeaderFormData = z.infer<typeof journalHeaderSchema>;

export const journalLineSchema = z.object({
  accountId: z.string().uuid("Account is required"),
  description: z.string().optional(),
  debit: z.string().min(1, "Debit is required"),
  credit: z.string().min(1, "Credit is required"),
});

export type JournalLineFormData = z.infer<typeof journalLineSchema>;
