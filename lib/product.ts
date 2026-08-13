export function normalizeProductText(value: string) {
  return value.trim();
}

export function isValidUnitsPerDisplay(value: number) {
  return Number.isInteger(value) && value > 0;
}

export function validateProductFields(data: {
  productId: string;
  barCode: string;
  description: string;
  unitsPerDisplay: number;
}) {
  const productId = normalizeProductText(data.productId);
  const barCode = normalizeProductText(data.barCode);
  const description = normalizeProductText(data.description);

  if (!productId) {
    throw new Error('El código del producto es obligatorio.');
  }

  if (!barCode) {
    throw new Error('El código de barras es obligatorio.');
  }

  if (!description) {
    throw new Error('La descripción es obligatoria.');
  }

  if (!isValidUnitsPerDisplay(data.unitsPerDisplay)) {
    throw new Error('Las unidades por display deben ser mayores a 0.');
  }

  return {
    productId,
    barCode,
    description,
    unitsPerDisplay: data.unitsPerDisplay,
  };
}
