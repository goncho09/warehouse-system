'use client';

import { X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="flex items-start justify-between gap-4 border-b px-4 py-4 sm:px-6"
          style={{
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="min-w-0">
            <h2
              className="text-lg font-semibold"
              style={{
                color: 'var(--color-text)',
              }}
            >
              Contenido del CNT
            </h2>

            <p
              className="mt-1 text-sm"
              style={{
                color: 'var(--color-text-secondary)',
              }}
            >
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
              {totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 rounded-lg p-2 transition-colors hover:bg-(--color-surface-hover)"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
          <CNTItemsTable items={cnt.items} products={products} />
        </div>
      </div>
    </div>
  );
}
