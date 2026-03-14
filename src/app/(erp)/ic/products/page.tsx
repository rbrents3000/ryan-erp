import { listProducts } from "./actions";
import { ProductList } from "./product-list";

export default async function ProductsPage() {
  const data = await listProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-sm text-muted-foreground">
          Manage product catalog and item master data.
        </p>
      </div>
      <ProductList data={data} />
    </div>
  );
}
