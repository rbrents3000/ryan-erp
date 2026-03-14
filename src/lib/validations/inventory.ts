import { z } from "zod";

export const productSchema = z.object({
  partNumber: z
    .string()
    .min(1, "Part number is required")
    .max(30, "Part number must be 30 characters or less"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  uomCode: z.string().min(1, "Unit of measure is required"),
  productType: z.string().min(1, "Product type is required"),
  productGroup: z.string().optional(),
  standardCost: z.string().optional(),
  listPrice: z.string().optional(),
  weight: z.string().optional(),
  weightUom: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const warehouseSchema = z.object({
  warehouseCode: z
    .string()
    .min(1, "Warehouse code is required")
    .max(10, "Warehouse code must be 10 characters or less"),
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  isDefault: z.boolean(),
  status: z.string().min(1, "Status is required"),
});

export type WarehouseFormData = z.infer<typeof warehouseSchema>;
