import { z } from "zod";

export const assetSchema = z.object({
  assetNumber: z
    .string()
    .min(1, "Asset number is required")
    .max(20, "Asset number must be 20 characters or less"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  acquisitionDate: z.string().min(1, "Acquisition date is required"),
  acquisitionCost: z.string().min(1, "Acquisition cost is required"),
  salvageValue: z.string().optional(),
  usefulLifeMonths: z.string().min(1, "Useful life is required"),
  depreciationMethod: z.string().min(1, "Depreciation method is required"),
  glAccountId: z.string().uuid().optional().or(z.literal("")),
  depreciationAccountId: z.string().uuid().optional().or(z.literal("")),
  status: z.string().min(1, "Status is required"),
});

export type AssetFormData = z.infer<typeof assetSchema>;
