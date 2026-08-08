import ProductsView from '@/components/products/ProductsView';
import { products } from '@/data/products';

export default function ProductsPage() {
  return <ProductsView products={products} />;
}
