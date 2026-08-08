import InventoryView from '@/components/inventory/InventoryView';
import { inventory } from '@/data/inventory';
import { products } from '@/data/products';

export default function InventoryPage() {
  return <InventoryView products={products} inventory={inventory} />;
}
