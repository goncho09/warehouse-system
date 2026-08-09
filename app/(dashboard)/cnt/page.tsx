import CNTView from '@/components/CNT/CNTView';
import { cnts } from '@/data/CNT';
import { products } from '@/data/products';

export default function CNTPage() {
  return <CNTView cnts={cnts} products={products} />;
}
