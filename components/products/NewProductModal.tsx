'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

// import { createProduct } from '@/actions/products';

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NewProductModal({
  isOpen,
  onClose,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    productId: '',
    barCode: '',
    description: '',
    category: 'FOOD',
    unitsPerDisplay: '',
  });

  if (!isOpen) return null;

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      //   await createProduct({
      //     productId: formData.productId,
      //     barCode: formData.barCode,
      //     description: formData.description,
      //     category: formData.category as
      //       | 'FOOD'
      //       | 'NO_FOOD'
      //       | 'CONGELADO'
      //       | 'REFRIGERADO',
      //     unitsPerDisplay: Number(formData.unitsPerDisplay),
      //   });

      setFormData({
        productId: '',
        barCode: '',
        description: '',
        category: 'FOOD',
        unitsPerDisplay: '',
      });

      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo crear el producto.',
      );
    }
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
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--color-text)' }}
            >
              Nuevo producto
            </h2>

            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Ingresá la información del producto
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
            {/* Código producto */}
            <div>
              <label
                htmlFor="productId"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Código producto
              </label>

              <input
                id="productId"
                name="productId"
                type="text"
                required
                value={formData.productId}
                onChange={handleChange}
                placeholder="Ej: PRD-1006"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                }}
              />
            </div>

            {/* Código de barras */}
            <div>
              <label
                htmlFor="barCode"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Código de barras
              </label>

              <input
                id="barCode"
                name="barCode"
                type="text"
                required
                value={formData.barCode}
                onChange={handleChange}
                placeholder="Ej: 7731234567890"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                }}
              />
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Descripción
              </label>

              <input
                id="description"
                name="description"
                type="text"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Ej: Red Bull Energy Drink 250ml"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                }}
              />
            </div>

            {/* Categoría */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Categoría
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <option value="FOOD">Food</option>
                <option value="NO_FOOD">No Food</option>
                <option value="CONGELADO">Congelado</option>
                <option value="REFRIGERADO">Refrigerado</option>
              </select>
            </div>

            {/* Unidades por display */}
            <div>
              <label
                htmlFor="unitsPerDisplay"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Unidades por display
              </label>

              <input
                id="unitsPerDisplay"
                name="unitsPerDisplay"
                type="number"
                min="1"
                required
                value={formData.unitsPerDisplay}
                onChange={handleChange}
                placeholder="Ej: 24"
                className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                }}
              />
            </div>
          </div>

          {/* Footer */}
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
              style={{
                backgroundColor: 'var(--color-primary)',
              }}
            >
              Guardar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
