import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";
import { getLatestProducts } from "@/lib/actions/product.actions";

export default async function Homepage() {
  const lastProducts = await getLatestProducts()
  return (
    <>
    <div>
      <ProductList data={lastProducts} title="محصولات جدید" limit={4}/>
    </div>
    </>
  );
}
