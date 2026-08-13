type CNTStatus = 'ACTIVO' | 'FINALIZADO';

type LocationType = 'PICKING' | 'EN_PUERTA' | 'FLOTANTE' | 'AVERIAS';

type ExistingItem = {
  productId: number;
  lot: string;
  dueDate: Date;
};

export function isValidEntryCount(count: number) {
  return Number.isInteger(count) && count > 0;
}

export function canReceiveEntry(
  status: CNTStatus,
  locationType: LocationType | null,
) {
  return status === 'ACTIVO' && locationType === 'EN_PUERTA';
}

export function calculateTotalUnits(
  displays: number,
  looseUnits: number,
  unitsPerDisplay: number,
) {
  return displays * unitsPerDisplay + looseUnits;
}

export function isValidEntryQuantities(
  displays: number,
  looseUnits: number,
  unitsPerDisplay: number,
) {
  if (!Number.isInteger(displays) || displays < 0) {
    return false;
  }

  if (!Number.isInteger(looseUnits) || looseUnits < 0) {
    return false;
  }

  if (!Number.isInteger(unitsPerDisplay) || unitsPerDisplay < 1) {
    return false;
  }

  if (looseUnits >= unitsPerDisplay) {
    return false;
  }

  return calculateTotalUnits(displays, looseUnits, unitsPerDisplay) > 0;
}

export function isCompatibleCNTItem(
  items: ExistingItem[],
  productId: number,
  lot: string,
  dueDate: string,
) {
  const existingItem = items.find((item) => item.productId === productId);

  if (!existingItem) {
    return true;
  }

  const sameLot =
    existingItem.lot.trim().toLowerCase() === lot.trim().toLowerCase();

  const existingDueDate = existingItem.dueDate.toISOString().slice(0, 10);

  const sameDueDate = existingDueDate === dueDate;

  return sameLot && sameDueDate;
}

export function parseDueDate(value: string) {
  const dueDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(dueDate.getTime())) {
    return null;
  }

  return dueDate;
}
