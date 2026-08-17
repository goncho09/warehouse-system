'use client';

import Modal from '../layout/ui/Modal';
import CNTItemsTable from './CNTItemsTable';

import type { CNT } from '@/types/CNT';
import type { Product } from '@/types/Product';

type Props = {
  isOpen: boolean;
  cnt: CNT | null;
  products: Product[];
  onClose: () => void;
};

export default function CNTContentModal({
  isOpen,
  cnt,
  products,
  onClose,
}: Props) {
  if (!isOpen || !cnt) {
    return null;
  }

  const totalUnits = cnt.items.reduce((total, item) => total + item.count, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="5xl"
      title="Contenido del CNT"
      subtitle={
        <div>
          <p>
            {cnt.code} · {cnt.locationCode}
          </p>

          <p
            className="mt-1 text-xs"
            style={{
              color: 'var(--color-text-muted)',
            }}
          >
            {cnt.items.length}{' '}
            {cnt.items.length === 1 ? 'producto' : 'productos'}
            {' · '}
            {totalUnits.toLocaleString('es-UY')}{' '}
            {totalUnits === 1 ? 'unidad' : 'unidades'}
          </p>
        </div>
      }
    >
      <div className="min-h-0 p-4 sm:p-6">
        <CNTItemsTable items={cnt.items} products={products} />
      </div>
    </Modal>
  );
}
