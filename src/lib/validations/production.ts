import { z } from "zod";

export const recipeSchema = z.object({
  recipeCode: z
    .string()
    .min(1, "Recipe code is required")
    .max(20, "Recipe code must be 20 characters or less"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  outputProductId: z.string().uuid("Output product is required"),
  outputQuantity: z.string().min(1, "Output quantity is required"),
  outputUom: z.string().min(1, "Output UoM is required"),
  status: z.string().min(1, "Status is required"),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;

export const jobSchema = z.object({
  jobNumber: z
    .string()
    .min(1, "Job number is required")
    .max(20, "Job number must be 20 characters or less"),
  recipeId: z.string().uuid("Recipe is required"),
  plannedQuantity: z.string().min(1, "Planned quantity is required"),
  plannedStart: z.string().optional(),
  plannedEnd: z.string().optional(),
  warehouseId: z.string().uuid().optional().or(z.literal("")),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
});

export type JobFormData = z.infer<typeof jobSchema>;
