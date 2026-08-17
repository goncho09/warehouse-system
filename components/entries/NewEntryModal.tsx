'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import Modal from '../layout/ui/Modal';

import type { Product } from '@/types/Product';
import type { EntryFormData } from '@/types/Entry';
import type { CNT } from '@/types/CNT';

import { calculateTotalUnits, isValidEntryQuantities } from '@/lib/entry';

type Props = {
  isOpen: boolean;
  products: Product[];
  cnts: CNT[];
  onClose: () => void;
  onCreate: (data: EntryFormData) => Promise<void>;
};

const initialFormData: EntryFormData = {
  productId: '',
  barCode: '',
  lot: '',
  dueDate: '',
  displays: '0',
  looseUnits: '0',
  cntCode: '',
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
  const [isSaving, setIsSaving] = useState(false);

  const selectedProduct = products.find(
    (product) => product.barCode === barCode.trim(),
  );

  const selectedCNT = cnts.find(
    (cnt) => cnt.code.toLowerCase() === formData.cntCode.trim().toLowerCase(),
  );

  if (!isOpen) {
    return null;
  }

  const displays = Number(formData.displays || 0);
  const looseUnits = Number(formData.looseUnits || 0);

  const unitsPerDisplay = selectedProduct?.unitsPerDisplay ?? 0;

  const invalidLooseUnits =
    selectedProduct && looseUnits >= selectedProduct.unitsPerDisplay;

  const totalCount = calculateTotalUnits(displays, looseUnits, unitsPerDisplay);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleQuantityChange(
    field: 'displays' | 'looseUnits',
    value: string,
  ) {
    if (value === '') {
      setFormData((previous) => ({
        ...previous,
        [field]: '',
      }));

      return;
    }

    const number = Number(value);

    if (!Number.isInteger(number) || number < 0) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [field]: value,
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
      productId: product?.productId ?? '',
    }));
  }

  function getDaysUntilDueDate(dueDate: string) {
    if (!dueDate) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(`${dueDate}T00:00:00`);

    const difference = due.getTime() - today.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }

  const daysUntilDueDate = getDaysUntilDueDate(formData.dueDate);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProduct) {
      return;
    }

    if (
      !isValidEntryQuantities(
        displays,
        looseUnits,
        selectedProduct.unitsPerDisplay,
      )
    ) {
      if (looseUnits >= selectedProduct.unitsPerDisplay) {
        toast.error('Unidades sueltas inválidas', {
          description: `Las unidades sueltas deben ser menores a ${selectedProduct.unitsPerDisplay}.`,
        });

        return;
      }

      toast.error('Cantidad inválida', {
        description: 'Ingresá al menos un display o una unidad.',
      });

      return;
    }

    if (daysUntilDueDate === null || daysUntilDueDate <= 0) {
      return;
    }

    if (!selectedCNT) {
      return;
    }

    if (selectedCNT.status !== 'ACTIVO') {
      return;
    }

    if (selectedCNT.locationType !== 'EN_PUERTA') {
      return;
    }

    const existingProduct = selectedCNT.items.find(
      (item) => item.productId === formData.productId,
    );

    if (
      existingProduct &&
      existingProduct.lot.trim().toLowerCase() !==
        formData.lot.trim().toLowerCase()
    ) {
      toast.error('Lote incompatible', {
        description: `El producto ya existe en el CNT con el lote "${existingProduct.lot}".`,
      });

      return;
    }

    if (existingProduct && existingProduct.dueDate !== formData.dueDate) {
      toast.error('Vencimiento incompatible', {
        description: `El producto ya existe en el CNT con vencimiento ${existingProduct.dueDate}.`,
      });

      return;
    }

    try {
      setIsSaving(true);

      await onCreate(formData);

      setFormData(initialFormData);
      setBarCode('');
      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : 'No se pudo registrar el ingreso.',
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
    setBarCode('');
    onClose();
  }

  const inputClass =
    'w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60';

  const inputStyle = {
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
    colorScheme: 'dark light',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="2xl"
      title="Registrar ingreso"
      subtitle="La mercadería ingresará en la ubicación En puerta"
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
            form="new-entry-form"
            disabled={isSaving}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            style={{
              backgroundColor: 'var(--color-primary)',
            }}
          >
            {isSaving ? 'Registrando...' : 'Registrar ingreso'}
          </button>
        </div>
      }
    >
      <form
        id="new-entry-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 p-4 sm:gap-5 sm:p-6 md:grid-cols-2"
      >
        {/* Código de barras */}
        <div className="md:col-span-2">
          <label
            htmlFor="barcode"
            className="mb-2 block text-sm font-medium"
            style={{
              color: 'var(--color-text)',
            }}
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
            disabled={isSaving}
            className={inputClass}
            style={inputStyle}
          />

          {selectedProduct && (
            <div
              className="mt-3 rounded-lg border p-4"
              style={{
                borderColor: 'var(--color-primary-light)',
                backgroundColor: 'var(--color-primary-hover)',
              }}
            >
              <p
                className="font-medium"
                style={{
                  color: 'var(--color-text)',
                }}
              >
                {selectedProduct.description}
              </p>

              <div
                className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
              >
                <span>Código: {selectedProduct.productId}</span>

                <span>Display: {selectedProduct.unitsPerDisplay}</span>

                <span>Categoría: {selectedProduct.category}</span>
              </div>
            </div>
          )}

          {barCode && !selectedProduct && (
            <p
              className="mt-2 text-sm"
              style={{
                color: 'var(--color-danger)',
              }}
            >
              No se encontró ningún producto con ese código de barras.
            </p>
          )}
        </div>

        {/* Lote */}
        <div>
          <label
            htmlFor="lot"
            className="mb-2 block text-sm font-medium"
            style={{
              color: 'var(--color-text)',
            }}
          >
            Lote
          </label>

          <input
            id="lot"
            name="lot"
            required
            disabled={isSaving}
            value={formData.lot}
            onChange={handleChange}
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Vencimiento */}
        <div>
          <label
            htmlFor="dueDate"
            className="mb-2 block text-sm font-medium"
            style={{
              color: 'var(--color-text)',
            }}
          >
            Vencimiento
          </label>

          <input
            id="dueDate"
            name="dueDate"
            type="date"
            required
            disabled={isSaving}
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

        {/* Displays */}
        <div>
          <label
            htmlFor="displays"
            className="mb-2 block text-sm font-medium"
            style={{
              color: 'var(--color-text)',
            }}
          >
            Displays
          </label>

          <input
            id="displays"
            name="displays"
            type="number"
            min="0"
            step="1"
            required
            disabled={isSaving}
            value={formData.displays}
            onChange={(event) =>
              handleQuantityChange('displays', event.target.value)
            }
            className={inputClass}
            style={inputStyle}
          />

          {selectedProduct && (
            <p
              className="mt-2 text-xs"
              style={{
                color: 'var(--color-text-secondary)',
              }}
            >
              {selectedProduct.unitsPerDisplay} unidades por display
            </p>
          )}
        </div>

        {/* Unidades sueltas */}
        <div>
          <label
            htmlFor="looseUnits"
            className="mb-2 block text-sm font-medium"
            style={{
              color: 'var(--color-text)',
            }}
          >
            Unidades sueltas
          </label>

          <input
            id="looseUnits"
            name="looseUnits"
            type="number"
            min="0"
            step="1"
            required
            disabled={isSaving}
            value={formData.looseUnits}
            onChange={(event) =>
              handleQuantityChange('looseUnits', event.target.value)
            }
            className={inputClass}
            style={inputStyle}
          />

          {invalidLooseUnits && selectedProduct && (
            <p
              className="mt-2 text-xs"
              style={{
                color: 'var(--color-danger)',
              }}
            >
              Debe ser menor a {selectedProduct.unitsPerDisplay}.
            </p>
          )}
        </div>

        {/* Total */}
        {selectedProduct && (
          <div
            className="rounded-lg border px-4 py-3 md:col-span-2"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface-secondary)',
            }}
          >
            <p
              className="text-sm"
              style={{
                color: 'var(--color-text-secondary)',
              }}
            >
              Total a ingresar
            </p>

            <p
              className="mt-1 text-lg font-semibold"
              style={{
                color: 'var(--color-text)',
              }}
            >
              {totalCount.toLocaleString('es-UY')}{' '}
              {totalCount === 1 ? 'unidad' : 'unidades'}
            </p>

            {displays > 0 && (
              <p
                className="mt-1 text-xs"
                style={{
                  color: 'var(--color-text-muted)',
                }}
              >
                {displays} × {selectedProduct.unitsPerDisplay}
                {looseUnits > 0 ? ` + ${looseUnits}` : ''}
              </p>
            )}
          </div>
        )}

        {/* CNT */}
        <div className="md:col-span-2">
          <label
            htmlFor="cntCode"
            className="mb-2 block text-sm font-medium"
            style={{
              color: 'var(--color-text)',
            }}
          >
            CNT
          </label>

          <input
            id="cntCode"
            name="cntCode"
            required
            disabled={isSaving}
            value={formData.cntCode}
            onChange={handleChange}
            placeholder="Escanear o ingresar CNT..."
            className={inputClass}
            style={inputStyle}
          />

          {formData.cntCode && selectedCNT && (
            <p
              className="mt-2 text-xs"
              style={{
                color:
                  selectedCNT.status === 'ACTIVO' &&
                  selectedCNT.locationType === 'EN_PUERTA'
                    ? 'var(--color-success)'
                    : 'var(--color-warning)',
              }}
            >
              {selectedCNT.status !== 'ACTIVO'
                ? 'CNT finalizado'
                : selectedCNT.locationType !== 'EN_PUERTA'
                  ? `CNT no disponible para recepción · ${selectedCNT.locationCode}`
                  : `CNT válido · ${selectedCNT.locationCode}`}
            </p>
          )}

          {formData.cntCode && !selectedCNT && (
            <p
              className="mt-2 text-xs"
              style={{
                color: 'var(--color-danger)',
              }}
            >
              No existe ningún CNT con ese código.
            </p>
          )}
        </div>

        {/* Información */}
        <div
          className="rounded-lg border px-4 py-3 md:col-span-2"
          style={{
            borderColor: 'var(--color-primary)',
            backgroundColor: 'var(--color-primary-light)',
          }}
        >
          <p
            className="text-sm font-medium"
            style={{
              color: 'var(--color-primary-dark)',
            }}
          >
            Ubicación inicial: En puerta
          </p>

          <p
            className="mt-1 text-xs"
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            El CNT deberá ubicarse posteriormente para quedar disponible.
          </p>
        </div>
      </form>
    </Modal>
  );
}
