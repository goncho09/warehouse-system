'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

import type { Product } from '@/types/Product';
import { EntryFormData } from '@/types/Entry';

type Props = {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onCreate: (data: EntryFormData) => void;
};

const initialFormData: EntryFormData = {
  productId: 0,
  lot: '',
  dueDate: '',
  count: '',
  PYAID: '',
};

export default function EntryModal({
  isOpen,
  products,
  onClose,
  onCreate,
}: Props) {
  const [formData, setFormData] = useState<EntryFormData>(initialFormData);

  if (!isOpen) return null;

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onCreate(formData);
    setFormData(initialFormData);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-2xl rounded-xl border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              Registrar ingreso
            </h2>

            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              La mercadería ingresará en la ubicación En puerta
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="productoId"
                className="mb-2 block text-sm font-medium"
              >
                Producto
              </label>

              <select
                id="productId"
                name="productId"
                required
                value={formData.productId}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2.5 text-sm"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <option value="">Seleccionar producto</option>

                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.productId} - {product.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="lote" className="mb-2 block text-sm font-medium">
                Lote
              </label>

              <input
                id="lot"
                name="lot"
                required
                value={formData.lot}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2.5 text-sm"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="mb-2 block text-sm font-medium"
              >
                Vencimiento
              </label>

              <input
                id="dueDate"
                name="dueDate"
                type="date"
                required
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2.5 text-sm"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>

            <div>
              <label htmlFor="count" className="mb-2 block text-sm font-medium">
                Cantidad
              </label>

              <input
                id="count"
                name="count"
                type="number"
                min="1"
                required
                value={formData.count}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2.5 text-sm"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>

            <div>
              <label htmlFor="PYAID" className="mb-2 block text-sm font-medium">
                PYA
              </label>

              <input
                id="PYAID"
                name="PYAID"
                required
                value={formData.PYAID}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2.5 text-sm"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>

            <div className="md:col-span-2">
              <div
                className="rounded-lg border px-4 py-3"
                style={{
                  borderColor: 'var(--color-primary-light)',
                  backgroundColor: 'var(--color-primary-hover)',
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-primary-dark)' }}
                >
                  Ubicación inicial: En puerta
                </p>

                <p
                  className="mt-1 text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  El PYA deberá ubicarse posteriormente para quedar disponible.
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex justify-end gap-3 border-t px-6 py-4"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2.5 text-sm font-medium"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Registrar ingreso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
