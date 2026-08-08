export type LocationType = 'PICKING' | 'EN_PUERTA' | 'AVERIAS';

export interface InventoryRecord {
  id: number;
  productId: number;
  ubicationCode: string;
  ubicationType: LocationType;
  count: number;
  dueDate: string;
}
