'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NewProductModal({
  isOpen,
  onClose,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    codigoProducto: '',
    codigoBarras: '',
    descripcion: '',
    categoria: 'FOOD',
    unidadesPorDisplay: '',
    lote: '',
    vencimiento: '',
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
                htmlFor="codigoProducto"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Código producto
              </label>

              <input
                id="codigoProducto"
                name="codigoProducto"
                type="text"
                required
                value={formData.codigoProducto}
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
                htmlFor="codigoBarras"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Código de barras
              </label>

              <input
                id="codigoBarras"
                name="codigoBarras"
                type="text"
                required
                value={formData.codigoBarras}
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
                htmlFor="descripcion"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Descripción
              </label>

              <input
                id="descripcion"
                name="descripcion"
                type="text"
                required
                value={formData.descripcion}
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
                htmlFor="categoria"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Categoría
              </label>

              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
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
                htmlFor="unidadesPorDisplay"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Unidades por display
              </label>

              <input
                id="unidadesPorDisplay"
                name="unidadesPorDisplay"
                type="number"
                min="1"
                required
                value={formData.unidadesPorDisplay}
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
