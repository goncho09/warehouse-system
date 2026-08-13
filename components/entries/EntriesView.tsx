'use client';

import { useState } from 'react';
import { PackagePlus } from 'lucide-react';

import NewEntryModal from './NewEntryModal';
import EntriesTable from './EntriesTable';
import { createCNT } from '@/app/actions/cnts';
import { createEntry } from '@/app/actions/entries';

import type { EntryFormData, Entry } from '@/types/Entry';
import type { Product } from '@/types/Product';
import type { CNT } from '@/types/CNT';
import { toast } from 'sonner';

type Props = {
  products: Product[];
  cnts: CNT[];
  entries: Entry[];
};

export default function EntriesView({ products, cnts, entries }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cntList, setCntList] = useState<CNT[]>(cnts);
  const [generatedCNT, setGeneratedCNT] = useState<CNT | null>(null);

  async function handleGenerateCNT() {
    try {
      const newCNT = await createCNT();

      if (!newCNT.locationCode || !newCNT.location) {
        throw new Error('El CNT se creó sin ubicación.');
      }

      const frontendCNT: CNT = {
        id: newCNT.id,
        code: newCNT.code,
        status: newCNT.status,
        locationCode: newCNT.locationCode,
        locationType: newCNT.location.type,
        items: [],
      };

      setGeneratedCNT(frontendCNT);

      setCntList((previous) => [...previous, frontendCNT]);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'No se pudo generar el CNT.',
      );
    }
  }

  async function handleCreateEntry(data: EntryFormData) {
    try {
      await createEntry({
        productId: data.productId,
        lot: data.lot,
        dueDate: data.dueDate,
        count: Number(data.count),
        cntCode: data.cntCode,
      });

      toast.success('Ingreso registrado', {
        description: 'La mercadería se registró correctamente.',
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo registrar el ingreso.',
      );

      throw error;
    }
  }

  return (
    <main className="p-6 md:p-8">
      <div className="flex items-center gap-3"></div>
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGenerateCNT}
            className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-(--color-surface-hover)"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            Generar CNT
          </button>

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
      </div>

      <EntriesTable entries={entries} products={products} />

      <NewEntryModal
        isOpen={isModalOpen}
        products={products}
        cnts={cntList}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateEntry}
      />

      {generatedCNT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            className="w-full max-w-md rounded-xl border p-6"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--color-success)' }}
            >
              CNT generado correctamente
            </p>

            <h2
              className="mt-2 text-2xl font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              {generatedCNT.code}
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <p>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Estado:
                </span>{' '}
                Activo
              </p>

              <p>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Ubicación:
                </span>{' '}
                {generatedCNT.locationCode}
              </p>

              <p>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Tipo:
                </span>{' '}
                En puerta
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-lg border px-4 py-2.5 text-sm font-medium"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                Imprimir etiqueta
              </button>

              <button
                type="button"
                onClick={() => setGeneratedCNT(null)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-white"
                style={{
                  backgroundColor: 'var(--color-primary)',
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
