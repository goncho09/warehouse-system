import EntriesView from '@/components/entries/EntriesView';
import { products } from '@/data/products';

export default function EntriesPage() {
  return <EntriesView products={products} />;
}
