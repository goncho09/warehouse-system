'use client';

import { useState } from 'react';

import type { Product } from '@/types/Product';
import { EntryFormData } from '@/types/Entry';
import { CNT } from '@/types/CNT';

import { X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  products: Product[];
  cnts: CNT[];
  onClose: () => void;
  onCreate: (data: EntryFormData) => void;
};

const initialFormData: EntryFormData = {
  productId: '',
  barCode: '',
  lot: '',
  dueDate: '',
  count: '',
  cntId: '',
};

export default function EntryModal({
  isOpen,
  products,
  cnts,
  onClose,
  onCreate,
}: Props) {
  const [formData, setFormData] = useState<EntryFormData>(initialFormData);
  const [barCode, setBarCode] = useState('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const minimumDueDate = tomorrow.toISOString().split('T')[0];

  const selectedProduct = products.find(
    (product) => product.barCode === barCode.trim(),
  );

  const selectedCNT = cnts.find(
    (cnt) => cnt.id.toLowerCase() === formData.cntId.trim().toLowerCase(),
  );

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

  function handleCountChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    if (value === '') {
      setFormData((previous) => ({
        ...previous,
        count: '',
      }));
      return;
    }

    const count = Number(value);

    if (!Number.isInteger(count) || count < 1) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      count: value,
    }));
  }

  function handleBarcodeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setBarCode(value);

    const product = products.find(
      (product) => product.barCode === value.trim(),
    );

    setFormData((previous) => ({
      ...previous,
      barCode: value,
      productId: product?.id ?? '',
    }));
  }

  function getDaysUntilDueDate(dueDate: string) {
    if (!dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(`${dueDate}T00:00:00`);

    const difference = due.getTime() - today.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }

  const daysUntilDueDate = getDaysUntilDueDate(formData.dueDate);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProduct) {
      alert(
        'No se ha seleccionado un producto válido. Por favor, escanee o ingrese un código de barras válido.',
      );
      return;
    }

    const count = Number(formData.count);

    if (!Number.isInteger(count) || count < 1) {
      alert('La cantidad debe ser mayor a 0.');
      return;
    }

    if (daysUntilDueDate === null || daysUntilDueDate <= 0) {
      alert('La fecha de vencimiento debe ser posterior a hoy.');
      return;
    }

    if (!selectedCNT) {
      alert('El CNT ingresado no existe.');
      return;
    }

    if (selectedCNT.status !== 'ACTIVO') {
      alert('El CNT está finalizado y no puede recibir mercadería.');
      return;
    }

    if (selectedCNT.locationType !== 'EN_PUERTA') {
      alert('El CNT no está disponible para recepción.');
      return;
    }

    const existingProduct = selectedCNT.items.find(
      (item) => item.productId === formData.productId,
    );

    if (
      existingProduct &&
      existingProduct.lot.toLowerCase() !== formData.lot.trim().toLowerCase()
    ) {
      alert(
        `Este producto ya existe en el CNT con el lote ${existingProduct.lot}.`,
      );
      return;
    }

    onCreate(formData);
    setFormData(initialFormData);
    setBarCode('');
    onClose();
  }

  function handleClose() {
    setFormData(initialFormData);
    setBarCode('');
    onClose();
  }

  const inputClass =
    'w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)]';

  const inputStyle = {
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    colorScheme: 'dark light',
  };

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
            onClick={handleClose}
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
                htmlFor="barcode"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                Código de barras
              </label>

              <input
                id="barcode"
                type="text"
                value={barCode}
                onChange={handleBarcodeChange}
                placeholder="Escanear o ingresar código..."
                autoFocus
                className={inputClass}
                style={inputStyle}
              />

              {selectedProduct && (
                <div
                  className="md:col-span-2 rounded-lg border p-4"
                  style={{
                    borderColor: 'var(--color-primary-light)',
                    backgroundColor: 'var(--color-primary-hover)',
                  }}
                >
                  <p
                    className="font-medium"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {selectedProduct.description}
                  </p>

                  <div
                    className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <span>Código: {selectedProduct.id}</span>

                    <span>Display: {selectedProduct.unitsPerDisplay}</span>

                    <span>Categoría: {selectedProduct.category}</span>
                  </div>
                </div>
              )}

              {barCode && !selectedProduct && (
                <p
                  className="md:col-span-2 text-sm"
                  style={{ color: 'var(--color-danger)' }}
                >
                  No se encontró ningún producto con ese código de barras.
                </p>
              )}
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
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
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
                className={`${inputClass} scheme-light dark:scheme-dark`}
                style={inputStyle}
              />

              {daysUntilDueDate !== null && (
                <p
                  className="mt-2 text-xs"
                  style={{
                    color:
                      daysUntilDueDate > 0
                        ? 'var(--color-text-secondary)'
                        : 'var(--color-danger)',
                  }}
                >
                  {daysUntilDueDate > 0
                    ? `${daysUntilDueDate} días hasta el vencimiento`
                    : 'La fecha de vencimiento no es válida'}
                </p>
              )}
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
                step="1"
                required
                value={formData.count}
                onChange={handleCountChange}
                className={inputClass}
                style={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="cntId"
                className="mb-2 block text-sm font-medium"
                style={{ color: 'var(--color-text)' }}
              >
                CNT
              </label>

              <input
                id="cntId"
                name="cntId"
                required
                value={formData.cntId}
                onChange={handleChange}
                placeholder="Escanear o ingresar CNT..."
                className={inputClass}
                style={inputStyle}
              />

              {formData.cntId && selectedCNT && (
                <p
                  className="mt-2 text-xs"
                  style={{
                    color:
                      selectedCNT.status === 'ACTIVO'
                        ? 'var(--color-success)'
                        : 'var(--color-danger)',
                  }}
                >
                  {selectedCNT.status === 'ACTIVO'
                    ? `CNT válido · ${selectedCNT.locationCode}`
                    : 'Este CNT está finalizado'}
                </p>
              )}

              {formData.cntId && !selectedCNT && (
                <p
                  className="mt-2 text-xs"
                  style={{ color: 'var(--color-danger)' }}
                >
                  No existe ningún CNT con ese código.
                </p>
              )}
            </div>

            <div
              className="rounded-lg border px-4 py-3 md:col-span-2"
              style={{
                borderColor: 'var(--color-primary)',
                backgroundColor: 'var(--color-primary-light)',
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
                El CNT deberá ubicarse posteriormente para quedar disponible.
              </p>
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
