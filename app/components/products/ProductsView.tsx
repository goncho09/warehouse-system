'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import ProductsTable from './ProductsTable';
import NewProductModal from './NewProductModal';
import type { Product } from '@/types/Product';

type Props = {
  products: Product[];
};

export default function ProductsView({ products }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p
            className="mb-1 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Gestión de inventario
          </p>

          <h1
            className="text-2xl font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            Productos
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5
                     text-sm font-medium text-white shadow-sm
                     transition hover:-translate-y-0.5 hover:shadow-md"
          style={{
            backgroundColor: 'var(--color-primary)',
          }}
        >
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>

      <ProductsTable products={products} />

      <NewProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
