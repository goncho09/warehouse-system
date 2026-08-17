'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import Modal from '../layout/ui/Modal';

import { createProduct } from '@/app/actions/products';

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const initialFormData = {
  productId: '',
  barCode: '',
  description: '',
  category: 'FOOD',
  unitsPerDisplay: '',
};

export default function NewProductModal({
  isOpen,
  onClose,
}: ProductModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) {
    return null;
  }

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

    const unitsPerDisplay = Number(formData.unitsPerDisplay);

    try {
      setIsSaving(true);

      await createProduct({
        productId: formData.productId,
        barCode: formData.barCode,
        description: formData.description,
        category: formData.category as
          | 'FOOD'
          | 'NO_FOOD'
          | 'CONGELADO'
          | 'REFRIGERADO',
        unitsPerDisplay,
      });

      toast.success('Producto creado', {
        description: `${formData.description} se guardó correctamente.`,
      });

      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo crear el producto.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose() {
    if (isSaving) {
      return;
    }

    setFormData(initialFormData);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="2xl"
      title="Nuevo producto"
      subtitle="Ingresá la información del producto"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="new-product-form"
            disabled={isSaving}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            style={{
              backgroundColor: 'var(--color-primary)',
            }}
          >
            {isSaving ? 'Guardando...' : 'Guardar producto'}
          </button>
        </div>
      }
    >
      <form
        id="new-product-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 p-4 sm:gap-5 sm:p-6 md:grid-cols-2"
      >
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
            disabled={isSaving}
            value={formData.productId}
            onChange={handleChange}
            placeholder="Ej: PRD-1006"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
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
            disabled={isSaving}
            value={formData.barCode}
            onChange={handleChange}
            placeholder="Ej: 7731234567890"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
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
            disabled={isSaving}
            value={formData.description}
            onChange={handleChange}
            placeholder="Ej: Red Bull Energy Drink 250ml"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
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
            disabled={isSaving}
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
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
            disabled={isSaving}
            value={formData.unitsPerDisplay}
            onChange={handleChange}
            placeholder="Ej: 24"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          />
        </div>
      </form>
    </Modal>
  );
}
