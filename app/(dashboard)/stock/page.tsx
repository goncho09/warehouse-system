import StockView from '@/components/stock/StockView';
import { stock } from '@/data/stock';
import { products } from '@/data/products';

export default function StockPage() {
  return <StockView products={products} stock={stock} />;
}
