'use client';

import { useState } from 'react';
import { PackagePlus } from 'lucide-react';

import NewEntryModal from './NewEntryModal';
import type { EntryFormData } from '@/types/Entry';

import type { Product } from '@/types/Product';
import type { Entry } from '@/types/Entry';

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
      count: parseInt(data.count, 10),
      PYAID: data.PYAID,
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
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <PackagePlus size={18} />
          Registrar ingreso
        </button>
      </div>

      <div
        className="rounded-xl border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {entries.length === 0 ? (
          <div
            className="p-10 text-center text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Todavía no hay ingresos registrados.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr
                className="border-b text-left text-xs uppercase"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <th className="px-5 py-4">Producto</th>
                <th className="px-5 py-4">Lote</th>
                <th className="px-5 py-4">Vencimiento</th>
                <th className="px-5 py-4">Cantidad</th>
                <th className="px-5 py-4">PYA</th>
                <th className="px-5 py-4">Ubicación</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry) => {
                const product = products.find(
                  (product) => product.id === entry.productId,
                );

                return (
                  <tr
                    key={entry.id}
                    className="border-b last:border-0"
                    style={{
                      borderColor: 'var(--color-border-light)',
                    }}
                  >
                    <td className="px-5 py-4 text-sm font-medium">
                      {product?.description}
                    </td>

                    <td className="px-5 py-4 text-sm">{entry.lot}</td>

                    <td className="px-5 py-4 text-sm">{entry.dueDate}</td>

                    <td className="px-5 py-4 text-sm">{entry.count}</td>

                    <td className="px-5 py-4 text-sm">{entry.PYAID}</td>

                    <td className="px-5 py-4 text-sm">{entry.entryDate}</td>

                    <td className="px-5 py-4">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--color-warning-light)',
                          color: 'var(--color-warning)',
                        }}
                      >
                        En puerta
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <NewEntryModal
        isOpen={isModalOpen}
        products={products}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateEntry}
      />
    </main>
  );
}
