import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Wallet,
  ShoppingCart,
  Package,
  ClipboardList,
  Factory,
  CalendarClock,
  Building2,
  FileBarChart,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface ModuleSubItem {
  name: string
  href: string
}

export interface Module {
  code: string
  name: string
  icon: LucideIcon
  href: string
  subItems?: ModuleSubItem[]
}

export const modules: Module[] = [
  {
    code: "DASH",
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    code: "GL",
    name: "General Ledger",
    icon: BookOpen,
    href: "/gl",
    subItems: [
      { name: "Accounts", href: "/gl/accounts" },
      { name: "Journals", href: "/gl/journals" },
      { name: "Trial Balance", href: "/gl/trial-balance" },
      { name: "Periods", href: "/gl/periods" },
    ],
  },
  {
    code: "AP",
    name: "Accounts Payable",
    icon: CreditCard,
    href: "/ap",
    subItems: [
      { name: "Vendors", href: "/ap/vendors" },
      { name: "Invoices", href: "/ap/invoices" },
      { name: "Payments", href: "/ap/payments" },
    ],
  },
  {
    code: "AR",
    name: "Accounts Receivable",
    icon: Wallet,
    href: "/ar",
    subItems: [
      { name: "Customers", href: "/ar/customers" },
      { name: "Invoices", href: "/ar/invoices" },
      { name: "Receipts", href: "/ar/receipts" },
      { name: "Aging", href: "/ar/aging" },
    ],
  },
  {
    code: "SOP",
    name: "Sales Orders",
    icon: ShoppingCart,
    href: "/sop",
    subItems: [
      { name: "Orders", href: "/sop/orders" },
      { name: "Despatch", href: "/sop/despatch" },
      { name: "Invoices", href: "/sop/invoices" },
      { name: "Shipping", href: "/sop/shipping" },
    ],
  },
  {
    code: "IC",
    name: "Inventory",
    icon: Package,
    href: "/ic",
    subItems: [
      { name: "Products", href: "/ic/products" },
      { name: "Stock", href: "/ic/stock" },
      { name: "Movements", href: "/ic/movements" },
      { name: "Warehouses", href: "/ic/warehouses" },
      { name: "Lots", href: "/ic/lots" },
    ],
  },
  {
    code: "POP",
    name: "Purchase Orders",
    icon: ClipboardList,
    href: "/pop",
    subItems: [
      { name: "Orders", href: "/pop/orders" },
      { name: "Receiving", href: "/pop/receiving" },
    ],
  },
  {
    code: "PM",
    name: "Production",
    icon: Factory,
    href: "/pm",
    subItems: [
      { name: "Jobs", href: "/pm/jobs" },
      { name: "Recipes", href: "/pm/recipes" },
      { name: "Time Cards", href: "/pm/time-cards" },
    ],
  },
  {
    code: "PP",
    name: "Planning",
    icon: CalendarClock,
    href: "/pp",
    subItems: [
      { name: "MRP", href: "/pp/mrp" },
      { name: "Schedule", href: "/pp/schedule" },
      { name: "Capacity", href: "/pp/capacity" },
    ],
  },
  {
    code: "FA",
    name: "Fixed Assets",
    icon: Building2,
    href: "/fa",
    subItems: [
      { name: "Assets", href: "/fa/assets" },
      { name: "Depreciation", href: "/fa/depreciation" },
    ],
  },
  {
    code: "RPT",
    name: "Reports",
    icon: FileBarChart,
    href: "/reports",
  },
  {
    code: "ADMIN",
    name: "Admin",
    icon: Settings,
    href: "/admin",
    subItems: [
      { name: "Companies", href: "/admin/companies" },
      { name: "Users", href: "/admin/users" },
      { name: "Parameters", href: "/admin/parameters" },
      { name: "Currencies", href: "/admin/currencies" },
      { name: "Units of Measure", href: "/admin/uom" },
    ],
  },
]
