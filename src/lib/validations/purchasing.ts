import { z } from "zod";

export const vendorSchema = z.object({
  vendorNumber: z
    .string()
    .min(1, "Vendor number is required")
    .max(20, "Vendor number must be 20 characters or less"),
  name: z.string().min(1, "Name is required"),
  contactName: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  taxId: z.string().optional(),
  termsCode: z.string().optional(),
  currencyCode: z.string().min(1, "Currency is required"),
  status: z.string().min(1, "Status is required"),
});

export type VendorFormData = z.infer<typeof vendorSchema>;

export const apInvoiceSchema = z.object({
  vendorId: z.string().uuid("Vendor is required"),
  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  termsCode: z.string().optional(),
  currencyCode: z.string().min(1, "Currency is required"),
  glAccountId: z.string().uuid().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type ApInvoiceFormData = z.infer<typeof apInvoiceSchema>;

export const paymentSchema = z.object({
  vendorId: z.string().uuid("Vendor is required"),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  checkNumber: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  currencyCode: z.string().min(1, "Currency is required"),
  glAccountId: z.string().uuid().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

export const poHeaderSchema = z.object({
  poNumber: z.string().optional(),
  vendorId: z.string().uuid("Vendor is required"),
  orderDate: z.string().min(1, "Order date is required"),
  expectedDate: z.string().optional(),
  currencyCode: z.string().min(1, "Currency is required"),
  notes: z.string().optional(),
});

export type PoHeaderFormData = z.infer<typeof poHeaderSchema>;
