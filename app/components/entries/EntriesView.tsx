'use client';

import { useState } from 'react';
import { PackagePlus } from 'lucide-react';

import NewEntryModal from './NewEntryModal';
import EntriesTable from './EntriesTable';

import type { EntryFormData, Entry } from '@/types/Entry';
import type { Product } from '@/types/Product';

type Props = {
  products: Product[];
};

export default function EntriesView({ products }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);

  function handleCreateEntry(data: EntryFormData) {
    const newEntry: Entry = {
      id: Date.now(),
      productId: data.productId,
      lot: data.lot,
      dueDate: data.dueDate,
      count: Number(data.count),
      cntId: data.cntId,
      entryDate: new Date().toISOString(),
    };

    setEntries((previous) => [newEntry, ...previous]);
  }

  return (
    <main className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p
            className="mb-1 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Recepción
          </p>

          <h1
            className="text-2xl font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            Ingreso de mercadería
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          style={{
            backgroundColor: 'var(--color-primary)',
          }}
        >
          <PackagePlus size={18} />
          Registrar ingreso
        </button>
      </div>

      <EntriesTable entries={entries} products={products} />

      <NewEntryModal
        isOpen={isModalOpen}
        products={products}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateEntry}
      />
    </main>
  );
}
