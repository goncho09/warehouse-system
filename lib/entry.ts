type CNTStatus = 'ACTIVO' | 'FINALIZADO';

type LocationType = 'PICKING' | 'EN_PUERTA' | 'FLOTANTE' | 'AVERIAS';

type ExistingItem = {
  productId: number;
  lot: string;
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

export function hasCompatibleLot(
  items: ExistingItem[],
  productId: number,
  lot: string,
) {
  const existingItem = items.find((item) => item.productId === productId);

  if (!existingItem) {
    return true;
  }

  return existingItem.lot.trim().toLowerCase() === lot.trim().toLowerCase();
}

export function parseDueDate(value: string) {
  const dueDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(dueDate.getTime())) {
    return null;
  }

  return dueDate;
}
