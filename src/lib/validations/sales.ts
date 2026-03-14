import { z } from "zod";

export const customerSchema = z.object({
  customerNumber: z
    .string()
    .min(1, "Customer number is required")
    .max(20, "Customer number must be 20 characters or less"),
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
  creditLimit: z.string().optional(),
  currencyCode: z.string().min(1, "Currency is required"),
  status: z.string().min(1, "Status is required"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export const arInvoiceSchema = z.object({
  customerId: z.string().uuid("Customer is required"),
  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  termsCode: z.string().optional(),
  currencyCode: z.string().min(1, "Currency is required"),
  glAccountId: z.string().uuid().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export type ArInvoiceFormData = z.infer<typeof arInvoiceSchema>;

export const cashReceiptSchema = z.object({
  customerId: z.string().uuid("Customer is required"),
  receiptDate: z.string().min(1, "Receipt date is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  referenceNumber: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  currencyCode: z.string().min(1, "Currency is required"),
  notes: z.string().optional(),
});

export type CashReceiptFormData = z.infer<typeof cashReceiptSchema>;

export const orderSchema = z.object({
  customerId: z.string().uuid("Customer is required"),
  orderNumber: z.string().optional(),
  orderDate: z.string().min(1, "Order date is required"),
  requiredDate: z.string().optional(),
  shipToName: z.string().optional(),
  shipToAddress: z.string().optional(),
  shipToCity: z.string().optional(),
  shipToState: z.string().optional(),
  shipToPostalCode: z.string().optional(),
  shipToCountry: z.string().optional(),
  currencyCode: z.string().min(1, "Currency is required"),
  notes: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;
