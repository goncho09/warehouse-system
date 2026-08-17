'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import PageHeader from '../layout/ui/PageHeader';
import ProductsTable from './ProductsTable';
import NewProductModal from './NewProductModal';

import type { Product } from '@/types/Product';

type Props = {
  products: Product[];
};

export default function ProductsView({ products }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-6 md:p-8">
      <PageHeader
        eyebrow="Gestión de inventario"
        title="Productos"
        actions={
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
            style={{
              backgroundColor: 'var(--color-primary)',
            }}
          >
            <Plus size={18} />
            Nuevo producto
          </button>
        }
      />

      <div className="min-h-0 flex-1">
        <ProductsTable products={products} />
      </div>

      <NewProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
