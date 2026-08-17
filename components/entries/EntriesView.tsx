'use client';

import { useState } from 'react';
import { PackagePlus } from 'lucide-react';
import { toast } from 'sonner';

import PageHeader from '../layout/ui/PageHeader';
import Modal from '../layout/ui/Modal';

import NewEntryModal from './NewEntryModal';
import EntriesTable from './EntriesTable';

import { createCNT } from '@/app/actions/cnts';
import { createEntry } from '@/app/actions/entries';

import type { EntryFormData, Entry } from '@/types/Entry';
import type { Product } from '@/types/Product';
import type { CNT } from '@/types/CNT';

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
        movements: [],
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
      const product = products.find(
        (product) => product.productId === data.productId,
      );

      if (!product) {
        throw new Error('El producto no existe.');
      }

      const totalCount =
        Number(data.displays) * product.unitsPerDisplay +
        Number(data.looseUnits);

      await createEntry({
        productId: data.productId,
        lot: data.lot,
        dueDate: data.dueDate,
        count: totalCount,
        cntCode: data.cntCode,
      });

      toast.success('Ingreso registrado', {
        description: `${totalCount.toLocaleString('es-UY')} ${
          totalCount === 1 ? 'unidad registrada' : 'unidades registradas'
        }.`,
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
    <div className="flex h-full min-h-0 flex-col p-4 sm:p-6 md:p-8">
      <PageHeader
        eyebrow="Recepción"
        title="Ingreso de mercadería"
        actions={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleGenerateCNT}
              className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-(--color-surface-hover) sm:w-auto"
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
              className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
              style={{
                backgroundColor: 'var(--color-primary)',
              }}
            >
              <PackagePlus size={18} />
              Registrar ingreso
            </button>
          </div>
        }
      />

      <div className="min-h-0 flex-1">
        <EntriesTable entries={entries} products={products} />
      </div>

      <NewEntryModal
        isOpen={isModalOpen}
        products={products}
        cnts={cntList}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateEntry}
      />

      <Modal
        isOpen={generatedCNT !== null}
        onClose={() => setGeneratedCNT(null)}
        maxWidth="md"
        title="CNT generado correctamente"
        subtitle={generatedCNT?.code}
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium sm:w-auto"
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
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white sm:w-auto"
              style={{
                backgroundColor: 'var(--color-primary)',
              }}
            >
              Cerrar
            </button>
          </div>
        }
      >
        {generatedCNT && (
          <div className="space-y-4 p-4 sm:p-6">
            <div>
              <p
                className="text-xs"
                style={{
                  color: 'var(--color-text-muted)',
                }}
              >
                Estado
              </p>

              <p
                className="mt-1 text-sm font-medium"
                style={{
                  color: 'var(--color-success)',
                }}
              >
                Activo
              </p>
            </div>

            <div>
              <p
                className="text-xs"
                style={{
                  color: 'var(--color-text-muted)',
                }}
              >
                Ubicación
              </p>

              <p
                className="mt-1 text-sm font-medium"
                style={{
                  color: 'var(--color-text)',
                }}
              >
                {generatedCNT.locationCode}
              </p>
            </div>

            <div>
              <p
                className="text-xs"
                style={{
                  color: 'var(--color-text-muted)',
                }}
              >
                Tipo
              </p>

              <p
                className="mt-1 text-sm font-medium"
                style={{
                  color: 'var(--color-text)',
                }}
              >
                En puerta
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
